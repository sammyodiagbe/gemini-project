import { FC } from "react";

type ComponentType = {
  interactionMessage: string;
};

const PossibleInteractionComponent: FC<ComponentType> = ({
  interactionMessage,
}) => {
  return (
    <div className=" p-4 bg-gray-100 min-h-[80px] border shadow-md text-sm cursor-pointer hover:bg-gray-200 rounded-md">
      <p>{interactionMessage}</p>
    </div>
  );
};

export default PossibleInteractionComponent;
