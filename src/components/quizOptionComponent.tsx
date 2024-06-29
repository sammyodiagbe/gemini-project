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
  if (isSelected) {
    console.log(answered, isSelected, rightAnswer, isRight);
  }
  return (
    <button
      className={cn(
        "ring-2 text-left ring-textColor/20 active:scale-95 p-3 rounded-md transition bg-onBackground hover:bg-onBackground/40 flex items-start",
        answered && isSelected && isRight && "ring-purple-500",
        answered && isSelected && !isRight && " ring-pink-500",
        answered && isSelected === false && isRight && "ring-purple-500"
      )}
      onClick={async () => {
        await pickOption(position);
        console.log(answered, isSelected, rightAnswer, isRight);
      }}
    >
      {/* <span
        className={cn(
          "h-[20px] w-[20px] bg-gray-200 mr-2 rounded-md transition delay-200",
          isSelected && rightAnswer && "bg-primary ",
          isSelected && !rightAnswer && "bg-red-300",
          answered && !isSelected && isRight && " ring-primay bg-primary"
        )}
      /> */}
      <span className="">{text}</span>
    </button>
  );
};

export default QuizOptionComponent;
