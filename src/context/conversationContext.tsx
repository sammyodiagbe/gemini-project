"use client";
import {
  FC,
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import { Gemini as AI } from "@/gemini/gemini";
import { ChatSession, TextPart } from "@google/generative-ai";
import { geminiDocumentInitInstruction } from "@/lib/gemini_interactons";
import { createConversationObject, jsonDecode, processText } from "@/lib/utils";
import { ConversationType } from "@/lib/type";

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
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: null,
  setExtractedText: () => {},
  setInteractions: () => {},
  chatWithGemini: () => {},
  conversation: [],
  startQuizMode: () => {},
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

  const chatWithGemini = async (message: string) => {
    const obj = createConversationObject("chat", "user", message);
    const updateConvo = [...conversation];

    updateConvo.push(obj);
    setConversation(updateConvo);
    const initialText = processText(extractedText!);
    try {
      let chat;
      if (!chat) {
        chat = AI.startChat({
          history: [{ role: "user", parts: [initialText] }],
        });
      } else {
        chat = chat;
      }
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = await response.text();
      const decodejson = jsonDecode(text);
      const { response: res } = decodejson;
      const convoObj = createConversationObject("chat", "ai", res);
      const newConv = [...conversation];
      newConv.push(convoObj);
      setChat(chat);
      setConversation(newConv);
    } catch (error: any) {
      console.log("Something went wrong");
      console.log(error);
    }
  };

  const startQuizMode = async () => {
    const initialText = processText(extractedText!);
    const message = `Generate 10 quiz questions, but only send one at a time, each correct response is worth 10 points,
    user can decide to end the game at any point. Send back the first questions right away and make sure the questions are based off of the document that has been provided`;
    try {
      let chat;
      if (!chat) {
        chat = AI.startChat({
          history: [{ role: "user", parts: [initialText] }],
        });
      } else {
        chat = chat;
      }

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = await response.text();

      const jsonData = jsonDecode(text);
      console.log(jsonData);
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
