import PopupComponent from "@/components/popupComponent";
import ConversationContextProvider from "@/context/conversationContext";
import NoteContextProvider from "@/context/noteContext";
import PopupContextProvider from "@/context/popupContext";
import QuizContextProvider from "@/context/quizContext";
import { FC } from "react";

type LayoutType = {
  children: React.ReactNode;
};

const PageLayout: FC<LayoutType> = ({ children }) => {
  return (
    <ConversationContextProvider>
      <PopupContextProvider>
        <QuizContextProvider>
          <NoteContextProvider>
            <PopupComponent />

            {children}
          </NoteContextProvider>
        </QuizContextProvider>
      </PopupContextProvider>
    </ConversationContextProvider>
  );
};

export default PageLayout;
