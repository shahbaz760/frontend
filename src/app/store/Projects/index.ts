import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { getUserDetail } from "src/utils";
import {
  initialStateProps,
  NotificaitonList,
  ProjectAdd,
  ProjectAddDoc,
  ProjectUpdate,
  SubscriptionList,
  Taskadd,
} from "./Interface";

/**
 * API calling
 */
// ----*-------project-apis-----

export const projectAdd = createAsyncThunk(
  "project/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/add`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const projectDetail = createAsyncThunk(
  "/project/detail/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/detail/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const projectAddDoc = createAsyncThunk(
  "project/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/add`,
      dispatch,
      method: "post",
      data: { name: payload.name, is_private: 0, assign_users: [] },
      headers: { Authorization: `Bearer ${payload.token}` },
    });
    return {
      data: response.data,
    };
  }
);

export const projectUpdate = createAsyncThunk(
  "project/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/update/${payload.id}`,
      method: "put",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const projectList: any = createAsyncThunk(
  "project/list",
  async (payload: SubscriptionList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/list`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const AccessAccountManagerList: any = createAsyncThunk(
  "auth/get-user-permission",
  async (payload: SubscriptionList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/auth/get-user-permission`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const GetNotificaitonList: any = createAsyncThunk(
  "notification-list",
  async (payload: NotificaitonList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/notification-list`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const MarkNotificationRead: any = createAsyncThunk(
  "notification-list/notification-id",
  async (notificationId: number = 0, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/notification-read/${notificationId}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const GetUnreadNotificationCount: any = createAsyncThunk(
  "notification-list/notification-id",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/notification-count`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const GetUserDashboardData: any = createAsyncThunk(
  "users/task-list",
  async (
    payload: {
      start: number;
      limit: number;
      search?: string;
      type?: number;
      date?: string;
    },
    { dispatch }
  ) => {
    const response = await ApiHelperFunction({
      url: `/users/task-list`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const deleteProject: any = createAsyncThunk(
  "project/delete",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/project/delete",
      method: "delete",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const deleteProjectBoardApi: any = createAsyncThunk(
  "/project-menu/delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project-menu/delete/${payload.uuid}`,
      method: "delete",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const pinProjectBoardApi: any = createAsyncThunk(
  "/project-menu/pin/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project-menu/pin/${payload.uuid}`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

// -----------column-apis-----
//Add column api
export const projectColumnAdd = createAsyncThunk(
  "project/column/add",
  async (payload: ProjectAdd, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/column/add`,
      method: "post",
      dispatch,
      data: payload,
    });
    return {
      data: response.data,
    };
  }
);
export const projectColumnList: any = createAsyncThunk(
  "project/columns/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/columns/list`,
      method: "post",
      dispatch,
      data: payload.payload,
    });
    return {
      data: response.data,
    };
  }
);

export const OnScrollprojectColumnList: any = createAsyncThunk(
  "project/columns/list-scroll",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/columns/list`,
      method: "post",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const projectTaskTableList = createAsyncThunk(
  "project/columns/task-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/columns/list`,
      method: "post",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const TaskAdd = createAsyncThunk(
  "project/task/add",
  async (payload: Taskadd | FormData, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task/add`,
      method: "post",
      data: payload,
      dispatch,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: response.data,
    };
  }
);
export const EditTaskAdd: any = createAsyncThunk(
  "project/task/edit",
  async (payload: Taskadd | FormData, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/task/edit`,
      method: "post",
      data: payload,
      dispatch,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: response.data,
    };
  }
);
export const deleteColumn: any = createAsyncThunk(
  "column/delete",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/column/delete/${payload}`,
      method: "delete",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const TaskDetails: any = createAsyncThunk(
  "project/task-detail/",
  async (payload: any, { dispatch }) => {

    const response = await ApiHelperFunction({
      url: `project/task-detail/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const TaskDetailsSub: any = createAsyncThunk(
  "project/subIntask-detail/",
  async (payload: any, { dispatch }) => {

    const response = await ApiHelperFunction({
      url: `project/task-detail/${payload.ColumnId}`,
      method: "get",
      dispatch,
      data: payload,
    });
    return {
      data: response.data,
    };
  }
);

export const SubTaskDetails: any = createAsyncThunk(
  "/project/sub-task-detail/",
  async (payload: any, { dispatch }) => {

    const response = await ApiHelperFunction({
      url: `project/sub-task-detail/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const TaskDeleteAttachment: any = createAsyncThunk(
  "/project/task/delete-files",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/task/delete-files`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const deleteTask: any = createAsyncThunk(
  "project/task-delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task-delete/${payload}`,
      method: "delete",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const CheckedTask: any = createAsyncThunk(
  "project/complete-task/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/complete-task/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const TaskStatusUpdate: any = createAsyncThunk(
  "project/task/status-update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/task/status-update`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const TaskListColumn: any = createAsyncThunk(
  "TaskListColumn",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task/list`,
      method: "post",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const projectColumnUpdate: any = createAsyncThunk(
  "column/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `column/update/${payload.column_id}`,
      method: "put",
      data: payload.data,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const projectColumnMove: any = createAsyncThunk(
  "project/column-move",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/column-move`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const projectMove: any = createAsyncThunk(
  "project/sorting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/sorting`,
      method: "post",
      dispatch,
      data: payload,
    });
    return {
      data: response.data,
    };
  }
);

export const projectMenu: any = createAsyncThunk(
  "project/menu-sorting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/menu-sorting`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const projectTaskMove: any = createAsyncThunk(
  "project/task/sort",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/task/sort`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const getWhiteBoardList = createAsyncThunk(
  "project/WhiteBoard/list/",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/WhiteBoard/list/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const DeleteWhiteBoard = createAsyncThunk(
  "projectWhiteBoard/delete/",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/WhiteBoard/delete/${id}`,
      method: "delete",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const DeleteDoc = createAsyncThunk(
  "project/document/delete/",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/document/delete/${id}`,
      method: "delete",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const getWhiteBoardData = createAsyncThunk(
  "project/whiteboard/get",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/whiteboard/get/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const getDocList = createAsyncThunk(
  "document/list/",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/document/list/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const getChatBoardData: any = createAsyncThunk(
  "project/assigned-userIds",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/assigned-userIds/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);
export const getChatGroupDetail: any = createAsyncThunk(
  "project/task-group-detail",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task-group-detail/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const addWhiteBoardData: any = createAsyncThunk(
  "project/whiteboard/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/whiteboard/add`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);
export const EditWhiteBoardData: any = createAsyncThunk(
  "project/WhiteBoard/edit",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/WhiteBoard/edit`,
      method: "put",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const getDocBoardData: any = createAsyncThunk(
  "project/document/get",
  async (id: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/document/get/${id}`,
      method: "get",
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const addDocBoardData: any = createAsyncThunk(
  "project/document/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/document/add`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const EditDocBoardData: any = createAsyncThunk(
  "project//document/edit",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/document/edit`,
      method: "put",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);
export const sortWhiteDocBoard: any = createAsyncThunk(
  "project/sort-document-whiteboard",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/sort-document-whiteboard`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const projectTaskMoveCol: any = createAsyncThunk(
  "project/task/move-in-column",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/task/move-in-column`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const projectUpdateMenu: any = createAsyncThunk(
  "project/enable-menu",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/enable-menu`,
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const projectGetMenu: any = createAsyncThunk(
  "project/menu-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/menu-list/${payload?.id}`,
      method: "get",
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);
export const projectMenuUpdate: any = createAsyncThunk(
  "project-menu/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project-menu/update`,
      method: "put",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const GetPaymentLink: any = createAsyncThunk(
  "client/get-subscription-payment-link",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/get-subscription-payment-link/${payload.id}`,
      method: "get",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const AgentRecentActivity = createAsyncThunk(
  "client/agent-recent-activity",
  async (payload: object, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/agent-recent-activity",
      method: "Post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const projectFilteredList: any = createAsyncThunk(
  "project/get-saved-filters",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/get-saved-filters/${payload.project_id}/${payload.is_view}?search=${payload.search}`,
      method: "get",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const deleteFilteredList: any = createAsyncThunk(
  "/project/delete-filters",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/delete-filters/${payload}`,
      method: "delete",
      data: payload.payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const EditFilteredList: any = createAsyncThunk(
  "project/update-filters",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `project/update-filters`,
      method: "put",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const AgentPaginationActivity = createAsyncThunk(
  "client/agent-recent-activity",
  async (payload: object, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/agent-recent-activity",
      method: "Post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  fetchStatus: "loading",
  fetchStatusTask: "loading",
  fetchMenuTask: "loading",
  fetchSubTask: "loading",
  whiteBoardStatus: "loading",
  DocStatus: "loading",
  fetchTask: "loading",
  ProjectTask: [],
  DocList: [],
  actionStatus: false,
  whiteBoardList: [],
  successMsg: "",
  errorMsg: "",
  list: [],
  clientDetail: {},
  selectedColumn: [],
  total_records: 0,
  assignedAgentDetail: [],
  agentTotal_records: 0,
  taskDetailInfo: {},
  projectInfo: {},
  fetchStatusNew: "loading",
  tasktablestatus: "loading",
  filtered: null,
  MainOp: "",
  projectColumnId: "0",
  conditions: [],
  filterdata: {
    key: null,
    order: 0,
  },
  isSubtask: true,
  sorting: [],
  projectDataInfo: [],
  projectList: [],
  agentActivity: [],
  searchStatus: "idle",
  saveFilterListStatus: "idle",
  saveFilterList: [],
  projectBoardList: [],
  projectBoardMainList: [],
  projectBoardAddMoreList: [],
  isBoardListLoading: false,
  projectColumnData: [],
  calenderData: [],
  layoutBasedGroup: "idle",
  totalChatPages: 0,
  Accesslist: {},
  AccessStatus: "idle",
  notificationStatus: "idle",
  notificationList: [],
};
/**
 * The auth slice.
 */
export const projectSlice = createSlice({
  name: "projectSlice",
  initialState,
  reducers: {
    restAll: (state) => {
      state.successMsg = "";
      state.errorMsg = "";
      state.selectedColumn = [];
    },
    setIsSubTask: (state, action) => {
      state.isSubtask = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterdata = action.payload;
    },
    setFilter: (state, action) => {
      state.filtered = action.payload;
    },
    setCondition: (state, action) => {
      state.conditions = action.payload;
    },
    setSortFilter: (state, action) => {
      state.sorting = action.payload;
    },
    setMainOp: (state, action) => {
      state.MainOp = action.payload;
    },
    setprojectColumnId: (state, action) => {
      state.projectColumnId = action.payload;
    },
    updateProjectList: (state, { payload }) => {
      state.projectList = payload;
    },
    upadteMainBoardList: (state, { payload }) => {
      state.projectBoardMainList = payload;
    },
    upadteMoreBoardList: (state, { payload }) => {
      state.projectBoardAddMoreList = payload;
    },
    updateProjectBoardList: (state, { payload }) => {
      state.projectBoardList = payload;
    },
    updateProjectBoardListMove: (state, { payload }) => {
      state.projectBoardList = payload;
    },
    updateProjectColumn: (state, { payload }) => {
      const { operation, task } = payload;
      let prevData = [...state.projectColumnData];
      let newData;

      if (operation == "delete") {
        // For delete operation, filter out the item with matching task.id
        newData = prevData.filter((item) => item.id != task.id);
      } else {
        // For other operations, use map to modify the items
        newData = prevData?.map((item) => {
          if (item.id == task.id) {
            switch (operation) {
              case "edit":
                return {
                  ...item,
                  name: task.name, // Update only the name where task id matches
                };
              default:
                return item;
            }
          }
          return item;
        });
      }

      // Update the state with the new data
      state.projectColumnData = newData;

    },

    updateProjectColumnList: (state, { payload }) => {
      const { operation, task } = payload; // Destructure only the operation and task from the payload
      const prevData = [...state.projectColumnData];
      const newData = prevData?.map((item) => {
        // Check if the current item's ID matches the project_column_id in the task
        if (item?.id == task?.project_column_id) {
          // Perform action based on the operation type
          switch (operation) {
            case "add":
              return {
                ...item,
                tasks: [...item?.tasks, task], // Add new task
              };

            case "edit":
              return {
                ...item,
                tasks: item.tasks.map(
                  (t) => (t.id == task.id ? { ...t, ...task } : t) // Edit task by matching id
                ),
              };
            case "delete":
              return {
                ...item,
                tasks: item.tasks.filter((t) => t.id != task.id), // Delete task by filtering out the matching id
              };
            default:
              return item;
          }
        }
        return item;
      });

      state.projectColumnData = newData;

    },
    updateProjectSubTaskColumnList: (state, { payload }) => {
      const { operation, task } = payload; // Destructure only the operation and task from the payload
      const prevData = state.projectColumnData;
      const newData = prevData.map((item: any) => {
        if (item.id == task?.project_column_id) {
          item.tasks.map((tasksItem) => {
            if (tasksItem.id == task?.parent_task_id) {
              switch (operation) {
                case "add":
                  return {
                    ...item,
                    sub_tasks: [...item?.sub_tasks, task], // Add new task
                  };
                case "edit":
                  return {
                    ...item,
                    sub_tasks: item?.tasks.map(
                      (t) => (t.id == task.id ? { ...t, ...task } : t) // Edit task by matching id
                    ),
                  };
                case "delete":
                  return {
                    ...item,
                    sub_tasks: item.tasks.filter((t) => t.id != task.id), // Delete task by filtering out the matching id
                  };
                default:
                  return item;
              }
            }
          });
          // Perform action based on the operation type
        }
        return item;
      });

      state.projectColumnData = newData;
    },
    updateProjectColumnListDrag: (state, { payload }) => {
      const { task, draggableId, dropableId } = payload;
      let prevData = [...state.projectColumnData];
      let newData = prevData?.map((item) => {
        if (item.id == draggableId) {
          return {
            ...item,
            tasks: item.tasks.filter((t) => t.id != task.id),
          };
        }

        if (item.id == dropableId) {
          return {
            ...item,
            tasks: [task, ...item.tasks],
          };
        }

        return item;
      });

      state.projectColumnData = newData;

    },
    updateProjectTaskList: (state, { payload }) => {
      const { operation, task } = payload; // Destructure only the operation and task from the payload
      const prevData = [...state.ProjectTask];
      let newData;

      switch (operation) {
        case "add":
          newData = [...prevData, task];
          break;
        case "edit":
          newData = prevData?.map((item) =>
            item.id == task.id ? { ...item, ...task } : item
          );
          break;
        case "delete":
          newData = prevData.filter((item) => item.id != task.id);
          break;
        default:
          newData = prevData;
      }

      state.ProjectTask = newData;

    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(TaskDetails.pending, (state, action) => {
        state.fetchStatus = "loading";
        state.fetchStatusTask = "loading";
      })
      .addCase(TaskDetails.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        const { loader } = action.meta.arg;
        state.fetchStatus = "idle";
        state.fetchStatusTask = "idle";
        state.taskDetailInfo = data;
      })
      .addCase(TaskDetails.rejected, (state) => {
        state.fetchStatus = "idle";
        state.fetchStatusTask = "idle";
      })

      .addCase(TaskDetailsSub.pending, (state, action) => {
        const { loading } = action.meta.arg;
        state.fetchStatus = "loading";
        state.fetchStatusTask = loading ? "loading" : "idle";
      })
      .addCase(TaskDetailsSub.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.fetchStatus = "idle";
        state.fetchStatusTask = "idle";
        state.taskDetailInfo = data;
        state.totalChatPages = Math.floor(data?.total_message_count / 10);
      })
      .addCase(TaskDetailsSub.rejected, (state) => {
        state.fetchStatus = "idle";
        state.fetchStatusTask = "idle";
      })

      .addCase(SubTaskDetails.pending, (state) => {
        state.fetchSubTask = "loading";
      })
      .addCase(SubTaskDetails.fulfilled, (state, action) => {
        state.fetchSubTask = "idle";
      })
      .addCase(SubTaskDetails.rejected, (state) => {
        state.fetchSubTask = "idle";
      })

      .addCase(projectGetMenu.pending, (state, action) => {
        const { loader } = action.meta.arg;
        state.isBoardListLoading = true;
        state.fetchMenuTask = loader ? "loading" : "idle";
        state.fetchMenuTab = loader ? "loading" : "idle";
      })
      .addCase(projectGetMenu.fulfilled, (state, { payload }) => {
        state.fetchMenuTask = "idle";
        state.fetchMenuTab = "idle";
        const dataList = payload?.data?.data;
        const screenWidth = window?.innerWidth;

        if (screenWidth < 1400 && screenWidth > 1370) {
          state.projectBoardMainList = dataList?.slice(0, 6);
          state.projectBoardAddMoreList = dataList?.slice(6);
        }

        if (screenWidth < 1370 && screenWidth > 769) {
          state.projectBoardMainList = dataList?.slice(0, 5);
          state.projectBoardAddMoreList = dataList?.slice(5);
        } else if (screenWidth < 769 && screenWidth > 580) {
          state.projectBoardMainList = dataList?.slice(0, 4);
          state.projectBoardAddMoreList = dataList?.slice(4);
        } else if (screenWidth < 580) {
          state.projectBoardMainList = dataList?.slice(0, 1);
          state.projectBoardAddMoreList = dataList?.slice(1);
        } else if (screenWidth > 1400) {
          state.projectBoardMainList = dataList?.slice(0, 7);
          state.projectBoardAddMoreList = dataList?.slice(7);
        }
        state.projectBoardList = dataList;
        state.isBoardListLoading = false;
      })
      .addCase(projectGetMenu.rejected, (state) => {
        state.fetchMenuTask = "idle";
        state.searchStatus = "idle";
        state.fetchMenuTab = "idle";
        state.isBoardListLoading = false;
      })

      .addCase(projectColumnList.pending, (state, action) => {
        const { project_column_id, loader, payload, drag } = action.meta.arg;
        state.fetchStatusNew =
          !project_column_id && loader && drag ? "loading" : "idle";
        state.searchStatus =
          payload.is_filter != null && drag && loader ? "loading" : "idle";
        state.tasktablestatus =
          payload.is_filter == null && drag && loader ? "loading" : "idle";
        state.layoutBasedGroup = drag ? "loading" : "idle";
      })
      .addCase(projectColumnList.fulfilled, (state, action) => {
        const { project_column_id, loader, payload } = action.meta.arg;
        const { data } = action?.payload?.data;
        state.layoutBasedGroup = "idle";
        if (data?.saved_filter != null) {
          state.filtered = 1;
          state.conditions = data?.saved_filter || [];
        }
        if (data?.saved_sort?.length > 0) {
          state.sorting = data?.saved_sort;
          state.filtered = 1;
        }
        if (data?.saved_group != null) {
          state.filtered = 1;
          state.filterdata = data?.saved_group || {};
        }
        if (
          data?.saved_filter == null &&
          data?.saved_sort?.length == 0 &&
          !data?.saved_group
        ) {
          state.filtered = 0;
        }
        const getodoObject = data?.list?.filter(
          (item) => item.defalut_name == "To Do"
        );
        {
          getodoObject?.length > 0
            ? localStorage.setItem("todoColumn", getodoObject[0]?.id)
            : localStorage.setItem("todoColumn", data?.to_do_column_id);
        }
        state.projectInfo = data;
        state.projectColumnData = data?.list;
        // if (payload.is_filter == 1) {
        //   state.filtered = 1;
        // }
        payload.is_filter == 1
          ? localStorage.setItem("completeColumn", data.complete_column_id)
          : localStorage.removeItem("completeColumn");
        state.fetchStatusNew = "idle";
        state.searchStatus = "idle";
        state.tasktablestatus = "idle";
      })
      .addCase(projectColumnList.rejected, (state) => {
        state.fetchStatusNew = "idle";
        state.tasktablestatus = "idle";
        state.searchStatus = "idle";
        state.layoutBasedGroup = "idle";
      })
      .addCase(TaskListColumn.pending, (state, action) => {
        const { loading } = action.meta.arg;
        state.fetchTask = loading ? "loading" : "idle";
      })
      .addCase(TaskListColumn.fulfilled, (state, action) => {
        const { project_column_id, loader, payload } = action.meta.arg;
        const { data } = action.payload?.data;
        state.calenderData = data?.list || [];
        state.projectColumnData = data?.list || [];
        if (data?.saved_filter != null) {
          state.filtered = 1;
          state.conditions = data?.saved_filter || [];
        }
        if (data?.saved_sort?.length > 0) {
          state.sorting = data?.saved_sort;
          state.filtered = 1;
        }
        if (data?.saved_group != null) {
          state.filtered = 1;
          state.filterdata = data?.saved_group || {};
        }
        if (data?.saved_filter == null && data?.saved_sort?.length == 0) {
          state.filtered = 0;
        }
        state.fetchTask = "idle";
        if (payload?.start > 0) {
          const prevData = [...state.ProjectTask];
          const newData = [...prevData, ...data?.list];
          state.ProjectTask = newData;
        } else {
          state.ProjectTask = data?.list || [];
        }
        state.total_records = data?.total_records;
      })
      .addCase(TaskListColumn.rejected, (state) => {
        state.fetchTask = "idle";
      })
      .addCase(OnScrollprojectColumnList.pending, (state, action) => {})
      .addCase(OnScrollprojectColumnList.fulfilled, (state, action) => {
        const { project_column_id, loader, payload } = action.meta.arg;

        const prevData = [...state.projectColumnData];

        const { data } = action?.payload?.data;
        // Replace the matching object while keeping the rest unchanged
        const newData = prevData?.map((item) => {
          // If the current item's ID matches the ID in data.list[0], replace it
          if (item.id == data?.list[0]?.id) {
            return {
              ...item,
              tasks: [...item.tasks, ...data?.list[0]?.tasks], // Add new task
            };
          }
          // Otherwise, return the original item unchanged
          return item;
        });
        state.projectColumnData = newData;
      })

      .addCase(OnScrollprojectColumnList.rejected, (state, action) => {})
      .addCase(projectList.pending, (state, action) => {
        state.clientDashBoaredTask = false;
        state.fetchStatusNew = "loading";
      })
      .addCase(projectList.fulfilled, (state, action) => {
        // Get the list of projects and mark all as checked
        const { data } = action.payload?.data;

        let checkedData = data?.list?.map((item) => ({
          ...item,
          checked: true,
        }));

        // Update the state
        state.projectDataInfo = checkedData;
        state.projectList = checkedData;
        // Store the modified data in localStorage
        const localData = getUserDetail();
        let columnListLocal = localStorage.getItem("columnList");
        const activeUserColumnData = columnListLocal
          ? JSON.parse(columnListLocal)
          : null;
        const prevData = activeUserColumnData ? activeUserColumnData : null;

        checkedData = {
          ...prevData,
          [localData.uuid]:
            prevData &&
            prevData[localData.uuid] &&
            Array.isArray(prevData[localData.uuid])
              ? prevData[localData.uuid]
              : checkedData,
        };
        localStorage.setItem("columnList", JSON.stringify(checkedData));

        state.clientDashBoaredTask = true;
        state.fetchStatusNew = "idle";
      })
      .addCase(projectList.rejected, (state) => {
        state.clientDashBoaredTask = false;
        state.fetchStatusNew = "idle";
      })
      .addCase(projectTaskTableList.pending, (state, action) => {
        const { project_column_id, loader } = action.meta.arg;
        state.fetchStatusNew =
          !project_column_id && loader ? "loading" : "idle";
        state.fetchStatusNews = loader ? true : false;
      })
      .addCase(projectTaskTableList.fulfilled, (state, action) => {
        const { project_column_id, loader, payload } = action.meta.arg;
        const { data } = action.payload?.data;

        state.fetchStatusNew = "idle";

        state.fetchStatusNews = false;
      })
      .addCase(projectTaskTableList.rejected, (state) => {
        state.fetchStatusNew = "idle";
        state.fetchStatusNews = false;
      })
      .addCase(AgentRecentActivity.pending, (state, action) => {

        state.fetchStatusNews = true;
      })
      .addCase(AgentRecentActivity.fulfilled, (state, action) => {
        const { data } = action.payload?.data;

        state.fetchStatusNew = "idle";
        state.agentActivity = data.list;
        state.fetchStatusNews = false;
      })
      .addCase(AgentRecentActivity.rejected, (state) => {
        state.fetchStatusNew = "idle";
        state.fetchStatusNews = false;
      })

      .addCase(getWhiteBoardList.pending, (state, action) => {

        state.whiteBoardStatus = "loading";
      })
      .addCase(getWhiteBoardList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.whiteBoardStatus = "idle";
        state.whiteBoardList = data;
      })
      .addCase(getWhiteBoardList.rejected, (state) => {
        state.whiteBoardStatus = "idle";
      })
      .addCase(AccessAccountManagerList.pending, (state, action) => {
        state.AccessStatus = "loading";
      })
      .addCase(AccessAccountManagerList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.AccessStatus = "idle";
        state.Accesslist = data;
      })
      .addCase(AccessAccountManagerList.rejected, (state) => {
        state.AccessStatus = "idle";
      })
      .addCase(GetNotificaitonList.pending, (state, action) => {
        state.notificationStatus = "loading";
      })
      .addCase(GetNotificaitonList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.notificationStatus = "idle";
        state.notificationList = data;
      })
      .addCase(GetNotificaitonList.rejected, (state) => {
        state.notificationStatus = "idle";
      })

      .addCase(getDocList.pending, (state, action) => {

        state.DocStatus = "loading";
      })
      .addCase(getDocList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.DocStatus = "idle";
        state.DocList = data;
      })
      .addCase(getDocList.rejected, (state) => {
        state.DocStatus = "idle";
      })
      .addCase(projectFilteredList.pending, (state, action) => {

        state.saveFilterListStatus = "loading";
      })
      .addCase(projectFilteredList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.saveFilterListStatus = "idle";
        state.saveFilterList = data;
      })
      .addCase(projectFilteredList.rejected, (state) => {
        state.saveFilterListStatus = "idle";
      })
      .addCase(projectAdd.pending, (state, action) => {
      })
      .addCase(projectAdd.fulfilled, (state, action) => {
        (state.filterdata = {
          key: null,
          order: 0,
        }),
          (state.conditions = []);
        state.sorting = [];
        state.filtered = 0;
      })
      .addCase(projectAdd.rejected, (state) => {});
  },
});
export const {
  restAll,
  setFilterData,
  setFilter,
  setCondition,
  setSortFilter,
  setMainOp,
  setprojectColumnId,
  setIsSubTask,
  updateProjectList,
  upadteMainBoardList,
  upadteMoreBoardList,
  updateProjectBoardList,
  updateProjectColumnList,
  updateProjectSubTaskColumnList,
  updateProjectBoardListMove,
  updateProjectColumn,
  updateProjectColumnListDrag,
  updateProjectTaskList,
} = projectSlice.actions;
export default projectSlice.reducer;
