import { useConversationContext } from "@/context/conversationContext";
import { buttonIconSize, cn } from "@/lib/utils";
import { ListRestartIcon, Lock, X } from "lucide-react";
import TopicComponent from "./topicComponent";
import { useComponentInteractionsContext } from "@/context/componentInteractionContext";
import { useState } from "react";

const TopicsComponent = () => {
  const { topics, errorGeneratingTopics, retryGeneratingTopics } =
    useConversationContext();
  const [regeneratingTopics, setRegeneratingTopics] = useState(false);
  const { openTopicsMenu, closeTopicsMenu: close } =
    useComponentInteractionsContext();

  const closeTopicMenu = () => {
    close();
  };

  const regenerateTopics = async () => {
    setRegeneratingTopics(true);
    await retryGeneratingTopics();
    setRegeneratingTopics(false);
  };

  return (
    <div
      className={cn(
        "custom-scrollbar absolute top-0 left-0 w-[35rem] h-full bg-background space-y-2 p-2 z-[150] shadow-lg overflow-hidden overflow-y-auto transition-all duration-300 delay-400",
        !openTopicsMenu ? "w-0 delay-0 p-0" : ""
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center py-3 transition-all opacity-1 duration-75",
          !openTopicsMenu && " opacity-0"
        )}
      >
        <h1 className="text-md font-bold text-textColor/80">
          Nala Generated topics.
        </h1>
        <button
          className="bg-backgroundColor/50 hover:bg-backgroundColor p-3 rounded-full"
          onClick={() => closeTopicMenu()}
        >
          <X size={buttonIconSize} />
        </button>
      </div>
      <div className="topics">
        {errorGeneratingTopics ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="w-50 text-center flex flex-col justify-center items-center space-y-3">
              <h1 className="text-lg font-bold">Oh that didn't seem to work</h1>
              <button
                disabled={regeneratingTopics}
                className=" flex justify-center bg-secondary items-center p-2 rounded-md"
              >
                <ListRestartIcon
                  size={buttonIconSize}
                  className="mr-1"
                  onClick={regenerateTopics}
                />
                {regeneratingTopics
                  ? "Regenerating topics"
                  : "Regenerate Topics"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {topics.map((topic, index) => {
              return <TopicComponent topic={topic} key={index} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default TopicsComponent;
