import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { CircularDeleteIcon } from "public/assets/icons/common";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    margin: 0,
    width: "100%",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type ModalType = {
  open: boolean;
  handleToggle: () => void;
  modalTitle: string;
  modalSubTitle: string;
  type: string;
  maxWidth?: string;
  onDelete?: any;
  disabled?: boolean;
};

export default function CompleteModal({
  modalTitle,
  open,
  handleToggle,
  modalSubTitle,
  type,
  maxWidth = "387",
  onDelete,
  disabled,
}: ModalType) {
  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      sx={{
        ".MuiPaper-root": {
          maxWidth: `${maxWidth}px`,
        },
      }}
    >
      <div className="p-28 flex flex-col items-center">
        {type === "delete" ? <CircularDeleteIcon /> : null}

        <Typography className="mt-20 text-[20px] font-semibold">
          {modalTitle}
        </Typography>
        <Typography
          className="mt-10 text-[14px] max-w-[221px] text-center"
          color="primary.light"
        >
          {modalSubTitle}
        </Typography>
      </div>

      <div className="flex p-20 pt-10">
        <Button
          variant="contained"
          color="secondary"
          className="w-[156px] h-[48px] text-[18px]"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={disabled}
        >
          {disabled ?
            <Box
              marginTop={0}
              id="spinner"
              sx={{
                "& > div": {
                  backgroundColor: "palette.secondary.main",
                },
              }}
            >
              <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
              <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
              <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
            </Box> : "Yes"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          className="w-[156px] h-[48px] text-[18px] ml-10"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          disabled={disabled}
        >
          Cancel
        </Button>
      </div>
    </BootstrapDialog>
  );
}
