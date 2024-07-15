"use client";
import { ConversationType, QuizType } from "@/lib/type";
import { FC } from "react";
import MultipleChoiceComponent from "./multipleChoiceComponent";
import ShortAnswerComponent from "./shortAnswerComponent";

type QuizData = {
  conv: ConversationType;
  message: string;
  quiz: QuizType;
};

const QuizMessageComponent: FC<QuizData> = ({ conv, quiz, message }) => {
  const { quiztype } = quiz;
  console.log("re-render");
  if (quiztype === "multiple_choice") {
    return <MultipleChoiceComponent conv={conv!} />;
  }

  return <ShortAnswerComponent message={message} conv={conv} />;
};

export default QuizMessageComponent;
