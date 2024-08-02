import { cn } from "@/lib/utils";
import { FC } from "react";

type ComponentType = {
  time: number;
};

const TimeComponent: FC<ComponentType> = ({ time }) => {
  return (
    <div className="flex justify-end">
      <span
        className={cn(
          " text-green-500 font-bold text-xs p-2 rounded-full",
          time >= 30 && " text-orange-500"
        )}
      >
        Time taken: {time}s
      </span>
    </div>
  );
};

export default TimeComponent;
