import ListLoading from "@fuse/core/ListLoading";
import { Box, Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import {
  DownArrowBlank,
  DownArrowIcon,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import React, { Suspense, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DatePopup from "../../DatePopup";
import { formatCurrency, formatCurrencyChart, getOnlyYear } from "src/utils";
import moment from "moment";
import { DownArrow } from "public/assets/icons/topBarIcons";

const ChurnOverviewChart = ({
  isLoading,
  churnDataList,
  setStartDate,
  setEndDate,
  setType,
  type,
  over_all_report,
}) => {
  // state to handle date filter anchorEl
  const [dateFilterAnchorEl, setDateFilterAnchorEl] =
    useState<null | HTMLElement>(null);

  // state to handle selected date filter option
  const [dateFilterSelectedOption, setDateFilterSelectedOption] =
    useState<string>("Current Year");
  const [previousSelectedOption, setPreviousSelectedOption] = useState<string>(
    dateFilterSelectedOption
  );
  // state to open custom date picker
  const [isModalOpen, setIsModalOpen] = useState(false);

  // show graph preview for overall time
  const [latestData, setLatestData] = useState<{
    total_churn_rate: number;
    total_revenue_churn: number;
    total_voluntary_churn: number;
    total_delinquent_churn: number;
  }>();

  // handler to open date filter option
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateFilterAnchorEl(event.currentTarget);
  };

  // handler to close date filter option
  const handleClose = () => {
    setDateFilterAnchorEl(null);
  };

  // handler to update type and open custom date picker on the basis of selected option
  const handleMenuItemClick = (option: string) => {
    setType(null);
    setPreviousSelectedOption(dateFilterSelectedOption);
    setDateFilterSelectedOption(option);
    handleClose();
    if (option === "Past Week") {
      setType(1);
    } else if (option === "Past Year") {
      setType(0);
    } else if (option === "Current Year") {
      setType(2);
    } else if (option === "Custom") {
      setType(3);
      setIsModalOpen(true);
    }
    if (option !== "Custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  // custom tooltip to show preview or particular bar
  const renderCustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const voluntaryChurn = payload[0]?.payload?.voluntaryChurn || 0;
      const delinquentChurn = payload[0]?.payload?.delinquentChurn || 0;
      const totalChurn = payload[0]?.payload?.totalChurn || 0;
      const churnRate = payload[0]?.payload?.churnRate || 0;
      const date = payload[0]?.payload?.date || 0;
      return (
        <div className="bg-[#fff]  sm:w-[300px] shadow-4 rounded-8">
          <p className="font-700 text-16 graphHoverLabelTop">
            {type === 1 ? (
              <>
                {moment(date).format("DD MMM YYYY")} , {label}
              </>
            ) : (
              <>
                {label} {getOnlyYear(date)}
              </>
            )}
          </p>
          <hr className="bg-[#EDF2F6] w-full my-16" />
          <div className="flex flex-col gap-20 px-16">
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#5954B0]"></span>
                <span>Voluntary Churn</span>
              </p>
              <p>{formatCurrency(voluntaryChurn)}</p>
            </Box>
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#9994F0]"></span>
                <span>Delinquent Churn</span>
              </p>
              <p>{formatCurrency(delinquentChurn)}</p>
            </Box>
            <Box className="tipContent">
              <p>
                {/* <span className="graphColorBox bg-[#6D65E9]"></span> */}
                <span>Total Churn</span>
              </p>
              <p>{formatCurrency(totalChurn)} </p>
            </Box>
          </div>
          <hr className="bg-[#EDF2F6] w-full mb-20  mt-48" />
          <Box className="tipContent graphHoverLabelBottom">
            <p>
              <span className="graphColorBox bg-[#3731A0]"></span>
              <span className="!font-700 text-[16px]">Churn Rate</span>
            </p>
            <p className="!font-700 text-[16px]">{churnRate}%</p>
          </Box>
        </div>
      );
    }
    return null;
  };

  // use effect to update over all preview for graph
  useEffect(() => {
    if (over_all_report) {
      setLatestData(over_all_report);
    }
  }, [churnDataList]);

  return (
    <div className="pt-20  bg-[#FFFFFF] rounded-6">
      <div className="flex justify-between mb-4 sm:px-20  px-10 ">
        <p className="text-[#0A0F18] text-[20px] font-600">Churn Overview</p>
        <Button
          onClick={handleClick}
          variant="contained"
          className="bg-[#EDEDFC]  min-h-[45px] rounded-[8px] flex items-center sm:justify-between font-400 text-[#4F46E5] whitespace-nowrap 
           pl-[21px] pr-[14px] "
          sx={{
            border: Boolean(dateFilterAnchorEl) ? "1px solid #4F46E5" : "none",
          }}
        >
          {dateFilterSelectedOption}
          <span>
            {!dateFilterAnchorEl ? <DownArrowIcon /> : <UpArrowIcon />}
          </span>
        </Button>
        <Menu
          anchorEl={dateFilterAnchorEl}
          open={Boolean(dateFilterAnchorEl)}
          onClose={handleClose}
          MenuListProps={{
            sx: {
              width: "100%",
              // marginTop: 2,
              marginRight: 2,
              "& ul": {
                padding: 1,
                listStyle: "none",
                overflowY: "auto",
              },
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick("Past Year")}>
            <ListItemText primary="Past Year" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Past Week")}>
            <ListItemText primary="Past Week" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Current Year")}>
            <ListItemText primary="Current Year" />
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Custom")}>
            <ListItemText primary="Custom" />
          </MenuItem>
        </Menu>
      </div>
      <hr className="bg-[#EDF2F6] w-full my-20" />
      {isLoading ? (
        <ListLoading />
      ) : (
        <>
          {/* Summary Boxes */}
          <div className="summary-boxes sm:px-20 overflow-y-auto px-10">
            <div className="summary-box">
              <p>{latestData?.total_churn_rate ?? "N/A"}%</p>
              <h6>
                <span className="graphColorBox bg-[#3731A0]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Churn Rate
                </span>
              </h6>
            </div>
            <span className="symbols"></span>

            <div className="summary-box">
              <p>{formatCurrency(latestData?.total_revenue_churn) ?? "N/A"}</p>
              <h6>
                {/* <span className="graphColorBox bg-[#6D65E9]"></span> */}
                <span className="ml-6 inline-block w-full text-left">
                  Total Churn
                </span>
              </h6>
            </div>
            <span className="symbols">=</span>
            <div className="summary-box">
              <p>
                {formatCurrency(latestData?.total_voluntary_churn) ?? "N/A"}
              </p>
              <h6>
                <span className="graphColorBox bg-[#5954B0]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Voluntary Churn
                </span>
              </h6>
            </div>
            <span className="symbols">+</span>

            <div className="summary-box">
              <p>
                {formatCurrency(latestData?.total_delinquent_churn) ?? "N/A"}
              </p>
              <h6>
                <span className="graphColorBox bg-[#9994F0]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Delinquent Churn
                </span>
              </h6>
            </div>
          </div>

          {/* Churn Overview Chart */}
          <ResponsiveContainer width="100%" height={400} className={"sm:px-20"}>
            <ComposedChart
              barSize={20}
              data={churnDataList}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"name"} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${formatCurrencyChart(value)}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Churn Rate",
                  angle: 90,
                  position: "insideRight",
                  offset: -10,
                  style: { textAnchor: "middle", fill: "#3731A0" },
                }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={renderCustomTooltip} />

              <Legend />

              {/* Voluntary and Delinquent Churn Bars */}
              <Bar
                yAxisId="left"
                dataKey="voluntaryChurn"
                stackId="a"
                fill="#5954B0"
                name="Voluntary Churn"
              />
              <Bar
                yAxisId="left"
                dataKey="delinquentChurn"
                stackId="a"
                fill="#9994F0"
                name="Delinquent Churn"
              />

              {/* Total Churn Line */}
              {/* <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalChurn"
                stroke="#6D65E9"
                name="Total Churn"
                display={"none"}
              /> */}

              {/* Churn Rate Line (right axis) */}
              <Line
                yAxisId="right" // Changed to right axis to separate it
                type="monotone"
                dataKey="churnRate"
                stroke="#3731A0" // Differentiated stroke color
                strokeWidth={3} // Increased stroke width
                dot={{ r: 5 }} // Set dot size
                activeDot={{ r: 8 }} // Set active dot size
                name="Churn Rate"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </>
      )}

      <Suspense>
        <DatePopup
          open={isModalOpen}
          handleToggle={() => setIsModalOpen(false)}
          modalTitle={"Add Custom Date"}
          btnTitle={"Apply"}
          closeTitle="Cancel"
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setDateFilterSelectedOption={setDateFilterSelectedOption}
          previousSelectedOption={previousSelectedOption}
        />
      </Suspense>
    </div>
  );
};

export default ChurnOverviewChart;
