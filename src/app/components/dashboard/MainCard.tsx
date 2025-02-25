import { Button, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import {
  OnScrollprojectColumnList,
  deleteColumn,
  projectColumnUpdate,
  updateProjectColumn,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useFormik } from "formik";
import { debounce } from "lodash";
import {
  DragIcon,
  PlusIcon,
  ThreeDotsIcon,
} from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import * as Yup from "yup";
import ActionModal from "../ActionModal";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import AddProjectCardInLine from "../projects/AddProjectCardInLine";
import AddTaskModal from "../tasks/AddTask";
import ItemCard from "./ItemCard";
import { list } from "postcss";

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
  column?: any;
  is_defalut?: any;
  column_ids?: any;
  defalut_name?: any;
  draggedId?: any;
  total_length?: any;
  is_private?: any;
  agentMenuData?: any;
};

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

export default function MainCard({
  title,
  isEmpty,
  id,
  dataList,
  dataListLength,
  tasks,
  project_id,
  key,
  index,
  column,
  is_defalut,
  draggedId,
  column_ids,
  defalut_name,
  total_length,
  agentMenuData,
}: MainCardType) {
  const taskContainerRef = useRef(null);
  const [showInLineAddForm, setShowInLineAddForm] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(title);
  const [page, setPage] = useState(0);

  const toggleEditModal = () => {
    if (openEditModal) {
      formik.setFieldValue("name", originalTitle);
    } else {
      setOriginalTitle(formik.values.name);
    }
    setOpenEditModal(!openEditModal);
  };

  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [scrolledDivId, setScrolledDivId] = useState(null);
  const [checkedId, setCheckedId] = useState("");
  const [disable, setDisabled] = useState(false);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [List, setList] = useState([]);
  const userId = getUserDetail();
  const { searchStatus, filtered, projectColumnData, projectList } =
    useSelector((store: ProjectRootState) => store?.project);

  const [selectedAgent, setSelectedAgent] = useState<string>("agent");
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

  /** Menu states */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userDetails = getUserDetail();
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required.")
      .min(1, "Name is required."),
  });
  // alert(is_defalut);
  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        column_id: id,
        data: values,
      };
      setDisabled(true);
      await dispatch(projectColumnUpdate(data))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setDisabled(false);
            setOpenEditModal(false);
            toast.success(res?.data?.message);

            dispatch(
              updateProjectColumn({
                operation: "edit",
                task: res?.data?.data,
              })
            );
            toggleEditModal();
          }
        });
    },
  });

  const handleDelete = async () => {
    if (id) {
      setDisabled(true);
      const res = await dispatch(deleteColumn(id));
      // dispatch(updateProjectBoardListMove(res?.payload?.data?.data));
      dispatch(
        updateProjectColumn({
          operation: "delete",
          task: res?.payload?.data?.data,
        })
      );

      toast.success(res?.payload?.data?.message, {
        duration: 4000,
      });
      setDisabled(false);
      setOpenDeleteModal(false);
    }
  };

  const handleEdit = () => {
    formik.handleSubmit();
  };

  useEffect(() => {
    formik.setFieldValue("name", title);
  }, [title]);

  const draggedByCheck = (dragdId) => {
    setCheckedId(dragdId);
  };

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
        const totalRecordsFetched = total_length - tasks.length;
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMoreData &&
          totalRecordsFetched > 0
        ) {
          setIsFetching(true);
          const payload = {
            start: 0,
            limit: -1,
            search: "",
            project_id: project_id as string,
            task_start: page + 1,
            project_column_id: id,
            task_limit: 20,
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

  // Effect to attach scroll event listener when component mounts
  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // const scrollToBottom = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo({
  //       top: scrollRef.current.scrollHeight,
  //       behavior: "smooth", // Smooth scrolling
  //     });
  //   }
  // };
  useEffect(() => {
    if (showInLineAddForm) {
      scrollToBottom();
    }
  }, [showInLineAddForm]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setIsManualScroll(true); // Set flag to true before scrolling manually

      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      // Reset the manual scroll flag after the scroll finishes
      const timer = setTimeout(() => {
        setIsManualScroll(false); // Reset the flag
      }, 500); // Delay of 500ms (adjust this based on the scroll time)
      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      <Draggable
        draggableId={`column${column?.id?.toString()}`}
        index={index}
        isDragDisabled={filtered == 1 ? true : false}
      >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div className="min-w-[322px] bg-white p-14 rounded-lg shadow-md w-[322px] ml-5 mr-10">
              {/* Header with dragHandleProps */}
              <div
                className="flex justify-between"
                {...provided.dragHandleProps}
              >
                <Typography
                  className="text-[18px] font-semibold mb-5"
                  color="primary.main"
                  style={{ wordBreak: "break-word" }}
                >
                  <TruncateText
                    text={column?.title?.split(",")?.join(", ")}
                    maxWidth={235}
                  />
                </Typography>

                <div className="flex gap-10">
                  {filtered != 1 && <DragIcon className="cursor-pointer" />}
                  {is_defalut != 1 && filtered != 1 && (
                    <>
                      <span
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(e);
                        }}
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
                          Edit Column
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            toggleDeleteModal();
                          }}
                        >
                          Delete Column
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  {is_defalut == 1 && filtered != 1 && (
                    <>
                      <span
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(e);
                        }}
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
                          Edit Column
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </div>
              </div>

              {/* Tasks */}
              <Droppable
                droppableId={`task${column?.id?.toString()}`}
                type="task"
              >
                {(provided, snapshot) => (
                  <div
                    //@ts-ignore
                    isDraggingOver={snapshot.isDraggingOver}
                    ref={provided.innerRef}
                  >
                    <div
                      className="tasksScroll max-h-[calc(100vh-443px)] overflow-auto mb-16"
                      ref={scrollRef}
                    >
                      <div className="pb-20 pt-10 flex flex-col gap-14">
                        {tasks?.length === 0 ? (
                          showInLineAddForm ? (
                            <AddProjectCardInLine
                              project_id={project_id}
                              ColumnId={id}
                              setShowInLineAddForm={setShowInLineAddForm}
                              name={column?.title}
                              scrollToBottom={scrollToBottom}
                              column_ids={column_ids}
                              state={showInLineAddForm}
                            />
                          ) : (
                            <div className="flex justify-center">
                              <Typography className="text-[14px] text-[#757982] text-center my-5">
                                You don't have any tasks yet
                              </Typography>
                            </div>
                          )
                        ) : (
                          <>
                            {List?.map((item, index) => (
                              <ItemCard
                                id={item?.id}
                                title={item?.title}
                                priority={item?.priority}
                                taskName={item?.description}
                                date={item?.due_date_time}
                                isChecked={item?.isChecked}
                                images={item?.images}
                                index={index}
                                key={item?.id}
                                project_id={project_id}
                                agent={item?.assigned_task_users}
                                is_defalut={is_defalut}
                                total_sub_tasks={item?.total_sub_tasks}
                                draggedByCheck={draggedByCheck}
                                defalut_name={defalut_name}
                                isComplete={item?.is_completed}
                                tasks={item?.sub_tasks}
                                setList={setList}
                                agentMenuDatas={agentMenuData}
                              />
                            ))}
                            {showInLineAddForm && (
                              <AddProjectCardInLine
                                project_id={project_id}
                                ColumnId={id}
                                setShowInLineAddForm={setShowInLineAddForm}
                                name={column?.title}
                                scrollToBottom={scrollToBottom}
                                column_ids={column_ids}
                                state={showInLineAddForm}
                              />
                            )}
                          </>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>

              {!showInLineAddForm && tasks?.length === 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  className="h-[40px] text-[16px] flex gap-8 w-full"
                  onClick={() => {
                    setShowInLineAddForm(!showInLineAddForm);
                    scrollToBottom();
                  }}
                  startIcon={<PlusIcon color="white" />}
                >
                  Add Task
                </Button>
              )}
              {List?.length > 0 && !showInLineAddForm && (
                <Button
                  variant="contained"
                  color="secondary"
                  className="h-[40px] text-[16px] font-400 flex gap-8 w-full "
                  size="large"
                  onClick={() => {
                    setShowInLineAddForm(!showInLineAddForm);
                    scrollToBottom();
                  }}
                >
                  <PlusIcon color="white" />
                  Add New
                </Button>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <CommonModal
        modalTitle={"Edit Column"}
        open={openEditModal}
        btnTitle={"Save"}
        onSubmit={handleEdit}
        closeTitle="Cancel"
        handleToggle={toggleEditModal}
        disabled={disable}
      >
        <InputField
          formik={formik}
          name="name"
          label="Column Name"
          placeholder="Enter Column Name"
          autoFocus
        />
      </CommonModal>
      <ActionModal
        modalTitle="Delete Column"
        modalSubTitle="Are you sure you want to delete this column?"
        open={openDeleteModal}
        handleToggle={toggleDeleteModal}
        type="delete"
        onDelete={handleDelete}
        disabled={disable}
        maxWidth="310"
      />
      {isOpenAddModal && (
        <AddTaskModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          ColumnId={id}
          project_id={project_id}
          name={column?.title}
          column_ids={column_ids}
        />
      )}
    </>
  );
}
