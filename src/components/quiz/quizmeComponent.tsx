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
import {
  buttonIconSize,
  cn,
  errorMessage,
  jsonEncode,
  toastClass,
  toastStyle,
} from "@/lib/utils";
import { useQuizContext } from "@/context/quizContext";
import Spinner from "../spinner";
import { toast } from "../ui/use-toast";

const difficultyLevels = [
  "Piece of cake",
  "Sweating Bullets",
  "Herculean Feat",
];

const popupVariants = {
  open: {
    x: -20,
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
  const [generatingQues, setGeneratingQuez] = useState(false);
  const { generateQuestions } = useQuizContext();

  const generateQuizQuestionsAndDownload = async () => {
    setGeneratingQuez(true);
    const data = await generateQuestions();

    const questions = data.questions!;
    if (!questions || questions === null) {
      toast({
        description: errorMessage(),
        className: toastClass,
        style: toastStyle,
      });
      setGeneratingQuez(false);
      return;
    }

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/download-questions-pdf`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonEncode({ data: questions }),
        }
      );
      if (!result.ok) {
        toast({
          description: "Oops that didn't work, please try again",
        });
        return;
      }
      const blob: Blob = await result.blob();
      const url: string = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${Math.random().toString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setGeneratingQuez(false);
    } catch (error: any) {
      console.log(error);

      toast({
        description: "Oh no something went wrong, please try again",
      });
      setGeneratingQuez(false);
    }
    // next is to post a message to the backend

    setGeneratingQuez(false);
  };

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
    <div className="relative text-sm">
      <button
        className={cn(
          " flex items-center justify-center bg-secondary w-[3.5rem] h-[3.5rem] text-textColor/80 hover:text-textColor text-sm font-medium   py-1 px-3 rounded-full z-[30]   hover:ring-1 hover:ring-purple-500 group transition-all",
          open && "ring-2"
        )}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
      >
        <FileQuestion size={16} />

        {!open && (
          <span
            className="absolute w-auto  overflow-hidden bottom-0 right-full top-full/2 transition-all mr-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-white
     group-hover:visible group-hover:opacity-1 btn-hover:visible"
          >
            Quiz Me
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={popupVariants}
            animate="open"
            exit={"close"}
            initial="close"
            className="absolute block  bottom-[-50px] right-full bg-secondary whitespace-nowrap p-5 -translate-x-5 rounded-lg w-[22.63rem] shadown-lg space-y-2 border-b-1"
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
                className="py-3 bg-background cursor-pointer flex items-center justify-center rounded-md px-2 peer-checked/mult:bg-purple-500 peer-checked/mult:text-white"
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
                className="py-3 cursor-pointer bg-background flex items-center justify-center  rounded-md px-2 peer-checked/short:bg-purple-500 peer-checked/short:text-white"
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
                className="  rounded-full flex justify-center items-center p-2 bg-background/40 hover:bg-purple-500 hover:text-white transition-all"
                onClick={(event) => {
                  event.stopPropagation();
                  generateQuizQuestionsAndDownload();
                }}
              >
                {generatingQues ? <Spinner /> : "Download Quiz"}
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizMeComponent;
