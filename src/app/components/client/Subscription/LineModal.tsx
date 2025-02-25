import { Checkbox, Theme } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  addLineItem,
  productUpdate,
  subscriptionUpdateDetails,
} from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  BillingTermsOptions,
  EmployOptions,
  MonthlyEditOptions,
  StyledMenuItem,
} from "src/utils";
import * as Yup from "yup";
import CommonModal from "../../CommonModal";
import InputField from "../../InputField";
import NumberInput from "../../NumberInput";
import SelectField from "../../selectField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setId?: Dispatch<SetStateAction<number | null>>;
  handleList: (list: any[]) => void;
  id?: number | null;
  Edit?: boolean;
}
const today = new Date();
const validateBillingStartDate = (dateString) => {
  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0); // Set to the beginning of the day for comparison

  const year = selectedDate.getFullYear().toString();
  const isFourDigitYear = /^\d{4}$/.test(year);

  if (!isFourDigitYear) {
    return { isValid: false, error: "Year must be in 4 digits." };
  }

  if (selectedDate <= today) {
    return {
      isValid: false,
      error: "Billing Start Date must be greater than today.",
    };
  }

  return { isValid: true, error: "" };
};

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
  // .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  description: Yup.string()
    .transform((value) => (value ? value.trim() : ""))
    .required("Description is required.")
    .test(
      "not-only-spaces",
      "Description cannot be only spaces.",
      (value) => value && value.trim().length > 0
    )
    .max(500, "Description should be less than or equal to 500 characters."),
  // .matches(
  //   /^[A-Za-z\s]+$/,
  //   "Description can only contain letters and spaces"
  // ),

  unit_price: Yup.number()
    .required("Unit Price is required.")
    .min(0.01, "Unit Price must be greater than 0.")
    // .test(
    //   "decimal-places",
    //   "Only two decimal places are allowed",
    //   (value) =>
    //     value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    // )
    .test(
      "max-length",
      "Unit Price must be less than or equal to 6 digits.",
      (value) =>
        value === undefined || /^\d{1,6}(\.\d{1,2})?$/.test(value.toString())
    ),

  quantity: Yup.number()
    .required("Quantity is required.")
    .min(0.01, "Quantity must be greater than 0.")
    // .test(
    //   "decimal-places",
    //   "Only two decimal places are allowed",
    //   (value: any) =>
    //     value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    // )
    .test(
      "max-length",
      "Quantity must be less than or equal to 6 digits.",
      (value: any) =>
        value === undefined || /^\d{1,6}(\.\d{1,2})?$/.test(value.toString())
    ),
  billing_frequency: Yup.string().required("Billing Frequency is required."),
  billing_terms: Yup.string().required("Billing Terms are required."),

  no_of_payments: Yup.number().when("billing_terms", {
    is: (value) => {
      return value != 2;
    },
    then: (Schema) =>
      Schema.required("Number of Payments is required.").min(
        1,
        "Number of Payments must be greater than 0."
      ),
    otherwise: (Schema) => Schema.notRequired().nullable(),
  }),

  is_delay_in_billing: Yup.boolean(),
  billing_start_date: Yup.date()
    .nullable()
    .when("is_delay_in_billing", {
      is: (value) => {
        return value;
      },
      then: (Schema) => Schema.required("Billing Start Date is required."),
      otherwise: (Schema) => Schema.notRequired().nullable(),
    }),
});

function LineModal({
  isOpen,
  setIsOpen,
  handleList,
  id,
  setId,
  Edit = false,
}: IProps) {
  const [value, setValue] = React.useState<number | null>(null);
  const [disable, setDisable] = useState(false);
  const [dateError, setDateError] = useState("");
  const dispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      unit_price: null,
      quantity: null,
      billing_frequency: "",
      billing_terms: "2",
      no_of_payments: 0,
      billing_start_date: "",
      is_delay_in_billing: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      if (id) {
        fetchUpdateData({ ...formik.values, product_id: id });
      } else {
        fetchData(formik.values);
      }
    },
  });

  const fetchData = async (payload: any) => {
    setDisable(true);
    try {
      //@ts-ignore
      const res = await dispatch(addLineItem(payload));
      // setList(res?.payload?.data?.data?.list);
      setIsOpen((prev) => !prev);
      setDisable(false);
      handleList([res?.payload?.data?.data]);
      formik.resetForm();
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchUpdateData = async (payload: any) => {
    setDisable(true);
    try {
      //@ts-ignore
      const res = await dispatch(productUpdate(payload));
      // setList(res?.payload?.data?.data?.list);
      setId(null);
      setDisable(false);
      handleList([res?.payload?.data?.data]);
      // fetchData();
      toast.success(res?.payload?.data?.message);
      setIsOpen((prev) => !prev);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = () => {
    if (dateError == "") {
      formik.handleSubmit();
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update is_delay_in_billing based on checkbox status
    const isChecked = event.target.checked;
    formik.setFieldValue("is_delay_in_billing", isChecked ? 1 : 0);
  };

  useEffect(() => {
    if (!id) return;

    const fetchDataDEtails = async () => {
      try {
        const payload = {
          product_id: id,
        };
        //@ts-ignore
        const res = await dispatch(subscriptionUpdateDetails(payload));
        const data = res?.payload?.data?.data;
        if (data) {
          formik.setValues({
            name: data?.name,
            description: data?.description,
            unit_price: data?.unit_price || 0,
            quantity: data?.quantity || 0,
            billing_frequency: data?.billing_frequency || 1,
            billing_terms: data?.billing_terms || 1,
            no_of_payments: data?.no_of_payments || 0,
            billing_start_date: data?.billing_start_date || null,
            is_delay_in_billing: data?.is_delay_in_billing || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataDEtails();
  }, [dispatch]);

  // Add one day to get tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setDate(tomorrow.getDate() + 2); // Add one more day
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Months start at 0!
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowStr = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    if (formik.values?.billing_start_date) {
      const validation = validateBillingStartDate(
        formik.values?.billing_start_date
      );

      if (validation.isValid) {
        setDateError("");
        // setDisable(false);
      } else {
        console.error(validation.error);
        // setDisable(true);
        setDateError(validation.error);
      }
    } else {
      // setDisable(false);
      setDateError("");
    }
  }, [formik]);

  const inputRef = useRef(null);
  const openDatePicker = () => {
    if (inputRef.current) {
      inputRef.current?.showPicker(); // Opens the date picker on click
    }
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev);
        formik.resetForm();
        setId(null);
      }}
      modalTitle={`${id ? "Edit" : "Add"} Custom Line Items`}
      maxWidth="733"
      btnTitle={"Save"}
      closeTitle="Cancel"
      onSubmit={handleSave}
      disabled={disable}
    >
      <div className="flex flex-col gap-20 mb-20 h-[500px] overflow-y-scroll ">
        <InputField
          formik={formik}
          name="name"
          label=" Name"
          placeholder="Enter Name"
        />

        <InputField
          formik={formik}
          name="description"
          label="Description"
          placeholder="Enter Description"
        />

        <InputField
          formik={formik}
          name="unit_price"
          label="Unit Price"
          placeholder="Enter Unit Price"
          type={"number"}
        />

        <InputField
          formik={formik}
          name="quantity"
          label="Quantity"
          placeholder="Enter Quantity"
          type={"number"}
        />

        <SelectField
          formik={formik}
          name="billing_frequency"
          label="Billing Frequency"
          placeholder="Select"
          sx={{
            border: "0.5px solid #9DA0A6",
            padding: "0px 12px",
            "& .radioIcon": { display: "none" },
            "&:focus": {
              border: "none !important", // Remove border on focus
              outline: "none", // Remove outline on focus
            },
          }}
        >
          quantity
          {!Edit &&
            EmployOptions.map((item) => (
              <StyledMenuItem key={item.value} value={item.value}>
                {item.label}
              </StyledMenuItem>
            ))}
          {Edit &&
            MonthlyEditOptions.map((item) => (
              <StyledMenuItem key={item.value} value={item.value}>
                {item.label}
              </StyledMenuItem>
            ))}
        </SelectField>

        <SelectField
          formik={formik}
          name="billing_terms"
          label="Billing Terms"
          placeholder="Select"
          sx={{
            border: "0.5px solid #9DA0A6",
            "& .MuiSelect-select ": {
              whiteSpace: "break-spaces !important",
            },
            "& .radioIcon": { display: "none" },
          }}
          style={{}}
        >
          {BillingTermsOptions.map((item) => (
            <StyledMenuItem key={item.value} value={item.value}>
              {item.label}
            </StyledMenuItem>
          ))}
        </SelectField>

        {formik.values.billing_terms == "2" ? (
          <NumberInput
            label="Number of Payments"
            name="no_of_payments"
            // formik={formik}
            value={0}
            disable={true}
          />
        ) : (
          <NumberInput
            label="Number of Payments"
            name="no_of_payments"
            formik={formik}
            value={formik.values.no_of_payments || null}
            // disable={false}
          />
        )}
        <div className="w-full">
          <div className="flex items-center mb-[2rem]">
            <Checkbox
              id="billing_start_date"
              name="billingDate"
              value="billing"
              onChange={handleCheckboxChange}
              checked={formik.values.is_delay_in_billing === 1}
              sx={{
                "&.Mui-checked": {
                  color: "#4f46e5",
                },
              }}
              className="w-[18px] h-[18px] me-[16px]"
            />
            <label className="text-[16px] font-medium leading-[20px]">
              Delay Billing Start Date
            </label>
            <br />
          </div>
          {formik.values.is_delay_in_billing == 1 && (
            <>
              <div className=" mb-[1rem]">
                <label className="text-[16px] font-medium leading-[20px]">
                  Billing Start Date ( Date of first payment )
                </label>
              </div>

              <input
                type="date"
                id="billing_start_date"
                name="billing_start_date"
                onClick={() => {
                  openDatePicker();
                }}
                ref={inputRef}
                // min={new Date().toISOString().split("T")[0]}
                min={tomorrowStr}
                value={formik.values.billing_start_date || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
              />
              {formik.touched.billing_start_date &&
              formik.errors.billing_start_date ? (
                <div className="text-red-600">
                  {formik.errors.billing_start_date}
                </div>
              ) : null}
              {dateError ? (
                <div className="text-red-600">{dateError}</div>
              ) : null}
            </>
          )}
          {/* <DateInput /> */}
        </div>
      </div>
    </CommonModal>
  );
}

export default LineModal;
