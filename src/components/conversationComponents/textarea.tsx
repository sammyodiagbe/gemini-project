"use client";

import { useConversationContext } from "@/context/conversationContext";
import { useQuizContext } from "@/context/quizContext";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useRef, useState } from "react";
import ConversationHeader from "../convoHeaderComponent";
import ThinkingAI from "../loadingAiComponent";

const PromptInputContainer = () => {
    const { chatWithGemini,   } = useConversationContext()
    const { quizmode, busyAI } = useQuizContext()
    const [message, setMessage] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const sendMessage: FormEventHandler<HTMLFormElement> = async (
        event: FormEvent<HTMLFormElement>
      ) => {
        event.preventDefault();
        if (quizmode) return;
        if (!message || message === "") return;
        setMessage("");
        await chatWithGemini(message);
        setMessage("");
      };
      const handleTextChange: ChangeEventHandler = (
        event: ChangeEvent<HTMLTextAreaElement>
      ) => {
        if (event.target.value.length <= 200) {
          setMessage(event.target.value);
    
          const ref = textAreaRef.current!;
    
          ref.style.height = "auto";
          ref.style.height = `${ref.scrollHeight}px`;
        }
      };
    
    return <div className="relative flex-none w-full max-w-full z-10 rounded-full">
    <form
      className="w-full flex-1 flex items-center"
      onSubmit={sendMessage}
    >
      <div className=" relative w-[42.87em] mx-auto  flex items-center bg-secondary/90 py-2  px-2 rounded-md ">
        <textarea
          placeholder="What do you want to do? i.e Explain xyz"
          className="flex-1 min-h-[40px] py-2  outline-none border-none p-2 bg-transparent resize-none self-center"
          value={message}
          onChange={handleTextChange}
          wrap="softwrap"
          disabled={quizmode}
          ref={textAreaRef}
          rows={1}
        ></textarea>
        <button
          type="submit"
          disabled={quizmode || busyAI}
          className={cn(
            "w-[3rem] h-[3rem] text-white hover:bg-primary/70 rounded-md hover:text-white flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-purple-600",
            quizmode && "cursor-not-allowed bg-gray-300 text-gray-700"
          )}
        >
          <Send size={18} color="white"/>
        </button>
        {busyAI ? <ThinkingAI /> : null}
    <ConversationHeader />
      </div>
    </form>
  </div>
}

export default PromptInputContainer;