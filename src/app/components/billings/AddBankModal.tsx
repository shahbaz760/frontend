import { Checkbox, FormLabel, Grid } from "@mui/material";
import {
  AuBankAccountElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  FpxBankElement,
  IbanElement,
  IdealBankElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { addBank, addCard } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast, { ToastBar } from "react-hot-toast";
import { AddBankValidation, AddCardValidation } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import { useParams } from "react-router";
import GlobalMOdal from "./GlobalMOdal";
import { nullable } from "zod";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchDepartmentList?: any;
}

const AddBankModal = ({ isOpen, setIsOpen, fetchDepartmentList }: IProps) => {

  const stripe = useStripe();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { subscription_id } = useParams()
  const [globalIsOpen, setGlobalIsOpen] = useState(false)
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      card_name: "",
      save_card: false,
      routing_number: "",
      account_number: "",
      Global_save: false
    },
    validationSchema: AddBankValidation,
    onSubmit: async (values) => {
      const payload = {
        account_holder_name: values.card_name,
        routing_number: values.routing_number || "",
        account_number: values.account_number,
        subscription_id: subscription_id,
        is_default: values.Global_save ? 2 : values.save_card ? 1 : 0,
      };
      try {
        const res = await dispatch(addBank(payload));
        if (res?.payload?.data?.status == 1) {
          toast.success(res?.payload?.data?.message);
          formik.resetForm();
          setIsOpen(false);
          fetchDepartmentList();
        } else {
          // toast.error(res?.payload?.data?.message);
          // setError(res?.payload?.data?.message)
          if (res?.payload?.data?.message.includes("bank") && !res?.payload?.data?.message.includes("us_bank_account")) {
            // formik.setFieldError("account_number", res?.payload?.data?.message)
            toast.error(res?.payload?.data?.message)
          }
          else if (res?.payload?.data?.message.includes("Routing") || res?.payload?.data?.message.includes("routing")) {
            // formik.setFieldError("routing_number", res?.payload?.data?.message)
            toast.error(res?.payload?.data?.message)
          }
          else {
            setError(res?.payload?.data?.message)
          }
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

  useEffect(() => {
    setError("")
  }, [formik.values.account_number, formik.values.routing_number])


  const handleCheck = (e) => {
    formik.handleChange(e);
    if (e.target.checked) {
      setGlobalIsOpen(true)
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
      modalTitle="Add New Bank"
      maxWidth="733"
      disabled={!stripe || formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      btnTitle="Save"
      closeTitle="Cancel"
    >
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField
              formik={formik}
              name="account_number"
              label="Account Number"
              placeholder="Enter Account Number"
              max={17}
              type="account"
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              formik={formik}
              name="card_name"
              label="Account Holder Name"
              placeholder="Enter Account Holder Name"
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              formik={formik}
              name="routing_number"
              label="Routing Number"
              placeholder="Enter Routing Number"
              max={9}
              type="account"
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

export default AddBankModal;
