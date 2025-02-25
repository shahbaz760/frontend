import { Typography } from "@mui/material";
import ChatImage from "public/assets/images/pages/ProjectView/ChatImage.png";
const ChatDesign = () => {
  return (
    <div className="px-16">
      <Typography className="py-10 text-[20px] text-[#111827] font-600">
        Chat
      </Typography>
      <Typography className="pb-10 text-[14px] text-[#757982] font-400">
        Add conversations to your views so you can chat in real-time about
        anything with your team.
      </Typography>
      <img src={ChatImage} alt="" />
    </div>
  );
};

export default ChatDesign;
