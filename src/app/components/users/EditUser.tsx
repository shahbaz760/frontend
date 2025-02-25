import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Grid, MenuItem, styled, useTheme } from "@mui/material";
import { RootState, useAppDispatch } from "app/store/store";
import { UpdateUser, getEditUserDetail } from "app/store/User";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  EditUserValidation,
  EditUserValidationExtreme,
  EditUserValidationHigh,
  EditUserValidationMedium,
} from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import SelectField from "../selectField";
import { GetRolePermissionList } from "app/store/Password";
import { passwordSetting } from "app/store/Client";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id?: any;
  setId?: any;
  fetchUserList?: any;
}
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  // "&.MuiMenuItem-root": {
  //   "&:hover": {
  //     backgroundColor: "transparent",
  //   },
  // },
  "& .radioIcon": {
    color: "#9DA0A6",
    border: "2px solid currentColor",
    height: "16px",
    aspectRatio: 1,
    borderRadius: "50%",
    position: "relative",
  },
  "&.Mui-selected": {
    backgroundColor: "transparent",
    "& .radioIcon": {
      color: theme.palette.secondary.main,
      "&::after": {
        content: '""',
        display: "block",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "7px",
        aspectRatio: 1,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    },
  },
}));

function EditUserModal({
  isOpen,
  setIsOpen,
  id,
  setId,
  fetchUserList,
}: IProps) {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<File>(); // Default image path
  const [disable, setDisable] = useState(false);
  const [roleItems, setRoleItems] = useState([]);
  const [error, setError] = useState(null);
  const [previewUrl, setpreviewUrl] = useState<string>("");
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const PasswordState = useSelector((state: RootState) => state.clientUser);
  const dispatch = useAppDispatch();

  const [passSetting, setPassSetting] = useState();

  const passwordDetails = async () => {
    const { payload } = await dispatch(passwordSetting(""));
    setPassSetting(payload?.data?.data?.password_setting?.is_authenticate);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      Lastname: "",
      email: "",
      password: "",
      confirm_password: "",
      role_permission_id: "",
    },
    enableReinitialize: true,
    validationSchema:
      passSetting == 1
        ? EditUserValidation
        : passSetting == 2
          ? EditUserValidationMedium
          : passSetting == 3
            ? EditUserValidationHigh
            : EditUserValidationExtreme,
    onSubmit: (values) => {
      handleEditSave(values);
      // handleCancel();
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setId(null);
  };
  // const roleItems = [
  //   { value: "Developer", label: "Developer" },
  //   { value: "Tester", label: "Tester" },
  //   { value: "Designer", label: "Designer" },
  // ];

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected file
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setpreviewUrl(imageUrl); // Set the new image
    }
  };

  const handleEditSave = async (data) => {
    setDisable(true);
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("first_name", data.name);
    formData.append("last_name", data.Lastname);
    formData.append("email", data.email);
    formData.append("role_permission_id", data.role_permission_id);
    formData.append("password", data.password);
    formData.append("files", selectedImage);
    const res = await dispatch(UpdateUser(formData));
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      setIsOpen(false);
      fetchUserList();
      setDisable(false);
      setId(null);
    } else {
      setDisable(false);
      setIsOpen(true);
      const checkError = res?.payload?.data?.message;
      setError(checkError);
      toast.error(res?.payload?.data?.message);
    }
  };

  const fetchDetails = async (id) => {
    const res = await dispatch(getEditUserDetail(id));
    const data = res?.payload?.data?.data;
    formik.setFieldValue("name", data?.first_name);
    formik.setFieldValue("Lastname", data?.last_name);
    formik.setFieldValue("email", data?.email);
    formik.setFieldValue("role_permission_id", data?.role_permission_id);
    if (data?.user_image) {
      setpreviewUrl(urlForImage + data?.user_image);
    }
    setSelectedImage(data?.files);
  };

  const fetchRoleList = async () => {
    const res = await dispatch(
      GetRolePermissionList({ start: 0, limit: -1, search: "" })
    );
    const data = res?.payload?.data?.data;
    setRoleItems(data?.list);
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, []);

  useEffect(() => {
    fetchRoleList();
    passwordDetails();
  }, []);



  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev);
        handleCancel();
      }}
      modalTitle="Edit User"
      maxWidth="733"
      btnTitle="Save"
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={disable}
    >
      {PasswordState.supportStatus == "loading" ? (
        <div className="">
          <FuseLoading />
        </div>
      ) : (
        <>
          <div className="h-[100px] w-[100px] mb-[2.4rem] relative ">
            <img
              src={previewUrl || "../assets/images/logo/images.jpeg"}
              alt="profile_picture"
              className="w-full h-full rounded-full"
            />
            <input
              type="file"
              accept="image/*" // Allows only image files
              className="hidden" // Hide the file input
              id="file-input" // ID for the label to refer to
              onChange={handleFileChange} // Event handler when the file changes
            />
            <label
              htmlFor="file-input" // The label triggers the file input when clicked
              className="absolute bottom-0 right-0 bg-secondary h-[3.4rem] aspect-square flex items-center justify-center rounded-full border-2 border-white cursor-pointer"
            >
              <span className="absolute bottom-[-2px] right-0 bg-secondary h-[3.4rem] aspect-square flex items-center justify-center rounded-full border-2 border-white cursor-pointer">
                <FuseSvgIcon className="text-white" size={20}>
                  heroicons-outline:camera
                </FuseSvgIcon>
              </span>
            </label>
          </div>
          <div className="flex flex-col gap-20 mb-20">
            <Grid container spacing={2.2}>
              <Grid item md={6} sm={12}>
                <InputField
                  formik={formik}
                  name="name"
                  label="First Name"
                  placeholder="Enter First Name"
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <InputField
                  formik={formik}
                  name="Lastname"
                  label="Last Name"
                  placeholder="Enter Last Name"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2.2}>
              <Grid item md={6} sm={12}>
                <InputField
                  formik={formik}
                  name="email"
                  label="Email Address"
                  placeholder="Enter Email Address"
                  disabled={id}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <SelectField
                  formik={formik}
                  name="role_permission_id"
                  label="Role"
                  placeholder="Select Role"
                  sx={{
                    "& .radioIcon": { display: "none" },
                  }}
                >
                  {roleItems?.map((item) => (
                    <StyledMenuItem key={item.id} value={item.id}>
                      {/* <div className="flex items-center gap-16"> */}
                      <div className="radioIcon" />
                      {/* <div className="rounded-full h-[8px] aspect-square bg-secondary" />
              </div> */}
                      {item.name}
                      {/* </div> */}
                    </StyledMenuItem>
                  ))}
                </SelectField>
              </Grid>
            </Grid>
            <Grid container spacing={2.2}>
              <Grid item md={6} sm={12}>
                <InputField
                  type="password"
                  formik={formik}
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                  sx={{
                    ".MuiInputBase-input": {
                      paddingRight: "34px",
                    },
                  }}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <InputField
                  type="password"
                  formik={formik}
                  name="confirm_password"
                  label="Confirm Password"
                  placeholder="Enter Confirm Password"
                  sx={{
                    ".MuiInputBase-input": {
                      paddingRight: "34px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </CommonModal>
  );
}

export default EditUserModal;
