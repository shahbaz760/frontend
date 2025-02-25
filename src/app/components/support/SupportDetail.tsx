import ListLoading from "@fuse/core/ListLoading";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled, useTheme } from "@mui/styles";
import { filterType } from "app/store/Client/Interface";
import {
  GetSupportList,
  addSupportMessage,
  getEditSupporttDetail,
  updateSupportList,
} from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import {
  ChatAudio,
  ChatPDF,
  ChatVideo,
  CrossIconForImg,
} from "public/assets/icons/common";
import {
  ChatIcon,
  ChatCloseIcon,
  ChatMessageIcon,
  ChatMessageCloseIcon,
  SupoortChatCloseIcon,
  SupoortChatIcon,
} from "public/assets/icons/kayword";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import AddNewTicket from "src/app/components/support/AddNewTicket";
import {
  getBgColorOfChip,
  getClientId,
  getTextColorOfChip,
  getUserDetail,
  removeDash,
} from "src/utils";
import DropdownMenu from "../Dropdown";
import MessageCard from "./MessageCard";
import { DownArrow } from "public/assets/icons/topBarIcons";
import { DownArrowBlank } from "public/assets/icons/dashboardIcons";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { maxHeight } from "@mui/system";
import compressImageToHalf from "./ImageCom";

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

export default function Support() {
  const [expandedImage, setExpandedImage] = useState(null);
  const { supportDetailsStatus } = useSelector(
    (state: RootState) => state.password
  );
  const { SupportId } = useParams();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });
  const chatContainerRef = useRef(null);
  const theme: Theme = useTheme();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [supportListLoading, setSupportListLoading] = useState(false);
  const [supportStatusLoading, setSupportStatusLoading] = useState(false);
  const [attachments, setAttachments] = useState<{ file: string }[]>([]);
  const [chatAttachment, setChatAttachment] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState<any>();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Completed");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const userDetails = getUserDetail();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState("");
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: 10,
    search: "",
  });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [statusMenu, setStatusMenu] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>(data?.status);
  const StatusMenuData =
    userDetails?.role_id !== 1 && userDetails?.role_id !== 4
      ? [{ label: "Re Opened" }]
      : [{ label: "Closed" }];
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    minWidth: "170px",
  }));
  const commentRef = useRef(null);
  const handleStatusMenuClick = async (status: string) => {
    setIsInputFocused(false);
    setSupportStatusLoading(true);
    const formData = new FormData();
    formData.append("support_id", data?.id);
    formData.append("department_id", data?.department_id);
    formData.append("subject", data?.subject);
    formData.append("message", data?.message);
    formData.append("status", status);
    formData.append("priority", data?.priority);
    formData.append("delete_file_ids", "");
    const res = await dispatch(updateSupportList(formData));
    if (res?.payload?.data?.status == 1) {
      // setSelectedStatus(status);
      fetchDetails();
      setIsInputFocused(true);
    }
    setStatusMenu(null);
  };

  const dispatch = useAppDispatch();
  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };
  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedImage]);
  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetSupportList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDetails = async () => {
    const res = await dispatch(getEditSupporttDetail(SupportId));
    if (
      (userDetails.role_id == 4 || userDetails.role_id == 5) &&
      res.payload.data.code == 400
    ) {
      navigate("/401");
    }
    setData(res?.payload?.data?.data);
    const details = res?.payload?.data?.data?.Support_Attachments_details;
    if (
      res?.payload?.data?.data?.Support_Attachments_details &&
      res?.payload?.data?.data?.Support_Attachments_details.length > 0
    )
      setAttachments([...details]);

    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 1050);

    const dataTimer = setTimeout(() => {
      setSupportListLoading(false);
      setIsInputFocused(true);
    }, 1000);
    return () => {
      clearTimeout(dataTimer);
      clearTimeout(scrollTimer);
    };
  };

  useEffect(() => {
    setSupportListLoading(true);
    fetchDetails();
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedStatus(data?.status);
      setSupportStatusLoading(false);
    }
  }, [data]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const newFiles: File[] = Array.from(files);

      try {
        // Compress files if they are images, otherwise keep them as is
        const processedFiles = await Promise.all(
          newFiles.map(async (file) => {
            if (file.type.startsWith("image/")) {
              // Compress the image
              return await compressImageToHalf(file);
            }
            // Return non-image files as is
            return file;
          })
        );

        // Update the state with processed files
        setUploadedFiles([...uploadedFiles, ...processedFiles]);
      } catch (error) {
        console.error("Error during file processing:", error);
      }
    }
    e.target.value = ""; // Reset the file input
  };

  const handleRemoveFile = (file: File) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== file));
  };

  const debouncedSearch = debounce(async (formData) => {
    const result = await dispatch(addSupportMessage(formData));
    if (result.payload.data.status == 1) {
      fetchDetails();
    } else {
      toast.error(`${result.payload.data.message}`);
    }
  }, 300);

  const handleSendMessage = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("support_id", data?.id);
    formData.append("receiver_id", data?.receiver_id); // Replace with actual receiver_id
    formData.append("message", comment);

    const newMessage = {
      id: Date.now(), // Generate a unique id or use a better identifier
      support_id: data?.id,
      sender_id: userDetails?.id, // Assuming the current user's id is 1
      // receiver_id: data?.receiver_id,
      sending: true,
      message: comment,
      deleted_at: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // sender_name: "RCW Admin", // Replace with actual sender name if available
      sender_name: userDetails?.first_name + userDetails?.last_name,
      sender_image: userDetails?.user_image, // Replace with actual sender image if available
      // receiver_name: data?.user_name, // Replace with actual receiver name
      // receiver_image: data?.user_image, // Replace with actual receiver image
      support_chat_attachments: uploadedFiles.map((file) => {
        return {
          id: Date.now(), // Generate unique id or use a better identifier
          support_id: data?.id,
          file: `${URL.createObjectURL(file)}.${file.name.split(".").pop().toLowerCase()}`, // Replace with actual file path if needed
          file_type: file.type,
          chat_id: Date.now(), // Same as the message id for simplicity
          deleted_at: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }),
    };
    if (uploadedFiles.length > 0) {
      uploadedFiles?.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (comment.trim() != "" || uploadedFiles.length != 0) {
      const updatedData = {
        ...data,
        support_chat: [...data.support_chat, newMessage],

      };
      setData(updatedData);




      setComment("");
      setUploadedFiles([]);

      debouncedSearch(formData);
      setIsInputFocused(false);
    }
    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 50);


    return () => {
      clearTimeout(scrollTimer);
    };
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

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
  const clientId = getClientId();
  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);
  useEffect(() => {
    if (isInputFocused && commentRef.current) {
      commentRef.current.focus();
    }
  }, [isInputFocused, data]);

  return (
    <>
      <div className="sm:px-16">
        <div className="flex sm:items-center justify-between gap-8 px-20 py-20 flex-wrap ">
          <div className="flex sm:items-center gap-10 sm:flex-row flex-col">
            <Typography className="text-[20px] text-[#111827] font-600 ">
              Support Ticket ID :{" "}
              <span className="text-[18px] text-[#757982] font-500">
                {data?.id ? data?.id : "N/A"}
              </span>
            </Typography>

            {!data ? ( // Show loader if data is null or undefined (data is still being fetched)
              <ListLoading />
            ) : (
              <div
                className={`inline-flex items-center justify-center text-[14px] border-1 border-[#EDEDFC] rounded-[4px]
                      font-500 bg-[#FFFFFF] px-10 py-8 
                     ${data?.priority === "Low"
                    ? "text-[#4CAF50]"
                    : data?.priority === "High"
                      ? "text-[#F44336]"
                      : "text-[#F0B402]"
                  }`}
              >
                <span className="text-[#757982] text-[14px] font-500">
                  {"Priority :"}
                </span>
                &nbsp;
                {data?.priority || "N/A"}
              </div>
            )}
          </div>
          <div>
            <Typography className="text-[#111827] text-[16px] font-600 py-10">
              Department :{" "}
              <span className="text-[#757982] text-[16px] font-500 ">
                {data?.Department}
              </span>
            </Typography>
          </div>
        </div>
      </div>

      <div className="px-40 xs:px-10  flex flex-col gap-10">
        <Grid className="sm:px-10 xs:px-10 ">
          <Grid item xs={12} sm={8} md={8}>
            <div
              className="w-full bg-[#FFFFFF] flex sm:items-center justify-between border-1 
            border-[#EDEDFC] gap-10 px-20 py-10 rounded-[6px] sm:flex-row flex-col"
            >
              <Typography className="text-[#111827] text-[18px] font-500 py-10">
                {data?.subject}
              </Typography>

              <div className="flex items-center gap-3">
                <Typography className="text-[14px] font-400 text-[#757982]">
                  Status:
                </Typography>
                {userDetails.role_id == 1 || userDetails.role_id == 4 ? (
                  !selectedStatus ? (
                    <ListLoading />
                  ) : (
                    <DropdownMenu
                      anchorEl={statusMenu}
                      name="status"
                      handleClose={() => setStatusMenu(null)}
                      button={
                        <Button
                          onClick={(event: any) =>
                            setStatusMenu(event.currentTarget)
                          }
                          className={`max-w-fit hover:${selectedStatus == "Closed" && "bg-transparent"}`}
                          sx={{
                            background: "transparent",
                            color: `${getTextColorOfChip(selectedStatus)} !important`,
                            cursor: `${selectedStatus !== "Closed" ? "pointer" : "default"}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {supportStatusLoading
                                ? ""
                                : removeDash(selectedStatus) || "Status"}
                            </span>
                            {selectedStatus !== "Closed" && (
                              <Box sx={{ ml: 1 }}>
                                {supportStatusLoading ? (
                                  <ListLoading />
                                ) : !statusMenu ? (
                                  <DownArrowBlank />
                                ) : (
                                  <UpArrowBlank />
                                )}
                              </Box>
                            )}
                          </Box>
                        </Button>
                      }
                      popoverProps={{
                        open: !!statusMenu && selectedStatus !== "Closed",
                        classes: {
                          paper: " pb-5",
                        },
                      }}
                    >
                      {StatusMenuData?.map((item) => (
                        <StyledMenuItem
                          key={item.label}
                          onClick={() => handleStatusMenuClick(item.label)}
                        >
                          {removeDash(item.label)}
                        </StyledMenuItem>
                      ))}
                    </DropdownMenu>
                  )
                ) : !selectedStatus ? (
                  <ListLoading />
                ) : (
                  <DropdownMenu
                    anchorEl={statusMenu}
                    name="status"
                    handleClose={() => setStatusMenu(null)}
                    button={
                      <Button
                        onClick={(event: any) =>
                          setStatusMenu(event.currentTarget)
                        }
                        className={`max-w-fit hover:${selectedStatus != "Closed" && "bg-transparent"}`}
                        sx={{
                          background: "transparent",
                          color: `${getTextColorOfChip(selectedStatus)} !important`,
                          cursor: `${selectedStatus == "Closed" ? "pointer" : "default"}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {supportStatusLoading
                              ? ""
                              : removeDash(selectedStatus) || "Status"}
                          </span>
                          {selectedStatus == "Closed" && (
                            <Box sx={{ ml: 1 }}>
                              {supportStatusLoading ? (
                                <ListLoading />
                              ) : statusMenu ? (
                                <UpArrowBlank />
                              ) : (
                                <DownArrowBlank />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Button>
                    }
                    popoverProps={{
                      open: !!statusMenu && selectedStatus == "Closed",
                      classes: {
                        paper: " pb-5",
                      },
                    }}
                  >
                    {StatusMenuData?.map((item) => (
                      <StyledMenuItem
                        key={item.label}
                        onClick={() => handleStatusMenuClick(item.label)}
                      >
                        {removeDash(item.label)}
                      </StyledMenuItem>
                    ))}
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div
              className=" flex flex-col justify-between gap-10 rounded-12  xs:h-auto sm:h-auto"
              style={{
                height: "calc(100vh - 386px)",
                overflowY: "hidden",
              }}
            >
              <div
                className="flex !gap-[20px] flex-col overflow-y-auto  pt-20"
                style={{
                  maxHeight: "calc(100vh - 414 px)",
                  marginBottom: 16,
                }}
                ref={chatContainerRef}
              >
                {supportListLoading ? (
                  <ListLoading />
                ) : (
                  <>
                    {data && (
                      <MessageCard
                        isSender={
                          userDetails?.role_id == 2 || userDetails?.role_id == 5
                        }
                        data={data}
                      />
                    )}

                    {data?.support_chat?.length > 0 &&
                      data?.support_chat?.map((chat: any, index: number) => {
                        const isSender = chat?.sender_id == userDetails?.id;

                        let setTrue = true;

                        // If the current index is not the first one, compare receiver_id with the previous chat
                        if (index > 0) {
                          const previousChat = data.support_chat[index - 1];
                          if (chat.receiver_id == previousChat.receiver_id) {
                            setTrue = false;
                          }
                        }

                        const chatData = {
                          user_image: chat?.sender_image,
                          user_name: chat?.sender_name,
                          created_at: chat?.createdAt,
                          message: chat?.message,
                          Support_Attachments_details:
                            chat.support_chat_attachments,
                          continue: setTrue,
                          loader: true,
                          sending: chat?.sending || false
                        };
                        return (
                          <MessageCard
                            isSender={isSender}
                            data={chatData}

                          // uploadedFiles={uploadedFiles}
                          />
                        );
                      })}
                  </>
                )}
              </div>

              {/* )} */}
            </div>
            {data?.status && (
              <form
                className={`w-full flex flex-col gap-5 relative ${data?.status == "Closed" ? "bg-[#B0B3B833] border-1 border-[#b2b5b8]" : "bg-[white]"}  border border-transparent ${data?.status !== "Closed" ? "focus-within:border-secondary" : ""} rounded-[6px] `}
                onSubmit={(e) => {
                  e.preventDefault();
                  data?.status !== "Closed" ? handleSendMessage() : "";
                }}
              >
                <div
                  className="w-full flex items-center justify-end sm:px-2 "
                // onSubmit={(e) => {
                //   e.preventDefault();
                //   data?.status !== "Closed" ? handleSendMessage() : "";
                // }}
                >
                  <div
                    className={`" px-20 w-full sm:pb-3 pt-20 rounded-[10px]"  `}
                  >
                    <div className="flex  gap-10 ">
                      {data?.status == "Closed" ? (
                        <ChatMessageCloseIcon />
                      ) : (
                        <ChatMessageIcon />
                      )}

                      <textarea
                        ref={commentRef}
                        placeholder="Post a Reply..."
                        className={`text-[14px] font-500 text-[#111827] bg-transparent outline-none w-full break-words ${data?.status === "Closed"
                          ? "placeholder-[#535863]"
                          : "placeholder-[#535863]"
                          }`}
                        autoFocus={isInputFocused || true}
                        aria-disabled={data?.status == "Closed"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setComment(value.trimStart()); // Prevent initial spaces
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            // Check if Enter is pressed without Shift
                            e.preventDefault(); // Prevents a new line from being added
                            if (data?.status !== "Closed") {
                              handleSendMessage(); // Trigger message send
                            }
                          }
                        }}
                        onFocus={() => setIsInputFocused(true)}
                        disabled={data?.status === "Closed"}
                        style={{
                          cursor:
                            data?.status === "Closed" ? "not-allowed" : "text",
                          resize: data?.status === "Closed" ? "none" : "both", //
                        }}
                        value={comment}
                      />
                      {data?.status == "Closed" &&
                        userDetails?.role_id != 1 &&
                        userDetails.role_id != 4 && (
                          <div
                            className="absolute top-0 left-0 w-full h-full  flex items-center justify-center text-center text-[#111827] font-500 text-[14px] opacity-80 cursor-pointer"
                            style={{
                              cursor: "not-allowed",
                            }}
                          >
                            Ticket is closed, if you wish to reopen it &nbsp;
                            <span
                              className="underline text-secondary cursor-pointer"
                              onClick={() => handleStatusMenuClick("Re Opened")}
                            >
                              {" "}
                              Click Here
                            </span>
                          </div>
                        )}
                    </div>
                    {/* {!isMobile && ( */}
                    <div
                      style={{
                        display: "flex",

                        gap: 10,
                        paddingTop: 15,
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
                                      {
                                        <TruncateText
                                          text={file?.name}
                                          maxWidth={40}
                                        />
                                      }
                                    </div>
                                  </div>{" "}
                                </div>
                              ) :
                                file.type.includes(".document") ? (
                                  <div>
                                    <div className="fileContainer">
                                      <DescriptionIcon
                                        sx={{
                                          fontSize: 20,
                                          color: "#4F46E5",
                                        }}
                                      />{" "}
                                      <div className="fileName">
                                        {
                                          <TruncateText
                                            text={file?.name}
                                            maxWidth={40}
                                          />
                                        }
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
                                ) : file.type.startsWith("audio/") ? (
                                  <div>
                                    <div className="fileContainer">
                                      <ChatAudio className="icon" />
                                      <div className="fileName">
                                        {
                                          <TruncateText
                                            text={file?.name}
                                            maxWidth={40}
                                          />
                                        }
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
                                      {
                                        <TruncateText
                                          text={file?.name}
                                          maxWidth={40}
                                        />
                                      }
                                    </div>
                                  </div>
                                ) : null}
                            </div>
                          );
                        })}
                      </div>
                      {/* {isInputFocused && ( */}
                      <div className={`flex items-center justify-end `}>
                        <label
                          htmlFor="file-input"
                          style={{
                            cursor:
                              data?.status === "Closed"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <IconButton
                            component="span"

                            disabled={data?.status === "Closed"}
                            sx={{
                              cursor:
                                data?.status === "Closed"
                                  ? "not-allowed"
                                  : "pointer",
                              '&:hover': {
                                background: 'transparent',
                              },
                            }}
                          >
                            {data?.status == "Closed" ? (
                              <SupoortChatCloseIcon />
                            ) : (
                              <SupoortChatIcon />
                            )}{" "}
                          </IconButton>

                          <input
                            type="file"
                            id="file-input"
                            multiple
                            disabled={data?.status === "Closed"}
                            // autoFocus={true}
                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.webm,.xlsx,.mp4,.mp3,.txt"
                            style={{
                              cursor:
                                data?.status == "Closed"
                                  ? "not-allowed"
                                  : "pointer",
                              display: "none",
                            }}
                            onChange={handleUploadFile} // Updated to handle multiple files
                          />
                        </label>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: 'transparent',
                            },
                          }}
                          type="submit"
                          style={{
                            cursor:
                              data?.status === "Closed"
                                ? "not-allowed"
                                : "pointer",
                            background:
                              data?.status === "Closed" && "transparent",
                            width: 70,
                            height: 60,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            data?.status !== "Closed"
                              ? handleSendMessage()
                              : "";
                          }}
                        >
                          {data?.status == "Closed" ? (
                            <ChatCloseIcon />
                          ) : (
                            <ChatIcon />
                          )}
                        </IconButton>
                      </div>
                      {/* )} */}
                    </div>

                    {/* )} */}
                  </div>
                </div>

                {/* {isMobile && (
                  <div className=" px-14 flex gap-6 overflow-x-auto max-h-64 ">
                    {uploadedFiles?.map((file: any) => {
                      return (
                        <div
                          key={file}
                          style={{
                            position: "relative",
                            width: 60,
                            height: 60,

                            // background: "green",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                              cursor: "pointer",
                            }}
                            onClick={() => handleRemoveFile(file)}
                          >
                            <CrossIconForImg />
                          </span>
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{
                                height: "100%",
                                width: "100%",
                                minWidth: 60,
                                borderRadius: 10,
                              }}
                            />
                          ) : file.type === "application/pdf" ? (
                            <div>
                              <PictureAsPdfIcon
                                sx={{
                                  fontSize: 60,
                                  color: "#4f46e5",
                                }}
                              />{" "}
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
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )} */}
              </form>
            )}
          </Grid>
        </Grid>
      </div>

      <div className="px-28 mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm"></div>
        {isOpenAddModal && (
          <AddNewTicket
            isOpen={isOpenAddModal}
            setIsOpen={setIsOpenAddModal}
            fetchSupportList={fetchDepartmentList}
          />
        )}
      </div>
    </>
  );
}
