import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import ItemCard from "../dashboard/ItemCard";
import MainCard from "../dashboard/MainCard";

// Sample data for items and columns
const initialItems = [
  {
    id: 1,
    title: "Item 1",
    priority: "High",
    description: "Task 1",
    createdAt: "2023-06-01",
    isChecked: false,
    images: [],
  },
  {
    id: 2,
    title: "Item 2",
    priority: "Medium",
    description: "Task 2",
    createdAt: "2023-06-02",
    isChecked: true,
    images: [],
  },
];

const initialColumns = [
  { id: 1, name: "Column 1", project_id: "Project 1", tasks: initialItems },
  { id: 2, name: "Column 2", project_id: "Project 2", tasks: [] },
];

const CombinedDragDrop = ({ moveColumns, callListApi, listData }) => {
  const [tasks, setTasks] = useState(initialItems);
  const [columnList, setColumnList] = useState(initialColumns);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      const reorderedColumns = Array.from(columnList);
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      const payload = {
        project_id: "projectId",
        column_ids: reorderedColumns.map((column) => column.id),
      };

      try {
        setColumnList(reorderedColumns);
        await moveColumns(payload);
      } catch (error) {
        console.error("Error moving column:", error);
      }
    } else {
      const items = Array.from(tasks);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setTasks(items);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="columns" type="COLUMN">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex ${columnList?.length > 0 ? "gap-20" : ""}`}
          >
            {columnList?.map((column, index) => (
              <Draggable
                key={column.id}
                draggableId={column.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <MainCard
                      title={column.name}
                      key={column.id}
                      isEmpty
                      id={column.id}
                      project_id={column.project_id}
                      callListApi={listData}
                      tasks={column.tasks}
                    />
                    <Droppable droppableId={`tasks-${column.id}`} type="TASK">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "10px",
                          }}
                        >
                          {tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    userSelect: "none",
                                  }}
                                >
                                  <ItemCard
                                    id={task.id}
                                    title={task.title}
                                    priority={task.priority}
                                    taskName={task.description}
                                    date={task.createdAt}
                                    isChecked={task.isChecked}
                                    images={task.images}
                                  // callListApi={callListApi}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CombinedDragDrop;
