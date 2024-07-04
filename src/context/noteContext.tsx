"use client";
import { NoteType } from "@/lib/type";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type NoteContextType = {
  notes: NoteType[];
  takeNote: Function;
  showNote: boolean;
  setShowNote: Dispatch<SetStateAction<boolean>>;
  deleteNote: Function;
  createNewNote: boolean;
  toggleCreateNote: Function;
};

const noteContext = createContext<NoteContextType>({
  notes: [],
  takeNote: () => {},
  showNote: false,
  setShowNote: () => {},
  deleteNote: () => {},
  createNewNote: false,
  toggleCreateNote: () => {},
});

const NoteContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, updateNotes] = useState<NoteType[]>([]);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [createNewNote, setCreateNoteNote] = useState<boolean>(false);

  const takeNote = (note: NoteType) => {
    if (note.content.trim() === "") return;
    updateNotes((prev) => [...prev, note]);
  };

  const deleteNote = (note: NoteType) => {
    updateNotes((prev) => prev.filter((n) => n != note));
  };

  const toggleCreateNote = (state: boolean) => {
    setCreateNoteNote(state);
  };
  return (
    <noteContext.Provider
      value={{
        notes,
        showNote,
        setShowNote,
        takeNote,
        deleteNote,
        createNewNote,
        toggleCreateNote,
      }}
    >
      {children}
    </noteContext.Provider>
  );
};

export const useNoteContext = () => {
  return useContext(noteContext);
};

export default NoteContextProvider;
