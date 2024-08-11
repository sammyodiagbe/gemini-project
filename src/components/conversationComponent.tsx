"use client";

import { useConversationContext } from "@/context/conversationContext";
import { Send } from "lucide-react";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import ChatMessageComponent from "./chatMessageComponent";
import QuizMessageComponent from "./QuizMessageComponent";
import FlashCardComponent from "./flashCardComponent";
import QueryErrorComponent from "./errorComponent";
import PossibleInteractionComponent from "./possibleInteractionComponent";
import InsightComponent from "./insightComponent";
import PomodoroTimerComponent from "./pomodoroTimerComponent";
import ThinkingAI from "./loadingAiComponent";
import { useLoadingContext } from "@/context/loadingStateContext";
import { useQuizContext } from "@/context/quizContext";
import { cn } from "@/lib/utils";
import ConversationHeader from "./convoHeaderComponent";
import { useComponentInteractionsContext } from "@/context/componentInteractionContext";

const ConversationComponent = () => {
  const { interactions, chatWithGemini, conversation } =
    useConversationContext();
  const [message, setMessage] = useState("");
  const convoContainerRef = useRef<HTMLDivElement>(null);
  const { busyAI } = useLoadingContext();
  const { quizmode } = useQuizContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { openTopicsMenu } = useComponentInteractionsContext()

  useEffect(() => {
    if (convoContainerRef === null) return;

    const observer = new MutationObserver(() => {
      convoContainerRef.current?.scrollTo({
        top: convoContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    observer.observe(convoContainerRef?.current!, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);

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

  const handleKeydown: KeyboardEventHandler = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {};

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
      
      id="conversation"
      className={cn("flex-1 flex pb-0 max-h-screen relative overflow-y-auto", openTopicsMenu ? "" : "")}
    >
      <div className={cn("flex m-0", !openTopicsMenu ? "w-[50.75rem]  mx-auto" : "w-full")}>
      <ConversationHeader />
      <div className="w-[48.87rem] mx-auto relative">
        <div className="relative flex flex-col  w-full h-full max-h-full mx-auto flex-1">
          {/* this would be the header of the chat */}
          {/* <div className=""></div> */}

          {/* this would be the conversation body */}
          <div className=" flex-1 pb-[1.875rem] space-y-8 overflow-y-auto px-2"  ref={convoContainerRef}>
            {conversation.length ? (
              conversation.map((conv, index) => {
                let {
                  type,
                  quiz,
                  message: mess,
                  flashcard,
                  insights,
                  time,
                } = conv;
                let message = mess as string;
                switch (type) {
                  case "chat":
                    return <ChatMessageComponent conv={conv} key={index} />;
                  case "quiz":
                    return (
                      <QuizMessageComponent
                        message={message as string}
                        quiz={quiz!}
                        key={index}
                        time={time!}
                      />
                    );
                  case "flashcard":
                    return (
                      <FlashCardComponent
                        message={message}
                        flashcard={flashcard!}
                        key={index}
                        time={time!}
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
                        time={time!}
                      />
                    );
                  default:
                    break;
                }
              })
            ) : (
              <div className="p-2 h-full grid justify-center items-end z-10 ">
                {
                  <div className="grid grid-cols-2 gap-[1.25rem]">
                    {!busyAI &&
                      !quizmode &&
                      interactions.map((interaction, index) => {
                        return (
                          <PossibleInteractionComponent
                            interactionMessage={interaction.text}
                            key={index}
                          />
                        );
                      })}
                  </div>
                }
              </div>
            )}
          </div>
          {/* this woudl contain the textarea and other action btn */}
          <div className=" left-0 bottom-5 w-full max-w-full z-10 rounded-full">
            <form
              className="w-full flex-1 flex items-center"
              onSubmit={sendMessage}
            >
              <div className="w-full  flex items-center bg-secondary/70 py-2  px-2 rounded-md overflow-y-hidden">
                <textarea
                  placeholder="What do you want to do? i.e Explain xyz"
                  className="flex-1 min-h-[40px] py-2  outline-none border-none p-2 bg-transparent resize-none overflow-hidden self-center"
                  value={message}
                  onChange={handleTextChange}
                  onKeyDown={handleKeydown}
                  wrap="softwrap"
                  disabled={quizmode}
                  ref={textAreaRef}
                  rows={1}
                ></textarea>
                <button
                  type="submit"
                  disabled={quizmode}
                  className={cn(
                    "w-[3rem] h-[3rem] text-white hover:bg-primary/70 rounded-md hover:text-white flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-purple-600",
                    quizmode && "cursor-not-allowed bg-gray-300 text-gray-700"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            {busyAI && <ThinkingAI />}
          </div>
        </div>
      
      </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
