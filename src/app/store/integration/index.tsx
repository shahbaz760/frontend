import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import {
  clientIDType,
  initialStateProps,
  IntegrationType,
  removeIntegrationType,
  SLackIntegrationType,
  SlackNotificationType,
  TwoFactorIntegration,
} from "./Interface";
// import { getAgentList } from "../Agent";

/**
 * API calling
 */

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",

  list: {},
};

export const GetIntegrationDetail = createAsyncThunk(
  "auth/get-slack-calendar-sync",
  async (payload: any = {}, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/get-slack-calendar-sync",
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

export const GetSlackLink = createAsyncThunk(
  "auth/slack-integration-link",
  async (payload: SLackIntegrationType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `auth/slack-integration-link?type=${payload.type}&project_id=${payload.project_id}`,
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

export const GetGoogleLink = createAsyncThunk(
  "auth/google-integration-link",
  async (payload: IntegrationType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `auth/google-integration-link?type=${payload.type}`,
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
export const GetOutlookLink = createAsyncThunk(
  "outlook/auth",
  async (payload: IntegrationType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `outlook/auth?type=${payload.type}`,
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
export const twoFactorAuthIntegration = createAsyncThunk(
  "auth/enable-calendar-sync",
  async (payload: TwoFactorIntegration, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/enable-calendar-sync",
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
export const removeIntegration = createAsyncThunk(
  "auth/remove-calender-sync",
  async (payload: removeIntegrationType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/remove-calender-sync",
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
export const SlackNoificationUpdate = createAsyncThunk(
  "auth/types-of-slack-notification/update",
  async (payload: SlackNotificationType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/types-of-slack-notification/update",
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
//  * The auth slice.
//  */
export const IntegrationSlice = createSlice({
  name: "IntegrationSlice",
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(GetIntegrationDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetIntegrationDetail.fulfilled, (state, action) => {
        const response = action.payload?.data;

        state.list = response?.data;
        state.status = "idle";
        // console.log(state.list, "list");
        // state.total_records = calculatePageNumber(
        //   response?.data?.total_records,
        //   limit
        // );
        // state.total_items = response?.data?.total_count;
      })
      .addCase(GetIntegrationDetail.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

// export const { changeFetchStatus, sortColumn } = UserSlice.actions;

export default IntegrationSlice.reducer;
