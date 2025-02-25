import {
  Button,
  Checkbox,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/styles";
import { getStatusList, getSubTaskList } from "app/store/Agent";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  CrossGreyIcon,
  DeleteGrey,
  EditIcon,
} from "public/assets/icons/common";
import { PlusIcon, ThreeDotsIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import AddTaskModal from "src/app/components/tasks/AddTask";
// import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import {
  CheckedTask,
  deleteTask,
  TaskDetails as getTaskDetails,
  TaskDeleteAttachment,
  TaskStatusUpdate,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import {
  ImportantTaskIcon,
  RightBorder,
  StatusIcon,
} from "public/assets/icons/task-icons";
import AddSubTaskModal from "./AddSubTaskModal";
import SubTaskTable from "./SubTaskTable";
import TaskDetailData from "./TaskDetailData";

import ListLoading from "@fuse/core/ListLoading";
import {
  AttachmentDeleteIcon,
  AttachmentIcon,
} from "public/assets/icons/supportIcons";
import toast from "react-hot-toast";
import { useVoiceVisualizer } from "react-voice-visualizer";
import { getClientId, getUserDetail } from "src/utils";
import ActionModal from "../ActionModal";
import DropdownMenu from "../Dropdown";
import CommonChip from "../chip";
import DeleteClient from "../client/DeleteClient";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 20px",
  minWidth: "250px",
}));
const TaskDetails = () => {
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const { taskId } = useParams();
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { taskDetailInfo, fetchSatus, fetchStatusTask } = useSelector(
    (store: ProjectRootState) => store.project
  );

  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const theme: Theme = useTheme();
  const [isOpenAddSubTaskModal, setIsOpenAddSubTaskModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<any>(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [subtaskList, setSubTaskList] = useState([]);
  const [subtaskAllList, setSubTaskAllList] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [disable, setDisabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [complete, setComplete] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [subtaskTotal, setSubtasktotal] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [type, setType] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const clientId = getClientId();
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const toggleEditModal = () => {
    // e.stoppropagation();
    setIsOpenAddModal(true);
    if (openEditModal) {
      // formik.setFieldValue("name", originalTitle);
    } else {
      // setOriginalTitle(formik.values.name);
    }
    setOpenEditModal(!openEditModal);
  };
  useEffect(() => {
    setSelectedStatusId(taskDetailInfo?.status);
  }, [taskDetailInfo?.status]);
  useEffect(() => {
    dispatch(getStatusList({ id: projectId })).then((res) => {
      setStatusMenuData(res?.payload?.data?.data?.list);
    });
  }, [taskDetailInfo]);

  const handleStatusMenuClick = (event) => {
    setStatusMenu(event.currentTarget);
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
  useEffect(() => {
    if (!taskId) return null;
    dispatch(getTaskDetails(taskId));
  }, [dispatch]);

  const handleDeleteAttachment = async (id: number) => {
    // const { payload } = await dispatch(deleteAttachment({ attachment_id: id }));
    const { payload } = await dispatch(
      TaskDeleteAttachment({ type: type, file_id: id })
    );
    if (payload?.data?.status) {
      dispatch(getTaskDetails(taskId));
    }
    setIsOpenDeletedModal(false);
  };

  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };

  const handleDelete = () => {
    const clientId = getClientId();
    if (taskId) {
      setDisabled(true);
      dispatch(deleteTask(taskId));
      navigate(
        `/projects/${taskDetailInfo.project_id}/${taskDetailInfo.project_name}${clientId ? `?ci=${clientId}` : ""}`
      );
    }
  };

  const callListApi = (param: number) => {
    dispatch(getTaskDetails(taskId));
    // Add actual logic here
  };

  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error } = recorderControls; // setPreloadedAudioBlob

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  const fetchAudioBlob = async () => {
    try {
      const response = await fetch(
        "https://rcw-dev.s3.amazonaws.com/Tasks/76/1718098937245-rcw.mp3"
      );
      const audioData = await response.blob();
      return audioData;
    } catch (error) {
      console.error("Error fetching audio blob:", error);
      return null;
    }
  };
  useEffect(() => {
    fetchAudioBlob().then((audioBlob) => {
      if (audioBlob) {
        // Use the audioBlob as needed, for example, create a URL for it
        const audioUrl = URL.createObjectURL(audioBlob);
        // setPreloadedAudioBlob(audioUrl);

        // You can now use audioUrl as the source for an audio element or for any other purpose
      }
    });
  }, []);

  const handleStatusMenuItemClick = async (status) => {
    setSelectedStatus(status.name);
    setSelectedStatusId(status.id);
    const payload = {
      status: status.id,
      task_id: taskId,
    };
    const res = await dispatch(TaskStatusUpdate(payload));
    toast.success(res?.payload?.data?.message);
    setStatusMenu(null); // Close the dropdown menu after selection
  };

  const userDetails = getUserDetail();

  const fetchSubTaskList = async (task_start = 0) => {
    await dispatch(
      getSubTaskList({
        task_id: taskId,
        start: task_start,
        limit: 10,
        search: "",
      })
    ).then((res) => {
      const newSubTasks = res?.payload?.data?.data?.list || [];
      setSubtasktotal(res?.payload?.data?.data?.total_records)
      setSubTaskList(newSubTasks);
      setSubTaskAllList((prevTaskData) =>
        task_start > 0 ? [...prevTaskData, ...newSubTasks] : newSubTasks
      );
    });
  };

  useEffect(() => {
    fetchSubTaskList();
  }, []);
  const dueDateTime = taskDetailInfo?.due_date_time;
  const isValidDate = moment(dueDateTime, moment.ISO_8601, true).isValid();

  const formatedData = isValidDate
    ? moment.utc(dueDateTime).format("MMM Do, YYYY , h:mm A")
    : "N/A";
  const currentTime = moment().format("MMM Do, YYYY , h:mm A");

  const handleCompleteTask = () => {
    if (taskId) {
      setDisabled(true);
      dispatch(CheckedTask(taskId))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            callListApi(0);
            toast.success(res?.data?.message, {
              duration: 4000,
            });
          } else {
            toast.error(res?.data?.message, {
              duration: 4000,
            });
          }
        });

      setDisabled(false);
      setComplete(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TitleBar title="Task Details"></TitleBar>

      <div className="px-28 flex gap-20 sm:flex-row flex-col pb-20">
        <div className="basis-full lg:basis-auto lg:grow sm:w-[80%]  ">
          {fetchStatusTask === "loading" ? (
            <ListLoading />
          ) : (
            <div className="shadow-md bg-white rounded-lg  pb-20">
              <div className="border border-[#E7E8E9] rounded-lg flex  justify-left gap-[30px] items-start p-[2rem] flex-col sm:flex-row relative">
                <div className="w-full">
                  <div className="flex justify-between gap-40 mb-10 flex-row ">
                    <div
                      className="text-[20px] text-[#111827] font-600 inline-block overflow-x-hidden sm:w-[95%] w-full"
                      style={{ wordBreak: "break-word" }}
                    >
                      {taskDetailInfo?.title}
                    </div>
                    <div className="flex items-center  sm:justify-end gap-20  bg-red-20 ">
                      {/* <div className="flex justify-between gap-10 items-center"> */}

                      {/* {userDetails?.role_id != 3 && ( */}
                      <div className="flex gap-4">
                        <span
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                        >
                          <ThreeDotsIcon className="cursor-pointer" />
                        </span>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem>
                            <div
                              className="flex gap-20 w-full justify-between  "
                              onClick={() => {
                                handleClose();
                                toggleEditModal();
                              }}
                            >
                              <p className="text-[16px] text-[#000000] font-500">
                                Edit
                              </p>
                              <span className="">
                                <EditIcon fill="#757982" />
                              </span>
                            </div>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              toggleDeleteModal();
                            }}
                          >
                            <div className="flex gap-20  w-full justify-between">
                              <p className="text-[16px] text-[#000000] font-500">
                                {" "}
                                Delete
                              </p>
                              <span className="">
                                <DeleteGrey fill="#757982" />
                              </span>
                            </div>
                          </MenuItem>
                        </Menu>
                      </div>
                      {/* )} */}
                    </div>
                  </div>

                  <div className="flex text-[14px] text-para_light my-10 font-400 ">
                    <div className="flex gap-4">
                      {/* <span>{agentDetail?.id || "N/A"}</span> */}
                      Due Date:{" "}
                      <div
                        className={`${Date.parse(formatedData) < Date.parse(currentTime) ? "text-red" : "text-[#111827]"} font-500 text-[14px]`}
                      >
                        {!formatedData ? (
                          <div className="!text-[#111827]">N/A</div>
                        ) : formatedData == "N/A" ? <div className="!text-[#111827]">N/A</div> : formatedData < currentTime ? (
                          <Tooltip
                            title={"This task is overdue"}
                            enterDelay={500}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "common.white",
                                  color: "common.black",
                                  padding: 1,
                                  borderRadius: 10,
                                  boxShadow: 3,
                                  "& .MuiTooltip-arrow": {
                                    color: "common.white",
                                  },
                                },
                              },
                            }}
                          >
                            <div>{formatedData}</div>
                          </Tooltip>
                        ) : (
                          <div>{formatedData}</div>
                        )}
                      </div>

                    </div>
                  </div>

                  <div className="flex text-[2rem] text-para_light mt-4 gap-10 justify-between break-words ">
                    <Typography className="text-[#757982] font-400 text-[14px] w-4/5">
                      {taskDetailInfo?.description || "N/A"}
                    </Typography>
                  </div>

                  {taskDetailInfo?.task_selected_labels?.length !== 0 && (
                    <div className="flex gap-8 mt-[10px] flex-wrap">
                      {taskDetailInfo?.task_selected_labels?.map((item, index) => (
                        //@ts-ignore
                        <div className=" bg-[#EDEDFC] flex gap-10 py-10 px-20  items-center rounded-[28px] w-max">
                          <div className="text-[#4F46E5]">
                            <ImportantTaskIcon />
                          </div>
                          {/* {agentDetail?.status || "N/A"} */}
                          <div className="text-[#4F46E5] text-[16px] font-500 ">
                            {
                              //@ts-ignore
                              item?.label
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t mt-20">
                    <div className="flex items-center  border-gray-300 py-2 font-semibold text-gray-600 mt-5"></div>
                    <div className="flex items-center border-gray-200 py-2">
                      <div className="flex items-center w-1/4"></div>
                    </div>
                  </div>

                  <div className="flex  w-full  justify-between items-center flex-wrap gap-10 lg:flex-nowrap">
                    <div>
                      <div className="w-1/4 text-[#757982] font-500">
                        Priority
                      </div>
                      <div className="flex items-center w-1/4 ">
                        {!taskDetailInfo?.priority ? "N/A" :
                          <span
                            className={`${taskDetailInfo?.priority == null ? "" : "bg-[#FF5F152E] text-[#FF5F15]"} px-10 mt-10 whitespace-nowrap py-1
                          rounded-full  w-[70px] min-h-[25px] text-[14px] font-500 flex text-center items-center justify-center`}
                          >
                            {taskDetailInfo?.priority}
                          </span>}
                      </div>
                    </div>
                    <div>
                      <RightBorder />
                    </div>
                    <div>
                      <div className="w-1/4 text-[#757982] font-500">
                        Status
                      </div>
                      {/* {userDetails?.role_id != 3 && ( */}
                      <div className="flex items-center w-1/4 ">
                        <span className=" mt-10 text-[14px] font-500 whitespace-nowrap">
                          {taskDetailInfo?.column_name == "Completed" ? (
                            <Checkbox
                              checked={true}
                              sx={{
                                padding: "0px 9px 0px 0px", // Adjust the padding here
                                "& .MuiCheckbox-root": {
                                  padding: "0px 9px 0px 0px",
                                },
                                '& .MuiButtonBase-root-MuiCheckbox-root:hover': {
                                  background: 'none !important'
                                }
                              }}
                              className="pl-0  cursor-default !bg-transparent"
                              icon={<RadioButtonUnchecked />}  // Circle when unchecked
                              checkedIcon={<CheckCircleOutline />}
                            />
                          ) : (
                            // <Tooltip
                            //   title={"Move to Complete "}
                            //   enterDelay={500}
                            //   componentsProps={{
                            //     tooltip: {
                            //       sx: {
                            //         bgcolor: "common.white",
                            //         color: "common.black",
                            //         padding: 1,
                            //         borderRadius: 10,
                            //         boxShadow: 3,

                            //         "& .MuiTooltip-arrow": {
                            //           color: "common.white",
                            //         },
                            //       },
                            //     },
                            //   }}
                            // >
                            <Tooltip title="Mark complete" placement="top" arrow >
                              <Checkbox
                                onClick={(e) => handleCompleteTask()}

                                checked={hovered || complete}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}

                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    color: 'grey',
                                    fontSize: 24,
                                  },
                                  '&.Mui-checked': {
                                    color: 'grey',
                                  },
                                }}
                                className="pl-0 !bg-transparent"
                                icon={<RadioButtonUnchecked />}
                                checkedIcon={<CheckCircleOutline />}
                              />
                            </Tooltip>
                          )}
                          {taskDetailInfo?.status
                            ? taskDetailInfo?.status
                              ? statusMenuData?.find(
                                (item) => item.id == taskDetailInfo?.status
                              )?.name
                              : "N/A"
                            : "N/A"}
                        </span>
                      </div>

                    </div>
                    <div>
                      <RightBorder />
                    </div>
                    <div>
                      <div className="w-1/4 text-[#757982] font-500">
                        Reminder
                      </div>
                      <div className="flex  w-1/4">
                        <span className=" mt-12 text-[14px] font-500 whitespace-nowrap">
                          {taskDetailInfo?.reminders
                            ? moment
                              .utc(taskDetailInfo?.reminders)
                              .format(" MMMM Do, YYYY , h:mm A")
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <RightBorder />
                    </div>
                    <div>
                      <div className="w-1/4 text-[#757982] font-500 ">
                        Assignees
                      </div>

                      <div
                        className={`flex flex-wrap ${taskDetailInfo?.assigned_task_users?.length === 0 ? "mt-12" : " "}`}
                      >
                        {taskDetailInfo?.assigned_task_users?.length === 0 ? (
                          "N/A"
                        ) : (
                          <>
                            {taskDetailInfo?.assigned_task_users?.map(
                              (item, index) => (
                                <div className="cursor-pointer">
                                  <Tooltip
                                    title={`${item?.first_name || ""} ${item?.last_name || ""}`}
                                  >
                                    <img
                                      key={index}
                                      className="h-[34px] w-[34px] rounded-full border-2 border-white "
                                      src={
                                        item.user_image
                                          ? urlForImage + item.user_image
                                          : "../assets/images/logo/images.jpeg"
                                      }
                                      alt={`User ${index + 1}`}
                                    />
                                  </Tooltip>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-20 my-20 w-full flex-col sm:flex-row">
                    {
                      <div className="relative w-1/2">
                        <Typography className="mb-10 font-500 text-[14px] text-[#000000]">
                          Files
                        </Typography>
                        <div className="flex gap-10  flex-wrap">
                          {taskDetailInfo?.task_files?.map((item) => {
                            return (
                              <div className="relative  ">
                                {item.file.includes(".png") ||
                                  item.file.includes(".jpg") ||
                                  item.file.includes(".webp") || item.file.includes(".jfif") ||
                                  item.file.includes(".jpeg") || item.file.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={urlForImage + item.file}
                                      alt="Black Attachment"
                                      className="w-[200px] rounded-md sm:h-[130px]"
                                    />
                                    <div
                                      className="absolute top-7 left-7 cursor-pointer"
                                      onClick={() =>
                                        handleImageClick(
                                          urlForImage + item.file
                                        )
                                      }
                                    >
                                      <AttachmentIcon />
                                    </div>
                                    <div
                                      className="absolute top-7 right-7 cursor-pointer"
                                    // onClick={() => handleDeleteAttachment(item.id)}
                                    >
                                      {userDetails.role_id != 3 && (
                                        <AttachmentDeleteIcon
                                          onClick={() => {
                                            setIsOpenDeletedModal(true);
                                            setType(3);
                                            setIsDeleteId(item.id);
                                          }}
                                        />
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-[200px] rounded-md sm:h-[130px] flex items-center justify-center border-1 border-[#4F46E5]">
                                    <a
                                      href={urlForImage + item.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <img
                                        src="../assets/images/logo/pdfIcon.png"
                                        alt="Black Attachment"
                                        className="h-[50px] w-[50px]"
                                      />
                                    </a>


                                    <div
                                      className="absolute top-7 right-7 cursor-pointer"


                                    >
                                      {" "}
                                      {userDetails.role_id != 3 && (
                                        <AttachmentDeleteIcon
                                          onClick={() => {
                                            setIsOpenDeletedModal(true);
                                            setType(3);
                                            setIsDeleteId(item.id);
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
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
                    }
                    <div className="w-1/2">
                      <div className="relative">
                        <Typography className="mb-10 font-500 text-[14px] text-[#000000]">
                          Screen Recording
                        </Typography>
                        {taskDetailInfo?.screen_record_file && (
                          <>
                            <video
                              src={
                                urlForImage + taskDetailInfo?.screen_record_file
                              }
                              controls
                              className="block w-full h-[200px]"
                            />
                            {userDetails.role_id != 3 && (
                              <div className="absolute top-[28px] right-0 mt-4 mr-4">
                                <AttachmentDeleteIcon
                                  onClick={() => {
                                    setIsOpenDeletedModal(true);
                                    setType(2);
                                    setIsDeleteId(taskId);
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Typography className="mb-10 font-500 text-[14px] text-[#000000]">
                      Voice Memo
                    </Typography>
                  </div>

                  {taskDetailInfo?.voice_record_file && (
                    <audio controls className="mb-10 xs:w-[230px] ">
                      <source
                        src={urlForImage + taskDetailInfo?.voice_record_file}
                        type="audio/mp3"
                      />
                    </audio>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="sm:text-[20px] text-[17px] font-600">
                      Subtasks
                    </div>
                    {/* {userDetails?.role_id != 3 && ( */}
                    <Button
                      className="text-[16px] font-500 text-[#4F46E5] sm:gap-10  gap-[5px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpenAddSubTaskModal(true);
                        // window.scrollTo(0, document.body.scrollHeight);
                      }}
                    >
                      <PlusIcon color={theme.palette.secondary.main} />
                      Add Subtask
                    </Button>
                    {/* )} */}
                  </div>
                  {/* <div className="flex items-baseline justify-between w-full pt-0 pb-20 gap-31 my-10"></div> */}
                </div>
              </div>
              {subtaskList.length > 0 &&
                <SubTaskTable
                  fetchSubTaskList={fetchSubTaskList}
                  List={subtaskList}
                  AllList={subtaskAllList}
                  total_records={subtaskTotal}
                />}
            </div>
          )}
        </div>
        <div className="md:basis-[320px] basis-[100%] min-h-[600px]">
          <TaskDetailData id={projectId} taskId={taskId} />
        </div>
      </div>
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        heading={"Delete Attachment"}
        description={"Are you sure you want to delete this attachment? "}
      />
      <ActionModal
        modalTitle="Delete Task"
        modalSubTitle="Are you sure you want to delete this task?"
        open={openDeleteModal}
        handleToggle={toggleDeleteModal}
        type="delete"
        onDelete={handleDelete}
        disabled={disable}
      />
      {isOpenAddModal && (
        <AddTaskModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          ColumnId={taskId}
          // callListApi={callListApi}
          project_id={projectId}
          Edit
        />
      )}
      {isOpenAddSubTaskModal && (
        <AddSubTaskModal
          isOpen={isOpenAddSubTaskModal}
          setIsOpen={setIsOpenAddSubTaskModal}
          project_id={projectId}
          fetchSubTaskList={fetchSubTaskList}
          selectedStatusIds={taskDetailInfo?.status}
        />
      )}
    </div>
  );
};

export default TaskDetails;
