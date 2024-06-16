"use client";
import { QuizType } from "@/lib/type";
import { FC } from "react";
import MultipleChoiceComponent from "./multipleChoiceComponent";
import ShortAnswerComponent from "./shortAnswerComponent";

type QuizData = {
  quiz: QuizType;
  message: string;
};

const QuizMessageComponent: FC<QuizData> = ({ quiz, message }) => {
  const { quiztype } = quiz;
  console.log(quiztype);
  if (quiztype === "multiplechoice") {
    return <MultipleChoiceComponent quiz={quiz} />;
  }

  return <ShortAnswerComponent quiz={quiz} message={message} />;
};

export default QuizMessageComponent;
