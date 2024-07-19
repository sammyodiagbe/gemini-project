"use client";
import { useNoteContext } from "@/context/noteContext";
import NoteComponent from "../noteComponent";
import { useState } from "react";
import { NoteType } from "@/lib/type";
import { Download, NotebookText, X } from "lucide-react";
import { buttonIconSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NotesComponent = () => {
  const { showNote, notes, takeNote, setShowNote, naalaGenerateNotes } =
    useNoteContext();
  const [noteText, setNoteText] = useState<string>("");

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
        >
          <div className="flex flex-col relative h-full bg-background/90 w-full p-6 overflow-y-scroll">
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
              <div className="items-center flex space-x-4">
                {notes.length && (
                  <button className="flex items-center space-x-2 hover:font-bold transition-all text-sm">
                    <Download size={buttonIconSize} className="mr-1" /> Download
                    Note
                  </button>
                )}
                <button
                  className={
                    " hover:font-bold flex items-center transition-all text-sm"
                  }
                  onClick={() => naalaGenerateNotes()}
                >
                  <NotebookText className="mr-1" size={buttonIconSize} /> Naala
                  Generate notes
                </button>
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

            <div className="  w-full max-w-full left-0  bg-background p-2 px-3 flex space-x-3 rounded-full items-center">
              <textarea
                placeholder="Enter note here"
                className="flex-1 rows-1 rounded-md outline-none ring-0 focus:ring-0 resize-none align-middle bg-transparent max-h-[25dvh] max-h-52"
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={1}
              />
              <button
                className="bg-purple-500 text-white p-1 px-3 rounded-full active:scale-95"
                onClick={async () => {
                  if (noteText.trim() === "") return;
                  const note: NoteType = { content: noteText };
                  await takeNote(note);
                  setNoteText("");
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesComponent;
