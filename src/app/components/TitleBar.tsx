import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type TitleBarProps = {
  title: string;
  children?: ReactNode;
  minHeight?: string;
  capitalize?: boolean;
  color?: boolean;
};

export default function TitleBar({
  title,
  children,
  minHeight,
  capitalize = false,
  color = false,
}: TitleBarProps) {
  return (
    <div
      className={`flex sm:justify-between sm:px-[28px] px-[10px] flex-wrap justify-center pt-[20px] pb-[15px] gap-[10px] sm:gap-0 items-center ${minHeight} ${capitalize ? "capitalize truncate" : ""} ${color ? "bg-[#F7F9FB]" : ""}`}
    >
      <Typography className="text-[20px] font-semibold text-[#0A0F18] whitespace-nowrap">
        {title}
      </Typography>
      {children}
    </div>
  );
}
