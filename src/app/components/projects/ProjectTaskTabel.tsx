import { Button, MenuItem, Theme, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { SubTaskIcon } from "public/assets/icons/projectsIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import AddTaskModal from "src/app/components/tasks/AddTask";
import RecentData from "src/app/components/tasks/RecentData";
import ListLoading from "@fuse/core/ListLoading";
import { styled } from "@mui/styles";
import {
  AgentPaginationActivity,
  AgentRecentActivity,
  CheckedTask,
  projectColumnList,
  projectTaskTableList,
  setIsSubTask,
  TaskListColumn,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getClientId, getUserDetail, listData } from "src/utils";
import ThemePageTable from "../tasks/TaskPageTable";
import FilterPage from "./FilterPage";
import GroupModal from "./GroupModal";
import DragLayout from "./ProjectTaskList/DragLayout";
import { bottom } from "@popperjs/core";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  scrollRef?: any;
}
interface ProjectTaskTableProps {
  customSelectedTab: number;
  // Add any other props your component expects here
}

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
        className="text-[18px]  mb-5 "
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
function a11yProps(index: number) {
  return {
    className:
      "px-4 py-6 min-w-0 min-h-0 text-[1.8rem] font-400 text-[#757982]",
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProjectTaskTabel(props: ProjectTaskTableProps) {
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    borderRadius: "6px",

    font: "12px",
  }));
  const { id, uuid, name, subuuid } = useParams<{
    id: string;
    uuid?: string;
    name: string;
    subuuid?: string;
  }>();
  const scrollRef = useRef(null);
  const theme: Theme = useTheme();
  const [page, setPage] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const dispatch = useAppDispatch();
  const userDetails = getUserDetail();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activityData, setActivityData] = useState<object>({
    project_id: id,
    start: 0,
    limit: 10,
  });
  const [isDefault, setIsDefault] = useState();
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [columnId, setcolumnId] = useState();
  const [totaltask, setTotalTask] = useState(0);
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [columnList, setColumnList] = useState<any[]>([]);
  const [showDragLayout, setShowDragLayout] = useState(false);

  const {
    projectInfo,
    filterdata,
    filtered,
    conditions,
    MainOp,
    isSubtask,
    fetchTask,
    ProjectTask,
    total_records,
    sorting,
    layoutBasedGroup,
  } = useSelector((store: ProjectRootState) => store?.project);
  const [tableSelectedItemDesign, setTableSelectedItemDesign] =
    useState<object>();
  const clientId = getClientId();
  const navigate = useNavigate();
  const getTabIndexFromSubtype = (subtype) => {
    let indexOfItem = projectInfo?.list?.findIndex(
      (item) => item.id == subtype
    );
    return indexOfItem || 0;
  };
  const params = new URLSearchParams(location.search);
  const subtype = params.get("subtype") || "ttrtrt";
  const [selectedTab, setSelectedTab] = useState(
    getTabIndexFromSubtype(subuuid)
  );
  // Helper function to get the subtype from the tab index
  const getSubtypeFromTabIndex = (index) => {
    return projectInfo?.list[index].id;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // const subtype = params.get("subtype") || "to-do";
    let selectedItemIndex = getTabIndexFromSubtype(subuuid);
    setSelectedTab(selectedItemIndex);
  }, [location.search, params]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    const newSubtype = getSubtypeFromTabIndex(newValue);
    const params = new URLSearchParams(location.search);
    const clientId = getClientId();
    navigate(
      `/projects/${id}/${name}/${uuid}/${newSubtype}${clientId ? `?clientId=${clientId}` : ""}`
    );
    navigate(`${location.pathname}?${params.toString()}`);
  };
  const MainlistData = async ({
    task_start = 0,
    columnid = 0,
    loader = true,
    search = "",
    filter = null,
    groupkey = null,
    is_view = 1,
    order = 0,
    sort = [],
    condition = [],
    is_filter_save = 0,
    isnavigate = true,
    group = true,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item.filterConditions.length > 1
              ? cond.applyOp == "AND"
                ? "AND"
                : "OR"
              : "",
          key: cond.key, // Assuming you want to keep the key as is
          op: cond.op, // Assuming you want to keep the op as is
          value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
        })),
      }));
    };

    const payload: any = {
      start: 0,
      limit: -1,
      search: search,
      project_id: id as string,
      // task_start: task_start,
      // task_limit: 20,
      // project_column_id: columnid,
      // is_filter: filter != null ? filter : filtered,
      is_filter_save: is_filter_save,
      is_view: 1,
      group: {
        key: groupkey,
        order: order || filterdata?.order,
      },
      sort: sort.length > 0 ? sort : sorting.length > 0 ? sorting : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
    };
    try {
      const res = await dispatch(TaskListColumn({ payload, loader }));
      const clientId = getClientId();
      if (isnavigate) {
        navigate(
          `/projects/${id}/${name}/${uuid}/${res?.payload?.data?.data?.list[0]?.id}${clientId ? `?clientId=${clientId}` : ""}`
        );
        navigate(`${location.pathname}?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleHideSubTask = async () => {
    await dispatch(setIsSubTask(!isSubtask));
  };

  const taskLIstData = async ({
    search = "",
    applyopMain = "",
    filter = null,
    sort = [],
    start = 0,
    condition = [],
    loading = true,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item.filterConditions.length > 1
              ? cond.applyOp == "AND"
                ? "AND"
                : "OR"
              : "",
          key: cond.key, // Assuming you want to keep the key as is
          op: cond.op, // Assuming you want to keep the op as is
          value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
        })),
      }));
    };
    const payload = {
      project_id: id,
      start: start,
      limit: -1,
      search: search,
      type: 0,
      is_filter_save: 0,
      is_view: 1,
      // is_filter: filter != null ? filter : filtered,
      sort: sort.length > 0 ? sort : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
    };
    const taskLists = await dispatch(TaskListColumn({ payload, loading }));
    const task = taskLists?.payload?.data?.data?.list;
  };

  useEffect(() => {
    taskLIstData({});
  }, []);

  useEffect(() => {
    setTaskList(ProjectTask);
  }, [ProjectTask]);

  // const completeid = JSON.parse(localStorage.getItem("completeColumn"));

  const completeid = localStorage.getItem("completeColumn");
  // ? JSON.parse(localStorage.getItem("completeColumn"))
  // : null; // or provide a default value like [] if it's an array

  const allIds = projectInfo?.list?.map((item) => item.id);

  useEffect(() => {
    const clientId = getClientId();
    if (projectInfo?.length > 0) {
      if (completeid && !allIds?.includes(completeid)) {
        // Navigate to the new path if completeid is not in allIds
        navigate(
          `/projects/${id}/${name}/${uuid}/${completeid}${clientId ? `?clientId=${clientId}` : ""}`
        );
        navigate(
          `${location.pathname}?${params.toString()}${clientId ? `?clientId=${clientId}` : ""}`
        );
      } else {
        navigate(
          `/projects/${id}/${name}/${uuid}/${projectInfo?.list[0]?.id}${clientId ? `?clientId=${clientId}` : ""}`
        );
        navigate(
          `${location.pathname}?${params.toString()}${clientId ? `?clientId=${clientId}` : ""}`
        );
      }
    }
  }, [projectInfo]);

  const handleScroll = useCallback(
    debounce(() => {
      if (isManualScroll) return;
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const hasMoreData = total_records > 20; // Check if there's more data to fetch
        const totalRecordsFetched = total_records - ProjectTask.length;
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMoreData &&
          totalRecordsFetched > 0
        ) {
          setIsFetching(true);
          taskLIstData({
            start: 0,
            loading: false,
          }).finally(() => {
            setPage((prevPage) => prevPage + 1);
            setIsFetching(false);
          });
          setLastScrollTop(scrollTop);
        }
      }
    }, 300),
    [isFetching, ProjectTask, page]
  );

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

  const elementRef = useRef(null);

  const scrollToBottom = (elementRef, index = null) => {
    if (elementRef?.current) {
      const elementPosition = elementRef.current.getBoundingClientRect().bottom; // Bottom of the element
      // Check if the element is below the visible area of the window
      const windowHeight = window.innerHeight; // Height of the viewport
      const calculatedHeight = windowHeight - 250;
      const calacHeight = index == 0 ? 50 : 150;
      if (elementPosition > calculatedHeight) {
        if (scrollRef.current) {
          setIsManualScroll(true); // Set flag to true before scrolling
          // Scroll down by 90px only if the scroll height allows it
          scrollRef.current.scrollTo({
            top: Math.min(
              scrollRef.current.scrollTop + calacHeight,
              scrollRef.current.scrollHeight
            ), // Ensuring not to exceed scroll height
            behavior: "smooth",
          });

          const timer = setTimeout(() => {
            setIsManualScroll(false); // Reset the flag after scrolling
          }, 500);

          return () => clearTimeout(timer);
        }
      }
    }
  };

  useEffect(() => {
    if (userDetails.role_id == 2) {
      const payload = {
        project_id: id,
        start: 0,
        limit: 10,
      };
      dispatch(AgentRecentActivity(payload));
    }
  }, []);

  const { agentActivity } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const [listRecentData, setListRecentData] = useState<any>(agentActivity);

  const handleCompleteTask = async (taskid) => {
    if (taskid) {
      try {
        // Dispatch the action and wait for the result
        const res = await dispatch(CheckedTask(taskid)).unwrap();

        // Check the response status
        if (res?.data?.status === 1) {
          toast.success(res?.data?.message, {
            duration: 4000,
          });

          setTimeout(() => {
            toast.dismiss();
          }, 4000);
          if (filterdata.key !== null && showDragLayout) {
            listData({
              project_id: Number(id),
              loader: false,
              drag: false,
              dispatch,
              is_view: 1
            })
          } else {
            taskLIstData({ loading: false });
          }
          const response = await dispatch(
            AgentRecentActivity({ ...activityData, start: 0 })
          );
         
        }
      } catch (error) {
        console.error("Error handling task completion:", error);
      }
    }
  };

  useEffect(() => {
    scrollToBottom(elementRef);
  }, [taskList]);

  useEffect(() => {
    if (filterdata.key !== null) {
      setIsLoading(true);
      setShowDragLayout(false);
      // Delay the rendering by 2 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowDragLayout(true);
      }, 2200);

      // Cleanup timer
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      setShowDragLayout(false); // Ensure that it hides if filterdata.key is null
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2200);

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [filterdata.key]);


  if (fetchTask == "loading") {
    return <ListLoading />;
  }
  return (
    <>
      {props.customSelectedTab && (
        <>
          <div className="px-[15px] flex gap-20 flex-wrap lg:flex-nowrap ">
            <div className="basis-full lg:basis-auto lg:grow w-1/2">
              <div className="shadow-md bg-white rounded-lg mb-20 ">
                <FilterPage
                  group={false}
                  showSubtask={false}
                  tableTask={true}
                  tab={1}
                />

                <div className=" pb-10 flex gap-12 flex-wrap px-[15px] ">
                  <GroupModal listData={MainlistData} />

                  <StyledMenuItem
                    onClick={handleHideSubTask}
                    className={`w-auto justify-between text-[12px] ${!isSubtask ? "bg-[#EDEDFC] text-[#4F46E5] " : "bg-[#F6F6F6] text-[#757982] "}`}
                  >
                    <SubTaskIcon fill={!isSubtask ? "#4F46E5" : "#757982"} />
                    &nbsp;&nbsp; Subtasks: {!isSubtask ? "Shown" : "Hidden"}
                  </StyledMenuItem>
                </div>
              </div>

              <div className="shadow-md bg-white rounded-lg pt-16 pb-20">
                {/* {filterdata?.key == null && (
                  <div className="flex justify-end px-16">
                    <Button
                      variant="text"
                      color="secondary"
                      className="h-[40px] text-[16px] flex gap-8 font-[600] px-20 justify-end  py-20 mb-16"
                      aria-label="Add Tasks"
                      size="large"
                      onClick={() => {
                        setIsOpenAddModal(true);
                      }}
                    >
                      <PlusIcon color={theme.palette.secondary.main} />
                      Add Task
                    </Button>
                  </div>
                )} */}
                {fetchTask == "loading" ? (
                  <ListLoading />
                ) : isLoading ? (
                  <ListLoading />
                ) : (
                  <div
                    className={`h-[calc(100vh-440px)] max-h-[calc(100vh-440px) ${filterdata?.key != null ? "overflow-y-scroll" : ""}`}
                  >
                    {!showDragLayout ? (
                      <ThemePageTable
                        ref={scrollRef}
                        //@ts-ignore
                        taskList={taskList}
                        tableSelectedItemDesign={tableSelectedItemDesign}
                        customSelectedTab={props.customSelectedTab}
                        columnList={columnList}
                        setColumnList={setColumnList}
                        ListData={taskLIstData}
                        project_id={id}
                        ColumnId={columnId}
                        handleCompleteTask={handleCompleteTask}
                        showLoader={fetchTask}
                        isDefault={isDefault}
                        totaltask={totaltask}
                        defalut_name={isDefault}
                        taskLIstData={taskLIstData}
                        scrollToBottom={scrollToBottom}
                        elementRef={elementRef}
                      />
                    ) : (
                      <div className="px-[16px]">
                        {layoutBasedGroup == "idle" && showDragLayout && (
                          <DragLayout id={id} DraglistData={MainlistData} handleCompleteTask={handleCompleteTask} />
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between py-14 px-[3rem]">
                  {/* <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Tasks: ${columnList?.length}`}</Typography> */}
                </div>
                {userDetails.role_id == 1 && (
                  <div className="flex justify-between py-14 px-[3rem]">
                    <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Tasks: ${columnList?.length}`}</Typography>
                  </div>
                )}
              </div>
            </div>
            {/* {userDetails?.role_id == 2 && ( */}
            <div className="basis-full lg:basis-[310px] overflow-y-scroll h-[calc(100vh-235px)]">
              <RecentData
                activityData={activityData}
                setActivityData={setActivityData}
              />
            </div>
            {/* )} */}
          </div>
          {isOpenAddModal && (
            <AddTaskModal
              isOpen={isOpenAddModal}
              setIsOpen={setIsOpenAddModal}
              project_id={id}
              ColumnId={columnId}
            />
          )}
        </>
      )}
    </>
  );
}
