"use client";
import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { ConversationType, QuizType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { ReactTyped } from "react-typed";
import QuizActionComponent from "./quizActionComponent";
import { AnimatePresence, motion } from "framer-motion";

type ComponentType = {
  message: string;
  conv: ConversationType;
};

const ShortAnswerComponent: FC<ComponentType> = ({ conv }) => {
  const { quiz } = conv;
  const { question, answer, currentQuestion, totalQuestions } = quiz!;
  const [userResponded, setUserResponded] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const { checkShortAnswer, nextQuestion } = useQuizContext();
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>();

  const checkAnswer = async () => {
    setCheckingAnswer(true);
    const feedback = await checkShortAnswer(userAnswer, answer, question);
    setFeedback(feedback);
    setCheckingAnswer(false);
    setUserResponded(true);
    const convoElement = document.getElementById("conversation")!;
    setTimeout(() => {
      convoElement.scrollTo({
        top: convoElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="min-h-[7.25rem]">
      <AnimatePresence>
        <motion.div
          initial={{ x: -500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500 }}
          transition={{ duration: 0.3 }}
          className="bg-onBackground space-y-4 p-4 rounded-md"
        >
          <h1>
            Question {currentQuestion} of {totalQuestions}
          </h1>
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
              <QuizActionComponent conv={conv} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ShortAnswerComponent;
