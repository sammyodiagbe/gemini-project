"use client";

import { useConversationContext } from "@/context/conversationContext";
import PossibleInteractionComponent from "./possibleInteractionComponent";
import { SendHorizonal } from "lucide-react";
import { FormEvent, FormEventHandler, useState } from "react";
import ChatMessageComponent from "./chatMessageComponent";

const ConversationComponent = () => {
  const { interactions, chatWithGemini, conversation } =
    useConversationContext();
  const [message, setMessage] = useState("");

  const sendMessage: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!message || message.trim() === "") return;
    chatWithGemini(message);
  };

  return (
    <div className="bg-gray-200 py-2 max-h-screen overflow-y-auto">
      {/* <div className="absolute bottom-0 left-0 py-2 w-full grid grid-cols-2 gap-[15px]">
            {interactions.map((interaction, index) => {
              return (
                <PossibleInteractionComponent
                  interactionMessage={interaction.text}
                  key={index}
                />
              );
            })}
          </div> */}
      <div className="grid grid-rows-[1fr_80px] grid-cols-1 w-[750px] h-full max-h-full mx-auto ">
        {/* this would be the header of the chat */}
        {/* <div className=""></div> */}

        {/* this would be the conversation body */}
        <div className="relative pb-[100px]">
          {conversation &&
            conversation.map((conv, index) => {
              return <ChatMessageComponent conv={conv} key={index} />;
            })}
        </div>
        {/* this woudl contain the textarea and other action btn */}
        <div className="py-2 fixed w-[750px] bottom-2">
          <form className="w-full" onSubmit={sendMessage}>
            <div className="w-full flex items-center bg-white px-2 rounded-md">
              <input
                type="text"
                placeholder="What do you want to do ?"
                className="flex-1 border-none outline-none py-6 font-medium px-2"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
              <button className="w-[40px] h-[40px] bg-gray-200 hover:bg-blue-400 rounded-md hover:text-white flex items-center justify-center">
                <SendHorizonal size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
