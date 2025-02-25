import { getAccManagerInfo } from "app/store/AccountManager";
import { RefreshToken } from "app/store/Auth";
import store, { useAppDispatch } from "app/store/store";
// import { setInitialState } from "app/theme-layouts/shared-components/navigation/store/navigationSlice";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useNavigate, useNavigation } from "react-router";
import { getClientId, getUserDetail } from "src/utils";

interface ApiResponse {
  data?: any;
  error?: AxiosError;
}

// Extend AxiosRequestConfig to include formData property
interface RequestConfig extends AxiosRequestConfig {
  formData?: boolean; // Optional property indicating if this request uses FormData;
  dispatch: any;
}

const ApiHelperFunction = async ({
  url,
  method,
  data,
  params,
  formData,
  dispatch,
  headers = null,
}: RequestConfig): Promise<ApiResponse> => {
  // const navigate = useNavigate();
  let handle402Count = 0;
  let handle402Counts = 0;
  let userDetail = JSON.parse(localStorage.getItem("userDetail"));
  try {
    Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
    let requestObj = { url, method, data, params };

    // check if payload type has formData then append headers key
    if (formData)
      requestObj["headers"] = { "Content-Type": "multipart/form-data" };
    if (headers) {
      requestObj["headers"] = {
        ...requestObj["headers"],
        ...headers,
      };
    }
    const data1 = await Axios(requestObj);
    const isVerification = window.location.pathname.includes("verification");
    // if (result?.data?.code == 402 && !isVerification) {
    //   localStorage.clear();
    //   window.location.href =
    //     "/verification/" + result?.data?.data?.access_token;
    // }
    const params1 = new URLSearchParams(window.location.search);
    if (
      data1?.data?.code == 402 &&
      handle402Count < 4 &&
      userDetail?.role_id != 2 &&
      (data1?.data?.data?.user?.projects == false ||
        data1?.data?.data?.user?.subscription_and_docusign.length > 0)
    ) {
      handle402Count++;
      const userDetail = getUserDetail();

      // if (userDetail.is_signed != data1?.data?.data?.user?.is_signed) {
      if (data1?.data?.status) {
        localStorage.setItem("response", JSON.stringify(data1?.data));
        localStorage.setItem(
          "userData",
          JSON.stringify(
            data1?.data?.data?.user?.subscription_and_docusign || []
          )
        );
        if (data1?.data?.data?.user) {
          const clientId = getClientId();
          const dataKey = clientId ? `${clientId}userDetail` : "userDetail";
          if (!window.location.pathname.includes("dashboard")) {
            window.location.href = clientId
              ? "/dashboard" + `?ci=${clientId}`
              : "/dashboard";
          }
          // if (
          //   !params1.get("reload") &&
          //   !window.location.pathname.includes("dashboard")
          // ) {
          //   window.location.href = clientId
          //     ? "/dashboard?ci=" + clientId + "&reload=true"
          //     : "/dashboard" + "?reload=true";
          // }
          // }
          localStorage.setItem(
            dataKey,
            JSON.stringify(data1?.data?.data?.user)
          );

          const { appSelector } = await import("app/store/store");
          const { setInitialState } = await import(
            "app/theme-layouts/shared-components/navigation/store/navigationSlice"
          );
          if (data1?.data?.data?.user) {
            dispatch(setInitialState(data1?.data?.data?.user));
            setTimeout(() => {
              dispatch(setInitialState(data1?.data?.data?.user));
            }, 1000);
          }
        }
      }
      // }
    }

    return { data: data1.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError;

    if (error?.response) {
      return { data: error.response.data };
    } else {
      throw error;
    }
  }
};
export default ApiHelperFunction;
