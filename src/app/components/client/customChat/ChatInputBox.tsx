import MoodIcon from "@mui/icons-material/Mood";
import { IconButton, Tooltip, Typography } from "@mui/material";
import {
  addCustomChatMessage,
  getCustomChatMessage,
} from "app/store/customChatBox";
import EmojiPicker from "emoji-picker-react";
import {
  ChatAudio,
  ChatPDF,
  ChatVideo,
  CrossIconForImg,
} from "public/assets/icons/common";
import {
  ChatIcon,
  ChatMessageIcon,
  SupoortChatIcon,
} from "public/assets/icons/kayword";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import DescriptionIcon from "@mui/icons-material/Description";
import AudioRecorderComponent from "../../tasks/AudioRecorder";
import toast from "react-hot-toast";
import { getUserDetail } from "src/utils";
import { debounce } from "lodash";

export const TruncateText = ({ text, maxWidth, tooltip = true }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);

  const content = (
    <Typography
      ref={textRef}
      noWrap
      style={{
        maxWidth: `${maxWidth}px`,
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: `${maxWidth}px`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );

  return tooltip ? (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

const ChatInputBox = ({
  taskId,
  isAddLoadingChats,
  scrollToBottom,
  chatList,
  setChatList,
  fetchChatMessages,
}) => {
  const [openEmojiBox, setOpenEmojiBox] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [closeAudioBox, setCloseAudioBox] = useState(false);
  const [savedAudioURL, setSavedAudioURL] = useState("");
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const emojiPickerRef = useRef(null); // Ref for the emoji picker

  // handle emoji click event
  const onEmojiClick = (e) => {
    setComment((prevComment) => prevComment + e.emoji);
    setOpenEmojiBox(false);
  };

  // handle upload file
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const newFiles: File[] = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
    e.target.value = "";
  };

  // handle remove file
  const handleRemoveFile = (file: File) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== file));
  };
  const userDetails = getUserDetail();

  const handleSubmitComment = async () => {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("message", comment);
    if (audioBlob) {
      formData.append("files", audioBlob);
    }
    if (uploadedFiles.length > 0) {
      uploadedFiles?.forEach((file) => {
        formData.append("files", file);
      });
    }

    const newMessage = {
      id: Date.now(), // Generate a unique id or use a better identifier
      support_id: chatList?.id,

      // receiver_id: data?.receiver_id,
      sending: true,
      sender_detail: {
        first_name: userDetails?.first_name,
        last_name: userDetails?.last_name,
        id: userDetails?.id,
        user_image: userDetails?.user_image,
      },
      message: comment,
      deleted_at: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // receiver_name: data?.user_name, // Replace with actual receiver name
      // receiver_image: data?.user_image, // Replace with actual receiver image
      task_chat_files: uploadedFiles.map((file) => {
        return {
          id: Date.now(), // Generate unique id or use a better identifier
          support_id: chatList?.id,
          file: `${URL.createObjectURL(file)}.${file.name.split(".").pop().toLowerCase()}`, // Replace with actual file path if needed
          file_type: file.type,
          chat_id: Date.now(), // Same as the message id for simplicity
          deleted_at: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }),
    };

    if (comment.trim() != "" || uploadedFiles.length != 0) {
      const updatedData = [...chatList, newMessage];
      setChatList(updatedData);
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }

    debouncedSearch(formData);
    setAudioBlob("");
    setComment("");
    setSavedAudioURL("");
    setUploadedFiles([]);
  };

  const debouncedSearch = debounce(async (formData) => {
    const result = await dispatch(addCustomChatMessage(formData));
    fetchChatMessages();
    if (result.payload.data.status == 1) {
      // fetchDetails();
    } else {
      toast.error(`${result.payload.data.message}`);
    }
  }, 300);

  useEffect(() => {
    (async () => {
      if (audioBlob) {
        const formData = new FormData();
        formData.append("task_id", taskId);
        formData.append("files", audioBlob);
        const res = await dispatch(addCustomChatMessage(formData));
        const payloadRes = res?.payload?.data;
        if (payloadRes?.status === 1) {
          const newChat = payloadRes?.data;
          const prevChat = [...chatList];
          // prevChat.push(newChat);
          // setChatList([...prevChat]);
          scrollToBottom();
          setTimeout(() => {
            scrollToBottom();
          }, 1000);
        }
        setSavedAudioURL("");
        setAudioBlob("");
        // setCloseAudioBox(true);
      }
      setCloseAudioBox(true);
    })();
  }, [audioBlob]);

  // Close the emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setOpenEmojiBox(false);
      }
    };
    if (openEmojiBox) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEmojiBox]);

  useEffect(() => {
    uploadedFiles.forEach((file: any) => {
      if (file.type.startsWith("video/")) {
        createVideoThumbnail(file);
      }
    });
  }, [uploadedFiles]);

  const createVideoThumbnail = (file: any) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.currentTime = 1; // Capture the frame at 1 second

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnailUrl = canvas.toDataURL("image/png");
      setThumbnails((prev) => ({
        ...prev,
        [file.name]: thumbnailUrl,
      }));

      // Release the object URL to save memory
      URL.revokeObjectURL(video.src);
    };
  };

  return (
    <div className={`w-full flex flex-col gap-5 relative rounded-[6px] `}>
      <div className="w-full flex items-center justify-end sm:px-2 ">
        <div
          className={`border-[0.5px] border-grey-500 px-10 w-full sm:pb-3 pt-10 rounded-[10px] sm:mr-0 mr-[12px] `}
        >
          <div className="flex  gap-5 ">
            <ChatMessageIcon />
            <textarea
              placeholder="Write a comment..."
              className={`text-[14px] font-500 text-[#111827] bg-transparent outline-none w-full break-words placeholder-[#757982]`}
              onChange={(e) => {
                const value = e.target.value;
                setComment(value.trimStart()); // Prevent initial spaces
              }}
              style={{
                cursor: "text",
                resize: "none",
                height: 30,
              }}
              value={comment}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent adding a new line
                  e.stopPropagation();
                  if (
                    isAddLoadingChats ||
                    comment ||
                    audioBlob ||
                    uploadedFiles?.length > 0
                  ) {
                    handleSubmitComment();
                  }
                }
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              // paddingTop: 5,
            }}
            className="justify-between "
          >
            <div className="flex gap-10 pb-10 w-[80%] overflow-x-auto">
              {uploadedFiles?.map((file: any) => {
                return (
                  <div
                    key={file}
                    style={{
                      position: "relative",
                      maxWidth: 60,
                      minWidth: 60,
                      height: 60,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        right: 2,
                        top: 5,
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveFile(file)}
                    >
                      <CrossIconForImg />
                    </span>
                    {file.type.startsWith("video/") && (
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                        }}
                      >
                        <PlayCircleIcon />
                      </span>
                    )}
                    {file.type.includes("csv") && (

                      <div>
                        <DescriptionIcon
                          sx={{
                            fontSize: 60,
                            color: "#4f46e5",
                          }}
                        />{" "}
                      </div>
                    )}
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 10,
                        }}
                      />
                    ) : file.type === "application/pdf" ? (
                      <div>
                        <div className="fileContainer">
                          <ChatPDF className="icon" />
                          <div className="fileName">
                            {<TruncateText text={file?.name} maxWidth={60} />}
                          </div>
                        </div>{" "}
                      </div>
                    ) : file.type ===
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                      <div>
                        <DescriptionIcon
                          sx={{
                            fontSize: 60,
                            color: "#4f46e5",
                          }}
                        />{" "}
                      </div>
                    ) : file.type.includes(".document") ? (
                      <div>
                        <div className="fileContainer">
                          <DescriptionIcon
                            sx={{
                              fontSize: 20,
                              color: "#4F46E5",
                            }}
                          />{" "}
                          <div className="fileName">
                            {<TruncateText text={file?.name} maxWidth={40} />}
                          </div>
                        </div>{" "}
                      </div>
                    ) : file.type.startsWith("audio/") ? (
                      <div>
                        <div className="fileContainer">
                          <ChatAudio className="icon" />
                          <div className="fileName">
                            {<TruncateText text={file?.name} maxWidth={60} />}
                          </div>
                        </div>{" "}
                      </div>
                    ) : file.type.startsWith("video/") ? (
                      <img
                        src={thumbnails[file.name]}
                        alt={file.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    ) : file.type.includes(".xlsx") ? (
                      <div className="fileContainer">
                        <ChatVideo className="icon" />
                        <div className="fileName">
                          {<TruncateText text={file?.name} maxWidth={60} />}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className={`flex items-end justify-end `}>
              <IconButton onClick={() => setOpenEmojiBox(true)}>
                <MoodIcon
                  sx={{
                    cursor: "pointer",
                    fill: "#757982",
                  }}
                />
              </IconButton>
              {openEmojiBox && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-[75px] right-0"
                >
                  <EmojiPicker
                    // open={openEmojiBox}
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis={true}
                    searchDisabled
                  />
                </div>
              )}
              <AudioRecorderComponent
                audioBlob={savedAudioURL}
                setAudioBlob={setAudioBlob}
                isForChat={true}
                closeAudioBox={closeAudioBox}
                setCloseAudioBox={setCloseAudioBox}
              />
              <label
                htmlFor="file-input"
                style={{
                  cursor: "pointer",
                }}
              >
                <IconButton
                  component="span"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <SupoortChatIcon />
                  </span>
                </IconButton>
                <input
                  type="file"
                  id="file-input"
                  multiple
                  style={{
                    cursor: "pointer",
                    display: "none",
                  }}
                  onChange={handleUploadFile}
                />
              </label>
              <IconButton
                disabled={isAddLoadingChats}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    isAddLoadingChats ||
                    comment ||
                    audioBlob ||
                    uploadedFiles?.length > 0
                  ) {
                    handleSubmitComment();
                  }
                }}
                style={{
                  cursor: "pointer",
                  width: 70,
                  height: 69,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <ChatIcon />
              </IconButton>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
