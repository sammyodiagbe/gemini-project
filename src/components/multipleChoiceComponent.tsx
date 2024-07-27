"use client";
import { QuizQuestionType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";

type ComponentType = {
  question: QuizQuestionType;
};

const MultipleChoiceQuestionComponent: FC<ComponentType> = ({ question }) => {
  const { question: ques, answer, options } = question;
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [isRight, setIsRight] = useState(false);
  const checkAnswer = (option: string, index: number) => {
    if (answered) return;

    setSelected(index);
    setIsRight((prev) => option === answer);
    setAnswered(true);
  };

  useEffect(() => {
    setAnswered(false);
    setSelected(-1);
    setIsRight(false);
  }, [question]);

  return (
    <div className="">
      <h1 className="text-2xl font-extrabold mb-4">{ques}</h1>
      <div className="grid grid-cols-2 gap-3 my-4">
        {options?.map((option, index) => {
          return (
            <button
              className={cn(
                " text-left p-3 py-5 rounded-md bg-secondary active:scale-95 hover:ring-1 hover:ring-primary transition-all duration-100 flex items-start",
                answered &&
                  selected === index &&
                  isRight &&
                  "bg-rightOption text-white",
                answered &&
                  selected === index &&
                  !isRight &&
                  "bg-wrongOption text-white",
                answered &&
                  !(selected === index) &&
                  option === answer &&
                  "bg-rightOption text-white"
              )}
              key={index}
              onClick={() => checkAnswer(option, index)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestionComponent;
