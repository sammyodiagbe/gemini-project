import { FC } from "react";

type ComponentType = {
  data: { level: number; text: string };
};

const TitleComponent: FC<ComponentType> = ({ data }) => {
  const { level, text } = data;
  switch (level) {
    case 1:
      return <h1>{text}</h1>;
    case 2:
      return <h2>{text}</h2>;
    case 3:
      return <h3>{text}</h3>;

    case 4:
      return <h4>{text}</h4>;
    case 5:
      return <h5>{text}</h5>;
    default:
      return <h6>{text}</h6>;
  }
};

export default TitleComponent;
