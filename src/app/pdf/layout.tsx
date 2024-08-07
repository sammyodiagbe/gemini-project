import ImagesComponent from "@/components/chat/imagesComponent";
import Navbar from "@/components/navbar";
import NotesComponent from "@/components/notes-components/notesComponent";
import PopupComponent from "@/components/popupComponent";
import ToastWrapperProvider from "@/components/toast-components/toastWrapperProvider";
import ConversationContextProvider from "@/context/conversationContext";
import NoteContextProvider from "@/context/noteContext";
import PopupContextProvider from "@/context/popupContext";
import QuizContextProvider from "@/context/quizContext";
import ToastProvider from "@/context/toastContext";
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
            <NotesComponent />
            <Navbar />
            {children}
          </NoteContextProvider>
        </QuizContextProvider>
      </PopupContextProvider>
    </ConversationContextProvider>
  );
};

export default PageLayout;
