"use client";
import { usePopupContext } from "@/context/popupContext";
import { MessageCircleQuestion, NotebookPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNoteContext } from "@/context/noteContext";
import { NoteType } from "@/lib/type";

const PopupComponent = () => {
  const { setSelected, selected, setCoord, coord } = usePopupContext();
  const { takeNote } = useNoteContext();
  const [selectedText, setSelectedText] = useState("");
  const addNoteRef = useRef(null);
  const explainRef = useRef(null);
  useEffect(() => {
    document.addEventListener("selectionchange", (event) => {
      const selection = document.getSelection();
      if (selection && selection.toString().length > 0) {
        const rect = selection?.getRangeAt(0).getBoundingClientRect();

        const { left, top, width } = rect;
        setCoord({
          x: left + width / 2 - 50,
          y: top + window.scrollY,
        });
        setSelected(true);
        setSelectedText(selection.toString());
      }
    });

    document.addEventListener("mousedown", (event) => {
      const selection = document.getSelection();
      console.log(selection?.toString());
      console.log(event.target);
      if (selection) {
        console.log(selection);
      }
    });

    return () => {
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("selectionchange", () => {});
    };
  }, []);

  const addNote = async () => {
    if (!selected) return;
    const data: NoteType = { content: selectedText };

    await takeNote(data);
    setSelected(false);
    setSelectedText("");
  };
  if (!selected) return null;
  return (
    <motion.div
      className="absolute -top-[65px] left-0 bg-gradient-to-r space-x-2 from-fuchsia-600 to-purple-600  flex py-3 p-2 z-30 rounded-md"
      style={{ transform: `translate3d(${coord.x}px, ${coord.y}px, 0)` }}
    >
      <button
        className="flex  juify-center items-center space-x-1 text-white/80 hover:text-white"
        ref={explainRef}
      >
        <MessageCircleQuestion size={14} /> Explain
      </button>
      <button
        className="flex justify-center items-center space-x-1 text-white/80 hover:text-white"
        onClick={addNote}
        ref={addNoteRef}
      >
        <NotebookPen size={14} />
        <span className="">Add to note</span>
      </button>
    </motion.div>
  );
};

export default PopupComponent;
