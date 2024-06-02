"use client";

import { useConversationContext } from "@/context/conversationContext";
import PossibleInteractionComponent from "./possibleInteractionComponent";
import { BookText, SendHorizonal, Gamepad } from "lucide-react";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatMessageComponent from "./chatMessageComponent";

const ConversationComponent = () => {
  const { interactions, chatWithGemini, conversation } =
    useConversationContext();
  const [message, setMessage] = useState("");
  const convoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convoContainerRef === null) return;

    convoContainerRef.current?.scrollTo({
      top: convoContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation]);

  const sendMessage: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!message || message.trim() === "") return;
    await chatWithGemini(message);
    setMessage("");
  };

  return (
    <div
      ref={convoContainerRef}
      className="bg-white py-2 max-h-screen overflow-y-auto"
    >
      <div className="absolute bottom-0 left-0 py-2 w-full grid grid-cols-2 gap-[15px]">
        {interactions.map((interaction, index) => {
          return (
            <PossibleInteractionComponent
              interactionMessage={interaction.text}
              key={index}
            />
          );
        })}
      </div>
      <div className="grid grid-rows-[1fr_80px] grid-cols-1 w-[850px] h-full max-h-full mx-auto ">
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
        <div className="py-2 fixed w-[850px] bottom-2 shadow-sm border">
          <form className="w-full" onSubmit={sendMessage}>
            <div className="w-full flex items-center bg-white px-2 rounded-md">
              <div className="flex">
                <button className="flex items-center justify-center mr-2 p-2  rounded-md active:scale-95 bg-blue-100">
                  <BookText size={18} className="mr-1" /> Quiz Me
                </button>
                <button className="flex items-center justify-center p-2  bg-blue-100 rounded-md active:scale-95">
                  <Gamepad className="mr-1" size={18} /> Flashcard
                </button>
              </div>
              <input
                type="text"
                placeholder="What do you want to do? i.e Take quick notes."
                className="flex-1 border-none outline-none py-6 font-medium px-2"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
              <button className="w-[40px] h-[40px] text-white hover:bg-blue-400 rounded-md hover:text-white flex items-center justify-center bg-blue-500">
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
