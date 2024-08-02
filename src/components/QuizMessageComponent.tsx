import { QuizQuestionType, QuizResponseType } from "@/lib/type";
import { useState } from "react";
import MultipleChoiceQuestionComponent from "./multipleChoiceComponent";
import ShortAnswerQuestionComponent from "./shortAnswerComponent";
import QuizActionComponent from "./quizActionComponent";
import { useQuizContext } from "@/context/quizContext";
import { jsonEncode } from "@/lib/utils";
import TimeComponent from "./timeComponent";

type ComponentType = {
  quiz: QuizQuestionType[];
  message: string;
  time: number;
};

const QuizMessageComponent: React.FC<ComponentType> = ({
  quiz,
  message,
  time,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestionType>(
    quiz[currentIndex]
  );

  const { endSession } = useQuizContext();
  // this would be used later to determine user insights
  const [responseData, setResponseData] = useState<QuizResponseType[]>([]);

  const updateResponseData = (response: QuizResponseType) => {
    setResponseData((prev) => [...prev, response]);
  };

  const nextQuestion = () => {
    let index = currentIndex + 1;
    setCurrentIndex((prev) => index);
    setQuizQuestion(quiz[index]);
  };

  const getBreakdown = async () => {
    const quizData = jsonEncode(responseData);
    await endSession(quizData);
  };

  return (
    <div className="space-y-3">
      <TimeComponent time={time} />
      <p className="pb-4">{message}</p>

      <div className="py-2">
        <h2>
          Question {currentIndex + 1} of {quiz.length}
        </h2>
      </div>
      {quizQuestion.quiztype === "multiple_choice" ? (
        <MultipleChoiceQuestionComponent
          question={quizQuestion}
          updateResponse={updateResponseData}
        />
      ) : (
        <ShortAnswerQuestionComponent
          question={quizQuestion}
          updateResponse={updateResponseData}
        />
      )}
      <QuizActionComponent
        nextQuestion={nextQuestion}
        lastQuestion={currentIndex === quiz.length - 1}
        responseData={responseData}
      />
    </div>
  );
};

export default QuizMessageComponent;
