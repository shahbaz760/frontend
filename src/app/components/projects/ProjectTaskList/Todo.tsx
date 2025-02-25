import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  deleteTask,
  EditTaskAdd,
  OnScrollprojectColumnList,
  projectColumnList,
  projectColumnUpdate,
  updateProjectColumnList,
} from "app/store/Projects";
import { useFormik } from "formik";
import { HoverEditIcon, PlusIcon } from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { useTheme } from "@mui/styles";
import { ProjectRootState } from "app/store/Projects/Interface";
import { debounce } from "lodash";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  CrossIcon,
  EditIcon,
} from "public/assets/icons/common";
import { DeleteIcon } from "public/assets/icons/navabarIcon";
import {
  DownArrowBlack,
  DownArrowright,
  LabelCrossIconBlue,
  SortIcon,
  SubTaskIcon,
} from "public/assets/icons/projectsIcon";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router";
import { getClientId, getUserDetail } from "src/utils";
import ActionModal from "../../ActionModal";
import CommonDragTable from "../../CommonDragTable";
import AddTaskModal from "../../tasks/AddTask";
import AddLableForTask from "./AddLableForTask";
import ProjectListSubTaskData from "./ProjectListSubTaskData";
import TodoInlineSubTask from "./TodoInlineSubTask";
import { DeleteLabel, getLabelList } from "app/store/Agent";
import DeleteClient from "../../client/DeleteClient";
import { wrap } from "module";
import AddTaskInline from "../../tasks/AddTaskInline";

type MainCardType = {
  id?: string | number;
  title?: string;
  isEmpty?: boolean;
  callListApi?: any;
  dataList?: any;
  dataListLength?: any;
  tasks?: any[];
  project_id?: number | string;
  key?: any;
  index?: any;
  hoveredRowIndex?: any;
  showData?: boolean;
  setShowData?: any;
  column?: any;
  draggedId?: any;
  column_ids?: any;
  total_length?: any;
  name?: any;
  table?: boolean;
  handleCompleteTask?: any
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
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        className="text-[18px] font-semibold mb-5 "
        color="primary.main"
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

export const TruncateText = ({
  text,
  maxWidth,
  style,
  setUpdatedText,
  editAble,
  setEditable,
  editId,
  id,
  taskList,
  setTaskList,
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
      handleEditSubmit();
      const updatedList = updateTaskTitle(id, updatedText, taskList);
      setTaskList(updatedList); // Update the task list state
      listData({ loader: false, drag: false });
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
          disableHoverListener={text.length <= 8 || isTruncated}
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

export default function Todo({
  title,
  isEmpty,
  id,
  dataList,
  callListApi,
  showData,
  setShowData,
  dataListLength,
  tasks,
  project_id,
  key,
  index,
  draggedId,
  column,
  hoveredRowIndex,
  column_ids,
  total_length,
  handleCompleteTask,
}: MainCardType) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [edit, setIsEdit] = useState(false);
  const [showLabel, setShowLbael] = useState(false);
  const [labelId, setLabelId] = useState(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const dispatch = useDispatch();
  const {
    isSubtask,
    conditions,
    filtered,
    sorting,
    filterdata,
    projectColumnData,
    ProjectTask,
  } = useSelector((store: ProjectRootState) => store?.project);
  // const { taskId, parentTaskId } = useParams();
  const { projectId, taskId } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const [page, setPage] = useState(0);
  const [disable, setDisabled] = useState(false);
  const [list, setList] = useState([]);
  const [updatedText, setUpdatedText] = useState("");
  const [editAble, setEditAble] = useState(false);
  const [listId, setListId] = useState<string | null>();
  const [editId, setEditId] = useState(null);
  const [EditIndex, setEDitIndex] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [showData1, setShowData1] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);

  const [isManualScroll, setIsManualScroll] = useState(false);
  const [onTitleHover, setOnTitleHover] = useState(null);
  const [showSubTaskInlineAddForm, setShowSubTaskInlineAddForm] =
    useState(null);
  const [showTaskInlineAddForm, setShowTaskInlineAddForm] = useState(false);
  const handleRowClick = (index) => {
    setExpandedRow(expandedRow == index ? null : index);
  };
  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = false,
    drag = false,
    search = "",
    filter = null,
  }) => {
    const payload: any = {
      start: 0,
      limit: -1,
      search: search,
      project_id: project_id as string,
      // task_start: task_start,
      // task_limit: 20,
      task_start: task_start,
      task_limit: 20,
      project_column_id: columnid,
      is_filter:
        filterdata.key != null || sorting.length > 0 || conditions.length > 0
          ? 1
          : 0,
      group: {
        key: filterdata.key || null,
        order: 0,
      },
      sort: sorting.length > 0 ? sorting : [],
      filter: conditions.length > 0 ? conditions : [],
      is_view: 2,
      is_filter_save: 0,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      // setColumnList(res?.payload?.data?.data?.list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const navigate = useNavigate();
  const handleShowTable = () => {
    setShowData(!showData);
    setShowData1(!showData1);
  };
  const toggleEditModal = () => {
    setIsOpenAddModal(!isOpenAddModal);
  };
  const theme: Theme = useTheme();
  /** Menu states */
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

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required.")
      .min(1, "Name is required."),
  });

  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const data = {
        column_id: id,
        data: values,
      };
      setDisabled(true);
      dispatch(projectColumnUpdate(data))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setDisabled(false);
            setOpenEditModal(false);
            toast.success(res?.data?.message);
            listData({ loader: false, drag: false });
            toggleEditModal();
          }
        });
    },
  });

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const handleDelete = () => {
    setDisabled(true);
    dispatch(deleteTask(editId))
      .unwrap()
      .then((res) => {
        if (res?.data?.status == 1) {
          listData({ loader: false, drag: false });
          toast.success(res?.data?.message, {
            duration: 4000,
          });
          setDisabled(false);
          setOpenDeleteModal(false);
          setEditId(null);
        }
      })
      .catch((err) => {
        setDisabled(false);
        setOpenDeleteModal(false);
      });
  };

  useEffect(() => {
    formik.setFieldValue("name", title);
  }, [title]);

  useEffect(() => {
    setList(tasks);
  }, [tasks]);

  const scrollRef = useRef(null);
  const handleScroll = useCallback(
    debounce(() => {
      if (isManualScroll) return;
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const hasMoreData = total_length > 20; // Check if there's more data to fetch
        const totalRecordsFetched = tasks?.length;

        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMoreData) {
          setIsFetching(true);

          const payload = {
            start: 0,
            limit: -1,
            search: "",
            project_id: project_id as string,
            task_start: page + 1,
            project_column_id: id,
            task_limit: 10,
            is_filter: 0,
            group: {},
            sort: [],
            filter: [],
            is_view: 0,
          };

          dispatch(OnScrollprojectColumnList({ payload }));

          setLastScrollTop(scrollTop);
        }
      }
    }, 300),
    [isFetching, tasks, page, isManualScroll]
  );

  const headings = [
    "Title",
    "Assigned  ",
    "Subtask",
    "Due Date",
    "Priority",
    "Action",
  ];
  const userDetails = getUserDetail();

  const handleLabelDelete = (id: any) => {
    //@ts-ignore
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
      listData({});
      formik.setFieldValue("newLabel", "");
    });
    setIsLabelLoading(false);
    setIsOpenDeletedModal(false);
  };

  const isDateBeforeToday = (date) => {
    return date ? moment(date).isBefore(moment(), "day") : false;
  };

  const handleEditTaskTitle = async (labels: []) => {

    const formData = new FormData();

    formData.append("labels", selectedLabels as any);
    formData.append("status", "0");
    formData.append("reminder", "0");
    formData.append("priority", "0");
    formData.append("due_date_time", "0");
    formData.append("agent_ids", "0");
    formData.append("title", updatedText);
    formData.append("task_id", editId);
    try {
      const res = await dispatch(EditTaskAdd(formData));

      dispatch(
        updateProjectColumnList({
          operation: "edit",
          task: res?.payload?.data?.data,
        })
      );
      setEditAble(false);

      setEditId(null);
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
  const elementRef = useRef(null);
  useEffect(() => {
    if (showSubTaskInlineAddForm) {
      setTimeout(() => {
        scrollToBottom(elementRef);
      }, 400);
    }
  }, [showSubTaskInlineAddForm]);
  useEffect(() => {
    scrollToBottom(elementRef);
  }, [projectColumnData, ProjectTask]);

  const scrollToBottom = (elementRef) => {
    if (elementRef?.current) {
      // Get the position of the element relative to the viewport
      const elementPosition = elementRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      const calcelement = elementPosition + 90;
      // Check if the element is below the visible window area (out of view)
      if (calcelement > windowHeight) {
        // Scroll 90px down
        window.scrollBy({
          top: 90,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      {/* {tasks.length != 0 || filterdata.key != 4 && */}

      <Draggable
        draggableId={`column${column?.id?.toString()}`}
        index={index}
        //@ts-ignore
        type="column"
        isDragDisabled={true}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Droppable
              droppableId={`task${column?.id?.toString()}`}
              type="task"
            >
              {(provided, snapshot) => (
                <div
                  //@ts-ignore
                  isDraggingOver={snapshot.isDraggingOver}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className="block gap-20 pt-10 w-full  my-10 bg-white rounded-lg h-fit border-1 border-solid 
                  border-[#D1D7DB] mb-24 "
                  >
                    <div className="flex  flex-col  ">
                      <div className="flex items-center justify-start gap-20 px-[18px] pb-10 ">
                        {!showData1 ? (
                          <DownArrowright onClick={handleShowTable} />
                        ) : (
                          <SortIcon
                            onClick={handleShowTable}
                            className="border-1 w-32 h-32 p-2 rounded-sm"
                          />
                        )}
                        <TruncateTextTitle
                          text={title?.split(",").join(", ")}
                          maxWidth={500}
                        />
                      </div>
                      {showData && (
                        <>
                          <div className=" ">
                            <CommonDragTable
                              headings={[
                                "Title",
                                "Assigned",
                                // "Subtask",
                                "Due Date",
                                "Status",
                                "Priority",
                                "Action",
                              ]}
                              scrollRef={scrollRef}
                              maxHeight={false}
                            >
                              {list &&
                                showData &&
                                list?.length > 0 &&
                                list?.map((row, index1) => {
                                  return (
                                    <Draggable
                                      draggableId={`task${row?.id?.toString()}`}
                                      index={index1}
                                      //@ts-ignore
                                      type="task"
                                      isDragDisabled={false}
                                    >
                                      {(provided, snapshot) => (
                                        <>
                                          {/* @ts-ignore */}
                                          <TableRow
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            //@ts-ignore
                                            {...provided.draggableProps}
                                            //@ts-ignore
                                            isDragging={snapshot.isDragging}
                                            key={index1}
                                            sx={{
                                              paddingRight: "10px !important",
                                              "& td": {
                                                // borderBottom: "1px solid #EDF2F6",
                                                paddingTop: "4px !important",

                                                background:
                                                  onTitleHover === row?.id
                                                    ? "#E7E8E9"
                                                    : "white",

                                                color: "#111827",
                                                fontWeight: "500",
                                                paddingBottom: "4px !important",
                                                borderBottom:
                                                  snapshot.isDragging
                                                    ? "2px solid #4f46e5 "
                                                    : "1px solid #EDF2F6",
                                                fontSize: "1.4rem",
                                              },
                                              "& td:nth-of-type(-n+3)": {
                                                minWidth: 230, // Apply minWidth to the first 4 td elements
                                              },
                                              "& td:nth-last-of-type(-n+3)": {
                                                minWidth: 150,
                                              },
                                            }}
                                            onMouseEnter={() =>
                                              setOnTitleHover(row?.id)
                                            }
                                            onMouseLeave={() =>
                                              setOnTitleHover(null)
                                            }
                                          >
                                            <TableCell
                                              scope="row"
                                              className="font-500  "
                                              style={{
                                                width: "260px",
                                              }} //for making tree like structureom
                                            >
                                              <div className="flex items-center relative  ">
                                                {row?.sub_tasks?.length > 0 &&
                                                  isSubtask && (
                                                    <IconButton
                                                      onClick={() => {
                                                        handleRowClick(index1);
                                                        setShowSubTaskInlineAddForm(
                                                          null
                                                        );
                                                      }}
                                                    >
                                                      {expandedRow ===
                                                        index1 ? (
                                                        <DownArrowBlack />
                                                      ) : (
                                                        <SortIcon className="border-1 w-32 h-32 p-2 rounded-sm" />
                                                      )}
                                                    </IconButton>
                                                  )}

                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    visibility:
                                                      onTitleHover === row?.id
                                                        ? "visible"
                                                        : "hidden",

                                                    opacity:
                                                      onTitleHover === row?.id
                                                        ? 1
                                                        : 0,
                                                    transition:
                                                      "opacity 0.2s ease-in-out", // Smooth transition effect
                                                    zIndex: 99,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    position: "absolute",
                                                    right: -80,
                                                  }}
                                                >
                                                  <Tooltip
                                                    title="Edit Labels"
                                                    enterDelay={100}
                                                    placement="top"
                                                  >
                                                    <div
                                                      className={
                                                        !isSubtask
                                                          ? "mr-10"
                                                          : "mr - 0"
                                                      }
                                                    >
                                                      <AddLableForTask
                                                        handleEditTaskTitle={() => {
                                                          handleEditTaskTitle(
                                                            row?.task_selected_labels
                                                          );
                                                        }}
                                                        project_id={project_id}
                                                        selectedLabels={row?.task_selected_labels?.map(
                                                          (item) =>
                                                            item.label_id
                                                        )}
                                                        setSelectedLabels={
                                                          setSelectedLabels
                                                        }
                                                        onclick={() => {
                                                          setUpdatedText(
                                                            row?.title
                                                          );
                                                          setEditId(row?.id);
                                                        }}
                                                        size={true}
                                                        showSelectedLabels={
                                                          row?.task_selected_labels
                                                        }
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
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            // setEDitIndex(index);
                                                            handleRowClick(
                                                              null
                                                            );
                                                            if (
                                                              showSubTaskInlineAddForm >=
                                                              0 &&
                                                              showSubTaskInlineAddForm ==
                                                              row.id
                                                            ) {
                                                              setShowSubTaskInlineAddForm(
                                                                null
                                                              );
                                                              setEDitIndex(
                                                                null
                                                              );
                                                            } else {
                                                              setShowSubTaskInlineAddForm(
                                                                row?.id
                                                              );
                                                              setEDitIndex(
                                                                index1
                                                              );
                                                            }

                                                            if (
                                                              EditIndex >= 0 &&
                                                              EditIndex ==
                                                              index1
                                                            ) {
                                                              setShowSubTaskInlineAddForm(
                                                                null
                                                              );
                                                              setEDitIndex(
                                                                null
                                                              );
                                                            } else {
                                                              setShowSubTaskInlineAddForm(
                                                                row?.id
                                                              );
                                                              setEDitIndex(
                                                                index1
                                                              );
                                                            }
                                                          }}
                                                        >
                                                          <PlusIcon
                                                            color={"#757982"} // Change color when disabled
                                                            className={`h-16 w-16`} //
                                                          />
                                                        </div>
                                                      </IconButton>
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
                                                            setEditAble(
                                                              !editAble
                                                            );
                                                            setEditId(row?.id);
                                                          }}
                                                          className="h-16 w-16"
                                                        />
                                                      </div>
                                                    </IconButton>
                                                  </Tooltip>
                                                </Box>
                                                <div
                                                  className={`flex items-center text-[#111827] text-[14px] font-500 gap-10 
                                                    ${!isSubtask || !(row?.sub_tasks?.length > 0) ? "pl-[20px]" : "pl-0"} `}
                                                >
                                                  <div
                                                    className="text-[#111827] font-500 flex items-center gap-10  "
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      e.preventDefault();
                                                    }}
                                                  >
                                                    <span
                                                      onClick={(e) => {
                                                        const clientId =
                                                          getClientId();
                                                        setIsOpenAddModal(true);
                                                        e.stopPropagation();
                                                        setEditId(row?.id);
                                                        setIsEdit(true);
                                                        // if (!editAble) {
                                                        //   navigate(
                                                        //     `/${project_id}/tasks/detail/${row?.id}${clientId ? `?ci=${clientId}` : ""}`
                                                        //   );
                                                        // }
                                                      }}
                                                    >
                                                      <TruncateText
                                                        editAble={editAble}
                                                        setEditable={
                                                          setEditAble
                                                        }
                                                        setUpdatedText={
                                                          setUpdatedText
                                                        }
                                                        updatedText={
                                                          updatedText
                                                        }
                                                        handleEditSubmit={
                                                          handleEditTaskTitle
                                                        }
                                                        editId={editId}
                                                        id={row?.id}
                                                        text={row?.title}
                                                        maxWidth={
                                                          row
                                                            ?.task_selected_labels
                                                            ?.length == 0
                                                            ? 300
                                                            : 200
                                                        }
                                                        style={{
                                                          paddingLeft:
                                                            "20px !important",
                                                        }}
                                                        taskList={list}
                                                        setTaskList={setList}
                                                        listData={listData}
                                                      />
                                                    </span>
                                                    <div className="flex items-center gap-10">
                                                      {row?.sub_tasks?.length >
                                                        0 &&
                                                        isSubtask && (
                                                          <SubTaskIcon />
                                                        )}
                                                      {row?.sub_tasks?.length >
                                                        0 && isSubtask
                                                        ? row?.sub_tasks?.length
                                                          .toString()
                                                          .padStart(2, "0")
                                                        : ""}
                                                    </div>
                                                    <div className="flex gap-6 ">
                                                      {row?.task_selected_labels
                                                        ?.length !== 0 &&
                                                        row?.task_selected_labels
                                                          ?.slice(0, 1)
                                                          ?.map(
                                                            (row1, index) => {
                                                              return (
                                                                <div
                                                                  key={
                                                                    row1.label_id
                                                                  }
                                                                  className="text-secondary bg-[#EDEDFC] whitespace-nowrap 
                                                                  overflow-hidden 
                                                                  text-ellipsis px-5 rounded-[6px] text-[12px] font-400 py-5 "
                                                                >
                                                                  <Tooltip
                                                                    title={
                                                                      row1?.label
                                                                    }
                                                                  >
                                                                    <Typography className="truncate">
                                                                      {
                                                                        row1?.label
                                                                      }
                                                                    </Typography>
                                                                  </Tooltip>
                                                                </div>
                                                              );
                                                            }
                                                          )}

                                                      {row?.task_selected_labels
                                                        ?.length > 1 && (
                                                          <>
                                                            <IconButton
                                                              className="text-secondary bg-[#EDEDFC] rounded-[6px] 
                                                            whitespace-nowrap px-5 relative text-[12px] font-400 py-5"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClick(
                                                                  e,
                                                                  row?.id
                                                                );
                                                              }}
                                                            >
                                                              +
                                                              {row
                                                                ?.task_selected_labels
                                                                ?.length - 1}
                                                            </IconButton>

                                                            <Menu
                                                              anchorEl={anchorEl}
                                                              open={
                                                                Boolean(
                                                                  anchorEl
                                                                ) &&
                                                                showLabel &&
                                                                row?.id ===
                                                                labelId
                                                              }
                                                              onClose={
                                                                handleClose
                                                              }
                                                              PaperProps={{
                                                                style: {
                                                                  maxHeight: 161,
                                                                  width: 220,
                                                                  cursor: "",
                                                                },
                                                              }}
                                                              className="flex flex-wrap"
                                                            >
                                                              {row?.task_selected_labels
                                                                .slice(1)
                                                                .map(
                                                                  (
                                                                    row1,
                                                                    index
                                                                  ) => (
                                                                    <MenuItem
                                                                      key={index}
                                                                    >
                                                                      <div
                                                                        className="flex items-center bg-[#EDEDFC] gap-10 hover:!bg-[#EDEDFC]
                                                                     w-fit flex-wrap rounded-[4px] px-10 cursor-default"
                                                                      >
                                                                        <div className="text-[#757982] whitespace-nowrap ">
                                                                          {
                                                                            row1?.label
                                                                          }
                                                                        </div>
                                                                        <IconButton
                                                                          onClick={() => {
                                                                            setIsOpenDeletedModal(
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
                                                                  )
                                                                )}
                                                            </Menu>
                                                          </>
                                                        )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </TableCell>

                                            <TableCell
                                              align="center"
                                              className="whitespace-nowrap font-500 min-w-[200px]"
                                              style={{
                                                // paddingLeft: "20px",
                                                width: "250px",
                                              }}
                                            >
                                              <>
                                                {row?.assigned_task_users
                                                  ?.length ? (
                                                  <div className="flex justify-center ">
                                                    {row?.assigned_task_users
                                                      ?.slice(0, 3)
                                                      ?.map((item, idx) => (
                                                        <img
                                                          className={`h-[30px] w-[30px] rounded-full border-2 border-white ${row
                                                            ?.assigned_task_users
                                                            ?.length > 1
                                                            ? "ml-[-10px]"
                                                            : ""
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
                                                    {row?.assigned_task_users
                                                      ?.length -
                                                      3 >
                                                      0 && (
                                                        <div
                                                          className="ml-[-10px] z-0 h-[34px] w-[34px] rounded-full border-2 border-[#4f46e5]
                                                   bg-[#4f46e5] flex items-center justify-center text-xs text-white"
                                                        >
                                                          +
                                                          {row
                                                            ?.assigned_task_users
                                                            ?.length - 3}
                                                        </div>
                                                      )}
                                                  </div>
                                                ) : (
                                                  "N/A"
                                                )}
                                              </>
                                            </TableCell>

                                            <TableCell
                                              style={{
                                                // paddingLeft: "20px",
                                                width: "250px",
                                              }}
                                              align="center"
                                              className="whitespace-nowrap font-500"
                                            >
                                              {isDateBeforeToday(
                                                row?.due_date_time
                                              ) ? (
                                                <Tooltip
                                                  title={
                                                    "This task is overdue "
                                                  }
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
                                                  <Typography
                                                    color="#F44336"
                                                    className="text-[14px] font-500 ml-10 "
                                                  >
                                                    {!row?.due_date_time
                                                      ? "N/A"
                                                      : moment(
                                                        row?.due_date_time
                                                      ).format("ll")}
                                                  </Typography>
                                                </Tooltip>
                                              ) : (
                                                <Typography className="text-[14px] font-500 ml-10 ">
                                                  {!row?.due_date_time
                                                    ? "N/A"
                                                    : moment(
                                                      row?.due_date_time
                                                    ).format("ll")}
                                                </Typography>
                                              )}
                                            </TableCell>

                                            <TableCell
                                              style={{
                                                // paddingLeft: "20px",
                                                width: "250px",
                                              }}
                                              align="center"
                                              className="whitespace-nowrap font-500"
                                            >
                                              {row.status_name}
                                            </TableCell>

                                            <TableCell
                                              style={{
                                                // paddingLeft: "20px",
                                                width: "250px",
                                              }}
                                              align="center"
                                              className="whitespace-nowrap font-500"
                                            >
                                              {row?.priority === null ||
                                                row?.priority === "null" ||
                                                row?.priority === "" ? (
                                                "N/A"
                                              ) : (
                                                <div className="w-full flex items-center justify-center">
                                                  <span
                                                    className={`${row?.priority === "Medium"
                                                      ? "bg-priorityMedium/[.18]"
                                                      : row?.priority ===
                                                        "High"
                                                        ? "bg-red/[.18]"
                                                        : "bg-green/[.18]"
                                                      } py-5 px-10 rounded-[27px] block text-[12px] font-medium ${row?.priority === "Medium"
                                                        ? "text-priorityMedium"
                                                        : row?.priority ===
                                                          "High"
                                                          ? "text-red"
                                                          : "text-green"
                                                      } !min-w-[69px] w-[70px]`}
                                                  >
                                                    {row?.priority}
                                                  </span>
                                                </div>
                                              )}
                                            </TableCell>

                                            <TableCell
                                              align="left"
                                              className="w-[1%] font-500"
                                            >
                                              <div className="flex gap-20 px-10">
                                                {/* {userDetails?.role_id != 3 && ( */}
                                                <span
                                                  className="p-2 cursor-pointer"
                                                  onClick={(e) => {
                                                    handleClose();
                                                    toggleDeleteModal();
                                                    setEditId(row?.id);
                                                    e.stopPropagation();
                                                  }}
                                                >
                                                  <DeleteIcon color={"red"} />
                                                </span>
                                                {/* )} */}
                                                {/* {userDetails?.role_id != 3 && ( */}
                                                <span
                                                  className="p-2 cursor-pointer"
                                                  onClick={(e) => {
                                                    handleClose();
                                                    toggleEditModal();
                                                    e.stopPropagation();
                                                    setEditId(row?.id);
                                                    setIsEdit(true);
                                                  }}
                                                >
                                                  <EditIcon />
                                                </span>
                                                {/* )} */}

                                                {/* <span
                                                  className="p-2 cursor-pointer"
                                                  onClick={(e) => {
                                                    const clientId =
                                                      getClientId();
                                                    event.preventDefault();
                                                    e.stopPropagation();
                                                    navigate(
                                                      `/${project_id}/tasks/detail/${row?.id}${clientId ? `?ci=${clientId}` : ""}`
                                                    );
                                                  }}
                                                >
                                                  <ArrowRightCircleIcon />
                                                </span> */}
                                              </div>
                                            </TableCell>
                                          </TableRow>

                                          {isSubtask &&
                                            expandedRow === index1 && (
                                              <ProjectListSubTaskData
                                                subTasks={row?.sub_tasks}
                                                callListApi={listData}
                                                projectid={row?.id}
                                                parent_id={row?.id}
                                                ColumnId={id}
                                                tab={2}
                                                setAllSubTask={setList}
                                                handleCompleteTask={handleCompleteTask}
                                              />
                                            )}

                                          {row?.id ==
                                            showSubTaskInlineAddForm &&
                                            isSubtask &&
                                            EditIndex == index1 && (
                                              <TableRow>
                                                <TableCell colSpan={6}>
                                                  {/* //add subtask or task */}
                                                  <TodoInlineSubTask
                                                    parentId={row?.id}
                                                    ColumnId={id}
                                                    project_id={project_id}
                                                    setShowInLineAddForm={
                                                      setShowSubTaskInlineAddForm
                                                    }
                                                    scrollToBottom={
                                                      scrollToBottom
                                                    }
                                                    elementRef={elementRef}
                                                    column_ids={column_ids}
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            )}
                                        </>
                                      )}
                                    </Draggable>
                                  );
                                })}

                              {showTaskInlineAddForm && (
                                <TableRow>
                                  <TableCell colSpan={6}>
                                    <TodoInlineSubTask
                                      parentId={null}
                                      ColumnId={id}
                                      project_id={project_id}
                                      setShowInLineAddForm={
                                        setShowTaskInlineAddForm
                                      }
                                      scrollToBottom={scrollToBottom}
                                      column_ids={column_ids}
                                      elementRef={elementRef}
                                    />
                                  </TableCell>
                                </TableRow>
                              )}
                            </CommonDragTable>

                            {/* {userDetails?.role_id != 3 && ( */}
                            {/* // <div className=" border-1 border-solid border-[#D1D7DB]"> */}
                            {!showTaskInlineAddForm && (
                              <div className="pl-[27px]">
                                <Button
                                  variant="text"
                                  color="secondary"
                                  className="h-[40px] sm:text-[16px] flex gap-2 sm:mb-[1rem] leading-none pt-10  pl-[18px]"
                                  aria-label="Manage Sections"
                                  size="large"
                                  startIcon={
                                    <PlusIcon
                                      color={theme.palette.secondary.main}
                                    />
                                  }
                                  onClick={(e) => {
                                    handleClose();
                                    e.stopPropagation();
                                    setShowTaskInlineAddForm(
                                      !showTaskInlineAddForm
                                    );
                                    const timer = setTimeout(() => {
                                      scrollToBottom(elementRef);
                                    }, 400);
                                    return () => clearTimeout(timer);
                                    // scrollToBottom();
                                  }}
                                >
                                  Add Task
                                </Button>
                              </div>
                            )}
                            {/* )} */}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>

      {/* } */}
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
        // <AddTaskModal
        <AddTaskInline
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          ColumnId={editId || id}
          project_id={project_id}
          // callListApi={callListApi}
          Edit={edit}
          name={column?.title}
          column_ids={column_ids}
          tab={2}
        />
      )}
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
}
