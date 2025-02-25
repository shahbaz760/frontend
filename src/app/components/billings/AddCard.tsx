import { Checkbox, FormLabel, Grid } from "@mui/material";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { addCard } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { AddCardValidation } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import { useParams } from "react-router";
import GlobalMOdal from "./GlobalMOdal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchDepartmentList?: any;
}

const AddCard = ({ isOpen, setIsOpen, fetchDepartmentList }: IProps) => {
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770 ",
        backgroundColor: "#f6f6f6",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#424770",
      },
    },
  };

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const { subscription_id } = useParams()
  const [globalIsOpen, setGlobalIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      card_name: "",
      save_card: false,
      Global_save: false,
    },
    validationSchema: AddCardValidation,
    onSubmit: async (values) => {
      if (!stripe || !elements) {
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        setError("Please complete all fields.");
        return;
      }

      const { error: cardError, token } =
        await stripe.createToken(cardNumberElement);

      if (cardError) {
        setError(cardError.message);
      } else {
        setError(null);
        const payload = {
          token: token?.id,
          // payment_method_token: token2?.id,
          subscription_id: subscription_id,
          is_default: values.Global_save ? 2 : values.save_card ? 1 : 0,
        };
        try {
          const res = await dispatch(addCard(payload));
          formik.resetForm();
          setIsOpen(false);
          fetchDepartmentList();
          if (res?.payload?.data?.status == 1) {
            toast.success(res?.payload?.data?.message);
          } else {
            toast.error(res?.payload?.data?.message);
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
      }
    },
  });
  const handleElementChange = () => {
    if (error) setError(null);
  };
  const handleFocus = (type: string) => setIsFocused(type);
  const handleBlur = () => setIsFocused(null);
  const isFieldFocused = (fieldType: string) => isFocused === fieldType;

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
      modalTitle="Add New Card"
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
              name="card_name"
              label="Cardholder Name"
              placeholder="Enter Cardholder Name"
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
                  Card Number
                </FormLabel>

                <CardNumberElement
                  options={{
                    ...cardElementOptions,
                    placeholder: "Enter Card Number ",
                  }}
                  className={`h-[46px] bg-[#f6f6f6] p-[13px] rounded-6 ${isFieldFocused("number") ? "border !border-[#4f46e5]" : ""
                    }`}
                  onChange={handleElementChange}
                  onFocus={() => handleFocus("number")}
                  onBlur={() => handleBlur()}
                />
                {error && error.includes("number") && (
                  <div style={{ color: "red" }}>{error}</div>
                )}
              </Grid>
              <Grid item xs={6}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
                  Expiration Date
                </FormLabel>
                <CardExpiryElement
                  options={cardElementOptions}
                  className={`h-[46px] bg-[#f6f6f6] p-[13px] rounded-6 ${isFieldFocused("expiry") ? "border !border-[#4f46e5]" : ""
                    }`}
                  onChange={handleElementChange}
                  onFocus={() => handleFocus("expiry")}
                  onBlur={handleBlur}
                />

                {error &&
                  (error.toLowerCase().includes("expiry") ||
                    error.toLowerCase().includes("expiration") ||
                    error.toLowerCase().includes("expired")) && (
                    <div style={{ color: "red" }}>{error}</div>
                  )}
              </Grid>
              <Grid item xs={6}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
                  CVV
                </FormLabel>
                <CardCvcElement
                  options={{ ...cardElementOptions, placeholder: "CVV" }}
                  className={`h-[46px] bg-[#f6f6f6] p-[13px] rounded-6 ${isFieldFocused("cvc") ? "border !border-[#4f46e5]" : ""
                    }`}
                  onChange={handleElementChange}
                  onFocus={() => handleFocus("cvc")}
                  onBlur={handleBlur}
                />
                {error && error.includes("security") && (
                  <div style={{ color: "red" }}>{error}</div>
                )}
              </Grid>
            </Grid>
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
                  Save the card for future use.
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
        {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
        {success && <div style={{ color: "green" }}>Payment Successful!</div>}
      </form>
      <GlobalMOdal
        modalTitle="Payment Method!"
        modalSubTitle="Are you sure you want to set this payment method as the default for all subscriptions paid via card?"
        open={globalIsOpen}
        handleToggle={() => setGlobalIsOpen((prev) => !prev)}
        type="delete"
        onDelete={() => { formik.setFieldValue("Global_save", true); setGlobalIsOpen(false) }}
      />
    </CommonModal>
  );
};

export default AddCard;
