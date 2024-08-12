import { buttonIconSize } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderPinwheel } from "lucide-react";

const ThinkingAI = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 150 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ y: 150, opacity: 0 }}
        className="fixed bottom-[100px] z-30 right-4 flex justify-evenly items-center h-[30px] w-[60px] rounded-full bg-onBackground"
      >
        <LoaderPinwheel size={20} className="animate-spin" />
      </motion.div>
    </AnimatePresence>
  );
};

export default ThinkingAI;
