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
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { DeleteLabel } from "app/store/Agent";
import {
  deleteTask,
  EditTaskAdd,
  TaskListColumn,
  updateProjectColumnList,
  updateProjectTaskList,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  EditIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { HoverEditIcon, PlusIcon } from "public/assets/icons/dashboardIcons";
import { LabelCrossIconBlue } from "public/assets/icons/projectsIcon";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getClientId, getUserDetail, listData } from "src/utils";
import DeleteClient from "../client/DeleteClient";
import CommonTable from "../commonTable";
import DueDate from "../projects/DueDate";
import ProjectListSubTaskData from "../projects/ProjectTaskList/ProjectListSubTaskData";
import TodoInlineSubTask from "../projects/ProjectTaskList/TodoInlineSubTask";
import AddTaskModal from "./AddTask";
import AddTaskInline from "./AddTaskInline";
import toast from "react-hot-toast";
import AddLableForTask from "../projects/ProjectTaskList/AddLableForTask";
import { truncate } from "lodash";
export const TruncateText = ({
  text,
  maxWidth,
  style,
  setUpdatedText,
  editAble,
  setEditable,
  editId,
  id,
  handleEditSubmit,
  updatedText,
  setList,
  list,
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
  const updateTaskTitle = (id, newTitle, list) => {
    return list?.map((task) =>
      task.id == id ? { ...task, title: newTitle } : task
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents a newline from being added
      setEditable(false); // Set editable to false
      handleEditSubmit();
      const updatedList = updateTaskTitle(id, updatedText, list);
      setList(updatedList);
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
          disableHoverListener={text?.length <= 8 || isTruncated}
        >
          <Typography
            ref={textRef}
            noWrap
            style={{
              // height: 37,
              maxWidth: `${maxWidth}px`,
              minWidth: "50px",
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
    taskListData,
    scrollToBottom,
    taskList,
    elementRef,
  }: any = props;
  const dispatch = useAppDispatch();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [isOpenDeletedLabelModal, setIsOpenDeletedLabelModal] = useState(false);
  const [total_items, setTotal_items] = useState(0);
  const [deleteId, setIsDeleteId] = useState<any>(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const userDetails = getUserDetail();
  const [showLabel, setShowLbael] = useState(false);
  const [taskId, setTaskId] = useState<number>(null);
  const [disable, setDisabled] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [editAble, setEditAble] = useState(false);
  const [editId, setEditId] = useState(null);
  const [list, setList] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const clientId = getClientId();
  const [labelId, setLabelId] = useState(null);
  const [editableText, setEditableText] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showTaskInlineAddForm, setShowTaskInlineAddForm] = useState(false);
  const [showSubTaskInlineAddForm, setShowSubTaskInlineAddForm] =
    useState(null);
  const [hovered, setHovered] = useState(null);

  const { isSubtask, fetchTask, ProjectTask } = useSelector(
    (store: ProjectRootState) => store?.project
  );

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const theme: Theme = useTheme();

  const handleDeleteAttachment = (id) => {
    setDisabled(true); // Disable the button during the deletion process

    dispatch(deleteTask(id))
      .unwrap() // Unwrap the result of the dispatch
      .then((res) => {
        if (res?.data?.status === 1) {
          // If delete is successful, update state and show success message
          setColumnList((prevColumnList) =>
            prevColumnList.filter((item) => item.id !== id)
          );

          // Update the project task list
          dispatch(
            updateProjectTaskList({
              operation: "delete",
              task: res?.data?.data,
            })
          );

          // Show success toast message
          toast.success(res?.data?.message, {
            duration: 4000,
          });

          // Reset state variables
          setDisabled(false);
          setIsOpenDeletedModal(false);
          setIsDeleteId(null); // Reset editId to null after deletion
        }
      })
      .catch((err) => {
        // Handle errors and reset disabled and modal state
        setDisabled(false);
        setIsOpenDeletedModal(false);
      });
  };
  const handleEditTaskTitle = async (labels: []) => {

    const formData = new FormData();

    formData.append("labels", selectedLabels as any);
    formData.append("status", "0");
    formData.append("reminder", "0");
    formData.append("title", updatedText);
    formData.append("task_id", editId);
    formData.append("priority", "0");
    formData.append("due_date_time", "0");
    formData.append("agent_ids", "0");
    try {
      const res = await dispatch(EditTaskAdd(formData));
      ListData({ loading: false });
      // dispatch(
      //   updateProjectColumnList({
      //     operation: "edit",
      //     task: res?.payload?.data?.data,
      //   })
      // );
      // setEditAble(false);

      setEditId(null);
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      if (selectedLabels?.length > 0) {
        setSelectedLabels((prevLabels) =>
          prevLabels.filter((label) => label != id)
        );
      } else {
        setSelectedLabels([]);
      }
      ListData({ loading: false });

      // formik.setFieldValue("newLabel", "");
    });

    setIsOpenDeletedLabelModal(false);
  };
  useEffect(() => {
    setList(ProjectTask);
  }, [ProjectTask]);

  // useEffect(() => {
  //   if (showTaskInlineAddForm) {
  //     setTimeout(() => {
  //       scrollToBottom(elementRef);
  //     }, 400)
  //   }

  // }, [showTaskInlineAddForm]);
  // useEffect(() => {
  //   if (showSubTaskInlineAddForm) {
  //     setTimeout(() => {
  //       scrollToBottom(elementRef);
  //     }, 400)
  //   }

  // }, [showSubTaskInlineAddForm]);

  return (
    <>
      {tableSelectedItemDesign == "Due Date" ? (
        <>
          <CommonTable
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
          >
            <div></div>
          </CommonTable>
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
        <CommonTable
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
          {fetchTask == "idle" && ProjectTask?.length == 0 ? (
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
                    <TodoInlineSubTask
                      parentId={null}
                      ColumnId={taskId}
                      project_id={project_id}
                      setShowInLineAddForm={setShowTaskInlineAddForm}
                      tasktable={true}
                      scrollToBottom={scrollToBottom}
                      column_ids="0"
                      elementRef={elementRef}
                    />
                  </TableCell>
                )}
              </TableRow>

              {!showTaskInlineAddForm && (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Button
                      variant="text"
                      color="secondary"
                      className="h-[40px] text-[16px] flex gap-8 font-[600] px-20 justify-end  py-20 mb-16 whitespace-nowrap"
                      aria-label="Add Tasks"
                      size="large"
                      onClick={() => {
                        setShowTaskInlineAddForm(!showTaskInlineAddForm);
                      }}
                    >
                      <PlusIcon color={theme.palette.secondary.main} />
                      Add Task
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </>
          ) : fetchTask == "loading" ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <ListLoading /> {/* Render loader component */}
              </TableCell>
            </TableRow>
          ) : (
            // )}
            <>
              {list?.map((row, index) => {
                const shouldShowTooltip = row?.title?.length > 20;
                return (
                  <>
                    {row?.is_completed != 1 && (
                      <TableRow
                        key={index}
                        sx={{
                          position: "relative",
                          "&:last-child td, &:last-child th": { border: 0 },
                          "& td": {
                            borderBottom: "1px solid #EDF2F6",
                            paddingTop: "4px !important",
                            color: "#111827",
                            paddingBottom: "4px !important",
                            fontWeight: 500,
                          },
                          // "& td:nth-of-type(-n+3)": {
                          //   maxWidth: 235, // Apply minWidth to the first 4 td elements
                          // },
                          "& td:nth-last-of-type(-n+3)": {
                            maxWidth: 150,
                          },
                          background:
                            onTitleHover === row?.id ? "#E7E8E9" : "white",
                        }}
                        onMouseEnter={() => setOnTitleHover(row?.id)}
                        onMouseLeave={() => setOnTitleHover(null)}
                      >
                        <TableCell className="relative">
                          <Box
                            sx={{
                              display: "flex",

                              visibility:
                                onTitleHover === row?.id ? "visible" : "hidden",

                              opacity: onTitleHover === row?.id ? 1 : 0,
                              transition: "opacity 0.2s ease-in-out", // Smooth transition effect
                              zIndex: 99,
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              top: "9px",
                              right: !isSubtask ? -80 : -85,
                            }}
                          >
                            <Tooltip
                              title="Edit Labels"
                              enterDelay={100}
                              placement="top"
                            >
                              <div className={!isSubtask ? "mr-10" : "mr - 0"}>
                                <AddLableForTask
                                  handleEditTaskTitle={() =>
                                    handleEditTaskTitle(
                                      row?.task_selected_labels
                                    )
                                  }
                                  project_id={project_id}
                                  selectedLabels={row?.task_selected_labels?.map(
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
                            {isSubtask && (
                              <Tooltip
                                title="Add Subtask"
                                enterDelay={100}
                                placement="top"
                              >
                                <IconButton
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <div
                                    className="bg-[#fff] p-3 rounded-[6px] mr-6 ml-6 "
                                    onClick={() => {
                                      if (
                                        showSubTaskInlineAddForm >= 0 &&
                                        showSubTaskInlineAddForm == row.id
                                      ) {
                                        setShowSubTaskInlineAddForm(null);
                                        setExpandedRow(null);
                                      } else {
                                        setShowSubTaskInlineAddForm(row?.id);
                                        setExpandedRow(index);
                                      }

                                      if (
                                        expandedRow >= 0 &&
                                        expandedRow == index
                                      ) {
                                        setShowSubTaskInlineAddForm(null);
                                        setExpandedRow(null);
                                      } else {
                                        setShowSubTaskInlineAddForm(row?.id);
                                        setExpandedRow(index);
                                      }
                                    }}
                                  >
                                    <PlusIcon
                                      color={"#757982"} // Change color when disabled
                                      className={`h-16 w-16`} //
                                    />
                                  </div>
                                </IconButton>
                                {/* //{" "} */}
                              </Tooltip>
                            )}

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
                                    onClick={() => {
                                      setEditAble(!editAble); // Toggle edit mode
                                      setEditId(row?.id); // Set the current row id
                                      setEditableText(row?.title); // Initialize with current text
                                    }}
                                    className="h-16 w-16"
                                  />
                                </div>
                              </IconButton>
                            </Tooltip>
                          </Box>{" "}
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
                                  defaultChecked={row?.defaultChecked}
                                  inputProps={{
                                    "aria-labelledby": `table-checkbox-${index}`,
                                  }}
                                  checked={hovered == row?.id}
                                  onMouseEnter={() => setHovered(row.id)} // Set hover to the specific row
                                  onMouseLeave={() => setHovered(null)} // Reset hover on mouse leave
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
                                  checkedIcon={<CheckCircleOutline />} // Circle with check when checked
                                />
                              </Tooltip>
                            )}{" "}
                            <span
                              onClick={() => {
                                setIsOpenAddModal(true);
                                setTaskId(row.id);
                              }}
                            >
                              <TruncateText
                                editAble={editAble}
                                setEditable={setEditAble}
                                setUpdatedText={setUpdatedText}
                                updatedText={updatedText}
                                handleEditSubmit={handleEditTaskTitle}
                                editId={editId}
                                id={row?.id}
                                text={row?.title}
                                maxWidth={
                                  row?.task_selected_labels?.length == 0
                                    ? 480
                                    : 350
                                }
                                style={{
                                  paddingLeft: "20px !important",
                                }}
                                setList={setList}
                                list={list}
                              />
                            </span>
                            <div className="flex gap-6   ">
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
                                    className="text-secondary bg-[#EDEDFC] rounded-[6px] whitespace-nowrap px-5 relative text-[12px]
                                     font-400 py-5"
                                    onClick={(e) => handleClick(e, row?.id)}
                                  >
                                    +{row?.task_selected_labels?.length - 1}
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
                                            <div className="flex items-center bg-[#EDEDFC] gap-10 hover:!bg-[#EDEDFC] cursor-default w-fit flex-wrap rounded-[4px] px-10 ">
                                              <div className="text-[#757982] whitespace-nowrap ">
                                                {row1?.label}
                                              </div>
                                              <IconButton
                                                onClick={() => {
                                                  setIsOpenDeletedLabelModal(
                                                    true
                                                  );
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
                          </div>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ minWidth: "270px" }}
                          className="whitespace-nowrap"
                        >
                          <div className="flex mt-10 items-center justify-center">
                            {row?.assigned_task_users?.length ? (
                              <>
                                {row.assigned_task_users
                                  ?.slice(0, 3)
                                  ?.map((item, idx) => {
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
                                {row.assigned_task_users?.length > 3 && (
                                  <div
                                    className="ml-[-16px] z-0 h-[30px] w-[30px] rounded-full border-2 border-white bg-[#4F46E5] flex 
                        items-center justify-center text-[12px] font-500 text-white"
                                  >
                                    +{row.assigned_task_users?.length - 3}
                                  </div>
                                )}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </TableCell>
                        <TableCell align="center" className="whitespace-nowrap">
                          {CheckDate(row?.due_date_time) ? (
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
                          )}
                        </TableCell>
                        <TableCell align="center" className="whitespace-nowrap">
                          <span>
                            {row?.status_name ? row?.status_name : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="center" className="whitespace-nowrap">
                          {row?.priority === null ||
                            row?.priority === "null" ||
                            row?.priority == "No Priority" ? (
                            "N/A"
                          ) : (
                            <span
                              className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
                         ${row?.priority === "Low"
                                  ? "text-[#4CAF50] bg-[#4CAF502E]"
                                  : row?.priority === "Medium"
                                    ? "text-[#FF5F15] bg-[#FF5F152E]"
                                    : "text-[#F44336] bg-[#F443362E]"
                                }`}
                            >
                              {row?.priority}
                            </span>
                          )}
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
                              <span className="p-2 cursor-pointer">
                                <EditIcon
                                  onClick={() => {
                                    setIsOpenAddModal(true);
                                    setTaskId(row.id);
                                  }}
                                />
                              </span>
                            </>
                            {/* )} */}
                            {/* <Link
                              to={`/${project_id}/tasks/detail/${row?.id}${clientId ? `?ci=${clientId}` : ""}`}
                            >
                              <span className="p-2 cursor-pointer">
                                <ArrowRightCircleIcon />
                              </span>
                            </Link> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isSubtask && row?.is_completed != 1 && (
                      <ProjectListSubTaskData
                        subTasks={row?.sub_tasks}
                        projectid={row?.id}
                        tableData={true}
                        callListApi={ListData}
                        handleCompleteTask={handleCompleteTask}
                        ColumnId={ColumnId}
                        setAllSubTask={setList}
                        table={true}
                        tab={1}
                      />
                    )}
                    {showSubTaskInlineAddForm &&
                      isSubtask &&
                      expandedRow == index && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            {/* //add subtask or task */}
                            <TodoInlineSubTask
                              parentId={row?.id}
                              ColumnId={taskId}
                              project_id={project_id}
                              setShowInLineAddForm={setShowSubTaskInlineAddForm}
                              scrollToBottom={scrollToBottom}
                              column_ids="0"
                              index={expandedRow}
                              elementRef={elementRef}
                              tasktable={true}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                  </>
                );
              })}

              {showTaskInlineAddForm && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <TodoInlineSubTask
                      parentId={null}
                      ColumnId={taskId}
                      project_id={project_id}
                      setShowInLineAddForm={setShowTaskInlineAddForm}
                      tasktable={true}
                      scrollToBottom={scrollToBottom}
                      column_ids="0"
                      elementRef={elementRef}
                    />
                  </TableCell>
                </TableRow>
              )}
              {/* {!showTaskInlineAddForm && (
                <Button
                  variant="text"
                  color="secondary"
                  className="h-[40px] text-[16px] flex gap-8 font-[600] px-20 justify-end  py-20 mb-16 whitespace-nowrap"
                  aria-label="Add Tasks"
                  size="large"
                  onClick={() => {
                    setShowTaskInlineAddForm(!showTaskInlineAddForm);
                    const timer = setTimeout(() => {
                      scrollToBottom();
                    }, 400);
                    // return () => clearTimeout(timer);
                  }}
                >
                  <PlusIcon color={theme.palette.secondary.main} />
                  Add Task
                </Button>
              )} */}
            </>
          )}
        </CommonTable>
      )}
      {!showTaskInlineAddForm && ProjectTask?.length > 0 && (
        <Button
          variant="text"
          color="secondary"
          className="h-[40px] text-[16px]  flex gap-8 font-[600] px-20 justify-end  py-20 mb-16"
          aria-label="Add Tasks"
          size="large"
          onClick={() => {
            setShowTaskInlineAddForm(!showTaskInlineAddForm);
            const timer = setTimeout(() => {
              scrollToBottom();
            }, 400);
            return () => clearTimeout(timer);
          }}
        >
          <PlusIcon color={theme.palette.secondary.main} />
          Add Task
        </Button>
      )}

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        heading={"Delete Task"}
        description={"Are you sure you want to delete this Task? "}
        isLoading={disable}
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
        // <AddTaskModal
        <AddTaskInline
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          project_id={project_id}
          ColumnId={taskId}
          Edit
          tableTask={true}
          tab={1}
        />
      )}
    </>
  );
});

export default ThemePageTable;
