import FuseLoading from "@fuse/core/FuseLoading";
import { Button, Grid, Switch, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { GetProfile } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import {
  ClientProfileIcon,
  ProfileEmailIcon,
  ProfilePhoneIcon,
} from "public/assets/icons/clienIcon";
import { ArrowRightCircleIcon } from "public/assets/icons/common";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TitleBar from "src/app/components/TitleBar";
import EditMyProfile from "src/app/components/profile/EditMyProfile";
import TwoFactorAuth from "src/app/components/profile/TwoFactorAuth";
import { getClientId, getUserDetail } from "src/utils";

const Android12Switch = styled(Switch)(() => ({
  padding: 0,
  height: 34,
  width: 80,
  borderRadius: 100,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#f6f6f6",
    opacity: 1,
    "&::before, &::after": {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
    "&::before": {
      content: '"ON"',
      left: 10,
      color: "#fff",
      display: "none",
    },
    "&::after": {
      content: '"OFF"',
      right: 10,
      color: "#757982",
    },
  },
  "& .MuiButtonBase-root": {
    padding: 0,
    "& .MuiSwitch-input": {
      left: 0,
    },
    "&.Mui-checked": {
      "& .MuiSwitch-input": {
        left: "-55px",
      },
      transform: "translateX(44px)",
      "&+.MuiSwitch-track": {
        backgroundColor: "#4f46e5",
        opacity: 1,
        "&::before": {
          display: "inline",
        },
        "&::after": {
          display: "none",
        },
      },
    },
  },
  "& .MuiSwitch-thumb": {
    filter: "drop-shadow(0px 0px 6px rgba(0,0,0,0.1))",
    display: "block",
    boxShadow: "none",
    width: "28px",
    height: "auto",
    aspectRatio: 1,
    margin: 3,
    backgroundColor: "white",
  },
}));
export default function Profile() {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const clientId = getClientId();
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const { status, details } = useSelector((state: RootState) => state.password);
  const dispatch = useAppDispatch();
  const userDetails = getUserDetail();
  const handleAuthSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    // const { checked } = e.target;
    // setIsAuthenticate(checked);
    // if (checked) {
    setIsOpenAuthModal(true);
    // }
  };

  const fetchDetalis = async () => {
    try {
      const res = await dispatch(GetProfile());
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const scrollToTop = () => {
    const element = document.getElementById("verticalLayout");
    if (element) {
      element.scrollTo({
        top: 0,
        // behavior: "smooth", // Optional: adds smooth scrolling effect
      });
    }
  };
  useEffect(() => {
    fetchDetalis();
  }, []);
  useEffect(() => {
    scrollToTop();
  }, [details]);

  useEffect(() => {
    setIsAuthenticate(details?.two_factor_authentication == 1 ? true : false);
  }, [status]);

  if (status == "loading") {
    return <FuseLoading />;
  }
  return (
    <div>
      <TitleBar title="My Profile" />
      <div className="px-28 gap-20 mb-[3rem]">
        <div className="shadow-md bg-white rounded-lg overflow-hidden ">
          <div className="py-[3rem] px-[2.4rem] flex justify-between   gap-20 xs:flex-col sm:flex-row ">
            <div className="flex sm:items-center gap-[4rem] grow flex-col sm:flex-row">
              {details?.user_image ? (
                <img
                  src={urlForImage + details.user_image}
                  alt=""
                  className="h-[100px] w-[100px] rounded-full"
                />
              ) : (
                <img
                  src="../assets/images/logo/images.jpeg"
                  alt=""
                  className="h-[100px] w-[100px] rounded-full"
                />
              )}
              <div>
                <h4 className="text-3xl font-600 mb-8">
                  {details?.first_name + " " + details?.last_name}
                </h4>
                <div className="flex justify-between gap-16 text-para_light text-xl lg:gap-[3.2rem] flex-col sm:flex-row flex-wrap">
                  <p className="flex gap-4 items-center">
                    <ClientProfileIcon />
                    {/* {details?.role ? details?.role : "N/A"} */}
                    {details.role
                      ? details.role == "Account Manager"
                        ? "Admin User"
                        : details.role
                      : "N/A"}
                  </p>
                  <p className="flex gap-4 items-center">
                    {/* <FuseSvgIcon size={20}>heroicons-outline:phone</FuseSvgIcon> */}
                    <ProfileEmailIcon />
                    {MainuserDetail?.role_id == 4 &&
                    Accesslist?.client_hide_info == 1 &&
                    userDetails.role_id == 2 ? (
                      <span className="mt-8">*****</span>
                    ) : details?.email ? (
                      details?.email
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p className="flex gap-4 items-center">
                    <ProfilePhoneIcon />
                    {MainuserDetail?.role_id == 4 &&
                    Accesslist?.client_hide_info == 1 &&
                    userDetails.role_id == 2 ? (
                      <span className="mt-8">*****</span>
                    ) : details?.phone_number ? (
                      details?.phone_number
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                color="secondary"
                className="h-[40px] text-[16px] whitespace-nowrap "
                aria-label="Edit Profile"
                size="large"
                onClick={() => setIsOpenAddModal(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        {!userDetails.social_id && (
          <Grid container spacing="26px" className="py-[2.4rem]">
            <Grid item lg={6} className="basis-full">
              <div className="shadow-md bg-white rounded-lg p-24 flex items-center justify-between gap-10">
                <div>
                  <Typography
                    component="h4"
                    className="text-2xl text-title font-600 mb-8"
                  >
                    Change Password
                  </Typography>
                  <p className="text-para_light">
                    Here you can change your password.
                  </p>
                </div>
                <Link
                  to={`/change-password${clientId ? `?ci=${clientId}` : ""}`}
                  className="contents"
                >
                  <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
                    <ArrowRightCircleIcon />
                  </div>
                </Link>
              </div>
            </Grid>
            <Grid item lg={6} className="basis-full">
              {/* <div className="shadow-md bg-white rounded-lg p-24 flex items-center justify-between gap-10">
              <div>
                <Typography
                  component="h4"
                  className="text-2xl text-title font-600 mb-8"
                >
                  Google Calendar Integration
                </Typography>
                <p className="text-para_light">
                  Effortlessly keep track of your projects, tasks, etc.
                </p>
              </div>
              <div className="shrink-0 w-[5rem] aspect-square flex items-center justify-center border rounded-lg border-borderColor">
                <ArrowRightCircleIcon />
              </div>
            </div> */}
              <div className="shadow-md bg-white rounded-lg p-24 flex items-center justify-between gap-10">
                <div>
                  <Typography
                    component="h4"
                    className="text-2xl text-title font-600 my-14"
                  >
                    Two-Factor Authentication
                  </Typography>
                </div>
                <Android12Switch
                  checked={isAuthenticated}
                  onChange={handleAuthSwitch}
                />
              </div>
            </Grid>
          </Grid>
        )}
      </div>
      {isOpenAddModal && (
        <EditMyProfile
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          clientDetail={details}
          fetchDetalis={fetchDetalis}
        />
      )}
      <TwoFactorAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={isAuthenticated}
        setIsAuthenticate={setIsAuthenticate}
        id={userDetails?.id}
      />
    </div>
  );
}
