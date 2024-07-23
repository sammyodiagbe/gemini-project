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
  focusInstruction,
  jsonDecode,
  jsonEncode,
  processText,
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

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string[];
  setExtractedText: Dispatch<SetStateAction<string[]>>;
  chatWithGemini: Function;
  conversation: ConversationType[];
  startQuizMode: Function;
  nextQuestion: Function;
  getFlashCard: Function;
  setConversation: Dispatch<SetStateAction<ConversationType[]>>;
  chat: ChatSession | null;
  attemptQueryRetry: Function;
  gotData: boolean;
  updateDataState: Function;
  updateImagesData: Function;
  updateExtractedText: Function;
  reset: Function;
  topics: string[];
  docType: string;
  focusTopics: string[];
  addTopicToFocus: Function;
  removeTopicFromFocus: Function;
  removeAllFocusTopics: Function;
  documentImagesData: ImageDataType[];
  initGemini: Function;
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: [],
  setExtractedText: () => {},
  chatWithGemini: () => {},
  conversation: [],
  startQuizMode: () => {},
  nextQuestion: () => {},
  getFlashCard: () => {},
  setConversation: () => {},
  attemptQueryRetry: () => {},
  chat: null,
  gotData: false,
  reset: () => {},
  updateDataState: () => {},
  updateImagesData: () => {},
  updateExtractedText: () => {},
  topics: [],
  docType: "",
  focusTopics: [],
  addTopicToFocus: () => {},
  removeTopicFromFocus: () => {},
  removeAllFocusTopics: () => {},
  documentImagesData: [],
  initGemini: () => {},
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const [gotData, setGotData] = useState<boolean>(false);
  const [documentImagesData, setDocumentImages] = useState<ImageDataType[]>([]);
  const { setBusyAI, busyAI } = useLoadingContext();
  const [topics, setTopics] = useState<string[]>([]);
  const [docType, setDocType] = useState<string>("");
  const { setWorkingOnPdf } = useLoadingContext();
  const [focusTopics, setFocusTopics] = useState<string[]>([]);

  const initGemini = async (fileURL: string) => {
    setWorkingOnPdf(true);
    try {
      // for (let index = 0; index < documentImagesData?.length; index++) {
      //   const inlineImage = processImage(documentImagesData[index]);
      //   history.push({ role: "user", parts: [inlineImage] });
      // }
      // const initMessage = geminiDocumentInitInstruction(extractedText!);
      // const initConversationText = processText(initMessage);
      console.log(fileURL.split(",")[0]);
      console.log(fileURL.split(",")[1].length);
      console.log(fileURL.split(",")[1].trim().length);
      console.log("================");

      const initPDf: InlineDataPart = {
        inlineData: {
          mimeType: "application/pdf",
          data: fileURL.split(",")[1],
        },
      };
      const textInstruction: TextPart = {
        text: "You are an amazing study buddy, I have added a pdf file with you, you would help me understand the contents better",
      };
      let chat = await AI.startChat({
        history: [{ role: "user", parts: [initPDf, textInstruction] }],
      });

      console.log(await chat.requestOptions);

      await generatePossibleInteractions(chat);
      // get all the possible topics from the document so a user can lock onto a topic
      await generatePossibleTopics(chat);
      setChat(chat);
      setWorkingOnPdf(false);
    } catch (error: any) {
      console.log(error);
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
    } catch (error: any) {
      console.log(error);
    }
  };

  const addTopicToFocus = async (text: string) => {
    setFocusTopics((prev) => [...prev, text]);
  };

  const removeTopicFromFocus = async (topic: string) => {
    setFocusTopics((prev) => prev.filter((t) => t !== topic));
  };

  const removeAllFocusTopics = () => {
    setFocusTopics((prev) => []);
  };

  const updateDataState = (state: boolean) => {
    setGotData(state);
  };

  const chatWithGemini = async (message: string) => {
    const obj = createConversationObject("chat", "user", message);
    setConversation((prev) => [...prev, obj]);
    setBusyAI(true);
    const schemaType = jsonEncode(chatResponseSchema);
    const focus = focusInstruction(focusTopics);

    const prompt = `${focus}. Follow JSON schema.<JSONSchema>${schemaType}</JSONSchema>, ${message}, if the user is only having a casual conversation with you`;

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
      const response = jsonDecode(jsonText);
      let aiResponse: ConversationType = {
        message: response,
        sender: "ai",
        type: "chat",
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
    } catch (error: any) {
      console.log(error);
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "chat",
        },
      ]);
    }
    setBusyAI(false);
  };

  const reset = () => {
    setChat(null);
    setExtractedText([]);
    setDocumentImages([]);
    setGotData(false);
    setFocusTopics([]);
  };

  const startQuizMode = async () => {
    setBusyAI(true);
    const schema = jsonEncode(quizSchema);
    const prompt = `Generate quiz question, only send a single question object each time, quiztype can be either multiple_choice or short_answer, Follow schema.<JSONSchema>${schema}</JSONSchema>`;
    let jsonString = "";
    try {
      const response = await chat?.sendMessageStream(prompt);
      for await (let chunk of response?.stream!) {
        jsonString += chunk.text();
      }
      const jsonData = jsonDecode(jsonString!);
      console.log(jsonData);
      const { response: res, quiz } = jsonData;
      const convoobj = createConversationObject("quiz", "ai", res, quiz);
      setConversation((prev) => [...prev, convoobj]);
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: "message",
          type: "error",
          errorOrigin: "quiz",
        },
      ]);
    }
    setBusyAI(false);
  };

  const nextQuestion = async () => {
    const message = "Next Question please, Don't repeat questions.";
    setBusyAI(true);
    let jsonString = "";
    try {
      const response = await chat?.sendMessageStream(message);
      for await (let chunk of response?.stream!) {
        jsonString += chunk.text();
      }
      const { response: res, quiz } = jsonDecode(jsonString!);
      const obj = createConversationObject("quiz", "ai", res, quiz);
      setConversation((prev) => [...prev, obj]);
    } catch (error: any) {
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "quiz",
        },
      ]);
    }
    setBusyAI(false);
  };

  const getFlashCard = async () => {
    setBusyAI(true);
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
      };

      setConversation((prev) => [...prev, chatMessage]);
    } catch (error: any) {
      console.log(error);
      setConversation((prev) => [
        ...conversation,
        {
          sender: "system",
          message: "Something went wrong, please try again",
          retryQuery: message,
          type: "error",
          errorOrigin: "flashcard",
        },
      ]);
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
  const updateImagesData = (images: ImageDataType[]) => {
    console.log(images);
    setDocumentImages(images);
  };

  const updateExtractedText = (data: string[]) => {
    setExtractedText(data);
  };
  return (
    <conversationContext.Provider
      value={{
        initGemini,
        interactions,
        extractedText,
        setExtractedText,
        chatWithGemini,
        conversation,
        startQuizMode,
        nextQuestion,
        getFlashCard,
        setConversation,
        chat,
        attemptQueryRetry,
        gotData,
        updateDataState,
        updateImagesData,
        updateExtractedText,
        reset,
        topics,
        docType,
        addTopicToFocus,
        focusTopics,
        removeTopicFromFocus,
        removeAllFocusTopics,
        documentImagesData,
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
