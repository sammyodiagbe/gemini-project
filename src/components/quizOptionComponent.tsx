import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

type QuizOptionPropsType = {
  text: string;
  position: number;
  selected: number | undefined;
  pickOption: Function;
  answered: boolean;
  options: string[];
  answer: string;
  rightAnswer: boolean;
};

const QuizOptionComponent: FC<QuizOptionPropsType> = ({
  text,
  selected,
  position,
  answered,
  rightAnswer,
  pickOption,
  options,
  answer,
}) => {
  const isSelected = selected === position;
  const isRight = options[position] === answer;
  console.log(selected === position);
  return (
    <button
      className={cn(
        "ring-1 ring-gray-300 grid gap-2 items-center grid-cols-[20px_1fr] active:scale-95 p-5 rounded-md transition bg-onBackground",
        isSelected && rightAnswer && " ring-primary bg-primary/5",
        isSelected && !rightAnswer && "bg-red-100 ring-red-500",
        answered && !isSelected && isRight && "ring-primary bg-primary/5"
      )}
      onClick={() => pickOption(position)}
    >
      <span
        className={cn(
          "h-[20px] w-[20px] bg-gray-200 mr-2 rounded-md transition delay-200",
          isSelected && rightAnswer && "bg-primary ",
          isSelected && !rightAnswer && "bg-red-300",
          answered && !isSelected && isRight && " ring-primay bg-primary"
        )}
      />
      <span className=" text-left">{text}</span>
    </button>
  );
};

export default QuizOptionComponent;
