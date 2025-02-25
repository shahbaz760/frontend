import { Checkbox, FormControlLabel, FormLabel, Grid } from "@mui/material";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { UpdateCard, getCardDetail } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";
import CommonModal from "../CommonModal";
import { useParams } from "react-router";
import GlobalMOdal from "./GlobalMOdal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id?: any;
  fetchDepartmentList?: any;
}

const EditCard = ({ isOpen, setIsOpen, id, fetchDepartmentList }: IProps) => {
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        backgroundColor: "#f6f6f6",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [globalIsOpen, setGlobalIsOpen] = useState(false)
  const [trigger, setTriger] = useState(false);
  const { subscription_id } = useParams();
  const [expiry, setExpiry] = useState("");
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      save_card: false,
      Global_save: false
    },
    onSubmit: async (values) => {
      setTriger(true);
      const valid = handleExpiryChange();
      if (valid) {
        const payload = {
          card_id: id,
          exp_date: expiry,
          is_default: values.Global_save ? 2 : values.save_card ? 1 : 0,
        };

        try {
          const res = await dispatch(UpdateCard(payload));
          formik.resetForm();

          fetchDepartmentList();
          if (res?.payload?.data?.status === 1) {
            toast.success(res?.payload?.data?.message);
            setTriger(false);
            setIsOpen(false);
          } else {
            toast.error(res?.payload?.data?.message);

            setTriger(false);
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

  const fetchDetails = async (id) => {
    const res = await dispatch(getCardDetail(id));
    const data = res?.payload?.data?.data;


    formik.setFieldValue("save_card", data?.is_default);


    const formattedMonth =
      data?.exp_month < 10 ? `0${data?.exp_month}` : `${data?.exp_month}`;

    const formattedYear = data?.exp_year.toString().slice(-2);
    const formattedExpDate = formattedMonth + "/" + formattedYear;
    setExpiry(formattedExpDate);
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, []);


  const handleExpiryChange = () => {
    setError("");
    const value = expiry;
    let month;
    let year;

    const [monthStr, yearStr] = value.split("/");
    month = parseInt(monthStr, 10);
    year = parseInt(yearStr, 10);

    // Validate month and year
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 0) {
      setError("Invalid expiry date");
      return false;
    }

    // Get today's date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-based

    // Convert 2-digit year to 4-digit year
    const fullYear = year + 2000;

    // Set maximum expiry date (20 years from now)
    const maxExpiryYear = currentYear + 30;

    // Construct expiry date for input
    const expiryDate = new Date(fullYear, month - 1); // Month is 0-based in Date object

    // Construct maximum expiry date
    const maxExpiryDate = new Date(maxExpiryYear, 11, 31); // Last day of the year

    // Check if the expiry date is in the past
    if (expiryDate < today) {
      setError("Card has been expired");
      return false;
    }
    // Check if the expiry date is within the next 20 years
    if (expiryDate > maxExpiryDate) {
      setError("Invalid expiry date");
      return false;
    }

    // If all checks pass, clear the error
    setError("");
    return true;
  };

  useEffect(() => {
    // if (trigger) {
    handleExpiryChange();
    // }
  }, [expiry]);

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
        setTriger(false);
        setIsOpen((prev) => !prev);
      }}
      modalTitle="Edit Card"
      maxWidth="733"
      disabled={!stripe || formik.isSubmitting}
      onSubmit={formik.handleSubmit}
      btnTitle="Save"
      closeTitle="Cancel"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5">
            Expiry Date
          </FormLabel>

          <PatternFormat
            format="##/##"
            mask={["M", "M", "Y", "Y"]}
            value={expiry}
            placeholder="MM/YY"
            onChange={(e) => setExpiry(e.target.value)}
            className={
              "w-full p-[14px] !placeholder-[#a3a6ad] bg-[#f6f6f6] rounded-8 font-400 border-1 border-[#f6f6f6] focus:border-[#4f46e5] focus:outline-none"
            }
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
                Save the card for future use.
              </span>
            </div>
          </div>
        </Grid>

      </Grid>
      {error && trigger && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Payment Successful!</div>}
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

export default EditCard;
