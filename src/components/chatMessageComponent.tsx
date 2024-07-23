"use client";
import { ConversationType, MessageTypeObj } from "@/lib/type";
import { NotebookPen, SpeechIcon } from "lucide-react";

import MarkdownView, { Markdown } from "react-showdown";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNoteContext } from "@/context/noteContext";

type ChatComponentType = {
  conv: ConversationType;
};

const ChatMessageComponent: FC<ChatComponentType> = ({
  conv: { message, type, sender },
}) => {
  const { takeNote } = useNoteContext();
  const handleSpeak = () => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance("message");
      utterance.rate = 1;
      utterance.pitch = 1;
      if (synth.speaking) {
        synth.cancel();
      } else {
        synth.speak(utterance);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const messageType = typeof message;
  const addNote = async () => {
    const data = { content: message };
    await takeNote(data);
  };
  return (
    <motion.div
      initial={{ transform: "scale(0)", opacity: 0 }}
      animate={{ transform: "scale(1)", opacity: 1 }}
      className={cn(
        "bg-secondary mb-5 bg-onBackground/50  rounded-md py-3 grid",
        sender === "user" && "justify-start rounded-full"
      )}
    >
      {/* <p className="pb-3 text-sm">
        {sender === "ai" ? "Rafikki" : sender === "system" ? "" : "you"}
      </p> */}
      {/* {sender === "ai" ? (
        <ReactTyped
          strings={[message]}
          typeSpeed={25}
          showCursor={false}
          className="mb-4 leading-8"
        />
      ) : ( */}
      <p className="text-sm font-bold mb-2">
        {sender === "ai" ? "Naala" : "You"}
      </p>

      {messageType === "string" ? (
        <p className="bg-secondary/60 p-3 rounded-lg">{message as string}</p>
      ) : (
        (message as MessageTypeObj[]).map((entry, index) => {
          const { title, paragraphs } = entry;

          return (
            <div className="bg-secondary/60 p-2 rounded-lg" key={index}>
              {title ? (
                <h1 className="pb-3 text-lg font-bold">{title}</h1>
              ) : null}
              {/* paragraph */}
              {paragraphs.map((paragraph, index) => {
                const { text, codes } = paragraph;

                const codeString: string | null =
                  codes && codes.length
                    ? codes.map((c) => c.code).join("\n")
                    : null;
                return (
                  <div className="" key={index}>
                    <p key={index} className="pb-3 leading-6">
                      <Markdown markdown={text} />
                    </p>
                    {codes && codeString !== "" && (
                      <p className="">{codeString}</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
      {/* <p className={cn("leading-8 mb-3")}>{message}</p> */}

      {sender === "ai" && (
        <div className="flex items-center mt-6">
          <button
            className="flex items-center  text-textColor/80  p-2 mr-2 rounded-md active:scale-95 justify-center"
            onClick={addNote}
          >
            <NotebookPen size={15} className="mr-1" />
          </button>
          <button
            className="flex items-center p-2 text-textColor/80 rounded-md active:scale-95 justify-center"
            onClick={handleSpeak}
            aria-label="Listen"
          >
            <SpeechIcon size={15} className="mr-1" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageComponent;
