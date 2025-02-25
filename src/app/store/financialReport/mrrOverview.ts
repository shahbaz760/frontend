import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export interface MrrProps {
  type: number | string;
  start_date: string;
  end_date: string;
}

export interface MrrInitialState {
  mrrData:
    | {
        name: string;
        new: number;
        reactivation: number;
        existing: number;
        voluntary_churn: number;
        deliquent_churn: number;
        total_customers: number;
        active_cutomers: number;
        active_cutomers_percentage: number;
      }[]
    | null;
  over_all_report: {
    new: number | null;
    reactivation: number | null;
    existing: number | null;
    churn: number | null;
    mrr: number | null;
  };
  isLoading: boolean;
}

const initialState: MrrInitialState = {
  mrrData: null,
  isLoading: false,
  over_all_report: {
    new: null,
    reactivation: null,
    existing: null,
    churn: null,
    mrr: null,
  },
};

export const getMrrList: any = createAsyncThunk(
  "financial-report-mrr-view/getMrrList",
  async (payload: MrrProps, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-mmr-overview-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const mrrSlice = createSlice({
  name: "financial-report-mrr-view",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMrrList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMrrList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.mrrData = payload?.data?.data?.customer_overview;
        state.over_all_report = payload?.data?.data?.over_all_report;
      })
      .addCase(getMrrList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default mrrSlice.reducer;
