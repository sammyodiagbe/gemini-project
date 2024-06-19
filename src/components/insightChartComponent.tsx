import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  defaults,
} from "chart.js";
import { FC } from "react";
import { Bar } from "react-chartjs-2";

ChartJs.register(CategoryScale, LinearScale, BarElement);

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
  console.log(breakdowns);
  const labels = breakdowns.map(({ topic }) => topic);
  const points = breakdowns.map(({ understanding }) => understanding);
  return (
    <div className="my-8">
      <Bar
        data={{
          labels,
          datasets: [{ data: points, backgroundColor: ["#8338ec"] }],
        }}
      />
    </div>
  );
};

export default InsightChartComponent;
