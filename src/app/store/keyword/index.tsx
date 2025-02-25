import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";

import { calculatePageNumber } from "src/utils";
import { filterType } from "../Agent group/Interface";
import { initialStateProps, keyword, keywordIDType } from "./Interace";

/**
 * API calling
 */

export const addKeyword = createAsyncThunk(
  "add/keyword",
  async (payload: keyword, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "add/keyword",
      method: "post",
      data: payload,
      dispatch
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const getKeywordList = createAsyncThunk(
  "keyword/list",
  async (payload: filterType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "keyword/list",
      method: "post",
      data: payload,
      dispatch
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const fetchEmail = createAsyncThunk(
  "keyword-notification-email/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "keyword-notification-email/add",
      method: "post",
      data: payload,
      dispatch
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deleteKeyword = createAsyncThunk(
  "keyword/delete/{keyword_id}",
  async (payload: keywordIDType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `keyword/delete/${payload?.keyword_id}`,
      method: "Delete",
      data: payload,
      dispatch
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
  keywordList: [],
};

/**
 * The auth slice.
 */
export const keywordSlice = createSlice({
  name: "keywordSlice",
  initialState,
  reducers: {
    restAll: (state) => {
      //   state.successMsg = "";
      //   state.errorMsg = "";
    },
    changeFetchStatus: (state) => {
      state.fetchStatus = "loading";
    },
    sortColumn: (state, { payload }) => {
      state.list = payload || [];
    },
    resetFormData: (state) => { },
  },
  extraReducers(builder) {
    builder
      .addCase(addKeyword.pending, (state) => {
        // state.actionStatus = true;
      })
      .addCase(addKeyword.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        // state.actionStatus = false;
        if (payload?.data?.status) {
          // state.successMsg = payload?.data?.message;
          toast.success(payload?.data?.message);
        } else {
          //   state.errorMsg = payload?.data?.message;
          toast.error(payload?.data?.message);
        }
      })
      .addCase(addKeyword.rejected, (state, { error }) => {
        toast.error(error?.message);
        // state.actionStatus = false;
      })
      .addCase(getKeywordList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getKeywordList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        if (!response.status) {
          toast.error(response?.message);
        } else {
          state.keywordList = response?.data?.list || [];
          const keywordList = state.list;
          state.total_records = calculatePageNumber(
            response?.data?.total_records,
            limit
          );
        }
        state.status = "idle";
      })
      .addCase(getKeywordList.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { restAll, changeFetchStatus, resetFormData, sortColumn } =
  keywordSlice.actions;

export default keywordSlice.reducer;
