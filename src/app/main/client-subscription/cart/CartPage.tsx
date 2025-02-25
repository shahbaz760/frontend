import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  Grid,
  FormLabel,
  Tooltip,
  Box,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import InputField from "src/app/components/InputField";
import { useAppDispatch } from "app/store/store";
import { useSelector } from "react-redux";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { styled, useTheme } from "@mui/styles";
import AddProductModel from "src/app/components/product/AddProductModal";
import {
  BillingTermsOptions,
  EmployOptions,
  EmployOptions1,
  StyledMenuItem,
} from "src/utils";
import SelectField from "../../../components/selectField";
import { DeleteIcon, UserIcon } from "public/assets/icons/navabarIcon";
import DeleteProduct from "src/app/pages/manageProducts/DeleteProductModal";
import toast from "react-hot-toast";
import { addProductCart } from "app/store/Product";
import InputFieldPublic from "src/app/components/InputFieldPublic";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router";
import ProductRow from "src/app/components/product/ProductQuantity";
import phoneIcon from "../../../../../public/assets/icons/phone-line.svg";
import userIcon from "../../../../../public/assets/icons/Vector.svg";
import cardIcon from "../../../../../public/assets/icons/card-icon.svg";
import calenderIcon from "../../../../../public/assets/icons/calendar-line.svg";
import businessIcon from "../../../../../public/assets/icons/grommet-icons_business-service.svg";
import emailIcon from "../../../../../public/assets/icons/email.svg";
import { GetCountry } from "app/store/Client";
import { NoDataFound } from "public/assets/icons/common";

import deleteIcon from "../../../../../public/assets/icons/deleteIcon.svg";

export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);

  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        className="font-bold text-[20px]"
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};
const CartPage = () => {
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770 ",
        backgroundColor: "#ffffff",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [disable, setDisable] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [id, setId] = useState("");
  const [noError, setNoErr] = useState("");
  const [noErrorBT, setNoErrBT] = useState("");

  const [cardholderName, setCardholderName] = useState("");

  const getCountries = async () => {
    const data = {
      start: 0,
      limit: -1,
    };
    try {
      const { payload } = await dispatch(GetCountry({ data }));
      setAllCountries(payload?.data?.data?.list);
    } catch (error) {
      
    }
  };
  const { subscriptionData, actionStatus, productList } = useSelector(
    (store: any) => store.product
  );
  useEffect(() => {
    getCountries();
  }, []);
  const location = useLocation();

  const [selectedProduct, setSelectedProduct] = useState<any[]>(
    Array.from(location?.state?.product || []) || []
  );

  useEffect(() => {
    if (location?.state?.product) {
      console.log(
        "Initial product from location.state:",
        location.state.product
      );
      handleData(location.state.product);
    } else {
      
    }
  }, [location]);

  const handleQuantityChange = (id, newQuantity) => {
    const updatedProducts = selectedProduct?.map((product) =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    );
    setSelectedProduct(updatedProducts);
    
  };
  const calculateSubtotal = () => {
    if (Array.isArray(selectedProduct)) {
      return selectedProduct.reduce(
        (acc, product) => acc + product.unit_price * product.quantity,
        0
      );
    }
    return 0;
  };

  

  const navigate = useNavigate();

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return (
      subtotal + (subtotal * subscriptionData?.global_processing_fee) / 100
    );
  };
  const handleData = (product: any) => {
    setSelectedProduct((prevProducts) => {
      const existingProduct = prevProducts?.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevProducts?.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }

      return [...prevProducts, { ...product, quantity: 1 }];
    });
    setIsOpenAddModal(false);
  };

  const stripe = useStripe();
  const elements = useElements();
  const handleForm = (formEvent: FormEvent<HTMLFormElement>) => {
    formik.handleSubmit(formEvent);
  };

  const noInitialSpace = (value) => !value || value.trimStart() === value;
  const formik = useFormik({
    initialValues: {
      title: "",
      first_name: "",
      last_name: "",
      company_name: "",
      email: "",
      phone_number: "",
      quantity: 1,
      country: "",
      billing_terms: "",
      payment: 0,
      billing_frequency: 2,
      no_of_payments: 0,
      net_price: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      first_name: Yup.string().required("First name is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      last_name: Yup.string().required("Last name is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      company_name: Yup.string().required("Company name is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      email: Yup.string().email("Invalid email").required("Email is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      phone_number: Yup.string()
      .min(7, "Please enter a phone number, 7 to 15 digits long")
      .max(15, "Please enter a phone number, 7 to 15 digits long")
      .matches(/^\d{7,15}$/, {
        message: "Please enter a phone number, 7 to 15 digits long",
        excludeEmptyString: true,
      })
      .notRequired(),

      country: Yup.string().required("Country is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      billing_terms: Yup.string().required("Billing term is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
      billing_frequency: Yup.string().required("Billing term is required") .trim()
      .test("no-initial-space", "No initial space allowed.", noInitialSpace),
    }),
    onSubmit: async (values) => {
      if (values.billing_terms == "1" && values.no_of_payments == 0) {
        setNoErr(" No. of payment is required and must be greater than 0");
        return;
      }
    
      const payload = {
        title: values.title,
        first_name: values.first_name,
        email: values.email,
        phone_number: values.phone_number,
        last_name: values.last_name,
        company_name: values.company_name,
        country: values.country,
        subscription_data: selectedProduct?.map((product: any) => ({
          product_id: product.id,
          unit_price: product.unit_price,
          quantity: values.quantity,
          no_of_payments: values.no_of_payments || 1,
          net_price: product.unit_price * product.quantity,
          billing_frequency: values.billing_frequency,
          billing_terms: values.billing_terms,
        })),

        subtotal: calculateSubtotal(),
        total_price: calculateTotal(),
      };
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
        return;
      } else {
        setError(null);
      }
      try {
        const res = await dispatch(
          addProductCart({ ...payload, token: token?.id })
        );

        if (res?.payload?.data?.status == 1) {
          setCardholderName("");
          setSelectedProduct([]);
          navigate(".", { replace: true, state: {} });
          formik.resetForm();
          cardNumberElement.clear();
          cardExpiryElement.clear();
          cardCvcElement.clear();
         
          navigate("/client-subscription/success");
        }
      } catch (error) {}
    },
  });
 


    const  productList1 = useSelector(
      (store: any) => store
    );
    

  const handleElementChange = () => {
    if (error) setError(null);
  };
  const handleFocus = (type: string) => setIsFocused(type);
  const handleBlur = () => setIsFocused(null);
  const isFieldFocused = (fieldType: string) => isFocused === fieldType;

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = event.target.value;

    formik.setFieldValue("country", selectedCountry);
  };




  const onDelete = () => {
    setSelectedProduct((prevProducts) =>
      prevProducts.filter((product) => product.id != id)
    );
    setIsOpenDeletedModal(false);
  };

  useEffect(() => {
    setNoErr("");
   
  }, [formik.values.no_of_payments]);

  useEffect(() => {
    setNoErrBT("");
   
  }, [formik.values.billing_terms]);





  return (
    <div className="bg-gray-100 min-h-screen ">
      <header className="w-full h-[104px] bg-white flex items-center justify-center border-t border-b border-[#EDEDFC]">
        <img
          src="assets/icons/remote-icon.svg"
          alt="Header Icon"
          width={190}
          height={54}
        />
      </header>

      <div className="md:p-64 p-24 bg-[#F7F9FB]">
        <Typography className="mb-4 font-bold text-[36px]">
          Complete Your Purchase
        </Typography>
        <Typography className="mb-8 text-gray-600 text-[18px]">
          Conveys the intention to provide complete assistance in arranging.
        </Typography>

        <form onSubmit={handleForm} className="space-y-6" noValidate>
          <div className="flex flex-col lg:flex-row lg:space-x-14">
            <div className="flex-1 p-8 ">
              <Typography variant="h6" className="mb-6 font-bold">
                Personal Information
              </Typography>

              <div className="flex justify-between w-full gap-x-10 mt-16 items-center">
                <InputFieldPublic
                  formik={formik}
                  name="first_name"
                  placeholder="Enter First Name"
                  label="First Name"
                  icon={userIcon}
                />
                <InputFieldPublic
                  formik={formik}
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter Last Name"
                  icon={userIcon}
                />
              </div>

              <div className={"mt-16"}>
                <InputFieldPublic
                  formik={formik}
                  name="company_name"
                  label="Company Name"
                  placeholder="Enter Company name"
                  icon={businessIcon}
                />
              </div>
              <div className={"mt-16"}>
                <InputFieldPublic
                  formik={formik}
                  name="email"
                  label="Email Address"
                  placeholder="Enter Email Address"
                  icon={emailIcon}
                />
              </div>
              <div className={"mt-16 mb-16"}>
                <InputFieldPublic
                  formik={formik}
                  type="number"
                  name="phone_number"
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  icon={phoneIcon}
                />
              </div>
              <Typography variant="h6" className="mt-42 font-bold">
                Card Details
              </Typography>
              <div className={"mt-16"}>
                <InputFieldPublic
                  name="cardholderName"
                  label="Cardholder Name"
                  placeholder="Enter Cardholder Name"
                  value={cardholderName}
                  icon={userIcon}
                  onChange={(e) => setCardholderName(e.target.value)}
                />
              </div>

              <Grid item xs={12} className={"mt-16"}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-8">
                  Card Number
                </FormLabel>
                <div className="flex items-center gap-10 h-[46px] bg-[#ffffff] shadow-md p-[13px] rounded-6 border focus-within:border-[#4f46e5]">
                  <div className="text-[#4f46e5] ">
                    {/* Replace with an actual icon component (e.g., from react-icons or lucide-react) */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.125 4.5H4.875C3.42525 4.5 2.25 5.67525 2.25 7.125V16.875C2.25 18.3247 3.42525 19.5 4.875 19.5H19.125C20.5747 19.5 21.75 18.3247 21.75 16.875V7.125C21.75 5.67525 20.5747 4.5 19.125 4.5Z"
                        stroke="#4F46E5"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.25 9H21.75M6 14.0625H8.25V15H6V14.0625Z"
                        stroke="#4F46E5"
                        stroke-width="1.875"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <CardNumberElement
                    options={{
                      ...cardElementOptions,
                      placeholder: "Enter Card Number",
                    }}
                    className="flex-1 bg-transparent text-[#111827]"
                    onChange={(event) => handleElementChange()}
                    onFocus={() => handleFocus("number")}
                    onBlur={() => handleBlur()}
                  />
                </div>
                {error && error.includes("number") && (
                  <div style={{ color: "red" }}>{error}</div>
                )}
              </Grid>

              <Grid item xs={6} className={"mt-16"}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-8">
                  CVV
                </FormLabel>
                <div className="flex items-center h-[46px] gap-10 bg-[#ffffff] shadow-md p-[13px] rounded-6 border focus-within:border-[#4f46e5]">
                  <span className="text-[#4f46e5] mr-3">
                    {/* Replace with an actual icon component (e.g., from react-icons or lucide-react) */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V12H20V19ZM20 10H4V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10Z"
                        fill="#4F46E5"
                      />
                    </svg>
                  </span>
                  <CardCvcElement
                    options={{ ...cardElementOptions, placeholder: "CVV" }}
                    className="flex-1 bg-transparent text-[#111827]"
                    onChange={handleElementChange}
                    onFocus={() => handleFocus("cvc")}
                    onBlur={handleBlur}
                  />
                </div>

                {error && error.includes("security") && (
                  <div style={{ color: "red" }}>{error}</div>
                )}
              </Grid>
              <Grid item xs={6} className={"mt-16"}>
                <FormLabel className="block text-[16px] font-medium text-[#111827] mb-8">
                  Expiration Date
                </FormLabel>
                <div className="flex items-center  gap-10 h-[46px] bg-[#ffffff] shadow-md p-[13px] rounded-6 border focus-within:border-[#4f46e5]">
                  <span className="text-[#4f46e5] mr-3">
                    {/* Replace with an actual icon component (e.g., from react-icons or lucide-react) */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V12H20V19ZM20 10H4V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10Z"
                        fill="#4F46E5"
                      />
                    </svg>
                  </span>
                  <CardExpiryElement
                    options={cardElementOptions}
                    className="flex-1 bg-transparent text-[#111827]"
                    onChange={handleElementChange}
                    onFocus={() => handleFocus("expiry")}
                    onBlur={handleBlur}
                  />
                </div>

                {error &&
                  (error.toLowerCase().includes("expiry") ||
                    error.toLowerCase().includes("expiration") ||
                    error.toLowerCase().includes("expired")) && (
                    <div style={{ color: "red" }}>{error}</div>
                  )}
              </Grid>
              <div className={"mt-16 "}>
                <SelectField
                  formik={formik}
                  name="country"
                  label="Country"
                  placeholder="Select Country"
                  onChange={handleCountryChange}
                  className={""}
                  sx={{
                    background: "white",
                    boxShadow:
                      "0px 1px 2px rgba(0, 0, 0, 0.05),  0px 3px 3px rgba(0, 0, 0, 0.05),  0px 7px 4px rgba(0, 0, 0, 0.03),0px 12px 5px rgba(0, 0, 0, 0.02), 0px 18px 5px rgba(0, 0, 0, 0.01);",
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
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={`${
                  actionStatus ? "btn-disable" : ""
                } capitalize text-[18px] mt-16 md:w-[272px] h-[50px] w-full`}
                sx={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  height: "50px",
                  width: "206px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#3730a3",
                  },
                }}
                disabled={selectedProduct.length === 0 || actionStatus}
              >
                {actionStatus ? (
                  <Box
                    marginTop={0}
                    id="spinner"
                    sx={{
                      "& > div": {
                        backgroundColor: "palette.secondary.main",
                      },
                    }}
                  >
                    <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                    <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                    <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
                  </Box>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

            <div className="w-[1px] bg-[#4F46E52B] mx-8"></div>

            <div className="flex-1 mt-8 lg:mt-0">
              <Card className="shadow-md bg-white p-8  rounded-lg">
                <CardContent>
                  <div className="flex justify-between mt-32 mb-32">
                    <div className="flex mb-6 ">
                      <Typography variant="h6" className="font-bold ">
                        Selected Products{" "}
                      </Typography>
                      <div className="!w-[38px] !max-h-[24px] !h-[24px] text-16 text-[#4F46E5] bg-[#EDEDFC] line-clamp-4 text-center font-[400px] ms-6 mt-2 rounded-md px-[1px] border-1 border-secondary">
                        {" "}
                        {selectedProduct?.length}
                      </div>
                    </div>

                    {selectedProduct?.length == productList?.length ? (
                      <> </>
                    ) : (
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="h-[40px] text-[16px] flex gap-8 font-[600]"
                        aria-label="Add Tasks"
                        size="large"
                        onClick={() => setIsOpenAddModal(true)}
                      >
                        <PlusIcon color={"#4f46e5"} />
                        Add Product
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-10">
                    {selectedProduct.length === 0 ? (
                      <div
                        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                        style={{ alignItems: "center" }}
                      >
                        <NoDataFound />
                        <Typography className="text-[24px] text-center font-600 leading-normal">
                          No Product found!
                        </Typography>
                      </div>
                    ) : (
                      <div className="">
                        {Array?.isArray(selectedProduct) &&
                          selectedProduct?.map((product) => (
                            <Card
                              key={product?.id}
                              className="w-full h-[125px] bg-[#F7F9FB] border-1 border-[#EDEDFC] shadow-none rounded-lg mb-8 mt-22 p-8"
                            >
                              <CardContent className="flex flex-col h-full justify-between ">
                                <div className="flex justify-between">
                                  {/* <Typography
                                  variant="h6"
                                  className="font-bold text-[20px]"
                                >
                                  {product?.name?.length > 15 ? (
                                                           <Tooltip title={product?.name} arrow>
                                                             <span>{truncateText(product?.name, 15)}</span>
                                                           </Tooltip>
                                                         ) : (
                                                           <span>{product?.name}</span>
                                                         )}
                                </Typography> */}
                                  <TruncateText
                                    text={product?.name}
                                    maxWidth={600}
                                  />
                                  <span
                                    className="p-2 cursor-pointer"
                                    onClick={() => {
                                      setIsOpenDeletedModal(true);
                                      setId(product.id);
                                    }}
                                  >
                                    <img src={deleteIcon} alt={"delete"} />
                                  </span>
                                </div>
                                <div className="flex justify-between items-center ">
                                  {/* <div className="flex flex-row gap-x-2 items-center"> */}
                                  <Typography
                                    variant="h5"
                                    className="font-bold text-[26px]"
                                    style={{ color: "#4F46E5" }}
                                  >
                                    ${product.unit_price}
                                  </Typography>

                                  <SelectField
                                    formik={formik}
                                    name="billing_frequency"
                                    className="ms-4 border-none bg-transparent mt-[10px] w-[150px]"
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        "billing_frequency",
                                        e?.target?.value
                                      );
                                    }}
                                    // value={formik.values.billing_frequency} // Ensure correct value binding
                                  >
                                    {EmployOptions1?.map((item) => (
                                      <StyledMenuItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </StyledMenuItem>
                                    ))}
                                  </SelectField>

                                  {/* </div> */}
                                  <div className="flex items-center space-x-10">
                                    <ProductRow
                                      product={product}
                                      onQuantityChange={handleQuantityChange}
                                    />

                                    <div className="flex items-center">
                                      <label className="text-[#4F46E5] mr-2 whitespace-nowrap font-[600]">
                                        Net Price:
                                      </label>
                                      <span className="text-black">
                                        ${product.quantity * product.unit_price}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}

                    <div className="">
                      <InputFieldPublic
                        formik={formik}
                        placeholder="Enter Title Name"
                        name="title"
                        type="text"
                        icon={<UserIcon />}
                      />
                    </div>

                    <div className="flex w-full gap-10 ">
                      <div className="w-[55%]">
                        <SelectField
                          formik={formik}
                          name="billing_terms"
                          placeholder="Select Billing Terms"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            // formik.setFieldValue(
                            //   "billing_terms",
                            //   event?.target?.value
                            // );
                            formik.setFieldValue(
                              "no_of_payments",
                              event?.target?.value === "1" ||
                                event?.target?.value === "0"
                                ? ""
                                : 0
                            );
                            if (formik.errors.billing_terms) {
                              formik.setFieldError("billing_terms", "");
                            }
                            formik.setFieldValue(
                              "billing_terms",
                              event?.target?.value
                            );
                          }}
                          sx={{
                            border: "1px solid #D4D4D4",
                            background: "white",
                          }}
                        >
                          {BillingTermsOptions?.map((item) => (
                            <StyledMenuItem key={item.value} value={item.value}>
                              {/* <TruncateText text={item.label} maxWidth={90} /> */}
                              {item.label}
                            </StyledMenuItem>
                          ))}
                        </SelectField>
                        {/* {noErrorBT && (
                          <div className="text-red pt-[9px]  block text-[14px]">
                            {noErrorBT}
                          </div>
                        )} */}
                      </div>
                      {formik.values.billing_terms != "1"?
                      <div className="w-[45%]">
                        <InputFieldPublic
                          id="filled-hidden-label-small"
                          name="no_of_payments"
                          placeholder="No of Payment : 0"
                          type="number"
                          formik={formik}
                   disabled={true}
                          className="common-inputField"
                          onChange={() => setNoErr("")}
                          inputProps={{
                            className: "",
                            min: 0,
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              border: "0.5px solid #9DA0A6",
                              height: 44,
                              "::placeholder": {
                                color: "#111827 !important",
                                opacity: 1,
                              },
                              pointerEvents: "none",
                            },
                          }}
                        />
                        {noError && (
                          <div className="text-red pt-[9px]  block text-[14px]">
                            {noError}
                          </div>
                        )}
                      </div>:
                       <div className="w-[45%]">
                       <InputFieldPublic
                         id="filled-hidden-label-small"
                         name="no_of_payments"
                         placeholder="No of Payment : 0"
                         type="number"
                         formik={formik}
                         className="common-inputField"
                         onChange={() => setNoErr("")}
                         inputProps={{
                           className: "",
                           min: 0,
                         }}
                         sx={{
                           "& .MuiInputBase-input": {
                             border: "0.5px solid #9DA0A6",
                             height: 44,
                             "::placeholder": {
                               color: "#111827 !important",
                               opacity: 1,
                             },
                             pointerEvents: "none",
                           },
                         }}
                       />
                       {noError && (
                         <div className="text-red pt-[9px]  block text-[14px]">
                           {noError}
                         </div>
                       )}
                     </div>}
                    </div>
                  </div>

                  <div className="mt-44 text-[18px] text-[#757982]">
                    <div className="flex  mb-20 ">
                      <Typography className="font-[400]">Subtotal</Typography>
                      <div
                        className="mt-10 ms-2 me-2"
                        style={{
                          alignItems: "center",
                          width: "100%",
                          borderTop: "2.5px dashed #B0B3B882",
                          bottom: "0",
                          opacity: "1",
                        }}
                      />
                      <Typography className="text-black font-500">
                        ${calculateSubtotal()}
                      </Typography>
                    </div>

                    <div className="flex  mb-20 ">
                      <Typography className="font-[400]">
                        {subscriptionData?.global_processing_fee_description ||
                          ""}
                      </Typography>
                      <div
                        className="mt-10 ms-2 me-2"
                        style={{
                          alignItems: "center",
                          width: "100%",
                          borderTop: "2.5px dashed #B0B3B882",
                          bottom: "0",
                          opacity: "1",
                        }}
                      />
                      <Typography className="text-black font-500">
                        {subscriptionData?.global_processing_fee}%
                      </Typography>
                    </div>

                    <div className="flex  font-bold mb-20 items-center">
                      <Typography>Total</Typography>
                      <div
                        className=" ms-2 font-[400] me-2"
                        style={{
                          alignItems: "center",
                          width: "100%",
                          borderTop: "2.5px dashed #B0B3B882",
                          bottom: "0",
                          opacity: "1",
                        }}
                      />
                      <Typography className="text-[20px] text-[#4F46E5] font-700">
                        ${calculateTotal()}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <AddProductModel
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        handleData={handleData}
        selectedProduct={selectedProduct}
        onClose={()=>{
       
          setIsOpenAddModal(false);
        }}
      />
      <DeleteProduct
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={onDelete}
        // disabled={disable}
      />
    </div>
  );
};

export default CartPage;
