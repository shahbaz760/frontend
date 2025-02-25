import React, { useEffect, useState } from "react";
import { Box, Typography, MenuItem, FormControl, Select } from "@mui/material";
import { Android12Switch } from "src/app/components/ToggleButton";
const AccessSelector = ({ label, options, initialValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [isPinChecked, setIsPinChecked] = useState<boolean>(
    initialValue || false
  );
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };
  useEffect(() => {
    setSelectedValue(initialValue);
    setIsPinChecked(initialValue == 1 ? true : false);
  }, [initialValue]);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      p={1}
      bgcolor="#fff"
      flexWrap="wrap"
      gap={{ sm: 0, xs: "10px" }}
    >
      {/* Left Label */}
      <Typography variant="body1" color="#111827" className="text-16">
        {label}
      </Typography>
      {/* Right Dropdown */}
      {options?.length > 0 ? (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedValue}
            onChange={handleChange}
            displayEmpty
            sx={{
              bgcolor: "#F6F6F6",
              height: "48px",
              color: "#757982", // Text color when 'Specific groups' is selected
              fontSize: "16px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none", // Removes the default border
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none", // Removes the border on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none", // Removes the border when focused
              },
              "& .MuiSelect-icon": {
                color: "#757982", // Icon color
              },
            }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Android12Switch
          colored={true}
          content={true}
          design={false}
          checked={isPinChecked}
          onChange={() => {
            onChange(!isPinChecked);
            setIsPinChecked(!isPinChecked);
          }}
        />
      )}
    </Box>
  );
};
export default AccessSelector;
