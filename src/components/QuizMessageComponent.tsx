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
  const [answered, setAnswered] = useState<boolean>(false);
  const [rightAnswer, setRightAnswer] = useState<boolean>(false);

  const pickOption = (position: number) => {
    if (answered) return;
    if (options[position] === answer) {
      setRightAnswer(true);
    }
    setSelected(position);
    setAnswered(true);
  };
  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-xl font-medium mb-8 leading-8">{question}</h1>
      <div className="grid gap-8">
        {options.map((option, index) => {
          return (
            <QuizOptionComponent
              selected={selected}
              text={option}
              key={index}
              position={index}
              pickOption={pickOption}
              answered={answered}
              rightAnswer={rightAnswer}
              answer={answer}
              options={options}
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
          className="p-3 px-7 rounded-md bg-indigo-500 text-white disabled:bg-gray-50 disabled:text-gray-400 ring-1 ring-gray-400"
          onClick={() => nextQuestion()}
          disabled={!answered}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizMessageComponent;
