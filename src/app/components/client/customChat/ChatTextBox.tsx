import { Avatar, CircularProgress, Typography } from "@mui/material";
import styles from "./customChat.module.scss";
import DescriptionIcon from "@mui/icons-material/Description";
import { formatDateBasedOnDifference } from "src/utils";
import { AttachmentIcon } from "public/assets/icons/supportIcons";
import { ChatPDF, CrossGreyIcon } from "public/assets/icons/common";
import { useState } from "react";
import AudioRecorderComponent from "../../tasks/AudioRecorder";

const ChatTextBox = ({ name, date, imgUrl, message, taskChatFiles, user_id }) => {
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };


  return (
    <div className={styles.chatTextBox}>
      <div className={styles.chatHeader}>
        <span>
          <Avatar
            src={urlForImage + imgUrl}
            sx={{
              width: 30,
              height: 30,
            }}
          />{" "}
          {name}
        </span>
        <span>{formatDateBasedOnDifference(date)}</span>
      </div>
      <div className="pt-5">{message}</div>
      {taskChatFiles?.length > 0 && (
        <div className="flex justify-between w-full">
          <div className="flex gap-10 justify-start items-center w-full flex-wrap ">
            {taskChatFiles?.some((audio) => audio.file.includes(".blob")) &&
              taskChatFiles?.map((audio) => {
                return (
                  <div>
                    {audio.file.includes(".blob") && (
                      <AudioRecorderComponent
                        isForPreview={true}
                        audioBlob={urlForImage + audio?.file}
                        setAudioBlob={() => { }}
                        edit={true}
                      />
                    )}
                  </div>
                );
              })}
            {taskChatFiles?.map((file) => {
              const url = file.file.includes("http")
                ? file.file.replace(`.${file.file.split(".").pop()}`, "")
                : urlForImage + file.file;
              return (
                <>
                  {file.file.includes(".png") ||
                    file.file.includes(".avif") ||
                    file.file.includes(".jfif") ||
                    file.file.includes(".webp") ||
                    file.file.includes(".jpg") ||
                    file.file.includes(".jpeg") || file.file.includes(".SVG") || file.file_type.includes("image/") ? (
                    <div className="relative w-[85px]">
                      <img
                        src={url}
                        alt="Black Attachment"
                        className="rounded-md "
                      />
                      <div
                        className="absolute top-7 right-7 cursor-pointer"
                        onClick={() =>
                          handleImageClick(url)
                        }
                      >
                        <AttachmentIcon />
                      </div>
                    </div>
                  ) : (
                    <>
                      {file.file.includes(".xlsx") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DescriptionIcon
                            sx={{
                              fontSize: 60,
                              color: "#4F46E5",
                            }}
                          />{" "}
                        </a>
                      )}
                      {file.file.includes(".pdf") && (
                        <a
                          className="textPreviewAttachments"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ChatPDF />{" "}
                        </a>
                      )}
                      {file.file.includes("mp3") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <audio
                            src={url}
                            controls // Add controls if you want to allow play/pause within the video element
                          />
                        </a>
                      )}
                      {/* {file.file.includes(".webm") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <video
                            src={url}
                            width="150px"
                            height="150px"
                            controls // Add controls if you want to allow play/pause within the video element
                          />
                        </a>
                      )} */}
                      {file.file_type.includes("video/") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <video
                            src={url}
                            width="150px"
                            height="150px"
                            controls // Add controls if you want to allow play/pause within the video element
                          />
                        </a>
                      )}
                      {file.file_type.includes("csv") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DescriptionIcon
                            sx={{
                              fontSize: 60,
                              color: "#4F46E5",
                            }}
                          />{" "}
                        </a>)}
                      {file.file_type.includes("application/") && !file.file.includes(".pdf") && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DescriptionIcon
                            sx={{
                              fontSize: 60,
                              color: "#4F46E5",
                            }}
                          />{" "}
                        </a>
                      )}
                    </>
                  )}
                </>
              );
            })}
            {expandedImage && (
              <>
                <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
                  <div
                    className="absolute z-10 right-[25px] top-[100px] cursor-pointer"
                    onClick={() => setExpandedImage(null)}
                  >
                    <CrossGreyIcon />
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   ">
                    <img
                      src={expandedImage}
                      alt="Expanded Image"
                      className="w-[800px] h-[500px] object-contain"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Typography className="text-grey text-right">{!user_id ? <CircularProgress size={24} sx={{ color: "#4f46e5" }} /> : ""}</Typography>
    </div>
  );
};

export default ChatTextBox;
