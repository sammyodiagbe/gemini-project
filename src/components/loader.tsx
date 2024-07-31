"use client";
// import Lottie from "lottie-react";
// import loadingMonkey from "../lottie/loading_monkey.json";
//

const LoaderComponent = () => {
  return (
    <div className="fixed h-screen w-screen grid items-center justify-center z-50 top-0 left-0">
      <div className="text-center max-w-[250px] space-y-3">
        {/* <Lottie
          animationData={loadingMonkey}
          className=" w-[280px] mb-0 self-auto"
          marginHeight={0}
        />
        {/* <h1 className="text-2xl text-center font-bold text-primary w-[280px]">
          Analyzing your file.
        </h1> */}
        <h1 className="text-2xl">Hold on..</h1>
        <p>Naala is analyzing your file</p>
      </div>
    </div>
  );
};

export default LoaderComponent;
