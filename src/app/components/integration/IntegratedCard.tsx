import { Box, Paper, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import IntegratedProjectList from "src/app/pages/integration/IntegratedProjectList";
interface IntegratedProptype {
  icon: ReactNode;
  title: string;
  description: string;
  isSlack?: boolean;
  btntitle?: string;
  handleGetLink?: () => void;
  actionButton?: React.ReactNode;
  isRemove?: boolean;
  projectList?: boolean;
}
const IntegratedCard = (props: IntegratedProptype) => {
  const {
    icon,
    title,
    description,
    isSlack,
    btntitle,
    isRemove,
    handleGetLink,
    actionButton,
    projectList,
  } = props;

  return (
    <>
      <Paper
        sx={{
          paddingX: 4,
          paddingY: 4,
          textAlign: "center",
          background: "#ffffff",
          minHeight: !projectList ? "170px" : "auto",
        }}
        className="rounded-[8px] shadow-[0px_4px_44px_0px_#D6D7E333] "
      >
        <Box className="flex items-center justify-between mb-20">
          <Box className="flex items-center gap-10">
            {icon}
            <Typography className="font-600 text-[#111827] text-[20px]">
              {title}
            </Typography>
          </Box>
          <Box sx={{ gap: "10px", display: "flex", alignItems: "center" }}>
            {actionButton}
          </Box>
        </Box>
        <Typography
          className={`text-justify text-[15px] text-[#757986] font-400 ${projectList ? "border-b-1 pb-20 border-b-[#EDF2F6]" : ""}`}
        >
          {description}
        </Typography>
        {projectList && <IntegratedProjectList />}
      </Paper>
    </>
  );
};

export default IntegratedCard;
