import { InsightType } from "@/lib/type";
import { FC } from "react";
import InsightChartComponent from "./insightChartComponent";

type InsightPropsType = {
  insights: InsightType;
  message: string;
};

const InsightComponent: FC<InsightPropsType> = ({ message, insights }) => {
  const { understanding_breakdowns } = insights;

  return (
    <div className="space-y-3">
      <h1 className="text-lg">Let's see how you did </h1>
      <p>{message}</p>

      <div className="mt-5">
        <InsightChartComponent breakdowns={understanding_breakdowns} />
      </div>
    </div>
  );
};

export default InsightComponent;
