import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "app/store/types";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";
import { initialStateProps } from "./Interafce";

/**
 * API calling
 */

export const addProductCart = createAsyncThunk(
  "client/buy-subscription",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/buy-subscription",
      method: "post",
      data: payload,
      dispatch,
    });
    // console.log(response, "checkk");

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getProductPublicList = createAsyncThunk(
  "public-product/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/public-product/list`,
      method: "post",
      data: payload,
      dispatch,
    });

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
  total:0,
  subscriptionData:[],
  productList: [],
};

/**
 * The auth slice.
 */
export const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addProductCart.pending, (state) => {
        state.actionStatus = true;
      })
      .addCase(addProductCart.fulfilled, (state, action) => {
        const payload = action?.payload as ApiResponse;
        state.actionStatus = false;
        if (payload?.data?.status) {
          // toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(addProductCart.rejected, (state, { error }) => {
        toast.error(error?.message);
        state.actionStatus = false;
      })
      .addCase(getProductPublicList.pending, (state) => {
        state.status = "loading";
        state.actionStatus = true;
      })
      .addCase(getProductPublicList.fulfilled, (state, action) => {
        const response = action?.payload?.data;
        // console.log(response, "findttt");
        const { data } = action?.payload?.data;
        console.log(action?.payload, "dgftdfdf");
        state.productList = data?.list;

        state.subscriptionData = action?.payload?.data?.subscription_setting;
        state.total = data?.total_records
        // console.log(state.searchAgentList, "serch");
        state.actionStatus = false;
        state.status = "idle";
      })
      .addCase(getProductPublicList.rejected, (state, action) => {
        state.actionStatus = false;
        state.status = "idle";
      });
  },
});

export default productSlice.reducer;
