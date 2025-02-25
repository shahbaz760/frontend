import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { setSelectedOption, setSelectedOptionBar } from "app/store/Auth";
import enUS from "date-fns/locale/en-US";
import moment from "moment";
import { CrossIcon } from "public/assets/icons/common";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { useDispatch } from "react-redux";
const StylesDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      width: "387",
    },
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
interface SelectionRange {
  startDate: Date;
  endDate: Date;
  key: string;
}
type DatePopupProps = {
  modalTitle: string;
  open: boolean;
  handleToggle: any;
  btnTitle: string;
  closeTitle: string;
  maxWidth?: string;
  setStartDate: any;
  dropDownKey?: string;
  setEndDate: any;
  startDate?: string;
  endDate?: string;
  setDateFilterSelectedOption?: any; // Replaced AnyARecord with any
  previousSelectedOption?: any;
};

export default function DatePopup({
  modalTitle,
  open,
  handleToggle,
  btnTitle,
  closeTitle,
  maxWidth = "733",
  setStartDate,
  dropDownKey = "",
  setEndDate,
  startDate = "",
  endDate = "",
  setDateFilterSelectedOption,
  previousSelectedOption = "",
}: DatePopupProps) {
  const [disable, setDisable] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const handleCustomGraphData = () => {
    setDateFilterSelectedOption(previousSelectedOption);
    // handleMenuItemClick(previousSelectedOption);
  };

  const dispatch = useDispatch();
  const handleApplyDates = () => {
    if (setStartDate) {
      setStartDate(moment(state[0].startDate).format("YYYY-MM-DD"));
    }
    if (setEndDate) {
      setEndDate(moment(state[0].endDate).format("YYYY-MM-DD"));
    }
  };
  const [isMobile, setIsMobile] = useState(false);
  // Update the `isMobile` state based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576); // Adjust breakpoint for mobile devices
    };
    window.addEventListener("resize", handleResize);
    // Initial check on component mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StylesDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleToggle(e);
      }}
      sx={{
        ".MuiPaper-root": {
          maxWidth: `${maxWidth}px`,
          "@media (max-width: 340px)": {
            maxWidth: "320px", // Apply maxWidth of 320px when screen is less than 340px
          },
        },
        ".muiltr-5gnc0a-MuiPaper-root-MuiDialog-paper": {
          backgroundColor: "white",
        },
      }}
    >
      <div
        className={`p-10 flex justify-between w-full items-center
       bg-[#2C334C]
        `}
      >
        <Typography
          className={`text-[16px] font-semibold"
          text-[#fff]
          `}
        >
          {modalTitle}
        </Typography>
        <IconButton>
          <CrossIcon
            className="cursor-pointer"
            color="#fff"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(e);
            }}
          />
        </IconButton>
      </div>
      <DateRangePicker
        onChange={(item) => {
          //@ts-ignore
          setState([item.selection]);
          setDisable(true);
        }}
        //@ts-ignore
        sx={{
          width: "100%",
        }}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        locale={enUS}
        // months={2}
        months={isMobile ? 1 : 2}
        ranges={state}
        // direction="horizontal"
        direction={isMobile ? "vertical" : "horizontal"}
        renderStaticRangeLabel={() => null}
      />
      {/* <div className="p-20 pb-0">{children}</div> */}
      <div className="flex p-20 pt-20">
        <Button
          variant="contained"
          color="secondary"
          className={`${!state[0].startDate || !state[0].endDate ? "btn-disable" : ""
            } w-[156px] h-[48px] text-[16px] font-400`}
          onClick={(e) => {
            e.stopPropagation();
            handleApplyDates();
            handleToggle(e);
          }}
          disabled={!state[0].startDate || !state[0].endDate}
        >
          {btnTitle}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          className={`
           w-[156px] h-[48px] text-[16px] font-400 ml-14`}
          onClick={(e) => {
            e.stopPropagation();

            if (location.pathname.includes("dashboard")) {
              if (!(startDate && endDate)) {
                if (dropDownKey === "newClient") {
                  // Dispatch for newClient dropdown
                  dispatch(setSelectedOption("Past 7 Days"));
                } else if (dropDownKey === "sales") {
                  // Dispatch for sales dropdown
                  dispatch(setSelectedOptionBar("Past 7 Days"));
                }
              } else {
                // Handle the case where dates are not selected (optional logic)
                console.log();
              }
              handleToggle(e);
            } else {
              handleCustomGraphData();
              handleToggle(e);
            }
          }}
        >
          {closeTitle}
        </Button>
      </div>
    </StylesDialog>
  );
}
