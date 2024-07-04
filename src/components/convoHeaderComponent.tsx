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
    <div className="absolute  top-[5rem] left-0 -translate-x-[6rem]  select-none z-[120]">
      <div className="py-2 space-y-4 ">
        <button
          className="btn relative flex items-center justify-center text-textColor/80 hover:text-textColor hover:ring-1 hover:ring-purple-500  font-medium rounded-full active:scale-95 h-[4.5rem] w-[4.5rem] bg-onBackground group"
          onClick={() => {
            setShowNote(true);
          }}
        >
          <Notebook size={18} />{" "}
          <span
            className="absolute  overflow-hidden w-[100px]  left-full top-full/2 transition-all ml-2  bg-purple-500 py-2 px-2 invisible rounded-md 
           group-hover:visible group-hover:w-[100px] group-hover:opacity-1 btn-hover:visible"
          >
            Your notes
          </span>
        </button>
        <button
          className="relative flex items-center justify-center bg-onBackground w-[4.5rem] h-[4.5rem] text-textColor/80 hover:text-textColor text-sm font-medium  py-1 px-3 rounded-full  active:scale-95 hover:ring-1 hover:ring-purple-500 group"
          onClick={() => {
            showNewNote(true);
          }}
        >
          <Pen size={18} />
          <span
            className="absolute  overflow-hidden w-[100px]  left-full top-full/2 transition-all ml-2  bg-purple-500 py-2 px-2 invisible rounded-md 
           group-hover:visible group-hover:w-[100px] group-hover:opacity-1 btn-hover:visible"
          >
            Write Note
          </span>
        </button>
        {/* {newNote && (
          <div className=" w-[full] fixed top-0 right-[100px] p-3 rounded-lg bg-onBackground  space-y-3 z-[200]">
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
        )} */}
      </div>
    </div>
  );
};

export default ConversationHeader;
