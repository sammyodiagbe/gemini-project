import { FlashCardType } from "@/lib/type";
import { FC } from "react";
import MarkdownView from "react-showdown";

type FlashCardPropTypes = {
  message: string;
  flashcard: FlashCardType;
};

const FlashCardComponent: FC<FlashCardPropTypes> = ({ message, flashcard }) => {
  const { front, back } = flashcard;
  return (
    <div className="">
      <MarkdownView markdown={message} />
      <div className="group bg-green-400">
        <div className="h-[380px] w-[280px] mx-auto mt-[100px] [transform-style:perspective-3d] group-hover:rotate-y-[180deg]">
          <div className="relative card h-[380px] w-[280px] rounded-md bg-blue-500 text-white">
            <div className="absolutew-full h-full [backface-visibility]">
              <p>{front}</p>
            </div>
            <div className="absolute h-full w-full bg-orange-500">
              <p>{back}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardComponent;
