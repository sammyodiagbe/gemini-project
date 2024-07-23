import { useConversationContext } from "@/context/conversationContext";
import { ConversationType } from "@/lib/type";
import { RotateCcw } from "lucide-react";
import { FC } from "react";

type QueryErrorComponentType = {
  data: ConversationType;
};

const QueryErrorComponent: FC<QueryErrorComponentType> = ({ data }) => {
  const { message, retryQuery, errorOrigin } = data;
  const { attemptQueryRetry } = useConversationContext();

  const retryQ = () => {
    attemptQueryRetry(retryQuery, errorOrigin);
  };
  return (
    <div className="space-y-2 text-center">
      <h1>Oh Snap that didn't seem to work</h1>
      <p>{message as string}</p>

      <button
        className="p-3 py-2  ring-1 mx-auto hover:bg-red-400/35 ring-red-500 rounded-md flex items-center space-x-2 active:scale-95"
        onClick={retryQ}
      >
        <span>Retry query</span> <RotateCcw size={15} />
      </button>
    </div>
  );
};

export default QueryErrorComponent;
