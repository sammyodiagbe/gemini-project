"use client";
import { NoteType } from "@/lib/type";
import { createContext, useContext, useState } from "react";

type NoteContextType = {
  notes: NoteType[];
  takeNote: Function;
};

const noteContext = createContext<NoteContextType>({
  notes: [],
  takeNote: () => {},
});

const NoteContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, updateNotes] = useState<NoteType[]>([]);

  const takeNote = (note: NoteType) => {
    if (note.content.trim() === "") return;
    updateNotes((prev) => [...prev, note]);
  };
  return (
    <noteContext.Provider value={{ notes, takeNote }}>
      {children}
    </noteContext.Provider>
  );
};

export const useNoteContext = () => {
  return useContext(noteContext);
};

export default NoteContextProvider;
