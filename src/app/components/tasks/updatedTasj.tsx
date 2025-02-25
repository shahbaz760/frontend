import ListLoading from "@fuse/core/ListLoading";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { DeleteLabel } from "app/store/Agent";
import AddIcon from "@mui/icons-material/Add";
import {
  deleteTask,
  EditTaskAdd,
  projectTaskMoveCol,
  TaskListColumn,
  updateProjectColumnList,
  updateProjectTaskList,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  ClockTask,
  DeleteIcon,
  EditIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { HoverEditIcon, PlusIcon } from "public/assets/icons/dashboardIcons";
import { LabelCrossIconBlue } from "public/assets/icons/projectsIcon";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getClientId,
  getUserDetail,
  listData,
  Role,
  StyledMenuItem,
} from "src/utils";
import DeleteClient from "../client/DeleteClient";
import CommonTable from "../commonTable";
import DueDate from "../projects/DueDate";
import ProjectListSubTaskData from "../projects/ProjectTaskList/ProjectListSubTaskData";
import AddTaskModal, { dateTimeMenuData, priorityMenuData } from "./AddTask";
import AddLableForTask from "../projects/ProjectTaskList/AddLableForTask";
import toast from "react-hot-toast";
import TodoInlineSubTask from "../projects/ProjectTaskList/TodoInlineSubTask";
import EditTodoInlineSubTask from "./EditTodoInlineSubTask";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CommonDragTable from "../CommonDragTable";
import { AssignIconNew, PriorityIcon } from "public/assets/icons/task-icons";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AddAsssigneeForm from "./AddAsssigneeForm";
import DropdownMenu from "../Dropdown";
import CustomButton from "../custom_button";
import { DateTimePicker } from "@mui/x-date-pickers";
import InputField from "../InputField";
import { debounce } from "lodash";
import { GetAssignAgentsInfo } from "app/store/Client";
export const TruncateText = ({
  text,
  maxWidth,
  style,
  taskList,
  setTaskList,
  setUpdatedText,
  editAble,
  setEditable,
  editId,
  id,
  handleEditSubmit,
  updatedText,
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [taskTitle, setTaskTitle] = useState(text);
  const textRef = useRef(null);

  const handleInput = (e) => {
    setUpdatedText(e.target.textContent); // update the state with the new value
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
      handleEditSubmit(updatedText);
      const updatedList = updateTaskTitle(id, updatedText, taskList);
      setTaskList(updatedList);
      setTaskTitle(updatedText);
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
    const element = textRef.current;

    // Check if the text is truncated by comparing scrollWidth and clientWidth
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [taskTitle, maxWidth]);

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
            minWidth: `${maxWidth}px`,
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
              minWidth: `50px`,
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

const ThemePageTable = forwardRef((props, ref) => {
  const {
    tableSelectedItemDesign,
    ListData,
    setColumnList,
    project_id,
    handleCompleteTask,
    isDefault,
    totaltask,
    ColumnId,
    columnList,
    taskLIstData,
    scrollToBottom,
    taskList,
    showLoader,
    tableTask = false,
    tab,
    parentId,
    showTaskpreInlineAddForm,
    setAllSubtask,
  }: any = props;
  const dispatch = useAppDispatch();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [isOpenDeletedLabelModal, setIsOpenDeletedLabelModal] = useState(false);
  const [total_items, setTotal_items] = useState(0);
  const [deleteId, setIsDeleteId] = useState<any>(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);

  const [editAble, setEditAble] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState<string>();
  // date ? moment.utc(date).format("DD/MM/YYYY h:mm A") : null
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
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
  const [text, setText] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("agent");
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const userDetails = getUserDetail();
  const [showLabel, setShowLbael] = useState(false);
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const [taskId, setTaskId] = useState<number>(null);
  const clientId = getClientId();
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  // agent?.length > 0 ? agent : []
  const [showSubTaskInlineAddForm, setShowSubTaskInlineAddForm] =
    useState(null);
  const [labelId, setLabelId] = useState(null);
  const [showTaskInlineAddForm, setShowTaskInlineAddForm] = useState(
    showTaskpreInlineAddForm
  );

  const [hovered, setHovered] = useState(null);
  const { isSubtask, fetchTask, ProjectTask } = useSelector(
    (store: ProjectRootState) => store?.project
  );


  useMemo(() => {
    dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
      setAgentMenuData(res?.payload?.data?.data?.list);
    });
  }, [filterMenu.search]);

  useEffect(() => {
    setShowTaskInlineAddForm(showTaskpreInlineAddForm);
  }, [showTaskpreInlineAddForm]);

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const theme: Theme = useTheme();


  const handleDeleteAttachment = (id) => {
    dispatch(deleteTask(id)).then((res) => {
      if (res?.payload?.data.status === 1) {
        setColumnList((prevColumnList) =>
          prevColumnList.filter((item) => item.id !== id)
        );
      }
    });
    const filereddata = taskLIstData.filter((item, index) => item.id != id);
    setAllSubtask(filereddata);
    setIsOpenDeletedModal(false);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setShowLbael(true);
    setLabelId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowLbael(false);
  };

  const CheckDate = (date) => {
    const isDateBeforeToday = date
      ? moment(date).isBefore(moment(), "day")
      : false;
    return isDateBeforeToday;
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowLbael(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLabelDelete = (id: any) => {
    dispatch(DeleteLabel(id)).then((res) => {
      setIsLabelLoading(false);
      // setLabelsMenu(null);
      if (selectedLabels.length > 0) {
        setSelectedLabels((prevLabels) =>
          prevLabels.filter((label) => label != id)
        );
      } else {
        setSelectedLabels([]);
      }
      const updatedData = taskLIstData?.map((task) => {
        // Check if the current task's id matches editId
        if (task.id == editId) {
          // Filter out the label with the specified label_id
          return {
            ...task,
            task_selected_labels: task.task_selected_labels.filter(
              (label) => label.label_id != id
            ),
          };
        }
        return task; // Return unchanged task if no match
      });
      setAllSubtask(updatedData);

    });

    setIsOpenDeletedLabelModal(false);
  };
  const handlePriorityMenuClick = (data) => {
    // setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
    handleEditTaskTitle([], data);
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
    labels: [],
    editPriority = null,
    EditDate = "0",
    EditselectedAgents = []
  ) => {
    const formData = new FormData();
    formData.append("labels", (selectedLabels as any) ?? "0");
    formData.append("title", text == "" ? updatedText : text);
    formData.append(
      "priority",
      editPriority == "No Priority" ? "" : editPriority ?? "0"
    );

    formData.append("due_date_time", EditDate ?? "0");

    const agentIds = EditselectedAgents.map((item) => {
      // If task_id exists, use user_id, otherwise use id
      return item.task_id ? item.user_id : item.agent_id;
    });

    formData.append(
      "agent_ids",
      EditselectedAgents?.length > 0 ? (agentIds as any) : "0"
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
      dispatch(
        updateProjectColumnList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );


      setEditId(null);
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleEditTitle = async (updatedText) => {

    const formData = new FormData();
    formData.append("labels", "0");
    formData.append("status", "0");
    formData.append("reminder", "0");
    formData.append("priority", "0");
    formData.append("due_date_time", "0");
    formData.append("agent_ids", "0");
    formData.append("title", updatedText);
    formData.append("task_id", editId);
    try {
      const res = await dispatch(EditTaskAdd(formData));

      // ListData({ loading: false });

      // setEditAble(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (showTaskInlineAddForm) {
      scrollToBottom();
    }
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return; // dropped outside the list

    const updatedTasks = Array.from(taskLIstData);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, movedTask);
    setAllSubtask(updatedTasks); // Update state with new order
    const payload = {
      project_column_id: taskLIstData[0]?.project_column_id,
      parent_task_id: taskLIstData[0]?.parent_task_id,
      task_ids:
        updatedTasks && updatedTasks.map((item: any, index) => item?.id),
    };
    const res = await dispatch(projectTaskMoveCol(payload));
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
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };

  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    setCalculatedDate(formattedDate);
    handleEditTaskTitle([], null, formattedDate);
  };

  const debouncedSearch = useCallback(debounce((searchValue) => {
    // Update the search filter here
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    }));
  }, 800), []);
  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    debouncedSearch(value);
  };

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

  return (
    <>
      {tableSelectedItemDesign == "Due Date" ? (
        <>
          <CommonDragTable
            headings={[
              "Title",
              // "Subtask",
              "Assigned",
              "Due Date",
              "Status",
              "Priority",
              "Action",
            ]}
            //@ts-ignore
            ref={ref}
          ></CommonDragTable>
          <div className="flex flex-col gap-5">
            <DueDate
              // rows={rows}
              title={"Overdue (2)"}
              className="text-lg font-medium text-[#F44336]"
            />
            <DueDate
              title={"No Due Date (5)"}
              // rows={rows}
              className="text-lg font-medium text-[#757982]"
            />
          </div>
        </>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <CommonDragTable
                  headings={[
                    // "#",
                    "Title",
                    // "Subtask",
                    "Assigned",
                    "Due Date",
                    "Status",
                    "Priority",
                    "Action",
                  ]}
                  //@ts-ignore
                  ref={ref}
                >
                  {showLoader == "idle" && taskLIstData?.length == 0 ? (
                    <>
                      <TableRow>
                        {!showTaskInlineAddForm && (
                          <TableCell colSpan={12} align="center">
                            {/* <ListLoading /> */}
                            <div
                              className="flex flex-col justify-center align-items-center gap-20  bg-[#F7F9FB]  py-15"
                              style={{ alignItems: "center" }}
                            >
                              <NoDataFound />
                            </div>
                            <Typography className="text-[24px] text-center font-600 leading-normal">
                              No data found!
                            </Typography>
                          </TableCell>
                        )}
                        {showTaskInlineAddForm && (
                          <TableCell colSpan={12}>
                            <EditTodoInlineSubTask
                              parentId={parentId}
                              ColumnId={taskId}
                              project_id={project_id}
                              setShowInLineAddForm={setShowTaskInlineAddForm}
                              tasktable={true}
                              scrollToBottom={scrollToBottom}
                              CallListApi={ListData}
                              margin={0}
                              setAllSubtask={setAllSubtask}
                            />
                          </TableCell>
                        )}
                      </TableRow>

                      {!showTaskInlineAddForm && (
                        <TableRow>
                          <TableCell colSpan={12}>
                            <div
                              className="border-1 border-[#e0dfdff6] w-full rounded-8 py-5 hover:bg-[#e7e8e9] cursor-pointer"
                              onClick={() => {
                                setShowTaskInlineAddForm(
                                  !showTaskInlineAddForm
                                );
                              }}
                            >
                              <Button
                                // variant="text"
                                // color="secondary"
                                className="h-[40px] text-[#757982] text-[16px] flex gap-8 font-[600] hover:bg-transparent px-20 justify-end  py-30 "
                                aria-label="Add Tasks"
                                size="large"
                                onClick={() => {
                                  setShowTaskInlineAddForm(
                                    !showTaskInlineAddForm
                                  );
                                }}
                              >
                                <AddIcon />
                                New Task
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ) : showLoader == "loading" ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <ListLoading /> {/* Render loader component */}
                      </TableCell>
                    </TableRow>
                  ) : (
                    // )}
                    <>
                      {taskLIstData?.map((row, index) => {
                        const shouldShowTooltip = row?.title?.length > 20;

                        return (
                          <>
                            {/* {row?.is_completed != 1 && ( */}
                            <Draggable
                              draggableId={`task${row?.id?.toString()}`}
                              index={index}
                              //@ts-ignore
                              type="task"
                              isDragDisabled={false}
                            >
                              {(provided, snapshot) => (
                                <>
                                  <TableRow
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    //@ts-ignore
                                    {...provided.draggableProps}
                                    //@ts-ignore
                                    // isDragging={snapshot.isDragging}
                                    key={index}
                                    sx={{
                                      position: "relative",
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                      "& td": {
                                        borderBottom: "1px solid #EDF2F6",
                                        paddingTop: "4px !important",
                                        color: "#111827",
                                        paddingBottom: "4px !important",
                                        fontWeight: 500,
                                      },
                                      "& td:nth-of-type(-n+3)": {
                                        maxWidth: 235, // Apply minWidth to the first 4 td elements
                                      },
                                      "& td:nth-last-of-type(-n+3)": {
                                        maxWidth: 150,
                                      },
                                      background:
                                        onTitleHover === row?.id
                                          ? "#E7E8E9"
                                          : "white",
                                    }}
                                    onMouseEnter={() =>
                                      setOnTitleHover(row?.id)
                                    }
                                    onMouseLeave={() => setOnTitleHover(null)}
                                  >
                                    {" "}
                                    <TableCell className="relative">
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 1,
                                          visibility:
                                            onTitleHover === row?.id
                                              ? "visible"
                                              : "hidden",

                                          opacity:
                                            onTitleHover === row?.id ? 1 : 0,
                                          transition:
                                            "opacity 0.2s ease-in-out", // Smooth transition effect
                                          zIndex: 99,
                                          justifyContent: "center",
                                          alignItems: "center",
                                          position: "absolute",
                                          top: "19px",
                                          right: -70,
                                        }}
                                      >
                                        <Tooltip
                                          title="Edit Labels"
                                          enterDelay={100}
                                          placement="top"
                                        >
                                          <div>
                                            <AddLableForTask
                                              handleEditTaskTitle={() =>
                                                handleEditTaskTitle(
                                                  row?.task_selected_labels
                                                )
                                              }
                                              project_id={project_id}
                                              selectedLabels={row?.task_selected_labels.map(
                                                (item) => item.label_id
                                              )}
                                              setSelectedLabels={
                                                setSelectedLabels
                                              }
                                              onclick={() => {
                                                setUpdatedText(row?.title);
                                                setEditId(row?.id);
                                              }}
                                              size={true}
                                              showSelectedLabels={
                                                row?.task_selected_labels
                                              }
                                            />
                                          </div>
                                        </Tooltip>

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
                                            <div className="bg-[#fff] px-3 py-3 rounded-[6px] cursor-pointer">
                                              <HoverEditIcon
                                                color="#757982"
                                                onClick={() => {
                                                  setEditAble(!editAble);
                                                  setEditId(row?.id);
                                                }}
                                                className="h-16 w-16"
                                              />
                                            </div>
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                      <div className="flex items-center gap-10">
                                        {row?.is_completed == 1 ? (
                                          <Checkbox
                                            onClick={(e) => {
                                              e.stopPropagation();
                                            }}
                                            checked={true}
                                            className="pl-0 cursor-none !bg-transparent"
                                            icon={<RadioButtonUnchecked />}
                                            checkedIcon={<CheckCircleOutline />}
                                          />
                                        ) : (
                                          <Tooltip
                                            title="Mark complete"
                                            placement="top"
                                            arrow
                                          >
                                            <Checkbox
                                              color="primary"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCompleteTask(row?.id);
                                              }}
                                              defaultChecked={
                                                row?.defaultChecked
                                              }
                                              inputProps={{
                                                "aria-labelledby": `table-checkbox-${index}`,
                                              }}
                                              checked={hovered == row?.id}
                                              onMouseEnter={() => {
                                                setHovered(row.id);
                                              }} // Set hover to the specific row
                                              onMouseLeave={() => {
                                                setHovered(null);
                                              }} // Reset hover on mouse leave
                                              sx={{
                                                "& .MuiSvgIcon-root": {
                                                  color:
                                                    hovered === row?.id
                                                      ? "grey"
                                                      : "default", // Change color when hovered
                                                  fontSize: 24, // Adjust size
                                                },
                                                "&.Mui-checked": {
                                                  color: "grey", // Adjust color for checked state
                                                },
                                              }}
                                              className="pl-0  !bg-transparent"
                                              icon={<RadioButtonUnchecked />} // Circle when unchecked
                                              checkedIcon={
                                                <CheckCircleOutline />
                                              } // Circle with check when checked
                                            />
                                          </Tooltip>
                                        )}{" "}
                                        <TruncateText
                                          editAble={editAble}
                                          setEditable={setEditAble}
                                          setUpdatedText={setUpdatedText}
                                          updatedText={updatedText}
                                          handleEditSubmit={handleEditTitle}
                                          editId={editId}
                                          id={row?.id}
                                          text={row?.title}
                                          maxWidth={70}
                                          style={{
                                            paddingLeft: "20px !important",
                                          }}
                                          taskList={taskLIstData}
                                          setTaskList={setAllSubtask}
                                        />
                                        {/* {row?.title} */}
                                        <div className="flex gap-6 ">
                                          {row?.task_selected_labels?.length !==
                                            0 &&
                                            row?.task_selected_labels
                                              ?.slice(0, 1)
                                              ?.map((row1, index) => {
                                                return (
                                                  <div
                                                    key={row1?.label_id}
                                                    className="text-secondary bg-[#EDEDFC] whitespace-nowrap overflow-hidden 
                                                                  text-ellipsis px-5 rounded-[6px] text-[12px] font-400 py-5 "
                                                  >
                                                    <Tooltip
                                                      title={row1?.label}
                                                    >
                                                      <Typography className="truncate">
                                                        {row1?.label}
                                                      </Typography>
                                                    </Tooltip>
                                                  </div>
                                                );
                                              })}

                                          {row?.task_selected_labels?.length >
                                            1 && (
                                              <>
                                                <IconButton
                                                  className="text-secondary bg-[#EDEDFC] rounded-[6px] whitespace-nowrap px-5 relative text-[12px] font-400 py-5"
                                                  onClick={(e) => {
                                                    handleClick(e, row?.id);
                                                    setEditId(row?.id);
                                                  }}
                                                >
                                                  +
                                                  {row?.task_selected_labels
                                                    ?.length - 1}
                                                </IconButton>

                                                <Menu
                                                  anchorEl={anchorEl}
                                                  open={
                                                    Boolean(anchorEl) &&
                                                    showLabel &&
                                                    row?.id === labelId
                                                  }
                                                  onClose={handleClose}
                                                  PaperProps={{
                                                    style: {
                                                      maxHeight: 161,
                                                      width: 241,
                                                      paddingLeft: 10,
                                                    },
                                                  }}
                                                  className="flex flex-wrap"
                                                >
                                                  {row?.task_selected_labels
                                                    ?.slice(1)
                                                    ?.map((row1, index) => {
                                                      return (
                                                        <MenuItem key={index}>
                                                          <div className="flex items-center bg-[#EDEDFC] gap-10 hover:!bg-[#EDEDFC] w-fit flex-wrap rounded-[4px] px-10 ">
                                                            <div className="text-[#757982] whitespace-nowrap ">
                                                              {row1?.label}
                                                            </div>
                                                            <IconButton
                                                              onClick={() => {
                                                                setIsOpenDeletedLabelModal(
                                                                  true
                                                                );
                                                                setIsLabelList(
                                                                  row1.label_id
                                                                );
                                                              }}
                                                            >
                                                              <LabelCrossIconBlue />
                                                            </IconButton>
                                                          </div>
                                                        </MenuItem>
                                                      );
                                                    })}
                                                </Menu>
                                              </>
                                            )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{ minWidth: "270px" }}
                                      className="whitespace-nowrap"
                                    >
                                      <div className="flex mt-10 items-center justify-center">

                                        <DropdownMenu
                                          anchorEl={AgentMenu}
                                          handleClose={(e: any) => {

                                            e.stopPropagation();
                                            handleEditTaskTitle(
                                              [],
                                              null,
                                              null,
                                              selectedAgents
                                            );
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
                                                setAgentMenu(
                                                  event.currentTarget
                                                );
                                                setText(row?.title);
                                                setEditId(row?.id);
                                              }}
                                            >
                                              {row?.assigned_task_users
                                                ?.length ? (
                                                <>
                                                  {row.assigned_task_users
                                                    ?.slice(0, 3)
                                                    .map((item, idx) => {
                                                      return (
                                                        <img
                                                          className={`h-[30px] w-[30px] rounded-full border-2 border-white ${row
                                                            .assigned_task_users
                                                            ?.length > 1
                                                            ? "ml-[-16px]"
                                                            : ""
                                                            } z-0`}
                                                          src={
                                                            item.user_image
                                                              ? urlForImage +
                                                              item?.user_image
                                                              : "../assets/images/logo/images.jpeg"
                                                          }
                                                          alt={`User ${index + 1}`}
                                                        />
                                                        // </div>
                                                      );
                                                    })}
                                                  {row?.assigned_task_users
                                                    ?.length > 3 && (
                                                      <div
                                                        className="ml-[-16px] z-0 h-[30px] w-[30px] rounded-full border-2 border-white bg-[#4F46E5] flex 
                        items-center justify-center text-[12px] font-500 text-white"
                                                      >
                                                        +
                                                        {row?.assigned_task_users
                                                          ?.length - 3}
                                                      </div>
                                                    )}
                                                </>
                                              ) : (
                                                "N/A"
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
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                              >
                                                {agentMenuData?.map(
                                                  (item: any) => (
                                                    <div
                                                      className="flex items-center gap-10 px-20 w-full"
                                                      key={item.id}
                                                      onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleAgentSelect(
                                                          item.agent_id
                                                        );
                                                      }}
                                                    >
                                                      <label
                                                        className="flex items-center gap-10 w-full cursor-pointer my-5"
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      >
                                                        <Checkbox
                                                          className="d-none  hover:!bg-transparent"
                                                          checked={selectedAgents?.some(
                                                            (agent) =>
                                                              agent.agent_id
                                                                ? agent.agent_id ==
                                                                item.agent_id
                                                                : agent.user_id ==
                                                                item.user_id
                                                          )}
                                                          // checked={selectedAgents.some(agent => agent.user_id == item.agent_id)}
                                                          onChange={(e) => {
                                                            handleAgentSelect(
                                                              item.agent_id
                                                            );
                                                            e.stopPropagation();
                                                          }}
                                                        // sx={{
                                                        //   "& :hover"{{
                                                        //     background:""
                                                        //   }}
                                                        // }}
                                                        />
                                                        {/* <span>{item?.userName}</span> */}
                                                        <div
                                                          className="h-[35px] w-[35px] rounded-full "
                                                          onClick={(e) =>
                                                            e.stopPropagation()
                                                          }
                                                        >
                                                          {item.user_image ? (
                                                            <img
                                                              src={
                                                                urlForImage +
                                                                item.user_image
                                                              }
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
                                                          <span>
                                                            {item?.userName}
                                                          </span>
                                                          <span className="text-[#757982] text-12">
                                                            {Role(
                                                              item?.role_id
                                                            )}
                                                          </span>
                                                        </div>
                                                      </label>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </DropdownMenu>
                                      </div>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="whitespace-nowrap"
                                    >
                                      {/* {CheckDate(row?.due_date_time) ? (
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
                                          <span className="text-[red]">
                                            {row?.due_date_time
                                              ? moment
                                                  .utc(row?.due_date_time)
                                                  .format(" MMMM Do, YYYY ")
                                              : "N/A"}
                                          </span>
                                        </Tooltip>
                                      ) : row?.due_date_time ? (
                                        moment
                                          .utc(row?.due_date_time)
                                          .format(" MMMM Do, YYYY ")
                                      ) : (
                                        "N/A"
                                      )} */}
                                      <div
                                        onClick={() => {
                                          setEditId(row?.id);
                                          setText(row?.title);
                                        }}
                                      >
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
                                                setDateTimeMenu(
                                                  e.currentTarget
                                                );
                                                e.stopPropagation();
                                                setEditId(row?.id);
                                                setText(row?.title);
                                              }}
                                            >
                                              {/* <ClockTask color={"#4F46E5"} /> */}
                                              <Typography
                                                className="text-[14px] ml-10 font-500"
                                                onClick={(event) => {
                                                  setDateTimeMenu(
                                                    event.currentTarget
                                                  );
                                                  setEditId(row?.id);
                                                  setText(row?.title);
                                                  event.stopPropagation();
                                                }}
                                              >
                                                {row?.due_date_time
                                                  ? moment
                                                    .utc(row?.due_date_time)
                                                    .format(" MMMM Do, YYYY ")
                                                  : "N/A"}
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
                                                setEditId(row?.id);
                                                const futureDate =
                                                  calculateFutureDate(
                                                    item.days,
                                                    item.label
                                                  );
                                                setCalculatedDate(
                                                  futureDate.toLocaleString()
                                                ); // Store the calculated date
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
                                                handleClickDate(e);
                                                e.stopPropagation();
                                              }}
                                            >
                                              Custom Date
                                            </CustomButton>
                                            <span
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditId(row?.id);
                                                setText(row?.title);
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
                                                    handleEditTaskTitle(
                                                      [],
                                                      null,
                                                      ""
                                                    );
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
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="whitespace-nowrap"
                                    >
                                      <span>
                                        {row?.status_name
                                          ? row?.status_name
                                          : "N/A"}
                                      </span>
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      className="whitespace-nowrap"
                                    >
                                      {/* {row?.priority === null ||
                                      row?.priority === "null" ? (
                                        "N/A"
                                      ) : (
                                        <span
                                          className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
                         ${
                           row?.priority === "Low"
                             ? "text-[#4CAF50] bg-[#4CAF502E]"
                             : row?.priority === "Medium"
                               ? "text-[#FF5F15] bg-[#FF5F152E]"
                               : "text-[#F44336] bg-[#F443362E]"
                         }`}
                                        >
                                          {row?.priority}
                                        </span>
                                      )} */}

                                      {/* {row?.priority !== null &&
                                      row?.priority !== "null" &&
                                      row?.priority != "" &&
                                      row?.priority != "No Priority" ? ( */}
                                      {
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
                                                  setPriorityMenu(
                                                    event.currentTarget
                                                  );
                                                  setText(row.title);
                                                  setEditId(row.id);
                                                }}
                                                className={`${row?.priority === null ||
                                                  row?.priority === "null"
                                                  ? ""
                                                  : row?.priority === "Medium"
                                                    ? "bg-priorityMedium/[.18]"
                                                    : row?.priority === "High"
                                                      ? "bg-red/[.18]"
                                                      : "bg-green/[.18]"
                                                  } py-5 px-10 rounded-[27px] min-w-[69px] text-[14px] flex justify-center items-center font-medium ${row?.priority === "Medium"
                                                    ? "text-priorityMedium"
                                                    : row?.priority === "High"
                                                      ? "text-red"
                                                      : "text-black "
                                                  } font-500`}
                                              >
                                                {row?.priority || "N/A"}
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

                                                  handlePriorityMenuClick(
                                                    item.label
                                                  );
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
                                                    [],
                                                    "No Priority"
                                                  );
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
                                      }
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className="w-[1%] whitespace-nowrap"
                                    >
                                      <div className="flex gap-20 items-center">
                                        {/* {userDetails?.role_id != 3 && ( */}
                                        <>
                                          <span className="p-2 cursor-pointer">
                                            <DeleteIcon
                                              onClick={() => {
                                                setIsOpenDeletedModal(true);
                                                setIsDeleteId(row.id);
                                              }}
                                            />
                                          </span>
                                          {/* <span className="p-2 cursor-pointer">
                                <EditIcon
                                  onClick={() => {
                                    setIsOpenAddModal(true);
                                    setTaskId(row.id);
                                  }}
                                />
                              </span> */}
                                        </>
                                        {/* )} */}
                                        {/* <Link
                                          to={`/${project_id}/${parentId}/subTask/detail/${row?.id}${clientId ? `?ci=${clientId}` : ""}`}
                                        > */}
                                        <span className="p-2 cursor-pointer">
                                          <ArrowRightCircleIcon />
                                        </span>
                                        {/* </Link> */}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </Draggable>
                            {/* )} */}
                            {!isSubtask && row?.is_completed != 1 && (
                              <ProjectListSubTaskData
                                subTasks={row?.sub_tasks}
                                projectid={row?.id}
                                tableData={true}
                                callListApi={ListData}
                                handleCompleteTask={handleCompleteTask}
                                ColumnId={ColumnId}
                                table={true}
                                tab={1}
                              />
                            )}
                          </>
                        );
                      })}

                      {showTaskInlineAddForm && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <EditTodoInlineSubTask
                              parentId={parentId}
                              ColumnId={taskId}
                              project_id={project_id}
                              setShowInLineAddForm={setShowTaskInlineAddForm}
                              scrollToBottom={scrollToBottom}
                              CallListApi={ListData}
                              tasktable={tableTask}
                              margin={0}
                              setAllSubtask={setAllSubtask}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                      {!showTaskInlineAddForm && (
                        <TableRow style={{ border: "none" }}>
                          <TableCell colSpan={12} style={{ padding: "0px" }}>
                            <div
                              className="border-1 border-[#e0dfdff6] w-full rounded-8 py-5 hover:bg-[#e7e8e9] cursor-pointer"
                              onClick={() => {
                                setShowTaskInlineAddForm(
                                  !showTaskInlineAddForm
                                );
                                const timer = setTimeout(() => {
                                  scrollToBottom();
                                }, 400);
                              }}
                            >
                              <Button
                                className="h-[40px] text-[#757982] text-[16px] flex gap-8 font-[600] hover:bg-transparent px-20 justify-end  py-30 "
                                aria-label="Add Tasks"
                                size="large"
                                onClick={() => {
                                  setShowTaskInlineAddForm(
                                    !showTaskInlineAddForm
                                  );
                                  const timer = setTimeout(() => {
                                    scrollToBottom();
                                  }, 400);
                                  // return () => clearTimeout(timer);
                                }}
                              >
                                <AddIcon />
                                New Task
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </CommonDragTable>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        heading={"Delete Subtask"}
        description={"Are you sure you want to delete this Subtask? "}
      />
      <DeleteClient
        isOpen={isOpenDeletedLabelModal}
        setIsOpen={setIsOpenDeletedLabelModal}
        onDelete={() => {
          handleLabelDelete(isLabelList);
        }}
        heading={`Delete Label`}
        description={`Are you sure you want to delete this Label? `}
        isLoading={isLabelLoading}
      />

      {isOpenAddModal && (
        <AddTaskModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          project_id={project_id}
          ColumnId={taskId}
          Edit
        />
      )}
    </>
  );
});

export default ThemePageTable;
