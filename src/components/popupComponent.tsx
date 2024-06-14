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
      initial={{
        transform: `translate3d(${coord.x}px, ${coord.y}px, 0) scale(0)`,
        opacity: 0,
      }}
      animate={{
        transform: `translate3d(${coord.x}px, ${coord.y}px, 0) scale(1)`,
        opacity: 1,
      }}
      className="absolute -top-[50px] left-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white grid grid-cols-2 gap-[20px] py-3 p-2 z-30 rounded-md"
    >
      <span>
        <NotebookPen />
      </span>
      <MessageCircleQuestion />
    </motion.div>
  );
};

export default PopupComponent;
