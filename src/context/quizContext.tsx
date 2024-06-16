"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useConversationContext } from "./conversationContext";
import { beginQuizmode } from "@/lib/gemini_interactons";

type QuizContextType = {
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
  startQuiz: Function;
};

const quizContext = createContext<QuizContextType>({
  quizmode: false,
  setQuizmode: () => {},
  startQuiz: () => {},
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  const { chat } = useConversationContext();

  const startQuiz = async (multipleChoice: boolean, shortAnswer: boolean) => {
    const prompt = beginQuizmode(multipleChoice, shortAnswer);
    console.log();
    try {
      const result = await chat?.sendMessage(prompt);
      console.log(result);
      const response = await result?.response;
      const text = await response?.text();
      console.log(text);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <quizContext.Provider value={{ quizmode, setQuizmode, startQuiz }}>
      {children}
    </quizContext.Provider>
  );
};

export const useQuizContext = () => {
  return useContext(quizContext);
};

export default QuizContextProvider;
