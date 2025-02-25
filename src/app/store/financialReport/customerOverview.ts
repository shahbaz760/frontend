import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export interface customerOverviewProps {
  type: number | string;
  start_date: string;
  end_date: string;
}

export interface customerOverviewInitialState {
  customerData:
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
    active_cutomers: number | null;
    new: number | null;
    reactivation: number | null;
    existing: number | null;
    voluntary_churn: number | null;
    deliquent_churn: number | null;
    total_customers: number | null;
    active_cutomers_percentage: number | null;
  };
  isLoading: boolean;
}

const initialState: customerOverviewInitialState = {
  customerData: null,
  isLoading: false,
  over_all_report: {
    active_cutomers: null,
    new: null,
    reactivation: null,
    existing: null,
    voluntary_churn: null,
    deliquent_churn: null,
    total_customers: null,
    active_cutomers_percentage: null,
  },
};

export const getCustomerList: any = createAsyncThunk(
  "financial-report-customer-view/getCustomerList",
  async (payload: customerOverviewProps, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-customer-overview-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const customerOverviewSlice = createSlice({
  name: "financial-report-customer-view",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCustomerList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomerList.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.customerData = payload?.data?.data?.customer_overview;
        state.over_all_report = payload?.data?.data?.over_all_report;
      })
      .addCase(getCustomerList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});
export default customerOverviewSlice.reducer;
