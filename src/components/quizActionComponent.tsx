import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { ConversationType, QuizResponseType } from "@/lib/type";
import { FC, useState } from "react";
import Spinner from "./spinner";

type ComponentProps = {
  nextQuestion: Function;
  lastQuestion: boolean;
  responseData: QuizResponseType[];
};

const QuizActionComponent: FC<ComponentProps> = ({
  nextQuestion,
  lastQuestion,
  responseData,
}) => {
  const { endSession } = useQuizContext();
  const [endingSession, setEndingSession] = useState(false);
  const getbreakdown = async () => {
    setEndingSession(true);
    await endSession(responseData);
    setEndingSession(false);
  };

  return (
    <div className="mt-7 flex justify-end -z-10">
      {!lastQuestion && (
        <button
          className={buttonClass}
          onClick={() => nextQuestion()}
          disabled={endingSession}
        >
          Next Question
        </button>
      )}
      <button
        className={buttonClass}
        disabled={endingSession}
        onClick={getbreakdown}
      >
        {endingSession && <Spinner />}{" "}
        {endingSession ? "Ending Session" : "End Session"}
      </button>
    </div>
  );
};
export default QuizActionComponent;
