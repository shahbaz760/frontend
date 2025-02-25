import FuseLoading from "@fuse/core/FuseLoading";
import { productAdd, productDetails } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Button, Grid, Switch, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommonModal from "src/app/components/CommonModal";
import InputField from "src/app/components/InputField";
import * as Yup from "yup";

const Android12Switch = styled(Switch)(() => ({
  padding: 0,
  height: 25,

  width: 55,
  borderRadius: 100,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#4f46e5",
    opacity: 1,
    "&::before, &::after": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    "&::before": {
      content: '""',
      left: 10,
      color: "#757982",
      display: "none",
    },
    "&::after": {
      content: '""',
      right: 10,
      color: "#757982",
    },
  },
  "& .MuiButtonBase-root": {
    padding: 0,
    "& .MuiSwitch-input": {
      left: 0,
    },
    "&.Mui-checked": {
      "& .MuiSwitch-input": {
        left: "-55px",
      },
      transform: "translateX(29px)",
      "&+.MuiSwitch-track": {
        backgroundColor: "#4f46e5",
        opacity: 1,
        "&::before": {
          display: "inline",
        },
        "&::after": {
          display: "none",
        },
      },
    },
  },
  "& .MuiSwitch-thumb": {
    filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.1))",
    display: "block",
    boxShadow: "none",
    width: "20px",
    height: "auto",
    aspectRatio: 1,
    margin: 3,
    backgroundColor: "white",
  },
}));

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  fetchList?: () => void;
  fetchUpdateData?: (any) => void;
  setId?: Dispatch<SetStateAction<number | null>>;
  isEditing?: boolean;
  id?: number | null;
  disable?: boolean;

  addProductData?: () => void;
}
const validationSchema = Yup.object({
  name: Yup.string()
    .transform((value) => (value ? value.trim() : ""))
    .required("Name is required.")
    .test(
      "not-only-spaces",
      "Name cannot be only spaces.",
      (value) => value && value.trim().length > 0
    )
    .max(50, "Name should be less than or equal to 50 characters."),

  description: Yup.string()
    .transform((value) => (value ? value.trim() : ""))
    .required("Description is required.")
    .test(
      "not-only-spaces",
      "Description cannot be only spaces.",
      (value) => value && value.trim().length > 0
    )
    .max(500, "Description should be less than or equal to 500 characters."),


  unit_price: Yup.string()
    .required("Unit Price is required.")

    .test(
      "max-length",
      "Unit Price must be less than or equal to 6 digits.",
      (value) => value === undefined || /^\d{1,6}(\.\d{1,2})?$/.test(value)
    )
    .test(
      "is-greater-than-zero",
      "Unit Price must be greater than 0.",
      (value) => value !== undefined && parseFloat(value) > 0
    )
    .transform((value) => (value ? String(parseFloat(value)) : null)),

});
function AddProduct({
  isOpen,
  setIsOpen,
  fetchList,
  isEditing,
  setIsEditing,
  fetchUpdateData,
  addProductData,
  setId,
  id,
  disable,
}: IProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const formik = useFormik({
    initialValues: {
      description: "",
      unit_price: null,
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (id) {
        await fetchUpdateData({ ...formik.values, product_id: id, is_private: isAuthenticated == true ? 1 : 0 });
        setIsOpen((prev) => !prev);
        setIsEditing(false);
        setId(null);
      } else {
        fetchData({ ...formik.values, is_private: isAuthenticated == true ? 1 : 0 });
      }
    },
  });
  const [disabled, setDisable] = useState(false);
  const dispatch = useAppDispatch();
  const handleAuthSwitch = (e) => {
    setIsAuthenticate(!isAuthenticated)

  };

  const fetchData = async (payload: any) => {
    setDisable(true);
    try {
      //@ts-ignore
      const res = await dispatch(productAdd(payload));
      // setList(res?.payload?.data?.data?.list);
      addProductData();
      toast.success(res?.payload?.data?.message);
      setIsOpen((prev) => !prev);
      setDisable(false);
      setIsEditing(false);
      setId(null);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };


  const handleSave = () => {
    formik.handleSubmit();
  };

  useEffect(() => {
    if (!id) return;

    const fetchDataDEtails = async () => {
      setLoading(true);
      setDisable(true);
      try {
        const payload = {
          product_id: id,
        };
        //@ts-ignore
        const res = await dispatch(productDetails(payload));
        const data = res?.payload?.data?.data;
setIsAuthenticate(data.is_private)
        if (data) {
          formik.setValues({
            description: data.description || "",
            unit_price: data.unit_price || null,
            name: data.name || "",
          });
        }
        setLoading(false);
        setDisable(false);
      } catch (error) {
        setDisable(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchDataDEtails();
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);
  return (
    <>
      {/*  */}

      <CommonModal
        open={isOpen}
        handleToggle={() => {
          setIsOpen((prev) => !prev);
          setIsEditing(false);
          setId(null);
        }}
        disabled={disabled || disable}
        modalTitle={isEditing == true ? "Edit Product" : "Add Product"}
        maxWidth="730"
        btnTitle="Save"
        closeTitle="Cancel"
        onSubmit={handleSave}
      >
        {loading && isEditing ? (
          <div className="h-[363px]">
            <FuseLoading />
          </div>
        ) : (
          <div className="flex flex-col gap-20">
            <InputField
              name="name"
              label="Name"
              placeholder="Enter Name"
              formik={formik}
            />

            <InputField
              name="description"
              label="Description"
              placeholder="Enter Description"
              multiline
              formik={formik}
              rows={4}
            />
            <InputField
              name="unit_price"
              label="Unit Price"
              placeholder="Enter Price"
              formik={formik}
              type="number"
            />
            <div className="flex items-center gap-10">
              <Typography className={`block text-[16px]  ${!isAuthenticated ? "text-secondary font-bold" : "text-[#757982] font-normal"} mb-5`}>Public</Typography>
              <Android12Switch
                checked={isAuthenticated}
                onChange={handleAuthSwitch}
              />
              <Typography className={`block text-[16px]  ${isAuthenticated ? "text-secondary font-bold" : "text-[#757982] font-normal"} mb-5`}>Private</Typography>
            </div>
          </div>
        )}

      </CommonModal>
    </>
  );
}

export default AddProduct;
