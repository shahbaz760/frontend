import ListLoading from "@fuse/core/ListLoading";
import {
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { filterType } from "app/store/Client/Interface";
import { GetFileList, GetFileUrl, deleteFile } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import clsx from "clsx";
import moment from "moment";
import {
  DeleteIcon,
  DownloadIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ActionModal from "src/app/components/ActionModal";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import UploadFileName from "src/app/components/sharedFiles/UploadFIleName";
import { getClientId, getToken, getUserDetail } from "src/utils";

export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

function SharedFiles() {
  const theme = useTheme();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [disable, setDisable] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);

  const PasswordState = useSelector((state: RootState) => state.password);
  const userDetails = getUserDetail();
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });

  const dispatch = useAppDispatch();

  const fetchFileList = async () => {
    try {
      const res = await dispatch(GetFileList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDelete = async () => {
    setDisable(true);
    try {
      const payload = {
        password_manager_id: deleteId,
      };
      //@ts-ignore
      const res = await dispatch(deleteFile(payload));
      if (res?.payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: PasswordState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
      }
      fetchFileList();
      setOpenDeleteModal(false);
      toast.success(res?.payload?.data?.message);

      // toast.dismiss();
      setIsDeleteId(null);
      setTimeout(() => {
        setDisable(false);
      }, 500);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilters((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  useEffect(() => {
    fetchFileList();
  }, [filters.limit, filters.start, filters.search]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFile(acceptedFiles[0]);
    setIsOpenAddModal(true);
  }, []);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDownloadImg = async (name) => {
    try {
      const res = await dispatch(GetFileUrl(name));
      if (res?.payload?.data?.status == 1) {
        window.open(res?.payload?.data?.data, "_blank");
      } else {
        toast.error(res?.payload?.data?.message);
      }
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
  return (
    <div>
      {(userDetails.role_id == 2 || userDetails.role_id == 5) && (
        <TitleBar title="Shared File" />
      )}
      <div className="px-[15px] mb-[3rem]">
        {(userDetails.role_id == 2 || userDetails.role_id == 5) && (
          <div
            {...getRootProps()}
            className="border-2 border-dashed !border-secondary  overflow-hidden rounded-lg"
          >
            <div
              className={clsx(
                "h-[230px] bg-secondary_bg flex flex-col items-center gap-20 justify-center transition",
                isDragActive && "opacity-50"
              )}
            >
              <input {...getInputProps()} />
              <img
                className="max-w-[100px]"
                src="/assets/images/pages/sharedFiles/drop.svg"
                alt=""
              />
              <Typography className="text-3xl px-20 text-center">
                {isDragActive ? (
                  "Drop the files here to upload ..."
                ) : (
                  <>
                    Drag and drop a file or{" "}
                    <span className="text-secondary underline cursor-pointer">
                      browse
                    </span>
                  </>
                )}
              </Typography>
            </div>
          </div>
        )}
        <div className="shadow-sm bg-white rounded-lg mt-[3rem]">
          <Typography className="text-2xl font-semibold px-[18px] py-20">
            Uploaded Files
          </Typography>
          <CommonTable headings={["Name of File", "Uploaded Date", "Actions"]}>
            {PasswordState?.list?.length === 0 &&
            PasswordState?.status !== "loading" ? (
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell colSpan={7} align="center">
                  <div
                    className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                    style={{ alignItems: "center" }}
                  >
                    <NoDataFound />
                    <Typography className="text-[24px] text-center font-600 leading-normal">
                      No data found!
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            ) : PasswordState.status === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render your loader component here */}
                </TableCell>
              </TableRow>
            ) : (
              PasswordState?.list?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "& td": {
                      fontWeight: 500,
                      borderBottom: "1px solid #EDF2F6",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <TableCell className="w-[33.33%] max-w-[33.33%] ">
                    <div className="flex items-center gap-[1.8rem]">
                      <div className="h-[38px] rounded-full bg-secondary_bg aspect-square flex items-center justify-center">
                        {item?.file_type?.split("/")[0] == "application" ? (
                          <img
                            className="w-[22px] h-auto"
                            src="/assets/images/pages/sharedFiles/pdfIcon.png"
                            alt="pdfIcon"
                          />
                        ) : (
                          <img
                            className=" h-auto"
                            src="/assets/images/pages/sharedFiles/imageIcon.png"
                            alt="image"
                          />
                        )}
                      </div>
                      <TruncateText text={item?.file_name} maxWidth={250} />
                      {/* Preview{" "}
                      {item?.file_type?.split("/")[0] == "application"
                        ? item?.file_type?.split("/")[1]
                        : item?.file_type?.split("/")[0]} */}
                    </div>
                  </TableCell>

                  <TableCell align="center" className="whitespace-nowrap">
                    {moment(item?.createdAt).format("ll")}
                  </TableCell>
                  <TableCell align="center" className="whitespace-nowrap">
                    <div className="flex gap-20 justify-center items-center">
                      {/* <a
                        href={urlForImage + item?.file}
                        target="_blank"
                        download
                      > */}
                      <div
                        className="cursor-pointer"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        <div onClick={() => handleDownloadImg(item?.file_key)}>
                          <DownloadIcon />
                        </div>
                      </div>

                      {/* </a> */}
                      <div
                        className="cursor-pointer"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        {(userDetails?.role_id == 2 ||
                          (item?.client_id == userDetails?.id &&
                            userDetails?.role_id == 5)) && (
                          <div
                            onClick={() => {
                              setOpenDeleteModal(true);
                              setIsDeleteId(item?.id);
                            }}
                          >
                            <DeleteIcon />
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </CommonTable>

          <div className={`flex justify-end py-14 px-[3rem]`}>
            <>
              {/* {(userDetails.role_id == 2 || userDetails.role_id == 5) && (
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Shared: ${PasswordState?.total_items}`}</Typography>
              )} */}
              {PasswordState.status !== "loading" && (
                <CommonPagination
                  limit={limit}
                  total={PasswordState?.total_items}
                  setLimit={setLimit}
                  responsive={true}
                  count={PasswordState?.total_records}
                  page={filters.start + 1}
                  onChange={(event, pageNumber) =>
                    checkPageNum(event, pageNumber)
                  }
                />
              )}
            </>
          </div>
        </div>
      </div>
      <UploadFileName
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        uploadedFile={uploadedFile}
        fetchFileList={fetchFileList}
      />
      <ActionModal
        modalTitle="Delete File"
        modalSubTitle="Are you sure you want to delete this File?"
        open={openDeleteModal}
        handleToggle={() => setOpenDeleteModal((prev) => !prev)}
        type="delete"
        onDelete={onDelete}
        disabled={disable}
      />
    </div>
  );
}

export default SharedFiles;
