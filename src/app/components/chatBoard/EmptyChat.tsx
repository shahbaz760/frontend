import { Typography } from "@mui/material";

const EmptyChat = () => {
  return (
    <div className="w-[calc(100%-311px)] flex flex-col items-center justify-center gap-3">
      <img src={import.meta.env.VITE_API_BASE_IMAGE_URL + "chat/no-msg.png"} />
      <Typography className="text-[24px] text-center font-600 leading-normal">
        No Message !
      </Typography>
      <p style={{ color: "#757982" }}>Please select list to view messages.</p>
    </div>
  );
};

export default EmptyChat;