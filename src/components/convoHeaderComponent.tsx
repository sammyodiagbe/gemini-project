import { useComponentInteractionsContext } from "@/context/componentInteractionContext";
import { useConversationContext } from "@/context/conversationContext";
import { useNoteContext } from "@/context/noteContext";
import { cn } from "@/lib/utils";
import { LayoutList, Notebook, Pen, Zap } from "lucide-react";
import QuizMeComponent from "./quiz/quizmeComponent";

const ConversationHeader = () => {
  const { notes, setShowNote, toggleCreateNote, showNote } = useNoteContext();
  const { getFlashCard } = useConversationContext();
  const { setOpenTopicsMenu, openTopicsMenu } =
    useComponentInteractionsContext();

  return (
    <div
      className={cn(
        "h-auto absolute bottom-full left-full flex items-center justify-center  select-none z-[120] ",
        setOpenTopicsMenu && ""
      )}
    >
      <div className="p-2 space-y-3 sticky top-0">
        <button
          className={cn(
            "btn relative flex items-center justify-center text-textColor/80 hover:text-textColor hover:ring-1 hover:ring-purple-500  font-medium rounded-full active:scale-95 h-[3.5rem] w-[3.5rem] bg-secondary group transition-all",
            showNote && "bg-purple-500 text-white "
          )}
          onClick={() => {
            setShowNote(!showNote);
          }}
        >
          <Notebook size={16} /> {notes.length > 0 && <span className="w-6 h-6 flex items-center justify-center translate-y-[14px] text-[8px] rounded-full absolute bg-fuchsia-500 text-white bottom-full right-0 translate-x-[2.5px]">{notes.length}</span>}
          <span
            className="absolute w-auto  overflow-hidden   right-full top-full/2 transition-all mr-2  bg-purple-500 text-white py-2 px-2 invisible rounded-md whitespace-nowrap text-sm
           group-hover:visible  group-hover:opacity-1 btn-hover:visible"
          >
            Your notes ({notes.length})
          </span>
        </button>
        <button
          className={cn(
            "relative flex items-center justify-center bg-secondary w-[3.5rem] h-[3.5rem] text-textColor/80 hover:text-textColor text-sm font-medium  py-1 px-3 rounded-full  active:scale-95 hover:ring-1 hover:ring-purple-500 group",
            openTopicsMenu && "bg-purple-500 text-white"
          )}
          onClick={() => {
            setOpenTopicsMenu();
          }}
        >
          <LayoutList size={16} />
          <span
            className="absolute w-auto  overflow-hidden  right-full top-full/2 transition-all mr-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-sm
           group-hover:visible group-hover:opacity-1 btn-hover:visible text-white"
          >
            Show Generated Topics
          </span>
        </button>
        <button
          className="relative flex items-center justify-center bg-secondary w-[3.5rem] h-[3.5rem] text-textColor/80 hover:text-textColor text-sm  font-medium  py-1 px-3 rounded-full  active:scale-95 hover:ring-1 hover:ring-purple-500 group"
          onClick={() => {
            toggleCreateNote(!showNote);
          }}
        >
          <Pen size={16} />
          <span
            className="absolute w-auto  overflow-hidden  right-full top-full/2 transition-all mr-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-white text-sm
           group-hover:visible group-hover:opacity-1 btn-hover:visible"
          >
            Write Note
          </span>
        </button>

        <QuizMeComponent />

        <button
          className="relative flex items-center justify-center bg-secondary w-[3.5rem] h-[3.5rem] text-textColor/80 hover:text-textColor text-sm font-medium  py-1 px-3 rounded-full  active:scale-95 hover:ring-1 hover:ring-purple-500 group"
          onClick={() => {
            getFlashCard();
          }}
        >
          <Zap size={16} />
          <span
            className="absolute w-auto  overflow-hidden  right-full top-full/2 transition-all mr-2 whitespace-nowrap  bg-purple-500 py-2 px-2 invisible rounded-md text-white text-sm
           group-hover:visible group-hover:opacity-1 btn-hover:visible"
          >
            Flashcard
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
                <X size={23} />
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
