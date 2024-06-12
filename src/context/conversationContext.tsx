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
import { ChatSession } from "@google/generative-ai";
import { createConversationObject, jsonDecode, processText } from "@/lib/utils";
import { ConversationType } from "@/lib/type";
import {
  geminiDocumentInitInstruction,
  generateFlashcardGemini,
  generateQuizGemini,
} from "@/lib/gemini_interactons";

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string | undefined | null;
  setExtractedText: Dispatch<SetStateAction<undefined | string>>;
  setInteractions: Dispatch<SetStateAction<interaction[]>>;
  chatWithGemini: Function;
  conversation: ConversationType[];
  startQuizMode: Function;
  nextQuestion: Function;
  getFlashCard: Function;
  setConversation: Dispatch<SetStateAction<ConversationType[]>>;
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: null,
  setExtractedText: () => {},
  setInteractions: () => {},
  chatWithGemini: () => {},
  conversation: [],
  startQuizMode: () => {},
  nextQuestion: () => {},
  getFlashCard: () => {},
  setConversation: () => {},
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [extractedText, setExtractedText] = useState<string>();
  const [chat, setChat] = useState<ChatSession>();
  const [conversation, setConversation] = useState<ConversationType[]>([]);

  useEffect(() => {
    if (extractedText) {
      const initMessage = geminiDocumentInitInstruction(extractedText);
      const initConversationText = processText(initMessage);
      let chat = AI.startChat({
        history: [{ role: "user", parts: [initConversationText] }],
      });

      setChat(chat);
    }
  }, [extractedText]);

  const chatWithGemini = async (message: string) => {
    const obj = createConversationObject("chat", "user", message);

    setConversation((prev) => [...prev, obj]);
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
        },
      ]);
    }
  };

  const startQuizMode = async () => {
    const message = generateQuizGemini();

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
        },
      ]);
    }
  };

  const nextQuestion = async () => {
    const message = "Next Question please, Don't repeat questions.";
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
        },
      ]);
    }
  };

  const getFlashCard = async () => {
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
        },
      ]);
    }
  };

  return (
    <conversationContext.Provider
      value={{
        interactions,
        extractedText,
        setExtractedText,
        setInteractions,
        chatWithGemini,
        conversation,
        startQuizMode,
        nextQuestion,
        getFlashCard,
        setConversation,
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
