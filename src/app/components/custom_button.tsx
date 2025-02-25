import { styled } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

const Root = styled(Button)(({ theme }) => ({
  borderRadius: "6px",

  "&.MuiButton-contained": {},
  "&.MuiButton-outlined": {},
  "&.MuiButton-outlinedPrimary": {
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: "var(--primary)",
      opacity: 0.9,
    },
  },
  "&.MuiButton-containedSecondary": {
    backgroundColor: "#EDEDFC",
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "#fff",
      opacity: 0.8,
    },
  },
}));

// const useStyles = makeStyles((theme) => ({
//   button: {
//     borderRadius: "40px",
//     "&.MuiButton-outlined": {},
//     "&.MuiButton-outlinedPrimary": {
//       backgroundColor: theme.,
//       color: "#fff",
//       "&:hover": {
//         backgroundColor: "var(--primary)",
//         opacity: 0.9,
//       },
//     },
//     "&.MuiButton-outlinedSecondary": {
//       backgroundColor: "var(--secondary)",
//       color: "#fff",
//       "&:hover": {
//         backgroundColor: "var(--secondary)",
//         opacity: 0.8,
//       },
//     },
//   },
//   innerWrap: {
//     display: "flex",
//     gap: "10px",
//   },
// }));

function CustomButton({ loading, children, ...rest }: CustomButtonProps) {
  return (
    <Root {...rest} disabled={loading || rest?.disabled}>
      <span className="flex gap-10">
        {loading && <CircularProgress size={24} />} {children}
      </span>
    </Root>
  );
}

export default CustomButton;
