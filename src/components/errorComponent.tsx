import { ConversationType } from "@/lib/type";
import { RotateCcw } from "lucide-react";
import { FC } from "react";

type QueryErrorComponentType = {
  data: ConversationType;
};

const QueryErrorComponent: FC<QueryErrorComponentType> = ({ data }) => {
  const { message, retryQuery } = data;
  return (
    <div className="space-y-2">
      <h1>Oh no that didn't seem to work</h1>
      <p>{message}</p>

      <button className="p-3 py-2 bg-red-100 ring-1 ring-red-500 rounded-md flex items-center space-x-2 hover:bg-red-200">
        <span>Retry query</span> <RotateCcw size={15} />
      </button>
    </div>
  );
};

export default QueryErrorComponent;
