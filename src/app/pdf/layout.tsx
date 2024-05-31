import ConversationContextProvider from "@/context/conversationContext";
import { FC } from "react";

type LayoutType = {
  children: React.ReactNode;
};

const PageLayout: FC<LayoutType> = ({ children }) => {
  return <ConversationContextProvider>{children}</ConversationContextProvider>;
};

export default PageLayout;
