"use client";

//

const LoaderComponent = () => {
  return (
    <div className="fixed h-screen w-screen  grid items-center justify-center z-50 top-0 left-0 bg-backgroundColor">
      <div className="text-center max-w-[250px]">
        {/* <Lottie
          animationData={loadingMonkey}
          className=" w-[280px] mb-0 self-auto"
          marginHeight={0}
        /> */}
        {/* <h1 className="text-2xl text-center font-bold text-primary w-[280px]">
          Analyzing your file.
        </h1> */}
      </div>
    </div>
  );
};

export default LoaderComponent;
