"use client";
import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { QuizType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { ReactTyped } from "react-typed";
import QuizActionComponent from "./quizActionComponent";

type ComponentType = {
  message: string;
  quiz: QuizType;
};

const ShortAnswerComponent: FC<ComponentType> = ({ quiz }) => {
  const { question, answer } = quiz;
  const [userResponded, setUserResponded] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const { checkShortAnswer, nextQuestion } = useQuizContext();
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>();

  const checkAnswer = () => {
    setCheckingAnswer(true);
    const feedback = checkShortAnswer(userAnswer, answer, question);
    setFeedback(feedback);
    setCheckingAnswer(false);
    setUserResponded(true);
  };

  return (
    <div className="bg-onBackground space-y-4 p-4 rounded-md">
      <h1 className="text-xl">{question}</h1>
      <textarea
        className=" w-full bg-backgroundColor text-textColor p-2 rounded-md resize-none"
        rows={5}
        value={userAnswer}
        onChange={({ target }) => setUserAnswer(target.value)}
        placeholder="Your response here. don't worry, understanding is more important that being right."
      ></textarea>
      <div className="flex justify-end">
        {!userResponded && (
          <button className={cn(buttonClass)} onClick={checkAnswer}>
            Check response
          </button>
        )}
      </div>
      {userResponded && (
        <div className="space-y-4">
          <p className="mb-2">Answer: {answer}</p>
          <p>{feedback}</p>
          <QuizActionComponent />
        </div>
      )}
    </div>
  );
};

export default ShortAnswerComponent;
