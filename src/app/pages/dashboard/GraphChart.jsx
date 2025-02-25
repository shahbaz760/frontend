// src/components/MyChart.js
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dataSets = {
  week: [50, 60, 70, 80, 90, 100, 110],
  month: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
  year: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320],
};

const labels = {
  week: ["S", "M", "T", "W", "T", "F", "S"],
  month: ["Week 1", "Week 2", "Week 3", "Week 4"],
  year: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const GraphChart = () => {
  const [range, setRange] = useState("week");
  const handleChange = (event) => {
    setRange(event.target.value);
  };

  const data = {
    labels: labels[range],
    datasets: [
      {
        label: "New Clients",
        data: dataSets[range],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="header">
        <h1 className="title">New Clients</h1>
        <select onChange={handleChange} value={range}>
          <option value="week">Past 7 Days</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      <Line data={data} options={options} />
    </>
  );
};

export default GraphChart;
