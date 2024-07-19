"use client";
import { noteSchema } from "@/gemini/responseSchemas";
import { NoteType } from "@/lib/type";
import { focusInstruction, jsonDecode, jsonEncode } from "@/lib/utils";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useConversationContext } from "./conversationContext";

type NoteContextType = {
  notes: NoteType[];
  takeNote: Function;
  showNote: boolean;
  setShowNote: Dispatch<SetStateAction<boolean>>;
  deleteNote: Function;
  createNewNote: boolean;
  toggleCreateNote: Function;
  naalaGenerateNotes: Function;
};

const noteContext = createContext<NoteContextType>({
  notes: [],
  takeNote: () => {},
  showNote: false,
  setShowNote: () => {},
  deleteNote: () => {},
  createNewNote: false,
  toggleCreateNote: () => {},
  naalaGenerateNotes: () => {},
});

const NoteContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, updateNotes] = useState<NoteType[]>([]);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [createNewNote, setCreateNoteNote] = useState<boolean>(false);
  const { focusTopics, chat } = useConversationContext();

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

  const naalaGenerateNotes = async () => {
    const schema = jsonEncode(noteSchema);
    const prompt = `${focusInstruction(
      focusTopics
    )}, Generate notes for me/ Follow Schema.<JSONSchema>${schema}</JSONSchema>`;
    try {
      const result = await chat?.sendMessageStream(prompt);
      let jsonString = "";
      for await (let chunk of result?.stream!) {
        jsonString += chunk.text();
      }

      const generatedNotes = jsonDecode(jsonString);
      console.log(generatedNotes);
      updateNotes((prev) => [...prev, ...generatedNotes]);
    } catch (error: any) {
      console.log(error);
    }
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
        naalaGenerateNotes,
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
