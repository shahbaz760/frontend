import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { editAgentHideSchema, editAgentSchema } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { MenuItem, Typography, styled } from "@mui/material";
import { addAgent, restAll, updateAgentProfile } from "app/store/Agent";
import { AgentRootState } from "app/store/Agent/Interafce";
import { GetCountry, getAllState } from "app/store/Client";
import { CrossGreyIcon, PreviewIcon } from "public/assets/icons/common";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getUserDetail } from "src/utils";
import SelectField from "../selectField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchAgentList?: () => void;
  isEditing?: boolean;
}
type profileState = {
  value: string;
  label: string;
};

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
function AddAgentModel({
  isOpen,
  setIsOpen,
  fetchAgentList,
  isEditing,
}: IProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [allCountries, setAllCountries] = useState([]);
  const [allState, setAllState] = useState([]);
  const dispatch = useAppDispatch();
  const agentState = useSelector((store: AgentRootState) => store.agent);
  const { agentDetail, actionStatus } = useSelector(
    (store: AgentRootState) => store.agent
  );
  const userDetails = getUserDetail();
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const { Accesslist } = useSelector((state: RootState) => state.project);
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
  const { agent_id } = useParams();

  const onSubmit = async (values: FormType, { resetForm }) => {
    try {
      if (agent_id) {
        const { email, ...restData } = values;
        const formData: any = new FormData();
        Object.entries(restData).forEach(([key, value]) => {
          formData.append(key, String(value).trim());
        });
        formData.append("agent_id", agent_id);
        if (selectedImage) {
          formData.append("profile_picture", selectedImage);
        }
        const { payload } = await dispatch(updateAgentProfile(formData));
        if (payload?.data?.message) {
          setIsOpen(false);
        }
      } else {
        const formData: any = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, String(value).trim());
        });

        if (selectedImage) {
          formData.append("profile_picture", selectedImage);
        }
        // let selectFiles: any = [];
        if (uploadedFiles.length > 0) {
          uploadedFiles.forEach((file) => {
            formData.append("files", file);
          });
        }
        formData.append("is_welcome_email", isChecked ? 1 : 0);
        const resultAction = await dispatch(addAgent({ formData }));

        // Access the response data if needed
        const responseData = resultAction.payload?.data;

        if (fetchAgentList) {
          fetchAgentList();
        }

        // Close the modal
        setIsOpen(false);
        setUploadedFiles([]);
        setpreviewUrl("");
        // resetForm();
      }
    } catch (error) {
      // Handle error if dispatch or API call fails
      console.error("Error submitting form:", error);
      // You can add specific error handling logic here
    }
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
    },
    validationSchema:
      MainuserDetail?.role_id == 1 ||
      (isEditing == false &&
        MainuserDetail?.role_id == 4 &&
        Accesslist.agent_hide_info == 0)
        ? editAgentSchema
        : isEditing &&
            MainuserDetail?.role_id == 4 &&
            Accesslist.agent_hide_info == 1
          ? editAgentHideSchema
          : editAgentSchema,
    onSubmit,
  });

  useEffect(() => {
    if (!!agentState?.successMsg) {
      dispatch(restAll());
      setIsOpen(false);
      formik.resetForm();
      // fetchAgentList();
    } else if (!!agentState?.errorMsg) {
      setIsOpen(true);
      // dispatch(restAll());
    }
  }, [agentState]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const getCountries = async () => {
    const data = {
      start: 0,
      limit: -1,
    };
    try {
      const { payload } = await dispatch(GetCountry({ data }));
      setAllCountries(payload?.data?.data?.list);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const statecode = formik?.values?.country;
  const getState = async () => {
    const data = {
      start: 0,
      limit: -1,
      country_name: statecode,
    };
    try {
      const { payload } = await dispatch(getAllState({ data }));
      setAllState(payload?.data?.data?.list);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    if (userDetails?.role_id == 1 || userDetails?.role_id == 4) {
      getCountries();
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = event.target.value;

    // Update the country in Formik
    formik.setFieldValue("country", selectedCountry);

    // Clear the state field
    // formik.setFieldValue("state", "");

    // If country is "United States", fetch states
    if (selectedCountry === "United States") {
      getState();
      formik.setFieldValue("state", "");
    }
  };

  useEffect(() => {
    if (statecode == "United States") {
      getState();
      // formik.setFieldValue("state", "");
    }
  }, [statecode]);

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
    e.target.value = ""; //upload same file again
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  useEffect(() => {
    if (agentDetail) {
      formik.setValues({
        first_name: agentDetail.first_name || "",
        last_name: agentDetail.last_name || "",
        email: agentDetail.email || "",
        phone_number: agentDetail.phone_number || "",
        address: agentDetail.address,
        address2: agentDetail?.address2 || "",
        city: agentDetail?.city,
        state: agentDetail?.state,
        zipcode: agentDetail?.zipcode,
        country: agentDetail?.country,
      });
      if (agentDetail.user_image) {
        setpreviewUrl(urlForImage + agentDetail.user_image);
      }
      if (!isOpen) {
        setpreviewUrl("");
        setUploadedFiles([]);
      }
    }
  }, [agentDetail, isOpen]);
  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => false),
          formik.resetForm(),
          setpreviewUrl(""),
          setUploadedFiles([]);
        setSelectedImage(null);
      }}
      modalTitle={isEditing ? "Edit Agent" : "Add Agent"}
      maxWidth="733"
      btnTitle={"Save"}
      disabled={agentState.actionStatus}
      //   disabled={loading}
      onSubmit={formik.handleSubmit}
      closeTitle={"Close"}
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
          {isEditing ? (
            MainuserDetail?.role_id == 1 ||
            (MainuserDetail?.role_id == 4 &&
              Accesslist.agent_hide_info == 0) ? (
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
            ) : (
              <InputField
                value="*****"
                name="phone_number"
                disabled={isEditing}
                label="Phone Number"
                placeholder="Enter Phone Number"
              />
            )
          ) : (
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
          )}
          {isEditing ? (
            MainuserDetail?.role_id == 1 ||
            (MainuserDetail?.role_id == 4 &&
              Accesslist.agent_hide_info == 0) ? (
              <InputField
                formik={formik}
                name="email"
                label="Email Address"
                placeholder="Enter Email Address"
                disabled={isEditing}
              />
            ) : (
              <InputField
                name="email"
                label="Email Address"
                placeholder="Enter Email Address"
                value="*****"
                disabled={isEditing}
              />
            )
          ) : (
            <InputField
              formik={formik}
              name="email"
              label="Email Address"
              placeholder="Enter Email Address"
              disabled={isEditing}
            />
          )}
        </div>

        <>
          <div className="flex gap-20 flex-wrap sm:flex-nowrap">
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

          <div className="flex gap-20 flex-wrap sm:flex-nowrap">
            <InputField
              formik={formik}
              name="city"
              label="City"
              placeholder="Enter City"
            />
            <InputField
              type="text"
              formik={formik}
              name="zipcode"
              label="Zipcode"
              placeholder="Enter Zipcode"
            />
          </div>

          <div className="flex gap-20 flex-wrap sm:flex-nowrap">
            <SelectField
              formik={formik}
              name="country"
              label="Country"
              placeholder="Select Country"
              onChange={handleCountryChange}
              sx={{
                "& .radioIcon": { display: "none" },
                "& .MuiSelect-icon": {
                  right: "1px",
                },
              }}
            >
              {allCountries?.length > 0 ? (
                allCountries?.map((item) => (
                  <StyledMenuItem key={item.iso_code} value={item.name}>
                    {item.name}
                  </StyledMenuItem>
                ))
              ) : (
                <StyledMenuItem>No Data</StyledMenuItem>
              )}
            </SelectField>
            {statecode == "United States" ? (
              <SelectField
                formik={formik}
                name="state"
                label="State"
                placeholder="Select State"
                sx={{
                  "& .radioIcon": { display: "none" },

                  "& .MuiInputBase-root .MuiSelect-select": {
                    lineHeight: 1.4,
                  },
                }}
              >
                {allState?.length > 0 ? (
                  allState?.map((item) => (
                    <StyledMenuItem key={item.name} value={item.name}>
                      {item.name}
                    </StyledMenuItem>
                  ))
                ) : (
                  <StyledMenuItem>No Data</StyledMenuItem>
                )}
              </SelectField>
            ) : (
              <InputField
                formik={formik}
                name="state"
                label="State"
                placeholder="Enter State"
              />
            )}
          </div>
        </>

        {/* <div className="flex gap-20 sm:flex-row flex-col"> */}
        {!isEditing && ( // Use logical NOT operator ! to conditionally render if !isEditing is true
          <div className="flex-1 sm:w-[50%] w-full">
            <Typography className="text-[16px] font-500 text-[#111827] pb-10">
              Attachments
            </Typography>
            <label
              htmlFor="attachment"
              className="bg-[#EDEDFC] px-20 mb-10 border-[0.5px] border-solid border-[#4F46E5] rounded-6 min-h-[48px] flex items-center 
            justify-between cursor-pointer"
              // onClick={() => handleUploadFile()}
            >
              <label className="text-[16px] text-[#4F46E5] flex items-center cursor-pointer">
                Upload File
                <input
                  type="file"
                  style={{ display: "none" }}
                  multiple={true}
                  id="attachment"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleUploadFile}
                />
              </label>
              <span>
                <img src={"../assets/images/logo/upload.png"} />
              </span>
            </label>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-[#F6F6F6] mb-10 px-10 rounded-6 min-h-[48px] flex items-center justify-between cursor-pointer"
              >
                <div className="mr-4 text-[16px] text-[#111827] py-5 w-full flex  items-center">
                  <PreviewIcon />
                  {file.name}
                </div>

                <div onClick={() => handleRemoveFile(file)}>
                  <CrossGreyIcon />
                </div>
              </div>
            ))}
          </div>
        )}
        {!isEditing && (
          <div className="flex  items-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="h-16 w-16 cursor-pointer"
            />
            <span className="ml-10 text-[16px] font-500 text-[#111827]">
              Do you want to send the welcome email
            </span>
          </div>
        )}
      </div>

      {/* </div> */}
    </CommonModal>
  );
}

export default AddAgentModel;
