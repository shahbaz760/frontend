import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export interface retentionReportProps {
  type: number | string;
  start_date: string;
  end_date: string;
}

export interface retentionReportInitialState {
  retentionData:
    | {
        reactivation: number;
        churn: number;
        total_net: number;
        retention_rate: number;
        name: string;
      }[]
    | null;
  over_all_report: {
    churn: number | null;
    reactivation: number | null;
    retention_rate: number | null;
    total_net: number | null;
  };
  isLoading: boolean;
}

const initialState: retentionReportInitialState = {
  retentionData: null,
  isLoading: false,
  over_all_report: {
    churn: null,
    reactivation: null,
    retention_rate: null,
    total_net: null,
  },
};

export const getRetentionReportList: any = createAsyncThunk(
  "financial-report-retention/getRetentionReportList",
  async (payload: retentionReportProps, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-retention-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const financialRetentionSlice = createSlice({
  name: "financial-report-retention",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getRetentionReportList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRetentionReportList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.retentionData = payload?.data?.data?.retentionData;
        state.over_all_report = payload?.data?.data?.over_all_report;
      })
      .addCase(getRetentionReportList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default financialRetentionSlice.reducer;
