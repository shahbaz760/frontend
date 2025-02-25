import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { setPassword } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import AuthBox from "src/app/components/AuthBox";
import InputField from "src/app/components/InputField";
import {
  resetPassSchemaExtreme,
  resetPassSchemaHigh,
  resetPassSchemaMedium,
  resetPassSchemaWeek,
} from "src/formSchema";
import { decodeJWT } from "src/utils";

type FormType = {
  cnfPassword: string;
  password: string;
};
export default function SetPassword() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const store = useSelector((store: AuthRootState) => store.auth);
  const { jwtService } = useAuth();
  const details = decodeJWT(token);
  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      cnfPassword: "",
      password: "",
    },
    validationSchema:
      details?.password_setting == 1
        ? resetPassSchemaWeek
        : details?.password_setting == 2
          ? resetPassSchemaMedium
          : details?.password_setting == 3
            ? resetPassSchemaHigh
            : resetPassSchemaExtreme,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(formData: FormType) {
    let data = {
      password: formData.password,
      token,
    };
    setIsLoading(true);
    let response = await dispatch(setPassword(data));
    if (response?.payload?.data?.status == 0) {
      toast.error(response?.payload?.data?.message);
    }
    setIsLoading(false);
    // if (response?.payload?.data?.status) {
    // navigate('/sign-in')
    await jwtService.ResetsignIn(response);
    // } else {
    //   toast.error(response?.payload?.data?.message);
    // }
  }

  return (
    <div className="flex flex-col items-center flex-1 min-w-0 sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Paper className="flex justify-center w-full h-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-64 md:shadow-none">
        <CardContent className="mx-auto max-w-420 sm:mx-0 sm:w-420">
          <div className="flex items-center">
            <img src="assets/icons/remote-icon.svg" alt="" />
          </div>

          <Typography className="mt-96 text-[48px] font-bold leading-tight tracking-tight">
            Set Password
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography className="text-[18px] text-[#757982] mt-8 max-w-[480px]">
              Please set your password by entering a new password.
            </Typography>
          </div>

          <div className="w-full mt-40 max-w-[417px] flex gap-16 flex-col">
            {" "}
            <InputField
              formik={formik}
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter New Password"
              sx={{
                ".MuiInputBase-input": {
                  paddingRight: "34px",
                },
              }}
            />
            <InputField
              formik={formik}
              name="cnfPassword"
              label="Confirm Password"
              type="password"
              placeholder="Enter Confirm Password"
              sx={{
                ".MuiInputBase-input": {
                  paddingRight: "34px",
                },
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              className="mt-20 w-full h-[50px] text-[18px] font-bold"
              aria-label="Log In"
              size="large"
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
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
                "Set Password"
              )}
            </Button>
          </div>
        </CardContent>
      </Paper>
      <AuthBox />
    </div>
  );
}
