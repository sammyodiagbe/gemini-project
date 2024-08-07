import { useNoteContext } from "@/context/noteContext";
import { buttonClass } from "@/lib/tailwind_classes";
import { NoteType } from "@/lib/type";
import { buttonIconSize, cn } from "@/lib/utils";
import { Trash, Trash2 } from "lucide-react";
import { FC } from "react";

type ComponentType = {
  note: NoteType;
  index: number;
};
const NoteComponent: FC<ComponentType> = ({ note, index }) => {
  const { content, topic } = note;
  const { deleteNote } = useNoteContext();
  return (
    <div className="note space-y-2  ">
      <h1 className="text-md font-bold">
        <span className="text-sm font-normal mr-1">#{index + 1}</span> {topic}
      </h1>
      <p>{content}</p>
      <div className="">
        <button
          className={
            "text-textColor hover:text-red-400 font-light items-center flex"
          }
          onClick={() => deleteNote(note)}
        >
          <Trash size={buttonIconSize} className="mr-1" />
          Delete note
        </button>
      </div>
    </div>
  );
};

export default NoteComponent;
