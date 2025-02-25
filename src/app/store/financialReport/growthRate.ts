import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export interface growthRateProps {
  type: number | string;
  start_date: string;
  end_date: string;
}

export interface growthRateInitialState {
  growthRateData:
    | {
        name: string;
        new: number | null;
        reactivation: number | null;
        churn: number | null;
        net_new_mrr: number | null;
        growth_rate: number | null;
      }[]
    | null;
  over_all_report: {
    new: number | null;
    reactivation: number | null;
    churn: number | null;
    net_new_mrr: number | null;
    growth_rate: number | null;
  };
  isLoading: boolean;
}

const initialState: growthRateInitialState = {
  growthRateData: null,
  isLoading: false,
  over_all_report: {
    new: null,
    reactivation: null,
    churn: null,
    net_new_mrr: null,
    growth_rate: null,
  },
};

export const getGrowthRateList: any = createAsyncThunk(
  "financial-report-growth-rate/getGrowthRateList",
  async (payload: growthRateProps, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-growth-rate-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const growthRateSlice = createSlice({
  name: "financial-report-growth-rate",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getGrowthRateList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGrowthRateList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.growthRateData = payload?.data?.data?.customer_overview;
        state.over_all_report = payload?.data?.data?.over_all_report;
      })
      .addCase(getGrowthRateList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default growthRateSlice.reducer;
