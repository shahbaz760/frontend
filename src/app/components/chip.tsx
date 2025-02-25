import { Chip, ChipProps } from "@mui/material";

interface IProps extends ChipProps {
  colorSecondary?: boolean;
  height?: boolean;
}

function CommonChip({ colorSecondary, height, ...rest }: IProps) {
  return (
    <Chip
      {...rest}
      className={`rounded-8 py-12 px-14 ${height ? " " : "h-[48px]"} justify-between flex-row-reverse text-lg
      ${
        colorSecondary
          ? "bg-secondary_bg text-secondary"
          : "bg-bgGrey text-para_light"
      } ${rest.className}`}
      sx={{
        "& .MuiChip-label": {
          padding: 0,
          fontWeight: 400,
        },
        "& .MuiChip-icon": {
          margin: "0 0 0 6px",
          color: colorSecondary ? "inherit" : "#393F4C",
          maxHeight: "24px",
          maxWidth: "24px",
        },
        ...rest.sx,
      }}
    />
  );
}

export default CommonChip;
