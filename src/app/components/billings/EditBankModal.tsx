import { Checkbox, Grid } from "@mui/material";

import { EditBank } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { EditBankValidation } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import { useParams } from "react-router";
import GlobalMOdal from "./GlobalMOdal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchDepartmentList?: any;
  data?: any;
}

const EditBankModal = ({ isOpen, setIsOpen, fetchDepartmentList, data }: IProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [globalIsOpen, setGlobalIsOpen] = useState(false)
  const { subscription_id } = useParams()
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      card_name: data.account_holder_name || "",
      save_card: data?.is_default == 0 ? false : true,
      Global_save: false
    },
    validationSchema: EditBankValidation,
    onSubmit: async (values) => {
      const payload = {
        bank_id: data.id,
        account_holder_name: values.card_name,
        is_default: values.Global_save ? 2 : values.save_card ? 1 : 0,
      };
      try {
        const res = await dispatch(EditBank(payload));
        if (res?.payload?.data?.status == 1) {
          toast.success(res?.payload?.data?.message);
          formik.resetForm();
          setIsOpen(false);
          fetchDepartmentList();
        }
        else {
          setError(res?.payload?.data?.message)
        }

        const paymentIntent = await res?.payload?.data?.data.json();
        if (paymentIntent.error) {
          setError(paymentIntent.error);
        } else {
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  });
  const handleCheck = (e) => {
    if(formik.values.save_card !=true){
    formik.handleChange(e);
    
    if (e.target.checked) {
      setGlobalIsOpen(true)
    }
  }
  }
  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        formik.resetForm();
        setError(null);
        setIsOpen((prev) => !prev);
      }}
      modalTitle="Edit Bank"
      maxWidth="733"
      disabled={formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      btnTitle="Save"
      closeTitle="Cancel"
    >
      <form>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <InputField
              formik={formik}
              name="card_name"
              label="Account Holder Name"
              placeholder="Enter Account Holder Name"
            />
          </Grid>

          <Grid item xs={6}>
            <div className="flex addCheck">
              <Checkbox
                name="save_card"
                checked={formik.values.save_card}
                onChange={(e) => { handleCheck(e) }}
                // Adding a custom class for styling
                className="checkbox hover:!bg-transparent"
              />

              <div className="flex items-center">
                <span className="text-lg text-black ml-2">
                  Save the bank for future use.
                </span>
              </div>
            </div>
          </Grid>
          {/* <Grid item xs={6}>
            <div className="flex addCheck">
              <Checkbox
                name="Global_save"
                checked={formik.values.Global_save}
                onChange={formik.handleChange}
                // Adding a custom class for styling
                className="checkbox hover:!bg-transparent"
              />

              <div className="flex items-center">
                <span className="text-lg text-black ml-2">
                  Save as Global.
                </span>
              </div>
            </div>
          </Grid> */}
        </Grid>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>Payment Successful!</div>}
      </form>
      <GlobalMOdal
        modalTitle="Payment Method!"
        modalSubTitle="Are you sure you want to set this payment method as the default for all subscriptions paid via bank?"
        open={globalIsOpen}
        handleToggle={() => setGlobalIsOpen((prev) => !prev)}
        type="delete"
        onDelete={() => { formik.setFieldValue("Global_save", true); setGlobalIsOpen(false) }}
      />
    </CommonModal>
  );
};

export default EditBankModal;
