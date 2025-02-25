import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Checkbox,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { RootState } from "app/store/store";
import { useFormik } from "formik";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SelectField from "../selectField";

const StyledSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  borderRadius: "8px",
  backgroundColor: "#f6f6f6",
  lineHeight: 1.4,
  "&.MuiInputBase-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: "1px",
        borderColor: theme.palette.secondary.main,
      },
    },
    "& .MuiSelect-select": {
      padding: "0px 14px",
      minHeight: "48px",
      display: "flex",
      alignItems: "center",
      lineHeight: 1,
      color: "#000000",
    },
    "& .MuiSelect-icon": {
      color: "#666666",
    },
  },
}));

export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

const NestedFilterDesign = ({
  op = "0",
  onChange,
  setValue,
  filterState,
  value,
  selectMenuItems,
}) => {
  const { filterStatus } = useSelector((state: RootState) => state.billing);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const filteredItems =
    searchQuery != ""
      ? filterState?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : filterState;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSearchQuery("");
  };
  const menuLable = {
    0: "Status",
    1: "Assignee",
    2: "Priority",
    3: "Label",
    4: "Due Date",
    5: "Created By",
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    onSubmit: (values) => { },
  });

  const handleOpChange = (e) => {
    onChange(Number(e.target.value));
  };

  const handleSelectChange = (event) => {
    const selectedValues = event.target.value.map((value) => value.toString());
    setValue(selectedValues);
  };

  const handleSearchChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setSearchQuery(event.target.value);
  };

  const handleSelectAll = () => {
    if (searchQuery != "") {
      if (value?.length == filteredItems?.length) {
        setValue([]);
      } else {
        setValue(filteredItems.map((item) => item.column.toString()));
      }
    } else {
      if (value?.length == filterState?.length) {
        setValue([]);
      } else {
        setValue(filterState?.map((item) => item.column.toString()));
      }
    }
  };

  const fixedWidthMenu = {
    width: "365px", // Set the fixed width here
  };

  return (
    <div className="flex justify-between gap-20">
      <div
        className={`${op == "0" || op == "1" ? "w-[100px]" : op == "" ? "w-[100px]" : "w-full"}`}
      >
        <SelectField
          name="op"
          value={op ? op : "0"}
          onChange={handleOpChange}
          sx={{
            "&.MuiInputBase-root": {
              "& .MuiSelect-select": {
                minHeight: "40px",
                minWidth: op == "0" || op == "1" ? "100px" : "295px",
              },
            },
          }}
        >
          <MenuItem value="0">Is</MenuItem>
          <MenuItem value="1">Is not</MenuItem>
          <MenuItem value="2">Is set</MenuItem>
          <MenuItem value="3">Is not set</MenuItem>
        </SelectField>
      </div>
      {(op == "0" || op == "1" || op == "") && (
        <div className="flex-1 w-full min-w-[200px]  ">
          <StyledSelect
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            multiple
            displayEmpty
            onOpen={() => setSearchQuery("")}
            value={value}
            onChange={handleSelectChange}
            renderValue={(selected) => {
              //@ts-ignore
              if (selected.length == 0) {
                return `Select ${menuLable[selectMenuItems]}`;
              }
              return (
                <TruncateText
                  text={filterState
                    //@ts-ignore
                    ?.filter((item) =>
                      //@ts-ignore
                      selected?.includes(item?.column?.toString())
                    )
                    ?.map((item) => item.name)
                    ?.join(", ")}
                  maxWidth={150}
                />
              );
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Limit dropdown height
                  width: "365px", // Fixed width
                  overflow: "auto", // Enable scrolling
                },
              },
            }}
            sx={{
              "&.MuiInputBase-root": {
                "& .MuiSelect-select": {
                  minHeight: "40px",
                },
              },
            }}
          >
            <div>
              <TextField
                hiddenLabel
                variant="standard"
                placeholder={`Search ${menuLable[selectMenuItems]}`}
                select={false}
                onKeyDown={(e) => e.stopPropagation()}
                // value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  height: "50px",
                  paddingLeft: "3px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  borderBottom: "1px solid #EDF2F6",
                  "& .MuiInputBase-input": {
                    border: "none",
                    paddingLeft: "8px",
                  },
                  "& .MuiInputAdornment-root": {
                    marginLeft: "8px",
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
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => e.stopPropagation()}
              />
              {/* {searchQuery == "" &&  */}
              {filteredItems?.length > 0 && (
                <Button
                  onClick={() => handleSelectAll()}
                  style={{ textAlign: "right" }}
                >
                  {value.length == filterState?.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              )}
              {/* } */}
            </div>

            {filterStatus == "loading" ? (
              <ListLoading />
            ) : (
              filteredItems?.map((item) => (
                <MenuItem key={item.column} value={item?.column?.toString()}>
                  <Checkbox
                    checked={value.includes(item?.column?.toString())}
                    className="hover:!bg-transparent"
                  />
                  <ListItemText primary={item?.name ? item?.name : "N/A"} />
                </MenuItem>
              ))
            )}
          </StyledSelect>
        </div>
      )}
    </div>
  );
};

export default NestedFilterDesign;
