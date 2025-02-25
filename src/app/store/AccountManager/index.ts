import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";

import { calculatePageNumber } from "src/utils";
import {
  AccManagerType,
  accManagerIDType,
  assignedClientInfoType,
  deleteAccManagerType,
  filterType,
  initialStateProps,
} from "./Interface";

/**
 * API calling
 */

export const addAccManager = createAsyncThunk(
  "accountManager/add",
  async (payload: AccManagerType, { dispatch }) => {
    // async (payload: any) => {
    const response = await ApiHelperFunction({
      url: "accountManager/add",
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
export const getAccManagerList = createAsyncThunk(
  "accountManager/list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "accountManager/list",
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
export const getAccManagerInfo = createAsyncThunk(
  "accountManager/detail/{accountManager_id}",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `accountManager/detail/${payload?.account_manager_id}`,
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
export const deleteAccManager = createAsyncThunk(
  "accountManager/delete",
  async (payload: deleteAccManagerType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "accountManager/delete",
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
export const assignedAccManagerList = createAsyncThunk(
  "accountManager/AssignClients",
  async (payload: assignedClientInfoType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "accountManager/AssignClients",
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

// export const accManagerClientList = createAsyncThunk(
//   "accountManager/client-list",
//   async (payload: deleteAccManagerType, { dispatch }) => {
//     const typeParameter =
//       payload.type !== undefined ? `type=${payload.type}` : "type=0";
//     const response = await ApiHelperFunction({
//       url: `accountManager/client-list?account_Manager_id=${payload.accountManger_id}&${typeParameter}`,
//       method: "get",
//       data: payload,
//       dispatch,
//     });

//     // Return only the data you need to keep it serializable
//     return {
//       data: response.data,
//     };
//   }
// );
export const accManagerClientList = createAsyncThunk(
  "accountManager/client-list",
  async (payload: deleteAccManagerType, { dispatch }) => {
    const typeParameter =
      payload.type !== undefined ? `type=${payload.type}` : "type=";
    const searchParameter =
      payload.search !== undefined ? `search=${payload.search}` : "";
    const limitParameter =
      payload.limit !== undefined ? `limit=${payload.limit}` : "";
    const startParameter =
      payload.start !== undefined ? `start=${payload.start}` : "";
    const response = await ApiHelperFunction({
      url: `accountManager/client-list?account_Manager_id=${payload.accountManger_id}&${typeParameter}&${searchParameter}&${limitParameter}&${startParameter}`,
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
export const accManagerAgentList = createAsyncThunk(
  "accountManager/agent-list",
  async (payload: deleteAccManagerType, { dispatch }) => {
    const typeParameter =
      payload.type !== undefined ? `type=${payload.type}` : "type=";
    const searchParameter =
      payload.search !== undefined ? `search=${payload.search}` : "";
    const limitParameter =
      payload.limit !== undefined ? `limit=${payload.limit}` : "";
    const startParameter =
      payload.start !== undefined ? `start=${payload.start}` : "";
    const response = await ApiHelperFunction({
      url: `accountManager/agent-list?account_Manager_id=${payload.accountManger_id}&${typeParameter}&${searchParameter}&${limitParameter}&${startParameter}`,
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

export const updateAccManagerList = createAsyncThunk(
  "accountManager/update",
  async (payload: assignedClientInfoType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/accountManager/update",
      method: "put",
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

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  fetchStatus: "loading",
  successMsg: "",
  errorMsg: "",
  list: [],
  accManagerDetail: {},
  total_items: 0,
  selectedColumn: [],
  actionStatus: false,
  clientlist: [],
  total_records: 0,
  accountstatus: "loading",
};

/**
 * The auth slice.
 */
export const accManagerSlice = createSlice({
  name: "accManagerSlice",
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
    resetFormManagrData: (state) => {
      state.accManagerDetail = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addAccManager.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addAccManager.fulfilled, (state, action) => {
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
      .addCase(addAccManager.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(getAccManagerList.pending, (state, action) => {
        state.status = "loading";
        state.accountstatus = "loading";
      })
      .addCase(getAccManagerList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.status = "idle";
        state.accountstatus = "idle";
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
      .addCase(getAccManagerList.rejected, (state, action) => {
        state.status = "idle";
        state.accountstatus = "idle";
      })
      .addCase(getAccManagerInfo.pending, (state, action) => {
        const { loader } = action.meta.arg;
        state.fetchStatus = loader ? "loading" : "idle";
      })
      .addCase(getAccManagerInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;

        state.fetchStatus = "idle";
        state.accManagerDetail = data;
        state.total_items = data.total_count;
      })
      .addCase(getAccManagerInfo.rejected, (state) => {
        state.fetchStatus = "idle";
      })
      .addCase(deleteAccManager.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(deleteAccManager.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { accountManger_id } = action.meta?.arg;
        if (payload?.data?.status) {
          state.list = state.list.filter(
            (item) => item.id !== accountManger_id
          );

          state.actionStatus = false;
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deleteAccManager.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(assignedAccManagerList.pending, (state) => {})
      .addCase(assignedAccManagerList.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
      })
      .addCase(assignedAccManagerList.rejected, (state, error) => {})
      .addCase(accManagerClientList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(accManagerClientList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.clientlist = data?.list;
        state.total_items = data.total_count;
      })
      .addCase(accManagerClientList.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(accManagerAgentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(accManagerAgentList.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        const list = data?.list || [];

        state.accAgentList = list;
      })
      .addCase(accManagerAgentList.rejected, (state) => {
        state.status = "idle";
      })

      .addCase(updateAccManagerList.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(updateAccManagerList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.accManagerDetail = { ...response?.data };

          toast.success(response?.message);
          state.total_items = response?.data.total_count;
        }
      })
      .addCase(updateAccManagerList.rejected, (state, action) => {
        state.actionStatus = false;
      });
  },
});

export const { restAll, changeFetchStatus, resetFormManagrData, sortColumn } =
  accManagerSlice.actions;

export default accManagerSlice.reducer;
