"use client";
import {
  FC,
  useContext,
  createContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";

type interaction = {
  text: string;
};

type ContextType = {
  interactions: interaction[];
  extractedText: string | undefined | null;
  setExtractedText: Dispatch<SetStateAction<undefined | string>> | null;
  setInteractions: Dispatch<SetStateAction<interaction[]>>;
};

const conversationContext = createContext<ContextType>({
  interactions: [],
  extractedText: undefined,
  setExtractedText: null,
  setInteractions: () => {},
});

type ConversationContextType = {
  children: React.ReactNode;
};

const ConversationContextProvider: FC<ConversationContextType> = ({
  children,
}) => {
  const [interactions, setInteractions] = useState<interaction[]>([]);
  const [extractedText, setExtractedText] = useState<string>();
  return (
    <conversationContext.Provider
      value={{ interactions, extractedText, setExtractedText, setInteractions }}
    >
      {children}
    </conversationContext.Provider>
  );
};

export const useConversationContext = () => {
  return useContext(conversationContext);
};

export default ConversationContextProvider;
