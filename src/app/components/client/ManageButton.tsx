import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { updateSelectedColumn } from "app/store/Client";
import { ClientRootState } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import {
  DownArrowBlank,
  UpArrowBlank,
} from "public/assets/icons/dashboardIcons";
import * as React from "react";
import { useSelector } from "react-redux";

const names = [
  "ID",
  "Name",
  "Company Name",
  "Joining Date",
  "Subscription Status",
  "Account Status",
];

export default function ManageButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const clientState = useSelector((store: ClientRootState) => store.client);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };  

  const isItemSelected = (itemName: string) => {
    return clientState?.selectedColumn.indexOf(itemName) !== -1;
  };
  const handleToggleItem = (itemName: string) => () => {
    dispatch(updateSelectedColumn(itemName));
  };
  return (
    <div>
      <Button
        onClick={handleClick}
        variant="contained"
        className="bg-[#F6F6F6] min-w-[250px] min-h-[45px] rounded-[8px] flex items-center justify-between  font-400 text-[#757982]"
        sx={{ border: isOpen ? "1px solid #4F46E5" : "none" }}
      >
        Manage Columns
        <span>{!isOpen ? <DownArrowBlank /> : <UpArrowBlank />}</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          sx: {
            Height: 450, // Example: Set max height of the menu container
            width: 300,
            marginTop: 2,
            marginRight: 2,
            "& ul": {
              padding: 1, // Example: Remove padding from the ul element inside Paper
              listStyle: "none", // Example: Remove default list styles
              overflowY: "auto",
            },
          },
        }}
      >
        {names.map((name) => (
          <MenuItem key={name} onClick={handleToggleItem(name)}>
            <Checkbox
              checked={isItemSelected(name)}
              className="hover:bg-transparent "
            />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
