"use client";
import { Pause, Play, RotateCcw } from "lucide-react";
import { MouseEventHandler, useEffect, useState } from "react";

const PomodoroTimerComponent = () => {
  const workTime = 25 * 60;
  const breakTime = 5 * 60;
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (isWorkTime ? workTime : breakTime)) * 100;

  return (
    <div
      className=" absolute bottom-0  right-0 rounded-lg bg-backgroundColor z-10 shadow-lg rign-1 ring-secondary cursor-grab"
      draggable
    >
      <svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          className="stroke-primary/15"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r="14"
          className=" stroke-primary"
          fill="none"
          strokeWidth="2"
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset="0"
          transform="rotate(90 50 50)"
          strokeLinecap="round"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="14"
          fill="#333"
        >{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</text>
      </svg>
      {/* <div className="grid grid-cols-3 gap-2 place-items-center">
        <button onClick={startTimer}>
          <Play />
        </button>
        <button onClick={pauseTimer}>
          <Pause />
        </button>
        <button onClick={resetTimer}>
          <RotateCcw />
        </button>
      </div> */}
    </div>
  );
};

export default PomodoroTimerComponent;
