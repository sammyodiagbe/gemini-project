"use client";
import {
  FC,
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { Gemini as AI } from "@/gemini/gemini";
import { ChatSession, InlineDataPart, TextPart } from "@google/generative-ai";
import {
  createConversationObject,
  errorMessage,
  focusInstruction,
  jsonDecode,
  jsonEncode,
  measurePerformance,
  processText,
  toastClass,
  toastStyle,
} from "@/lib/utils";
import { ConversationType, ImageDataType } from "@/lib/type";

import {
  generateFlashcardGemini,
  generateInitialPossibleInteractions,
  generateQuizGemini,
  generateTopics,
} from "@/lib/gemini_interactons";
import { useLoadingContext } from "./loadingStateContext";
import { useToastContext } from "./toastContext";
import {
  chatResponseSchema,
  flashcardSchema,
  quizSchema,
} from "../gemini/responseSchemas";
import { useToast } from "@/components/ui/use-toast";

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  chatWithGemini: Function;
  conversation: ConversationType[];
  getFlashCard: Function;
  setConversation: Dispatch<SetStateAction<ConversationType[]>>;
  chat: ChatSession | null;
  attemptQueryRetry: Function;
  gotData: boolean;
  updateDataState: Function;
  reset: Function;
  topics: string[];
  docType: string;
  focusTopics: string[];
  addTopicToFocus: Function;
  removeTopicFromFocus: Function;
  removeAllFocusTopics: Function;
  documentImagesData: ImageDataType[];
  initGemini: Function;
  username: string | null;
  updateUsername: Function;
  lockingTopic: string | null;
  errorGeneratingTopics: boolean;
  retryGeneratingTopics: Function;
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  chatWithGemini: () => {},
  conversation: [],
  getFlashCard: () => {},
  setConversation: () => {},
  attemptQueryRetry: () => {},
  chat: null,
  gotData: false,
  reset: () => {},
  updateDataState: () => {},
  topics: [],
  docType: "",
  focusTopics: [],
  addTopicToFocus: () => {},
  removeTopicFromFocus: () => {},
  removeAllFocusTopics: () => {},
  documentImagesData: [],
  initGemini: () => {},
  username: null,
  updateUsername: () => {},
  lockingTopic: null,
  errorGeneratingTopics: false,
  retryGeneratingTopics: () => {},
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const [gotData, setGotData] = useState<boolean>(false);
  const [documentImagesData, setDocumentImages] = useState<ImageDataType[]>([]);
  const { setBusyAI, busyAI } = useLoadingContext();
  const [topics, setTopics] = useState<string[]>([]);
  const [docType, setDocType] = useState<string>("");
  const { setWorkingOnPdf } = useLoadingContext();
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const { toast } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const [lockingTopic, setLockingTopic] = useState<string | null>(null);
  const [errorGeneratingTopics, setErrorGeneratingTopics] = useState(false);

  const initGemini = async (fileURL: string) => {
    setWorkingOnPdf(true);
    try {
      // for (let index = 0; index < documentImagesData?.length; index++) {
      //   const inlineImage = processImage(documentImagesData[index]);
      //   history.push({ role: "user", parts: [inlineImage] });
      // }
      // const initMessage = geminiDocumentInitInstruction(extractedText!);
      // const initConversationText = processText(initMessage);

      const initPDf: InlineDataPart = {
        inlineData: {
          mimeType: "application/pdf",
          data: fileURL.split(",")[1],
        },
      };
      const textInstruction: TextPart = {
        text: "You are an amazing study buddy,your name is naala, I have added a pdf file with you, you would help me understand the contents better",
      };
      let chat = await AI.startChat({
        history: [{ role: "user", parts: [initPDf, textInstruction] }],
      });

      await generatePossibleInteractions(chat);
      // get all the possible topics from the document so a user can lock onto a topic
      await generatePossibleTopics(chat);
      setChat(chat);
      setWorkingOnPdf(false);
    } catch (error: any) {
      toast({
        description: errorMessage(),
      });
    }
  };

  const generatePossibleInteractions = async (chat: ChatSession) => {
    const message = generateInitialPossibleInteractions();
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(message);
      for await (let chunk of result.stream) {
        jsonString += chunk.text();
      }

      const { interactions, type } = jsonDecode(jsonString);
      setInteractions((prev) => interactions);
      console.log(interactions);
      setDocType(type);
    } catch (error: any) {
      console.log(error);
    }
  };

  const generatePossibleTopics = async (chat: ChatSession) => {
    const prompt = generateTopics();
    let resText = "";
    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (const chunk of result.stream) {
        resText += chunk?.text();
      }
      const { topics } = jsonDecode(resText);
      console.log(topics);
      setTopics(topics);
      setErrorGeneratingTopics(false);
    } catch (error: any) {
      setErrorGeneratingTopics(true);
      toast({
        description: errorMessage(),
        style: { zIndex: 2000 },
      });
    }
  };

  const addTopicToFocus = async (text: string) => {
    const topics = [...focusTopics, text];
    setLockingTopic(text);
    const prompt = `This are the topics i would like you focus on, quizes, conversation, flashcards should be based on this topics
    topics=${topics.join(", ")}`;
    let jsonString = "";

    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text;
      }
      toast({
        description: `${text} has been added successfully`,
      });
      setLockingTopic(null);
    } catch (error: any) {
      toast({
        description: errorMessage(),
        style: toastStyle,
        className: toastClass,
      });
      setLockingTopic(null);
    }
    setFocusTopics((prev) => topics);
  };

  const removeTopicFromFocus = async (topic: string) => {
    setLockingTopic(topic);
    const topics = [...focusTopics.filter((t) => t === topic)];
    const prompt = topics.length
      ? `This are the topics i would like you focus on, quizes, conversation, flashcards should be based on this topics
    topics=${topics.join(", ")}`
      : "Focus is now on all topics";
    let jsonString = "";

    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text;
      }
      toast({
        description: `${topic} was removed successfully`,
      });
      setFocusTopics((prev) => prev.filter((t) => t !== topic));
      setLockingTopic(null);
    } catch (error: any) {
      setLockingTopic(null);
      toast({
        description: errorMessage(),
        style: toastStyle,
        className: toastClass,
      });
    }
  };

  const removeAllFocusTopics = async () => {
    const prompt = "Focus is now on all topics";
    let jsonString = "";

    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text;
      }
      toast({
        description: `We are now focusing on all topics`,
      });

      setFocusTopics((prev) => []);
    } catch (error: any) {
      toast({
        description: errorMessage(),
        style: toastStyle,
        className: toastClass,
      });
    }
  };

  const updateDataState = (state: boolean) => {
    setGotData(state);
  };

  const chatWithGemini = async (message: string) => {
    console.time("chat");
    const obj = createConversationObject("chat", "user", message);
    setConversation((prev) => [...prev, obj]);
    setBusyAI(true);
    const schemaType = jsonEncode(chatResponseSchema);
    const focus = focusInstruction(focusTopics);
    const start = performance.now();

    const prompt = ` ${message},   ${focus}. Follow this JSON schema please.<JSONSchema>${schemaType}</JSONSchema>, if the user is only having a casual conversation with you, tell them you want to talk about the document content, if a user is asking to be quized tell them they can start a quiz session by clicking on the quiz button, if they ask for a flashcard, ask them to click on the flashcard button to get a flashcard, same applies for notes too`;

    let jsonText: string = "";
    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonText += chunk.text();
      }
      // const data: string[] = jsonText.match("({.*})") as string[];
      // console.log(data);
      // let stripped = data[0].replace('"s*"', '", "');
      // console.log(stripped);
      const res = jsonDecode(jsonText);
      console.log(res);
      let aiResponse: ConversationType = {
        message: res,
        sender: "ai",
        type: "chat",
        time: measurePerformance(start),
      };

      // console.log(decodejson);
      // const { response: res } = decodejson;
      // console.log(res);
      // const convoObj: ConversationType = {
      //   type: "chat",
      //   sender: "ai",
      //   message: res,
      // };

      setConversation((prev) => [...prev, aiResponse]);
      console.timeEnd("chat");
    } catch (error: any) {
      console.log(error);
      toast({
        description: errorMessage(),
        style: toastStyle,
        className: toastClass,
      });
    }
    setBusyAI(false);
  };

  const reset = () => {
    setChat(null);
    setConversation([]);
    setDocumentImages([]);
    setGotData(false);
    setFocusTopics([]);
    setUsername(null);
  };

  const getFlashCard = async () => {
    setBusyAI(true);
    const start = performance.now();
    const message = generateFlashcardGemini();
    const schema = jsonEncode(flashcardSchema);
    const focus = focusInstruction(focusTopics);
    const prompt = `Generate a single flashcard based on the document, keep question and answers short and simple. ${focus}. Follow JSON schema.<JSONSchema>${schema}</JSONSchema>`;
    let jsonString = "";
    try {
      const requestFlashCard = await chat?.sendMessageStream(prompt);
      for await (let chunk of requestFlashCard?.stream!) {
        jsonString += chunk.text();
      }

      const flashcard = jsonDecode(jsonString!);

      const chatMessage: ConversationType = {
        message: flashcard.message,
        flashcard,
        type: "flashcard",
        sender: "ai",
        time: measurePerformance(start),
      };

      setConversation((prev) => [...prev, chatMessage]);
    } catch (error: any) {
      toast({
        description: "Oopsie that didn't seem to work, please try again",
        style: toastStyle,
        className: toastClass,
      });
    }
    setBusyAI(false);
  };

  const attemptQueryRetry = async (retryQuery: string, errorOrigin: string) => {
    setBusyAI(true);
    try {
      const result = await chat?.sendMessage(retryQuery);
      const response = await result?.response;
      const text = response?.text();

      const json = jsonDecode(text!);
      console.log(json);
      setConversation((prev) =>
        [
          ...prev,
          { ...json, message: json.response, type: errorOrigin },
        ].filter((entry) => entry.type != "errror")
      );
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: retryQuery,
          type: "error",
          errorOrigin: "flashcard",
        },
      ]);
    }
    setBusyAI(false);
  };

  // update image data

  const updateName = (username: string) => {
    console.log(username);
    console.log("working on this");
    setUsername(username);
  };

  const retryGeneratingTopics = async () => {
    await generatePossibleTopics(chat!);
  };
  return (
    <conversationContext.Provider
      value={{
        initGemini,
        interactions,
        chatWithGemini,
        conversation,
        getFlashCard,
        setConversation,
        chat,
        attemptQueryRetry,
        gotData,
        updateDataState,
        reset,
        topics,
        docType,
        addTopicToFocus,
        focusTopics,
        removeTopicFromFocus,
        removeAllFocusTopics,
        documentImagesData,
        username,
        updateUsername: updateName,
        lockingTopic,
        errorGeneratingTopics,
        retryGeneratingTopics,
      }}
    >
      {children}
    </conversationContext.Provider>
  );
};

export const useConversationContext = () => {
  return useContext(conversationContext);
};

export default ConversationContextProvider;
