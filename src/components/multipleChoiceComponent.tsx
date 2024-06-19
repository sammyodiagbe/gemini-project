import { QuizType } from "@/lib/type";
import { FC, useState } from "react";
import Confetti from "react-confetti";

import QuizOptionComponent from "./quizOptionComponent";
import QuizActionComponent from "./quizActionComponent";
import { useQuizContext } from "@/context/quizContext";

type ComponentType = {
  quiz: QuizType;
};

const MultipleChoiceComponent: FC<ComponentType> = ({ quiz }) => {
  const { options, question, answer } = quiz;
  const { sendMultipleChoiceResponse } = useQuizContext();
  const [selected, setSelected] = useState<number>(-1);
  const [answered, setAnswered] = useState<boolean>(false);
  const [rightAnswer, setRightAnswer] = useState<boolean>(false);

  const pickOption = (position: number) => {
    if (answered) return;
    if (options[position] === answer) {
      setRightAnswer(true);
      sendMultipleChoiceResponse(
        `User answered right, keep track of this for chart population later, question was ${question}`
      );
      return;
    }
    sendMultipleChoiceResponse(
      `User answered wrong, keep track of this question was ${question}, answer was ${answer}`
    );
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
      <div className="grid grid-cols-2 gap-5">
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
      <QuizActionComponent />
    </div>
  );
};

export default MultipleChoiceComponent;
