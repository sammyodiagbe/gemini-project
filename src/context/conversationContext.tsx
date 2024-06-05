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
import { ChatSession, GoogleGenerativeAIError } from "@google/generative-ai";
import { createConversationObject, jsonDecode, processText } from "@/lib/utils";
import { ConversationType } from "@/lib/type";
import {
  geminiDocumentInitInstruction,
  generateFlashcardGemini,
  generateInitialPossibleInteractions,
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
    const updateConvo = [...conversation];

    updateConvo.push(obj);
    setConversation(updateConvo);
    try {
      console.log(extractedText);
      const result = await chat?.sendMessage(message);
      const response = await result?.response;
      const text = await response?.text();
      const decodejson = jsonDecode(text!);
      const { response: res } = decodejson;
      const convoObj = createConversationObject("chat", "ai", res);
      const newConv = [...conversation];
      newConv.push(convoObj);
      setConversation(newConv);
    } catch (error: any) {
      console.log("Something went wrong");
      console.log(error);
    }
  };

  const startQuizMode = async () => {
    const message = generateQuizGemini();

    try {
      const result = await chat?.sendMessage(message);
      const response = await result?.response;
      const text = await response?.text();

      const jsonData = jsonDecode(text!);
      const { response: res, quiz } = jsonData;
      const convoobj = createConversationObject("quiz", "ai", res, quiz);
      const newConv = [...conversation];
      newConv.push(convoobj);
      setConversation(newConv);
    } catch (error: any) {
      console.log(error);
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

      const newConv = [...conversation];
      newConv.push(obj);
      setConversation(newConv);
    } catch (error: any) {
      console.log(error);
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
      const newConv = [...conversation];
      newConv.push(chatMessage);
      setConversation(newConv);
    } catch (error: any) {
      console.log(error);
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
