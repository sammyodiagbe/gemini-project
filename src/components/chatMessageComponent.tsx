import { ConversationType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { FC } from "react";

type ChatComponentType = {
  conv: ConversationType;
};

const ChatMessageComponent: FC<ChatComponentType> = ({
  conv: { message, type, sender },
}) => {
  return (
    <div className="py-2">
      <p className={cn("leading-8")}>{message}</p>
      <p className="py-3">{sender === "ai" ? "AI" : "You"}</p>
    </div>
  );
};

export default ChatMessageComponent;
