import { buttonClass } from "@/lib/tailwind_classes";
import { cn } from "@/lib/utils";
import { FormEventHandler, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNoteContext } from "@/context/noteContext";
import { NoteType } from "@/lib/type";
import { useToast } from "../ui/use-toast";

const NewNoteComponent = () => {
  const [text, setText] = useState("");
  const { toggleCreateNote, createNewNote, takeNote } = useNoteContext();
  const { toast } = useToast();

  const addNewNote: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!text || text.trim() === "") return;
    const note: NoteType = { content: text };
    await takeNote(note);
    setText("");
    toast({
      description: "Note added Successfully",
      style: { zIndex: 3000 },
      className: "z-[3000]",
    });
  };
  return (
    <AnimatePresence>
      {createNewNote && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-28rem" }}
          exit={{ x: "28rem" }}
          className="fixed h-auto bottom-0 left-full p-5 min-w-[28rem] bg-secondary z-[900] shadow-lg rounder-lg"
        >
          <button
            className="w-12 h-12 absolute flex items-center justify-center right-2 top-2 "
            onClick={() => toggleCreateNote(false)}
          >
            <X />
          </button>
          <h1 className="text-xl mb-5">Add a new note.</h1>
          <div className="">
            <form onSubmit={addNewNote} className="space-y-4">
              <textarea
                value={text}
                placeholder="Your note"
                onChange={({ target }) => setText(target.value)}
                className="bg-background/70 outline-none border-none w-full resize-none rounded-lg p-3"
                rows={6}
              ></textarea>
              <div className="">
                <button className={cn(buttonClass)}>Add note</button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default NewNoteComponent;
