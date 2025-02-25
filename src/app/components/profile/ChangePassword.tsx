import { changePassword, passwordSetting } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router";
import { changePasswordByAdminExtreme, changePasswordByAdminHigh, changePasswordByAdminMedium, changePasswordByAdminWeek, changePasswordByClientExtreme, changePasswordByClientHight, changePasswordByClientMedium, changePasswordByClientWeek } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import { decodeJWT } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  role?: string;
  user_id?: number | string;
}
const userType = {
  admin: 2,
  client: 1,
  "account manager": 2,
};

function ChangePassword({ isOpen, setIsOpen, role, user_id }: IProps) {
  const dispatch = useAppDispatch();
  const [passSetting, setPassSetting] = useState()
  const [isLoading, setisLoading] = useState(false);

  const onSubmit = async (values, { resetForm }) => {
    let requestData = {
      type: userType[role],
      new_password: values.new_password,
      client_id: user_id,
    };
    // if (user_id === 3) {
    //   requestData["client_id"] = agent_id;
    // } else if (user_id === 4) {
    //   requestData["client_id"] = accountManager_id;
    // } else {
    //   requestData["client_id"] = client_id;
    // }

    if (userType[role] == 1) {
      requestData["old_password"] = values.old_password;
    }
    setisLoading(true);
    const { payload } = await dispatch(changePassword(requestData));
    if (payload?.data?.status) {
      setIsOpen(false);
      resetForm();
    }
    setisLoading(false);
  };
  const passwordDetails = async () => {
    const { payload } = await dispatch(passwordSetting(''));
    setPassSetting(payload?.data?.data?.password_setting?.is_authenticate)
  }

  const formik = useFormik({
    initialValues:
      userType[role] == 2
        ? {
          new_password: "",
          cnfPassword: "",
        }
        : {
          old_password: "",
          new_password: "",
          cnfPassword: "",
        },
    validationSchema:
      userType[role] == 2 ? passSetting == 1 ? changePasswordByAdminWeek : passSetting == 2 ? changePasswordByAdminMedium : passSetting == 3 ? changePasswordByAdminHigh : changePasswordByAdminExtreme : passSetting == 1 ? changePasswordByClientWeek : passSetting == 2 ? changePasswordByClientMedium : passSetting == 3 ? changePasswordByClientHight : changePasswordByClientExtreme,
    onSubmit,
  });

  useEffect(() => {
    formik.resetForm();
    passwordDetails()
  }, [isOpen]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen((prev) => !prev)}
      modalTitle="Change Password"
      maxWidth="733"
      btnTitle={"Change"}
      closeTitle={"Close"}
      disabled={isLoading}
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col gap-20 ">
        {role !== "admin" && role !== "account manager" && (
          <InputField
            formik={formik}
            name="oldPass"
            type="old_password"
            label="Old Password"
            placeholder="Enter Old Password"
          />
        )}
        <InputField
          formik={formik}
          name="new_password"
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
          type="password"
          label="Confirm Password"
          placeholder="Enter Confirm Password"
          sx={{
            ".MuiInputBase-input": {
              paddingRight: "34px",
            },
          }}
        />
      </div>
    </CommonModal>
  );
}

export default ChangePassword;
