import { Box, Button, Grid, Theme, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/styles";
// import { subscriptionDetails } from "app/store/Client";
import ListLoading from "@fuse/core/ListLoading";
import {
  subscriptionDetails,
  subscriptionPaused,
  subscriptionResume,
} from "app/store/Client";
import { setBreadcrumbFor, setBreadcrumbs } from "app/store/breadCrumb";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { LastPayment, PauseIcon, ResumeIcon } from "public/assets/icons/common";
import { Timericon } from "public/assets/icons/subscription";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import AddAgentModel from "src/app/components/agents/AddAgentModel";
import { getAdjustedDate, getUserDetail } from "src/utils";
import CancelButtonPage from "./CancelButtonPage";
import ItemTable from "./ItemTable";
import RecurringInfo from "./RecurringInfo";
import SubscriptionLog from "./SubscriptionLog";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PausedSubscription from "./PausedSubscription";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ padding: 0 }}
    >
      {value === index && (
        <Box sx={{ paddingTop: 4 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const CustomButton = styled(Button)({
  "&:hover": {
    backgroundColor: "inherit !important", // Remove hover background color
  },
});

export default function SubscriptionDetails() {
  const theme: Theme = useTheme();
  const { subscription_id } = useParams();
  const dispatch = useAppDispatch();
  const userDetail = getUserDetail();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });
  const navigate = useNavigate();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState<any>([]);
  const { Accesslist } = useSelector((state: RootState) => state.project);
  // const [statusButton, setStatusButton] = useState('Active')
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const fetchData = async () => {
    try {
      const payload = {
        client_id: subscription_id,
      };
      //@ts-ignore
      const res = await dispatch(subscriptionDetails(payload));
      // setList(res?.payload?.data?.data?.list);
      setRows(res?.payload?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (!subscription_id) return null;

    fetchData();
  }, [dispatch]);

  const StatusMapping = (status) => {
    if (status == 0) {
      return "Pending";
    } else if (status == 1) {
      return "Completed";
    } else if (status == 2) {
      return "Paused";
    } else if (status == 3) {
      return "Expired";
    } else if (status == 4) {
      return "Cancelled";
    } else if (status == 5) {
      return "Overdue";
    } else if (status == 6) {
      return "Suspended";
    }
  };

  const FutureDate = getAdjustedDate(
    new Date(rows?.subscription_start_date),
    Number(rows?.billing_frequency)
  );

  const renderAddress = (row) => {
    const addressComponents = [
      row?.address,
      row?.address2,
      row?.city,
      row?.state,
      row?.country,
      row?.zipcode,
    ].filter(Boolean); // Filter out any falsy values (null, undefined, empty string)

    return addressComponents.length > 0 ? addressComponents.join(", ") : "N/A";
  };

  useEffect(() => {
    if (rows?.userName) {
      dispatch(
        setBreadcrumbs([
          {
            path: `/admin/client/detail/${rows?.client_id}?type=profile`,
            label: rows?.userName ? rows?.userName : "Client",
          },
          {
            path: `/admin/client/detail/${rows?.client_id}?type=subscription`,
            label: `Subscriptions`,
          },
          {
            path: "",
            label: rows?.title ? rows?.title : "",
          },
        ])
      );
    }
    dispatch(setBreadcrumbFor("subscription-detail"));
  }, [rows]);

  const handlePaused = async () => {
    setLoading(true);
    try {
      const payload = {
        client_id: subscription_id,
      };
      const res =
        rows.status === 1
          ? await dispatch(subscriptionPaused(payload))
          : await dispatch(subscriptionResume(payload));

      toast.success(res?.payload?.data?.message);
      fetchData();
      setIsPaused(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (
      window.location.pathname.includes("subscription") &&
      userDetail?.role_id == 4 &&
      Accesslist.client_subscriptions == 0
    ) {
      navigate(`/admin/client/detail/${rows?.client_id}?type=profile`);
    }
    // client_id
  }, [Accesslist]);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  if (isLoading) {
    return <ListLoading />;
  }

  return (
    <>
      <TitleBar title="Subscription Details"></TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm py-[2rem]">
          <div className="flex items-center justify-between pb-12 px-20 ">
            <Typography className="text-[20px] font-600 text-[#0A0F18] w-full">
              Client Information
            </Typography>
            {(rows?.status == 1 || rows?.status == 2) && (
              <div className="flex  flex-col sm:flex-row  w-full justify-end gap-20">
                <CancelButtonPage
                  client_id={rows?.client_id}
                  Sub_id={subscription_id}
                  fetchDepartmentList={fetchData}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  className="font-600 text-[16px] px-44"
                  onClick={() => {
                    setIsPaused(true);
                  }}
                >
                  {rows.status == 1 ? "Paused" : "Resume"}
                </Button>
              </div>
            )}
          </div>
          <Box sx={{ width: "100%", padding: 2 }}>
            <Grid container className="h-auto p-0 mb-[30px] ">
              <Grid item xs={12} sm={12} md={12} className="p-0 ">
                <div className="flex flex-col  gap-10 bg-[#FFFFFF] h-auto rounded-12 ">
                  <div className="border border-[#E7E8E9] rounded-lg flex  justify-left gap-[30px] items-start p-[2rem] flex-col sm:flex-row relative ">
                    <div>
                      <div className="h-[100px] w-[100px] sm:h-[100px] sm:w-[126px] rounded-full overflow-hidden">
                        <img
                          src={
                            rows?.user_image
                              ? urlForImage + rows.user_image
                              : "../assets/images/logo/images.jpeg"
                          }
                          alt=""
                          className="h-[100px] w-[100px] rounded-full"
                        />
                      </div>
                    </div>
                    <div className="pt-20">
                      {/* <div className="flex rounded-full py-[1rem] px-[2rem] text-secondary bg-secondary_bg w-max gap-[20px] text-lg font-600 items-center absolute right-[2rem] top-[2rem]">
                        Edit
                        <EditIcon fill="#4F46E5" />
                      </div> */}

                      <div className="flex sm:items-center items-start sm:gap-40 gap-10 mb-10 sm:flex-row flex-col">
                        <div className="text-[24px] text-[#111827] font-semibold inline-block ">
                          {rows?.userName ? rows?.userName : "N/A"}
                        </div>
                        <div
                          className={` px-20 h-20 flex items-center justify-center rounded-3xl   border-none sm:min-h-24 leading-none 
                            ${StatusMapping(rows?.status)}`}
                        >
                          {/* {`${
                            // rows?.status == 0 || rows?.status == 1 ? "In " : ""
                          } */}
                          {StatusMapping(rows?.status)}
                          {/* kkjkj */}
                        </div>
                      </div>
                      <div className="flex text-[2rem] text-para_light flex-col sm:flex-row gap-8 flex-wrap ">
                        <div className="flex items-center pr-20 gap-2">
                          <span>
                            <Timericon />
                          </span>
                          <span>
                            {rows?.subscription_start_date
                              ? rows?.subscription_start_date
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex ">
                          <img
                            src="../assets/icons/ic_outline-email.svg"
                            className="mr-4"
                          />
                          <p className="truncate max-w-[200px] sm:!max-w-[300px]">
                            {rows?.email ? rows?.email : "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center sm:px-20">
                          <span>
                            <img
                              src="../assets/icons/ph_phone.svg"
                              className="mr-4"
                            />{" "}
                          </span>
                          <span>
                            {rows?.phone_number ? rows?.phone_number : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline w-full py-20 gap-20 flex-col sm:flex-row">
                        <div className="flex flex-col items-start gap-14">
                          <span className="text-[1.8rem] text-title font-500">
                            Company Name
                          </span>
                          <span className=" text-[#757982]  text-[1.8rem] font-400 mb-5 flex ">
                            <img
                              src="../assets/icons/tech.svg"
                              className="mr-4"
                            />
                            <span>
                              {rows?.company_name ? rows?.company_name : "N/A"}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-col pr-10 gap-7 ">
                          <div className="flex flex-col items-start gap-14">
                            <span className="text-[1.8rem] text-title font-500">
                              Address
                            </span>
                            <span className=" text-[#757982]  text-[1.8rem] font-400 mb-5 flex ">
                              <img
                                src="../assets/icons/loaction.svg"
                                className="mr-4"
                              />
                              <p style={{ wordBreak: "break-all" }}>
                                {/* {accManagerDetail?.address || "N/A"} */}
                                {renderAddress(rows)}
                              </p>
                              <span>
                                {/* {rows?.address ? rows?.address : "N/A"} */}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid item lg={12} className="basis-full mt-[30px]"></Grid>
            </Grid>
            <Typography
              variant="h6"
              className="mb-4 text-[20px] font-600 text-[#0A0F18] py-20 px-20"
            >
              Payment Method
            </Typography>
            {/* <PaymentSubscriptio /> */}
            <Grid container spacing="26px" className="">
              <Grid item lg={6} className="basis-full">
                {" "}
                {/* <PaymentSubscriptio />
                 */}
                <div className="  ">
                  <div
                    className="p-16 pe-20 rounded-[10px] bg-bgGrey basis-full lg:basis-[calc(50%_-_16px)] min-h-[106px]"
                  // key={index}
                  >
                    {rows?.card ? (
                      <div className="flex items-center gap-[1.8rem]">
                        <div className="w-[86px] h-[68px] rounded-8 bg-white flex items-center justify-center shrink-0">
                          {rows?.card.includes("BANK") ? <img
                            src="/assets/images/pages/billing/otherBank1.svg"
                            className="max-w-[64px]"
                            alt={rows?.card}
                          /> : <img
                            src={`/assets/images/pages/billing/${rows?.card == "visa"
                              ? "visa.svg"
                              : rows?.card == "mastercard"
                                ? "mastercard.svg"
                                : "card.svg"
                              }`}
                            className="max-w-[64px]"
                            alt={rows?.card}
                          />}
                        </div>
                        <div className="flex items-start justify-between gap-10 grow ">
                          <div>
                            <h4 className="text-title text-xl font-700 mb-8">
                              **** **** **** {rows?.card_last_digit}
                            </h4>
                            <p className="text-lg text-title_light capitalize">
                              {rows?.card}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item lg={6} className="basis-full">
                <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-bgGrey">
                  <div>
                    <Typography
                      component="h4"
                      className="mb-8 text-2xl text-title font-600"
                    >
                      Last Payment Amount And Date
                    </Typography>
                    {rows?.status == 0 ? (
                      "N/A"
                    ) : (
                      <p className="text-para_light">
                        <span className="text-secondary">
                          ${rows?.last_payment_amount}
                        </span>
                        , {rows?.subscription_start_date}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
                    <LastPayment />
                  </div>
                </div>
              </Grid>
              {rows?.billing_frequency !== 1 && (
                <Grid item lg={6} className="basis-full">
                  <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-bgGrey ">
                    <div>
                      <Typography
                        component="h4"
                        className="mb-8 text-2xl text-title font-600"
                      >
                        Next Payment Amount And Date
                      </Typography>
                      {rows?.status == 0 ||
                        rows?.status == 4 ||
                        rows?.status == 2 ? (
                        "N/A"
                      ) : (
                        <p className="text-para_light">
                          <span className="text-secondary">
                            ${rows?.future_payment_amount},{" "}
                          </span>
                          {rows?.end_date}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
                      <LastPayment />
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
          </Box>
        </div>
      </div>
      <ItemTable rows={rows} description={rows?.description} />
      <SubscriptionLog id={subscription_id} />
      <br />
      <br />
      {rows.billing_frequency !== 1 && (
        <RecurringInfo rows={rows?.future_payments} status={rows?.status} />
      )}
      <br />
      {isOpenAddModal && (
        <AddAgentModel
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          isEditing={false}
        />
      )}
      <PausedSubscription
        isOpen={isPaused}
        setIsOpen={setIsPaused}
        onDelete={handlePaused}
        heading={rows.status == 1 ? "Pause " : "Resume"}
        description={`Are you sure you want to ${rows.status == 1 ? "pause" : "resume"} this subscription? `}
        isLoading={loading}
        icon={rows.status == 1 ? <PauseIcon /> : <ResumeIcon />}
      />
    </>
  );
}
