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
      className="-z-0 p-4 min-h-[80px] text-md cursor-pointer rounded-md grid grid-cols-[25px_1fr] items-start ring-1 ring-onBackground/10 hover:bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:text-white transition-all duration-100"
    >
      <Lightbulb
        size={16}
        className="  text-textColor font-bold relative top-[5px]"
      />
      <p>{interactionMessage}</p>
    </motion.div>
  );
};

export default PossibleInteractionComponent;
