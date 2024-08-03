"use client";
import { ConversationType, MessageTypeObj } from "@/lib/type";
import { NotebookPen, SpeechIcon } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNoteContext } from "@/context/noteContext";
import MarkDownView from "react-showdown";

type ChatComponentType = {
  conv: ConversationType;
};

const ChatMessageComponent: FC<ChatComponentType> = ({
  conv: { message, type, sender, time },
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

  const addNote = async () => {
    const data = { content: message };
    await takeNote(data);
  };
  return (
    <motion.div
      initial={{ transform: "scale(0)", opacity: 0 }}
      animate={{ transform: "scale(1)", opacity: 1 }}
      className={cn(
        "bg-secondary mb-5 rounded-md py-3 grid",
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
      <p className="flex justify-between items-center text-sm font-bold mb-2">
        <span>{sender === "ai" ? "Naala" : "You"}</span>
        {time && <span>time taken: {Math.round(time)}s</span>}
      </p>

      <p className="bg-secondary/60 p-3 rounded-lg">
        {Array.isArray(message) ? (
          message.map((m, index) => {
            const {
              title,
              paragraphs,
            }: { title: string; paragraphs: { text: string }[] } = m;
            return (
              <div className="">
                <h1 key={index}>{title}</h1>
                <div className="space-y-2">
                  {paragraphs.map((paragraph, ind) => {
                    const { text } = paragraph;
                    return (
                      <MarkDownView
                        markdown={text}
                        key={ind}
                        className="leading-6"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p>{message}</p>
        )}
      </p>

      {/* <p className={cn("leading-8 mb-3")}>{message}</p> */}
    </motion.div>
  );
};

export default ChatMessageComponent;
