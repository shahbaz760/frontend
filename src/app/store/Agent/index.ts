/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import {
  AgentType,
  agentIDType,
  deleteDocument,
  filterAgentType,
  initialStateProps,
  kycRequestType,
  uploadData,
} from "./Interafce";

/**
 * API calling
 */

export const addAgent = createAsyncThunk(
  "agent/add",
  async (payload: AgentType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/add",
      method: "post",
      data: payload.formData,
      formData: true,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const getAgentList = createAsyncThunk(
  "agent/list",
  async (payload: filterAgentType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/list",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const getAssignedClientList = createAsyncThunk(
  "agent/assigned-client-list",
  async (payload: filterAgentType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/assigned-client-list",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getStatusList = createAsyncThunk(
  "/project/columns/task-status",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/columns/task-status/${payload.id}`,
      method: "get",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getLabelList: any = createAsyncThunk(
  "/project/task-label/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task-label/list`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getSubTaskList = createAsyncThunk(
  "/project/sub-task/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/sub-task/list`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const AddLabellList = createAsyncThunk(
  "/project//task-label/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task-label/add`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const DeleteLabel = createAsyncThunk(
  "/project/task-label/delete",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/task-label/delete/${payload}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getAgentInfo = createAsyncThunk(
  "agent/information",
  async (payload: agentIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/agent/detail/${payload?.agent_id}`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const updateAgentProfile = createAsyncThunk(
  "agent/edit/{agent_id}",
  async (payload: uploadData, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/agent/edit`,
      method: "put",
      data: payload,
      formData: true,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const uploadAttachment = createAsyncThunk(
  "agent/upload-attachments",
  async (payload: uploadData, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/agent/upload-attachments`,
      method: "post",
      data: payload,
      formData: true,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const updateKycRequestStatus = createAsyncThunk(
  "agent/approve-reject",
  async (payload: kycRequestType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/agent/approve-reject`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deleteAttachment = createAsyncThunk(
  "agent/delete-attachment",
  async (payload: deleteDocument, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/delete-attachment",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const Uploadkyc = createAsyncThunk(
  "agent/upload-kyc",
  async ({ payload, token }: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/upload-kyc",
      method: "post",
      data: payload,
      dispatch,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const UploadkycRetry = createAsyncThunk(
  "/agent/update-kyc-detail",
  async ({ payload, token }: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/agent/update-kyc-detail",
      method: "post",
      data: payload,
      dispatch,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UploadImage = createAsyncThunk(
  "agent/capture-image",
  async ({ payload, token }: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/capture-image",
      method: "post",
      data: payload,
      dispatch,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getNotesList = createAsyncThunk(
  "agent/get-notes",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent/get-notes`,
      method: "post",
      data: payload.payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deleteNote = createAsyncThunk(
  "agent/delete-note",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent/delete-note/${payload.id}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const AddNote = createAsyncThunk(
  "agent/add-note",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent/add-note`,
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const EditNote = createAsyncThunk(
  "agent/edit-note",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent/edit-note/${payload?.id}`,
      method: "put",
      data: { note: payload?.note },
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
  successMsg: "",
  errorMsg: "",
  total_items: 0,
  list: [],
  agentDetail: {},
  selectedColumn: [],
  actionStatus: false,
  total_records: 0,
  resetFormData: {},
  actionStatusAttachment: false,
  taskLabelList: [],
  fetchnote: "idle",
  noteList: [],
};

/**
 * The auth slice.
 */
export const agentSlice = createSlice({
  name: "agentSlice",
  initialState,
  reducers: {
    restAll: (state) => {
      state.successMsg = "";
      state.errorMsg = "";
    },
    changeFetchStatus: (state) => {
      state.fetchStatus = "loading";
    },
    sortColumn: (state, { payload }) => {
      state.list = payload || [];
    },
    resetFormData: (state) => {
      state.agentDetail = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLabelList.fulfilled, (state, { payload }) => {
        state.taskLabelList = payload?.data?.data?.list;
      })
      .addCase(addAgent.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addAgent.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        state.actionStatus = false;
        if (payload?.data?.status) {
          state.successMsg = payload?.data?.message;
          toast.success(payload?.data?.message);
        } else {
          state.errorMsg = payload?.data?.message;
          toast.error(payload?.data?.message);
        }
      })
      .addCase(addAgent.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(getAgentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAgentList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.status = "idle";
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.list = response?.data?.list || [];
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_items = response?.data?.total_count;
        }
      })
      .addCase(getAgentList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(getAgentInfo.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getAgentInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.fetchStatus = "idle";
        state.agentDetail = data;
      })
      .addCase(getAgentInfo.rejected, (state) => {
        state.fetchStatus = "idle";
      })
      .addCase(getNotesList.pending, (state, action) => {
        const { loader } = action.meta?.arg;
        state.fetchnote = loader ? "loading" : "idle";
      })
      .addCase(getNotesList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.fetchnote = "idle";
        state.noteList = data.list;
      })
      .addCase(getNotesList.rejected, (state) => {
        state.fetchnote = "idle";
      })
      .addCase(updateAgentProfile.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(updateAgentProfile.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.agentDetail = { ...response?.data };
          state.total_items = response?.data?.total_count;
          toast.success(response?.message);
        }
      })
      .addCase(updateAgentProfile.rejected, (state, action) => {
        state.actionStatus = false;
      })
      .addCase(uploadAttachment.pending, (state) => {
        state.fetchStatus = "loading";
        state.actionStatus = true;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
        const response = action.payload?.data;

        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          let contactArray = state.agentDetail.attachments.concat(
            response.data
          );
          state.agentDetail.attachments = contactArray;
          toast.success(response?.message);
        }
      })
      .addCase(uploadAttachment.rejected, (state, action) => {
        state.fetchStatus = "idle";
        state.actionStatus = false;
      })
      .addCase(deleteAttachment.pending, (state) => {
        state.actionStatusAttachment = true;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        state.actionStatusAttachment = false;

        toast.success(payload?.data?.message);
      })
      .addCase(deleteAttachment.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatusAttachment = false;
      })
      .addCase(getAssignedClientList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAssignedClientList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.status = "idle";
        if (!response?.status) {
          toast.error(response?.message);
        } else {
          state.list = response?.data?.list || [];

          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_items = response?.data?.total_count;
        }
      })
      .addCase(getAssignedClientList.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const {
  restAll,
  changeFetchStatus,
  resetFormData,
  sortColumn,
} = agentSlice.actions;

export default agentSlice.reducer;
