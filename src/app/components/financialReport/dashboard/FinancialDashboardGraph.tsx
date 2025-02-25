import React, { SetStateAction } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Legend,
  Bar,
} from "recharts";
import TitleBar from "../../TitleBar";
import { Box, Button } from "@mui/material";
import {
  formatCurrency,
  formatCurrencyChart,
  getCurrentMonth,
  getOnlyYear,
  getPastMonth,
  getPastMonth2,
} from "src/utils";
import ListLoading from "@fuse/core/ListLoading";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = payload[0]?.payload?.date || 0;
    const growth_rate = payload[0]?.payload?.growth_rate || 0;
    const growth = payload[0]?.payload?.growth || 0;

    return (
      <div className="bg-[#FFFFFF] md:w-[300px] shadow-4 rounded-8">
        <p className="font-700 text-16 graphHoverLabelTop">
          {label} {getOnlyYear(date)}
        </p>
        <hr className="bg-[#EDF2F6] w-full my-16" />
        <div className="mt-16 flex flex-col gap-20 px-16">
          <Box className="tipContent">
            <p>
              <span className="graphColorBox bg-[#6D65E9]"></span>
              <span>Growth</span>
            </p>
            <p>{formatCurrency(growth)}</p>
          </Box>
        </div>
        <hr className="bg-[#EDF2F6] w-full mb-\  mt-48" />
      </div>
    );
  }
  return null;
};

const FinancialDashboardGraph = ({
  height,
  growthData,
  type,
  setType,
  isLoading,
  overAllGrowth,
  overAllGrowthRate,
}: {
  height?: number;
  growthData: [];
  setType: React.Dispatch<SetStateAction<number>>;
  type: number;
  isLoading: boolean;
  overAllGrowth: number;
  overAllGrowthRate: number;
}) => (
  <div className={"pb-10 shadow-xl rounded-8 financialChart bg-[#FFFFFF]"}>
    <TitleBar title="This Month's Growth" />
    <hr />
    <div className="p-28 flex flex-col md:flex-row justify-between gap-20">
      <div className="flex  justify-between gap-24 sm:gap-36 items-center">
        <span className="FinancialDashboardGraphAmount">
          {formatCurrency(overAllGrowth)}
        </span>
        <div className="flex flex-col">
          <span className="font-500 text-[16px] text-[#4F46E5]">
            {overAllGrowthRate}%
          </span>
          <span className="font-500 text-[14px] text-black whitespace-nowrap">
            Vs {type === 0 ? getPastMonth(true) : getPastMonth2(true)}
          </span>
        </div>
      </div>
      <div className="flex gap-10 w-full sm:justify-center justify-between md:justify-end">
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            "@media (max-width: 600px)": {
              "&:hover": {
                borderColor: "transparent", // Hides the border on hover for mobile
              },
            },
          }}
          className={`rounded-8 text-[#4F46E5] ${type !== 0 ? "bg-inherit" : "!bg-[#EDEDFC]"} border-transparent`}
          onClick={() => setType(0)}
        >
          {getCurrentMonth()}
        </Button>
        <Button
          variant="outlined"
          sx={{
            "@media (max-width: 600px)": {
              "&:hover": {
                borderColor: "transparent", // Hides the border on hover for mobile
              },
            },
          }}
          color="secondary"
          className={`rounded-8 text-[#4F46E5] ${type !== 1 ? "bg-inherit" : "!bg-[#EDEDFC]"} border-transparent`}
          onClick={() => setType(1)}
        >
          {getPastMonth()}
        </Button>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={height ? height : 300}>
      {isLoading ? (
        <ListLoading />
      ) : (
        <ComposedChart
          barSize={40}
          data={growthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey={"name"} />
          {/* <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(value) => `${formatCurrency(value)}`}
          /> */}
          <YAxis
            // yAxisId="right"
            // orientation="right"
            label={{
              value: "Growth",
              angle: 90,
              position: "insideLeft",
              offset: -5,
              style: { textAnchor: "middle", fill: "#3731A0" },
            }}
            tickFormatter={(value) => `${formatCurrencyChart(value)}`}
          />
          <Tooltip content={CustomTooltip} cursor={{ stroke: "transparent" }} />

          {/* <Legend /> */}

          {/* Voluntary and Delinquent Churn Bars */}
          <Bar
            // yAxisId="left"
            dataKey="growth"
            stackId="a"
            fill="#e0deff"
            name="Voluntary Churn"
          />

          {/* Churn Rate Line (right axis) */}
          <Line
            // yAxisId="right" // Changed to right axis to separate it
            type="monotone"
            dataKey="growth"
            stroke="#3731A0" // Differentiated stroke color
            strokeWidth={1} // Increased stroke width
            dot={(dotProps) => {
              return (
                <circle
                  cx={dotProps.cx}
                  cy={dotProps.cy}
                  r={2} // Dot size
                  fill={dotProps.payload.isActive ? "#3731A0" : "#3731A0"} // Color based on active/inactive status
                  stroke={dotProps.stroke}
                />
              );
            }}
            activeDot={{ r: 8 }} // Set active dot size
            name="Churn Rate"
          />
        </ComposedChart>
      )}
    </ResponsiveContainer>
  </div>
);

export default FinancialDashboardGraph;
