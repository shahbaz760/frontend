import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ApiHelperFunction from "src/api";
import {
  ApiResponse,
  ForgotPassPayload,
  LoginPayload,
  LoginSocialPayload,
  SetPasswordType,
  TwoFactorAuthentication,
  initialStateProps,
  refreshToken,
} from "./Interface";

import { getClientId, getUserDetail } from "src/utils";

// Define a type for the payload

export const initialState: initialStateProps = {
  status: "idle",
  email: "",
  userData: [],
  UserResponse: [],
  error: "",
  selectedOption: "Past 7 Days",
  selectedOptionBar: "Past 7 Days",
  // navigation: [],
};

/**
 * API calling
 */
export const logIn = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/login", // end point
      method: "post", // method
      data: payload, // payload data
      dispatch,
    });

    let resData = response?.data;
    return resData;
  }
);
export const logOut = createAsyncThunk(
  "auth/logout",
  async (payload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/logout", // end point
      method: "post", // method
      data: payload, // payload data
      dispatch,
    });

    let resData = response?.data;
    return resData;
  }
);
/**
 * API calling for login as Client */
export const logInAsClient = createAsyncThunk(
  "auth/loginAsClient",
  async (userId: string, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: `auth/admin-login-as-client/${userId}`, // end point
      method: "get", // method
      dispatch,
    });

    let resData = response?.data;
    return resData;
  }
);

export const sociallogIn = createAsyncThunk(
  "auth/social-login",
  async (payload: LoginSocialPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/social-login", // end point
      method: "post", // method
      data: payload, // payload data
      dispatch,
    });

    let resData = response?.data;
    return resData;
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (payload: ForgotPassPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/forgot-password",
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

export const ResendPassword = createAsyncThunk(
  "/resend-otp",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "/resend-otp",
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

export const restPassword = createAsyncThunk(
  "auth/reset-password",
  async (payload: ForgotPassPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/reset-password",
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

export const RefreshToken = createAsyncThunk(
  "auth/refresh-token",
  async (payload: refreshToken, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "auth/refresh-token",
      method: "get",
      headers: { Authorization: `Bearer ${payload.token}` },
      dispatch,
    });
    return {
      data: response.data,
    };
  }
);

export const DocSignVarification = createAsyncThunk(
  "client/click-docusign-link",
  async (payload: refreshToken, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/click-docusign-link",
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

export const dashboardCount = createAsyncThunk(
  "get-dashboard-count",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "get-dashboard-count",
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

export const UpdateSuccess = createAsyncThunk(
  "agent/complete-profile",
  async (payload: refreshToken, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "agent/complete-profile",
      method: "get",
      headers: { Authorization: `Bearer ${payload.token}` },
      dispatch,
    });
    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const verifyOtp = createAsyncThunk(
  "otp-verify",
  async (payload: ForgotPassPayload, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "otp-verify",
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

export const verify2faOtp = createAsyncThunk(
  "otp-verify",
  async (payload: any, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "otp-verify",
      method: "post",
      data: payload.data,
      dispatch,
      headers: { Authorization: `Bearer ${payload?.token}` },
    });

    // Return only the data you need to keep it serializable
    return {
      data: response.data,
    };
  }
);

export const setPassword = createAsyncThunk(
  "client/set-password",
  async (payload: SetPasswordType, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "client/set-password",
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

export const twoFactorAuthentication = createAsyncThunk(
  "user/two-factor-authentication",
  async (payload: TwoFactorAuthentication, { dispatch }) => {
    const response = await ApiHelperFunction({
      url: "user/two-factor-authentication",
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
/**
 * The initial state of the auth slice.
 */

/**
 * The auth slice.
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restAll: (state) => {
      state.error = "";

      // state.selectedColumn = [];
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setSelectedOptionBar: (state, action) => {
      state.selectedOptionBar = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(RefreshToken.fulfilled, (state, action) => {
        const { data } = action.payload as ApiResponse; // Assert type
        const userDetail = getUserDetail();

        if (userDetail?.is_signed != data?.data?.user?.is_signed) {
          window.location.reload();
        }
        if (data.status) {
          state.userData = data?.data?.user?.subscription_and_docusign || [];
          state.UserResponse = data?.data;

          localStorage.setItem("response", JSON.stringify(data?.data));
          localStorage.setItem(
            "userData",
            JSON.stringify(data?.data?.user?.subscription_and_docusign || [])
          );
          if (data?.data?.user) {
            const clientId = getClientId();
            const dataKey = clientId ? `${clientId}userDetail` : "userDetail";
            localStorage.setItem(dataKey, JSON.stringify(data?.data?.user));
          }
        }
      })
      // .addCase(verify2faOtp.fulfilled, (state, action) => {
      //   const { data } = action.payload as ApiResponse; // Assert type
      //   if (data.status) {
      //     state.userData = data?.data?.user?.subscription_and_docusign || [];
      //     state.UserResponse = data?.data;
      //     localStorage.setItem("response", JSON.stringify(data?.data));
      //     localStorage.setItem(
      //       "userData",
      //       JSON.stringify(data?.data?.user?.subscription_and_docusign || [])
      //     );
      //     localStorage.setItem("userDetail", JSON.stringify(data?.data?.user));
      //   }
      // })

      .addCase(logIn.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        if (
          payload?.status == 1 &&
          payload?.data?.two_factor_authentication == 0
        ) {
          toast.success(payload?.message);
        } else {
          // toast.error(payload?.message);
          state.error = payload?.message;
        }
      })
      .addCase(sociallogIn.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        if (payload?.status != 1) {
          // toast.error(payload?.message);
          state.error = payload?.message;
        }
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        if (payload?.data?.status) {
          state.email = action?.meta?.arg?.email;
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(ResendPassword.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type

        if (payload?.data?.status) {
          state.email = action?.meta?.arg?.email;
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        const { data } = action.payload as ApiResponse;
        if (payload?.data?.status) {
          localStorage.setItem("response", JSON.stringify(data?.data));
          localStorage.setItem(
            "userData",
            JSON.stringify(data?.data?.user?.subscription_and_docusign || [])
          );
          localStorage.setItem(
            "userDetail",
            JSON.stringify(data?.data?.user || [])
          );
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      })
      .addCase(restPassword.fulfilled, (state, action) => {
        const payload = action.payload as ApiResponse; // Assert type
        if (payload?.data?.status) {
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
      });
  },
});

export const { restAll, setSelectedOption, setSelectedOptionBar } =
  authSlice.actions;

export default authSlice.reducer;
