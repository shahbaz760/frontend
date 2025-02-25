import FuseLoading from "@fuse/core/FuseLoading";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  DocSignVarification,
  RefreshToken,
  logInAsClient,
} from "app/store/Auth";
import { AuthRootState } from "app/store/Auth/Interface";
import { useAppDispatch } from "app/store/store";
import { setInitialState } from "app/theme-layouts/shared-components/navigation/store/navigationSlice";
import jwtDecode from "jwt-decode";
import { NoSubscription } from "public/assets/icons/common";
import {
  CircleLeft1Icon,
  CircleLeft2Icon,
  CircleRightIcon,
} from "public/assets/icons/welcome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { getClientId, getToken, getUserDetail } from "src/utils";

type FormType = {
  email: string;
};

export default function VerificationPage() {
  //@ts-ignore
  const [selectedId, setselectedId] = useState("");
  const dispatch = useAppDispatch();
  const { userData, UserResponse } = useSelector(
    (store: AuthRootState) => store.auth
  );
  const userDetails = getUserDetail();
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { jwtService } = useAuth();
  // const { token } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = getToken();
  const tokenData: any = token ? jwtDecode(token) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      await jwtService.autoSignIng();
    };

    // setList(userData);
    if (userData && UserResponse) {
      if (
        UserResponse.user?.subscription_and_docusign.length == 0 &&
        UserResponse?.user?.is_signed == 1
      ) {
        redirect();
      }
    }
  }, [userData]);

  const handleButtonClick = async (item) => {
    setIsLoading(true);
    const previous = JSON.parse(localStorage.getItem("userDetail"));
    const urlParams = new URLSearchParams(window.location.search);
    try {
      const payload = {
        link_click: {
          client_id: userDetails?.id,
          subscription_id: item.id,
          login_as_client:
            previous?.role_id == 4 ? 2 : urlParams.has("ci") ? 1 : 0,
        },
      };
      //@ts-ignore
      const res = await dispatch(DocSignVarification(payload));
      window.location.href = res?.payload?.data?.data?.url;
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setselectedId(item.id);
    setTimeout(() => {
      setIsLoading(false);
    }, 12000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          token,
        };
        //@ts-ignore
        const res = await dispatch(RefreshToken(payload));
        dispatch(setInitialState(res?.payload?.data?.data?.user));
        // toast.success(res?.payload?.data?.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    return () => {
      // Remove the item from the list
      const updatedList = list.filter((listItem) => listItem.id !== selectedId);
      setList(updatedList);
    };
  }, []);

  useEffect(() => {
    setList(userData);
  }, [userData]);

  const backToAccount = () => {
    const token = getToken();
    const tokenData: any = jwtDecode(token);
    const adminId = tokenData?.admin_id;
    const clientId = tokenData?.user?.id;
    const PrevuserDetails = JSON.parse(localStorage.getItem("userDetail"));
    dispatch(logInAsClient(adminId)).then((res) => {
      localStorage.removeItem(clientId + "jwt_access_token");
      localStorage.removeItem(clientId + "userDetail");
      jwtService.handleSignInSuccess(
        res?.payload?.data?.user,
        res?.payload?.data?.access_token
      );
    });
    setTimeout(() => {
      if (PrevuserDetails?.role_id == 1) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/accountManager/dashboard";
      }
    }, 1000);
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   if (!tokenData) {
  //     navigate('/sign-in')
  //   }
  // }, [tokenData])

  const clientId = getClientId();

  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  return (
    <>
      {loading && <FuseLoading />}
      {!loading && (
        <div className="flex justify-center items-center flex-col py-20 gap-60 px-28 ">
          <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
          <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
          <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />

          <img src="assets/icons/remote-icon.svg" alt="" />
          {/* {tokenData?.role_id == 2 && tokenData?.is_admin && (
            <Button
              variant="outlined"
              color="secondary"
              className="h-[40px] text-[16px] flex gap-8 font-[600]"
              aria-label="Add Tasks"
              size="large"
              onClick={backToAccount}
            >
              Back To Account
              <LoginIcon color='#4f46e5' />
            </Button>
          )} */}

          <div className="bg-[#fff] sm:min-w-[60%] h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
            {UserResponse?.user?.subcription_status == "Cancelled" &&
              list.length == 0 ? (
              <>
                <div className="flex flex-col justify-center gap-10">
                  <div>
                    <NoSubscription />
                  </div>
                  <div>
                    <Typography className="block text-[28px] font-bold text-center text-[#111827] mb-5">
                      Subscription Cancelled manually !
                    </Typography>
                    <Typography className="text-[18px] font-400 text-[#757982] text-center leading-4 ">
                      It appears there is no active subscription.
                    </Typography>
                  </div>
                </div>
              </>
            ) : null}
            {(UserResponse?.user?.subcription_status == "Pending" ||
              UserResponse?.user?.subcription_status == "Active") &&
              list.length > 0 ? (
              <div
                className="flex flex-col justify-center gap-40"
                style={{ alignItems: "center" }}
              >
                <Typography className="text-[48px] text-center font-700 leading-normal">
                  Sign Document
                  <p className="text-[18px] font-400 text-[#757982] leading-4 pt-20">
                    To continue, please click the button below to sign the
                    document.
                  </p>
                </Typography>
                <div
                  className="flex justify-center align-items-center flex-col border-1 border-[#EDEDFC] p-20 rounded-12 w-full "
                  style={{ alignItems: "center" }}
                >
                  {list?.map((item, index) => (
                    <>
                      <Typography className="block text-[16px] font-medium text-center text-[#111827] ">
                        {item.title}
                      </Typography>
                      {/* <Button
                        variant="contained"
                        onClick={() => handleButtonClick(item)}
                        color="secondary"
                        className="mt-5 px-5 h-[50px] py-3 text-[18px] font-bold leading-normal"
                        aria-label="Log In"
                        size="large" */}
                      <Button
                        variant="contained"
                        color="secondary"
                        className="sm:w-[303px] mt-2  mb-20 w-full h-[50px] text-[18px] font-bold "
                        aria-label="Log In"
                        size="large"
                        type="submit"
                        onClick={() => handleButtonClick(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
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
                          "Sign Document"
                        )}
                      </Button>
                    </>
                  ))}
                </div>
              </div>
            ) : null}
            {(UserResponse?.user?.subcription_status == "Pending" ||
              UserResponse?.user?.subcription_status == "Active") &&
              list.length == 0 ? (
              <>
                <div className="flex flex-col justify-center gap-10">
                  <div>
                    <NoSubscription />
                  </div>
                  <div className="flex justify-center flex-col">
                    <Typography className="block text-[28px] font-bold text-center text-[#111827] mb-5">
                      {UserResponse?.user?.subscription_link != null
                        ? "Subscription is pending"
                        : " No subscription"}
                    </Typography>
                    <Typography className="text-[18px] font-400 text-[#757982] text-center leading-4 ">
                      {UserResponse?.user?.subscription_link != null
                        ? "Here is the payment link"
                        : "No active subscription please submit a ticket."}
                    </Typography>
                    {UserResponse?.user?.subscription_link != null && (
                      // <Link
                      //   to={UserResponse?.user?.subscription_link}
                      //   target="_blank"
                      //   className="text-[18px] font-400 text-[#4750df] text-center leading-4 mt-[30px] bg-transparent hover:bg-transparent"
                      // >
                      //   Payment Link
                      // </Link>
                      <Link
                        to={UserResponse?.user?.subscription_link}
                        target="_blank"
                        style={{
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "#4750df",
                          textAlign: "center",
                          lineHeight: "1.5",
                          marginTop: "30px",
                          backgroundColor: "transparent",

                          display: "inline-block",
                          transition: "background-color 0.3s ease", // Optional: for smooth transition
                        }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                        } // Example hover effect
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                        }
                      >
                        Pay Here
                      </Link>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            {UserResponse?.user?.subcription_status == "Paused" &&
              list.length == 0 ? (
              <>
                <div
                  className="flex flex-col justify-center gap-10"
                  style={{ alignItems: "center" }}
                >
                  <div>
                    <NoSubscription />
                  </div>
                  <div>
                    <Typography className="block text-[28px] font-bold text-center text-[#111827] mb-5">
                      Your Subscription has been paused!
                    </Typography>
                    <Typography className="text-[18px] font-400 text-[#757982] text-center leading-4 ">
                      It appears there is no active subscription.
                    </Typography>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
