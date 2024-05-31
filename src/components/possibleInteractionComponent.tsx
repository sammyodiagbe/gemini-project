import { useConversationContext } from "@/context/conversationContext";
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
      className=" p-4 bg-gray-100 min-h-[80px] border shadow-md text-sm cursor-pointer hover:bg-gray-200 rounded-md"
    >
      <p>{interactionMessage}</p>
    </div>
  );
};

export default PossibleInteractionComponent;
