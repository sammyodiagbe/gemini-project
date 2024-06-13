import PomodoroTimerComponent from "@/components/pomodoroTimerComponent";
import PopupComponent from "@/components/popupComponent";
import ConversationContextProvider from "@/context/conversationContext";
import PopupContextProvider from "@/context/popupContext";
import { FC } from "react";

type LayoutType = {
  children: React.ReactNode;
};

const PageLayout: FC<LayoutType> = ({ children }) => {
  return (
    <ConversationContextProvider>
      <PopupContextProvider>
        <PopupComponent />
        {children}
      </PopupContextProvider>
    </ConversationContextProvider>
  );
};

export default PageLayout;
