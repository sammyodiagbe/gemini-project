import { FC } from "react";

type ComponentType = {
  time: number;
};

const AiChatHeader: FC<ComponentType> = ({ time }) => {
  return (
    <div className="flex justify-between items-center text-sm p-2 font-bold">
      <span className="text-sm ">Naala</span>
      {time && <span className="text-sm">time taken: {Math.round(time)}s</span>}
    </div>
  );
};

export default AiChatHeader;
