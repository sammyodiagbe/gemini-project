"use client";
import { useConversationContext } from "@/context/conversationContext";
import { QuizType } from "@/lib/type";
import { FC, useState } from "react";

type QuizData = {
  quiz: QuizType;
};

const QuizMessageComponent: FC<QuizData> = ({
  quiz: { question, options, answer },
}) => {
  const { nextQuestion } = useConversationContext();
  const [showanswer, setShowanswer] = useState(false);
  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-2xl font-medium mb-5">{question}</h1>
      <div
        className="grid grid-cols-
      1 gap-5"
      >
        {options.map((option, index) => {
          return <p key={index}>{option}</p>;
        })}
      </div>
      {showanswer && <p>{answer}</p>}
      <div className="flex justify-end py-5">
        <button className="p-2 " onClick={() => setShowanswer(true)}>
          Show answer
        </button>
        <button
          className="p-2 rounded-md bg-gray-200"
          onClick={() => nextQuestion()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizMessageComponent;
