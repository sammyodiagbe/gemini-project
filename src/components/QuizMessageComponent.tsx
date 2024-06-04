"use client";
import { useConversationContext } from "@/context/conversationContext";
import { QuizType } from "@/lib/type";
import { FC, useState } from "react";
import QuizOptionComponent from "./quizOptionComponent";

type QuizData = {
  quiz: QuizType;
};

const QuizMessageComponent: FC<QuizData> = ({
  quiz: { question, options, answer },
}) => {
  const { nextQuestion } = useConversationContext();
  const [showanswer, setShowanswer] = useState(false);
  const [selected, setSelected] = useState<number>(-1);
  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-2xl font-medium mb-8">{question}</h1>
      <div className="grid gap-8">
        {options.map((option, index) => {
          return (
            <QuizOptionComponent
              selected={selected}
              text={option}
              key={index}
              setSelected={setSelected}
              position={index}
            />
          );
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
