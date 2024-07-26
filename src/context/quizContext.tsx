"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useConversationContext } from "./conversationContext";
import { generateQuizGemini } from "@/lib/gemini_interactons";
import { jsonDecode, jsonEncode } from "@/lib/utils";
import { ConversationType, QuizSessionType } from "@/lib/type";
import { useLoadingContext } from "./loadingStateContext";
import {
  checkShortanswerResponse,
  insightSchema,
  quizSchema,
} from "@/gemini/responseSchemas";

type QuizContextType = {
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
  startQuiz: Function;
  checkShortAnswer: Function;
  nextQuestion: Function;
  endSession: Function;
  sendMultipleChoiceResponse: Function;
  quizSession: QuizSessionType[];
  sessionCount: number;
};

const quizContext = createContext<QuizContextType>({
  quizmode: false,
  setQuizmode: () => {},
  startQuiz: () => {},
  checkShortAnswer: () => {},
  nextQuestion: () => {},
  endSession: () => {},
  sendMultipleChoiceResponse: () => {},
  quizSession: [],
  sessionCount: 0,
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  const { chat, setConversation, conversation } = useConversationContext();
  const { busyAI, setBusyAI } = useLoadingContext();
  const [quizSession, setQuizSession] = useState<QuizSessionType[]>([]);
  const [sessionCount, setSessionCount] = useState<number>(0);

  const startQuiz = async (
    multipleChoice: boolean,
    shortAnswer: boolean,
    difficulty: number
  ) => {
    setBusyAI(true);
    const prompt = generateQuizGemini(multipleChoice, shortAnswer, difficulty);
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(prompt);

      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const quiz: QuizSessionType = jsonDecode(jsonString);
      const res: ConversationType = {
        quiz: quiz.questions,
        message: quiz.message,
        type: "quiz",
        sender: "ai",
      };
      setQuizmode(true);
      setSessionCount((prev) => prev + 1);
      setQuizSession((prev) => [...prev, quiz]);
      setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      console.log(error);
    }
    setBusyAI(false);
  };

  const checkShortAnswer = async (
    userAnswer: string,
    answer: string,
    question: string
  ) => {
    console.log(userAnswer);
    console.log(answer);
    console.log(question);
    const schema = jsonEncode(checkShortanswerResponse);
    const prompt = `
    Compare response from user and see if they have an understanding of the question remember to be supportive. This is more about understanding than being right, i have provided the question, user answer and answer below

    question=${question}
    userAnswer=${userAnswer}
    answer=${answer}

    Follow JSON Schema.<JSONSchema>${schema}</JsonSchema>
    
    
    `;
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(prompt);

      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const { message } = jsonDecode(jsonString!);

      return message;
    } catch (error: any) {
      console.log(error);
    }
    return "";
  };

  const nextQuestion = async (prevConversation: ConversationType) => {
    setBusyAI(true);
    const schema = jsonEncode(quizSchema);
    const prompt = `Send next quiz question please, and this is not a recitation Follow Schema. <JSONSchema>${schema}</JSONSchema>`;
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const quiz = jsonDecode(jsonString);
      const res: ConversationType = {
        type: "quiz",
        quiz: quiz,
        sender: "ai",
        message: quiz.message,
      };
      setConversation((prev) =>
        prev.filter((convo) => convo !== prevConversation)
      );
      setTimeout(() => {
        setConversation((prev) => [...prev, res]);
      }, 100);
    } catch (error: any) {
      console.log(error);
    }
    setBusyAI(false);
  };

  const sendMultipleChoiceResponse = async (message: string) => {
    const prompt = `User has sent back their response 
    just keep track of this response, 


      ${message}
      you don't need need to send back a quiz object in your response, because user has to click on next question to get the next question, 
    `;
    try {
      const result = await chat?.sendMessage(prompt);
      const response = result?.response;
      const text = response?.text();
      console.log(text);
      const { response: res } = jsonDecode(text!);
      console.log(res);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const endSession = async () => {
    const schema = jsonEncode(insightSchema);
    const prompt = `
      Generate feedback and insights on how well I did during the session,
      be motivational and friendly and add some goofiness with emojis
      Follow Schema.<JSONSchema>${schema}</JSONSchema>
      `;
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(prompt);

      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const insights = jsonDecode(jsonString);
      const chatData: ConversationType = {
        type: "insights",
        insights,
        sender: "ai",
        message: insights.message,
      };
      setQuizmode(false);
      setConversation((prev) => [...prev, chatData]);
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
        sendMultipleChoiceResponse,
        quizSession,
        sessionCount,
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
