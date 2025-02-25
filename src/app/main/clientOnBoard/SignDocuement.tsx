import FuseLoading from "@fuse/core/FuseLoading";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RefreshToken, logInAsClient, setPassword } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { projectAddDoc } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import { setInitialState } from "app/theme-layouts/shared-components/navigation/store/navigationSlice";
import { useFormik } from "formik";
import jwtDecode from "jwt-decode";
import { LoginIcon } from "public/assets/icons/dashboardIcons";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { truncateByDomain } from "recharts/types/util/ChartUtils";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import InputField from "src/app/components/InputField";
import { getClientId, getLocalStorage, getToken, getUserDetail } from "src/utils";
import * as Yup from "yup";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function SignDocuement() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { token } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const tokenData: any = token ? jwtDecode(token) : null;
  const [loading, setLoading] = useState(true);
  const userData = getLocalStorage("userData");
  const { jwtService } = useAuth();
  const [name, setName] = useState("");
  const [disable, setDisable] = useState(false);
  const userDetails = getUserDetail()
  const store = useSelector((store: AuthRootState) => store.auth);
  // const Userresponse = localStorage.getItem("jwt_access_token");
  const Userresponse = getToken()
  //* initialise useformik hook
  const ClientId = getClientId()
  const validationSchema = Yup.object({
    name: Yup.string()
      .transform((value) => (value ? value.trim() : ""))
      .required("Name is required.")
      .test(
        "not-only-spaces",
        "Name cannot be only spaces.",
        (value) => value && value.trim().length > 0
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },

    validationSchema,
    onSubmit: (values) => {
      fetchData();
    },
  });

  async function onSubmit(formData: FormType) {
    let data = {
      password: formData.password,
      token,
    };
    setIsLoading(true);
    let { payload } = await dispatch(setPassword(data));
    setIsLoading(false);
    if (payload?.data?.status) {
      navigate("/sign-in");
    }
  }
  const fetchData = async () => {
    setDisable(true);
    const payload = {
      name: formik.values?.name,
      token: Userresponse,
      is_private: 0,
      assign_users: []
    };
    const redirect = async () => {
      await jwtService.autoSignIng();
    };
    try {
      const res = await dispatch(projectAddDoc(payload));
      // if (res?.payload?.data?.status == 1) {
      await fetchDataRefresh()

      window.location.reload()
      let localData = getLocalStorage("userDetail");

      // let newItem = res?.payload?.data.data;
      // let projects = [...localData.user.projects, newItem];

      setDisable(false);
      if (ClientId) {
        navigate("/dashboard" + `?ci=${ClientId}`);
      } else {
        redirect();
      }
      // }
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const fetchDataRefresh = async () => {
    try {
      const payload = {
        token: Userresponse,
      };

      //@ts-ignore
      const res = await dispatch(RefreshToken(payload));
      dispatch(setInitialState(res?.payload?.data?.data?.user));
      // localStorage.setItem(
      //   "userDetail",
      //   JSON.stringify(res?.payload?.data?.user)
      // );
      // localStorage.setItem("userDetail", JSON.stringify(res?.payload?.data?.));

      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {

  //   fetchDataRefresh();
  // }, []);

  const backToAccount = () => {
    const token = getToken();
    const tokenData: any = jwtDecode(token);
    const adminId = tokenData?.admin_id;
    const clientId = tokenData?.user?.id;
    const PrevuserDetails = JSON.parse(localStorage.getItem("userDetail"))
    dispatch(logInAsClient(adminId)).then((res) => {

      jwtService.handleSignInSuccess(
        res?.payload?.data?.user,
        res?.payload?.data?.access_token
      );
    });

    setTimeout(() => {
      if (PrevuserDetails?.role_id == 1) {
        window.location.href = "/admin/dashboard";
      }
      else {
        window.location.href = "/accountManager/dashboard";
      }
    }, 1000);
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const clientId = getClientId()
  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) => key.includes(clientId));

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  return (
    <>
      {loading && <FuseLoading />}
      {!loading && (
        <div className="flex justify-center items-center flex-col h-screen gap-60 px-28 ">
          <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
          <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
          <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />

          <img src="assets/icons/remote-icon.svg" alt="" />
          {/* {tokenData?.role_id == 2 && tokenData?.is_admin && (
            <Button
              variant="outlined"
              color="secondary"
              className="h-[40px] text-[16px] flex gap-8 font-[600]"
              aria-label="Add Tasks"
              size="large"
              onClick={() => backToAccount()}
            >
              Back To Account
              <LoginIcon color='#4f46e5' />
            </Button>
          )} */}

          <div className="bg-[#fff] sm:min-w-[50%] h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
            <div className="flex flex-col justify-center gap-40">
              <Typography className="text-[48px] text-center font-700 leading-normal">
                Let’s Start
                <p className="text-[18px] font-400 text-[#757982] leading-4 pt-20">
                  To begin, kindly include the name of your project.
                </p>
              </Typography>
              <InputField
                formik={formik}
                name="name"
                // value={name}
                // onChange={(e) => setName(e.target.value)}
                label="Name Your First Project"
                placeholder="Enter Your First Project Name"
                className="text-[16px] font-500 text-[#111827] leading-3"
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                disabled={disable}
                className="text-[18px] font-500"
                onClick={handleSubmit}
              >
                {disable ? (
                  <Box
                    marginTop={0}
                    id="spinner"
                    sx={{
                      "& > div": {
                        backgroundColor: "palette.secondary.main",
                      },
                    }}
                  >
                    <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                    <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                    <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
                  </Box>
                ) : (
                  'Save'
                )}

              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
