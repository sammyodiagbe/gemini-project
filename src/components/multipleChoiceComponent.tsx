import { QuizType } from "@/lib/type";
import { FC, useState } from "react";
import Confetti from "react-confetti";

import QuizOptionComponent from "./quizOptionComponent";

type ComponentType = {
  quiz: QuizType;
};

const MultipleChoiceComponent: FC<ComponentType> = ({ quiz }) => {
  const { options, question, answer } = quiz;
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
    <div className="max-w-full mx-auto relative">
      {rightAnswer && (
        <Confetti
          className="absolute w-full h-full"
          recycle={false}
          gravity={0.8}
        />
      )}
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
      <div className="flex justify-end py-5">
        <button
          className="p-3 px-7 font-semibold rounded-md disabled:bg-gray-50 disabled:text-gray-400 ring-1 ring-secondary70"
          onClick={() => {}}
          disabled={!answered}
        >
          Another Question
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceComponent;
