import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Menu,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import {
  accManagerAgentList,
  accManagerClientList,
  changeFetchStatus,
  getAccManagerInfo,
  resetFormManagrData,
} from "app/store/AccountManager";
import { AccManagerRootState } from "app/store/AccountManager/Interface";
import { twoFactorAuthentication } from "app/store/Auth";
import {
  addAccAssignAgents,
  addAssignAccManager,
  addAssignClient,
  getClientAssignList,
  getClientList,
  resetPassword,
  UpdateStatus,
} from "app/store/Client";
import { RootState, useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  DownGreenIcon,
  EditIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import TitleBar from "../TitleBar";
import CommonTable from "../commonTable";
import ChangePassword from "../profile/ChangePassword";
import TwoFactorAuth from "../profile/TwoFactorAuth";
import AddAccountManagerModel from "./AddAccountmanagerModal";
import ClientStatus from "../client/Subscription/ClientStatus";
import DropdownMenu from "../Dropdown";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownArrowIconWhite } from "public/assets/icons/dashboardIcons";
import InputField from "../InputField";
import { debounce } from "lodash";
import { ClientRootState } from "app/store/Client/Interface";
import { getUserDetail } from "src/utils";
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

const ManagerProfile = () => {
  const { accountManager_id } = useParams();
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(false);
  const { accManagerDetail, accAgentList, fetchStatus, clientlist } =
    useSelector((store: AccManagerRootState) => store?.accManagerSlice);
  const scrollRef = useRef(null);
  const scrollRefClient = useRef(null);
  const { list, status } = useSelector(
    (store: ClientRootState) => store.client
  );
  const { role_id, role } = useSelector((store: any) => store?.user);
  const [agentlist, setAgentList] = useState(accAgentList);
  const [anchorEl, setAnchorEl] = useState(null); // State to manage anchor element for menu
  const [selectedItem, setSelectedItem] = useState("Active");
  const [checkedItems, setCheckedItems] = useState([]);
  const [anchorEl3, setAnchorEl3] = useState<HTMLElement | null>(null);
  const [anchorEl1, setAnchorEl1] = useState<HTMLElement | null>(null);
  const [anchorEl4, setAnchorEl4] = useState<HTMLElement | null>(null);
  const [anchorEl5, setAnchorEl5] = useState<HTMLElement | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to manage confirmation dialog visibility
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [disable, setIsDisable] = useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [assignAgent, setAssignAgent] = useState([]);
  const [assignClient, setAssignClient] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [clientPage, setClientPage] = useState(0);
  const [limit] = useState(20);
  const isInitialMount = useRef(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingClient, setIsFetchingClient] = useState(false);
  const [filterMenu, setFilterMenu] = useState<any>({
    start: 0,
    limit: -1,
    search: "",
  });
  // Open menu handler
  let userDetail = getUserDetail();
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to the clicked button
  };

  // Close menu handler
  const handleClose = () => {
    setAnchorEl(null); // Reset anchor element to hide the menu
  };
  const [filteredAccMaangerList, setFilteredAccMaangerList] =
    useState(clientlist);

  const handleScrollAgent = debounce(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      const hasMoreData = assignAgent.length >= limit; // Check if there are more items to fetch
      const totalRecordsFetched = assignAgent.length;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // Near bottom
        if (!isFetching && hasMoreData && assignAgent?.length % limit === 0) {
          setIsFetching(true);
          getAssignAgentList(page + 1).finally(() => {
            setPage((page) => page + 1);
            setIsFetching(false);
          });
        }
      }
    }
  }, 300);

  useEffect(() => {
    setAgentList(accAgentList);
  }, [accAgentList]);

  const handleScrollClient = debounce(() => {
    if (scrollRefClient.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRefClient.current;

      const hasMoreData = assignClient?.length >= limit; // Check if there are more items to fetch
      const totalRecordsFetched = assignClient.length;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // Near bottom
        if (!isFetching && hasMoreData && assignClient.length % limit === 0) {
          setIsFetchingClient(true);
          getAssignClientList(clientPage + 1).finally(() => {
            setClientPage((clientPage) => clientPage + 1);
            setIsFetchingClient(false);
          });
        }
      }
    }
  }, 300);

  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScrollAgent);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScrollAgent);
      }
    };
  }, [handleScrollAgent]);
  useEffect(() => {
    const scrolledElement = scrollRefClient.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScrollClient);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScrollClient);
      }
    };
  }, [handleScrollClient]);

  useEffect(() => {
    getAssignAgentList(page);
  }, []);

  useEffect(() => {
    getAssignClientList(clientPage);
  }, []);

  useEffect(() => {
    setFilteredAccMaangerList(clientlist);
  }, [clientlist]);

  const handleMenuItemClick = async (status) => {
    setPendingStatus(status);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  // Confirm status update handler
  const handleConfirm = async (confirmed) => {
    if (confirmed && pendingStatus) {
      setIsDisable(true);

      const res = await dispatch(
        UpdateStatus({
          user_id: accountManager_id,
          status: pendingStatus === "Inactive" ? 2 : 1,
        })
      );
      setSelectedItem(pendingStatus);
      setIsDisable(false);
      toast.success(res?.payload?.data?.message);
    }
    setIsConfirmOpen(false);
    setPendingStatus(null);
    handleClose(); // Close the menu after handling the click
  };

  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const userDetails = getUserDetail();
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [isOpenChangePassModal, setIsOpenChangePassModal] =
    useState<boolean>(false);
  // const [isEditing, setIsEditing] = useState<boolean>(true);
  const theme: Theme = useTheme();

  useEffect(() => {
    if (!accountManager_id) return null;
    dispatch(
      getAccManagerInfo({ account_manager_id: accountManager_id, loader: true })
    );

    return () => {
      dispatch(changeFetchStatus());
      dispatch(resetFormManagrData());
    };
  }, []);

  const getAssignAgentList = async (page = 0) => {
    try {
      const response = await dispatch(
        accManagerAgentList({
          accountManger_id: accountManager_id,
          type: 0,
          search: "",
          limit,
          start: page,
        })
      );

      // Check if the action was fulfilled
      if (accManagerAgentList.fulfilled.match(response)) {
        const fillterAgent = response.payload.data.data.list || [];
        setAssignAgent((prev) => {
          const newAgents = page
            ? [...prev, ...fillterAgent]
            : [...fillterAgent];
          return newAgents.filter(
            (agent, index, self) =>
              index === self.findIndex((a) => a.id === agent.id)
          );
        });

      } else if (accManagerAgentList.rejected.match(response)) {
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
    }
  };
  const getAssignClientList = async (page = 0) => {
    try {
      const response = await dispatch(
        accManagerClientList({
          accountManger_id: accountManager_id,
          type: 0,
          search: "",
          limit,
          start: clientPage,
        })
      );

      // Check if the action was fulfilled
      if (accManagerClientList.fulfilled.match(response)) {
        const fillterClient = response.payload.data.data.list || [];

        // setAssignClient(fillterAgent); // Update state with response
        setAssignClient((prev) => {
          const newAgents = page
            ? [...prev, ...fillterClient]
            : [...fillterClient];
          return newAgents.filter(
            (agent, index, self) =>
              index === self.findIndex((a) => a.id === agent.id)
          );
        });
      } else if (accManagerClientList.rejected.match(response)) {
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
    }
  };

  useEffect(() => {
    setSelectedItem(accManagerDetail?.status);
    setChecked(!!accManagerDetail?.two_factor_authentication);
  }, [accManagerDetail]);

  const navigate = useNavigate();
  useEffect(() => {
    if (accountManager_id == userDetails.id && userDetail?.role_id == 4) {
      navigate(`/401`);
    }
  }, []);

  useEffect(() => {
    setAssignClient(list);
  }, [list]);

  const debouncedSearch = useCallback(
    debounce((searchValue, type) => {
      if (type === "agent") {
        dispatch(
          accManagerAgentList({
            accountManger_id: accountManager_id,
            type: 1,
            search: searchValue,
            start: 0,
            limit: 20,
          })
        );
      } else {
        dispatch(
          accManagerClientList({
            accountManger_id: accountManager_id,
            type: 1,
            search: searchValue,
            start: 0,
            limit: 20,
          })
        );
      }
      setInitialRender(true);
    }, 800),
    [accountManager_id, dispatch]
  );

  if (fetchStatus === "loading") {
    return <ListLoading />;
  }

  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  // const handleResetPassword = async () => {
  //   await dispatch(resetPassword({ client_id: client_id }));
  // };
  const handleResetPassword = async () => {
    await dispatch(resetPassword({ client_id: accountManager_id }));
  };

  const handleTwoFactor = async (check: boolean) => {
    const newStatus = check ? 1 : 0;
    await dispatch(
      twoFactorAuthentication({ user_id: accountManager_id, status: newStatus })
    );
  };

  const handleChange = (event) => {
    setIsOpenAuthModal(true);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLElement>,
    type?: string
  ) => {
    event.stopPropagation();
    if (type == "agent") {
      setAnchorEl4(event.currentTarget);
      setAnchorEl5(event.currentTarget);
    } else {
      setAnchorEl3(event.currentTarget);
      setAnchorEl1(event.currentTarget);
    }
  };

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

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(id)) {
        return prevCheckedItems.filter((item) => item !== id);
      } else {
        return [...prevCheckedItems, id];
      }
    });
  };
  const handleCloseDrop = () => {
    setAnchorEl3(null);
    setAnchorEl1(null);
    setAnchorEl4(null);
    setAnchorEl5(null);
    setCheckedItems([]);
    // debouncedSearch("", "");
    setInitialRender(false);
    setSearch("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    if (value == "") {
      setInitialRender(false);
    }
    debouncedSearch(value, "");
  };

  const handleSearchChangeAgent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSearch(value);
    if (value == "") {
      setInitialRender(false);
    }
    debouncedSearch(value, "agent");
  };

  const handleAddnewAccManager = async (type?: string) => {
    if (type == "agents") {
      dispatch(
        addAccAssignAgents({
          account_manager_id: accountManager_id,
          agent_ids: checkedItems,
        })
      );
      setTimeout(() => {
        getAssignAgentList();
      }, 1000);
    } else {
      dispatch(
        addAssignClient({
          account_manager_id: accountManager_id,
          client_ids: checkedItems,
        })
      );
      setTimeout(() => {
        getAssignClientList();
      }, 1000);
    }

    handleCloseDrop();
    setIsOpenEditModal(false);

    // dispatch(getAccManagerInfo({ account_manager_id: accountManager_id, loader: false }));

    // Filter out the selected items

    setCheckedItems([]); // Clear the checked items
    setInitialRender(false);
    setSearch("");
  };

  return (
    <>
      <div className="px-16">
        <TitleBar title=" Admin User’s Profile"> </TitleBar>
      </div>
      <div className="px-40 xs:px-10">
        {/* <Grid container spacing={3} className="sm:px-10 xs:px-10 bg-red-200"> */}
        <Grid item xs={12} sm={12} md={9} className="">
          {/* <div className="flex flex-col gap-10 p-20 bg-[#FFFFFF] h-auto md:h-[calc(100vh-164px)] sm:h-auto  rounded-12 xs:px-20 "> */}
          <div className="flex flex-col gap-10 p-20 bg-[#FFFFFF] h-auto sm:h-auto  rounded-12 xs:px-20 ">
            <div className="border border-[#E7E8E9] rounded-lg flex justify-between gap-[10px] items-start p-[3rem] flex-col sm:flex-row">
              <div className="flex gap-40 flex-col sm:flex-row xs:justify-around ">
                <div className="flex items-center sm:items-start xs:gap-20 sm:justify-between ">
                  <div className="h-[100px] w-[100px] sm:h-[100px] sm:w-[99px] rounded-full overflow-hidden ">
                    <img
                      src={
                        accManagerDetail?.user_image
                          ? urlForImage + accManagerDetail.user_image
                          : "../assets/images/logo/images.jpeg"
                      }
                    ></img>
                    {/* // <img src="../assets/images/pages/agent/luis_.jpg" /> */}
                  </div>
                  <div className="block sm:hidden">
                    {(userDetail?.role_id === 1 ||
                      (userDetail?.role_id === 4 &&
                        Accesslist.admin_edit == 1)) && (
                        <Button
                          className="cursor-pointer flex rounded-full py-[1rem] px-[2rem] text-secondary
                bg-secondary_bg w-max gap-[10px] text-lg font-600 items-center "
                          onClick={() => setIsOpenAddModal(true)}
                        >
                          <span>Edit</span>
                          <EditIcon fill="#4F46E5" />
                        </Button>
                      )}
                  </div>
                </div>
                <div className="pt-[20px] pr-10">
                  <div className="flex items-center sm:gap-[7rem] gap-[1rem] mb-10">
                    <span className="text-[24px] text-[#111827] font-semibold inline-block">
                      {accManagerDetail?.first_name +
                        " " +
                        accManagerDetail?.last_name}
                      {/* Bernadette Jone */}
                    </span>

                    <ClientStatus
                      rowstatus={accManagerDetail?.status}
                      id={accManagerDetail?.id}
                      title={"admin user"}
                    />
                  </div>
                  <div className="flex text-[2rem] text-para_light flex-col sm:flex-row gap-[20px]">
                    <div className="flex">
                      <img src="../assets/icons/group.svg" className="mr-4" />

                      <span>{accManagerDetail?.id || "N/A"}</span>
                    </div>
                    <div className="flex sm:px-20">
                      <span className="flex">
                        <img
                          src="../assets/icons/ri_time-line.svg"
                          className="sm:mr-4"
                        />{" "}
                        <span>
                          {accManagerDetail?.created_at
                            ? moment(accManagerDetail.created_at).format(
                              "MMMM Do, YYYY"
                            )
                            : "N/A"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-start w-full py-20 gap-28 flex-col sm:flex-row overflow-hidden">
                    <div className="flex pr-10 gap-32 sm:flex-row flex-col">
                      <div className="grid gap-5">
                        <span className="text-[#111827] text-[18px] font-500 w-max">
                          Email Address
                        </span>
                        <div className="grid grid-cols-[auto,1fr] items-center break-words break-normal">
                          <img
                            src="../assets/icons/ic_outline-email.svg"
                            className="mr-4"
                          />
                          {/* <Tooltip
                            title={accManagerDetail?.email || "N/A"}
                            disableTouchListener={false}
                          > */}
                          {MainuserDetail?.role_id === 1 ||
                            (MainuserDetail?.role_id === 4 &&
                              Accesslist.admin_hide_info == 0) ? (
                            <p
                              className="text-para_light text-[20px] max-w-xs "
                              style={{ wordBreak: "break-word" }}
                            >
                              {accManagerDetail?.email || "N/A"}
                            </p>
                          ) : (
                            <span className="mt-8">*****</span>
                          )}
                          {/* </Tooltip> */}
                        </div>
                      </div>
                      {/* <div className="flex pr-10 gap-32 "> */}
                      <div className="flex flex-col gap-5">
                        <span className="text-[#111827] text-[18px] font-500">
                          Phone Number
                        </span>
                        <div className="flex items-center ">
                          <span>
                            <img
                              src="../assets/icons/ph_phone.svg"
                              className="mr-4"
                            />{" "}
                          </span>
                          {MainuserDetail?.role_id === 1 ||
                            (MainuserDetail?.role_id === 4 &&
                              Accesslist.admin_hide_info == 0) ? (
                            <span className="text-para_light text-[20px] ">
                              {/* {clientDetail?.country_code}{" "}*/}
                              {accManagerDetail?.phone_number || "N/A"}
                            </span>
                          ) : (
                            <span
                              className={`${accManagerDetail?.phone_number ? "mt-8" : "mt-0"} text-para_light text-[20px]`}
                            >
                              {accManagerDetail?.phone_number ? "*****" : "N/A"}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between w-full pt-0 pb-20 gap-31 ">
                    <div className="grid pr-10 gap-7">
                      <span className="text-[1.8rem] text-title font-500 w-max">
                        Address
                      </span>
                      <div className="grid grid-cols-[auto,1fr] items-center text-[#757982] text-[20px] font-400 mb-5">
                        <img
                          src="../assets/icons/loaction.svg"
                          className="mr-4"
                        />
                        {/* <Tooltip title={accManagerDetail?.address}> */}
                        <p style={{ wordBreak: "break-word" }}>
                          {/* {accManagerDetail?.address || "N/A"} */}
                          {renderAddress(accManagerDetail)}
                        </p>
                        {/* </Tooltip> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                {(MainuserDetail?.role_id === 1 ||
                  (MainuserDetail?.role_id === 4 &&
                    Accesslist.admin_edit == 1)) && (
                    <Button
                      className="cursor-pointer flex rounded-full py-[1rem] px-[2rem] text-secondary
                bg-secondary_bg w-max gap-[10px] text-lg font-600 items-center "
                      onClick={() => setIsOpenAddModal(true)}
                    >
                      <span>Edit</span>
                      <EditIcon fill="#4F46E5" />
                    </Button>
                  )}
              </div>
            </div>
            {!accManagerDetail?.social_id && (
              <Grid
                item
                lg={12}
                className="basis-full mt-[30px] flex  gap-28 flex-col sm:flex-row w-full"
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
                      className="shrink-0 w-[5rem] aspect-square flex justify-center cursor-pointer rounded-lg border-borderColor"
                      onClick={() => {
                        setIsOpenChangePassModal(true);
                      }}
                    >
                      <ArrowRightCircleIcon />
                    </div>
                  </div>
                </div>
                <div className="flex-1 ">
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
                          It will send a link to the admin user to reset their
                          password.
                        </p>
                      </div>
                    </div>
                    <div
                      className="shrink-0 w-[5rem] aspect-square flex   justify-center cursor-pointer rounded-lg border-borderColor"

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
          </div>
          <Grid
            item
            lg={12}
            className="basis-full mt-[30px] flex  gap-28 flex-col sm:flex-row w-full rounded-[8px]"
          >
            <div className="w-full bg-[#FFFFFF] rounded-[8px] px-20 py-20 flex items-center justify-between">
              <div className="w-[70%] ">
                <Typography className="text-[#111827] font-600 text-[20px]">
                  Two-Factor Authentication
                </Typography>
                <p className="text-[#757982] text-[14px] break-words ">
                  <a
                    href="#"
                    style={{ textDecoration: "none", cursor: "default" }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {userDetail?.role_id === 1 ||
                      (userDetail?.role_id === 4 &&
                        Accesslist.admin_hide_info == 0)
                      ? accManagerDetail?.email || "N/A"
                      : "*****"}
                  </a>{" "}
                  is linked for Two-Factor Authentication.
                </p>
              </div>
              <div className="w-30%">
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {" "}
                  {/* <FormControlLabel
                    control={<Android12Switch checked={checked} />}
                    label=""
                    checked={checked}
                    onChange={(e) => handleChange(e)}
                  />{" "} */}
                  <Android12Switch
                    checked={checked}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </Grid>
          {(userDetail?.role_id == 1 ||
            (userDetail?.role_id == 4 &&
              Accesslist?.is_client_access == 1)) && (
              <Grid
                item
                lg={12}
                className="basis-full mt-[30px]   gap-28 flex-col sm:flex-row w-full  bg-[#ffffff] rounded-[8px]"
              >
                <div className="flex justify-between align-middle my-5 pl-20 pr-10">
                  <Typography className="text-[#0A0F18] font-600 text-[20px]  py-10">
                    Assigned Clients
                  </Typography>
                  <DropdownMenu
                    marginTop={"mt-20"}
                    button={
                      <div
                        className="relative flex items-center"
                        onClick={handleButtonClick}
                      >
                        <Button
                          variant="outlined"
                          className="h-[40px] sm:text-[16px] mt-2 flex gap-8 whitespace-nowrap  text-white leading-none bg-secondary hover:bg-secondary"
                          aria-label="Manage Sections"
                          size="large"
                          endIcon={
                            <>
                              {anchorEl3 ? (
                                <UpArrowBlank fill="white" />
                              ) : (
                                <DownArrowIconWhite className="cursor-pointer" />
                              )}
                            </>
                          }
                        >
                          Assign New Client
                        </Button>
                      </div>
                    }
                    anchorEl={anchorEl1}
                    handleClose={handleCloseDrop}
                  >
                    <div className="w-[375px] p-20">
                      <p className="text-title font-600 text-[1.6rem]">
                        Client Name
                      </p>

                      <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
                        <InputField
                          name={"agent"}
                          placeholder={"Enter Client Name"}
                          className="common-inputField "
                          inputProps={{
                            className: "ps-[2rem] w-full sm:w-full",
                          }}
                          onChange={handleSearchChange}
                        />
                        <div className=" max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                          {status == "loading" ? (
                            <ListLoading />
                          ) : (
                            <>
                              {initialRender && search != "" && (
                                <>
                                  {filteredAccMaangerList.map((item: any) => (
                                    <div
                                      className="flex items-center gap-10 px-20 w-full hover:bg-[#f6f6f6]"
                                      key={item.id}
                                    >
                                      <label className="flex items-center gap-10 w-full cursor-pointer">
                                        <Checkbox
                                          checked={checkedItems.includes(item.id)}
                                          onChange={() =>
                                            handleCheckboxChange(item.id)
                                          }
                                          className="hover:!bg-transparent"
                                        />
                                        <span>
                                          {item.first_name + " " + item.last_name}
                                        </span>
                                      </label>
                                    </div>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex pt-10">
                        <Button
                          variant="contained"
                          color="secondary"
                          className="w-[156px] h-[48px] text-[16px] font-400"
                          onClick={() => handleAddnewAccManager("")}
                          disabled={checkedItems.length === 0}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          className="w-[156px] h-[48px] text-[16px] font-400 ml-14"
                          onClick={handleCloseDrop}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DropdownMenu>
                </div>
                <div
                  ref={scrollRefClient}
                  onScroll={() => handleScrollClient}
                  className="max-h-[310px] overflow-y-auto w-full"
                >
                  <CommonTable
                    headings={[
                      "ID",
                      "Name",
                      "Company Name",
                      "Subscription Status",
                      "Account Status",
                      "",
                    ]}
                  >
                    {assignClient?.length === 0 && (
                      <TableRow
                        sx={{
                          "& td": {
                            borderBottom: "1px solid #EDF2F6",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <TableCell colSpan={7} align="center">
                          <div
                            className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                            style={{ alignItems: "center" }}
                          >
                            <NoDataFound />
                            <Typography className="text-[24px] text-center font-600 leading-normal">
                              No data found!
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {assignClient?.map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "& td": {
                              borderBottom: "1px solid #EDF2F6",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          <TableCell scope="row" className="font-500 pl-[20px]">
                            #{row.id}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            {row?.first_name + " " + row?.last_name}
                          </TableCell>

                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            {row?.company_name}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            <span
                              className={`inline-flex items-center justify-center rounded-full w-[90px] min-h-[25px] text-[1.4rem] font-500
                        ${row.subscription_status == "Active"
                                  ? "text-[#4CAF50] bg-[#DFF1E0]" // Red for Active
                                  : row.subscription_status == "Pending"
                                    ? "text-[#FFC107] bg-[#FFEEBB]" // Yellow for Pending
                                    : row.subscription_status == "Suspended"
                                      ? "text-[#FF0000] bg-[#FFD1D1]" // Green for Suspended
                                      : row.subscription_status == "Cancelled"
                                        ? "text-[#FF5C00] bg-[#FFE2D5]" // Brown for Cancelled
                                        : row.subscription_status == "Paused"
                                          ? "text-[#4c87af] bg-[#4ca8af2e]"
                                          : ""
                                }`}
                            >
                              {row.subscription_status || "N/A"}
                            </span>
                          </TableCell>

                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            <span
                              className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-[1.4rem] font-500
                        ${row.status == "Active"
                                  ? "text-[#4CAF50] bg-[#4CAF502E]"
                                  : row.status == "Completed"
                                    ? "Expired"
                                    : "Pending"
                                }`}
                            >
                              {row.status || "Pending"}
                            </span>
                          </TableCell>
                          <TableCell align="left" className="w-[1%] font-500">
                            <div className="flex gap-20 pe-20">
                              <span className="p-2 cursor-pointer">
                                <Link to={`/admin/client/detail/${row.id}`}>
                                  <ArrowRightCircleIcon />
                                </Link>
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </CommonTable>
                </div>
              </Grid>
            )}
          {(userDetail?.role_id == 1 ||
            (userDetail?.role_id == 4 && Accesslist?.is_agent_access == 1)) && (
              <Grid
                item
                lg={12}
                className="basis-full mt-[30px]   gap-28 flex-col sm:flex-row w-full  bg-[#ffffff] rounded-[8px]"
              >
                <div className="flex justify-between align-middle my-5 pl-20 pr-10">
                  <Typography className="text-[#0A0F18] font-600 text-[20px]  py-10">
                    Assigned Agents
                  </Typography>
                  <DropdownMenu
                    marginTop={"mt-20"}
                    button={
                      <div
                        className="relative flex items-center"
                        onClick={(e) => handleButtonClick(e, "agent")}
                      >
                        <Button
                          variant="outlined"
                          className="h-[40px] sm:text-[16px] mt-2 flex gap-8 whitespace-nowrap  text-white leading-none bg-secondary hover:bg-secondary"
                          aria-label="Manage Sections"
                          size="large"
                          endIcon={
                            <>
                              {anchorEl4 ? (
                                <UpArrowBlank fill="white" />
                              ) : (
                                <DownArrowIconWhite className="cursor-pointer" />
                              )}
                            </>
                          }
                        >
                          Assign New Agent
                        </Button>
                      </div>
                    }
                    anchorEl={anchorEl4}
                    handleClose={handleCloseDrop}
                  >
                    <div className="w-[375px] p-20">
                      <p className="text-title font-600 text-[1.6rem]">
                        Agent Name
                      </p>

                      <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
                        <InputField
                          name={"agent"}
                          placeholder={"Enter Agent Name"}
                          className="common-inputField "
                          inputProps={{
                            className: "ps-[2rem] w-full sm:w-full",
                          }}
                          onChange={handleSearchChangeAgent}
                        />
                        <div className=" max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                          {status == "loading" ? (
                            <ListLoading />
                          ) : (
                            <>
                              {initialRender && search != "" && (
                                <>
                                  {agentlist?.map((item: any) => (
                                    <div
                                      className="flex items-center gap-10 px-20 w-full hover:bg-[#f6f6f6]"
                                      key={item.id}
                                    >
                                      <label className="flex items-center gap-10 w-full cursor-pointer">
                                        <Checkbox
                                          checked={checkedItems.includes(item.id)}
                                          onChange={() =>
                                            handleCheckboxChange(item.id)
                                          }
                                          className="hover:!bg-transparent"
                                        />
                                        <span>{item.userName}</span>
                                      </label>
                                    </div>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex pt-10">
                        <Button
                          variant="contained"
                          color="secondary"
                          className="w-[156px] h-[48px] text-[16px] font-400"
                          onClick={() => handleAddnewAccManager("agents")}
                          disabled={checkedItems.length === 0}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          className="w-[156px] h-[48px] text-[16px] font-400 ml-14"
                          onClick={handleCloseDrop}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DropdownMenu>
                </div>
                <div
                  onScroll={() => handleScrollAgent}
                  ref={scrollRef}
                  className="max-h-[310px] overflow-y-auto w-full"
                >
                  <CommonTable headings={["ID", "Name", "Account Status", ""]}>
                    {assignAgent?.length === 0 && (
                      <TableRow
                        sx={{
                          "& td": {
                            borderBottom: "1px solid #EDF2F6",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <TableCell colSpan={7} align="center">
                          <div
                            className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                            style={{ alignItems: "center" }}
                          >
                            <NoDataFound />
                            <Typography className="text-[24px] text-center font-600 leading-normal">
                              No data found!
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {assignAgent?.map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "& td": {
                              borderBottom: "1px solid #EDF2F6",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          <TableCell scope="row" className="font-500 pl-[20px]">
                            #{row.id}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            {row?.userName}
                          </TableCell>

                          {/* <TableCell
                        align="center"
                        className="whitespace-nowrap font-500"
                      >
                        {row.company_name}
                      </TableCell> */}
                          {/* <TableCell
                        align="center"
                        className="whitespace-nowrap font-500"
                      >
                        <span
                          className={`inline-flex items-center justify-center rounded-full w-[90px] min-h-[25px] text-[1.4rem] font-500
                        ${
                          row.subcription_status == "Active"
                            ? "text-[#4CAF50] bg-[#DFF1E0]" // Red for Active
                            : row.subcription_status == "Pending"
                              ? "text-[#FFC107] bg-[#FFEEBB]" // Yellow for Pending
                              : row.subcription_status == "Suspended"
                                ? "text-[#FF0000] bg-[#FFD1D1]" // Green for Suspended
                                : row.subcription_status == "Cancelled"
                                  ? "text-[#FF5C00] bg-[#FFE2D5]" // Brown for Cancelled
                                  : row.subcription_status == "Paused"
                                    ? "text-[#4c87af] bg-[#4ca8af2e]"
                                    : ""
                        }`}
                        >
                          {row.subcription_status || "N/A"}
                        </span>
                      </TableCell> */}

                          <TableCell
                            align="center"
                            className="whitespace-nowrap font-500"
                          >
                            <span
                              className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-[1.4rem] font-500
                        ${row.status == "Active"
                                  ? "text-[#4CAF50] bg-[#4CAF502E]"
                                  : row.status == "Completed"
                                    ? "Expired"
                                    : "Pending"
                                }`}
                            >
                              {row.status || "Pending"}
                            </span>
                          </TableCell>
                          <TableCell align="left" className="w-[1%] font-500">
                            <div className="flex gap-20 pe-20">
                              <span className="p-2 cursor-pointer">
                                <Link to={`/admin/agents/agent-detail/${row.id}`}>
                                  <ArrowRightCircleIcon />
                                </Link>
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </CommonTable>
                </div>
              </Grid>
            )}
        </Grid>
      </div>

      <div className="px-28 mb-[3rem]">
        {isOpenAddModal && (
          <AddAccountManagerModel
            isOpen={isOpenAddModal}
            setIsOpen={setIsOpenAddModal}
            isEditing={true}
          />
        )}
        <ChangePassword
          user_id={accountManager_id}
          role={role}
          isOpen={isOpenChangePassModal}
          setIsOpen={setIsOpenChangePassModal}
        />
        <TwoFactorAuth
          isOpen={isOpenAuthModal}
          setIsOpen={setIsOpenAuthModal}
          isAuthenticated={checked}
          setIsAuthenticate={setChecked}
          id={accountManager_id}
        />
      </div>
    </>
  );
};

export default ManagerProfile;
