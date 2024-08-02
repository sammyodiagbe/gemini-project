import { InsightType } from "@/lib/type";
import { FC } from "react";
import InsightChartComponent from "./insightChartComponent";
import TimeComponent from "./timeComponent";

type InsightPropsType = {
  insights: InsightType;
  message: string;
  time: number;
};

const InsightComponent: FC<InsightPropsType> = ({
  message,
  insights,
  time,
}) => {
  const { breakdowns } = insights;

  return (
    <div className="space-y-3">
      <TimeComponent time={time!} />

      <h1 className="text-lg">Let's see how you did </h1>
      <p>{message}</p>

      <div className="mt-5">
        <InsightChartComponent breakdowns={breakdowns} />
      </div>
    </div>
  );
};

export default InsightComponent;
