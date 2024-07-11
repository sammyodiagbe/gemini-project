import { useConversationContext } from "@/context/conversationContext";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import TopicComponent from "./topicComponent";
import { useToastContext } from "@/context/toastContext";
import { useComponentInteractionsContext } from "@/context/componentInteractionContext";

const TopicsComponent = () => {
  const { topics, removeAllFocusTopics } = useConversationContext();
  const { updateToasts } = useToastContext();
  const { openTopicsMenu } = useComponentInteractionsContext();

  const removeAllFocus = async () => {
    await removeAllFocusTopics();
    const toast = {
      title: "Topics removed",
      body: "All added topics have been removed successfully",
    };
    updateToasts(toast);
  };

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-[40rem] h-full bg-onBackground space-y-2 p-2 z-[57] shadow-lg overflow-hidden overflow-y-auto transition-all duration-300 delay-400",
        !openTopicsMenu ? "w-0 delay-0 p-0" : ""
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center py-3 transition-all opacity-1 duration-75",
          !openTopicsMenu && " opacity-0"
        )}
      >
        <h1 className="text-lg font-bold text-textColor/80">
          Nala Generated topics.
        </h1>
        <button
          className="bg-backgroundColor/50 hover:bg-backgroundColor p-3 rounded-full"
          onClick={removeAllFocus}
        >
          Remove all
        </button>
      </div>
      {topics.map((topic, index) => {
        return <TopicComponent topic={topic} key={index} />;
      })}
    </div>
  );
};

export default TopicsComponent;
