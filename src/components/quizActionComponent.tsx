import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { ConversationType } from "@/lib/type";
import { FC } from "react";

type ComponentProps = {
  conv: ConversationType;
};

const QuizActionComponent: FC<ComponentProps> = ({ conv }) => {
  const { nextQuestion, endSession } = useQuizContext();
  const { quiz } = conv;
  const { currentQuestion, totalQuestions } = quiz!;
  const lastQuestion = currentQuestion === totalQuestions;
  return (
    <div className="mt-7 flex justify-end -z-10">
      {!lastQuestion && (
        <button
          className={buttonClass}
          onClick={async () => {
            await nextQuestion(conv);
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
