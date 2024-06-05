import { FlashCardType } from "@/lib/type";
import { FC } from "react";

type FlashCardPropTypes = {
  message: string;
  flashcard: FlashCardType;
  sender: string;
};

const FlashCardComponent: FC<FlashCardPropTypes> = ({
  message,
  flashcard,
  sender,
}) => {
  return <div className=""></div>;
};

export default FlashCardComponent;
