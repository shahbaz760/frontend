import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";

import { Chip } from "@mui/material";
import { useAppDispatch } from "app/store/store";
import { RightIcon } from "public/assets/icons/projectsIcon";
import DropdownMenu from "../Dropdown";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function ProjectMenuItems(props) {
  const { icon, label, className, setTableSelectedItemDesign, groupMenuData, initial } = props;
  const [groupMenu, setGroupMenu] = React.useState<HTMLElement | null>(null);
  const [activeItem, setActiveItem] = React.useState(initial || 0); // State to keep track of active item

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  const dispatch = useAppDispatch()
  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setActiveItem(index); // Set the clicked item as active

  };
  const handleClose = () => {
    setGroupMenu(null);
    if (initial == null) {
      setActiveItem(0)

    }
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    label: string,
    value: string
  ) => {
    handleClick(event, index); // Handle the click event
    handleClose(); // Close the menu
    setTableSelectedItemDesign(value);
    setActiveItem(value)
  };

  const activeLabel =
    activeItem !== null
      ? `${label}: ${groupMenuData && groupMenuData[activeItem].label}`
      : label;

  return (
    <div>
      <div className="flex gap-20">
        <DropdownMenu
          anchorEl={groupMenu}
          handleClose={() => setGroupMenu(null)}
          button={
            <Chip
              onClick={(event) => setGroupMenu(event.currentTarget)}
              label={activeLabel}
              icon={icon}
              className={className}
              style={
                !!activeItem || activeItem == 0
                  ? { border: "1px solid #393F4C" }
                  : {}
              }
            />
          }
          popoverProps={{
            open: !!groupMenu,
            classes: {
              paper: "pt-10 pb-20",
            },
          }}
        >


          {groupMenuData?.map((item, index) => {
            const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
              padding: "8px 20px",
              minWidth: "250px",

              backgroundColor:
                activeItem == item?.value
                  ? alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  )
                  : "transparent",
            }));

            return (
              <StyledMenuItem
                key={index}
                onClick={(event) =>
                  handleMenuItemClick(event, index, item.label, item.value)
                }
                className="w-full justify-between"
              >
                {item.label} {activeItem == item.value && <RightIcon />}
              </StyledMenuItem>
            );
          })}
        </DropdownMenu>
      </div>
    </div>
  );
}
