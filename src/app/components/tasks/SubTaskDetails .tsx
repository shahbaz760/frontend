import {
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
import { DeleteGrey, EditIcon } from "public/assets/icons/common";
import { ThreeDotsIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
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
import TaskDetailData from "./TaskDetailData";

import ListLoading from "@fuse/core/ListLoading";
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
const SubTaskDetails = () => {
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const { taskId, parentTaskId } = useParams();
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
  const [recordingTime, setRecordingTime] = useState(0);
  const [deleteId, setIsDeleteId] = useState<any>(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [subtaskList, setSubTaskList] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(null);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [disable, setDisabled] = useState(false);
  const [complete, setComplete] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [type, setType] = useState(null);
  const open = Boolean(anchorEl);
  const clientId = getClientId();
  const navigate = useNavigate();
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const toggleEditModal = () => {
    // setOpenEditModal(true);
    // if (openEditModal) {
    //   // formik.setFieldValue("name", originalTitle);
    // } else {
    //   // setOriginalTitle(formik.values.name);
    // }
    setIsOpenAddSubTaskModal(!isOpenAddSubTaskModal);
  };

  useEffect(() => {
    dispatch(getStatusList({ id: projectId })).then((res) => {
      setStatusMenuData(res?.payload?.data?.data?.list);
    });
  }, [taskDetailInfo]);

  const handleStatusMenuClick = (event) => {
    setStatusMenu(event.currentTarget);
  };

  useEffect(() => {
    if (!taskId) return null;
    dispatch(getTaskDetails(taskId));
  }, [dispatch]);
  useEffect(() => {
    setSelectedStatusId(taskDetailInfo?.status);
  }, [taskDetailInfo?.status]);
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

  const fetchSubTaskList = async () => {
    await dispatch(
      getSubTaskList({
        task_id: taskId,
        start: 0,
        limit: 10,
        search: "",
      })
    ).then((res) => {
      setSubTaskList(res?.payload?.data?.data?.list);
    });
  };

  useEffect(() => {
    fetchSubTaskList();
  }, []);
  const isDateBeforeToday = taskDetailInfo?.due_date_time
    ? moment(taskDetailInfo?.due_date_time).isBefore(moment(), "day")
    : false;

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
    <div>
      <TitleBar title="Subtask Details"></TitleBar>

      <div className="px-28 flex gap-20 flex-wrap lg:flex-nowrap pb-20">
        <div className="basis-full lg:basis-auto lg:grow w-[100%] ">
          {fetchStatusTask === "loading" ? (
            <ListLoading />
          ) : (
            <div className="shadow-md bg-white rounded-lg ">
              <div className="border border-[#E7E8E9] rounded-lg flex  justify-left gap-[30px] items-start p-[2rem] flex-col sm:flex-row relative">
                <div className="w-full">
                  <div className="flex justify-between gap-40 mb-10 relative ">
                    <div
                      className="text-[20px] text-[#111827] font-600 inline-block overflow-x-hidden w-[95%] "
                      style={{ wordBreak: "break-word" }}
                    >
                      {taskDetailInfo?.title}
                    </div>
                    <div className="flex  justify-end gap-20  bg-red-20 ">
                      {/* <div className="flex justify-between gap-10 items-center"> */}

                      {/* {userDetails?.role_id != 3 && ( */}
                      <div className="flex gap-4 absolute">
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
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              toggleEditModal();
                            }}
                          >
                            <div className="flex gap-20 w-full justify-between ">
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
                    <div className="flex">
                      {/* <span>{agentDetail?.id || "N/A"}</span> */}
                      Due Date :&nbsp;
                      {isDateBeforeToday ? (
                        <Tooltip
                          title={"This task is overdue "}
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
                          <span className="font-500 text-[red] text-[14px]">
                            {taskDetailInfo?.due_date_time
                              ? moment
                                .utc(taskDetailInfo?.due_date_time)
                                .format("MMMM Do, YYYY , h:mm A")
                              : "N/A"}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="font-500 text-[#111827] text-[14px]">
                          {taskDetailInfo?.due_date_time
                            ? moment
                              .utc(taskDetailInfo?.due_date_time)
                              .format("MMMM Do, YYYY , h:mm A")
                            : "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                  {taskDetailInfo?.task_selected_labels?.length !== 0 && (
                    // <div className=" bg-[#EDEDFC] flex gap-10 py-10 px-20 mt-[10px] items-center rounded-[28px] w-max">
                    //   <div className="text-[#4F46E5]">
                    //     <ImportantTaskIcon />
                    //   </div>
                    //   {/* {agentDetail?.status || "N/A"} */}
                    //   <div className="text-[#4F46E5] text-[16px] font-500 ">
                    //     {/* {taskDetailInfo?.labels} */}
                    //     Label

                    //   </div>
                    // </div>) :
                    <div className="flex gap-8 mt-[10px] flex-wrap">
                      {taskDetailInfo?.task_selected_labels?.map(
                        (item, index) => (
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
                        )
                      )}
                    </div>
                  )}

                  <div className="flex text-[2rem] text-para_light mt-4 gap-10 justify-between break-words ">
                    <Typography className="text-[#757982] font-400 text-[14px] ">
                      {taskDetailInfo?.description || null}
                    </Typography>
                  </div>

                  <div className="border-t mt-20">
                    <div className="flex items-center  border-gray-300 py-2 font-semibold text-gray-600 mt-5"></div>
                    <div className="flex items-center border-gray-200 py-2">
                      <div className="flex items-center w-1/4"></div>
                    </div>
                  </div>

                  <div className="flex w-4/5 justify-between items-center">
                    <div>
                      <div className="w-1/4 text-[#757982] font-500">
                        Priority
                      </div>
                      <div className="flex items-center   mt-10 ">
                        {!taskDetailInfo?.priority ? (
                          "N/A"
                        ) : (
                          <span className="bg-[#FF5F152E] text-[#FF5F15] px-10whitespace-nowrap py-1  rounded-full  w-[70px] min-h-[25px] text-sm font-500 flex text-center items-center justify-center">
                            {taskDetailInfo?.priority || "N/A"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <RightBorder />
                    </div>
                    <div>
                      <div className="w-1/4 text-[#757982] font-500 mt-10">
                        Status
                      </div>
                      {/* {userDetails?.role_id != 3 && ( */}

                      <div className="flex items-center w-1/4 ">
                        <span className=" -mt-1 text-[14px] font-500 whitespace-nowrap">
                          {taskDetailInfo?.column_name == "Completed" ? (
                            <Checkbox
                              checked={true}
                              sx={{
                                padding: "0px 9px 0px 0px", // Adjust the padding here
                                "& .MuiCheckbox-root": {
                                  padding: "0px 9px 0px 0px",
                                },
                              }}
                              className="pl-0  cursor-default !bg-transparent"
                              icon={<RadioButtonUnchecked />} // Circle when unchecked
                              checkedIcon={<CheckCircleOutline />}
                            />
                          ) : (

                            <Tooltip
                              title="Mark complete"
                              placement="top"
                              arrow
                            >
                              <Checkbox
                                onClick={(e) => handleCompleteTask()}
                                checked={hovered || complete}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    color: "grey",
                                    fontSize: 24,
                                  },
                                  "&.Mui-checked": {
                                    color: "grey",
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
                                (item) => item.id === taskDetailInfo?.status
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
                      <div className="flex mt-10 w-1/4">
                        <span className=" text-[14px] font-500 whitespace-nowrap">
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
                      <div className="w-1/4 text-[#757982] font-500">
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

                  {/* <div className="flex items-baseline justify-between w-full pt-0 pb-20 gap-31 my-10"></div> */}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* <div className="basis-[320px] ">
          <TaskDetailData id={projectId} taskId={parentTaskId} />
        </div> */}
        {isOpenAddSubTaskModal && (
          <AddSubTaskModal
            isOpen={isOpenAddSubTaskModal}
            setIsOpen={setIsOpenAddSubTaskModal}
            project_id={projectId}
            fetchSubTaskList={fetchSubTaskList}
            ColumnId={taskId}
            Edit
          />
        )}
        <DeleteClient
          isOpen={isOpenDeletedModal}
          setIsOpen={setIsOpenDeletedModal}
          onDelete={() => handleDeleteAttachment(deleteId)}
          heading={"Delete Attachment"}
          description={"Are you sure you want to delete this attachment? "}
        />
        <ActionModal
          modalTitle="Delete Subtask"
          modalSubTitle="Are you sure you want to delete this subtask?"
          open={openDeleteModal}
          handleToggle={toggleDeleteModal}
          type="delete"
          onDelete={handleDelete}
          disabled={disable}
        />
      </div>
    </div>
  );
};

export default SubTaskDetails;
