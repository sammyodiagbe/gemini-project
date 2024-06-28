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
import PomodoroTimerComponent from "./pomodoroTimerComponent";
import ThinkingAI from "./loadingAiComponent";
import { useLoadingContext } from "@/context/loadingStateContext";
import { useQuizContext } from "@/context/quizContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const ConversationComponent = () => {
  const { interactions, chatWithGemini, conversation, getFlashCard } =
    useConversationContext();
  const [message, setMessage] = useState("");
  const convoContainerRef = useRef<HTMLDivElement>(null);
  const { busyAI } = useLoadingContext();
  const { quizmode } = useQuizContext();

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
    if (quizmode) return;
    if (!message || message === "") return;
    setMessage("");
    await chatWithGemini(message);
    setMessage("");
  };

  return (
    <div
      ref={convoContainerRef}
      className="text-textColor py-2 max-h-screen overflow-y-auto"
    >
      <div className="relative grid grid-rows-[1fr_5rem] grid-cols-1 w-[46.87rem] h-full max-h-full mx-auto">
        {/* this would be the header of the chat */}
        {/* <div className=""></div> */}

        {/* this would be the conversation body */}

        <div className=" pb-[1.875rem] space-y-8">
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
                      conv={conv}
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
                    <InsightComponent
                      message={message}
                      insights={insights!}
                      key={index}
                    />
                  );
                default:
                  break;
              }
            })
          ) : (
            <div className="py-2 h-full  grid justify-center items-end ">
              {
                <div className="grid grid-cols-2 gap-[1.25rem]">
                  {!busyAI ||
                    (conversation.length < 0 &&
                      interactions.map((interaction, index) => {
                        return (
                          <PossibleInteractionComponent
                            interactionMessage={interaction.text}
                            key={index}
                          />
                        );
                      }))}
                </div>
              }
            </div>
          )}
        </div>
        {/* this woudl contain the textarea and other action btn */}
        <div className=" sticky bottom-1 w-full max-w-full">
          <div className="w-full  flex items-center py-4 bg-onBackground px-4 rounded-full">
            {!quizmode && (
              <AnimatePresence>
                <motion.div className="flex">
                  <QuizWrapperComponent />
                  <button
                    className={buttonClass}
                    onClick={() => getFlashCard()}
                    disabled={quizmode || busyAI}
                  >
                    <Gamepad className="mr-1" size={18} /> Flashcard
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
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
                disabled={quizmode}
              ></textarea>
              <button
                type="submit"
                disabled={quizmode}
                className={cn(
                  "w-[3.125rem] h-[3.125rem] text-white hover:bg-primary/70 rounded-full hover:text-white flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-purple-600",
                  quizmode && "cursor-not-allowed bg-gray-300 text-gray-700"
                )}
              >
                <Send size={24} />
              </button>
            </form>
            <PomodoroTimerComponent />
          </div>
          {busyAI && <ThinkingAI />}
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
