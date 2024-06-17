import { InsightType } from "@/lib/type";
import { FC } from "react";

type InsightPropsType = {
  insights: InsightType;
  message: string;
};

const InsightComponent: FC<InsightPropsType> = ({ message, insights }) => {
  const {} = insights;
  return (
    <div className="">
      <p>{message}</p>
    </div>
  );
};

export default InsightComponent;
