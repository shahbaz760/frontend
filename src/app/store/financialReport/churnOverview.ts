import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export interface churnListProps {
  type: number | string;
  start_date: string;
  end_date: string;
}

export interface churnListInitialState {
  churnData:
    | {
        name: string;
        voluntaryChurn: number;
        delinquentChurn: number;
        totalChurn: number;
        churnRate: number;
      }[]
    | null;
  over_all_report: {
    total_voluntary_churn: number | null;
    total_delinquent_churn: number | null;
    total_revenue_churn: number | null;
    total_churn_rate: number | null;
  };
  isLoading: boolean;
}

const initialState: churnListInitialState = {
  churnData: null,
  isLoading: false,
  over_all_report: {
    total_voluntary_churn: null,
    total_delinquent_churn: null,
    total_revenue_churn: null,
    total_churn_rate: null,
  },
};

export const getChurnList: any = createAsyncThunk(
  "financial-report-churn/getChurnList",
  async (payload: churnListProps, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-churn-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const financialChurnSlice = createSlice({
  name: "financial-report-churn",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getChurnList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChurnList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.churnData = payload?.data?.data?.churnData;
        state.over_all_report = payload?.data?.data?.over_all_report;
      })
      .addCase(getChurnList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default financialChurnSlice.reducer;
