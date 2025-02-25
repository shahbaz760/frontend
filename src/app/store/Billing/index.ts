import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import { initialStateProps } from "./Interface";
// import { getAgentList } from "../Agent";

/**
 * API calling
 */

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  cardstatus: "idle",
  supportStatus: "idle",
  fetchStatus: "loading",
  Billingstatus: "idle",
  list: [],
  cardList: [],
  BillingList: [],
  filterList: [],
  assignedAgentDetail: [],
  filterStatus: "idle",
  assignAccManagerDetail: [],
  total_records: 0,
  total_items: 0,
  Support_total_records: 0,
  Support_total_items: 0,
  details: {},
  data: {},
  supportlist: [],
  planstatus: "idle",
  planList: [],
};

export const add = createAsyncThunk(
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
export const GetBillingList: any = createAsyncThunk(
  "client/billing-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/billing-list",
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
export const CancelSubscription: any = createAsyncThunk(
  "client/cancel-subscription",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/cancel-subscription",
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

export const addCard = createAsyncThunk(
  "client/add-card",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/add-card",
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

export const addBank = createAsyncThunk(
  "client/add-bank",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/add-bank",
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

export const EditBank = createAsyncThunk(
  "client/update-bank",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/update-bank",
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

export const GetCardList: any = createAsyncThunk(
  "client/card-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/card-list/${payload.id}`,
      method: "get",
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getCardDetail = createAsyncThunk(
  "client/card-detail/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/card-detail/${payload}`,
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

export const deleteCard = createAsyncThunk(
  "client/card-delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/card-delete/${payload.password_manager_id}/${payload.subscription_id}`,
      method: "delete",
      // data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UpdateCard = createAsyncThunk(
  "client/update-card",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/update-card",
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

export const GetBillingHistory: any = createAsyncThunk(
  "client/billing-history",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/billing-history",
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

export const GetSubscriptionPlanDetails: any = createAsyncThunk(
  "client/billing-detail",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/billing-detail/${payload}`,
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

export const GetFilterDropDetails: any = createAsyncThunk(
  "/project/filter-drop-down/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/project/filter-drop-down/${payload?.project_id}/${payload?.key}`,
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

export const GetSubscriptionLog: any = createAsyncThunk(
  "client/subscription-logs",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/subscription-logs",
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
//  * The auth slice.
//  */
export const BillingSlice = createSlice({
  name: "BillingSlice",
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
      .addCase(GetBillingList.pending, (state, action) => {
        const { loader } = action.meta.arg;

        state.status = loader ? "loading" : "idle";
      })
      .addCase(GetBillingList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.status = "idle";
        const { filters } = action.meta.arg;
        if (filters?.start == 0) {
          state.list = response?.data?.list || [];
        } else {
          state.list = Array.from(
            new Set([...state.list, ...(response?.data?.list || [])])
          );
        }
        // state.total_records = calculatePageNumber(
        //   response?.data?.total_records,
        //   response?.data?.filtered_records
        // );
        // state.total_items = response?.data?.total_count;
      })
      .addCase(GetBillingList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(GetCardList.pending, (state) => {
        state.cardstatus = "loading";
      })
      .addCase(GetCardList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.cardstatus = "idle";
        state.cardList = response?.data || [];
      })
      .addCase(GetCardList.rejected, (state, action) => {
        state.cardstatus = "idle";
      })
      .addCase(GetBillingHistory.pending, (state) => {
        state.Billingstatus = "loading";
      })
      .addCase(GetBillingHistory.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.Billingstatus = "idle";
        state.BillingList = response?.data?.list || [];
        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
      })
      .addCase(GetBillingHistory.rejected, (state, action) => {
        state.Billingstatus = "idle";
      })
      .addCase(GetSubscriptionLog.pending, (state) => {
        state.Billingstatus = "loading";
      })
      .addCase(GetSubscriptionLog.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.Billingstatus = "idle";
        const { limit } = action.meta?.arg;
        state.BillingList = response?.data?.list || [];
        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
      })
      .addCase(GetSubscriptionLog.rejected, (state, action) => {
        state.Billingstatus = "idle";
      })
      .addCase(GetSubscriptionPlanDetails.pending, (state) => {
        state.planstatus = "loading";
      })
      .addCase(GetSubscriptionPlanDetails.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.planstatus = "idle";
        state.planList = response?.data || [];
      })
      .addCase(GetSubscriptionPlanDetails.rejected, (state, action) => {
        state.planstatus = "idle";
      })
      .addCase(GetFilterDropDetails.pending, (state) => {
        state.filterStatus = "loading";
      })
      .addCase(GetFilterDropDetails.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.filterList = response?.data?.list || [];
        state.filterStatus = "idle";
      })
      .addCase(GetFilterDropDetails.rejected, (state, action) => {
        state.filterStatus = "idle";
      });
  },
});

export const { changeFetchStatus, sortColumn } = BillingSlice.actions;

export default BillingSlice.reducer;
