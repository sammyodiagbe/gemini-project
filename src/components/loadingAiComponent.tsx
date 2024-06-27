import { AnimatePresence, motion } from "framer-motion";

const ThinkingAI = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute bottom-[100px] ring-1 ring-purple/70 z-30 right-4 flex justify-evenly items-center h-[30px] w-[60px] rounded-full bg-onBackground"
      >
        <span className="sr-only">Loading...</span>
        <div className="h-2 w-2 bg-gradient-to-r from-fuchsia-600 to-purple-600  rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-textColor/70 to-purple-600  rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gradient-to-r from-fuchsia-600 to-purple-600  rounded-full animate-bounce"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThinkingAI;
