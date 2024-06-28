import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { FC, useState } from "react";

type ComponentProps = {
  currentQuestion: number;
  totalQuestions: number;
};

const QuizActionComponent: FC<ComponentProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const { nextQuestion, endSession } = useQuizContext();
  const lastQuestion = currentQuestion === totalQuestions;
  const [hideButton, setHideButton] = useState<boolean>(false);
  return (
    <div className="mt-7 flex justify-end -z-10">
      {!lastQuestion && !hideButton && (
        <button
          className={buttonClass}
          onClick={async () => {
            await nextQuestion();
            setHideButton(true);
          }}
        >
          Next Question
        </button>
      )}
      <button className={buttonClass} onClick={() => endSession()}>
        End session
      </button>
    </div>
  );
};
export default QuizActionComponent;
