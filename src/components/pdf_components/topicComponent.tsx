import { useComponentInteractionsContext } from "@/context/componentInteractionContext";
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
  const { openTopicsMenu } = useComponentInteractionsContext();
  const { lockingTopic } = useConversationContext()

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
  const disable = (lockingTopic !== null)
  return (
    <div
      className={cn(
        " p-2 flex space-x-4 items-center opacity-1 duration-75 delay-400 overflow-hidden",
        !openTopicsMenu && "opacity-0 delay-0"
      )}
    >
      <p className="flex-1 mr-3 text-sm">{topic}</p>
      <button
        disabled={disable}
        className={cn(
          "h-7 w-7 hover:font-bold hover:text-purple-500 disabled:text-foreground/30 disabled:cursor-not-allowed",
          focusTopics.includes(topic) && "text-purple-500", working && "text-foreground"
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
