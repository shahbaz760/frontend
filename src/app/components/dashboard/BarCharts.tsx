import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import {
  DownArrowBlank,
  DownArrowIcon,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import React, { Suspense, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DatePopup from "../DatePopup";
import { useAppDispatch } from "app/store/store";
import { useSelector } from "react-redux";
import { AuthRootState } from "app/store/Auth/Interface";
import { setSelectedOption, setSelectedOptionBar } from "app/store/Auth";
import { setDate } from "date-fns";

// import { DatePicker } from "material-ui";

const sevenDayData = [
  { name: "M", hour: 60, type: 0 },
  { name: "T", hour: 80, type: 0 },
  { name: "W", hour: 60, type: 0 },
  { name: "T", hour: 80 },
  { name: "F", hour: 50 },
  { name: "S", hour: 40 },
  { name: "S", hour: 30 },
];

const customData = [
  { name: "1", hour: 20 },
  { name: "2", hour: 30 },
  { name: "3", hour: 50 },
  { name: "4", hour: 70 },
  { name: "5", hour: 40 },
  { name: "6", hour: 60 },
  { name: "7", hour: 30 },
  { name: "8", hour: 50 },
  { name: "9", hour: 70 },
  { name: "10", hour: 20 },
];

interface DataPoint {
  name: string;
  hour: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload?: any }[];
}

const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
      {`${payload.value}`}
    </text>
  );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-[#ffffff] h-40 w-[auto] flex flex-col items-center justify-center p-10 rounded-6 shadow-lg">
        <p className="label font-400">{`Total Subscription: ${payload[0].value} `}</p>

        <p className="label font-400">{`Amount: $${payload[0]?.payload?.total_price} `}</p>
      </div>
    );
  }
  return null;
};

const BarCharts = ({ graphdata, fetchData }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<DataPoint[]>(sevenDayData);
  // const [selectedOption, setSelectedOption] = useState<string>("Past 7 Days");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const selectedOptionBar = useSelector((store: AuthRootState) => store?.auth);
  const displayItems = selectedOptionBar?.selectedOptionBar;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option: string) => {
    dispatch(setSelectedOptionBar(option));
    handleClose();
    if (option === "Past 7 Days") {
      fetchData(0, "", "", 2);
      setStartDate("");
      setEndDate("");
    } else if (option === "Custom") {
      setIsModalOpen(true);
    }
  };

  const handleApplyCustomDates = () => {
    setIsModalOpen(false);
    fetchData(2, startDate, endDate, 2);
  };

  useEffect(() => {
    dispatch(setSelectedOptionBar("Past 7 days"));
  }, []);

  useEffect(() => {
    setData(graphdata);
  }, [graphdata]);

  useEffect(() => {
    if (startDate && endDate) {
      handleApplyCustomDates();
    }
  }, [startDate, endDate]);

  return (
    <div className="py-20 sm:px-20 px-10 bg-[#FFFFFF] rounded-6">
      <div className="relative">
        <div className="flex justify-between mb-4 ">
          <p className="text-[#0A0F18] text-[20px] font-600">Sales  </p>
          <Button
            onClick={handleClick}
            variant="contained"
            className="bg-[#EDEDFC]  min-h-[45px] rounded-[8px] flex items-center justify-between font-400 text-[#4F46E5]"
            sx={{ border: Boolean(anchorEl) ? "1px solid #4F46E5" : "none" }}
          >
            {displayItems}
            <span>{!anchorEl ? <DownArrowIcon /> : <UpArrowIcon />}</span>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{
              sx: {
                width: "100%",
                // marginTop: 2,
                marginRight: 2,
                "& ul": {
                  padding: 1, // Example: Remove padding from the ul element inside Paper
                  listStyle: "none", // Example: Remove default list styles
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick("Past 7 Days")}>
              <ListItemText primary="Past 7 Days" />
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Custom")}>
              <ListItemText primary="Custom" />
            </MenuItem>
          </Menu>
        </div>
        <Suspense>
          <DatePopup
            dropDownKey="sales"
            open={isModalOpen}
            handleToggle={() => setIsModalOpen(false)}
            modalTitle={"Add Custom Date"}
            btnTitle={"Apply"}
            closeTitle="Cancel"
            // disabled={!startDate || !endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            axisLine={{ stroke: "#4F46E5", strokeWidth: 0 }}
            tickLine={false}
            interval={0}
            tickMargin={10}
            fontSize={13}
          />
          <YAxis
            tick={<CustomYAxisTick />}
            tickLine={false}
            strokeWidth={0}
            fontSize={10}
            tickMargin={20}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="total"
            fill="#4E47E5"
            barSize={20}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
