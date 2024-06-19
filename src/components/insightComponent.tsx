import { InsightType } from "@/lib/type";
import { FC } from "react";
import InsightChartComponent from "./insightChartComponent";

type InsightPropsType = {
  insights: InsightType;
  message: string;
};

const InsightComponent: FC<InsightPropsType> = ({ message, insights }) => {
  const { recommended_topics, understanding_breakdowns } = insights;

  console.log(understanding_breakdowns);
  return (
    <div className="">
      <p>{message}</p>

      <div className="mt-5">
        <InsightChartComponent breakdowns={understanding_breakdowns} />
        <h1 className="text-2xl text-textColor/80">Recommended topics</h1>
        <div className="space-x-2 space-y-4">
          {recommended_topics.map((topic, index) => {
            return (
              <button
                className="p-2 rounded-full mr-2 ring-1 hover:ring-primary text-textColor/75 text-md"
                key={index}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InsightComponent;
