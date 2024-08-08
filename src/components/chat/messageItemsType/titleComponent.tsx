import { cn } from "@/lib/utils";
import { FC } from "react";

type ComponentType = {
  data: { level: number; text: string };
};

const TitleComponent: FC<ComponentType> = ({ data }) => {
  const { level, text } = data;
  const commonClass = "font-bold mb-2";
  switch (level) {
    case 1:
      return <h1 className={cn(commonClass)}>{text}</h1>;
    case 2:
      return <h2 className={cn(commonClass)}>{text}</h2>;
    case 3:
      return <h3 className={cn(commonClass)}>{text}</h3>;

    case 4:
      return <h4 className={cn(commonClass)}>{text}</h4>;
    case 5:
      return <h5 className={cn(commonClass)}>{text}</h5>;
    default:
      return <h6 className={cn(commonClass)}>{text}</h6>;
  }
};

export default TitleComponent;
