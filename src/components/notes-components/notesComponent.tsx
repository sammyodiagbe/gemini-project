"use client";
import { useNoteContext } from "@/context/noteContext";
import NoteComponent from "../noteComponent";
import { useState } from "react";
import { NoteType } from "@/lib/type";
import { Download, X } from "lucide-react";
import { buttonIconSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NotesComponent = () => {
  const { showNote, notes, takeNote, setShowNote } = useNoteContext();
  const [noteText, setNoteText] = useState<string>("");

  const variants = {
    open: {
      scale: 1,
      opacity: 1,
    },
    closed: {
      scale: 0,
      opacity: 0,
    },
    initial: {
      scale: 0,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {showNote && (
        <motion.div
          className="fixed flex justify-end top-0 left-0  w-[100dvw] h-[100dvh] bg-black/85 z-[300]"
          variants={variants}
          initial="initial"
          exit={"closed"}
          animate="open"
        >
          <div className=" relative h-full bg-white w-[40%] p-4">
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
                <p>Your notes would appear here</p>
              </div>
              {notes.length && (
                <button className="flex items-center space-x-2 hover:font-bold transition-all">
                  <Download size={buttonIconSize} className="mr-1" /> Download
                  Note
                </button>
              )}
            </div>

            <div className="py-5 space-y-3">
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

            <div className="absolute bottom-2 w-full left-0 p-2 flex space-x-3">
              <textarea
                placeholder="Enter note here"
                className="flex-1 rows-1 rounded-md  resize-none align-middle"
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
              />
              <button
                className="bg-purple-500 text-white p-2 rounded-sm active:scale-95"
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
