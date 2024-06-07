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
import QuizMessageComponent from "./QuizMessageComponent";
import FlashCardComponent from "./flashCardComponent";

const ConversationComponent = () => {
  const {
    interactions,
    chatWithGemini,
    conversation,
    startQuizMode,
    getFlashCard,
  } = useConversationContext();
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
    if (!message || message === "") return;
    await chatWithGemini(message);
    setMessage("");
  };

  const startQuiz = () => {
    console.log("Attempting to start the quiz");
    startQuizMode();
  };

  return (
    <div
      ref={convoContainerRef}
      className="bg-backgroundColor text-textColor py-2 max-h-screen overflow-y-auto"
    >
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
      <div className="grid grid-rows-[1fr_80px] grid-cols-1 w-[850px] h-full max-h-full mx-auto ">
        {/* this would be the header of the chat */}
        {/* <div className=""></div> */}

        {/* this would be the conversation body */}
        <div className="relative pb-[100px]">
          {conversation &&
            conversation.map((conv, index) => {
              const { type, quiz, message, flashcard } = conv;
              switch (type) {
                case "chat":
                  return <ChatMessageComponent conv={conv} key={index} />;
                case "quiz":
                  return <QuizMessageComponent quiz={quiz!} />;
                case "flashcard":
                  return (
                    <FlashCardComponent
                      message={message}
                      flashcard={flashcard!}
                    />
                  );
                  break;
                default:
                  break;
              }
            })}
        </div>
        {/* this woudl contain the textarea and other action btn */}
        <div className="py-2 fixed w-[850px] bottom-2 rounded-md">
          <form className="w-full" onSubmit={sendMessage}>
            <div className="w-full flex items-center py-3 rounded-md bg-onBackground px-4">
              <div className="flex">
                <button
                  className="flex items-center justify-center mr-2 p-2 py-3  rounded-md active:scale-95 ring-1 ring-secondary  text-textColor/70 text-secondary"
                  onClick={startQuiz}
                >
                  <BookText size={18} className="mr-1" /> Quiz Me
                </button>
                <button
                  className="flex items-center justify-center p-2 py-3 ring-1 ring-secondary  text-textColor/70 rounded-md active:scale-95 text-secondary"
                  onClick={() => getFlashCard()}
                >
                  <Gamepad className="mr-1" size={18} /> Flashcard
                </button>
              </div>
              <input
                type="text"
                placeholder="What do you want to do? i.e Take quick notes."
                className="flex-1 border-none outline-none py-6 font-medium px-2 bg-transparent"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
              <button
                type="submit"
                className="w-[40px] h-[40px] text-white hover:bg-accentColor rounded-md hover:text-white flex items-center justify-center bg-accentColor"
              >
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
