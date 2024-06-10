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
      className=" p-4 bg-onBackground min-h-[80px] border shadow-sm text-md cursor-pointer hover:bg-gray-200 rounded-md grid grid-cols-[25px_1fr] items-start"
    >
      <Lightbulb
        size={18}
        className=" text-primary font-bold relative top-[5px]"
      />
      <p>{interactionMessage}</p>
    </div>
  );
};

export default PossibleInteractionComponent;
