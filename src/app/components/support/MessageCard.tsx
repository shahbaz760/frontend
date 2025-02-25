import ListLoading from "@fuse/core/ListLoading";
import DescriptionIcon from "@mui/icons-material/Description";
import { CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { ChatPDF, ChatPDFBox, CrossGreyIcon } from "public/assets/icons/common";
import { AttachmentIcon } from "public/assets/icons/supportIcons";
import { useEffect, useState } from "react";
const MessageCard = ({ isSender, data, loader = false }) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (data?.Support_Attachments_details.length > 0) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000); // 2 seconds

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [data?.Support_Attachments_details]);

  return (
    <>
      <div
        className={`flex  flex-col bg-white md:w-[8s00px] sm:w-[500px] md:min-w-[800px] px-20 pb-20 ${!isSender ? "border-t-4 " : ""} rounded-[6px]`}
        style={{
          borderColor: "#4F46E5",
          alignSelf: isSender ? "flex-end" : "flex-start",
        }}
      >
        {/* {background && (
          <div className="w-full h-3 rounded-t-[6px]  bg-secondary"></div>
        )} */}
        {/* <div className=" "> */}

        {/* {!isSender && data.continue && ( */}

        <div
          className={
            " flex items-center gap-10 my-3  justify-between py-10 border-b-[#EDEDFC] border-b-1"
          }
          style={{
            // alignSelf: isSender ? "flex-end" : "flex-start",
            flexDirection: isSender ? "row-reverse" : "row",
            marginRight: isSender ? 20 : "",
          }}
        >
          <div
            className="flex items-center gap-10 "
            style={{
              flexDirection: isSender ? "row-reverse" : "row",
            }}
          >
            <div className="w-[50px] sm:w-auto">
              <img
                src={
                  data?.user_image
                    ? urlForImage + data?.user_image
                    : "../assets/images/logo/images.jpeg"
                }
                alt=""
                className="h-[38px] w-[38px] rounded-full"
              ></img>
            </div>
            <div>
              <Typography className="text-[14px] font-500 text-[#111827]">
                {data?.user_name ? data?.user_name : "N/A"}
              </Typography>
            </div>
          </div>
          <div
            className={` text-[12px] font-500 text-[#757982]  flex items-end ${isSender ? "justify-end" : "justify-start"} min-w-64
           break-keep sm:whitespace-nowrap whitespace-normal`}
            // style={{
            //   marginRight: isSender ? 20 : "",
            //   marginLeft: isSender ? "" : 60,
            // }}
          >
            {data?.created_at
              ? moment(data?.created_at).format("DD/MM/YYYY [at] hh:mm A")
              : "N/A"}
          </div>
        </div>

        {/* )} */}

        <div>
          {/* {!isSender && data.continue && ( */}

          {/* )} */}
          <div
            className={`rounded-[10px] p-8  h-auto  `}
            style={{
              marginRight: isSender ? 20 : "",
              // marginLeft: isSender ? "" : !isSender && !data.continue ? 60 : 17,
            }}
          >
            <div className="flex flex-col items-start gap-5">
              <Typography
                className="text-[14px] font-400  "
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {data?.message}
              </Typography>
              {/* {showLoader && <ListLoading />} */}
              {data?.Support_Attachments_details.length > 0 && (
                <div className="py-10 flex justify-between w-full">
                  <div className="flex gap-20  flex-wrap ">
                    {data?.Support_Attachments_details?.map((item) => {
                      const url = item.file.includes("http")
                        ? item.file.replace(
                            `.${item.file.split(".").pop()}`,
                            ""
                          )
                        : urlForImage + item.file;
                      return (
                        <div className="relative">
                          {item.file.includes(".png") ||
                          item.file.includes(".jpg") ||
                          item.file.includes(".webp") ||
                          item.file.includes(".jfif") ||
                          item.file.includes(".jpeg") ||
                          item.file.startsWith("image/") ? (
                            <>
                              <img
                                src={url}
                                alt="Black Attachment"
                                className="w-[105px] h-[74px] rounded-md "
                              />
                              <div
                                className="absolute top-7 right-7 cursor-pointer"
                                onClick={() => handleImageClick(url)}
                              >
                                <AttachmentIcon />
                              </div>
                            </>
                          ) : (
                            <>
                              {item.file.includes(".xlsx") && (
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
                              {item.file.includes(".pdf") && (
                                <div className=" w-[60px] h-[74px] justify-center items-center flex">
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ChatPDFBox />{" "}
                                  </a>
                                </div>
                              )}
                              {item.file.includes(".mp3") && (
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
                              {/* {item.file.includes(".webm") && (
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
                              {item.file_type.includes("video/") && (
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

                              {item.file_type.includes("application/") && (
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
                        </div>
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
            </div>

            <Typography className="text-grey text-right">
              {data?.sending ? (
                <CircularProgress size={24} sx={{ color: "#4f46e5" }} />
              ) : (
                ""
              )}
            </Typography>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};
export default MessageCard;
