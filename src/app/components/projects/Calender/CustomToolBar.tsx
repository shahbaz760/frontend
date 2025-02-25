import { Button, Menu, MenuItem } from "@mui/material";
import { DownArrowBlack, SortIcon } from "public/assets/icons/projectsIcon";
import React, { useEffect, useState } from "react";
import { CalendarToolbarProps } from "react-big-calendar";
import {
  CalenderLeftIcon,
  CalenderRightIcon,
} from "../../../../../public/assets/icons/calender";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownArrow } from "public/assets/icons/topBarIcons";
import { DownArrowIcon } from "public/assets/icons/dashboardIcons";
import { UpArrowBlacks, UpArrowWhite } from "public/assets/icons/subscription";

interface CustomToolbarProps extends CalendarToolbarProps {
  localizer: any; // Use a specific type based on your localization library
  label: string;
  onView: (view: string) => void;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({
  localizer,
  label,
  onView,
  onNavigate,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedView, setSelectedView] = useState<string>(""); // Default selected view

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const savedView = localStorage.getItem("selectedView");
    if (savedView) {
      setSelectedView(savedView);
      onView(savedView); // Trigger view change if there's a saved view
    }
  }, [onView]);

  const handleViewSelect = (view: string) => {
    setSelectedView(view); // Update selected view
    onView(view); // Trigger view change
    localStorage.setItem("selectedView", view);
    handleCloseMenu();
  };

  return (
    <div className="flex items-center justify-between  border-1 px-20 py-20 rounded-t-md ">
      <div className="cursor-pointer flex items-center gap-10 py-10  ">
        <CalenderLeftIcon
          onClick={() => onNavigate("PREV")}
          className="-mr-3 hover:bg-none"
        ></CalenderLeftIcon>
        <span className="font-600 text-[#111827] text-[18px] ">{label}</span>{" "}
        <CalenderRightIcon
          onClick={() => onNavigate("NEXT")}
          className="-mr-9 hover:bg-none"
        ></CalenderRightIcon>
      </div>
      <div className="flex items-center justify-end">
        <Button
          onClick={handleOpenMenu}
          endIcon={!anchorEl ? <SortIcon /> : <UpArrowBlacks />}
          className="px-10 py-5 rounded-6"
          style={{ minWidth: 0 }}
        >
          {getViewLabel(selectedView)}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleViewSelect("month")}>Month</MenuItem>
          <MenuItem onClick={() => handleViewSelect("week")}>Week</MenuItem>
          <MenuItem onClick={() => handleViewSelect("day")}>Day</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

const getViewLabel = (view: string): string => {
  switch (view) {
    case "month":
      return "Month";
    case "week":
      return "Week";
    case "day":
      return "Day";
    default:
      return "View";
  }
};

export default CustomToolbar;
