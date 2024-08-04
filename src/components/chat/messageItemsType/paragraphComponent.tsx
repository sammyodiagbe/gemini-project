import { FC } from "react";

type ComponentType = {
  data: { text: string };
};

const ParagraphComponent: FC<ComponentType> = ({ data }) => {
  const { text } = data;
  return <p className="leading-7 mb-3">{text}</p>;
};

export default ParagraphComponent;
