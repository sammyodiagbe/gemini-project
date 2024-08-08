"use client";
import { ConversationType, MessageTypeObj } from "@/lib/type";
import { NotebookPen, SpeechIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNoteContext } from "@/context/noteContext";
import ReactMarkdown from "react-markdown";
import { ReactTyped } from "react-typed";
import MessageTypeComponent from "./chat/messageItem";
type ChatComponentType = {
  conv: ConversationType;
};

const ChatMessageComponent: FC<ChatComponentType> = ({
  conv: { message, type, sender, time },
}) => {
  const { takeNote } = useNoteContext();
  const [text, setText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
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
        " mb-5 rounded-sm py-3 grid",
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

      {/* <div className="prose lg:prose-xl">
        <p className="prose">{message}</p>
      </div> */}
      {!Array.isArray(message) ? (
        <p>{message}</p>
      ) : (
        message.map((m, index) => {
          return <MessageTypeComponent data={m} key={index} />;
        })
      )}

      {/* <p className={cn("leading-8 mb-3")}>{message}</p> */}
    </motion.div>
  );
};

export default ChatMessageComponent;
