"use client";
import { useQuizContext } from "@/context/quizContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { buttonIconSize, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookText, X } from "lucide-react";
import { FC, useState } from "react";

type ComponentType = {};

const variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
};

const QuizWrapperComponent: FC<ComponentType> = ({}) => {
  const [variant, setVariant] = useState<"hidden" | "visible">("hidden");
  const [multipleChoice, setMultipleChoice] = useState(true);
  const [shortAnswer, setShortAnswer] = useState(false);
  const { startQuiz: beginQuiz } = useQuizContext();
  const startQuiz = () => {
    beginQuiz(multipleChoice, shortAnswer);
    setVariant("hidden");
  };
  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        className="fixed left-0 top-0 w-screen h-screen flex items-center justify-center  -bottom-full z-30 p-5  bg-onBackground/80  rounded-lg shadow-md after: space-y-4"
        variants={variants}
        animate={variant}
      >
        <div className=" relative space-y-3 bg-onBackground rounded-lg p-5 px-8 border border-textColor/20 z-50">
          <h1 className="text-xl mb-5">Choose how you like your quiz.</h1>
          <h1 className="text-lg font-bold">Choose Quiz type</h1>
          <button
            className="absolute -top-[30%] text-white/60 shadow-md hover:text-white -right-[50%] h-[60px] w-[60px] bg-pink-600 flex justify-center items-center rounded-full"
            onClick={() => setVariant("hidden")}
          >
            <X size={24} />
          </button>
          <div className="space-x-1 flex items-center">
            <input
              type="checkbox"
              checked={multipleChoice}
              onChange={(event) => setMultipleChoice(event.target.checked)}
            />{" "}
            <span className="">Multiple choice</span>
          </div>
          <div className="space-x-1 flex items-center">
            <input
              type="checkbox"
              checked={shortAnswer}
              onChange={(event) => setShortAnswer(event.target.checked)}
            />
            <span className="">Short answer</span>
          </div>
          <div className="mt-8 border-t border-textColor/20 py-3 space-y-3">
            <h1 className="text-lg font-bold">Select difficulty level</h1>
            <div className="space-x-1 flex items-center">
              <input
                type="checkbox"
                checked={shortAnswer}
                onChange={(event) => setShortAnswer(event.target.checked)}
              />
              <span className="">Giggle Grove (Least Hard)</span>
            </div>
            <div className="space-x-1 flex items-center">
              <input
                type="checkbox"
                checked={shortAnswer}
                onChange={(event) => setShortAnswer(event.target.checked)}
              />
              <span className="">Chuckle Canyon (Medium)</span>
            </div>
            <div className="space-x-1 flex items-center">
              <input
                type="checkbox"
                checked={shortAnswer}
                onChange={(event) => setShortAnswer(event.target.checked)}
              />
              <span className="">Laughing Lava(Hard)</span>
            </div>
          </div>
          <button
            className={cn(buttonClass, " w-full mt-6")}
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      </motion.div>
      <button
        className={cn(buttonClass)}
        onClick={() => {
          setVariant((prev) => (prev === "hidden" ? "visible" : "hidden"));
        }}
      >
        <BookText size={18} className="mr-1 relative" /> Quiz Me
      </button>
    </div>
  );
};

export default QuizWrapperComponent;
