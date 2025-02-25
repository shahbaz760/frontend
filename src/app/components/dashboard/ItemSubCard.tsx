import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  CheckedTask,
  deleteTask,
  EditTaskAdd,
  updateProjectColumnList,
  updateProjectColumnListDrag,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import { ClockTask, DeleteIcon } from "public/assets/icons/common";
import {
  HoverEditIcon,
  ThreeDotsIcon,
} from "public/assets/icons/dashboardIcons";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientId,
  getUserDetail,
  listData,
  Role,
  StyledMenuItem,
} from "src/utils";
import ActionModal from "../ActionModal";
import CompleteModal from "../CompleteModal";
// import { CalendarIcon } from "public/assets/icons/dashboardIcons";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import AddSubTaskModal from "../tasks/AddSubTaskModal";
import DropdownMenu from "../Dropdown";
import { dateTimeMenuData, priorityMenuData } from "../tasks/AddTask";
import CustomButton from "../custom_button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateTimePicker } from "@mui/x-date-pickers";
import InputField from "../InputField";
import { debounce } from "lodash";
import { GetAssignAgentsInfo } from "app/store/Client";
type CardType = {
  title?: string;
  priority?: string;
  taskName?: string;
  isChecked?: boolean;
  date?: string;
  images?: string[];
  id?: number;
  index?: any;
  project_id?: any;
  agent?: [];
  is_defalut?: any;
  total_sub_tasks?: any;
  draggedByCheck?: any;
  defalut_name?: any;
  tasks?: any;
  setAllSubtask?: any;
  isComplete?: any;
  parent_task_is?: any;
};
export const TruncateText = ({
  text,
  maxWidth,
  style,
  setUpdatedText,
  editAble,
  setEditable,
  editId,
  id,
  // taskList,
  // setTaskList,
  listData,
  handleEditSubmit,
  updatedText,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [taskTitle, setTaskTitle] = useState(text);

  const textRef = useRef(null);
  useEffect(() => {
    setTaskTitle(text);
  }, [text]);

  const handleInput = (e) => {
    setUpdatedText(e.target.textContent.trim()); // update the state with the new value
  };

  const updateTaskTitle = (id, newTitle, taskList) => {
    return taskList.map((task) =>
      task.id == id ? { ...task, title: newTitle } : task
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents a newline from being added
      setEditable(false); // Set editable to false
      handleEditSubmit();
      // const updatedList = updateTaskTitle(id, updatedText, taskList);
      // setTaskList(updatedList); // Update the task list state
      listData({ loader: false, drag: false });
      if (updatedText == "") {
        setTaskTitle(text);
      } else {
        setTaskTitle(updatedText);
      }
      textRef.current.blur(); // Lose focus
    }
  };

  const handleBlur = () => {
    setEditable(false); // Set editable to false when losing focus
  };
  // Function to move cursor to the end of the contentEditable element
  const setCaretToEnd = () => {
    const el = textRef.current;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(el); // select the contents
    range.collapse(false); // collapse to the end of the selected content
    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);

  // Focus the element when it's editable and move the cursor to the end
  useEffect(() => {
    if (editAble && editId === id && textRef.current) {
      textRef.current.focus();
      setCaretToEnd(); // Move the cursor to the end when it becomes editable
    }
  }, [editAble, editId, id]);

  useEffect(() => {
    setIsTruncated(false);
  }, [editAble]);

  useEffect(() => {
    if (textRef.current && editAble && editId === id) {
      textRef.current.scrollLeft = textRef.current.scrollWidth;
    }
  }, [editAble, editId, taskTitle]);

  return (
    <>
      {editAble && editId === id ? (
        <Typography
          ref={textRef}
          noWrap
          onKeyDown={handleKeyDown}
          contentEditable={editId === id && editAble} // only when editable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleBlur}
          style={{
            maxWidth: `${maxWidth}px`,
            overflowX: "scroll", // Enable horizontal scrolling
            whiteSpace: "nowrap", // Prevent text from wrapping
            textOverflow: "inherit", // Show ellipsis for overflowed text
            color: "#4f46e5", // Highlight color when editable
            marginBottom: 0,
            // cursor: editId === id && editAble ? "text" : "default", // Cursor style based on editability
            fontWeight: 500,
          }}
        >
          {taskTitle.trim()}
        </Typography>
      ) : (
        <Tooltip
          title={text}
          enterDelay={500}
          disableHoverListener={!isTruncated}
        >
          <Typography
            ref={textRef}
            noWrap
            style={{
              // height: 37,
              maxWidth: `${maxWidth}px`,
              overflow: "hidden",
              cursor: "pointer",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {text}
          </Typography>
        </Tooltip>
      )}
    </>
  );
};
export default function ItemSubCard({
  title,
  priority,
  taskName,
  isChecked,
  date,
  id,
  index,
  project_id,
  agent,
  parent_task_is,
  draggedByCheck,
  isComplete,
  setAllSubtask,
  defalut_name,
}: CardType) {
  const maxVisibleImages = 3;
  const visibleAgents = agent?.slice(0, maxVisibleImages);
  const extraAgentsCount = agent?.length - maxVisibleImages;
  const theme: Theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const projectid = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const userDetails = getUserDetail();
  const [updatedText, setUpdatedText] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [disable, setDisabled] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("agent");
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [complete, setComplete] = useState(false);
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [editAble, setEditAble] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const toggleCompleteModal = () => setComplete(!complete);

  const userId = getUserDetail();
  const getLoginedUser = getUserDetail();
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.role_id == 3 ? project_id : getLoginedUser?.id,
    is_user: 1,
    // project_id: is_private == 1 ? project_id : 0,
  });
  function formatDate(dateString) {
    // Define possible input formats, including the new format
    const inputFormats = [
      "DD/MM/YYYY h:mm A",
      "MM/DD/YYYY h:mm A",
      "DD/MM/YYYY h:mm A",
      "YYYY-MM-DD HH:mm",
      "YYYY-MM-DD HH:mm A",

      "DD/MM/YYYY, HH:mm:ss",
      "DD/MM/YYYY , HH:mm:ss",
      "MMM Do, YYYY , h:mm A",
      "DD/MM/YYYY HH:mm",
      "DD/MM/YYYY HH:mm A",
      "YYYY-MM-DD HH:mm:ss",
    ];

    // Try to parse the date with each format
    let date = null;
    for (const format of inputFormats) {
      date = moment.utc(dateString, format, true);
      if (date.isValid()) {
        break;
      }
    }

    // Check if date is valid after attempting all formats
    if (!date || !date.isValid()) {
      console.error(
        "Invalid date format. Please ensure the date string matches one of the expected formats."
      );
      return "";
    }

    // Format the date to the desired output format
    const formattedDate = moment.utc(date).format("DD/MM/YYYY h:mm A");

    return formattedDate;
  }
  const toggleEditModal = () => {
    setIsOpenAddModal(true);
    if (openEditModal) {
      // formik.setFieldValue("name", originalTitle);
    } else {
      // setOriginalTitle(formik.values.name);
    }
  };
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    if (id) {
      setDisabled(true);
      const res = await dispatch(deleteTask(id));

      setOpenDeleteModal(false);
      dispatch(
        updateProjectColumnList({
          operation: "delete",
          task: res?.payload?.data?.data,
        })
      );
      listData({
        project_id: project_id,
        loader: false,
        drag: false,
        dispatch,
        is_view: 0,
      });
      toast.success(res?.payload?.data?.message, {
        duration: 4000,
      });
      setDisabled(false);
    }
  };
  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    setCalculatedDate(formattedDate);
    handleEditTaskTitle([], null, formattedDate);
  };

  const handleCompleteTask = () => {
    if (id) {
      draggedByCheck(id);
      setDisabled(true);
      dispatch(CheckedTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            listData({
              project_id: project_id,
              loader: false,
              drag: false,
              dispatch,
              is_view: 0,
            });
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
  const handleEditTaskTitle = async (
    labels: [],
    editPriority = null,
    EditDate = "0",
    EditselectedAgents = []
  ) => {

    const formData = new FormData();
    if (updatedText != "") {
      formData.append("title", updatedText.trim());
    } else {
      formData.append("title", title.trim());
    }
    formData.append(
      "priority",
      editPriority == "No Priority" ? "" : editPriority ?? "0"
    );

    const formattedDate = EditDate;

    formData.append("due_date_time", formattedDate ?? "0");

    const agentIds = EditselectedAgents.map((item) => {
      // If task_id exists, use user_id, otherwise use id
      return item.task_id ? item.user_id : item.agent_id;
    });

    formData.append(
      "agent_ids",
      EditselectedAgents.length > 0 ? (agentIds as any) : "0"
    );

    formData.append("status", "0");
    formData.append("labels", "0");
    formData.append("reminder", "0");
    formData.append("task_id", editId);
    try {
      const res = await dispatch(EditTaskAdd(formData));
      const updatedTask = res?.payload?.data?.data;
      setAllSubtask((prevTaskList) =>
        prevTaskList.map((task) =>
          task.id == editId
            ? { ...task, ...updatedTask } // Merge new data with the old task data
            : task
        )
      );
      listData({
        project_id: project_id,
        loader: false,
        drag: false,
        dispatch,
        is_view: 0,
      });

      //   ListData({ loading: false });
      dispatch(
        updateProjectColumnList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );

      // setEditAble(false);

      setEditId(null);
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const isDateBeforeToday = date ? moment(date).isBefore(moment()) : false;
  const handlePriorityMenuClick = (data) => {
    // setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
    handleEditTaskTitle([], data);
  };
  const calculateFutureDate = (days, label) => {
    let date = new Date();
    let addedDays = 0;

    // Save the current time
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentSeconds = date.getSeconds();
    const currentMilliseconds = date.getMilliseconds();

    while (addedDays < days) {
      date.setDate(date.getDate() + 1);
      if (label.includes("business")) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          addedDays++;
        }
      } else {
        addedDays++;
      }
    }

    // Restore the current time
    date.setHours(
      currentHours,
      currentMinutes,
      currentSeconds,
      currentMilliseconds
    );

    // Format the date to YYYY-MM-DD HH:mm
    const formattedDate = moment(date).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    handleEditTaskTitle([], null, formattedDate);
    return formattedDate;
  };
  const handleClickDate = (event) => {
    setAnchorEl1(event.currentTarget);
    setCalenderOpen(true);
  };
  const debouncedSearch = debounce((searchValue) => {
    // Update the search filter here
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    }));
  }, 800);
  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    debouncedSearch(value);
  };
  useMemo(() => {
    dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
      setAgentMenuData(res?.payload?.data?.data?.list);
    });
  }, [filterMenu.search, filterMenu.limit, filterMenu.start]);

  const handleAgentSelect = (agentId) => {
    // Check if the agent is already in the selectedAgents array
    const isSelected =
      selectedAgents.length > 0 &&
      selectedAgents.some((agent) => agent.agent_id === agentId);

    if (isSelected) {
      // Remove the agent if they are already selected
      setSelectedAgents(
        selectedAgents.filter((agent) => agent.agent_id !== agentId)
      );

      // Update the 'Add Assignee' message if only one agent remains
      if (selectedAgents.length == 1) {
        setSelectedAgent(null);
      }
    } else {
      // Find the agent in agentMenuData and add them to selectedAgents
      const selectedAgent = agentMenuData.find(
        (agent) => agent.agent_id === agentId
      );
      setSelectedAgents([...selectedAgents, selectedAgent]);
    }
  };
  const handleEditTitle = async (updatedText) => {

    const formData = new FormData();

    formData.append("title", updatedText);

    formData.append("task_id", editId);
    formData.append("due_date_time", "0");
    try {
      const res = await dispatch(EditTaskAdd(formData));

      listData({
        project_id: project_id,
        loader: false,
        drag: false,
        dispatch,
        is_view: 0,
      });

      // setEditAble(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <Draggable
        draggableId={`task${id?.toString()}`}
        index={index}
        //@ts-ignore
        type="task"
        isDragDisabled={true}
      >
        {(provided: any, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            //@ts-ignore
            {...provided.draggableProps}
            //@ts-ignore
            isDragging={snapshot.isDragging}
          >
            <div
              style={{ position: "relative" }}
              className="ml-16"
              onMouseEnter={() => setOnTitleHover(id)}
              onMouseLeave={() => setOnTitleHover(null)}
            >
              {/* {userDetails?.role_id != 3 && ( */}
              {
                <div style={{ position: "absolute", right: 12, top: 24 }}>
                  <div className="flex ">
                    <Box
                      sx={{
                        display: "flex",
                        visibility: onTitleHover === id ? "visible" : "hidden",

                        opacity: onTitleHover === id ? 1 : 0,
                        transition: "opacity 0.2s ease-in-out", // Smooth transition effect
                        zIndex: 99,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: 3,
                        right: 30,
                      }}
                    >
                      <Tooltip title="Rename" enterDelay={100} placement="top">
                        <IconButton
                          sx={{
                            padding: 0,
                          }}
                        >
                          <div className="bg-[#fff] px-3 py-3 rounded-[6px]">
                            <HoverEditIcon
                              color="#757982"
                              onClick={(e) => {
                                // alert("hii");
                                e.stopPropagation();
                                setEditAble(!editAble);
                                setEditId(id);
                                setText(title);
                              }}
                              className="h-16 w-16"
                            />
                          </div>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <span
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <DeleteIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleClose();
                          toggleDeleteModal();
                          e.stopPropagation();
                        }}
                      />
                    </span>
                    {/* <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem
                        onClick={(e) => {
                          handleClose();
                          toggleEditModal();
                          e.stopPropagation();
                        }}
                      >
                        Edit Subtask
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          handleClose();
                          toggleDeleteModal();
                          e.stopPropagation();
                        }}
                      >
                        Delete Subtask
                      </MenuItem>
                    </Menu> */}
                  </div>
                </div>
              }
              <ActionModal
                modalTitle="Delete Subtask"
                modalSubTitle="Are you sure you want to delete this subtask?"
                open={openDeleteModal}
                handleToggle={toggleDeleteModal}
                type="delete"
                onDelete={handleDelete}
                disabled={disable}
              />

              <CompleteModal
                modalTitle="Move Task"
                modalSubTitle="Are you sure you want to move this task in complete as well as subTasks?"
                open={complete}
                handleToggle={toggleCompleteModal}
                type="Yes"
                onDelete={handleCompleteTask}
                disabled={disable}
              />
              {isOpenAddModal && (
                <AddSubTaskModal
                  isOpen={isOpenAddModal}
                  project_id={project_id}
                  setIsOpen={setIsOpenAddModal}
                  ColumnId={id}
                  Edit={true}
                />
              )}
              <div
                // to={}
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  const clientId = getClientId();
                  event.preventDefault();
                  e.stopPropagation();
                  // navigate(
                  //   `/${project_id}/${parent_task_is}/subTask/detail/${id}${clientId ? `?ci=${clientId}` : ""}`
                  // );
                }}
              >
                <div className="bg-[#F7F9FB] p-14 rounded-md border mb-4">
                  <div className="flex justify-between gap-10 items-center">
                    <div className="flex" style={{ alignItems: "center" }}>
                      {defalut_name == "Completed" || isComplete == 1 ? (
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          checked={true}
                          className="pl-0 cursor-grab !bg-transparent"
                          icon={<RadioButtonUnchecked />} // Circle when unchecked
                          checkedIcon={<CheckCircleOutline />}
                        />
                      ) : (
                        <Tooltip title="Mark complete" placement="top" arrow>
                          <Checkbox
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteTask();
                            }}
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
                      <Typography
                        color="primary.main"
                        className="font-medium"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   e.stopPropagation();
                      //   // navigate(`/tasks/detail/${id}`);
                      //   navigate(`/${id}/${project_id}/subTask/detail/${id}`);
                      // }}
                      >
                        {/* <TruncateText text={title} maxWidth={120} /> */}
                        <TruncateText
                          editAble={editAble}
                          setEditable={setEditAble}
                          setUpdatedText={setUpdatedText}
                          updatedText={updatedText}
                          handleEditSubmit={handleEditTaskTitle}
                          editId={editId}
                          id={id}
                          text={title}
                          maxWidth={120}
                          style={{
                            paddingLeft: "20px !important",
                          }}
                          // taskList={list}
                          // setTaskList={setList}
                          listData={listData}
                        />
                      </Typography>
                    </div>
                  </div>
                  <div
                    // className={`flex gap-4 ${
                    //   userDetails?.role_id != 3 ? "mr-[30px]" : ""
                    // }`}
                    className={`flex gap-4 mr-[30px] `}
                  >
                    {/* {priority !== null && priority !== "null" ? (
                        <span
                          className={`${
                            priority === "Medium"
                              ? "bg-priorityMedium/[.18]"
                              : priority === "High"
                                ? "bg-red/[.18]"
                                : "bg-green/[.18]"
                          } py-5 px-10 rounded-[27px] min-w-[69px] text-[12px] flex justify-center items-center font-medium ${
                            priority === "Medium"
                              ? "text-priorityMedium"
                              : priority === "High"
                                ? "text-red"
                                : "text-green"
                          }`}
                        >
                          {priority}
                        </span>
                      ) : null} */}
                    <DropdownMenu
                      // ref={dropdownRef}
                      anchorEl={priorityMenu}
                      // onClick={(e) => e.stopPropagation()}
                      handleClose={(e: any) => {
                        e.stopPropagation();
                        setPriorityMenu(null);
                      }}
                      button={
                        <div
                          // ref={dropdownRef}
                          className={`flex gap-4 mr-[30px] cursor-pointer my-5`}
                        >
                          <div
                            onClick={(event) => {
                              event.stopPropagation();
                              setPriorityMenu(event.currentTarget);
                              setText(title);
                              setEditId(id);
                            }}
                            className={`${priority === null || priority === "null"
                              ? ""
                              : priority === "Medium"
                                ? "bg-priorityMedium/[.18]"
                                : priority === "High"
                                  ? "bg-red/[.18]"
                                  : "bg-green/[.18]"
                              } py-5 px-10 rounded-[27px] min-w-[69px] text-[14px] flex justify-center items-center font-medium ${priority === "Medium"
                                ? "text-priorityMedium"
                                : priority === "High"
                                  ? "text-red"
                                  : "text-black "
                              } font-500`}
                          >
                            {priority ? (
                              priority
                            ) : (
                              <Tooltip title="Priority">
                                <span>{"-"}</span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      }
                      popoverProps={{
                        open: !!priorityMenu,
                        classes: {
                          paper: "pt-10 pb-20",
                        },
                      }}
                    >
                      <div

                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   setIsOpenInlineAddModal(false);
                      // }}
                      >
                        {priorityMenuData?.map((item) => (
                          <StyledMenuItem
                            onClick={(e) => {
                              e.stopPropagation();

                              handlePriorityMenuClick(item.label);
                            }}
                          >
                            {item.label}
                          </StyledMenuItem>
                        ))}
                        <Typography className="border-t-1 border-color-[#3333]">
                          <StyledMenuItem
                            onClick={(e) => {
                              e.stopPropagation();

                              handleEditTaskTitle([], "No Priority");
                              // setSelectedPriority(
                              //   "No Priority"
                              // );
                              setPriorityMenu(null);
                            }}
                          >
                            Clear
                          </StyledMenuItem>
                        </Typography>
                      </div>
                    </DropdownMenu>
                  </div>
                  <div className="mt-10 flex justify-between gap-20 items-start itemcard">
                    {/* <Typography color="primary.light" className="text-[12px] ">
                      <TruncateText text={taskName} maxWidth={150} />
                    </Typography> */}

                    {/* {defalut_name == "Completed" || isComplete == 1 ? (
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          checked={true}
                        />
                      ) : (
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                            {
                              // userDetails?.role_id == 3
                              //   ? setComplete(true)
                              //   :
                              handleCompleteTask();
                            }
                          }}
                          checked={complete}
                        />
                      )} */}
                  </div>

                  <div className="mt-10 flex justify-between">
                    <div>
                      {/* {isDateBeforeToday ? (
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
                          <div className="flex items-center">
                            <ClockTask color={"#4F46E5"} />
                            <Typography
                              color="#F44336"
                              className="text-[12px] ml-10 "
                            >
                              {/* {moment(Date[0], "DD/MM/YYYY").format("MMM DD, YYYY")} */}
                      {/* {date ? moment(date).format("ll") : "-"}
                            </Typography>
                          </div>
                        </Tooltip> */}
                      {/* ) : ( */}
                      {/* <div className="flex items-center">
                          <ClockTask color={"#4F46E5"} />
                          <Typography
                            color="primary.light"
                            className="text-[12px] ml-10 "
                          >
                            {/* {moment(Date[0], "DD/MM/YYYY").format("MMM DD, YYYY")} */}
                      {/* {date ? moment(date).format("ll") : "-"} */}
                      {/* </Typography> */}
                      {/* </div>  */}
                      {/* )}  */}
                      <DropdownMenu
                        //@ts-ignore
                        handleClose={(event) => {
                          event.stopPropagation();
                          setDateTimeMenu(null);
                          setCalenderOpen(false);
                        }}
                        anchorEl={dateTimeMenu}
                        button={
                          // isDateBeforeToday ? (
                          //   <Tooltip
                          //     title={"This task is overdue "}
                          //     enterDelay={500}
                          //     componentsProps={{
                          //       tooltip: {
                          //         sx: {
                          //           bgcolor: "common.white",
                          //           color: "common.black",
                          //           padding: 1,
                          //           borderRadius: 10,
                          //           boxShadow: 3,

                          //           "& .MuiTooltip-arrow": {
                          //             color: "common.white",
                          //           },
                          //         },
                          //       },
                          //     }}
                          //   >
                          //     <div
                          //       className="flex !items-center"
                          //       onClick={(e) => {
                          //         setDateTimeMenu(
                          //           e.currentTarget
                          //         );
                          //         e.stopPropagation();
                          //         setEditId(row?.id);
                          //       }}
                          //     >
                          //       <ClockTask
                          //         color={"#4F46E5"}
                          //       />
                          //       <Typography
                          //         color="#F44336"
                          //         className="text-[12px] ml-10 "
                          //       >
                          //         {/* {moment(Date[0], "DD/MM/YYYY").format("MMM DD, YYYY")} */}
                          //         {selectedDate
                          //           ? selectedDate
                          //           : "-"}
                          //       </Typography>
                          //     </div>
                          //   </Tooltip>
                          // ) : (
                          <div
                            className="flex items-center cursor-pointer"
                            style={{ alignItems: "center" }}
                            onClick={(e) => {
                              setDateTimeMenu(e.currentTarget);
                              e.stopPropagation();
                              setEditId(id);
                              setText(title);
                            }}
                          >
                            <ClockTask color={"#4F46E5"} />
                            <Typography
                              // color="#F44336"
                              className="text-[12px] ml-10 "
                            // onClick={(event) => {
                            //   setDateTimeMenu(event.currentTarget);
                            //   setEditId(id);
                            //   setText(title);
                            //   event.stopPropagation();
                            // }}
                            >
                              {date ? (
                                moment.utc(date).format("DD/MM/YYYY h:mm A")
                              ) : (
                                <Tooltip title="Due_Date">
                                  <span>{"-"}</span>
                                </Tooltip>
                              )}
                            </Typography>
                          </div>
                          // )
                        }
                        popoverProps={{
                          open: !!dateTimeMenu,
                          classes: {
                            paper: "pt-10 pb-20",
                          },
                        }}
                      >
                        {dateTimeMenuData?.map((item) => (
                          <StyledMenuItem
                            key={item.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(id);
                              const futureDate = calculateFutureDate(
                                item.days,
                                item.label
                              );
                              setCalculatedDate(futureDate.toLocaleString()); // Store the calculated date
                              // setSelectedDate(futureDate.toLocaleString()); // Display the label
                              // handleEditTaskTitle(
                              //   [],
                              //   null,
                              //   futureDate.toLocaleString()
                              // );
                              setDateTimeMenu(null);
                            }}
                          >
                            {item.label}
                          </StyledMenuItem>
                        ))}
                        <div className="px-20">
                          <CustomButton
                            fullWidth
                            variant="contained"
                            startIcon={
                              <FuseSvgIcon size={16}>
                                material-outline:add_circle_outline
                              </FuseSvgIcon>
                            }
                            className="min-w-[224px] mt-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClickDate(e);
                            }}
                          >
                            Custom Date
                          </CustomButton>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(id);
                              setText(title);
                            }}
                          >
                            <Popover
                              open={calenderOpen}
                              anchorEl={anchorEl1}
                              onClose={handleClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <DateTimePicker
                                open={calenderOpen}
                                // onOpen={() => setOpen(true)} // Ensure open state is true when the calendar opens
                                onClose={() => {
                                  setCalenderOpen(false);
                                  setDateTimeMenu(null);
                                }}
                                closeOnSelect={false}
                                value={customDate}
                                minDate={new Date()}
                                disablePast
                                views={[
                                  "year",
                                  "month",
                                  "day",
                                  "hours",
                                  "minutes",
                                ]}
                                onChange={handleDateChange}
                              />
                            </Popover>
                          </span>
                        </div>
                        {date != "Add Date" && date != "" && date != null && (
                          <div className="px-20">
                            <CustomButton
                              fullWidth
                              variant="contained"
                              color="secondary"
                              startIcon={
                                <FuseSvgIcon>
                                  material-outline:remove_circle_outline
                                </FuseSvgIcon>
                              }
                              className="min-w-[224px] mt-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate("");
                                setCalculatedDate(null);
                                handleEditTaskTitle([], null, "");
                                setDateTimeMenu(null);
                                setCalenderOpen(false);
                                //   formik.setFieldValue("time", "");
                                //   formik.setFieldValue("date", "");
                                setCustomDate(null);
                              }}
                            >
                              Remove
                            </CustomButton>
                          </div>
                        )}
                      </DropdownMenu>
                    </div>
                    <div className="flex ">
                      {/* {visibleAgents?.map((item, idx) => (
                        <img
                          className={`h-[34px] w-[34px] rounded-full border-2 border-white ${
                            agent.length > 1 ? "ml-[-10px]" : ""
                          } z-0`}
                          key={idx}
                          src={
                            //@ts-ignore
                            !item?.user_image
                              ? "../assets/images/logo/images.jpeg"
                              : `${urlForImage}${
                                  //@ts-ignore
                                  item?.user_image
                                }`
                          }
                          alt={item}
                          loading="lazy"
                        />
                      ))}
                      {extraAgentsCount > 0 && (
                        <span
                          className="ml-[-10px] text-[12px] font-500  z-0 h-[34px] w-[34px] 
                          rounded-full border-2 border-[#4f46e5] bg-[#4f46e5] flex items-center justify-center  text-white"
                        >
                          +{extraAgentsCount}
                        </span>
                      )} */}
                      <DropdownMenu
                        anchorEl={AgentMenu}
                        handleClose={(e: any) => {
                          // const allIdsMatch =
                          //   selectedAgents.length ==
                          //     row?.assigned_task_users
                          //       ?.length &&
                          //   selectedAgents?.every((selected) =>
                          //     row?.assigned_task_users?.some(
                          //       (ag: any) =>
                          //         ag?.id == selected?.id
                          //     )
                          //   );
                          e.stopPropagation();
                          // if (!allIdsMatch) {
                          handleEditTaskTitle([], null, "0", selectedAgents);
                          // }
                          setFilterMenu((prevFilters) => ({
                            ...prevFilters,
                            search: "",
                          }));

                          setAgentMenu(null);
                        }}
                        button={
                          <div
                            className="flex  cursor-pointer "
                            onClick={(event) => {
                              event.stopPropagation();
                              setAgentMenu(event.currentTarget);
                              setText(title);
                              setEditId(id);
                              setSelectedAgents(agent);
                            }}
                          >
                            {agent?.length ? (
                              <>
                                {agent?.slice(0, 3).map((item, idx) => {
                                  return (
                                    // <div>
                                    <img
                                      className={`h-[30px] w-[30px] rounded-full border-2 border-white ${agent.length > 1 ? "ml-[-16px]" : ""
                                        } z-0`}
                                      src={
                                        //@ts-ignore
                                        item?.user_image
                                          ? //@ts-ignore
                                          urlForImage + item?.user_image
                                          : "../assets/images/logo/images.jpeg"
                                      }
                                      alt={`User ${index + 1}`}
                                    />
                                    // </div>
                                  );
                                })}
                                {agent?.length > 3 && (
                                  <div
                                    className="ml-[-16px] z-0 h-[30px] w-[30px] rounded-full border-2 border-white bg-[#4F46E5] flex 
                        items-center justify-center text-[12px] font-500 text-white"
                                  >
                                    +{agent?.length - 3}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Tooltip title="Assignee">
                                <span>{"-"}</span>
                              </Tooltip>
                            )}
                          </div>
                        }
                        popoverProps={{
                          open: !!AgentMenu,
                          // classes: {
                          //   paper: "pt-10 pb-20",
                          // },
                        }}
                      >
                        <div
                          className="sm:w-[375px] py-10 px-20 "
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-start py-10">
                            <p className="text-title font-600 text-[1.6rem]">
                              Assignee Name
                            </p>
                          </div>
                          <div className="relative w-full mt-10 mb-3 sm:mb-0">
                            <InputField
                              name={"agent"}
                              placeholder={"Search Assignee"}
                              className="common-inputField "
                              inputProps={{
                                className: "w-full sm:w-full",
                              }}
                              // onChange={(e) => {
                              //   e.stopPropagation();
                              //   handleSearchChange(e);
                              // }}
                              onChange={handleSearchChange}
                            />
                            <div
                              className="max-h-[150px] w-full overflow-y-auto shadow-sm cursor-pointer "
                              onClick={(e) => e.stopPropagation()}
                            >
                              {agentMenuData?.map((item: any) => (
                                <div
                                  className="flex items-center gap-10 px-20 w-full"
                                  key={item.id}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleAgentSelect(item.agent_id);
                                  }}
                                >
                                  <label
                                    className="flex items-center gap-10 w-full cursor-pointer my-5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Checkbox
                                      className="d-none hover:!bg-transparent"
                                      checked={selectedAgents?.some((agent) =>
                                        agent.agent_id
                                          ? agent.agent_id == item.agent_id
                                          : agent.user_id == item.user_id
                                      )}
                                      // checked={selectedAgents.some(agent => agent.user_id == item.agent_id)}
                                      onChange={(e) => {
                                        handleAgentSelect(item.agent_id);
                                        e.stopPropagation();
                                      }}
                                    />
                                    {/* <span>{item?.userName}</span> */}
                                    <div
                                      className="h-[35px] w-[35px] rounded-full "
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {item.user_image ? (
                                        <img
                                          src={urlForImage + item.user_image}
                                          alt=""
                                          className="h-[35px] w-[35px] rounded-full"
                                        />
                                      ) : (
                                        <img
                                          src="../assets/images/logo/images.jpeg"
                                          alt=""
                                        />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{item?.userName}</span>
                                      <span className="text-[#757982] text-12">
                                        {Role(item?.role_id)}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
              {provided.placeholder}
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}
