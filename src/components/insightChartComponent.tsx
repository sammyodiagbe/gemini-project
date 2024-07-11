import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  defaults,
} from "chart.js";
import { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

defaults.color = "#eff";

type ChartPropType = {
  breakdowns: TopicType[];
};

type TopicType = {
  topic: string;
  understanding: number;
  explanation: string;
};

const InsightChartComponent: FC<ChartPropType> = ({ breakdowns = [] }) => {
  interface DynamicObject<T> {
    [key: string]: T;
  }
  let chartConfig = {} satisfies ChartConfig;

  const tempobj: DynamicObject<any> = {};
  breakdowns.map(({ topic, understanding, explanation }) => {
    tempobj[topic] = {
      color: "purple",
      label: explanation,
    };
  });

  console.log(breakdowns);
  chartConfig = {};
  return (
    <div className="my-8 min-h-[350px]">
      <ChartContainer config={chartConfig} className="min-h-[350px] px-0 mx-0">
        <BarChart
          accessibilityLayer
          data={breakdowns}
          defaultShowTooltip={true}
          title="Your breakdown."
        >
          <CartesianGrid />
          <YAxis
            dataKey={"understanding"}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <XAxis
            dataKey={"topic"}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey={"understanding"}
            fill={`#8338ec`}
            radius={8}
            label="topic"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default InsightChartComponent;
