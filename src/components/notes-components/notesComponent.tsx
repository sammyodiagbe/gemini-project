"use client";
import { useNoteContext } from "@/context/noteContext";
import NoteComponent from "../noteComponent";
import { useState } from "react";
import { NoteType } from "@/lib/type";
import { Download, NotebookText, X } from "lucide-react";
import { buttonIconSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../spinner";

const NotesComponent = () => {
  const { showNote, notes, takeNote, setShowNote, naalaGenerateNotes } =
    useNoteContext();
  const [noteText, setNoteText] = useState<string>("");
  const [generatingNotes, setGeneratingNotes] = useState(false);

  const generateNotes = async () => {
    setGeneratingNotes(true);
    await naalaGenerateNotes();
    setGeneratingNotes(false);
  };

  const variants = {
    open: {
      x: "-45rem",
    },
    closed: {
      x: 0,
    },
    initial: {
      x: 0,
    },
  };

  return (
    <AnimatePresence>
      {showNote && (
        <motion.div
          className="fixed flex justify-end top-0 left-full  w-[45rem] h-[100dvh] bg-black/85 z-[300] shadow-lg "
          variants={variants}
          initial="initial"
          exit={"closed"}
          animate="open"
          transition={{ stiffness: 50 }}
        >
          <div className="flex flex-col relative h-full bg-background w-full p-6 overflow-y-scroll">
            <button
              className="h-[3rem] w-[3rem] absolute flex justify-center top-0 items-center bg-red-400 left-0 -translate-x-[3rem] text-white rounded-l-md"
              onClick={() => {
                setShowNote(false);
              }}
            >
              <X className="" />
            </button>
            <div className="flex align-center justify-between">
              <div className="">
                <h2 className="text-xl">Your notes ({notes.length})</h2>
              </div>
            </div>

            <div className="py-5 space-y-6 flex-1">
              {notes.length ? (
                notes.map((note, index) => (
                  <NoteComponent index={index} key={index} note={note} />
                ))
              ) : (
                <div className="text-center mt-10">
                  <h2 className="text-2xl">Nothing to see here</h2>
                  <p>You currently have no note saved in here</p>
                </div>
              )}
            </div>

            <div className=" fixed right-5 bottom-10 items-center flex space-x-4">
              {notes.length && (
                <button className="flex items-center space-x-2 hover:font-bold transition-all text-sm">
                  <Download size={buttonIconSize} className="mr-1" /> Download
                  Note
                </button>
              )}
              <button
                className={
                  "scale-95 hover:ring-1 hover:ring-primary hover:font-semibold active:scale-95 hover:scale-1 flex items-center p-3 px-5 rounded-full transition-all text-sm bg-secondary"
                }
                onClick={() => generateNotes()}
              >
                {generatingNotes ? (
                  <Spinner />
                ) : (
                  <NotebookText className="mr-1" size={buttonIconSize} />
                )}
                Naala generate notes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesComponent;
