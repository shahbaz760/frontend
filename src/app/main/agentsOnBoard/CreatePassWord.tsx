import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { setPassword } from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import InputField from "src/app/components/InputField";
import { resetPassSchemaExtreme, resetPassSchemaHigh, resetPassSchemaMedium, resetPassSchemaWeek } from "src/formSchema";
import { decodeJWT } from "src/utils";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function CreatePassword() {
  // State to track loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const store = useSelector((store: AuthRootState) => store.auth);
  const details = decodeJWT(token)
  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      cnfPassword: "",
      password: "",
    },
    validationSchema: details?.password_setting == 1 ? resetPassSchemaWeek : details?.password_setting == 2 ? resetPassSchemaMedium : details?.password_setting == 2 ? resetPassSchemaHigh : resetPassSchemaExtreme,
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
    let { payload } = await dispatch(setPassword(data));
    setIsLoading(false);
    if (payload?.data?.status) {
      navigate("/sign-in");
    }
  }

  return (
    <>
      <div className="flex items-center flex-col gap-32 py-28 ">
        <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
        <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
        <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />
        <div className="text-center">
          <img src="assets/icons/remote-icon.svg" alt="" />
        </div>

        <div className="bg-[#fff] sm:min-w-[60%] h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
          <div className="flex flex-col justify-center gap-40">
            <Typography className="text-[48px] text-center font-700 leading-normal">
              Create Password
              <p className="text-[18px] font-400 text-[#757982] leading-4 pt-20">
                To get started, please create your password
              </p>
            </Typography>
            <div>
              <InputField
                formik={formik}
                type="password"
                name="new password "
                label="New Password "
                placeholder="Enter New Password"
                className="text-[16px] font-500 text-[#111827] leading-3 pb-20"
              />
              <InputField
                formik={formik}
                type="password"
                name="confirm password "
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                className="text-[16px] font-500 text-[#111827] leading-3"
              />
            </div>
            <Link to="/sign-doc">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className="text-[18px] font-500 w-full"
              >
                Save
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
