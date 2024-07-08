import { useConversationContext } from "@/context/conversationContext";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import TopicComponent from "./topicComponent";
import { useToastContext } from "@/context/toastContext";

const TopicsComponent = () => {
  const { topics, removeAllFocusTopics } = useConversationContext();
  const { updateToasts } = useToastContext();

  const removeAllFocus = async () => {
    await removeAllFocusTopics();
    const toast = {
      title: "Topics removed",
      body: "All added topics have been removed successfully",
    };
    updateToasts(toast);
  };

  return (
    <div className="absolute top-0 left-0 w-[40rem] h-full bg-onBackground space-y-2 p-2 z-[57] shadow-lg overflow-hidden overflow-y-auto">
      <div className="flex justify-between items-center py-3">
        <h1 className="text-lg font-bold text-textColor/80">
          Ally Generated topics.
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
