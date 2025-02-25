import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

const financialReportinitialState = {
  over_all_report: {
    current_mmr: null,
    current_customers: null,
    active_customers: null,
  },
  customerActivityList: [],
  customerActivityTotalRecords: null,
  growth: [],
  overAllGrowth: null,
  overAllGrowthRate: null,
  churn: [],
  overAllChurn: null,
  overAllChurnRate: null,
  reactivation: [],
  overAllReactivation: null,
  overAllReactivationRate: null,
  newCustomers: [],
  overAllNewCustomers: null,
  overAllNewCustomersRate: null,
  isLoadingLeftContent: false,
  isLoadingRightContent: false,
};

export const financialReportDashboardApi: any = createAsyncThunk(
  "financial-report-growth-rate/financialReportDashboardApi",
  async (payload: { type: number }, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-financial-report",
      method: "post",
      data: payload,
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);

export const financialReportCustomerActivityApi: any = createAsyncThunk(
  "financial-report-growth-rate/financialReportCustomerActivityApi",
  async (payload: { start: number; limit: number }, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `get-customer-activity?start=${payload.start}&limit=${payload.limit}`,
      method: "get",
      dispatch,
    });

    return {
      data: response.data,
    };
  }
);
export const financialReportDashboardSlice = createSlice({
  name: "financialReportDashboard",
  initialState: financialReportinitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(financialReportDashboardApi.pending, (state) => {
        state.isLoadingLeftContent = true;
      })
      .addCase(financialReportDashboardApi.fulfilled, (state, { payload }) => {
        state.isLoadingLeftContent = false;
        state.over_all_report = payload?.data?.data?.over_all_report;

        // start growth data
        state.growth = payload?.data?.data?.growth?.growth_data;
        state.overAllGrowth = payload?.data?.data?.growth?.growth;
        state.overAllGrowthRate = payload?.data?.data?.growth?.growth_rate;
        // end growth data

        //start new customer data
        state.newCustomers = payload?.data?.data?.new_customers.new_customer_data?.map(
          (item) => {
            return {
              ...item,
              value: item?.customers,
            };
          }
        );
        state.overAllNewCustomers =
          payload?.data?.data?.new_customers?.new_customer_count;
        state.overAllNewCustomersRate =
          payload?.data?.data?.new_customers?.new_customer_rate;
        //end new customer data

        //start churn data
        state.churn = payload?.data?.data?.churn.churn_data?.map((item) => {
          return {
            ...item,
            value: item?.churn,
          };
        });
        state.overAllChurn = payload?.data?.data?.churn.churn_count;
        state.overAllChurnRate = payload?.data?.data?.churn.churn_data_rate;
        //end churn data

        //start reactivate data
        state.reactivation = payload?.data?.data?.reactivation.reactivation_data?.map(
          (item) => {
            return {
              ...item,
              value: item?.reactivation,
            };
          }
        );
        state.overAllReactivation =
          payload?.data?.data?.reactivation?.reactivation_count;
        state.overAllReactivationRate =
          payload?.data?.data?.reactivation?.reactivation_data_rate;
        //end reactivate data
      })
      .addCase(financialReportDashboardApi.rejected, (state) => {
        state.isLoadingLeftContent = false;
      })
      .addCase(financialReportCustomerActivityApi.pending, (state) => {
        state.isLoadingRightContent = true;
      })
      .addCase(
        financialReportCustomerActivityApi.fulfilled,
        (state, { payload }) => {
          state.isLoadingRightContent = false;
          state.customerActivityList = payload?.data?.data?.list;
          state.customerActivityTotalRecords =
            payload?.data?.data?.total_records;
        }
      )
      .addCase(financialReportCustomerActivityApi.rejected, (state) => {
        state.isLoadingRightContent = false;
      });
  },
});

export default financialReportDashboardSlice.reducer;
