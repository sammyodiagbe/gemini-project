import { FlashCardType } from "@/lib/type";
import { FC, useState } from "react";
import MarkdownView from "react-showdown";
import FlashCard from "react-card-flip";
import { motion } from "framer-motion";
import AiChatHeader from "./conversationComponents/chatHeader";

type FlashCardPropTypes = {
  message: string;
  flashcard: FlashCardType;
  time: number;
};

const FlashCardComponent: FC<FlashCardPropTypes> = ({
  message,
  time,
  flashcard,
}) => {
  const { front, back } = flashcard;
  const [flip, setFlip] = useState(false);
  return (
    <motion.div
      className="select-none space-y-1 rounded-md"
      initial={{ transform: "scale(0)", opacity: 0 }}
      animate={{ transform: "scale(1)", opacity: 1 }}
    >
      <AiChatHeader time={
        time!
      } />
     
      <MarkdownView
        markdown={message}
        className="bg-onBackground px-2 rounded-lg text-md"
      />
      <div className="py-8 grid justify-center">
        <FlashCard isFlipped={flip} containerClassName="card-container">
          <div className="card-face card-front" onClick={() => setFlip(!flip)}>
            <p className="font-semibold text-md">{front}</p>
          </div>
          <div
            className="card-face card-back text-black/90"
            onClick={() => setFlip(!flip)}
          >
            <p className=" font-semibold text-md">{back}</p>
          </div>
        </FlashCard>
      </div>
    </motion.div>
  );
};

export default FlashCardComponent;
