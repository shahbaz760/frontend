import {
  Box,
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
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetail, listData, Role, StyledMenuItem } from "src/utils";
// import { DeleteIcon, EditIcon } from "public/assets/icons/navabarIcon";
import {
  deleteTask,
  EditTaskAdd,
  updateProjectColumnList,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  EditIcon,
} from "public/assets/icons/common";
import {
  LabelCrossIconBlue,
  SubTaskIcon,
} from "public/assets/icons/projectsIcon";
import ActionModal from "../../ActionModal";
import AddSubTaskModal from "../../tasks/AddSubTaskModal";
import TodoInlineSubTask from "./TodoInlineSubTask";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import DeleteClient from "../../client/DeleteClient";
import { DeleteLabel, getStatusList } from "app/store/Agent";
import DropdownMenu from "../../Dropdown";
import toast from "react-hot-toast";
import InputField from "../../InputField";

import { debounce } from "lodash";
import { dateTimeMenuData, priorityMenuData } from "../../tasks/AddTask";
import CustomButton from "../../custom_button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateTimePicker } from "@mui/x-date-pickers";
import { GetAssignAgentsInfo } from "app/store/Client";
import AddLableForTask from "./AddLableForTask";
import { HoverEditIcon } from "public/assets/icons/dashboardIcons";
// export const TruncateTextTitle = ({ text, maxWidth }) => {
//   const [isTruncated, setIsTruncated] = useState(false);
//   const textRef = useRef(null);
//   useEffect(() => {
//     if (textRef.current) {
//       const textWidth = textRef.current.scrollWidth;
//       setIsTruncated(textWidth > maxWidth);
//     }
//   }, [text, maxWidth]);
//   return (
//     <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
//       <Typography
//         ref={textRef}
//         noWrap
//         className="text-[14px] font-normal  "
//         color="primary.main"
//         style={{
//           maxWidth: `${maxWidth}px`,
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           // display: "inline-block",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {text}
//       </Typography>
//     </Tooltip>
//   );
// };
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
  useEffect(() => {
    setTaskTitle(text);
  }, [text]);

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

interface ProjectListSubTaskDataProps {
  subTasks: any[];
  callListApi?: any;
  tableData?: boolean;
  projectid?: any;
  handleCompleteTask?: any;
  ColumnId?: any;
  parent_id?: any;
  showLabel?: boolean;
  setShowLbael?: any;
  table?: boolean;
  tab?: number;
  setAllSubTask?: any;
}
const ProjectListSubTaskData: React.FC<ProjectListSubTaskDataProps> = ({
  showLabel,
  subTasks,
  callListApi,
  projectid,
  tableData = false,
  ColumnId,
  parent_id,
  handleCompleteTask,
  tab,
  setAllSubTask = null,
}) => {
  const theme: Theme = useTheme();
  const { id, taskId, project_id } = useParams();
  const ggg = useParams();
  const userDetails = getUserDetail();
  const dispatch = useAppDispatch();
  const [tableList, setTableList] = useState(tableData);
  const [dateTimeMenu, setDateTimeMenu] = useState<HTMLElement | null>(null);
  const [isOpenAddSubTaskModal, setIsOpenAddSubTaskModal] = useState(false);
  const [statusMenuData, setStatusMenuData] = useState([]);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [disable, setDisabled] = useState(false);
  const [labelId, setLabelId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setId] = useState("");
  const [hovered, setHovered] = useState(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [isOpenDeletedLabelModal, setIsOpenDeletedLabelModal] = useState(false);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const userId = getUserDetail();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const getLoginedUser = getUserDetail();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [customDate, setCustomDate] = useState(null);
  const [editAble, setEditAble] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("agent");
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

  useMemo(() => {
    dispatch(GetAssignAgentsInfo(filterMenu)).then((res) => {
      setAgentMenuData(res?.payload?.data?.data?.list);
    });
  }, [filterMenu.search]);

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
    handleEditTaskTitle(false, null, formattedDate);
    return formattedDate;
  };

  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const handleDelete = () => {
    if (selectedId) {
      setDisabled(true);
      dispatch(deleteTask(selectedId))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setOpenDeleteModal(false);
            if (!tableData) {
              callListApi({ loader: false, drag: false });
            } else {
              callListApi({ loader: false, drag: false });
            }
            // fetchSubTaskList();
            // toast.success(res?.data?.message, {
            //   duration: 4000,
            // });
            setId("");
            setDisabled(false);
          }
        })
        .catch((err) => {
          setDisabled(false);
        });
      // setDisabled(false);
    }
  };
  const handleEditTaskTitle = async (
    labels: boolean,
    editPriority = null,
    EditDate = "0",
    EditselectedAgents?: any,
    status = null
  ) => {
    const formData = new FormData();
    formData.append("labels", labels ? (selectedLabels as any) : "0");
    formData.append("title", text == "" ? updatedText : text);
    formData.append(
      "priority",
      editPriority == "No Priority" ? "" : editPriority ?? "0"
    );

    // formData.append("due_date_time", EditDate ?? "0");
    formData.append("status", status ?? "0");

    // const agentIds = EditselectedAgents?.map((item) => {
    //   // If task_id exists, use user_id, otherwise use id
    //   return item.task_id ? item.user_id : item.agent_id;
    // });

    // formData.append("agent_ids", (agentIds as any) ?? "0");
    const agentIds = EditselectedAgents?.map((item) => {
      // If task_id exists, use user_id, otherwise use id
      return item.task_id ? item.user_id : item.agent_id;
    });

    formData.append(
      "agent_ids",
      EditselectedAgents?.length > 0 ? (agentIds as any) : "0"
    );

    formData.append("due_date_time", EditDate);

    formData.append("reminder", "0");
    formData.append("task_id", editId);
    try {
      const res = await dispatch(EditTaskAdd(formData));
      const updatedTask = res?.payload?.data?.data;
      // setAllSubTask((prevTaskList) =>
      //   prevTaskList.map((task) =>
      //     task.id == editId
      //       ? { ...task, ...updatedTask } // Merge new data with the old task data
      //       : task
      //   )
      // );
      callListApi({ loading: false });
      setStatusMenu(null);
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
  const isDateBeforeToday = (date) => {
    return date ? moment(date).isBefore(moment(), "day") : false;
  };
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setLabelId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // setShowLbael(false);
  };
  const handleLabelDelete = (ids: any) => {
    dispatch(DeleteLabel(ids)).then((res) => {
      setIsLabelLoading(false);

      //   formik.setFieldValue("newLabel", "");
      if (tableData) {
        callListApi({ loading: false });
      } else {
        listData({
          loader: false,
          dispatch,
          project_id: id as any,
          is_view: tab,
        });
      }
    });
    setIsLabelLoading(false);
    setIsOpenDeletedModal(false);
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
  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    const formattedDate = moment(newDate).format("DD/MM/YYYY h:mm A");
    setSelectedDate(formattedDate);
    setCalculatedDate(formattedDate);
    handleEditTaskTitle(false, null, formattedDate);
  };
  const debouncedSearch = useCallback(debounce((searchValue) => {
    // Update the search filter here
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    }));
  }, 800), []);
  const handleClickDate = (event) => {
    setAnchorEl(event.currentTarget);
    setCalenderOpen(true);
  };
  const handleSearchChange = (event: any) => {
    const { value } = event.target;
    debouncedSearch(value);
  };
  const handlePriorityMenuClick = (data) => {
    // setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
    handleEditTaskTitle(false, data);
  };
  const handleEditTitle = async (updatedText) => {

    const formData = new FormData();

    formData.append("title", updatedText);
    formData.append("labels", "0");
    formData.append("task_id", editId);
    formData.append("priority", "0");
    formData.append("agent_ids", "0");
    formData.append("reminder", "0");
    formData.append("due_date_time", "0");
    formData.append("status", "0");
    try {
      const res = await dispatch(EditTaskAdd(formData));

      callListApi({ loading: false });

      // setEditAble(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    dispatch(getStatusList({ id: id })).then((res) => {
      setStatusMenuData(res?.payload?.data?.data?.list);
    });
  }, [id]);

  const handleStatusMenuClick = (event) => {
    setStatusMenu(event.currentTarget);
  };
  return (
    <>
      {subTasks?.map((row, index) => {
        return (
          <TableRow
            key={index + 1}
            sx={{
              paddingRight: "10px !important",
              "&:hover": {
                backgroundColor: "#F7F8F9",
                // Change to your desired hover color
                cursor: "pointer", // Optional: Adds a pointer cursor on hover
              },

              "& td": {
                // borderBottom: "1px solid #EDF2F6",
                paddingTop: "4px !important",
                background: onTitleHover === row?.id ? "#E7E8E9" : "white",
                color: "#4A4D53",
                paddingBottom: "4px !important",
                borderBottom: "1px solid #EDF2F6",
                fontSize: "1.4rem",
              },
            }}
            onMouseEnter={() => setOnTitleHover(row?.id)}
            onMouseLeave={() => setOnTitleHover(null)}
          >
            <TableCell className="relative">
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  visibility: onTitleHover === row?.id ? "visible" : "hidden",

                  opacity: onTitleHover === row?.id ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out", // Smooth transition effect
                  zIndex: 99,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: "19px",
                  right: -70,
                }}
              >
                <Tooltip title="Edit Labels" enterDelay={100} placement="top">
                  <div>
                    <AddLableForTask
                      handleEditTaskTitle={(val) => {
                        handleEditTaskTitle(val);
                      }}
                      project_id={project_id}
                      selectedLabels={row?.task_selected_labels.map(
                        (item) => item.label_id
                      )}
                      setSelectedLabels={setSelectedLabels}
                      onclick={() => {
                        setUpdatedText(row?.title);
                        setEditId(row?.id);
                      }}
                      size={true}
                      showSelectedLabels={row?.task_selected_labels}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="Rename" enterDelay={100} placement="top">
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
                          // setText(row?.title);
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
                  <Tooltip title="Mark complete" placement="top" arrow>
                    <Checkbox
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(row?.id);
                      }}
                      defaultChecked={row?.defaultChecked}
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
                          color: hovered === row?.id ? "grey" : "default", // Change color when hovered
                          fontSize: 24, // Adjust size
                        },
                        "&.Mui-checked": {
                          color: "grey", // Adjust color for checked state
                        },
                      }}
                      className="pl-0  !bg-transparent"
                      icon={<RadioButtonUnchecked />} // Circle when unchecked
                      checkedIcon={<CheckCircleOutline />} // Circle with check when checked
                    />
                  </Tooltip>
                )}
                {tableData && (
                  <span>
                    <SubTaskIcon />
                  </span>
                )}{" "}
                {/* <div
                  onClick={(e) => {
                    event.preventDefault();
                    e.stopPropagation();
                    // navigate(`/tasks/detail/${id}`);
                    navigate(`/${id}/${projectid}/subTask/detail/${row.id}`);
                  }}
                > */}
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
                  taskList={subTasks}
                  setTaskList={tableData}
                />
                {/* </div> */}
                {/* {row?.labels != "0" && row?.labels != null && ( */}
                <div className="flex gap-6 ">
                  {row?.task_selected_labels?.length !== 0 &&
                    row?.task_selected_labels
                      ?.slice(0, 1)
                      ?.map((row1, index) => {
                        return (
                          <div
                            key={row1?.label_id}
                            className="text-secondary bg-[#EDEDFC] whitespace-nowrap overflow-hidden 
                                                                  text-ellipsis px-5 rounded-[6px] text-[12px] font-400 py-5 "
                          >
                            <Tooltip title={row1?.label}>
                              <Typography className="truncate">
                                {row1?.label}
                              </Typography>
                            </Tooltip>
                          </div>
                        );
                      })}

                  {row?.task_selected_labels?.length > 1 && (
                    <>
                      <IconButton
                        className="text-secondary bg-[#EDEDFC] rounded-[6px] whitespace-nowrap px-5 relative text-[12px] font-400 py-5"
                        onClick={(e) => {
                          handleClick(e, row?.id);
                          setEditId(row?.id);
                        }}
                      >
                        +{row?.task_selected_labels?.length - 1}
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && row?.id === labelId}
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
                                      setIsOpenDeletedLabelModal(true);
                                      setIsLabelList(row1.label_id);
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
                {/* )} */}
              </div>
            </TableCell>
            {/* <TableCell
              align="center"
              className="whitespace-nowrap font-500 min-w-[200px]"
              style={{
                // paddingLeft: "20px",
                width: "250px",
              }}
            > */}
            <>
              <TableCell
                align="center"
                style={{ minWidth: "270px" }}
                className="whitespace-nowrap"
              >
                <div className="flex mt-10 items-center justify-center">
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
                      handleEditTaskTitle(false, null, "0", selectedAgents);
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
                          setText(row?.title);
                          setEditId(row?.id);
                          setSelectedAgents(row?.assigned_task_users);
                        }}
                      >
                        {row?.assigned_task_users?.length ? (
                          <>
                            {row.assigned_task_users
                              ?.slice(0, 3)
                              .map((item, idx) => {
                                return (
                                  // <div>
                                  <img
                                    className={`h-[30px] w-[30px] rounded-full border-2 border-white ${row.assigned_task_users?.length > 1
                                      ? "ml-[-16px]"
                                      : ""
                                      } z-0`}
                                    src={
                                      item.user_image
                                        ? urlForImage + item?.user_image
                                        : "../assets/images/logo/images.jpeg"
                                    }
                                    alt={`User ${index + 1}`}
                                  />
                                  // </div>
                                );
                              })}
                            {row?.assigned_task_users?.length > 3 && (
                              <div
                                className="ml-[-16px] z-0 h-[30px] w-[30px] rounded-full border-2 border-white bg-[#4F46E5] flex 
                        items-center justify-center text-[12px] font-500 text-white"
                              >
                                +{row?.assigned_task_users?.length - 3}
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
              </TableCell>
            </>
            {/* </TableCell> */}

            <TableCell
              style={{
                // paddingLeft: "20px",
                width: "250px",
              }}
              align="center"
              className="whitespace-nowrap font-500"
            >
              {/* {isDateBeforeToday(row?.due_date_time) ? (
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
                  <Typography color="#F44336" className="text-[14px] ml-10 ">
                    {!row?.due_date_time
                      ? "N/A"
                      : moment(row?.due_date_time).format("ll")}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography className="text-[14px] ml-10 ">
                  {!row?.due_date_time
                    ? "N/A"
                    : moment(row?.due_date_time).format("ll")}
                </Typography>
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
                    <div
                      className="flex items-center cursor-pointer justify-center "
                      style={{ alignItems: "center" }}
                      onClick={(e) => {
                        setDateTimeMenu(e.currentTarget);
                        e.stopPropagation();
                        setEditId(row?.id);
                        setText(row?.title);
                      }}
                    >
                      {/* <ClockTask color={"#4F46E5"} /> */}
                      <Typography
                        className="text-[14px] ml-10 font-500 text-black"
                        onClick={(event) => {
                          setDateTimeMenu(event.currentTarget);
                          setEditId(row?.id);
                          setText(row?.title);
                          event.stopPropagation();
                          setSelectedDate(
                            row?.due_date_time
                              ? moment(row?.due_date_time).format(
                                "DD/MM/YYYY h:mm A"
                              )
                              : null
                          );
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
                          views={["year", "month", "day", "hours", "minutes"]}
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
                            handleEditTaskTitle(false, null, "");
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
              style={{
                // paddingLeft: "20px",
                width: "250px",
              }}
              align="center"
              className="whitespace-nowrap font-500 text-[14px] !text-black"
            >
              <DropdownMenu
                anchorEl={statusMenu}
                handleClose={() => setStatusMenu(null)}
                button={
                  <div
                    onClick={(e) => {
                      handleStatusMenuClick(e);
                      setEditId(row.id);
                      setText(row.title);
                    }}
                    // label={selectedStatus}
                    style={{ maxWidth: "200px" }}
                  >
                    <Typography className="text-[14px] ml-10 font-500">
                      {selectedStatusId
                        ? statusMenuData?.find(
                          (item) => item.id == selectedStatusId
                        )?.name
                        : row.status_name}
                      {/* icon={<StatusIcon />} */}
                    </Typography>
                  </div>
                }
                popoverProps={{
                  open: !!statusMenu,
                  classes: {
                    paper: "pt-10 pb-20",
                  },
                }}
              >
                {statusMenuData?.map((item) => {
                  return (
                    <StyledMenuItem
                      key={item.id}
                      onClick={() => {
                        setEditId(row.id);
                        setText(row.title);
                        handleEditTaskTitle(false, null, "0", [], item.id);
                      }}
                    >
                      {item.name}
                    </StyledMenuItem>
                  );
                })}
              </DropdownMenu>
            </TableCell>

            <TableCell
              style={{
                // paddingLeft: "20px",
                width: "250px",
              }}
              align="center"
              className="whitespace-nowrap font-500"
            >
              {/* {row?.priority === null || row?.priority === "null" ? (
                "N/A"
              ) : (
                <div className="w-full flex items-center justify-center">
                  <span
                    className={`${
                      row?.priority === "Medium"
                        ? "bg-priorityMedium/[.18]"
                        : row?.priority === "High"
                          ? "bg-red/[.18]"
                          : "bg-green/[.18]"
                    } py-5 px-10 rounded-[27px] block text-[12px] font-medium ${
                      row?.priority === "Medium"
                        ? "text-priorityMedium"
                        : row?.priority === "High"
                          ? "text-red"
                          : "text-green"
                    } !min-w-[69px] w-[70px]`}
                  >
                    {row?.priority}
                  </span>
                </div>
              )} */}
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
                    className={`flex gap-4 cursor-pointer my-5 items-center justify-center`}
                  >
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        setPriorityMenu(event.currentTarget);
                        setText(row.title);
                        setEditId(row.id);
                      }}
                      className={`${row?.priority === null || row?.priority === "null"
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

                        handleEditTaskTitle(false, "No Priority");
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
            </TableCell>

            <TableCell align="left" className="w-[1%] font-500">
              <div className={`flex gap-20 ${tableData ? "" : "px-10"}`}>
                {userDetails?.role_id != 3 && (
                  <span className="p-2 cursor-pointer">
                    <DeleteIcon
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setId(row.id);
                      }}
                    />
                  </span>
                )}
                {/* {userDetails?.role_id != 3 && (
                  <span
                    className="p-2 cursor-pointer"
                    onClick={() => {
                      setIsOpenAddSubTaskModal(true);
                      setId(row.id);
                    }}
                  >
                    <EditIcon />
                  </span>
                )} */}
                {/* <span
                  className="p-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault(); // Use 'e' instead of 'event' for consistency
                    e.stopPropagation();
                    // navigate(`/${id}/${projectid}/subTask/detail/${row.id}`);
                  }}
                >
                  <ArrowRightCircleIcon />
                </span> */}
              </div>
            </TableCell>
          </TableRow>
        );
      })}

      {isOpenAddSubTaskModal && (
        <AddSubTaskModal
          isOpen={isOpenAddSubTaskModal}
          setIsOpen={setIsOpenAddSubTaskModal}
          project_id={id}
          // fetchSubTaskList={fetchSubTaskList}
          Edit={true}
          ColumnId={selectedId}
          callListApi={callListApi}
        />
      )}
      <ActionModal
        modalTitle="Delete Subtask"
        modalSubTitle="Are you sure you want to delete this subtask?"
        open={openDeleteModal}
        handleToggle={toggleDeleteModal}
        type="delete"
        onDelete={handleDelete}
        disabled={disable}
      />
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleLabelDelete(isLabelList);
        }}
        heading={`Delete Label`}
        description={`Are you sure you want to delete this Label? `}
        isLoading={isLabelLoading}
      />
    </>
  );
};
export default ProjectListSubTaskData;
