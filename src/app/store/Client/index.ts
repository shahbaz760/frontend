import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import {
  AddLineItem,
  AddSubscriptionList,
  clientIDType,
  ClientInfo,
  ClientType,
  deleteClientType,
  filterType,
  initialStateProps,
  ProductAdd,
  ProductDelete,
  ProductUpdate,
  SubscriptionList,
  SubscriptionListItem,
  UpdateProfilePayload,
} from "./Interface";
import { getAccManagerInfo } from "../AccountManager";
// import { getAgentList } from "../Agent";

/**
 * API calling
 */

export const addClient = createAsyncThunk(
  "client/add",
  async (payload: ClientType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/add",
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

export const getClientList = createAsyncThunk(
  "client/list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/list",
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

export const getClientAssignList = createAsyncThunk(
  "client/list-for-assign",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/list-for-assign",
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
// export const getAgentAssignList = createAsyncThunk(
//   "agent/list-for-assign",
//   async (payload: any, { dispatch }) => {
//     const response = await ApiHelperFunction({
//       url: "client/list-for-assign",
//       method: "post",
//       data: payload,
//       dispatch,
//     });

//     // Return only the data you need to keep it serializable
//     return {
//       data: response.data,
//     };
//   }
// );

export const addAssignClient = createAsyncThunk(
  "accountManager/assign-clients",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "accountManager/assign-clients",
      method: "post",
      data: payload,
      dispatch,
    });
    dispatch(
      getAccManagerInfo({
        account_manager_id: payload?.account_manager_id,
        loader: false,
      })
    );

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const addAccAssignAgents = createAsyncThunk(
  "accountManager/assign-agents",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "accountManager/assign-agents",
      method: "post",
      data: payload,
      dispatch,
    });
    // dispatch(
    //   getAccManagerInfo({
    //     account_manager_id: payload?.account_manager_id,
    //     loader: false,
    //   })
    // );

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deletClient = createAsyncThunk(
  "client/delete",
  async (payload: deleteClientType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/delete",
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

export const getClientInfo = createAsyncThunk(
  "client/information",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/detail/${payload?.client_id}`,
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

export const updateProfile = createAsyncThunk(
  "client/update-profile",
  async (payload: UpdateProfilePayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/update-profile`,
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

export const GetCountry = createAsyncThunk(
  "country-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `country-list?start=0&limit=-1`,
      method: "get",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getAllState = createAsyncThunk(
  "state-list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `state-list/${payload?.data?.country_name}?start=0&limit=-1`,
      method: "get",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const changePassword = createAsyncThunk(
  "auth/change-password",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `auth/change-password`,
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

export const resetPassword = createAsyncThunk(
  "client/set-password-link",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/set-password-link`,
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

export const UpdateStatus = createAsyncThunk(
  "user/status-update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `user/status-update`,
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

// --------------subscription------

export const subscriptionList = createAsyncThunk(
  "product/list",
  async (payload: SubscriptionList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `product/list`,
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

export const addsubscription = createAsyncThunk(
  "client/add-subscription",
  async (payload: AddSubscriptionList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/add-subscription`,
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

export const Editsubscription = createAsyncThunk(
  "client/edit-subscription",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/edit-subscription`,
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

export const addLineItem = createAsyncThunk(
  "line-item/add",
  async (payload: AddLineItem, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `line-item/add`,
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

export const subscriptionListItem = createAsyncThunk(
  "client/subscription-list",
  async (payload: SubscriptionListItem, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/subscription-list`,
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
export const subscriptionDetails = createAsyncThunk(
  "client/information",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/subscription-detail/${payload?.client_id}`,
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

export const passwordSetting = createAsyncThunk(
  "global/get-password-setting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `global/get-password-setting`,
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

export const subscriptionPaused = createAsyncThunk(
  "client/subscription-pause",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/subscription-pause/${payload?.client_id}`,
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

export const subscriptionResume = createAsyncThunk(
  "client/subscription-resume",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/subscription-resume/${payload?.client_id}`,
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

export const subscriptionUpdateDetails = createAsyncThunk(
  "/product/detail/",
  async (payload: ProductDelete, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/detail/${payload?.product_id}`,
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

// ----*-------product-list-----

export const productAdd = createAsyncThunk(
  "product/add",
  async (payload: ProductAdd, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/add`,
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

export const productUpdate = createAsyncThunk(
  "product/update",
  async (payload: ProductUpdate, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/update`,
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

export const productList = createAsyncThunk(
  "product/list",
  async (payload: SubscriptionList, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/list`,
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

export const productDelete = createAsyncThunk(
  "product/delete",
  async (payload: ProductDelete, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/delete`,
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
export const productDetails = createAsyncThunk(
  "/product/detail/",
  async (payload: ProductDelete, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/product/detail/${payload?.product_id}`,
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
/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  fetchStatus: "loading",
  actionStatus: false,
  successMsg: "",
  errorMsg: "",
  list: [],
  subscriptionlist: [],
  clientDetail: {},
  selectedColumn: [
    "ID",
    "Name",
    "Company Name",
    "Joining Date",
    "Subscription Status",
    "Account Status",
    "",
  ],
  assignedAgentDetail: [],
  assignedAgentDetailDashboard: [],
  assignAccManagerDetail: [],
  total_itemsAcc: 0,
  total_records: 0,
  total_itemsSub: 0,
  total_items: 0,
  agentTotal_records: 0,
  toatalPage: 0,
  managertotal_records: 0,
  actionStatusDisabled: false,
  actionStatusClient: false,
  resetActivity: [],
  fetchAgendaData: false,
  globalfess: {},
};

export const addAssignAgents = createAsyncThunk(
  "client/assign-agents",
  async (payload: ClientType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/assign-agents",
      method: "post",
      data: payload,
      dispatch,
    });
    dispatch(
      GetAssignAgentsInfo({
        client_id: payload?.client_id,
        start: 0,
        limit: 10,
        search: "",
      })
    );
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetAssignAgentsInfo: any = createAsyncThunk(
  "client/assign-agents-list",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/assign-agents-list",
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
export const GetAssignAgentsDashboardInfo: any = createAsyncThunk(
  "client/dashboard/assign-agents-list",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/assign-agents-list",
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

export const ToggleAsscessAssignTask: any = createAsyncThunk(
  "client/assigned-task-olny",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/assigned-task-olny/${payload}`,
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

export const deleteAgentList = createAsyncThunk(
  "client/unassign-agent",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/unassign-agent",
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
export const getAssignAccMangerInfo: any = createAsyncThunk(
  "client/assign-account-manager-list",
  async (payload: ClientInfo & { loading?: boolean }, { dispatch }) => {
    delete payload.loading;
    const response = await ApiHelperFunction({
      url: "client/assign-account-manager-list",
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

export const getAssignAccMangerInfonew: any = createAsyncThunk(
  "client/assign-account-manager-list",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/assign-account-manager-list",
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
export const addAssignAccManager = createAsyncThunk(
  "client/assign-account-manager",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/assign-account-manager",
      method: "post",
      data: payload,
      dispatch,
    });

    dispatch(
      getAssignAccMangerInfo({
        client_id: payload.client_id,
        start: 0,
        limit: 10,
        search: "",
      })
    );

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const deleteAccManagerList = createAsyncThunk(
  "client/unassign-account-manager",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/unassign-account-manager",
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
export const defaultAccManagerList = createAsyncThunk(
  "client/set-default-account-manager",
  async (payload: clientIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/set-default-account-manager",
      method: "post",
      data: payload,
      dispatch,
    });
    // dispatch(
    //   getAssignAccMangerInfo({
    //     client_id: payload.client_id,
    //     start: 0,
    //     limit: 10,
    //     search: "",
    //     loading: false,
    //   })
    // );
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetRecentActivityData = createAsyncThunk(
  "client/recent-activity",
  async (payload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/recent-activity",
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
export const GetClientRecentActivityData = createAsyncThunk(
  "agent/recent-activity",
  async (payload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/recent-activity",
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
export const GetAgendaData = createAsyncThunk(
  "client/task-list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/task-list?start=${payload.start || 0}&limit=${
        payload.limit || 20
      }&date=${payload.date}`,
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

export const ResendSubscription = createAsyncThunk(
  "client/resend-subscription-link",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/resend-subscription-link/${payload}`,
      method: "get",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

/**
 * The auth slice.
 */
export const clientSlice = createSlice({
  name: "clientSlice",
  initialState,
  reducers: {
    restAll: (state) => {
      state.successMsg = "";
      state.errorMsg = "";
      state.selectedColumn = [];
    },
    changeFetchStatus: (state) => {
      state.fetchStatus = "loading";
    },
    sortColumn: (state, { payload }) => {
      state.list = payload || [];
      state.assignedAgentDetail = payload || [];
      state.assignAccManagerDetail = payload || [];
    },
    updateSelectedColumn: (state, { payload }) => {
      const predefinedItems = {
        ID: 0,
        Name: 1,
        "Company Name": 2,
        "Joining Date": 3,
        "Subscription Status": 4,
        "Account Status": 5,
        "": -1, // Place "Actions" at the end
      };

      let isExist = state.selectedColumn.indexOf(payload);
      if (isExist !== -1) {
        // check that state have atleast 2 values ["",(heading)]
        if (state.selectedColumn?.length > 2) {
          state.selectedColumn = state.selectedColumn.filter(
            (item) => item !== payload
          );
        }
      } else {
        state.selectedColumn.push(payload);
      }

      // Sort selectedColumn based on predefined positions5
      state.selectedColumn.sort((a, b) => {
        // Check if either a or b is an empty string
        if (a === "") return 1; // Move empty string 'a' to the end
        if (b === "") return -1; // Move empty string 'b' to the end

        const indexA =
          predefinedItems[a] !== undefined
            ? predefinedItems[a]
            : state.selectedColumn.length;
        const indexB =
          predefinedItems[b] !== undefined
            ? predefinedItems[b]
            : state.selectedColumn.length;

        return indexA - indexB;
      });
    },

    updateResetColumn: (state, { payload }) => {
      state.selectedColumn = payload;
    },
    // updateSelectedStatus: (state, { payload }) => {
    //   state?.clientDetail?.status = payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(subscriptionListItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subscriptionListItem.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.globalfess = response.subscription_setting;
        state.status = "idle";
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.subscriptionlist = response?.data?.list || [];
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_itemsSub = response?.data?.total_count;
        }
      })
      .addCase(subscriptionListItem.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(productList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productList.fulfilled, (state, action) => {
        const { limit } = action.meta?.arg;
        const response = action.payload?.data;
        state.status = "idle";
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.list = response?.data?.list || [];
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
        }
        state.total_items = response?.data?.total_count;
      })
      .addCase(productList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(addClient.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
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
      .addCase(addClient.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(deletClient.pending, (state) => {
        state.actionStatusClient = true;
      })
      .addCase(deletClient.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { client_ids } = action.meta?.arg;
        if (payload?.data?.status) {
          state.list = state.list?.filter(
            (item) => !client_ids?.includes(item.id)
          );

          state.actionStatusClient = false;
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deletClient.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatusClient = false;
      })

      .addCase(getClientList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClientList.fulfilled, (state, action) => {
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
      .addCase(getClientList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(getClientAssignList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClientAssignList.fulfilled, (state, action) => {
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
      .addCase(getClientAssignList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(ResendSubscription.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        if (payload?.data?.status) {
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(getClientInfo.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getClientInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        state.clientDetail = data;
        state.fetchStatus = "idle";
      })
      .addCase(getClientInfo.rejected, (state) => {
        state.fetchStatus = "idle";
      })

      .addCase(updateProfile.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.clientDetail = { ...response?.data };
          toast.success(response?.message);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.actionStatus = false;
      })

      .addCase(changePassword.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else if (response.code == "402") {
          toast.error(response?.message);
        } else {
          toast.success(response?.message);
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.actionStatus = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          toast.success(response?.message);
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.actionStatus = false;
      })
      .addCase(GetAssignAgentsInfo.pending, (state) => {
        state.getStatus = "loading";
      })
      .addCase(GetAssignAgentsInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.assignedAgentDetail = data?.list;
        state.totalAgent = data.total_logged_in_agent;

        state.agentTotal_records = calculatePageNumber(
          data?.total_records,
          limit
        );
        state.getStatus = "idle";
        state.total_items = data?.total_count;
      })
      .addCase(GetAssignAgentsInfo.rejected, (state) => {
        state.getStatus = "idle";
      })
      .addCase(GetAssignAgentsDashboardInfo.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(GetAssignAgentsDashboardInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.assignedAgentDetailDashboard = data?.list;
        state.totalAgent = data.total_logged_in_agent;

        state.agentTotal_records = calculatePageNumber(
          data?.total_records,
          limit
        );
        state.fetchStatus = "idle";
        state.total_items = data?.total_count;
      })
      .addCase(GetAssignAgentsDashboardInfo.rejected, (state) => {
        state.fetchStatus = "idle";
      })
      .addCase(deleteAgentList.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(deleteAgentList.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { agent_id } = action.meta?.arg;
        state.actionStatus = false;
        if (payload?.data?.status) {
          state.assignedAgentDetail = state.assignedAgentDetail.filter(
            (item) => item.agent_id !== agent_id
          );

          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deleteAgentList.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(getAssignAccMangerInfo.pending, (state, action) => {
        const { loading } = action.meta?.arg;
        state.actionStatus = true;
        // state.fetchStatus =
        //   loading === undefined ? "loading" : !loading ? "idle" : "loading";
        state.fetchStatus = loading;
      })

      .addCase(getAssignAccMangerInfo.fulfilled, (state, action) => {
        state.actionStatus = false;
        const { data } = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.fetchStatus = "idle";
        state.assignAccManagerDetail = data.list;
        state.managertotal_records = calculatePageNumber(
          data?.total_records,
          limit
        );
        state.total_itemsAcc = data?.total_count;
      })

      .addCase(getAssignAccMangerInfo.rejected, (state) => {
        state.actionStatus = false;
        state.fetchStatus = "idle";
      })
      .addCase(addAssignAgents.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addAssignAgents.fulfilled, (state, action) => {
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
      .addCase(addAssignAgents.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(addAssignAccManager.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addAssignAccManager.fulfilled, (state, action) => {
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
      .addCase(addAssignAccManager.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(deleteAccManagerList.pending, (state) => {
        state.actionStatusDisabled = true;
      })
      .addCase(deleteAccManagerList.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { account_manager_id } = action.meta?.arg;
        state.actionStatusDisabled = false;
        if (payload?.data?.status) {
          state.assignAccManagerDetail = state.assignAccManagerDetail.filter(
            (item) => item.account_manager_id !== account_manager_id
          );
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deleteAccManagerList.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatusDisabled = false;
      })
      .addCase(GetRecentActivityData.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(GetRecentActivityData.fulfilled, (state, action) => {
        const { data } = action.payload?.data;

        state.fetchStatus = "idle";
        state.resetActivity = data;
      })
      .addCase(GetClientRecentActivityData.rejected, (state) => {
        state.fetchStatus = "idle";
      })
      .addCase(GetClientRecentActivityData.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(GetClientRecentActivityData.fulfilled, (state, action) => {
        const { data } = action.payload?.data;

        state.fetchStatus = "idle";
        state.clientResetActivity = data.list;
      })
      .addCase(GetRecentActivityData.rejected, (state) => {
        state.fetchStatus = "idle";
      })
      .addCase(GetAgendaData.pending, (state) => {
        state.fetchAgendaData = true;
      })
      .addCase(GetAgendaData.fulfilled, (state, action) => {
        const { data } = action.payload?.data;

        state.dashBoardAgenda = data.list;
        state.fetchAgendaData = false;
      })
      .addCase(GetAgendaData.rejected, (state) => {
        state.fetchAgendaData = false;
      });
  },
});

export const {
  restAll,
  changeFetchStatus,
  updateSelectedColumn,
  sortColumn,
  updateResetColumn,
} = clientSlice.actions;

export default clientSlice.reducer;
