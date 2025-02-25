import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { customChatInitialStates, customChatProp } from "./interface";
import toast from "react-hot-toast";

export const addCustomChatMessage: any = createAsyncThunk(
  "client/add",
  async (payload: customChatProp, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "project/task/add-message",
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const getCustomChatMessage: any = createAsyncThunk(
  "client/get",
  async (
    payload: { start: number; task_id: number; limit: number },
    { dispatch }
  ) => {
    const response = await ApiHelperFunction({
      url: `project/task-chat/${payload.task_id}/?start=${payload.start}&limit=${payload.limit}`,
      method: "get",
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

const initialState: customChatInitialStates = {
  chats: [],
  isAddLoadingChats: false,
  total_length: null,
  status: "idle",
};

export const CustomChatSlice = createSlice({
  name: "customChat",
  initialState,
  reducers: {
    handleResetChats(state) {
      state.chats = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCustomChatMessage.pending, (state) => {
        state.isAddLoadingChats = true;
      })
      .addCase(getCustomChatMessage.fulfilled, (state, { payload }) => {
        state.isAddLoadingChats = false;
        state.chats = payload?.data?.data?.list;
        state.total_length = payload?.data?.data?.total_records;
      })
      .addCase(getCustomChatMessage.rejected, (state) => {
        state.isAddLoadingChats = false;
      })
      .addCase(addCustomChatMessage.pending, (state) => {
        state.isAddLoadingChats = true;
      })
      .addCase(addCustomChatMessage.fulfilled, (state, { payload }) => {
        toast.remove();
        state.isAddLoadingChats = false;
      })
      .addCase(addCustomChatMessage.rejected, (state) => {
        state.isAddLoadingChats = false;
      });
  },
});
export const { handleResetChats } = CustomChatSlice.actions;
export default CustomChatSlice.reducer;
