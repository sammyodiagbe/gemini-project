"use client";
import { buttonClass } from "@/lib/tailwind_classes";
import { buttonIconSize, cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const PomodoroTimerComponent = () => {
  const workTime = 25 * 60;
  const breakTime = 5 * 60;
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWorkTime) {
        setTimeLeft(breakTime);
        setIsWorkTime(false);
      } else {
        setTimeLeft(workTime);
        setIsWorkTime(true);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isWorkTime]);

  const pauseTimer = () => {
    setIsActive((prev) => false);
  };

  const startTimer = () => {
    setIsActive((prev) => true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setTimeLeft(workTime);
  };

  const radius = 80;
  // const circumference = 2 * radius * Math.PI;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  // const getPercentage = () => {
  //   const p = (timeLeft / (isWorkTime ? workTime : breakTime)) * 100;

  //   return circumference - (p / 100) * circumference;
  // };

  const menu = {
    closed: {
      scale: 0,
      transition: {
        delay: 0.15,
      },
    },
    open: {
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.4,
        delayChildren: 0.2,
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <>
      {isActive && !workTime && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed z-20 left-0 top-0 bg-black/85 w-screen h-screen flex items-center justify-center"
          >
            <div className="max-w-[400px] space-y-6 text-center select-none">
              <h1 className="text-5xl">It break time yo, Take 5</h1>
              <p className="leading-8">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit,
                voluptates libero pariatur sequi maiores id dicta earum neque
                laboriosam maxime dolorum praesentium! Qui culpa veritatis
                cumque, hic eveniet quidem eum!
              </p>
              <button className={cn(buttonClass, "mx-auto font-bold")}>
                Continue Grinding
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div
        className="absolute px-2 h-full bottom-0 left-full  rounded-lg z-20 shadow-lg font-bolder grid items-center"
        draggable
      >
        <motion.button
          variants={menu}
          className="relative ring-1 hover:ring-primary/60 p-2 rounded-md text-xl  text-center  text-textColor/90 flex items-center space-x-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span>
            {minutes <= 9 ? `0${minutes}` : minutes}:
            {seconds <= 9 ? `0${seconds}` : seconds}
          </span>
          {showMenu ? <ChevronDown /> : <ChevronUp />}

          <motion.span
            className="absolute flex space-x-2 -top-[80px] -left-[150px] bg-onBackground p-4 w-[300px] text-sm justify-evenly shadow-md rounded-md"
            variants={menu}
            animate={showMenu ? "open" : "closed"}
          >
            <button
              onClick={startTimer}
              className="flex space-x-2 items-center text-textColor/65 hover:text-textColor"
            >
              <Play size={buttonIconSize} /> Start
            </button>
            <button
              onClick={pauseTimer}
              className="flex space-x-4 items-center text-textColor/65 hover:text-textColor"
            >
              <Pause size={buttonIconSize} /> Pause
            </button>
            <button
              onClick={resetTimer}
              className="flex space-x-2 items-center text-textColor/65 hover:text-textColor"
            >
              <RotateCcw size={buttonIconSize} /> Reset
            </button>
          </motion.span>
        </motion.button>

        {/* <div className="grid grid-cols-3 gap-2 place-items-center">
          
        </div> */}
      </div>
    </>
  );
};

export default PomodoroTimerComponent;
