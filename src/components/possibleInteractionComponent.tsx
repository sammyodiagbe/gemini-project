import { useConversationContext } from "@/context/conversationContext";
import { Lightbulb } from "lucide-react";
import { FC } from "react";

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
    <div
      onClick={sendMessageToGemini}
      className=" p-4 min-h-[80px] border shadow-sm text-md cursor-pointer hover:bg-gray-200 rounded-md grid grid-cols-[25px_1fr] items-start ring-1 ring-primary"
    >
      <Lightbulb
        size={18}
        className=" text-textColor font-bold relative top-[5px]"
      />
      <p>{interactionMessage}</p>
    </div>
  );
};

export default PossibleInteractionComponent;
