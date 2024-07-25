import { buttonClass } from "@/lib/tailwind_classes";
import { ConversationType } from "@/lib/type";
import { FC } from "react";

type ComponentProps = {
  nextQuestion: Function;
  lastQuestion: boolean;
};

const QuizActionComponent: FC<ComponentProps> = ({
  nextQuestion,
  lastQuestion,
}) => {
  return (
    <div className="mt-7 flex justify-end -z-10">
      {!lastQuestion && (
        <button className={buttonClass} onClick={() => nextQuestion()}>
          Next Question
        </button>
      )}
      <button className={buttonClass}>End session</button>
    </div>
  );
};
export default QuizActionComponent;
