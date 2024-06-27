import { AnimatePresence, motion } from "framer-motion";

const ThinkingAI = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute bottom-[100px] right-4 flex space-x-2 justify-center items-center h-[8] w-26"
      >
        <span className="sr-only">Loading...</span>
        <div className="h-4 w-4 bg-gradient-to-r from-fuchsia-600 to-purple-600  rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-textColor/70 to-purple-600  rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 bg-gradient-to-r from-fuchsia-600 to-purple-600  rounded-full animate-bounce"></div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThinkingAI;
