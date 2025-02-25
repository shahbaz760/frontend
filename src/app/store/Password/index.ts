import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiHelperFunction from "src/api";
import { calculatePageNumber } from "src/utils";
import { ClientInfo, ClientType, initialStateProps } from "./Interface";
// import { getAgentList } from "../Agent";

/**
 * API calling
 */

/**
 * The initial state of the auth slice.
 */
export const initialState: initialStateProps = {
  status: "idle",
  supportStatus: "idle",
  fetchStatus: "loading",
  supportDetailsStatus: "loading",
  list: [],
  assignedAgentDetail: [],
  assignAccManagerDetail: [],
  total_records: 0,
  total_items: 0,
  Support_total_records: 0,
  Support_total_items: 0,
  details: {},
  data: {},
  accManagerdata: {},
  supportlist: [],
  statusList: "idle",
  Departmentstatus: "idle",
  managerStatus: "idle",
};

export const addPassword = createAsyncThunk(
  "/client/add-password-manager",
  async (payload: ClientType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/client/add-password-manager",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetPasswordList: any = createAsyncThunk(
  "client/list-password-manager",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/list-password-manager",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deletePassword = createAsyncThunk(
  "client/delete-password-manage",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/delete-password-manager/${payload.password_manager_id}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const getEditPasswordDetail = createAsyncThunk(
  "client/details-password-manager",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/details-password-manager/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UpdatePassword = createAsyncThunk(
  "/client/update-password-manager",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/client/update-password-manager",
      method: "put",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const GetFileList: any = createAsyncThunk(
  "client/shared-files-list",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/shared-files-list",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetFileUrl: any = createAsyncThunk(
  "client/get-shared-file",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/get-shared-file/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const addFileList = createAsyncThunk(
  "client/shared-file-upload",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/shared-file-upload",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const deleteFile = createAsyncThunk(
  "client/shared-file-delete",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/shared-file-delete/${payload.password_manager_id}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const GetProfile: any = createAsyncThunk(
  "user-profile/details",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "user-profile/details",
      method: "get",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const updateMyProfile = createAsyncThunk(
  "user-profile/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `user-profile/update`,
      method: "put",
      data: payload.formData,
      formData: true,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const GetSupportList: any = createAsyncThunk(
  "support/list",
  async (payload: ClientInfo, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "support/list",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const addSupportList = createAsyncThunk(
  "/support/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/support/add",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const DeleteSupportList = createAsyncThunk(
  "support/delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `support/delete//${payload.password_manager_id}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const addSupportMarkClose = createAsyncThunk(
  "support/mark-as-close",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/support/mark-as-close",
      method: "post",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const updateSupportList = createAsyncThunk(
  "support/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `support/update`,
      method: "put",
      data: payload,
      formData: true,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const addSupportMessage = createAsyncThunk(
  "support/add-message",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `support/add-message`,
      method: "post",
      data: payload,
      formData: true,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const getEditSupporttDetail = createAsyncThunk(
  "support/details/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `support/details/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

// -----department------

export const DepartmentAdd = createAsyncThunk(
  "department/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/department/add`,
      method: "post",
      data: payload,
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const GetDepartmentList: any = createAsyncThunk(
  "department/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/department/list",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/delete/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/department/delete/${payload.password_manager_id}`,
      method: "delete",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const getEditDepartmentDetail = createAsyncThunk(
  "department/details",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `department/details/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UpdateDepartment = createAsyncThunk(
  "/department/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/department/update",
      method: "put",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
// --------default AccountManage--------
export const getDefaultDetail = createAsyncThunk(
  "/client/default-Account-Manager/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `/client/default-Account-Manager/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UpdateReminder: any = createAsyncThunk(
  "client/update-reminder-setting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/update-reminder-setting",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const UpdateGlobalReminder: any = createAsyncThunk(
  "/global/two-factor-authentication/update",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/global/two-factor-authentication/update",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetReminder: any = createAsyncThunk(
  "/client/get-reminder-setting",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/client/get-reminder-setting",
      method: "get",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetRolePermissionList: any = createAsyncThunk(
  "setting/role-and-permission/list",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "setting/role-and-permission/list",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const DeleteRolePermissionList: any = createAsyncThunk(
  "setting/delete-role-and-permission/",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `setting/delete-role-and-permission/${payload}`,
      method: "delete",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const AddRoleandPermission: any = createAsyncThunk(
  "setting/role-and-permission/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/setting/role-and-permission/add",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const EditRoleandPermission: any = createAsyncThunk(
  "setting/update-role-and-permission",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `setting/update-role-and-permission/${payload.id}`,
      method: "put",
      data: payload.formvalue,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const AddClientRoleandPermission: any = createAsyncThunk(
  "client/setting/role-and-permission/add",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/setting/role-and-permission/add",
      method: "post",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const EditClientRoleandPermission: any = createAsyncThunk(
  "client/setting/update-role-and-permission",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `client/setting/update-role-and-permission/${payload.id}`,
      method: "put",
      data: payload.formvalue,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);
export const GetRoleandPermissionDetails: any = createAsyncThunk(
  "setting/get-role-and-permission",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `setting/get-role-and-permission/${payload}`,
      method: "get",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const GetGlobalReminder: any = createAsyncThunk(
  "/global/two-factor-authentication/get",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/global/two-factor-authentication/get",
      method: "get",
      data: payload,
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

/**
 * The auth slice.
 */
export const PasswordSlice = createSlice({
  name: "PasswordSlice",
  initialState,
  reducers: {
    changeFetchStatus: (state) => {
      state.fetchStatus = "loading";
    },
    sortColumn: (state, { payload }) => {
      state.list = payload || [];
      state.assignedAgentDetail = payload || [];
      state.assignAccManagerDetail = payload || [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(GetPasswordList.pending, (state) => {
        state.statusList = "loading";
      })
      .addCase(GetPasswordList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.statusList = "idle";
        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.list = response?.data?.list || [];

        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
        // }
      })
      .addCase(GetPasswordList.rejected, (state, action) => {
        state.statusList = "idle";
      })

      .addCase(GetFileList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetFileList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.status = "idle";
        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.list = response?.data?.list || [];

        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
        // }
      })
      .addCase(GetFileList.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(GetProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetProfile.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.status = "idle";

        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.details = response?.data || {};

        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          20
        );
        state.total_items = response?.data?.total_count;
        // }
      })
      .addCase(GetProfile.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(GetRolePermissionList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(GetRolePermissionList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        const { limit } = action.meta?.arg;
        state.status = "idle";

        state.list = response?.data?.list || [];
        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
      })
      .addCase(GetRolePermissionList.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(GetSupportList.pending, (state) => {
        state.supportStatus = "loading";
      })
      .addCase(GetSupportList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.supportStatus = "idle";
        const { limit } = action.meta?.arg;
        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.supportlist = response?.data?.list || [];

        state.Support_total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.Support_total_items = response?.data?.total_count;
        // }
      })
      .addCase(GetSupportList.rejected, (state, action) => {
        state.supportStatus = "idle";
      })

      .addCase(getEditSupporttDetail.pending, (state) => {
        state.supportDetailsStatus = "loading";
      })
      .addCase(getEditSupporttDetail.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.supportDetailsStatus = "idle";
      })
      .addCase(getEditSupporttDetail.rejected, (state, action) => {
        state.supportDetailsStatus = "idle";
      })

      .addCase(GetDepartmentList.pending, (state) => {
        state.Departmentstatus = "loading";
      })
      .addCase(GetDepartmentList.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.Departmentstatus = "idle";
        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.list = response?.data?.list || [];
        const { limit } = action.meta?.arg;
        state.total_records = calculatePageNumber(
          response?.data?.total_records,
          limit
        );
        state.total_items = response?.data?.total_count;
        // }
      })
      .addCase(GetDepartmentList.rejected, (state, action) => {
        state.Departmentstatus = "idle";
      })

      .addCase(getDefaultDetail.pending, (state) => {
        state.status = "loading";
        state.managerStatus = "loading";
      })
      .addCase(getDefaultDetail.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.status = "idle";
        state.managerStatus = "idle";

        // if (!response?.status) {
        //   // toast.error(response?.message);
        // } else {
        state.accManagerdata = response?.data;

        // }
      })
      .addCase(getDefaultDetail.rejected, (state, action) => {
        state.status = "idle";
        state.managerStatus = "idle";
      })
      .addCase(GetRoleandPermissionDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetRoleandPermissionDetails.fulfilled, (state, action) => {
        const response = action.payload?.data;
        state.status = "idle";
        state.data = response?.data;
      })
      .addCase(GetRoleandPermissionDetails.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { changeFetchStatus, sortColumn } = PasswordSlice.actions;

export default PasswordSlice.reducer;
