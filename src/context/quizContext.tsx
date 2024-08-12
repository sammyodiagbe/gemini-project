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
import {
  errorMessage,
  jsonDecode,
  jsonEncode,
  measurePerformance,
} from "@/lib/utils";
import { ConversationType, QuizSessionType } from "@/lib/type";
import { useLoadingContext } from "./loadingStateContext";
import { useToast } from "@/components/ui/use-toast";
import {
  checkShortanswerResponse,
  downloadQuiz,
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
  generateQuestions: Function;
  busyAI: boolean;
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
  generateQuestions: () => {},
  busyAI: false,
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  const { chat, setConversation, conversation } = useConversationContext();
  const { busyAI, setBusyAI } = useLoadingContext();
  const [quizSession, setQuizSession] = useState<QuizSessionType[]>([]);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const { toast } = useToast();

  const startQuiz = async (
    multipleChoice: boolean,
    shortAnswer: boolean,
    difficulty: number
  ) => {
    setBusyAI(true);
    const prompt = generateQuizGemini(multipleChoice, shortAnswer, difficulty);
    let jsonString = "";
    const start = performance.now();
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
        time: measurePerformance(start),
      };
      setQuizmode(true);
      setSessionCount((prev) => prev + 1);
      setQuizSession((prev) => [...prev, quiz]);
      setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      toast({
        description: errorMessage(),
      });
    }
    setBusyAI(false);
  };

  const generateQuestions = async (
    multipleChoice: boolean,
    shortAnswer: boolean,
    difficulty: number
  ) => {
    let prompt = generateQuizGemini(multipleChoice, shortAnswer, difficulty);
    const schema = jsonEncode(downloadQuiz);
    let jsonString = "";
    const start = performance.now();
    try {
      const result = await chat?.sendMessageStream(prompt);

      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const quizdata = jsonDecode(jsonString);
      //

      return quizdata;
    } catch (error: any) {
      toast({
        description: errorMessage(),
      });
    }
    setBusyAI(false);
  };

  const checkShortAnswer = async (
    userAnswer: string,
    answer: string,
    question: string
  ) => {
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
      toast({
        description: errorMessage(),
      });
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
      toast({
        description: errorMessage(),
      });
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
      toast({
        description: errorMessage(),
      });
    }
  };

  const endSession = async (quizData: string) => {
    const schema = jsonEncode(insightSchema);
    const start = performance.now();

    console.log(quizData);
    const prompt = `
      Generate feedback and insights on how well I did during the session,
      be motivational and friendly and add some goofiness with emojis
      Quiz data from user <QuizData>${quizData}</QuizData>
      Also remember to put previous related data into consideration when breaking down how well they did
      Follow Schema.<JSONSchema>${schema}</JSONSchema>
      `;
    let jsonString = "";
    try {
      const result = await chat?.sendMessageStream(prompt);

      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      const insights = jsonDecode(jsonString);
      console.log(insights);
      const chatData: ConversationType = {
        type: "insights",
        insights,
        sender: "ai",
        message: insights.message,
        time: measurePerformance(start),
      };
      setQuizmode(false);
      setConversation((prev) => [...prev, chatData]);
    } catch (error: any) {
      setQuizmode(false);
      toast({
        description: errorMessage(),
      });
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
        generateQuestions,
        busyAI,
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
