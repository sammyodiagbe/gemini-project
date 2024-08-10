import { useConversationContext } from "@/context/conversationContext";
import { Lightbulb } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";

type ComponentType = {
  interactionMessage: string;
};

const PossibleInteractionComponent: FC<ComponentType> = ({
  interactionMessage,
}) => {
  const { chatWithGemini } = useConversationContext();
  const sendMessageToGemini = () => {
    chatWithGemini(interactionMessage);
  };
  return (
    <motion.div
      onClick={sendMessageToGemini}
      className="-z-0 p-3 min-h-[40px] text-md cursor-pointer rounded-md grid grid-cols-[25px_1fr] items-start hover:bg-secondary/70    transition-all duration-100 bg-secondary/30"
    >
      <Lightbulb
        size={16}
        className="  text-textColor font-bold relative top-[5px]"
      />
      <p className="text-sm">{interactionMessage}</p>
    </motion.div>
  );
};

export default PossibleInteractionComponent;
