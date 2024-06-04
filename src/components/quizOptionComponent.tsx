import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

type QuizOptionPropsType = {
  text: string;
  position: number;
  selected: number | undefined;
  setSelected: Dispatch<SetStateAction<number>>;
};

const QuizOptionComponent: FC<QuizOptionPropsType> = ({
  text,
  selected,
  position,
  setSelected,
}) => {
  const isSelected = selected === position;
  return (
    <button
      className={cn(
        "bg-transparent ring-1 ring-gray-300 flex items-center active:scale-95 p-5 rounded-md transition ",
        isSelected ? " ring-1 ring-indigo-500 bg-indigo-100" : ""
      )}
      onClick={() => setSelected(position)}
    >
      <span
        className={cn(
          "h-[20px] w-[20px] bg-gray-200 mr-2 rounded-md transition delay-200",
          isSelected ? "bg-indigo-400 " : ""
        )}
      />
      <span className="">{text}</span>
    </button>
  );
};

export default QuizOptionComponent;
