import ListLoading from "@fuse/core/ListLoading";
import { MenuItem, Theme, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/styles";
import { CheckedTask, projectColumnList, setIsSubTask } from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { NoDataFound } from "public/assets/icons/common";
import { SubTaskIcon } from "public/assets/icons/projectsIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import FilterPage from "../FilterPage";
import GroupModal from "../GroupModal";
import DragLayout from "./DragLayout";
import toast from "react-hot-toast";

interface TaskList {
  customSelectedTab: number;
}

const ProjectTaskList = (props: TaskList) => {
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    borderRadius: "6px",
    // color: '#757982',
    font: "12px",
    // backgroundColor: "#f6f6f6",
    // '&:hover': {
    //   backgroundColor: "#e0e0e0", // Change this to your desired hover color
    // },
  }));
  const theme: Theme = useTheme();
  const { customSelectedTab } = props;
  const [columnList, setColumnList] = useState<any[]>([]);
  const [showData, setShowData] = useState(true);
  const {
    fetchStatusNew,
    filterdata,
    filtered,
    conditions,
    MainOp,
    sorting,
    isSubtask,
    layoutBasedGroup,
  } = useSelector((store: ProjectRootState) => store?.project);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const handleShowTable = () => {
    setShowData(!showData);
  };

  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = true,
    drag = true,
    search = null,
    applyopMain = "",
    filter = null,
    groupkey = null,
    order = 0,
    sort = [],
    condition = [],
    group = true,
    is_filter_save = 0,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item?.filterConditions?.length > 1
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
      task_start: task_start,
      task_limit: 20,
      project_column_id: columnid,
      is_filter: filter != null ? filter : filtered,
      group: {
        key: groupkey,
        order: order || filterdata?.order,
      },
      sort: sort.length > 0 ? sort : sorting.length > 0 ? sorting : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
      is_view: 2,
      is_filter_save: is_filter_save,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      // setColumnList(res?.payload?.data?.data?.list);
      const updatedList = res?.payload?.data?.data?.list;
      localStorage.setItem(
        "todoColumn",
        res?.payload?.data?.data?.to_do_column_id
      );
      if (columnid != 0) {
        // If columnId is provided, find the column with that id
        const columnObject = updatedList.find((item) => item.id == columnid);
        const columnIndex = columnList.findIndex(
          (column) => column.id == columnid
        );
        if (columnIndex !== -1) {
          // If column is found, update its tasks
          const updatedColumn = {
            ...columnList[columnIndex],
            tasks: columnObject?.tasks,
          };

          // Update the columnList state with the updated column
          setColumnList((prevColumnList) => {
            const updatedColumns = [...prevColumnList];
            const newColumn: any = { ...updatedColumns[columnIndex] };
            newColumn.tasks =
              task_start == 0
                ? [...updatedColumn?.tasks]
                : [
                  ...prevColumnList[columnIndex].tasks,
                  ...updatedColumn?.tasks,
                ];
            updatedColumns[columnIndex] = newColumn;
            return updatedColumns;
          });
        }
      } else {
        // If columnId is 0, update the entire columnList
        setColumnList(updatedList);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCompleteTask = (id) => {
    if (id) {
      dispatch(CheckedTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            listData({
              loader: false,
              drag: false,

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


    }
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem(`columnOrder-${id}`);
    if (savedOrder) {
      setColumnList(JSON.parse(savedOrder));
    } else {
      listData({});
    }
  }, [id]);

  if (fetchStatusNew == "loading") {
    return <ListLoading />;
  }

  const handleHideSubTask = async () => {
    await dispatch(setIsSubTask(!isSubtask));
  };

  return (
    <>
      {customSelectedTab && (
        <div className="px-[15px]">
          {/* <div className="shadow-md bg-white rounded-lg">
            <FilterPage listData={listData} showSubtask={true} />

            
          </div> */}
          <div className="shadow-md bg-white rounded-lg mb-20 ">
            <FilterPage
              // listData={listData}
              group={false}
              showSubtask={false}
              tab={2}
            />

            <div className=" pb-10 flex gap-12 flex-wrap px-[15px] ">
              <GroupModal listData={listData} />

              <StyledMenuItem
                onClick={handleHideSubTask}
                className={`w-auto justify-between text-[12px] ${isSubtask ? "bg-[#EDEDFC] text-[#4F46E5] " : "bg-[#F6F6F6] text-[#757982] "}`}
              >
                <SubTaskIcon fill={isSubtask ? "#4F46E5" : "#757982"} />
                &nbsp;&nbsp; Subtasks: {isSubtask ? "Shown" : "Hidden"}
              </StyledMenuItem>
            </div>
          </div>

          {fetchStatusNew == "loading" ? (
            <ListLoading />
          ) : layoutBasedGroup == "loading" ? (
            <ListLoading />
          ) : (
            <>
              {columnList?.length == 0 && fetchStatusNew == "loading" ? (
                <div
                  className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                  style={{ alignItems: "center" }}
                >
                  <NoDataFound />
                  <Typography className="text-[24px] text-center font-600 leading-normal">
                    No data found!
                  </Typography>
                </div>
              ) : (
                <DragLayout
                  // columnList={columnList}
                  DraglistData={listData}
                  id={id}
                  handleCompleteTask={handleCompleteTask}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectTaskList;
function useQuery(): { query: any } {
  throw new Error("Function not implemented.");
}
