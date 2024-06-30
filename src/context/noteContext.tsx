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
};

const noteContext = createContext<NoteContextType>({
  notes: [],
  takeNote: () => {},
  showNote: false,
  setShowNote: () => {},
  deleteNote: () => {},
});

const NoteContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, updateNotes] = useState<NoteType[]>([]);
  const [showNote, setShowNote] = useState<boolean>(false);

  const takeNote = (note: NoteType) => {
    if (note.content.trim() === "") return;
    updateNotes((prev) => [...prev, note]);
  };

  const deleteNote = (note: NoteType) => {
    updateNotes((prev) => prev.filter((n) => n != note));
  };
  return (
    <noteContext.Provider
      value={{ notes, showNote, setShowNote, takeNote, deleteNote }}
    >
      {children}
    </noteContext.Provider>
  );
};

export const useNoteContext = () => {
  return useContext(noteContext);
};

export default NoteContextProvider;
