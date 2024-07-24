"use client";
import {
  ConversationType,
  QuizQuestionType,
  QuizSessionType,
  QuizType,
} from "@/lib/type";
import { FC } from "react";
import MultipleChoiceComponent from "./multipleChoiceComponent";
import ShortAnswerComponent from "./shortAnswerComponent";
import { useConversationContext } from "@/context/conversationContext";
import { useQuizContext } from "@/context/quizContext";

type QuizData = {
  conv: ConversationType;
  message: string;
  quiz: QuizSessionType;
};

const QuizMessageComponent: FC<QuizData> = ({ conv, quiz, message }) => {
  const { sessionCount } = useQuizContext();
  const { questions } = quiz;
  const { quiztype } = questions[sessionCount];
  if (quiztype === "multiple_choice") {
    return <MultipleChoiceComponent conv={conv!} />;
  }

  return <ShortAnswerComponent message={message} conv={conv} />;
};

export default QuizMessageComponent;
