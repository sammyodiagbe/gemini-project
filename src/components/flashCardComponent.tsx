import { FlashCardType } from "@/lib/type";
import { FC, useState } from "react";
import MarkdownView from "react-showdown";
import FlashCard from "react-card-flip";
import { motion } from "framer-motion";

type FlashCardPropTypes = {
  message: string;
  flashcard: FlashCardType;
};

const FlashCardComponent: FC<FlashCardPropTypes> = ({ message, flashcard }) => {
  const { front, back } = flashcard;
  const [flip, setFlip] = useState(false);
  return (
    <motion.div
      className=""
      initial={{ transform: "scale(0)", opacity: 0 }}
      animate={{ transform: "scale(1)", opacity: 1 }}
    >
      <MarkdownView
        markdown={message}
        className="bg-onBackground p-2 max-w-[80%] rounded-lg"
      />
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
    </motion.div>
  );
};

export default FlashCardComponent;
