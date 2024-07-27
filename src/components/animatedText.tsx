import { cn } from "@/lib/utils";
import { FC } from "react";
import { motion } from "framer-motion";

type ComponentType = {
  Wrapper: React.ElementType;
  text: string;
  classStyle: string;
};

const AnimatedTextComponent: FC<ComponentType> = ({
  Wrapper,
  text,
  classStyle,
}) => {
  let words = text.split(" ");
  let variants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1,
      },
    },
    hidden: {
      opacity: 0,
    },
  };
  return (
    <Wrapper className={cn(classStyle)}>
      <span className="sr-only">{text}</span>
      <motion.span
        initial="hidden"
        transition={{ staggerChildren: 0.1 }}
        animate="visible"
        className="inline-block"
      >
        {words.map((word, index) => {
          return (
            <motion.span key={index}>
              {word.split("").map((char, k) => {
                return (
                  <motion.span
                    key={k}
                    variants={variants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
              <span>&nbsp;</span>
            </motion.span>
          );
        })}
      </motion.span>
    </Wrapper>
  );
};

export default AnimatedTextComponent;
