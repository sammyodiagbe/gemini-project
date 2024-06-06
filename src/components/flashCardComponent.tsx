import { FlashCardType } from "@/lib/type";
import { FC, useState } from "react";
import MarkdownView from "react-showdown";
import FlashCard from "react-card-flip";

type FlashCardPropTypes = {
  message: string;
  flashcard: FlashCardType;
};

const FlashCardComponent: FC<FlashCardPropTypes> = ({ message, flashcard }) => {
  const { front, back } = flashcard;
  const [flip, setFlip] = useState(false);
  return (
    <div className="">
      <MarkdownView markdown={message} />
      <div className="py-8 grid justify-center">
        <FlashCard isFlipped={flip} containerClassName="card-container">
          <div className="card-face card-front" onClick={() => setFlip(!flip)}>
            <p className="text-xl font-semibold">{front}</p>
          </div>
          <div className="card-face card-back" onClick={() => setFlip(!flip)}>
            <p className="text-xl font-semibold">{back}</p>
          </div>
        </FlashCard>
      </div>
    </div>
  );
};

export default FlashCardComponent;
