import ListLoading from "@fuse/core/ListLoading";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { setBreadcrumbFor, setBreadcrumbs } from "app/store/breadCrumb";
import { UpdateStatus, getClientInfo, resetPassword } from "app/store/Client";
import { ClientRootState, ClientType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import {
  ArrowRightCircleIcon,
  DownGreenIcon,
  EditIcon,
  LastPayment,
} from "public/assets/icons/common";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import ClientStatus from "../Subscription/ClientStatus";
import { getUserDetail } from "src/utils";
import { debounce } from "lodash";

interface ProfileProps {
  setIsOpenEditModal: (prev: boolean) => void;
  setIsOpenChangePassModal: (prev: boolean) => void;
  clientDetail: ClientType;
  name?: string;
}
export default function Profile({
  setIsOpenEditModal,
  setIsOpenChangePassModal,
  clientDetail,
  name,
}: ProfileProps) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null); // State to manage anchor element for menu
  const [selectedItem, setSelectedItem] = useState("Active");
  const [disable, setIsDisable] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to manage confirmation dialog visibility
  const [pendingStatus, setPendingStatus] = useState(null);
  // get current user detail
  let userDetail = getUserDetail();
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to the clicked button
  };
  const handleClose = () => {
    setAnchorEl(null); // Reset anchor element to hide the menu
  };
  const { fetchStatus } = useSelector(
    (store: ClientRootState) => store?.client
  );
  const { client_id } = useParams();
 
  const handleMenuItemClick = async (status) => {
    setPendingStatus(status);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed && pendingStatus) {
      setIsDisable(true);
      const res = await dispatch(
        UpdateStatus({
          user_id: client_id,
          status: pendingStatus === "Inactive" ? 2 : 1,
        })
      );
      await dispatch(getClientInfo({ client_id }));
      setIsDisable(false);
      toast.success(res?.payload?.data?.message);
      setSelectedItem(pendingStatus);
    }
    setIsConfirmOpen(false);
    setPendingStatus(null);
    handleClose(); // Close the menu after handling the click
  };

  const handleResetPassword = async () => {
    await dispatch(resetPassword({ client_id: client_id }));
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  useEffect(() => {
    setSelectedItem(clientDetail?.status);
  }, [clientDetail]);

  const renderAddress = (accManagerDetail) => {
    const addressComponents = [
      accManagerDetail?.address,
      accManagerDetail?.address2,
      accManagerDetail?.city,
      accManagerDetail?.state,
      accManagerDetail?.country,
      accManagerDetail?.zipcode,
    ].filter(Boolean); // Filter out any falsy values (null, undefined, empty string)

    return addressComponents.length > 0 ? addressComponents.join(", ") : "N/A";
  };
  useEffect(() => {
    const generateBreadCrumb = async () => {
      // Set an empty label or placeholder immediately
      if (fetchStatus != "loading") {
        // Delay setting the actual title label by 2 milliseconds
        dispatch(
          setBreadcrumbs([
            {
              path: "",
              label: `${clientDetail?.first_name ?? ""} ${clientDetail?.last_name ?? ""}`,
            },
          ])
        );
        dispatch(setBreadcrumbFor("/client/detail"));
      }
    };
    generateBreadCrumb();
  }, [clientDetail]);

  if (fetchStatus === "loading") {
    return <ListLoading />;
  }
  return (
    <>
      <Grid container className="h-auto p-0 mb-[30px] px-[2rem]">
        <Grid item xs={12} sm={12} md={12} className="p-0 ">
          <div className="flex flex-col  gap-10 bg-[#FFFFFF] h-auto rounded-12 ">
            <div className="border border-[#E7E8E9] rounded-lg flex  justify-left gap-[30px] items-start p-[2rem] flex-col md:flex-row relative">
              <div>
                <div className="h-[100px] w-[100px] sm:h-[100px] sm:w-[126px] rounded-full overflow-hidden">
                  <img
                    src={
                      clientDetail?.user_image
                        ? urlForImage + clientDetail.user_image
                        : "../assets/images/logo/images.jpeg"
                    }
                    alt="images"
                    className="h-[100px] w-[100px] rounded-full"
                  />
                </div>
              </div>
              <div className="pt-20">
                {(MainuserDetail?.role_id == 1 ||
                  (MainuserDetail?.role_id == 4 &&
                    clientDetail?.is_edit_access == 1 &&
                    Accesslist.client_edit != 2)) && (
                    <Button
                      className="edit_profile_btn"
                      onClick={() => setIsOpenEditModal(true)}
                    >
                      Edit
                      <EditIcon fill="#4F46E5" />
                    </Button>
                  )}

                <div className="flex md:items-center flex-col sm:flex-row md:gap-40 gap-10 mb-10">
                  <span className="text-[24px] text-[#111827] font-semibold inline-block">
                    {clientDetail?.first_name + " " + clientDetail?.last_name}
                  </span>
                  <div className="flex items-center gap-10 ">
                    <span className="text-[16px] text-[#757982]  inline-block">
                      Account Status :
                    </span>
                    <>
                      {/* <Button
                      variant="outlined"
                      className={`h-20 rounded-3xl border-none sm:min-h-24 leading-none ${
                        selectedItem === "Active"
                          ? "text-[#4CAF50] bg-[#4CAF502E]" // Green for 'Active'
                          : "text-[#F44336] bg-[#F443362E]"
                      }`}
                      endIcon={
                        <DownGreenIcon
                          color={
                            selectedItem == "Active" ? "#4CAF50" : "#F44336"
                          }
                        />
                      }
                      onClick={handleClick}
                    > */}
                      {/* {agentDetail?.status || "N/A"} */}
                      {/* {selectedItem}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose} */}
                      {/* // Close the menu when clicking outside or selecting an */}
                      {/* item */}
                      {/* > */}
                      {/* Define menu items */}
                      {/* <MenuItem
                        onClick={() => handleMenuItemClick("Active")}
                        disabled={selectedItem == "Active"}
                      >
                        Active
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleMenuItemClick("Inactive")}
                        disabled={selectedItem == "Inactive"}
                      >
                        Inactive
                      </MenuItem>
                    </Menu> */}
                      {/* <Dialog
                      open={isConfirmOpen}
                      onClose={() => setIsConfirmOpen(false)}
                      className="p-10"
                    > */}
                      {/* <DialogTitle>Confirm Status Change</DialogTitle> */}
                      {/* <DialogContent>
                        <DialogContentText className="text-[#000]">
                          Are you sure you want to {pendingStatus} this user?
                        </DialogContentText>
                      </DialogContent> */}
                      {/* <DialogActions className="pb-10 justify-center">
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={disable}
                          className={`${disable ? "btn-disable" : ""}
                      
                          text-[18px]`}
                          onClick={(e) => {
                            handleConfirm(true);
                          }}
                        >
                          {disable ? (
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
                            "Yes"
                          )}
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={disable}
                          className={`${disable ? "btn-disable-light" : ""}
       
           text-[18px] ml-14`}
                          onClick={(e) => {
                            handleConfirm(false);
                          }}
                        >
                          No
                        </Button> */}
                      {/* </DialogActions> */}
                      {/* </Dialog>   */}
                    </>
                    <ClientStatus
                      rowstatus={clientDetail?.status}
                      id={clientDetail?.id}
                      title={"client"}
                    />
                  </div>
                </div>
                <div className="flex text-[2rem] text-para_light flex-col sm:flex-row gap-10px ">
                  <div className="flex">
                    <img
                      src="../assets/icons/ic_outline-email.svg"
                      className="mr-4"
                    />
                    {MainuserDetail?.role_id == 1 ||
                      (MainuserDetail?.role_id == 4 &&
                        Accesslist.client_hide_info == 0) ? (
                      <span> {clientDetail?.email}</span>
                    ) : (
                      <span className="mt-8">*****</span>
                    )}
                  </div>
                  <div className="flex items-center sm:px-20">
                    <span>
                      <img
                        src="../assets/icons/ph_phone.svg"
                        className="mr-4"
                      />{" "}
                    </span>
                    {MainuserDetail?.role_id == 1 ||
                      (MainuserDetail?.role_id == 4 &&
                        Accesslist.client_hide_info == 0) ? (
                      <span>
                        {clientDetail?.country_code}{" "}
                        {clientDetail?.phone_number || "N/A"}
                      </span>
                    ) : (
                      <span className="mt-8">*****</span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline justify-between w-full py-20 gap-31 flex-col sm:flex-row gap-20">
                  <div className="flex flex-col pr-10 gap-7 ">
                    <span className="text-[20px] text-title font-500 w-max">
                      Subscription Status
                    </span>
                    <span className=" text-[#757982]  text-[20px] font-400 mb-5 flex ">
                      {clientDetail?.subscription_status || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start w-8/12 gap-7">
                    <span className="text-[20px] text-title font-500">
                      Company Name
                    </span>
                    <span className=" text-[#757982]  text-[20px] font-400 mb-5 flex ">
                      <img src="../assets/icons/tech.svg" className="mr-4" />
                      {clientDetail?.company_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between w-full pt-0 pb-20 gap-31 overflow-hidden">
                  <div className="flex flex-col pr-10 gap-7">
                    <span className="text-[20px] text-title font-500">
                      Address
                    </span>
                    <div className="grid grid-cols-[auto,1fr] items-center text-[#757982] text-[20px] font-400 mb-5">
                      <img
                        src="../assets/icons/loaction.svg"
                        className="mr-4"
                      />
                      {/* <p className="truncate">
                        {clientDetail?.address || "N/A"}
                      </p> */}
                      <p style={{ wordBreak: "break-word" }}>
                        {/* {accManagerDetail?.address || "N/A"} */}
                        {renderAddress(clientDetail)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        {!clientDetail?.social_id && (
          <Grid
            item
            lg={12}
            className="basis-full mt-[30px] flex  gap-28 flex-col sm:flex-row"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-secondary_bg">
                <div className="flex gap-[20px]  justify-center">
                  <div className="bg-secondary h-[54px] w-[54px] min-w-[54px] rounded-8 flex items-center justify-center">
                    <img src="../assets/icons/lock.svg" />
                  </div>
                  <div>
                    <Typography
                      component="h4"
                      className="mb-8 text-2xl text-title font-600"
                    >
                      Change Password
                    </Typography>
                    <p className="text-para_light">
                      For security purposes, if you wish to change your
                      password, please click here to change.
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0 w-[5rem] aspect-square flex   justify-center cursor-pointer rounded-lg border-borderColor"
                  onClick={() => {
                    setIsOpenChangePassModal(true);
                  }}
                >
                  <ArrowRightCircleIcon />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-secondary_bg h-full">
                <div className="flex gap-[20px] justify-center">
                  <div className="bg-secondary h-[54px] w-[54px] min-w-[54px] rounded-8 flex items-center justify-center">
                    <img src="../assets/icons/lock.svg" />
                  </div>
                  <div>
                    <Typography
                      component="h4"
                      className="mb-8 text-2xl text-title font-600"
                    >
                      Reset Password
                    </Typography>
                    <p className="text-para_light">
                      It will send a link to the client to reset their password.
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0 w-[5rem] aspect-square flex  justify-center cursor-pointer rounded-lg border-borderColor"

                // onClick={() => {
                //   setIsOpenChangePassModal(true);
                // }}
                >
                  <div
                    className="text-[#4F46E5] font-500 text-[14px] underline"
                    onClick={handleResetPassword}
                  >
                    Reset
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      <Grid container spacing="26px" className="px-[2rem]">
        <Grid item lg={6} className="basis-full">
          {/* <Link to="/change-password" className="contents"> */}
          <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-bgGrey">
            <div>
              <Typography
                component="h4"
                className="mb-8 text-2xl text-title font-600"
              >
                Last Payment Amount And Date
              </Typography>
              {!clientDetail?.last_subscription_detail ? (
                "N/A"
              ) : (
                <p className="text-para_light">
                  <span className="text-secondary">
                    ${clientDetail?.last_subscription_detail?.total_price}
                  </span>
                  ,{" "}
                  {
                    clientDetail?.last_subscription_detail
                      ?.subscription_start_date
                  }
                </p>
              )}
            </div>

            <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
              <LastPayment />
            </div>
          </div>
          {/* </Link> */}
        </Grid>
        <Grid item lg={6} className="basis-full">
          <div className="flex items-center justify-between gap-10 p-24 rounded-lg bg-bgGrey mb-[10px] ">
            <div>
              <Typography
                component="h4"
                className="mb-8 text-2xl text-title font-600"
              >
                Next Payment Amount And Date
              </Typography>
              {!clientDetail?.next_subscription_detail ? (
                "N/A"
              ) : (
                <p className="text-para_light">
                  <span className="text-secondary">
                    {" "}
                    ${clientDetail?.next_subscription_detail?.total_price}
                  </span>
                  , {clientDetail?.next_subscription_detail?.end_date}
                </p>
              )}
            </div>

            <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
              <LastPayment />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
