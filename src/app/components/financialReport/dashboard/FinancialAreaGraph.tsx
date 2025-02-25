import ListLoading from "@fuse/core/ListLoading";
import { Box } from "@mui/material";
import moment from "moment";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import {
  formatCurrency,
  getCurrentMonth,
  getOnlyYear,
  getPastMonth,
  getPastMonth2,
} from "src/utils";

const FinancialAreaGraph = ({
  height,
  graphName,
  graphData,
  isLoading,
  type,
  overAllData,
  overAllRate,
}) => {
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = payload[0]?.payload?.date || 0;
      const growth = payload[0]?.payload?.value || 0;

      return (
        <div className="bg-[#FFFFFF] md:w-[300px] shadow-4 rounded-8">
          <p className="font-700 text-16 graphHoverLabelTop">
            {moment(date).format("D MMMM YYYY")}
          </p>
          <hr className="bg-[#EDF2F6] w-full my-16" />
          <div className="mt-16 flex flex-col gap-20 px-16">
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#6D65E9]"></span>
                <span>{graphName}</span>
              </p>
              <p>
                {graphName !== "New Customer" ? formatCurrency(growth) : growth}
              </p>
            </Box>
          </div>
          <hr className="bg-[#EDF2F6] w-full my-10  mt-48" />
        </div>
      );
    }
    return null;
  };
  return (
    <div className={"shadow-xl rounded-8 bg-[#FFFFFF] financialChart"}>
      <div className="flex justify-between p-20   items-center">
        <div className="flex flex-col">
          <h5 className="text-[16px] font-500">{graphName}</h5>
          <span className="font-700 text-[30px] text-[#4F46E5]">
            {graphName !== "New Customer"
              ? formatCurrency(overAllData)
              : overAllData}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-500 text-[16px] text-[#4F46E5]">
            {overAllRate}%
          </span>
          <span className="font-500 text-[14px] text-black">
            {" "}
            Vs {type === 0 ? getPastMonth(true) : getPastMonth2(true)}
          </span>
        </div>
      </div>
      <ResponsiveContainer
        width="100%"
        height={height ? height : "100%"}
        className=" pb-10"
      >
        {isLoading ? (
          <ListLoading />
        ) : (
          <AreaChart
            width={500}
            height={height}
            data={graphData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <YAxis
              width={
                graphName === "New Customer"
                  ? 40
                  : graphName === "Churn"
                    ? 80
                    : undefined
              }
              tickFormatter={(value) =>
                `${graphName !== "New Customer" ? formatCurrency(value) : value}`
              }
            />

            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialAreaGraph;
