// breadcrumbsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  breadcrumbs: [],
  breadCrumbFor: "",
};

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    setBreadcrumbFor: (state, action) => {
      state.breadCrumbFor = action.payload;
    },
  },
});

export const { setBreadcrumbs, setBreadcrumbFor } = breadcrumbsSlice.actions;
export default breadcrumbsSlice.reducer;
