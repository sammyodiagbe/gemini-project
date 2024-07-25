import { QuizQuestionType } from "@/lib/type";
import { useState } from "react";
import MultipleChoiceQuestionComponent from "./multipleChoiceComponent";
import ShortAnswerQuestionComponent from "./shortAnswerComponent";
import QuizActionComponent from "./quizActionComponent";

type ComponentType = {
  quiz: QuizQuestionType[];
  message: string;
};

const QuizMessageComponent: React.FC<ComponentType> = ({ quiz, message }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestionType>(
    quiz[currentIndex]
  );

  const nextQuestion = () => {
    let index = currentIndex + 1;
    setCurrentIndex((prev) => index);
    setQuizQuestion(quiz[index]);
  };

  return (
    <div>
      <p className="pb-4">{message}</p>
      <div className="py-2">
        <h2>
          Question {currentIndex + 1} of {quiz.length}
        </h2>
      </div>
      {quizQuestion.quiztype === "multiple_choice" ? (
        <MultipleChoiceQuestionComponent question={quizQuestion} />
      ) : (
        <ShortAnswerQuestionComponent question={quizQuestion} />
      )}
      <QuizActionComponent
        nextQuestion={nextQuestion}
        lastQuestion={currentIndex === quiz.length - 1}
      />
    </div>
  );
};

export default QuizMessageComponent;
