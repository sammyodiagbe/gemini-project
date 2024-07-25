import { QuizQuestionType } from "@/lib/type";
import { FC } from "react";

type ComponentType = {
  question: QuizQuestionType;
};

const ShortAnswerQuestionComponent: FC<ComponentType> = ({ question }) => {
  const { question: ques } = question;

  const checkUserResponse = () => {
    // check to see if the user understands the question and topic
    // remember the whole purpose of this app is understanding and not being right
  };
  return (
    <div className="">
      <h1 className="text-2xl font-extrabold mb-4">{ques}</h1>
      <div className=" bg-secondary p-3 rounded-lg">
        <textarea
          className="w-full resize-none outline-none border-none bg-transparent   rounded"
          rows={3}
          placeholder="Enter answer here (remember it is more about learning not being right)"
        ></textarea>
        <div className="flex justify-end">
          <button className="p-2 bg-purple-500 text-white rounded-full scale-95 hover:scale-100 transition-all">
            Check response
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortAnswerQuestionComponent;
