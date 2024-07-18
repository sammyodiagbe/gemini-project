import { ConversationType, QuizType } from "@/lib/type";
import { FC, useState } from "react";
import Confetti from "react-confetti";

import QuizOptionComponent from "./quizOptionComponent";
import QuizActionComponent from "./quizActionComponent";
import { useQuizContext } from "@/context/quizContext";
import { AnimatePresence, motion } from "framer-motion";
import { useConversationContext } from "@/context/conversationContext";

type ComponentType = {
  conv: ConversationType;
};

const MultipleChoiceComponent: FC<ComponentType> = ({ conv }) => {
  const { quiz, message } = conv;
  const { options, question, answer, currentQuestion, totalQuestions, score } =
    quiz!;
  const { sendMultipleChoiceResponse } = useQuizContext();
  const [selected, setSelected] = useState<number>(-1);
  const [answered, setAnswered] = useState<boolean>(false);
  const [rightAnswer, setRightAnswer] = useState<boolean>(false);
  const { conversation } = useConversationContext();

  const pickOption = (position: number) => {
    if (answered) return;
    if (options[position] === answer) {
      setRightAnswer(true);
      sendMultipleChoiceResponse(
        `User answered right, keep track of this for chart population later, question was ${question}`
      );
    } else {
      setRightAnswer(false);

      sendMultipleChoiceResponse(
        `User answered wrong, keep track of this question was ${question}, answer was ${answer}`
      );
    }

    setSelected(position);
    setAnswered(true);
  };
  return (
    <div className="min-h[6.25rem]">
      {rightAnswer && (
        <Confetti
          className="absolute w-full h-full"
          recycle={false}
          gravity={0.8}
        />
      )}
      <p className="mb-2">{message as string}</p>
      <AnimatePresence>
        {conversation.includes(conv) && (
          <motion.div
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500 }}
            transition={{ duration: 0.3 }}
            className="max-w-full mx-auto relative"
          >
            <div className=" flex justify-between items-center py-2">
              <h1 className="">
                Question {currentQuestion} of {totalQuestions}
              </h1>
              <h2>Your score: {score}</h2>
            </div>

            <h1 className="text-xl font-medium mb-8 leading-8">{question}</h1>
            <div className="grid grid-cols-2 gap-5">
              {options.map((option, index) => {
                return (
                  <QuizOptionComponent
                    selected={selected}
                    text={option}
                    key={index}
                    position={index}
                    pickOption={pickOption}
                    answered={answered}
                    rightAnswer={rightAnswer}
                    answer={answer}
                    options={options}
                  />
                );
              })}
            </div>
            <QuizActionComponent conv={conv} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultipleChoiceComponent;
