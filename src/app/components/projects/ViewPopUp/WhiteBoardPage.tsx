import { Typography } from "@mui/material";
import whiteImage from "public/assets/images/pages/ProjectView/whiteBoard.png";
const WhiteBoardPage = () => {
  return (
    <div className="px-16">
      <Typography className="py-10 text-[20px] text-[#111827] font-600">
        Whiteboard
      </Typography>
      <Typography className="pb-10 text-[14px] text-[#757982] font-400">
        Collaborate, brainstorm ideas, solve problems and get work done quickly
        as a team with Whiteboards.
      </Typography>
      <img src={whiteImage} alt="" />
    </div>
  );
};

export default WhiteBoardPage;
