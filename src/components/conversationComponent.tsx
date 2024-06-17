"use client";

import { useConversationContext } from "@/context/conversationContext";
import { Gamepad, Send } from "lucide-react";
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
import QueryErrorComponent from "./errorComponent";
import PossibleInteractionComponent from "./possibleInteractionComponent";
import { buttonClass } from "@/lib/tailwind_classes";
import QuizWrapperComponent from "./quizWrapperComponent";
import InsightComponent from "./insightComponent";

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
    setMessage("");
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
      <div className="relative grid grid-rows-[1fr_80px] grid-cols-1 w-[700px] h-full max-h-full mx-auto">
        {/* this would be the header of the chat */}
        {/* <div className=""></div> */}

        {/* this would be the conversation body */}
        <div className=" pb-[30px] space-y-8">
          {conversation.length ? (
            conversation.map((conv, index) => {
              const { type, quiz, message, flashcard, insights } = conv;
              switch (type) {
                case "chat":
                  return <ChatMessageComponent conv={conv} key={index} />;
                case "quiz":
                  return (
                    <QuizMessageComponent
                      message={message}
                      quiz={quiz!}
                      key={index}
                    />
                  );
                case "flashcard":
                  return (
                    <FlashCardComponent
                      message={message}
                      flashcard={flashcard!}
                      key={index}
                    />
                  );
                case "error":
                  return <QueryErrorComponent data={conv} key={index} />;
                case "insights":
                  return (
                    <InsightComponent message={message} insights={insights!} />
                  );
                default:
                  break;
              }
            })
          ) : (
            <div className="py-2 h-full  grid justify-center items-end ">
              <div className="grid grid-cols-2 gap-[20px]">
                {interactions.map((interaction, index) => {
                  return (
                    <PossibleInteractionComponent
                      interactionMessage={interaction.text}
                      key={index}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* this woudl contain the textarea and other action btn */}
        <div className=" sticky bottom-3 w-full">
          <div className="w-full  flex items-center py-4 bg-onBackground px-4 rounded-full">
            <div className="flex">
              <QuizWrapperComponent />
              <button className={buttonClass} onClick={() => getFlashCard()}>
                <Gamepad className="mr-1" size={18} /> Flashcard
              </button>
            </div>
            <form
              className="w-full flex-1 flex items-center"
              onSubmit={sendMessage}
            >
              <textarea
                placeholder="What do you want to do? i.e Take quick notes."
                className="flex-1  outline-none border-none p-2 bg-transparent resize-none overflow-hidden self-center"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
                wrap="softwrap"
                rows={1}
              ></textarea>
              <button
                type="submit"
                className="w-[50px] h-[50px] text-white hover:bg-primary/70 rounded-full hover:text-white flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-purple-600"
              >
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
