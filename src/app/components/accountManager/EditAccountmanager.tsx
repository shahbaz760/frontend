import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { accManagerSchema } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { restAll } from "app/store/Agent";
import { useSelector } from "react-redux";

import { MenuItem, styled } from "@mui/material";
import { addAccManager, updateAccManagerList } from "app/store/AccountManager";
import {
  AccManagerRootState,
  AccManagerType,
} from "app/store/AccountManager/Interface";
import { ClientType } from "app/store/Client/Interface";
import { useParams } from "react-router-dom";
import SelectField from "../selectField";
import { GetRolePermissionList } from "app/store/Password";
import { getUserDetail } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchManagerList?: () => void;
  isEditing: boolean;
}
type FormType = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number | string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipcode: number | string;
  country: string;
};

type profileState = {
  value: string;
  label: string;
};

export const profileStatus: profileState[] = [
  { value: "Active", label: "Active" },
  { value: "Suspended", label: "Suspended" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Pending", label: "Pending" },
];
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
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

function EditAccountManagerModel({
  isOpen,
  setIsOpen,
  fetchManagerList,
  isEditing,
}: IProps) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  // const agentState = useSelector((store: AgentRootState) => store.agent);
  const accmanagerState = useSelector(
    (store: AccManagerRootState) => store.accManagerSlice
  );
  const { accManagerDetail, accClientList, actionStatus } = useSelector(
    (store: AccManagerRootState) => store.accManagerSlice
  );
  const { total_items, status, total_records, list } = useSelector(
    (state: RootState) => state.password
  );
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const userDetails = getUserDetail();
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));

  const [selectedImage, setSelectedImage] = useState<File>(); // Default image path
  const [previewUrl, setpreviewUrl] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected file
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setpreviewUrl(imageUrl); // Set the new image
    }
  };
  const { accountManager_id } = useParams();

  const onSubmit = async (values: AccManagerType, { resetForm }) => {
    const formData = new FormData();
    let payload;
    if (accountManager_id) {
      formData.append("account_manager_id", accountManager_id);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("phone_number", String(values.phone_number));
      formData.append("address", values.address);
      formData.append("role_permission_id", values.role_permission_id);

      // Dispatch action to update account manager

      if (selectedImage) {
        formData.append("files", selectedImage);
      }
      formData.append("address2", values.address2);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("zipcode", values.zipcode.toString());

      payload = await dispatch(
        updateAccManagerList({
          formData,
          account_manager_id: accountManager_id,
        })
      );
      setIsOpen((prev) => !prev);
    } else {
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("phone_number", String(values.phone_number)); // Convert number to string
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("role_permission_id", values.role_permission_id);
      if (selectedImage) {
        formData.append("files", selectedImage);
      }

      await dispatch(addAccManager({ formData }));
    }

    if (payload?.data?.status) {
      resetForm();
    }
    fetchManagerList();
    setIsOpen((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: null,
      email: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      role_permission_id: "",
    },
    validationSchema: accManagerSchema,
    onSubmit,
  });
  useEffect(() => {
    if (!!accmanagerState?.successMsg) {
      dispatch(restAll());
      setIsOpen(false), formik.resetForm();
      // fetchManagerList();
    } else if (!!accmanagerState?.errorMsg) {
      setIsOpen(true);
      // dispatch(restAll());
    }
  }, [accmanagerState]);

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const handleMenuItemClick = (data: ClientType) => {
    if (data.userName === "All") {
      // Toggle select all
      const allSelected = !selectAll;
      setSelectAll(allSelected);
      let newArray = [];
      let res = allSelected
        ? accClientList.forEach((name: ClientType) => {
          if (name.userName !== "All") {
            newArray.push(name.id);
          }
        })
        : [];

      setSelectedItems(newArray);
      // setSelectedItems(
      //   allSelected
      //     ? accClientList.filter((name: ClientType) =>
      //         name.first_name !== "All" ? name.id : ""
      //       )
      //     : []
      // );
    } else {
      // Toggle the selected state of the clicked item
      const updatedSelectedItems = selectedItems.includes(data.id)
        ? selectedItems.filter((item) => item !== data.id)
        : [...selectedItems, data.id];
      setSelectedItems(updatedSelectedItems);
      // Check if all items are selected

      const allSelected =
        updatedSelectedItems.length === accClientList.length - 1;
      setSelectAll(allSelected);
    }
  };
  const handleRemoveFile = (file: File) => {
    const filteredFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(filteredFiles);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const newFiles: File[] = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };
  const handleRemoveClient = (
    clientName: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation(); // Prevents event propagation to parent elements
    const updatedSelectedItems = selectedItems.filter(
      (item) => item !== clientName
    );
    setSelectedItems(updatedSelectedItems);
    setSelectAll(false);
  };

  useEffect(() => {
    if (accManagerDetail) {
      formik.setValues({
        first_name: accManagerDetail.first_name || "",
        last_name: accManagerDetail.last_name || "",
        email: accManagerDetail.email || "",
        phone_number: accManagerDetail.phone_number || "",
        address: accManagerDetail.address,
        address2: accManagerDetail?.address || "",
        city: accManagerDetail?.address,
        state: accManagerDetail?.address,
        zipcode: accManagerDetail?.phone_number,
        country: accManagerDetail?.address,
        role_permission_id: accManagerDetail?.role_permission_id,
      });
      if (accManagerDetail.user_image) {
        setpreviewUrl(urlForImage + accManagerDetail.user_image);
      }
      if (!isOpen) {
        setpreviewUrl("");
      }
    }
  }, [accManagerDetail, isOpen]);

  const fetchList = async () => {
    const payload = {
      start: 0,
      limit: -1,
      search: "",
    };
    try {
      const res = await dispatch(GetRolePermissionList(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen(false),
          formik.resetForm(),
          setpreviewUrl(""),
          setSelectedImage(null);
      }}
      modalTitle={isEditing == true ? "Edit Admin User " : "Add Admin User "}
      maxWidth="733"
      btnTitle={"Save"}
      disabled={actionStatus}
      onSubmit={formik.handleSubmit}
      closeTitle="Close"
    >
      <div className="h-[100px] w-[100px] mb-[2.4rem] relative">
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
      <div className="flex flex-col gap-20 mb-20 px-10">
        <div className="flex gap-20 sm:flex-row flex-col">
          <InputField
            formik={formik}
            name="first_name"
            label="First Name"
            placeholder="Enter First Name"
          />
          <InputField
            formik={formik}
            name="last_name"
            label="Last Name"
            placeholder="Enter Last Name"
          />
        </div>
        <div className="flex gap-20 sm:flex-row flex-col">
          <InputField
            type="number"
            formik={formik}
            name="phone_number"
            label="Phone Number"
            placeholder="Enter Phone Number"
            sx={{
              backgroundColor: "#F6F6F6",
              borderRadius: "8px",
              "& input[type=number]": {
                "-moz-appearance": "textfield", // Firefox
                "&::-webkit-outer-spin-button": {
                  // Chrome, Safari, Edge, Opera
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "&::-webkit-inner-spin-button": {
                  // Chrome, Safari, Edge, Opera
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              },
            }}
          />
          {isEditing ? (
            MainuserDetail?.role_id == 1 ||
              (MainuserDetail?.role_id == 4 &&
                Accesslist.admin_hide_info == 0) ? (
              <InputField
                formik={formik}
                name="email"
                label="Email "
                placeholder="Enter Email"
                disabled={isEditing}
              />
            ) : (
              <InputField
                name="email"
                label="Email "
                value="*****"
                placeholder="Enter Email"
                disabled={isEditing}
              />
            )
          ) : (
            <InputField
              formik={formik}
              name="email"
              label="Email "
              placeholder="Enter Email"
              disabled={isEditing}
            />
          )}
        </div>
        {!isEditing && (
          <InputField
            formik={formik}
            name="address"
            label="Address"
            placeholder="Enter Address"
          />
        )}
        {isEditing && (
          <>
            <div className="flex gap-20">
              <InputField
                formik={formik}
                name="address"
                label="Address 1"
                placeholder="Enter Address 1"
              />
              <InputField
                formik={formik}
                name="address2"
                label="Address 2"
                placeholder="Enter Address 2"
              />
            </div>

            <div className="flex gap-20">
              <InputField
                formik={formik}
                name="city"
                label="City"
                placeholder="Enter City"
              />
              <InputField
                formik={formik}
                name="state"
                label="State"
                placeholder="Enter State"
              />
            </div>

            <div className="flex gap-20">
              <InputField
                formik={formik}
                name="zipcode"
                label="Zipcode"
                placeholder="Enter Zipcode"
              />
              <SelectField
                formik={formik}
                name="country"
                label="Country"
                placeholder="Select Country"
                sx={{
                  "& .radioIcon": { display: "none" },
                }}
              >
                {profileStatus.map((item) => (
                  <StyledMenuItem key={item.value} value={item.value}>
                    {item.label}
                  </StyledMenuItem>
                ))}
              </SelectField>
            </div>
            <div className="flex gap-20 !w-[50%]">
              <SelectField
                formik={formik}
                name="role_permission_id"
                label="Role"
                placeholder="Select Role"
                sx={{
                  "& .radioIcon": { display: "none" },
                  "& .MuiSelect-icon": {
                    right: "1px",
                  },
                }}
              >
                {list?.length > 0 ? (
                  list?.map((item) => (
                    <StyledMenuItem key={item.id} value={item.id}>
                      {item.name}
                    </StyledMenuItem>
                  ))
                ) : (
                  <StyledMenuItem>No Data</StyledMenuItem>
                )}
              </SelectField>
            </div>
          </>
        )}
      </div>
    </CommonModal>
  );
}

export default EditAccountManagerModel;
