import {
  Box,
  Button,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";

import { useFormik } from "formik";

import TitleBar from "src/app/components/TitleBar";

import {
  addSubscriptionSetting,
  getSubscriptionSetting,
} from "app/store/Agent group";
import { RootState, useAppDispatch } from "app/store/store";
import { TooltipArrow } from "public/assets/icons/topBarIcons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import InputField from "src/app/components/InputField";
import { AddSettingSubscription } from "src/formSchema";
import { getUserDetail } from "src/utils";

const userDetail = getUserDetail();

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#F6F6F6 ",
    color: "#111827",
    maxWidth: 220,
    fontSize: "12px",
    border: "0.5px solid #B0B3B8",
    borderRadius: "10px",
    boxShadow: "2px 2px 6px 0px #00000033",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#F6F6F6",
    "&::before": {
      border: "0.5px solid #B0B3B8", // Arrow border color
      boxShadow: "2px 2px 6px 0px #00000033",
    },
  },
}));

export default function SettingSubscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { Accesslist, AccessStatus } = useSelector(
    (state: RootState) => state.project
  );
  const disabled = false;
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    const { payload } = await dispatch(getSubscriptionSetting({}));
    const DATA = payload?.data?.data;
    if (payload?.data?.data) {
      formik.setValues({
        overdue_period_days: DATA.overdue_period_days || "",
        suspend_period_days: DATA.suspend_period_days || "",
        automatic_reminder_email_days: DATA.automatic_reminder_email_days || "",
        overdue_reminder_email_days: DATA.overdue_reminder_email_days || "",
        card_expiry_reminder_email_days:
          DATA.card_expiry_reminder_email_days || "",
        payment_retry_overdue_status_days:
          DATA.payment_retry_overdue_status_days || "",
        payment_retry_suspended_status_days:
          DATA.payment_retry_suspended_status_days || "",
        global_processing_fee: DATA.global_processing_fee || "",
        global_processing_fee_description:
          DATA.global_processing_fee_description || "",
      });
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { payload } = await dispatch(addSubscriptionSetting(values));

      if (payload?.data?.status == 1) {
        toast.success(payload?.data?.message);
      } else {
        toast.error(payload?.data?.message);
      }
    } catch (error) {
      console.error("Error adding subscription setting:", error);
      toast.error(error);
    } finally {
      setLoading(false); // Always stop loading indicator
    }
  };

  const formik = useFormik({
    initialValues: {
      overdue_period_days: "",
      suspend_period_days: "",
      automatic_reminder_email_days: "",
      overdue_reminder_email_days: "",
      card_expiry_reminder_email_days: "",
      payment_retry_overdue_status_days: "",
      payment_retry_suspended_status_days: "",
      global_processing_fee: "",
      global_processing_fee_description: "",
    },
    validationSchema: AddSettingSubscription,
    onSubmit,
    // validateOnChange: true,
  });

  useEffect(() => {
    if (
      window.location.pathname.includes("setting") &&
      userDetail?.role_id == 4 &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/accountManager/dashboard`);
    }
    // client_id
  }, [Accesslist]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <>
        <TitleBar title="Settings"></TitleBar>
        <div className="px-[15px] mb-[3rem]">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex gap-20 p-24 flex-col sm:w-[70%]">
              <div className=" rounded-xl p-24 border-1 border-[#E7E8E9]">
                <Typography className="text-[#0A0F18] text-18 pb-24 font-500">
                  Overdue and Suspend Settings
                </Typography>
                <div className="flex flex-row gap-10 flex-wrap md:flex-nowrap">
                  <InputField
                    formik={formik}
                    name="overdue_period_days"
                    type="number"
                    label="Overdue Period (in Days)"
                    placeholder="Enter Overdue Period (in Days)"
                    icon
                    tooltipTitle={
                      "How many days after subscription is not paid do we change status to overdue"
                    }
                    placeStyle={true}
                  />

                  <InputField
                    formik={formik}
                    name="suspend_period_days"
                    type="number"
                    label="Suspend Period (in Days)"
                    placeholder="Enter Suspend Period (in Days)"
                    icon
                    tooltipTitle={
                      "How many days after subscription is not paid we suspend user (change client status to inactive so he can't login)"
                    }
                    placeStyle={true}
                  />
                </div>
              </div>
              <InputField
                formik={formik}
                mainType="comma"
                name="automatic_reminder_email_days"
                label="Send Automatic Payment Reminder Email (in Days)"
                placeholder="Enter Payment Reminder Email (in Days)"
                icon
                tooltipTitle={
                  " This option controls when the renewal reminder email for automatic subscriptions needs to be sent, (You can set multiple email reminders for the day by separating them with a comma)."
                }
                placeStyle={true}
              />

              <InputField
                formik={formik}
                mainType="comma"
                name="overdue_reminder_email_days"
                label="Send Overdue Reminder Email (in Days)"
                placeholder="Enter Overdue Reminder Email (in Days)"
                icon
                tooltipTitle={
                  "As soon as the subscription status becomes Overdue a reminder email will be sent immediately. In addition to that if you want to sent additional overdue reminder emails, then you can set on what days after the subscription becomes overdue, you want to sent the emails, (You can set multiple email reminders for the day by separating them with a comma)."
                }
                placeStyle={true}
              />

              <InputField
                formik={formik}
                mainType="comma"
                name="card_expiry_reminder_email_days"
                label="Send Credit Card Expiry Reminder Email (in Days)"
                placeholder="Enter Expiry Reminder Email (in Days)"
                icon
                tooltipTitle={
                  " This option controls when the credit card expiry reminder email needs to be sent, (You can set multiple email reminders for the day by separating them with a comma)."
                }
                placeStyle={true}
              />
              <InputField
                formik={formik}
                // mainType="comma"
                type="number"
                name="payment_retry_overdue_status_days"
                label="Automatic Payment Retry in Overdue Status (Times Per Day)"
                placeholder="Enter number of payment (Times Per Day)"
                icon
                tooltipTitle={
                  "This option controls the number of times automatic payment retry will happen when the subscription is in overdue status in case of payment failure in automatic payment mode."
                }
                placeStyle={true}
              />
              <InputField
                // mainType="comma"
                type="number"
                formik={formik}
                name="payment_retry_suspended_status_days"
                label="Automatic Payment Retry in Suspended Status (Times Per Day)"
                placeholder="Enter number of payment (Times Per Day)"
                icon
                tooltipTitle={
                  "This option controls the number of times automatic payment retry will happen when the subscription is in suspended status in case of payment failure in automatic payment mode."
                }
                placeStyle={true}
              />
              <div className=" rounded-xl px-24  border-1 border-[#E7E8E9]">
                <div className="flex gap-5">
                  <Typography className="text-[rgb(10,15,24)] text-18 pb-24 pt-24 font-500  ">
                    Global Processing Fees in %
                  </Typography>

                  <div className="mt-4 pt-24 mb-0">
                    <HtmlTooltip
                      title="Global processing fees for Subscription and Invoice."
                      arrow
                      // sx={{
                      //   width: "100px",
                      //   background: "pink",
                      //   "& .MuiTooltip-arrow": {
                      //     color: "red !important",
                      //   },
                      // }}
                    >
                      <span>
                        <TooltipArrow />
                      </span>
                    </HtmlTooltip>
                  </div>
                </div>
                <div className="flex flex-row gap-10 flex-wrap md:flex-nowrap mb-10">
                  <InputField
                    formik={formik}
                    name="global_processing_fee_description"
                    label="Description"
                    placeholder="Enter Description"
                  />
                  <InputField
                    formik={formik}
                    type="number"
                    name="global_processing_fee"
                    label="Processing Fees"
                    placeholder="Enter Fees In %"
                  />
                </div>
              </div>
              <Button
                variant="contained"
                color="secondary"
                className={`${
                  loading ? "btn-disable" : ""
                } w-[156px] h-[48px] text-[16px] font-400`}
                onClick={(e) => {
                  e.stopPropagation();
                  formik.handleSubmit();
                }}
                disabled={loading}
              >
                {/* {disabled ? <CircularProgress size={24} sx={{ color: '#4F46E5' }} /> : btnTitle} */}
                {loading ? (
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
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
