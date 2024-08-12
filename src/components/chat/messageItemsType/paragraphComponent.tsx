import { FC } from "react";
import ReactMarkdown from "react-markdown";

type ComponentType = {
  data: { text: string };
};

const ParagraphComponent: FC<ComponentType> = ({ data }) => {
  const { text } = data;

  return (
    <ReactMarkdown className={"mb-3 leading-8 text-sm px-2"}>{text}</ReactMarkdown>
    //   <p className="prose leading-7 mb-3">{text}</p>
    // </div>
  );
};

export default ParagraphComponent;
