"use client";
import {
  FileQuestion,
  LoaderPinwheel,
  LoaderPinwheelIcon,
  TriangleAlert,
} from "lucide-react";
import DifficultyComponent from "./difficultyComponent";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buttonIconSize, cn } from "@/lib/utils";
import { useQuizContext } from "@/context/quizContext";

const difficultyLevels = [
  "Piece of cake",
  "Sweating Bullets",
  "Herculean Feat",
];

const popupVariants = {
  open: {
    x: 12,
    opacity: [0, 0.6, 1],
  },
  close: {
    x: 50,
    opacity: [1, 0.6, 0],
  },
};

const QuizMeComponent = () => {
  const [open, setOpen] = useState(false);
  const { startQuiz } = useQuizContext();
  const [multipleChoice, allowMultipleChoice] = useState(true);
  const [shortAnswer, allowShortAnswer] = useState(false);
  const [difLevel, setDifLevel] = useState<number>(1);
  const [startingQuiz, setStartingQuiz] = useState(false);

  const beginQuiz: MouseEventHandler = async (event) => {
    event.stopPropagation();
    setStartingQuiz(true);
    await startQuiz(multipleChoice, shortAnswer, difLevel);
    setOpen(false);
    setStartingQuiz(false);
  };

  const handleLevelChange: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { level } = event.target.dataset;
    setDifLevel(parseInt(level!));
  };
  return (
    <button
      className={cn(
        "relative flex items-center justify-center bg-secondary w-[4.5rem] h-[4.5rem] text-textColor/80 hover:text-textColor text-sm font-medium   py-1 px-3 rounded-full   hover:ring-1 hover:ring-purple-500 group transition-all",
        open && "ring-2"
      )}
      onClick={(event) => {
        event.stopPropagation();
        setOpen(!open);
      }}
    >
      <FileQuestion size={18} />

      {!open && (
        <span
          className="absolute w-auto  overflow-hidden  left-full top-full/2 transition-all ml-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-white
     group-hover:visible group-hover:opacity-1 btn-hover:visible"
        >
          Quiz Me
        </span>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={popupVariants}
            animate="open"
            exit={"close"}
            initial="close"
            className="absolute block  top-full/2 left-full bg-secondary whitespace-nowrap p-5 translate-x-3 rounded-lg w-[22.63rem] shadown-lg space-y-2 border-b-1"
          >
            <h1 className="text-lg">Pick Question type</h1>
            <span className="grid grid-cols-2 gap-3 py-4">
              <input
                type="checkbox"
                className="peer/mult hidden"
                name="multiplechoice"
                id="multiplechoice"
                onClick={(event) => event.stopPropagation()}
                checked={multipleChoice}
                onChange={(event) => allowMultipleChoice(event.target.checked)}
              />
              <label
                onClick={(event) => event.stopPropagation()}
                className=" aspect-square bg-background cursor-pointer flex items-center justify-center rounded-md px-2 peer-checked/mult:bg-purple-500 peer-checked/mult:text-white"
                htmlFor="multiplechoice"
              >
                <h2>Multiple Choice</h2>
              </label>
              <input
                type="checkbox"
                className="peer/short hidden"
                name="shortanswer"
                id="shortanswer"
                onClick={(event) => event.stopPropagation()}
                checked={shortAnswer}
                onChange={(event) => allowShortAnswer(event.target.checked)}
              />
              <label
                className="aspect-square cursor-pointer bg-background flex items-center justify-center  rounded-md px-2 peer-checked/short:bg-purple-500 peer-checked/short:text-white"
                htmlFor="shortanswer"
                onClick={(event) => event.stopPropagation()}
              >
                <h2>Short answer</h2>
              </label>
            </span>
            <span className="block">
              <h2 className="mb-3">Choose Difficulty level</h2>
              {difficultyLevels.map((lev, index) => {
                return (
                  <DifficultyComponent
                    title={lev}
                    key={index}
                    level={index + 1}
                    handleLevelChange={handleLevelChange}
                    selectedLevel={difLevel === index + 1}
                  />
                );
              })}
            </span>

            <span>
              <p className=" flex text-start py-3 text-foreground/60 max-w-full break-words whitespace-normal">
                <TriangleAlert size={28} className="mr-2" />
                If no selections are made, quiz defaults to 'multiplechoice' and
                difficulty level remains as 'piece of cake'
              </p>
            </span>

            <span className="py-3 grid grid-cols-2 gap-2 ">
              <button
                className="flex justify-center rounded-full p-2 bg-background/40 hover:bg-purple-500 hover:text-white transition-all"
                onClick={beginQuiz}
              >
                {startingQuiz ? (
                  <LoaderPinwheel
                    size={buttonIconSize}
                    className="animate-spin"
                  />
                ) : (
                  "Start Quiz"
                )}
              </button>
              <button
                className="  rounded-full p-2 bg-background/40 hover:bg-purple-500 hover:text-white transition-all"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                Download Quiz
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default QuizMeComponent;
