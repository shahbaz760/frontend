import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import { clientIDType, initialStateProps } from "./Interface";
// import { getAgentList } from "../Agent";

/**
 * API calling
 */

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  supportStatus: "idle",
  fetchStatus: "loading",
  list: [],
  assignedAgentDetail: [],
  assignAccManagerDetail: [],
  total_records: 0,
  total_items: 0,
  Support_total_records: 0,
  Support_total_items: 0,
  details: {},
  data: {},
  supportlist: [],
  subscription: {},
};

export const addUser = createAsyncThunk(
  "/user/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/user/add",
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
export const GetUserList: any = createAsyncThunk(
  "users/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "users/list",
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

export const deleteUser = createAsyncThunk(
  "users/delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `users/delete/${payload.password_manager_id}`,
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
export const getEditUserDetail = createAsyncThunk(
  "/users/detail/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/users/detail/${payload}`,
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

export const UpdateUser = createAsyncThunk(
  "/users/edit",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/users/edit",
      method: "put",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const GetUserRoleList: any = createAsyncThunk(
  "user-role/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "user-role/list",
      method: "get",
      dispatch,
      data: payload,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const subscriptionDetails = createAsyncThunk(
  "client/subscription-detail",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/subscription-detail/${payload?.client_id}?is_createdAt=1`,
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
//  * The auth slice.
//  */
export const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    changeFetchStatus: (state) => {
      state.fetchStatus = "loading";
    },
    sortColumn: (state, { payload }) => {
      state.list = payload || [];
      state.assignedAgentDetail = payload || [];
      state.assignAccManagerDetail = payload || [];
    },
  },

  extraReducers(builder) {
    builder
      .addCase(GetUserList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetUserList.fulfilled, (state, action) => {
        const { limit } = action.meta?.arg;
        const response = action.payload?.data;
        state.status = "idle";
        state.list = response?.data?.list || [];
        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
      })
      .addCase(GetUserList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(GetUserRoleList.pending, (state) => {
        state.supportStatus = "loading";
      })
      .addCase(GetUserRoleList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.supportStatus = "idle";
      })
      .addCase(GetUserRoleList.rejected, (state, action) => {
        state.supportStatus = "idle";
      })
      .addCase(subscriptionDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subscriptionDetails.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.subscription = response?.data || {};
        state.status = "idle";
      })
      .addCase(subscriptionDetails.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { changeFetchStatus, sortColumn } = UserSlice.actions;

export default UserSlice.reducer;
