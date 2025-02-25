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

const GrowthRateGraph = ({
  isLoading,
  growthRateDataList,
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
    new: number | null;
    reactivation: number | null;
    churn: number | null;
    net_new_mrr: number | null;
    growth_rate: number | null;
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
      const newCustomer = payload[0]?.payload?.new || 0;
      const net_new_mrr = payload[0]?.payload?.net_new_mrr || 0;
      const reactivation = payload[0]?.payload?.reactivation || 0;
      const existing = payload[0]?.payload?.existing || 0;
      const churn = payload[0]?.payload?.churn || 0;
      const growth_rate = payload[0]?.payload?.growth_rate || 0;
      const date = payload[0]?.payload?.date || 0;

      return (
        <div className="bg-[#FFFFFF]  sm:w-[380px] shadow-4 rounded-8">
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
          <div className="mt-16 flex flex-col gap-20 px-16">
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#6D65E9]"></span>
                <span>Net New</span>
              </p>
              <p>{formatCurrency(newCustomer)}</p>
            </Box>
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#5954B0]"></span>
                <span>Reactivation</span>
              </p>
              <p>{formatCurrency(reactivation)}</p>
            </Box>{" "}
            {/* <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#9994F0]"></span>
                <span>Net New MRR</span>
              </p>
              <p>{formatCurrency(net_new_mrr)} </p>
            </Box> */}
            <Box className="tipContent">
              <p>
                <span className="graphColorBox bg-[#F44336]"></span>
                <span>Churn</span>
              </p>
              <p>{formatCurrency(churn)} </p>
            </Box>
          </div>
          <hr className="bg-[#EDF2F6] w-full mb-20  mt-48" />
          <Box className="tipContent graphHoverLabelBottom">
            <p>
              <span className="graphColorBox bg-[#221E62]"></span>
              <span className="!font-700 text-[16px]">Growth Rate</span>
            </p>
            <p className="!font-700 text-[16px]">{growth_rate}%</p>
          </Box>{" "}
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
  }, [growthRateDataList]);

  return (
    <div className="pt-20  bg-[#FFFFFF] rounded-6">
      <div className="flex justify-between mb-4 sm:px-20 px-10 sm:items-center">
        <p className="text-[#0A0F18] text-[20px] font-600">Growth Rate</p>
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
          <div className="summary-boxes sm:px-20 px-10 overflow-y-auto">
            <div className="summary-box">
              <p>{latestData?.growth_rate}%</p>
              <h6>
                <span className="graphColorBox bg-[#221E62]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Growth Rate{" "}
                </span>
              </h6>
            </div>
            <span className="symbols"></span>
            <div className="summary-box">
              <p>{formatCurrency(latestData?.net_new_mrr)}</p>
              <h6>
                {/* <span className="graphColorBox bg-[#221E62]"></span> */}
                <span className="ml-6 inline-block w-full text-left">
                  Net new MRR{" "}
                </span>
              </h6>
            </div>
            <span className="symbols">=</span>
            <div className="summary-box">
              <p>{formatCurrency(latestData?.new)}</p>
              <h6>
                <span className="graphColorBox bg-[#6D65E9]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Net new
                </span>
              </h6>
            </div>
            <span className="symbols">+</span>
            <div className="summary-box">
              <p>{formatCurrency(latestData?.reactivation)}</p>
              <h6>
                <span className="graphColorBox bg-[#5954B0]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Reactivation
                </span>
              </h6>
            </div>
            <span className="symbols">-</span>
            <div className="summary-box">
              <p>{formatCurrency(latestData?.churn)}</p>
              <h6>
                <span className="graphColorBox bg-[#F44336]"></span>
                <span className="ml-6 inline-block w-full text-left">
                  Churn
                </span>
              </h6>
            </div>
          </div>

          {/* Churn Overview Chart */}
          <ResponsiveContainer width="100%" height={400} className={"sm:px-20"}>
            <ComposedChart
              barSize={20}
              data={growthRateDataList}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${formatCurrencyChart(value)}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Growth Rate",
                  angle: 90,
                  position: "insideRight",
                  offset: -10,
                  style: { textAnchor: "middle", fill: "#221E62" },
                }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend />
              {/* Voluntary and Delinquent Churn Bars */}
              <Bar
                yAxisId="left"
                dataKey="new"
                stackId="a"
                fill="#6D65E9"
                name="New"
              />
              <Bar
                yAxisId="left"
                dataKey="reactivation"
                stackId="a"
                fill="#5954B0"
                name="Reactivation"
              />{" "}
              {/* <Bar
                yAxisId="left"
                dataKey="net_new_mrr"
                stackId="a"
                fill="#9994F0"
                name="New MRR"
              /> */}
              <Bar
                yAxisId="left"
                dataKey="churn"
                stackId="a"
                fill="#F44336"
                name="Churn"
              />
              {/* Churn Rate Line (right axis) */}
              <Line
                yAxisId="right" // Changed to right axis to separate it
                type="monotone"
                dataKey="growth_rate"
                stroke="#3731A0" // Differentiated stroke color
                strokeWidth={1} // Increased stroke width
                // dot={{ r: 4 }} // Set dot size
                strokeDasharray="5 5"
                activeDot={{ r: 8 }} // Set active dot size
                name="Growth Rate"
                dot={(dotProps) => {
                  return (
                    <circle
                      cx={dotProps.cx}
                      cy={dotProps.cy}
                      r={2} // Dot size
                      fill={dotProps.payload.isActive ? "#221E62" : "#221E62"} // Color based on active/inactive status
                      stroke={dotProps.stroke}
                    />
                  );
                }}
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

export default GrowthRateGraph;
