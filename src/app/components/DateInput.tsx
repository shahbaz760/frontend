import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";

import { InputAdornment, TextField } from "@mui/material";

const calenderIcon = (
  <svg
    width="22"
    height="23"
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_902_34772)">
      <path
        d="M15.583 3.45247H19.2497C19.4928 3.45247 19.7259 3.54905 19.8979 3.72096C20.0698 3.89287 20.1663 4.12603 20.1663 4.36914V19.0358C20.1663 19.2789 20.0698 19.5121 19.8979 19.684C19.7259 19.8559 19.4928 19.9525 19.2497 19.9525H2.74967C2.50656 19.9525 2.2734 19.8559 2.10149 19.684C1.92958 19.5121 1.83301 19.2789 1.83301 19.0358V4.36914C1.83301 4.12603 1.92958 3.89287 2.10149 3.72096C2.2734 3.54905 2.50656 3.45247 2.74967 3.45247H6.41634V1.61914H8.24967V3.45247H13.7497V1.61914H15.583V3.45247ZM13.7497 5.28581H8.24967V7.11914H6.41634V5.28581H3.66634V8.95247H18.333V5.28581H15.583V7.11914H13.7497V5.28581ZM18.333 10.7858H3.66634V18.1191H18.333V10.7858Z"
        fill="#393F4C"
      />
    </g>
    <defs>
      <clipPath id="clip0_902_34772">
        <rect
          width="22"
          height="22"
          fill="white"
          transform="translate(0 0.702393)"
        />
      </clipPath>
    </defs>
  </svg>
);
export default function DateInput() {
  const [cleared, setCleared] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <label className="inline-block text-[16px] font-medium leading-[20px] mb-[7px]">
        Billing Start Date ( Date of first payment )
      </label>
      <Box
        sx={{
          width: "100%",
          height: "48px",
          display: "flex",
          position: "relative",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className="me-[12px]">
                {calenderIcon}
              </InputAdornment>
            ),
          }}
          placeholder="Add Date"
          // label="Your Placeholder Text" // Set the label as your placeholder text
          sx={{
            background: "#f6f6f6",

            fontSize: "16px",
            borderRadius: "7px", // Border radius for the input
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove the outer border
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove the outer border on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none", // Remove the outer border when focused
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
