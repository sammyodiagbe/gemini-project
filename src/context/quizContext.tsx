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
import { jsonDecode, jsonEncode } from "@/lib/utils";
import { ConversationType } from "@/lib/type";
import { useLoadingContext } from "./loadingStateContext";
import { quizSchema } from "@/gemini/responseSchemas";

type QuizContextType = {
  quizmode: boolean;
  setQuizmode: Dispatch<SetStateAction<boolean>>;
  startQuiz: Function;
  checkShortAnswer: Function;
  nextQuestion: Function;
  endSession: Function;
  sendMultipleChoiceResponse: Function;
};

const quizContext = createContext<QuizContextType>({
  quizmode: false,
  setQuizmode: () => {},
  startQuiz: () => {},
  checkShortAnswer: () => {},
  nextQuestion: () => {},
  endSession: () => {},
  sendMultipleChoiceResponse: () => {},
});

const QuizContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizmode, setQuizmode] = useState(false);
  const { chat, setConversation, conversation } = useConversationContext();
  const { busyAI, setBusyAI } = useLoadingContext();

  const startQuiz = async (
    multipleChoice: boolean,
    shortAnswer: boolean,
    difficulty: number
  ) => {
    setBusyAI(true);
    const schema = jsonEncode(quizSchema);
    const prompt = `Generate quiz question, only send a single question object each time, quiztype can be either multiple_choice if multiple_choice is true or short_answer if short_answer is true,
    either of the two if they are both true
    multiple_choice=${multipleChoice}, short_answer=${shortAnswer}, 
    
    difficulty level=${difficulty}, level is from 1 to 3 where 1 is the least difficult, answer must be included in options and try to keep the answers short and not too lengthy and always shuffle the options when question is multiple_choice. Follow schema. <JSONSchema>${schema}</JSONSchema>`;
    try {
      let jsonString = "";
      const result = await chat?.sendMessageStream(prompt);
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }
      console.log(jsonString);
      const quiz = jsonDecode(jsonString);
      const res: ConversationType = {
        quiz: quiz,
        message: quiz.message,
        type: "quiz",
        sender: "ai",
      };
      setQuizmode(true);
      setConversation((prev) => [...prev, res]);
    } catch (error: any) {
      console.log(error);
    }
    setBusyAI(false);
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

  const nextQuestion = async (prevConversation: ConversationType) => {
    setBusyAI(true);
    const prompt = "Next question please.";
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const json = jsonDecode(text!);
      console.log(json);
      const { quiz, response: aiRes } = json;
      const res: ConversationType = {
        type: "quiz",
        quiz: quiz,
        sender: "ai",
        message: aiRes,
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
    const prompt = `End session and give me insight create a breakdown that can be viewed visually on a chart, include a insights entry and include data that I can put on a chart like how well the user understands the documents, also use percentage to measure user understanding of a topic
      
      Recommendation topics should be short and concise please
      Your json response should look like this
      {
        response: ...,
        insights: {
          overall_understanding: ...,
          understanding_breakdowns: [
            { topic: ..., understanding: 40 (should of type number), explanation: ...},
             ....
          ],
          recommended_topics: [....]
        }
      }
      `;
    try {
      const result = await chat?.sendMessage(prompt);
      const response = await result?.response;
      const text = await response?.text();
      const json = jsonDecode(text!);
      const { response: res, insights } = json;
      console.log(json);
      const chatData: ConversationType = {
        type: "insights",
        insights,
        sender: "ai",
        message: res,
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
