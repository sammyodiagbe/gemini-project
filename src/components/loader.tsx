"use client";
import Lottie from "lottie-react";
import loadingMonkey from "../lottie/loading_monkey.json";
import { ReactTyped } from "react-typed";

const LoaderComponent = () => {
  return (
    <div className="fixed h-screen bg-secondary z-[3000] w-screen grid items-center justify-center top-0 left-0">
      <div className="text-center max-w-[280px] space-y-3">
        <Lottie
          animationData={loadingMonkey}
          className=" w-[280px] mb-0 self-auto"
          marginHeight={0}
        />
        <ReactTyped
          strings={["Naala is analyzing your file..."]}
          typeSpeed={90}
          loop={true}
          className="text-xl font-bold"
        />
      </div>
    </div>
  );
};

export default LoaderComponent;
