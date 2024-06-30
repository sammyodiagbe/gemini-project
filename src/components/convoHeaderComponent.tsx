import { useNoteContext } from "@/context/noteContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { buttonIconSize, cn } from "@/lib/utils";
import { ChevronLeft, Download, Pencil } from "lucide-react";
import NoteComponent from "./noteComponent";

const ConversationHeader = () => {
  const { notes, setShowNote, showNote } = useNoteContext();
  return (
    <div className="select-none">
      <button
        className="text-textColor/80 hover:text-textColor ring-1 hover:ring-1 ring-textColor/50 hover:ring-textColor py-1 px-5 rounded-full font-extrabold active:scale-95"
        onClick={() => {
          console.log("checking");
          setShowNote(true);
        }}
      >
        Your notes ( {notes.length} )
      </button>

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
                <button className={cn(buttonClass, "space-x-2")}>
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
