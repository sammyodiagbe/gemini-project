import { useConversationContext } from "@/context/conversationContext";
import { useToastContext } from "@/context/toastContext";
import { ToastType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import { FC, useState } from "react";

type ComponenentType = {
  topic: string;
};

const TopicComponent: FC<ComponenentType> = ({ topic }) => {
  const { focusTopics, addTopicToFocus, removeTopicFromFocus } =
    useConversationContext();
  const [working, setWorking] = useState<boolean>(false);
  const lockedin = focusTopics.includes(topic);
  const { updateToasts, toasts } = useToastContext();

  const performAction = async () => {
    if (working) return;
    setWorking(true);
    const toast: ToastType = !lockedin
      ? {
          title: "Topic locked in",
          body: `${topic} has been successfully locked in`,
          type: "success",
        }
      : {
          title: "Topic removed",
          body: `${topic} has been removed from focus`,
          type: "success",
        };
    if (!lockedin) {
      await addTopicToFocus(topic);
    } else {
      await removeTopicFromFocus(topic);
    }
    setWorking(false);
    updateToasts(toast);
  };
  return (
    <div className=" p-2 flex space-x-4 items-center ">
      <p className="flex-1 mr-3">{topic}</p>
      <button
        className={cn(
          "h-7 w-7 hover:font-bold hover:text-purple-500",
          focusTopics.includes(topic) && "text-purple-500"
        )}
        onClick={performAction}
      >
        {working ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Lock size={18} />
        )}
      </button>
    </div>
  );
};

export default TopicComponent;
