import { FC } from "react";

type ComponentType = {
  interactionMessage: string;
};

const PossibleInteractionComponent: FC<ComponentType> = ({
  interactionMessage,
}) => {
  return (
    <div className="flex items-center py-4 bg-gray-300 h-[80px] cursor-pointer hover:bg-gray-400 justify-center rounded-md">
      <p>{interactionMessage}</p>
    </div>
  );
};

export default PossibleInteractionComponent;
