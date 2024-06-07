import { ConversationType } from "@/lib/type";
import { NotebookPen, SpeechIcon } from "lucide-react";
import MarkdownView from "react-showdown";
import { FC } from "react";

type ChatComponentType = {
  conv: ConversationType;
};

const ChatMessageComponent: FC<ChatComponentType> = ({
  conv: { message, type, sender },
}) => {
  const handleSpeak = () => {
    try {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1;
      utterance.pitch = 1;
      if (synth.speaking) {
        synth.cancel();
      } else {
        synth.speak(utterance);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className="p-4rounded-md mb-5 bg-onBackground p-4 rounded-lg">
      <p className="pb-3 text-sm">{sender === "ai" ? "Ally" : "You"}</p>
      {/* {sender === "ai" ? (
        <ReactTyped
          strings={[message]}
          typeSpeed={25}
          showCursor={false}
          className="mb-4 leading-8"
        />
      ) : ( */}
      <MarkdownView
        markdown={message}
        className="leading-8 mb-3"
        options={{}}
      />
      {/* <p className={cn("leading-8 mb-3")}>{message}</p> */}

      {sender === "ai" && (
        <div className="flex items-center mt-6 space-x-4">
          <button className="flex items-center p-2 mr-2 text-gray-600 ring-1 ring-secondary rounded-md active:scale-95 justify-center">
            <NotebookPen size={15} className="mr-1" /> Take note
          </button>
          <button
            className="flex items-center p-2 text-textColor/80 ring-1 ring-secondary rounded-md active:scale-95 justify-center"
            onClick={handleSpeak}
          >
            <SpeechIcon size={15} className="mr-1" /> Listen
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessageComponent;
