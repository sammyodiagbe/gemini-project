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
import PromptInputContainer from "./conversationComponents/textarea";

const ConversationComponent = () => {
  const { interactions, conversation } = useConversationContext();
  const convoContainerRef = useRef<HTMLDivElement>(null);
  const messagesConRef = useRef<HTMLDivElement>(null)
  const { busyAI } = useLoadingContext();
  const { quizmode } = useQuizContext();

  const { openTopicsMenu } = useComponentInteractionsContext();

  useEffect(() => {
    if (convoContainerRef) {
      convoContainerRef.current!.scrollTo({
        top: convoContainerRef.current!.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversation]);

  return (
    <div
      className={cn(
        " custom-scrollbar flex-1 flex pb-0 max-h-screen relative",
        openTopicsMenu ? "" : ""
      )}
    >
      <div className={cn("  flex m-0 relative w-full")}>
        {/* <ConversationHeader /> */}
        <div className="flex flex-col mx-auto relative w-full">
          <div
           ref={convoContainerRef}
            className=" w-full relative h-full max-h-full overflow-y-scroll mx-auto flex-grow"
          >
            {/* this would be the header of the chat */}
            {/* <div className=""></div> */}

            {/* this would be the conversation body */}
            <div  
            id="conversation" className=" w-[42.87rem] mx-auto h-full  flex-1 pb-[1.875rem] space-y-8">
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
                <div className="p-2 h-full grid  justify-center items-end z-10 ">
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
          </div>
          <PromptInputContainer />
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
