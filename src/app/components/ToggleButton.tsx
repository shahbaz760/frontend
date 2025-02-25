import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
interface ButtonChanges {
  design?: boolean;
  content?: boolean;
  colored?: boolean;
  type?: number;
}
export const Android12Switch: any = styled(Switch)<ButtonChanges>(
  ({ design, content, colored }) => ({
    padding: 0,
    height: design ? 20 : 34,
    width: design ? 39 : 80,
    borderRadius: 100,
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      backgroundColor: colored ? "#9DA0A6" : "#F6F6F6",
      opacity: 1,
      "&::before, &::after": {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      },
      "&::before": {
        content: content ? '"Yes"' : '""',
        left: 10,
        color: "#fff",
        display: "none",
      },
      "&::after": {
        content: content ? '"No"' : '""',
        right: 10,
        color: colored ? "#ffffff" : "#757982",
      },
    },
    "& .MuiButtonBase-root": {
      padding: 0,
      "& .MuiSwitch-input": {
        left: 0,
      },
      "&.Mui-checked": {
        "& .MuiSwitch-input": {
          left: "-55px",
        },
        transform: design ? "translateX(20px)" : "translateX(44px)",
        "&+.MuiSwitch-track": {
          backgroundColor: "#4F46E5",
          opacity: 1,
          "&::before": {
            display: "inline",
          },
          "&::after": {
            display: "none",
          },
        },
      },
    },
    "& .MuiSwitch-thumb": {
      filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.1))",
      display: "block",
      boxShadow: "none",
      width: design ? 15 : 28,
      height: "auto",
      aspectRatio: 1,
      margin: 3,
      backgroundColor: "white",
    },
  })
);
