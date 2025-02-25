import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";

export const getUserIdInfo: any = createAsyncThunk(
  "get-assigned-userIds",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `get-assigned-userIds`,
      method: "get",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const postKeywordMail: any = createAsyncThunk(
  "postKeywordMail",
  async (payload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/keyword/mail`,
      data: payload,
      method: "post",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
