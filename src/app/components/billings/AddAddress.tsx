import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import CommonModal from "../CommonModal";
import InputField from "../InputField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function AddAddress({ isOpen, setIsOpen }: IProps) {
  const formik = useFormik({
    initialValues: {
      address: "",
      country: "",
      town: "",
      state: "",
      post_code: "",
      use_billing: false,
    },
    onSubmit: (values) => {},
  });

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen((prev) => !prev)}
      modalTitle="Add New Address"
      maxWidth="733"
    >
      <div className="flex flex-col gap-20 mb-20">
        <InputField
          formik={formik}
          name="address"
          label="Address"
          placeholder="Enter Address"
        />
        <InputField
          formik={formik}
          name="country"
          label="Country"
          placeholder="Select"
        />
        <InputField
          formik={formik}
          name="town"
          label="Town"
          placeholder="Enter Town Name"
        />
        <Grid container spacing="22px">
          <Grid item lg={6}>
            <InputField
              formik={formik}
              name="state"
              label="State"
              placeholder="Enter State"
            />
          </Grid>
          <Grid item lg={6}>
            <InputField
              formik={formik}
              name="post_code"
              label="Post Code"
              placeholder="Enter Post Code"
            />
          </Grid>
        </Grid>
        <div>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={
              <span className="text-lg text-black">
                Use as a billing address?
              </span>
            }
          />
        </div>
      </div>
    </CommonModal>
  );
}

export default AddAddress;
