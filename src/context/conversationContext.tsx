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

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string | undefined | null;
  setExtractedText: Dispatch<SetStateAction<undefined | string>>;
  setInteractions: Dispatch<SetStateAction<interaction[]>>;
  chatWithGemini: Function;
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: null,
  setExtractedText: () => {},
  setInteractions: () => {},
  chatWithGemini: () => {},
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

  const chatWithGemini = async (message: string) => {
    const initialText: TextPart = {
      text: geminiDocumentInitInstruction(extractedText!),
    };
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

      console.log(response.text());
      setChat(chat);
    } catch (error: any) {
      console.log("Something went wrong");
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
