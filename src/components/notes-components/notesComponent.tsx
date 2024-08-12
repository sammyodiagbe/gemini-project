"use client";
import { useNoteContext } from "@/context/noteContext";
import NoteComponent from "../noteComponent";
import { useEffect, useRef, useState } from "react";
import { NoteType } from "@/lib/type";
import { Download, NotebookText, X } from "lucide-react";
import { buttonIconSize, jsonEncode } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../spinner";

const NotesComponent = () => {
  const { showNote, notes, takeNote, setShowNote, naalaGenerateNotes } =
    useNoteContext();
  const [noteText, setNoteText] = useState<string>("");
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [downloadingNotes, setDownloadingNotes] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollTo({
        top: notesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [notes]);

  const generateNotes = async () => {
    setGeneratingNotes(true);
    await naalaGenerateNotes();
    setGeneratingNotes(false);
  };

  const downloadNotes = async () => {
    setDownloadingNotes(true);

    try {
      const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({ data: notes }),
      });

      const blob = await result.blob();
      const url: string = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${Math.random().toString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadingNotes(false);
    } catch (error: any) {
      console.log(error);
      setDownloadingNotes(false);
    }

    setDownloadingNotes(false);
  };

  const variants = {
    open: {
      x: "-40rem",
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
          className="text-sm custom-scrollbar fixed flex justify-end top-0 left-full  w-[40rem] h-[100dvh] bg-black/85 z-[300] shadow-lg "
          variants={variants}
          initial="initial"
          exit={"closed"}
          animate="open"
          transition={{ stiffness: 50 }}
        >
          <div className="p-2 flex flex-col relative h-full bg-background w-full ">
            <button
              className="h-[3rem] w-[3rem] absolute flex justify-center top-3 items-cente right-3 rounded-l-md"
              onClick={() => {
                setShowNote(false);
              }}
            >
              <X className="text-sm" />
            </button>
            <div className="flex align-center justify-between p-3">
              <div className="">
                <h2 className="text-md">Notes</h2>
              </div>
            </div>

            <div
              className=" custom-scrollbar py-5 space-y-6 flex-1 overflow-y-auto p-3"
              ref={notesRef}
            >
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
              {notes.length ? (
                <button
                  className="flex items-center space-x-2 hover:font-bold transition-all text-xs"
                  onClick={() => downloadNotes()}
                  disabled={generatingNotes || downloadingNotes}
                >
                  <Download size={buttonIconSize} className="mr-1" />{" "}
                  {downloadingNotes ? "Downloading notes" : "Download notes"}
                </button>
              ) : null}
              <button
                className={
                  "scale-95 text-xs hover:ring-1 hover:ring-primary hover:font-semibold active:scale-95 hover:scale-1 flex items-center p-3 px-5 rounded-full transition-all  bg-secondary"
                }
                onClick={() => generateNotes()}
              >
                {generatingNotes ? (
                  <Spinner />
                ) : (
                  <NotebookText className="mr-1" size={buttonIconSize} />
                )}
                {generatingNotes ? "Generating Notes" : "Naala generate notes"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesComponent;
