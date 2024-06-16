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
import { jsonDecode } from "@/lib/utils";
import { ConversationType } from "@/lib/type";

type QuizContextType = {
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
  startQuiz: Function;
  checkShortAnswer: Function;
  nextQuestion: Function;
  endSession: Function;
};

const quizContext = createContext<QuizContextType>({
  quizmode: false,
  setQuizmode: () => {},
  startQuiz: () => {},
  checkShortAnswer: () => {},
  nextQuestion: () => {},
  endSession: () => {},
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  const { chat, setConversation } = useConversationContext();

  const startQuiz = async (multipleChoice: boolean, shortAnswer: boolean) => {
    const prompt = beginQuizmode(multipleChoice, shortAnswer);
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const responseData = jsonDecode(text!);
      const { quiz, response: aiRes } = responseData;
      const res: ConversationType = {
        type: "quiz",
        quiz: quiz,
        sender: "ai",
        message: aiRes,
      };
      setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const checkShortAnswer = async (
    userAnswer: string,
    aiAnswer: string,
    question: string
  ) => {
    const prompt = `User has sent back there answer to the shortquestion quiz, now the focus and main purpose of this software is understanding. So Analyze the user response and the question, plus actual answer and determine if they understand what the question is about, then give appropriate response based on your analysis, once the main purpose of this app is to focus on Understanding and not being right. Your response should not have no questions.

    Make you analysis short and concise and no questions please
    Make your responses very fun and goofy with emojis
    your response here should only include the response entry { response: ....}
    
    question=${question}
    userAnswer=${userAnswer}
    yourGeneratedAnswer=${aiAnswer}
    `;
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const json = jsonDecode(text!);
      return json.response;
    } catch (error: any) {
      console.log(error);
    }
    return "";
  };

  const nextQuestion = async () => {
    const prompt = "Next question please.";
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const json = jsonDecode(text!);
      const { quiz, response: aiRes } = json;
      const res: ConversationType = {
        type: "quiz",
        quiz: quiz,
        sender: "ai",
        message: aiRes,
      };
      setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const endSession = async () => {
    const prompt =
      "End session and give me insight create a breakdown that can be viewed visually on a chart, include a insights entry and include data that I can put on a chart like how well the user understands the documents, also use percentage to measure user understanding of a topic";
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const json = jsonDecode(text!);

      console.log(json);
      // const { quiz, response: aiRes } = json;
      // const res: ConversationType = {
      //   type: "quiz",
      //   quiz: quiz,
      //   sender: "ai",
      //   message: aiRes,
      // };
      // setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <quizContext.Provider
      value={{
        quizmode,
        setQuizmode,
        startQuiz,
        checkShortAnswer,
        nextQuestion,
        endSession,
      }}
    >
      {children}
    </quizContext.Provider>
  );
};

export const useQuizContext = () => {
  return useContext(quizContext);
};

export default QuizContextProvider;
