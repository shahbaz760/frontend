import { InputAdornment, TextField } from "@mui/material";
import { CrossGreyIcon } from "public/assets/icons/common";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { useState } from "react";
import ManageButton from "./ManageButton";

const ClientTabButton = () => {
  const [inputValue, setInputValue] = useState("");

  const handleClearInput = () => {
    setInputValue("");
  };
  return (
    <div className="flex flex-col gap-10 sm:flex-row">
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        defaultValue=""
        variant="standard"
        placeholder="Search"
        sx={{
          pl: 2,
          // border: "1px solid blue",
          backgroundColor: "#F6F6F6",
          borderRadius: "8px",
          "&:focus-within": {
            border: "1px solid blue", // Show border when focused
          },
          "& .MuiInputBase-input": {
            textDecoration: "none", // Example: Remove text decoration (not typically used for input)
            border: "none", // Hide the border of the input element
          },
          "& .MuiInput-underline:before": {
            border: "none !important", // Hide the underline (if using underline variant)
          },
          "& .MuiInput-underline:after": {
            borderBottom: "none !important", // Hide the underline (if using underline variant)
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="p-2" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {inputValue && (
                <CrossGreyIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleClearInput}
                />
              )}
            </InputAdornment>
          ),
        }}
      />

      {/* <input type="text" placeholder="enter></input> */}
      <ManageButton />
    </div>
  );
};

export default ClientTabButton;
