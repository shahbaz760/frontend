import {
  Box,
  Checkbox,
  Menu,
  MenuItem,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  Popover,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  CheckedTask,
  EditTaskAdd,
  deleteTask,
  updateProjectColumnList,
  updateProjectColumnListDrag,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";

import moment from "moment";
import { ClockTask, DeleteIcon } from "public/assets/icons/common";
import {
  HoverEditIcon,
  PlusIcon,
  ThreeDotsIcon,
} from "public/assets/icons/dashboardIcons";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Role,
  StyledMenuItem,
  getClientId,
  getUserDetail,
  listData,
} from "src/utils";
import ActionModal from "../ActionModal";
import CompleteModal from "../CompleteModal";
import AddTaskModal, {
  dateTimeMenuData,
  priorityMenuData,
} from "../tasks/AddTask";
// import { CalendarIcon } from "public/assets/icons/dashboardIcons";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import { SubTaskIcon } from "public/assets/icons/projectsIcon";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import ItemSubCard from "./ItemSubCard";
import AddTaskInline from "../tasks/AddTaskInline";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useSelector } from "react-redux";
import DropdownMenu from "../Dropdown";
import CommonChip from "../chip";
import { AssignIconNew, PriorityIcon } from "public/assets/icons/task-icons";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import CustomButton from "../custom_button";
import { DateTimePicker } from "@mui/x-date-pickers";
import InputField from "../InputField";
import { debounce } from "lodash";
import { GetAssignAgentsInfo } from "app/store/Client";
import Item from "../projects/ProjectTaskList/Item";

type CardType = {
  title: string;
  priority: string;
  taskName: string;
  isChecked: boolean;
  date: string;
  images: string[];
  id?: number;
  index?: any;
  project_id?: any;
  agent?: [];
  is_defalut?: any;
  total_sub_tasks?: any;
  draggedByCheck?: any;
  defalut_name?: any;
  tasks?: any;
  isComplete?: any;
  agentMenuDatas?: any;
  setList?: any;
  key?: any
};

export const TruncateTextTitle = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);

  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip
      title={
        <div
          style={{
            maxHeight: "300px", // Limit height of the tooltip
            overflowY: "auto", // Enable vertical scroll
          }}
        >
          {text}
        </div>
      }
      enterDelay={500}
      leaveDelay={0}
      disableHoverListener={!isTruncated}
      PopperProps={{
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              altBoundary: true,
              tether: false,
            },
          },
        ],
      }}
    >
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
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
  project_id,
  // taskList,
  // setTaskList,
  listData,
  handleEditSubmit,
  updatedText,
}) => {
  const dispatch = useAppDispatch();
  const {
    filterdata,
    filtered,
    conditions,
    sorting
  } = useSelector((store: ProjectRootState) => store?.project);
  const [isTruncated, setIsTruncated] = useState(false);
  const [taskTitle, setTaskTitle] = useState(text);

  const textRef = useRef(null);

  const handleInput = (e) => {
    setUpdatedText(e.target.textContent.trim()); // update the state with the new value
  };

  const updateTaskTitle = (id, newTitle, taskList) => {
    return taskList.map((task) =>
      task.id == id ? { ...task, title: newTitle } : task
    );
  };

  useEffect(() => {
    setTaskTitle(text);
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents a newline from being added
      setEditable(false); // Set editable to false
      handleEditSubmit();
      // const updatedList = updateTaskTitle(id, updatedText, taskList);
      // setTaskList(updatedList); // Update the task list state
      listData({
        loader: false,
        project_id,
        dispatch,
        groupkey: filterdata.key,
        drag: false,
        order: filterdata.order,
        condition: conditions.length > 0 ? conditions : [],
        sort: sorting.length > 0 ? sorting : [],
        filter:
          filterdata.key != null || conditions.length > 0 || sorting.length > 0
            ? 1
            : 0,


      });
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
          {taskTitle}
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

export default function ItemCard({
  title,
  priority,
  taskName,
  isChecked,
  date,
  id,
  images,
  index,
  project_id,
  agent,
  is_defalut,
  total_sub_tasks,
  draggedByCheck,
  isComplete,
  defalut_name,
  tasks,
  setList,
  agentMenuDatas,
  key,
}: CardType) {
  const theme: Theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const projectid = useParams<{ id: string }>();
  const userDetails = getUserDetail();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };
  const {
    fetchStatusNew,
    searchStatus,
    filterdata,
    filtered,
    conditions,
    projectList,
    MainOp,
    sorting,
    projectColumnData,
  } = useSelector((store: ProjectRootState) => store?.project);
  const [disable, setDisabled] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenInlineAddModal, setIsOpenInlineAddModal] =
    useState<boolean>(false);
  const [showSubTaskInlineAddForm, setShowSubTaskInlineAddForm] =
    useState(null);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [customDate, setCustomDate] = useState(null);
  const [text, setText] = useState("");
  const [complete, setComplete] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [hoveredsubtask, setHoveredSubtask] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [clicksubtask, setClickSubtask] = useState(false);
  const [updatedText, setUpdatedText] = useState("");
  const [editAble, setEditAble] = useState(false);
  const [editId, setEditId] = useState(null);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const [selectedDate, setSelectedDate] = useState<string>(
    date ? moment.utc(date).format("DD/MM/YYYY h:mm A") : null
  );
  const toggleCompleteModal = () => setComplete(!complete);
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>(priority);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [taskList, setTaskList] = useState(tasks);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const userId = getUserDetail();
  const [selectedAgent, setSelectedAgent] = useState<string>("agent");
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);
  const is_private = projectList.find(
    (item) => item.id == project_id
  )?.is_private;

  const getLoginedUser = getUserDetail();

  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
    client_id: userId.role_id == 3 ? project_id : getLoginedUser?.id,
    is_user: 1,
    project_id: is_private == 1 ? project_id : 0,
  });
  //@ts-ignore

  const [selectedAgents, setSelectedAgents] = useState<any[]>(
    agent?.length > 0 ? agent : []
  );
  const [agentMenuData, setAgentMenuData] = useState(agentMenuDatas);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const maxVisibleImages = 2;
  const visibleAgents = selectedAgents?.slice(0, maxVisibleImages);
  const extraAgentsCount = selectedAgents?.length - maxVisibleImages;
  const toggleEditModal = () => {
    setIsOpenAddModal(true);
    if (openEditModal) {
      // formik.setFieldValue("name", originalTitle);
    } else {
      // setOriginalTitle(formik.values.name);
    }
    // setOpenEditModal(!openEditModal);
  };

  useMemo(() => {
    setSelectedPriority(priority);
    setSelectedDate(date ? moment.utc(date).format("DD/MM/YYYY h:mm A") : null);
    setSelectedAgents(agent?.length > 0 ? agent : []);
  }, [priority, date, agent]);

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
        loader: false,
        drag: false,
        dispatch,
        project_id,
        groupkey: filterdata.key,
        condition: conditions,
        sort: sorting,
        filter:
          filterdata.key != null || conditions.length > 0 || sorting.length > 0
            ? 1
            : 0,


        order: filterdata.order,

      });
      toast.success(res?.payload?.data?.message, {
        duration: 4000,
      });
      setDisabled(false);
    }
  };

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

  const handleEditTaskTitle = async (
    labels: "0",
    editPriority = "0",
    EditDate = "0",
    EditselectedAgents?: any
  ) => {
    const formData = new FormData();
    formData.append(
      "priority",
      editPriority == "No Priority" ? "" : editPriority ?? "0"
    );

    formData.append("due_date_time", EditDate ?? "0");
    const agentIds = EditselectedAgents?.map((item) => {
      // If task_id exists, use user_id, otherwise use agent_id
      return item.task_id ? item.user_id : item.agent_id;
    });
    // Append agent IDs to formData, or 0 if the list is empty
    formData.append("agent_ids", EditselectedAgents ? agentIds.join(",") : "0");

    formData.append("status", "0");
    formData.append("labels", "0");
    formData.append("reminder", "0");
    // formData.append("labels", selectedLabels as any);
    if (updatedText != "") {
      formData.append("title", updatedText.trim());
    } else {
      formData.append("title", title.trim());
    }
    formData.append("task_id", editId || id);
    try {
      const res = await dispatch(EditTaskAdd(formData));

      dispatch(
        updateProjectColumnList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );
      setEditAble(false);
      listData({
        loader: false,
        drag: false,
        dispatch,
        project_id,
        groupkey: filterdata.key,
        condition: conditions,
        sort: sorting,
        filter:
          filterdata.key != null || conditions.length > 0 || sorting.length > 0
            ? 1
            : 0,


        order: filterdata.order,
      });
      setEditId(null);
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
              loader: false,
              drag: false,
              dispatch,
              project_id,
              groupkey: filterdata.key,
              condition: conditions,
              sort: sorting,
              filter:
                filterdata.key != null || conditions.length > 0 || sorting.length > 0
                  ? 1
                  : 0,


              order: filterdata.order,
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
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const isDateBeforeToday = selectedDate
    ? moment(selectedDate, "DD/MM/YYYY hh:mm A").isBefore(moment())
    : false;

  const handlePriorityMenuClick = (data) => {
    setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
    handleEditTaskTitle("0", data, null, null);
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
    handleEditTaskTitle("0", null, formattedDate, null);
    return formattedDate;
  };

  const handleClickDate = (event) => {
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");
    if (moment(formattedDate, "DD/MM/YYYY h:mm A").isAfter(moment())) {
      setSelectedDate(formattedDate);
      setCalculatedDate(formattedDate);
      // setSelectedTime(null);
      handleEditTaskTitle("0", null, formattedDate, null);
    }
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
    if (filterMenu.search || AgentMenu != null) {
      dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
        setAgentMenuData(res?.payload?.data?.data?.list);
      });
    }
  }, [filterMenu.search, AgentMenu]);

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

  const allIdsMatch =
    selectedAgents.length == agent?.length &&
    selectedAgents?.every((selected) =>
      agent?.some((ag: any) => ag?.id == selected?.id)
    );

  return (
    <>
      <Draggable
        draggableId={`task${id?.toString()}`}
        index={index}
        //@ts-ignore
        type="task"
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
            <div style={{ position: "relative" }}>
              {/* {userDetails?.role_id != 3 && ( */}
              {
                <div
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 24,
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                >
                  <span
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    {/* <ThreeDotsIcon className="cursor-pointer" /> */}
                    <DeleteIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                        toggleDeleteModal();
                        e.stopPropagation();
                      }}
                    />
                  </span>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  ></Menu>
                </div>
              }
              <ActionModal
                modalTitle="Delete Task"
                modalSubTitle="Are you sure you want to delete this task?"
                open={openDeleteModal}
                handleToggle={toggleDeleteModal}
                type="delete"
                onDelete={handleDelete}
                disabled={disable}
                maxWidth="310"
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
                <AddTaskModal
                  isOpen={isOpenAddModal}
                  project_id={project_id}
                  setIsOpen={setIsOpenAddModal}
                  ColumnId={id}
                  Edit
                />
              )}
              {isOpenInlineAddModal && (
                <AddTaskInline
                  isOpen={isOpenInlineAddModal}
                  project_id={project_id}
                  setIsOpen={setIsOpenInlineAddModal}
                  ColumnId={id}
                  Edit
                />
              )}

              <div
                // to={}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="bg-[#F7F9FB] p-14 rounded-md border mb-4 "
                  onMouseEnter={() => setOnTitleHover(id)}
                  onMouseLeave={() => setOnTitleHover(null)}
                  onClick={(e) => {
                    const clientId = getClientId();
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose();
                    setIsOpenInlineAddModal(true);
                  }}
                >
                  <div className="flex justify-between gap-10 items-center">
                    <div
                      className="flex relative w-full "
                      style={{ alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          visibility:
                            onTitleHover === id ? "visible" : "hidden",

                          opacity: onTitleHover === id ? 1 : 0,
                          transition: "opacity 0.2s ease-in-out", // Smooth transition effect
                          zIndex: 99,
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          top: 9,
                          right: 25,
                        }}
                      >


                        <Tooltip
                          title="Rename"
                          enterDelay={100}
                          placement="top"
                        >
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
                                  setText(title);

                                  e.stopPropagation();
                                  setEditAble(!editAble);
                                  setEditId(id);
                                }}
                                className="h-16 w-16"
                              />
                            </div>
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {defalut_name === "Completed" || isComplete === 1 ? (
                        <Checkbox
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          checked={true}
                          sx={{
                            "& .MuiButtonBase-root-MuiCheckbox-root:hover": {
                              background: "none !important",
                            },
                          }}
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

                      <Typography color="primary.main" className="font-medium">
                        <TruncateText
                          editAble={editAble}
                          project_id={project_id}
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

                          listData={listData}
                        />
                      </Typography>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-between gap-20 items-start itemcard">

                  </div>

                  {selectedPriority !== null &&
                    selectedPriority !== "null" &&
                    selectedPriority != "" &&
                    selectedPriority != "No Priority" ? (
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
                              setEditId(id);
                            }}
                            className={`${selectedPriority === "Medium"
                              ? "bg-priorityMedium/[.18]"
                              : selectedPriority === "High"
                                ? "bg-red/[.18]"
                                : "bg-green/[.18]"
                              } py-5 px-10 rounded-[27px] min-w-[69px] text-[12px] flex justify-center items-center font-medium ${selectedPriority === "Medium"
                                ? "text-priorityMedium"
                                : selectedPriority === "High"
                                  ? "text-red"
                                  : "text-green"
                              }`}
                          >
                            {selectedPriority}
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
                              handleEditTaskTitle(
                                "0",
                                "No Priority",
                                null,
                                null
                              );
                              // setSelectedPriority("No Priority");
                              setPriorityMenu(null);
                            }}
                          >
                            Clear
                          </StyledMenuItem>
                        </Typography>
                      </div>
                    </DropdownMenu>
                  ) : null}
                  <div
                    className="mt-10 flex justify-between "
                    style={{ alignItems: "center" }}
                  >
                    <div onClick={() => setEditId(id)}>
                      <DropdownMenu
                        //@ts-ignore
                        handleClose={(event) => {
                          event.stopPropagation();
                          setDateTimeMenu(null);
                          setCalenderOpen(false);
                        }}
                        anchorEl={dateTimeMenu}
                        button={
                          isDateBeforeToday ? (
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
                              <div
                                className="flex !items-center"
                                onClick={(e) => {
                                  setDateTimeMenu(e.currentTarget);
                                  e.stopPropagation();
                                  setEditId(id);
                                }}
                              >
                                <ClockTask color={"#4F46E5"} />
                                <Typography
                                  color="#F44336"
                                  className="text-[12px] ml-10 "
                                >
                                  {/* {moment(Date[0], "DD/MM/YYYY").format("MMM DD, YYYY")} */}
                                  {selectedDate ? selectedDate : "-"}
                                </Typography>
                              </div>
                            </Tooltip>
                          ) : (
                            <div
                              className="flex items-center cursor-pointer"
                              style={{ alignItems: "center" }}
                              onClick={(e) => {
                                setDateTimeMenu(e.currentTarget);
                                e.stopPropagation();
                                setEditId(id);
                              }}
                            >
                              <ClockTask color={"#4F46E5"} />
                              <Typography
                                color="primary.light"
                                className="text-[12px] ml-10 "
                                onClick={(event) => {
                                  setDateTimeMenu(event.currentTarget);
                                  event.stopPropagation();
                                }}
                              >
                                {selectedDate ? selectedDate : "-"}
                              </Typography>
                            </div>
                          )
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
                              handleClickDate(e);
                              e.stopPropagation();
                            }}
                          >
                            Custom Date
                          </CustomButton>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(id);
                            }}
                          >
                            <Popover
                              open={calenderOpen}
                              anchorEl={anchorEl}
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
                                // Ensure open state is true when the calendar opens
                                onClose={() => {
                                  setCalenderOpen(false);
                                  setDateTimeMenu(null);
                                  setAnchorEl(null);
                                }}
                                closeOnSelect={false}
                                value={customDate}
                                minDate={new Date()}
                                format="dd/MM/yyyy hh:mm A"
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
                        {selectedDate != "Add Date" &&
                          selectedDate != "" &&
                          selectedDate != null && (
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
                                  handleEditTaskTitle("0", null, "");
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

                      {taskList?.length > 0 ? (
                        <div
                          className="flex gap-10 text-[#757982] mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            setClickSubtask(!clicksubtask);
                          }}
                          onMouseEnter={() => setHoveredSubtask(true)}
                          onMouseLeave={() => setHoveredSubtask(false)}
                        >
                          <div className="w-[15px] h-[20px] mr-8 cursor-pointer">
                            {hoveredsubtask || clicksubtask ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <SubTaskIcon />
                            )}
                          </div>
                          <div> Subtask : {tasks?.length}</div>{" "}
                        </div>
                      ) : null}
                    </div>

                    <DropdownMenu
                      anchorEl={AgentMenu}
                      handleClose={(e: any) => {
                        e.stopPropagation();
                        // if (!allIdsMatch) {
                        handleEditTaskTitle("0", null, null, selectedAgents);
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
                            setSelectedAgents(agent);
                          }}
                        >
                          {visibleAgents?.map((item, idx) => (
                            <img
                              className={`h-[34px] w-[34px] rounded-full border-2 border-white ${agent?.length > 1 ? "ml-[-10px]" : ""
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
                                    checked={selectedAgents.some((agent) =>
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
              {provided.placeholder}
            </div>
          </div>
        )}
      </Draggable>
      {taskList?.length > 0 &&
        clicksubtask &&
        taskList?.map((item, index) => (
          <ItemSubCard
            id={item?.id}
            title={item?.title}
            priority={item?.priority}
            taskName={item?.description}
            date={item?.due_date_time}
            isChecked={item?.isChecked}
            index={index}
            key={item?.id}
            project_id={project_id}
            agent={item?.assigned_task_users}
            is_defalut={is_defalut}
            total_sub_tasks={item?.total_sub_tasks}
            draggedByCheck={draggedByCheck}
            defalut_name={defalut_name}
            isComplete={item?.is_completed}
            parent_task_is={id}
            setAllSubtask={setTaskList}
          />
        ))}
    </>
  );
}
