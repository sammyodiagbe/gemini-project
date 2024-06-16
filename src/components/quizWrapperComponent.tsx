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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        className="absolute -top-[180px] z-30 p-4 left-[-75px] w-[200px]  bg-onBackground  rounded-lg shadow-md after: space-y-4"
        variants={variants}
        animate={variant}
      >
        <button
          className="absolute top-[-10px] text-white/60 shadow-md hover:text-white right-[-10px] h-[40px] w-[40px] bg-onBackground flex justify-center items-center rounded-full"
          onClick={() => setVariant("hidden")}
        >
          <X size={buttonIconSize} />
        </button>
        <div className="space-x-1 flex items-center">
          <input
            type="checkbox"
            checked={multipleChoice}
            onChange={(event) => setMultipleChoice(event.target.checked)}
          />{" "}
          <span className="text-sm">Multiple choice</span>
        </div>
        <div className="space-x-1 flex items-center">
          <input
            type="checkbox"
            checked={shortAnswer}
            onChange={(event) => setShortAnswer(event.target.checked)}
          />
          <span className="text-sm">Short answer</span>
        </div>
        <button className={cn(buttonClass, " w-full")} onClick={startQuiz}>
          Start Quiz
        </button>
      </motion.div>
      <button
        className={cn(buttonClass)}
        onClick={() => {
          setVariant((prev) => (prev === "hidden" ? "visible" : "hidden"));
        }}
      >
        <BookText size={18} className="mr-1 " /> Quiz Me
      </button>
    </div>
  );
};

export default QuizWrapperComponent;
