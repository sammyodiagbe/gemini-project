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
import { ChatSession, Content, TextPart } from "@google/generative-ai";
import {
  createConversationObject,
  jsonDecode,
  processImage,
  processText,
} from "@/lib/utils";
import { ConversationType, ImageDataType } from "@/lib/type";
import {
  geminiDocumentInitInstruction,
  generateFlashcardGemini,
  generateInitialPossibleInteractions,
  generateQuizGemini,
  generateTopics,
} from "@/lib/gemini_interactons";
import { useLoadingContext } from "./loadingStateContext";

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string | undefined | null;
  setExtractedText: Dispatch<SetStateAction<undefined | string>>;
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
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: null,
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
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [extractedText, setExtractedText] = useState<string>();
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [conversation, setConversation] = useState<ConversationType[]>([]);
  const [gotData, setGotData] = useState<boolean>(false);
  const [documentImagesData, setDocumentImages] = useState<ImageDataType[]>([]);
  const { setBusyAI, busyAI } = useLoadingContext();
  const [topics, setTopics] = useState<string[]>([]);
  const [docType, setDocType] = useState<string>("");
  const { setWorkingOnPdf } = useLoadingContext();

  useEffect(() => {
    if (gotData) {
      initGemini();
    }
  }, [gotData]);

  const initGemini = async () => {
    setWorkingOnPdf(true);
    try {
      // for (let index = 0; index < documentImagesData?.length; index++) {
      //   const inlineImage = processImage(documentImagesData[index]);
      //   history.push({ role: "user", parts: [inlineImage] });
      // }
      const initMessage = geminiDocumentInitInstruction(extractedText!);
      const initConversationText = processText(initMessage);

      let chat = await AI.startChat({
        history: [
          // {
          //   role: "user",
          //   parts: [
          //     {
          //       inlineData: {
          //         mimeType: "image/png",
          //         data: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAtCAYAAACXm/ozAAAAF0lEQVR4nGNgGAWjYBSMglEwCkYBUQAABzUAAfWEpx8AAAAASUVORK5CYII=",
          //       },
          //     },
          //   ],
          // },

          {
            role: "user",
            parts: [initConversationText],
          },
        ],
      });
      await generatePossibleInteractions(chat, extractedText!);
      // get all the possible topics from the document so a user can lock onto a topic
      await generatePossibleTopics(chat);
      setChat(chat);
      setWorkingOnPdf(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const generatePossibleInteractions = async (
    chat: ChatSession,
    text: string
  ) => {
    const message = generateInitialPossibleInteractions(text);
    try {
      const result = await chat?.sendMessage(message);
      const response = await result.response;
      const rawjson = response.text();
      const { interactions, type } = jsonDecode(rawjson);
      setInteractions((prev) => interactions);
      setDocType(type);
    } catch (error: any) {
      console.log(error);
    }
  };

  const generatePossibleTopics = async (chat: ChatSession) => {
    const prompt = generateTopics();
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result.response;
      const rawjson = response.text();
      const { topics } = jsonDecode(rawjson);
      setTopics(topics);
    } catch (error: any) {
      console.log(error);
    }
  };

  const updateDataState = (state: boolean) => {
    setGotData(state);
  };

  const chatWithGemini = async (message: string) => {
    const obj = createConversationObject("chat", "user", message);
    setConversation((prev) => [...prev, obj]);
    setBusyAI(true);

    try {
      const result = await chat?.sendMessage(message);
      const response = await result?.response;
      const text = await response?.text();
      const decodejson = jsonDecode(text!);
      const { response: res } = decodejson;
      const convoObj: ConversationType = {
        type: "chat",
        sender: "ai",
        message: res,
      };

      setConversation((prev) => [...prev, convoObj]);
    } catch (error: any) {
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
    setExtractedText("");
    setDocumentImages([]);
    setGotData(false);
  };

  const startQuizMode = async () => {
    const message = generateQuizGemini();
    setBusyAI(true);
    try {
      const result = await chat?.sendMessage(message);
      const response = await result?.response;
      const text = await response?.text();

      const jsonData = jsonDecode(text!);
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
          retryQuery: message,
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
    try {
      const sendMessage = await chat?.sendMessage(message);
      const response = sendMessage?.response;
      const rawjson = response?.text();
      const { response: res, quiz } = jsonDecode(rawjson!);
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
    try {
      const requestFlashCard = await chat?.sendMessage(message);
      const response = requestFlashCard?.response;
      const rawJson = response?.text();
      const { response: res, flashcard } = jsonDecode(rawJson!);
      const chatMessage: ConversationType = {
        message: res,
        flashcard,
        type: "flashcard",
        sender: "ai",
      };

      setConversation((prev) => [...prev, chatMessage]);
    } catch (error: any) {
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

  const updateExtractedText = (text: string) => {
    setExtractedText(text);
  };
  return (
    <conversationContext.Provider
      value={{
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
