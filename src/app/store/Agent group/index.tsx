import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import {
  AgentGroupIDType,
  AgentGroupType,
  deleteAgentGroupType,
  filterGroupType,
  filterType,
  initialStateProps,
  searchAgentGroupType,
  UpdateAgentGroupPayload,
} from "./Interface";

/**
 * API calling
 */

export const addAgentGroup = createAsyncThunk(
  "agent-group/add",
  async (payload: AgentGroupType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent-group/add",
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

export const addSubscriptionSetting = createAsyncThunk(
  "global/subscription-setting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "global/subscription-setting",
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

export const getSubscriptionSetting = createAsyncThunk(
  "global/get-subscription-setting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "global/get-subscription-setting",
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

addAgentGroup;
export const getGroupMemberDetail = createAsyncThunk(
  "agent-group-members",
  async (payload: filterGroupType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent-group-members",
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
export const getAgentGroupList = createAsyncThunk(
  "agent-group/list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent-group/list",
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

export const deleteAgentGroup = createAsyncThunk(
  "agent-group/delete",
  async (payload: deleteAgentGroupType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent-group/delete",
      method: "post",
      dispatch,
      data: payload,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deleteAgent = createAsyncThunk(
  "/users/delete/2",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/users/delete/${payload}`,
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

export const getAgentGroupInfo = createAsyncThunk(
  "agent-group/{group_id}",
  async (payload: AgentGroupIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent-group/${payload?.group_id}`,
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

export const updateGroupName = createAsyncThunk(
  "agent-group/edit",
  async (payload: UpdateAgentGroupPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent-group/edit`,
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
export const addAgentInagentGroup = createAsyncThunk(
  "agent/list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent/list`,
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
export const deleteAgentMemberGroup = createAsyncThunk(
  "agent-group-member/delete",
  async (payload: deleteAgentGroupType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent-group-member/delete",
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

export const searchAgentGroup = createAsyncThunk(
  "agent-group/addMember",
  async (payload: searchAgentGroupType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `agent-group/addMember`,
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

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "loading",
  fetchStatus: "loading",
  actionStatus: false,
  successMsg: "",
  errorMsg: "",
  list: [],
  searchAgentList: [],
  agentGroupDetail: {},
  selectedColumn: [],
  total_records: 0,
  total_item: 0,
  addagentList: [],
  actionStatusDisabled: false,
  actionStatusEdit: false,
  actionStatusGroupMember: false,
  agentGroupListMember: {},
  total_groupDetail: 0,
};

/**
 * The auth slice.
 */
export const agentGroupSlice = createSlice({
  name: "agentGroupSlice",
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
      state.agentGroupListMember.list = payload || [];
    },
    updateSelectedColumn: (state, { payload }) => {
      const predefinedItems = {
        ID: 0,
        Name: 1,
        "Company Name": 2,
        Date: 3,
        Status: 4,
        "": -1, // Place "Actions" at the end
      };

      let isExist = state.selectedColumn.indexOf(payload);
      if (isExist !== -1) {
        state.selectedColumn = state.selectedColumn.filter(
          (item) => item !== payload
        );
      } else {
        state.selectedColumn.push(payload);
      }

      // Sort selectedColumn based on predefined positions
      state.selectedColumn.sort((a, b) => {
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
  },
  extraReducers(builder) {
    builder
      .addCase(addAgentGroup.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addAgentGroup.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        if (payload?.data?.status) {
          state.successMsg = payload?.data?.message;

          toast.success(payload?.data?.message);
        } else {
          state.errorMsg = payload?.data?.message;
          toast.error(payload?.data?.message);
        }
        state.actionStatus = false;
      })
      .addCase(addAgentGroup.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(deleteAgentGroup.pending, (state) => {
        state.actionStatusDisabled = true;
      })
      .addCase(deleteAgentGroup.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { group_id } = action.meta?.arg;
        if (payload?.data?.status) {
          // state.list = state.list.filter((item) => item.id !== group_id);

          toast.success(payload?.data?.message);
          state.actionStatusDisabled = false;
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deleteAgentGroup.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatusDisabled = false;
      })

      .addCase(getAgentGroupList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAgentGroupList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.list = response?.data?.list || [];
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_item = response?.data?.total_count;
        }
        state.status = "idle";
      })
      .addCase(getAgentGroupList.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(getAgentGroupInfo.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getAgentGroupInfo.fulfilled, (state, action) => {
        const { data } = action.payload?.data;
       
        state.fetchStatus = "idle";
        state.agentGroupDetail = data;
      })
      .addCase(getAgentGroupInfo.rejected, (state) => {
        state.fetchStatus = "idle";
      })

      .addCase(updateGroupName.pending, (state) => {
        state.actionStatusEdit = true;
      })
      .addCase(updateGroupName.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.actionStatusEdit = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.agentGroupDetail = { ...response?.data };

          toast.success(response?.message);
        }
      })
      .addCase(updateGroupName.rejected, (state, action) => {
        state.actionStatusEdit = false;
      })

      .addCase(searchAgentGroup.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(searchAgentGroup.fulfilled, (state, action) => {
        const response = action.payload?.data;

        state.actionStatus = false;
        if (!response.status) {
          toast.error(response?.message);
        } else {
         
          toast.success(response?.message);
        }
      })
      .addCase(searchAgentGroup.rejected, (state, action) => {
        state.actionStatus = false;
      })

      .addCase(addAgentInagentGroup.pending, (state) => {
        state.status = "loading";
        state.actionStatus = true;
      })
      .addCase(addAgentInagentGroup.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { data } = action.payload?.data;
        state.searchAgentList = data?.list;
        const { limit } = action.meta?.arg;
        state.actionStatus = false;
        state.status = "idle";
        if (!response.status) {
          toast.error(response?.message);
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_item = response?.data?.total_count;
        }
      })
      .addCase(addAgentInagentGroup.rejected, (state, action) => {
        state.actionStatus = false;
        state.status = "idle";
      })
      .addCase(deleteAgentMemberGroup.pending, (state) => {
        state.actionStatusGroupMember = true;
      })
      .addCase(deleteAgentMemberGroup.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { member_id } = action.meta?.arg;
        if (payload?.data?.status) {
          state.actionStatusGroupMember = false;
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(deleteAgentMemberGroup.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatusGroupMember = false;
      })
      .addCase(getGroupMemberDetail.pending, (state) => {
        state.status = "loading";
        state.actionStatus = true;
      })
      .addCase(getGroupMemberDetail.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { data } = action.payload?.data;
        state.agentGroupListMember = data;
        state.actionStatus = false;
        const { limit } = action.meta?.arg;
        state.status = "idle";
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.list = response?.data?.list || [];
          state.total_groupDetail = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
          state.total_item = response?.data?.total_count;         
        }
      })
      .addCase(getGroupMemberDetail.rejected, (state, action) => {
        state.actionStatus = false;
        state.status = "idle";
      });
  },
});

export const { restAll, changeFetchStatus, updateSelectedColumn, sortColumn } =
  agentGroupSlice.actions;

export default agentGroupSlice.reducer;
