import { InputAdornment, TextField } from "@mui/material";
import { CrossGreyIcon } from "public/assets/icons/common";
import { SearchIcon } from "public/assets/icons/topBarIcons";

interface IProps {
  name: string;
  placeholder: string;
  onChange?: any;
  handleInputClear?: any;
  inputValue?: string;
}

function SearchInput({
  name,
  placeholder,
  onChange,
  handleInputClear,
  inputValue,
}: IProps) {
  return (
    <div
      className="w-full sm:w-[286px] mb-3 sm:mb-0  "
      // style={{ width: "286px" }}
    >
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        name={name}
        defaultValue=""
        value={inputValue}
        variant="standard"
        placeholder={placeholder}
        onChange={onChange}
        className="flex sm:items-center justify-center"
        sx={{
          height: "50px",
          pr: 2,
          backgroundColor: "#F6F6F6",
          borderRadius: "8px",
          border: "1px solid transparent",
          "&:focus-within": {
            border: "1px solid blue",
          },
          "& .MuiInputBase-input": {
            border: "none",
            paddingLeft: "8px", // Adjust left padding of the input
          },
          "& .MuiInputAdornment-root": {
            marginLeft: "8px", // Adjust left margin of the adornment (icon)
          },
          "& .MuiInput-underline:before": {
            border: "none !important",
          },
          "& .MuiInput-underline:after": {
            borderBottom: "none !important",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#757982",
            opacity: 1,
            fontSize: "15px",
            lineHeight: "14px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                width: 15,
                display: "inline-flex",
              }}
            >
              {inputValue !== "" ? (
                <CrossGreyIcon
                  className="cursor-pointer fill-[#c2cad2] h-[14px]"
                  onClick={handleInputClear}
                />
              ) : (
                // Render an empty icon to occupy space when inputValue is empty
                <div className="w-[24px] " />
              )}
              {/* You can add more icons conditionally here */}
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default SearchInput;
