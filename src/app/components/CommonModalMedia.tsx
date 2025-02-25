import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const StylesDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type ModalType = {
  open?: boolean;
  handleToggle: (e: React.FormEvent) => void;
  children: ReactNode;
  maxWidth?: string;
  DeleteModal?: boolean;
  btnTitle?: string;
  closeTitle?: string;
  disabled?: boolean;
  onSubmit?: () => void;
  bgColor?: string;
  headerBgColor?: string;
  titleColor?: string;
  isValid?: boolean;
  isHeaderDisplay?: boolean;
  buttons?: boolean;
};

export default function CommonModalMedia({
  open,
  handleToggle,
  children,
  btnTitle,
  closeTitle,
  DeleteModal = false,
  maxWidth,
  onSubmit,
  disabled,
  bgColor,
  headerBgColor,
  titleColor,
  isValid = true,
  isHeaderDisplay,
  buttons = false,
}: ModalType) {
  return (
    <StylesDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={(e: any) => {
        e.stopPropagation();
        handleToggle(e);
      }}
      sx={{
        ".MuiPaper-root": {
          maxWidth: `${maxWidth}px`,
          backgroundColor: bgColor || "white",
        },

        // "& .MuiPaper-root-MuiDialog-paper": {

        // },
      }}
    >
      <div className="p-20 pb-0">{children}</div>

      <p
        className="text-center text-[#757982] text-[14px] font-500 my-[9px] cursor-pointer"
        onClick={() => onSubmit()}
      >
        Skip For Now
      </p>
    </StylesDialog>
  );
}
