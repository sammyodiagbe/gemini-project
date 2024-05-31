import PossibleInteractionComponent from "./possibleInteractionComponent";
import { SendHorizonal } from "lucide-react";

const ConversationComponent = () => {
  const possibleInteractions = [
    "Summarize the article for me.",
    "Bring out the key points",
    "Do something with the pdf",
    "Create quize questions",
  ];
  return (
    <div className="bg-gray-200 py-2">
      <div className="grid grid-rows-[80px_1fr_80px] grid-cols-1 w-[750px] h-full mx-auto">
        {/* this would be the header of the chat */}
        <div className=""></div>

        {/* this would be the conversation body */}
        <div className=" overflow-hidden relative">
          <div className="absolute bottom-0 left-0 py-2 w-full grid grid-cols-2 gap-[15px]">
            {possibleInteractions.map((interaction, index) => {
              return (
                <PossibleInteractionComponent
                  interactionMessage={interaction}
                  key={index}
                />
              );
            })}
          </div>
        </div>
        {/* this woudl contain the textarea and other action btn */}
        <div className="py-2">
          <form className="w-full">
            <div className="w-full flex items-center bg-white px-2 rounded-md">
              <input
                type="text"
                placeholder="What do you want to do ?"
                className="flex-1 border-none outline-none py-6 font-semibold px-2"
              />
              <button className="w-[40px] h-[40px] bg-gray-200 hover:bg-blue-400 rounded-md hover:text-white flex items-center justify-center">
                <SendHorizonal size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
