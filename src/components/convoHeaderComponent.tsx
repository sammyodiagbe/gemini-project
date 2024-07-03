import { useNoteContext } from "@/context/noteContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { buttonIconSize, cn } from "@/lib/utils";
import {
  ChevronLeft,
  Download,
  Notebook,
  Pen,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import NoteComponent from "./noteComponent";
import { FormEventHandler, useState } from "react";

const ConversationHeader = () => {
  const { notes, setShowNote, showNote, takeNote } = useNoteContext();
  const [noteText, setNoteText] = useState("");
  const [newNote, showNewNote] = useState(false);

  const saveNote: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (noteText.trim() === "") return;
    takeNote({ content: noteText });
    setNoteText("");
  };
  return (
    <div className="sticky -top-1 select-none bg-backgroundColor z-5 py-2">
      <div className="flex space-x-1">
        <button
          className="flex space-x-1 items-center text-textColor/80 hover:text-textColor text-sm  font-medium py-1 px-3 rounded-full active:scale-95"
          onClick={() => {
            setShowNote(true);
          }}
        >
          <Notebook size={14} /> <span> My notes ( {notes.length} )</span>
        </button>
        <button
          className="flex items-center space-x-1 text-textColor/80 hover:text-textColor text-sm font-medium  py-1 px-3 rounded-full  active:scale-95"
          onClick={() => {
            showNewNote(true);
          }}
        >
          <Pen size={14} /> <span>Write Note</span>
        </button>
        {newNote && (
          <div className=" w-[450px] fixed top-[70px] right-[100px] p-3 rounded-lg bg-onBackground  space-y-3 z-[200]">
            <div className="flex py-3 justify-between items-center">
              <h1 className="text-2xl">Create a new note</h1>
              <button
                className=" hover:text-red-500 hover:font-bold"
                onClick={() => showNewNote(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="">
              <form onSubmit={saveNote}>
                <div className="">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className={"bg-backgroundColor/80 w-full resize-none p-2"}
                    placeholder="Enter note here"
                    rows={5}
                  />
                </div>
                <div className="py-3">
                  <button className={cn(buttonClass)}>
                    {" "}
                    <Plus /> Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showNote && (
        <div className="fixed left-0 bg-backgroundColor top-0 z-50 w-screen h-screen overflow-auto">
          <div className="w-[45.7rem] mx-auto">
            <div className="sticky top-0 flex justify-between py-5 border-b-2 border-textColor/10 bg-backgroundColor">
              <div className="flex items-center space-x-5">
                <button className=" flex " onClick={() => setShowNote(false)}>
                  <ChevronLeft className="text-textColor/70" /> Go back
                </button>

                <h1 className="text-2xl text-purple-500 font-semibold">
                  Your notes
                </h1>
              </div>

              <div className="flex space-x-1 ">
                <button className={cn(buttonClass, "space-x-2")}>
                  <Download size={buttonIconSize} className="mr-1" /> Download
                  note
                </button>
                <button
                  className={cn(buttonClass, "space-x-2")}
                  onClick={() => showNewNote(true)}
                >
                  <Pencil size={buttonIconSize} className="mr-1" /> New note
                </button>
              </div>
            </div>
            <div className="space-y-5 py-2 ">
              {notes.map((note, index) => {
                return <NoteComponent note={note} index={index} key={index} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;
