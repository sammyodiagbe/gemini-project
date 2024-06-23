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
      <p>{message}</p>

      <button
        className="p-3 py-2  ring-1 mx-auto hover:bg-red-50 ring-red-500 rounded-md flex items-center space-x-2 hover:text-black/80"
        onClick={retryQ}
      >
        <span>Retry query</span> <RotateCcw size={15} />
      </button>
    </div>
  );
};

export default QueryErrorComponent;
