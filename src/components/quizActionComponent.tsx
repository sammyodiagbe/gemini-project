import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";

const QuizActionComponent = () => {
  const { nextQuestion, endSession } = useQuizContext();
  return (
    <div className="flex justify-end">
      <button className={buttonClass} onClick={() => nextQuestion()}>
        Next Question
      </button>
      <button className={buttonClass} onClick={() => endSession()}>
        End session
      </button>
    </div>
  );
};
export default QuizActionComponent;
