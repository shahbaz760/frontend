import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// import MainCard from "./MainCard";
import ListLoading from "@fuse/core/ListLoading";
import { Typography } from "@mui/material";
import {
  projectColumnMove,
  projectTaskMove,
  projectTaskMoveCol,
  updateProjectColumnListDrag,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { NoDataFound } from "public/assets/icons/common";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import transformData from "../../dashboard/dataTransform";
import Todo from "./Todo";

const Container = styled("div")``;

const DragLayout = ({ id, DraglistData, handleCompleteTask = null }) => {
  const dispatch = useAppDispatch();
  const { searchStatus, filtered, projectColumnId, projectColumnData, filterdata } =
    useSelector((store: ProjectRootState) => store?.project);
  const [starter, setStarter] = useState(transformData(projectColumnData));
  const [draggedState, setDragged] = useState('');
  const userDetails = getUserDetail();
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);


  const a = transformData(projectColumnData);
  useEffect(() => {
    setStarter(transformData(projectColumnData));

  }, [projectColumnData]);

  const moveColumns = async (payload: {
    project_id: string;
    column_ids: any[];
  }) => {
    try {
      const res = await dispatch(projectColumnMove(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveRow = async (payload: {
    project_column_id: number;
    task_ids: any[];
  }) => {
    try {
      const res = await dispatch(projectTaskMove(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveinColumn = async (payload: {
    project_column_id: number;
    task_id: number;
  }) => {
    try {
      const res = await dispatch(projectTaskMoveCol(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDragEnd = async ({ destination, source, draggableId, type }) => {

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const start =
      starter.columns[source.droppableId?.replace(/[a-zA-Z]/g, "").trim()];
    const end =
      starter.columns[destination.droppableId?.replace(/[a-zA-Z]/g, "").trim()];
    if (type === "column") {
      const newOrder = Array.from(starter.columnOrder);
      const oldValue = newOrder[source.index];
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, oldValue);
      // newOrder[source.index] = newOrder[destination.index];
      // newOrder[destination.index] = oldValue;
      // newOrder.splice(source.index, 1);
      // newOrder.splice(
      //   destination.index,
      //   0,
      //   draggableId?.replace(/[a-zA-Z]/g, "").trim()
      // );
      const numberArray = [...new Set(newOrder.map(Number))];
      // const numberArray = newOrder.map(Number);
      setStarter((prevStarter) => ({
        ...prevStarter,
        columnOrder: newOrder,
      }));
      const payload = {
        project_id: id,
        column_ids: numberArray,
      };
      try {
        await moveColumns(payload);
      } catch (error) {
        console.error("Error moving column:", error);
      }
      return;
    }
    if (start === end) {
      const taskIds = Array.from(start.taskIds);
      taskIds.splice(source.index, 1);
      taskIds.splice(
        destination.index,
        0,
        draggableId?.replace(/[a-zA-Z]/g, "").trim()
      );
      const newColumn = {
        ...start,
        showData: false,
        taskIds,
      };
      setStarter((prevStarter) => ({
        ...prevStarter,
        columns: {
          ...prevStarter.columns,
          [newColumn.id]: { ...newColumn },
        },
      }));
      setTimeout(() => {
        setStarter((prevStarter) => ({
          ...prevStarter,
          columns: {
            ...prevStarter.columns,
            [newColumn.id]: { ...newColumn, showData: true },
          },
        }));
      }, 0);
      const numberArray = taskIds.map(Number);
      const newId = Number(start.id);
      const payload = {
        project_column_id: newId,
        task_ids: numberArray,
      };
      try {
        await moveRow(payload);
      } catch (error) {
        console.error("Error moving task:", error);
      }
      return;
    }
    const startTaskIds = Array.from(start.taskIds);
    const endTaskIds = Array.from(end.taskIds);
    startTaskIds.splice(source.index, 1);
    endTaskIds.splice(
      destination.index,
      0,
      draggableId?.replace(/[a-zA-Z]/g, "").trim()
    );
    const newStartColumn = {
      ...start,
      showData: false,
      taskIds: startTaskIds,
    };
    const newEndColumn = {
      ...end,
      showData: false,
      taskIds: endTaskIds,
    };
    const payload = {
      project_column_id: Number(newEndColumn.id),
      task_id: draggableId?.replace(/[a-zA-Z]/g, "").trim(),
      column: filtered == 1 && end?.column ? `${end?.column}` : "",
    };
    setDragged(draggableId?.replace(/[a-zA-Z]/g, "").trim());
    if (userDetails?.role_id != 3) {
      setStarter((prevStarter) => ({
        ...prevStarter,
        columns: {
          ...prevStarter.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      }));
      setTimeout(() => {
        setStarter((prevStarter) => ({
          ...prevStarter,
          columns: {
            ...prevStarter.columns,
            [newStartColumn.id]: { ...newStartColumn, showData: true },
            [newEndColumn.id]: { ...newEndColumn, showData: true },
          },
        }));
      }, 0);
    }
    try {
      const res = await dispatch(projectTaskMoveCol(payload));
      DraglistData({ drag: false, loader: false });
      // dispatch(
      //   updateProjectColumnListDrag({
      //     task: res?.payload?.data?.data,
      //     draggableId: res?.payload?.data?.data?.project_column_id,
      //     dropableId: payload?.project_column_id,
      //   })
      // );
      // callListApi({ loader: false, drag: false });
      //@ts-ignore
      if (res?.payload?.data?.status == 0) {
        // toast.error(res?.payload?.data?.message);
      } else {
        if (userDetails?.role_id == 3) {
          setDragged("");
          setStarter((prevStarter) => ({
            ...prevStarter,
            columns: {
              ...prevStarter.columns,
              [newStartColumn.id]: { ...newStartColumn },
              [newEndColumn.id]: { ...newEndColumn },
            },
          }));
          setTimeout(() => {
            setStarter((prevStarter) => ({
              ...prevStarter,
              columns: {
                ...prevStarter.columns,
                [newStartColumn.id]: { ...newStartColumn, showData: true },
                [newEndColumn.id]: { ...newEndColumn, showData: true },
              },
            }));
          }, 0);
        }
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };


  const onDragUpdate = (update) => {
    const { source } = update;
    if (source) {
      setHoveredRowIndex(source.index);
    } else {
      setHoveredRowIndex(null);
    }
  };


  const handleShowData = (id, data) => {
    setStarter((prevStarter) => ({
      ...prevStarter,
      columns: {
        ...prevStarter.columns,
        [id]: { ...prevStarter.columns[id], showData: data },
      },
    }));
  }

  if (searchStatus == "loading") {
    return <ListLoading />;
  }

  return (
    <>
      {projectColumnData?.length == 0 && searchStatus != "loading" && <div
        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40 w-full"
        style={{ alignItems: "center" }}
      >
        <NoDataFound />
        <Typography className="text-[24px] text-center font-600 leading-normal">
          No data found!
        </Typography>
      </div>}
      {projectColumnData?.length > 0 && searchStatus != "loading" &&
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} >
          <Droppable droppableId="all-column" type="column" direction="vertical">
            {(provided, snapshot) => (
              <Container
                //@ts-ignore
                isDraggingOver={snapshot.isDraggingOver}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {starter.columnOrder.map((columnId, index) => {
                  const column = starter.columns[columnId];

                  const tasks = column?.taskIds?.map(
                    (taskId) => starter?.tasks[taskId]
                  );
                  const firstTaskId = Object.keys(starter.tasks)[0];
                  const project_id = starter?.tasks[firstTaskId]?.project_id;

                  if (filterdata?.key == 4 && tasks?.length == 0) {
                    return <></>
                  } else

                    return (

                      (column.defalut_name === "To Do" || (column.defalut_name !== "Completed" && tasks?.length > 0)) && (
                        <Todo
                          index={index}
                          key={column?.id}
                          title={column.title}
                          column={column}
                          showData={column.showData}
                          setShowData={(data: boolean) => handleShowData(column?.id, data)}
                          tasks={tasks}
                          id={column?.id}
                          project_id={id}
                          draggedId={draggedState}
                          column_ids={column?.column}
                          hoveredRowIndex={hoveredRowIndex}
                          total_length={column?.total_length}
                          handleCompleteTask={handleCompleteTask}
                        // name={column?.name}
                        />)

                    );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>}
    </>
  );
};

export default DragLayout;
