"use client";
import { usePopupContext } from "@/context/popupContext";
import { MessageCircleQuestion, NotebookPen } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const PopupComponent = () => {
  const { setSelected, selected, setCoord, coord } = usePopupContext();
  useEffect(() => {
    document.addEventListener("selectionchange", (event) => {
      console.log(event.target);
      const selection = document.getSelection();
      if (selection && selection.toString().length > 0) {
        const rect = selection?.getRangeAt(0).getBoundingClientRect();

        const { left, top, width } = rect;
        setCoord({
          x: left + width / 2 - 50,
          y: top + window.scrollY,
        });
        setSelected(true);
      } else {
        setSelected(false);
      }
    });

    document.addEventListener("mousedown", (event) => {
      const selection = document.getSelection();
      if (selection) {
        setSelected(false);
      }
    });
    return () => {
      document.removeEventListener("mousedown", () => {});
      document.removeEventListener("selectionchange", () => {});
    };
  }, []);
  if (!selected) return null;
  return (
    <motion.div
      className="absolute -top-[65px] left-0 bg-gradient-to-r space-x-2 from-fuchsia-600 to-purple-600  flex py-3 p-2 z-30 rounded-md"
      style={{ transform: `translate3d(${coord.x}px, ${coord.y}px, 0)` }}
    >
      <button className="flex  juify-center items-center space-x-1 text-white/80 hover:text-white">
        <MessageCircleQuestion size={14} /> <span className="">Explain</span>
      </button>
      <button className="flex justify-center items-center space-x-1 text-white/80 hover:text-white">
        <NotebookPen size={14} />
        <span className="">Add to note</span>
      </button>
    </motion.div>
  );
};

export default PopupComponent;
