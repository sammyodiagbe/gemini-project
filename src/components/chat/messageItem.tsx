import { MessageItemType } from "@/lib/type";
import { FC } from "react";
import TitleComponent from "./messageItemsType/titleComponent";
import ParagraphComponent from "./messageItemsType/paragraphComponent";
import TableComponent from "./messageItemsType/tableComponent";

type MessageComponentType = {
  data: MessageItemType;
};

const MessageTypeComponent: FC<MessageComponentType> = ({ data }) => {
  const { type, level, code, text, headers, href, language, rows, title } =
    data;
  switch (type) {
    case "heading":
      return <TitleComponent data={{ level: level!, text: text! }} />;
    case "paragraph":
      return <ParagraphComponent data={{ text: text! }} />;

    case "table":
      return (
        <TableComponent
          data={{ rows: rows!, headers: headers!, title: title! }}
        />
      );
    default:
      return null;
  }
};

export default MessageTypeComponent;
