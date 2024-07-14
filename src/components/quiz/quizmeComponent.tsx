import { FileQuestion, TriangleAlert } from "lucide-react";
import DifficultyComponent from "./difficultyComponent";

const difficultyLevels = [
  "Piece of cake",
  "Sweating Bullets",
  "Herculean Feat",
];

const QuizMeComponent = () => {
  return (
    <button
      className="relative flex items-center justify-center bg-secondary w-[4.5rem] h-[4.5rem] text-textColor/80 hover:text-textColor text-sm font-medium   py-1 px-3 rounded-full   hover:ring-1 hover:ring-purple-500 group"
      onClick={() => {}}
    >
      <FileQuestion size={18} />
      <span
        className="absolute w-auto  overflow-hidden  left-full top-full/2 transition-all ml-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-white
     group-hover:visible group-hover:opacity-1 btn-hover:visible"
      >
        Quiz Me
      </span>
      <span className="absolute block  top-full/2 left-full bg-secondary whitespace-nowrap p-5 translate-x-3 rounded-lg w-[22.63rem] shadown-lg space-y-2 border-b-1">
        <h1 className="text-lg">Pick Question type</h1>
        <span className="grid grid-cols-2 gap-3 py-4">
          <input
            type="checkbox"
            className="peer/mult hidden"
            name="multiplechoice"
            id="multiplechoice"
          />
          <label
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
          />
          <label
            className="aspect-square cursor-pointer bg-background flex items-center justify-center  rounded-md px-2 peer-checked/short:bg-purple-500 peer-checked/mult:text-white"
            htmlFor="shortanswer"
          >
            <h2>Short answer</h2>
          </label>
        </span>
        <span className="block">
          <h2 className="mb-3">Choose Difficulty level</h2>
          {difficultyLevels.map((lev, index) => {
            return <DifficultyComponent title={lev} key={index} />;
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
          <button className=" rounded-full p-2 bg-background/40 hover:bg-purple-500 hover:text-white transition-all">
            Start Quiz
          </button>
          <button className="  rounded-full p-2 bg-background/40 hover:bg-purple-500 hover:text-white transition-all">
            Download Quiz
          </button>
        </span>
      </span>
    </button>
  );
};

export default QuizMeComponent;
