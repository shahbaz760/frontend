import ListLoading from "@fuse/core/ListLoading";
import { Button } from "@mui/material";
import { changePassword, passwordSetting } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { ArrowIconBlue } from "public/assets/icons/projectsIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import InputField from "src/app/components/InputField";
import TitleBar from "src/app/components/TitleBar";
import { ChangePasswordValidationExtreme, ChangePasswordValidationHigh, ChangePasswordValidationMedium, ChangePasswordValidationWeek } from "src/formSchema";
import { getClientId } from "src/utils";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [passSetting, setPassSetting] = useState()

  const passwordDetails = async () => {
    const { payload } = await dispatch(passwordSetting(''));
    setPassSetting(payload?.data?.data?.password_setting?.is_authenticate)
  }
  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: passSetting == 1 ? ChangePasswordValidationWeek : passSetting == 2 ? ChangePasswordValidationMedium : passSetting == 3 ? ChangePasswordValidationHigh : ChangePasswordValidationExtreme,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleSave = async (values) => {
    setLoading(true);
    const payload = {
      type: 1,
      client_id: 0,
      old_password: values?.old_password,
      new_password: values?.new_password,
    };
    const res = await dispatch(changePassword(payload));
    setLoading(false);
    if (res?.payload?.data?.status) {
      const clientId = getClientId();
      navigate(`/profile${clientId ? `?ci=${clientId}` : ""}`);
    }
  };
  useEffect(() => {
    passwordDetails()
  }, [])
  return (
    <>
      <TitleBar title="Change Password"></TitleBar>
      <div className="px-[28px]">
        <div
          className="flex items-center flex-col gap-[30px]  lg:min-h-[calc(100vh_-_12rem)] bg-white rounded-lg shadow-sm p-20 
        py-[3rem] mt-[3rem]"
        >
          <div className="flex items-start w-full">
          <Button
              startIcon={<ArrowIconBlue />}
              className="text-16 font-500 text-[#111827]"
              onClick={() => {
                const clientId = getClientId();
                navigate(`/profile${clientId ? `?ci=${clientId}` : ""}`);
              }}
            >
              {" "}
              Go Back
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <div className="sm:text-center">
              <h2 className="text-4xl lg:text-[4.8rem] font-600 mb-10">
                Change Password
              </h2>
              <p className="text-lg lg:text-xl text-para_light">
                Here you can change your password by fill the below form.
              </p>
            </div>
            <div className="sm:w-[400px] mt-[4rem] flex flex-col gap-[2rem]">
              <InputField
                type="password"
                label="Old Password"
                name="old_password"
                formik={formik}
                placeholder="Enter Old Password"
                sx={{
                  ".MuiInputBase-input": {
                    paddingRight: "34px",
                  },
                }}
              />
              <InputField
                type="password"
                label="New Password"
                name="new_password"
                formik={formik}
                placeholder="Enter New Password"
                sx={{
                  ".MuiInputBase-input": {
                    paddingRight: "34px",
                  },
                }}
              />
              <InputField
                type="password"
                name="confirm_password"
                formik={formik}
                placeholder="Confirm New Password"
                label="Confirm New Password"
                sx={{
                  ".MuiInputBase-input": {
                    paddingRight: "34px",
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                className="w-full h-[50px] text-[16px] font-400 mt-[4rem]"
                aria-label="Change"
                size="large"
                onClick={() => formik.handleSubmit()}
                disabled={loading} // Disable the button when loading
              >
                {loading ? <ListLoading /> : "Change"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
