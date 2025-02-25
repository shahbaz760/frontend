import { Box, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { CrossIcon } from "public/assets/icons/common";
import { CrossIconProduct } from "public/assets/icons/subscription";
import { ReactNode } from "react";

const StylesDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "10px",
    margin: 0,
    [theme.breakpoints.up("sm")]: {
      // width: "80%",
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
  modalTitle: string;
  children: ReactNode;
  maxWidth?: string;
  DeleteModal?: boolean;
  btnTitle?: string | ReactNode;
  closeTitle?: string;
  disabled?: boolean;
  onSubmit?: () => void;
  bgColor?: string;
  headerBgColor?: string;
  titleColor?: string;
  isValid?: boolean;
  isHeaderDisplay?: boolean;
  btn?: any;
  border?: true;
  disableouterClick?: boolean;
  bordershow?: boolean;
  subtitle?: boolean;
};

export default function CommonModalPublic({
  modalTitle,
  open,
  handleToggle,
  children,
  btnTitle,
  closeTitle,
  DeleteModal = false,
  maxWidth = "387",
  onSubmit,
  disabled,
  bgColor,
  headerBgColor,
  titleColor,
  isValid = true,
  isHeaderDisplay,
  btn = true,
  border,
  subtitle,
  disableouterClick = false,
  bordershow = false,
}: ModalType) {
  return (
    <StylesDialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={(e: any) => {
        if (!disableouterClick) {
          handleToggle(e);
        }
        e.stopPropagation();
      }}
      fullWidth={true}
      maxWidth="xl"
      // fullScreen={bordershow}
      sx={{
        ".MuiPaper-root": {
          maxWidth: `${bordershow ? `${maxWidth}` : `${maxWidth}px`}`,
          backgroundColor: bgColor || "white",
        },
        "& .MuiIconButton-root:hover": {
          //remove hover background
          backgroundColor: "transparent",
          cursor: "default",
        },
      }}
    >
      {!DeleteModal ? (
        <div
          className={`${border ? "px-16 py-10" : "p-[10px]"}  flex justify-between w-full items-center ${border && "border-b-1 border-grey-300 "} ${
            headerBgColor ? `bg-[${headerBgColor}` : "bg-[#2C334C]"
          } ${isHeaderDisplay ? "hidden" : ""} ${disabled ? "disabledChildren" : ""}`}
        >
          {!subtitle ? (
            <Typography
              className={`text-[16px] font-semibold" ${
                titleColor ? "text-black" : "text-white"
              }`}
            >
              {modalTitle}
            </Typography>
          ) : (
            <div className="flex justify-between items-center  w-full border-b-1 border-[#B0B3B880]">
              <div className="flex flex-col py-10 px-40 gap-10 ">
                <Typography variant="h6" className={`text-[22px] font-bold" `}>
                  Add New Product
                </Typography>

                <Typography className="text-[#757982] text-[14px] pb-10">
                  Easily expand your catalog by adding a new product to your
                  inventory
                </Typography>
              </div>
              <div
                onClick={(e: any) => {
                  if (!disableouterClick) {
                    handleToggle(e);
                  }
                  e.stopPropagation();
                }}
              >

                <CrossIconProduct/>
              </div>
             
            </div>
          )}

         
        </div>
      ) : (
<>

       { !subtitle &&<IconButton
          className={`flex items-center justify-end pt-20 pr-20  rounded-none ${disabled ? "disabledChildren" : ""}`}
        >
          <CrossIcon
            className="cursor-pointer"
            color="#9DA0A6"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(e);
            }}
          />
        </IconButton>
}
</>

      )}
      <div
        className={`${bordershow ? "pt-0 pl-20" : " px-20"} bg-[#F7F9FB] pb-0 pt-10  ${disabled ? "disabledChildren" : ""}`}
      >
        {children}
      </div>

      {btn && !bordershow && (
        <div
          className={`flex p-20 pt-20 ${bordershow ? "w-[calc(70%+6px)] border-1 border-r-[#cec9c9] border-t-0 border-b-0 border-l-0 pr-20" : ""}`}
        >
          <Button
            variant="outlined"
            disabled={disabled}
            color="secondary"
            className={`${
              disabled ? "btn-disable-light" : ""
            } w-[156px] h-[48px]  text-[16px] font-400 `}
            onClick={(e) => {
              handleToggle(e);
              e.stopPropagation();
            }}
          >
            {closeTitle}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            className={`${
              disabled ? "btn-disable" : ""
            } w-[156px] h-[48px] text-[16px] font-400 ml-14 whitespace-nowrap`}
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            disabled={!isValid || disabled}
          >
            {/* {disabled ? <CircularProgress size={24} sx={{ color: '#4F46E5' }} /> : btnTitle} */}
            {disabled ? (
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
              </Box>
            ) : (
              btnTitle
            )}
          </Button>
        </div>
      )}
    </StylesDialog>
  );
}
