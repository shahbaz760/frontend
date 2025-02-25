import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { MenuItem, styled } from "@mui/material";
import { GetCountry, getAllState } from "app/store/Client";
import { ClientType } from "app/store/Client/Interface";
import { updateMyProfile } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { editMyProfileHideSchema, editMyProfileSchema } from "src/formSchema";
import { getUserDetail } from "src/utils";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import SelectField from "../selectField";
import { useSelector } from "react-redux";

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
  state: string;
  address2: string;

  city: string;
  zipcode: number | string;
  country: string;
};

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  clientDetail?: ClientType;
  loading?: boolean;
  fetchDetalis?: any;
}

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

function EditMyProfile({
  isOpen,
  setIsOpen,
  loading,
  clientDetail,
  fetchDetalis,
}: IProps) {
  const [allCountries, setAllCountries] = useState([]);
  const [allState, setAllState] = useState([]);
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userDetails = getUserDetail();

  const onSubmit = async (values: FormType) => {
    setLoader(true);
    const formData = new FormData();

    // Append form fields to FormData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    formData.append("client_id", String(clientDetail.id));
    if (selectedImage) {
      formData.append("files", selectedImage); // Add the selected image to the FormData
    }
    try {
      const { payload } = await dispatch(updateMyProfile({ formData }));
      if (payload?.data?.code == 201) {
        setIsOpen(false);
        toast.success(payload?.data?.message);
        fetchDetalis();
      } else if (payload?.data?.code == 402) {
        setIsOpen(false);
        toast.error(payload?.data?.message);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error updating profile:", error);
    }
  };

  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: null,
      address: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
    validationSchema:
      MainuserDetail?.role_id == 4 && Accesslist.client_hide_info == 1 &&
        userDetails.role_id == 2
        ? editMyProfileHideSchema
        : editMyProfileSchema(MainuserDetail?.role_id),
    onSubmit,
  });
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  // Update initial values after clientDetail changes

  useEffect(() => {
    if (clientDetail) {
      formik.setValues({
        first_name: clientDetail.first_name || "",
        last_name: clientDetail.last_name || "",
        email: clientDetail.email || "",
        phone_number: clientDetail.phone_number || "",
        address: clientDetail.address != "null" ? clientDetail.address : '',
        address2: clientDetail?.address2 || "",
        city: clientDetail?.city != "null" ? clientDetail?.city : "",
        state: clientDetail?.state || "",
        zipcode: clientDetail?.zipcode != "null" ? clientDetail?.zipcode : "",
        country: clientDetail?.country != "null" ? clientDetail?.country : "",
      });
      if (clientDetail.user_image) {
        setpreviewUrl(urlForImage + clientDetail.user_image);
      } else if (!isOpen) {
        setpreviewUrl(""); // Reset preview URL
      }
    }
  }, [clientDetail, isOpen]); // Dependency on clientDetail

  const [selectedImage, setSelectedImage] = useState<File>(); // Default image path
  const [previewUrl, setpreviewUrl] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the selected file
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setpreviewUrl(imageUrl); // Set the new image
    }
  };
  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = event.target.value;

    // Update the country in Formik
    formik.setFieldValue("country", selectedCountry);

    // Clear the state field
    // formik.setFieldValue("state", "");

    // If country is "United States", fetch states
    if (selectedCountry === "United States") {
      formik.setFieldValue("state", "");
      getState();
    }
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
    // if (userDetails?.role == "admin") {
    getCountries();
    // }
  }, []);

  useEffect(() => {
    if (statecode == "United States") {
      getState();
    }
  }, [statecode]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev), setSelectedImage(null), formik.resetForm();
      }}
      modalTitle="Edit Profile"
      maxWidth="733"
      btnTitle={"Save"}
      closeTitle={"Close"}
      disabled={loading || loader}
      onSubmit={formik.handleSubmit}
    >
      {/* {loader ? <ListLoading /> : null} */}
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
        <div className="flex gap-20 flex-wrap sm:flex-nowrap">
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

        {/* <InputField
          formik={formik}
          name="email"
          disabled
          label="Email Address"
          placeholder="Enter Email Address"
        /> */}

        {MainuserDetail?.role_id == 4 &&
          Accesslist.client_hide_info == 1 &&
          userDetails.role_id == 2 ? (
          <InputField
            name="email"
            disabled
            value="*****"
            label="Email Address"
            placeholder="Enter Email Address "
          />
        ) : (
          <InputField
            formik={formik}
            name="email"
            disabled
            label="Email Address"
            placeholder="Enter Email Address"
          />
        )}
        {/* <InputField
          formik={formik}
          type="number"
          name="phone_number"
          label="Phone Number"
          placeholder="Enter Phone Number"
        /> */}

        {MainuserDetail?.role_id == 4 &&
          Accesslist.client_hide_info == 1 &&
          userDetails.role_id == 2 ? (
          <InputField
            disabled
            value="*****"
            name="phone_number"
            label="Phone Number"
            placeholder="Enter Phone Number"
          />
        ) : (
          <InputField
            formik={formik}
            type="number"
            name="phone_number"
            label="Phone Number"
            placeholder="Enter Phone Number"
          />
        )}

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
      </div>
    </CommonModal>
  );
}

export default EditMyProfile;
