import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { ConversationType } from "@/lib/type";
import { FC } from "react";

type ComponentProps = {
  nextQuestion: Function;
  lastQuestion: boolean;
  getBreakdown: Function;
};

const QuizActionComponent: FC<ComponentProps> = ({
  nextQuestion,
  lastQuestion,
  getBreakdown,
}) => {
  const { endSession } = useQuizContext();

  return (
    <div className="mt-7 flex justify-end -z-10">
      {!lastQuestion && (
        <button className={buttonClass} onClick={() => nextQuestion()}>
          Next Question
        </button>
      )}
      <button className={buttonClass} onClick={() => getBreakdown()}>
        End session
      </button>
    </div>
  );
};
export default QuizActionComponent;
