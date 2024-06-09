import { ConversationType } from "@/lib/type";
import { FC } from "react";

type QueryErrorComponentType = {
  data: ConversationType;
};

const QueryErrorComponent: FC<QueryErrorComponentType> = ({ data }) => {
  const { message, retryQuery } = data;
  return (
    <div>
      <h1>Oh no that didn't seem to work</h1>
      <p>{message}</p>

      <button className="p-4 bg-red-200">Retry query</button>
    </div>
  );
};

export default QueryErrorComponent;
