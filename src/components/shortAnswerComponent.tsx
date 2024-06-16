import { QuizType } from "@/lib/type";
import { FC } from "react";

type ComponentType = {
  message: string;
  quiz: QuizType;
};

const ShortAnswerComponent: FC<ComponentType> = ({ message, quiz }) => {
  const { question } = quiz;
  return (
    <div className="bg-onBackground">
      <h1>Here you go</h1>
      <p>{question}</p>
      <textarea
        className=""
        rows={4}
        placeholder="Your response here."
      ></textarea>
    </div>
  );
};

export default ShortAnswerComponent;
