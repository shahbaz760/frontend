import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import transformData from "./dataTransform";
import MainCard from "./MainCard";
import { GetAssignAgentsInfo } from "app/store/Client";

const Container = styled("div")`
  display: flex;
`;

const DragLayout = ({ id, DraglistData }) => {
  const dispatch = useAppDispatch();
  const {
    searchStatus,
    filtered,
    projectColumnId,
    projectColumnData,
    projectList,
  } = useSelector((store: ProjectRootState) => store?.project);
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [starter, setStarter] = useState(transformData(projectColumnData));
  const userDetails = getUserDetail();
  const userId = getUserDetail();
  const is_private = projectList.find((item) => item.id == id)?.is_private;
  const getLoginedUser = getUserDetail();
  const [draggedState, setDragged] = useState("");
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
      // callListApi(0);
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
      // callListApi(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveinColumn = async (payload: {
    project_column_id: number;
    task_id: number;
    column: "";
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
        const res = await moveColumns(payload);
        DraglistData({ drag: false });
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
        taskIds,
      };

      setStarter((prevStarter) => ({
        ...prevStarter,
        columns: {
          ...prevStarter.columns,
          [newColumn.id]: newColumn,
        },
      }));

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
      taskIds: startTaskIds,
    };
    const newEndColumn = {
      ...end,
      taskIds: endTaskIds,
    };

    const payload = {
      project_column_id:
        filtered == 1 ? Number(projectColumnId) : Number(newEndColumn.id),
      task_id: draggableId?.replace(/[a-zA-Z]/g, "").trim(),
      column: filtered == 1 ? (end?.column).toString() : "",
    };
    setDragged(draggableId?.replace(/[a-zA-Z]/g, "").trim());
    if (userDetails?.role_id == 2) {
      setStarter((prevStarter) => ({
        ...prevStarter,
        columns: {
          ...prevStarter.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      }));
    }
    try {
      const res = await dispatch(projectTaskMoveCol(payload));
      DraglistData({ loader: false, drag: false });
      // dispatch(
      //   updateProjectColumnListDrag({
      //     task: res?.payload?.data?.data,
      //     draggableId: res?.payload?.data?.data?.project_column_id,
      //     dropableId: payload?.project_column_id,
      //   })
      // );

      //@ts-ignore
      if (res?.payload?.data?.status == 0) {
        toast.error(res?.payload?.data?.message);
      } else {
        if (userDetails?.role_id != 2) {
          setDragged("");

          setStarter((prevStarter) => ({
            ...prevStarter,
            columns: {
              ...prevStarter.columns,
              [newStartColumn.id]: newStartColumn,
              [newEndColumn.id]: newEndColumn,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  // useEffect(() => {
  //   dispatch(
  //     GetAssignAgentsInfo({
  //       start: 0,
  //       limit: -1,
  //       search: "",
  //       client_id: userId.role_id == 3 ? id : getLoginedUser?.id,
  //       is_user: 1,
  //       project_id: is_private == 1 ? id : 0,
  //     })
  //   ).then((res) => {
  //     setAgentMenuData(res?.payload?.data?.data?.list);
  //   });
  // }, []);

  if (searchStatus == "loading") {
    return <ListLoading />;
  }
  return (
    <>
      {projectColumnData?.length == 0 && searchStatus != "loading" && (
        <div
          className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40 w-full"
          style={{ alignItems: "center" }}
        >
          <NoDataFound />
          <Typography className="text-[24px] text-center font-600 leading-normal">
            No data found!
          </Typography>
        </div>
      )}
      {projectColumnData?.length > 0 && searchStatus != "loading" && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-column"
            type="column"
            direction="horizontal"
          >
            {(provided, snapshot) => (
              <Container
                //@ts-ignore
                isDraggingOver={snapshot.isDraggingOver}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {starter?.columnOrder?.map((columnId, index) => {
                  const column = starter.columns[columnId];

                  const tasks = column?.taskIds?.map(
                    (taskId) => starter?.tasks[taskId]
                  );
                  const title = column?.title;
                  const firstTaskId = Object.keys(starter.tasks)[0];
                  const project_id = starter?.tasks[firstTaskId]?.project_id;
                  return (
                    <MainCard
                      title={title}
                      index={index}
                      key={column?.id}
                      column={column}
                      tasks={tasks}
                      id={column?.id}
                      project_id={id}
                      is_defalut={column.is_defalut}
                      draggedId={draggedState}
                      defalut_name={column.defalut_name}
                      // is_completed={tasks?.is_completed}
                      column_ids={column?.column}
                      total_length={column?.total_length}
                      agentMenuData={agentMenuData}
                    />
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
};

export default DragLayout;
