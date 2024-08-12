import Navbar from "@/components/navbar";
import NotesComponent from "@/components/notes-components/notesComponent";
import ConversationContextProvider from "@/context/conversationContext";
import NoteContextProvider from "@/context/noteContext";
import PopupContextProvider from "@/context/popupContext";
import QuizContextProvider from "@/context/quizContext";
import { FC, Suspense } from "react";

type LayoutType = {
  children: React.ReactNode;
};

const PageLayout: FC<LayoutType> = ({ children }) => {
  return (
    <Suspense>
      <ConversationContextProvider>
        <PopupContextProvider>
          <QuizContextProvider>
            <NoteContextProvider>
              <NotesComponent />
              <Suspense>
                <Navbar />
              </Suspense>
              {children}
            </NoteContextProvider>
          </QuizContextProvider>
        </PopupContextProvider>
      </ConversationContextProvider>
    </Suspense>
  );
};

export default PageLayout;
