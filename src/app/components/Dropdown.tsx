import Popover, { PopoverProps } from "@mui/material/Popover";
import { ReactNode } from "react";

interface IProps {
  button: ReactNode;
  children: ReactNode;
  marginTop?: string;
  anchorEl: HTMLElement | null;
  handleClose: (e?: any) => void;
  popoverProps?: PopoverProps;
  name?: any;
  close?: any;
}

function DropdownMenu({
  button,
  children,
  anchorEl,
  handleClose,
  popoverProps,
  marginTop,
  name,
}: IProps) {
  return (
    <>
      {button}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        {...popoverProps}
        classes={{
          paper: `text-title_light  bg-[#fff]  ${popoverProps?.classes?.paper} ${marginTop}`,
          root: popoverProps?.classes?.root,
        }}
      >
        {children}
      </Popover>
    </>
  );
}

export default DropdownMenu;
