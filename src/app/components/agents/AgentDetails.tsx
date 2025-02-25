/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable camelcase */
import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Grid,
  Switch,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import {
  changeFetchStatus,
  deleteAttachment,
  getAgentInfo,
  getAssignedClientList,
  resetFormData,
  updateKycRequestStatus,
  uploadAttachment,
} from "app/store/Agent";
import { AgentRootState, filterAgentType } from "app/store/Agent/Interafce";
import { twoFactorAuthentication } from "app/store/Auth";
import { UpdateStatus, resetPassword } from "app/store/Client";
import { RootState, useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  EditIcon,
  NoDataFound,
} from "public/assets/icons/common";
import {
  AttachmentDeleteIcon,
  AttachmentIcon,
} from "public/assets/icons/supportIcons";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import TitleBar from "src/app/components/TitleBar";
import { getClientId, getUserDetail } from "src/utils";
import DeleteClient from "../client/DeleteClient";
import RecentData from "../client/clientAgent/RecentData";
import CommonTable from "../commonTable";
import ChangePassword from "../profile/ChangePassword";
import TwoFactorAuth from "../profile/TwoFactorAuth";
import AddAgentModel from "./AddAgentModel";
import ClientStatus from "../client/Subscription/ClientStatus";
import KYCConfirmationModal from "./KYCConfirmationModal";
import { number } from "yup";
import { debounce } from "lodash";
// import Switch from '@mui/joy/Switch';
// import Typography from '@mui/joy/Typography';

// let images = ["female-01.jpg", "female-02.jpg", "female-03.jpg"];

// const resetForm
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

export default function AgentDetails() {
  const theme: Theme = useTheme();
  const { agent_id } = useParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState(null); // switch button
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { agentDetail, fetchStatus } = useSelector(
    (store: AgentRootState) => store?.agent
  );
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const userDetail = getUserDetail();
  const MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [anchorEl, setAnchorEl] = useState(null); // State to manage anchor element for menu
  const [selectedItem, setSelectedItem] = useState("Active");
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [isOpenChangePassModal, setIsOpenChangePassModal] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const [clientList, setClientList] = useState([]);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to manage confirmation dialog visibility
  const [pendingStatus, setPendingStatus] = useState(null);
  const [disable, setIsDisable] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenKYCModal, setIsOpenKYCModal] = useState(false);
  const [kycType, setKycType] = useState<number>();
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reasonValue, setReasonValue] = useState<string>("");
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const { role } = useSelector((store: any) => store?.user);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    if (
      window.location.pathname.includes("agents") &&
      (MainuserDetail?.role_id == 4 || MainuserDetail?.role_id == 5) &&
      Accesslist.is_agent_access == 0
    ) {
      navigate(`/401`);
    } else {
      setLoading(false);
    }
  }, [Accesslist]);

  useEffect(() => {
    if (!agent_id) return null;
    const fetchClientInfo = async () => {
      setLoading(true);
      try {
        const res = await dispatch(getAgentInfo({ agent_id }));
        if (
          (userDetail.role_id == 4 || userDetail.role_id == 5) &&
          res.payload.data.code == 400
        ) {
          navigate("/401");
        } else {
          setTimeout(() => setLoading(false), 1000);
        }
      } catch (error) {
        console.error("Failed to fetch client info:", error);
      }
    };

    fetchClientInfo();

    return () => {
      dispatch(resetFormData());
      dispatch(changeFetchStatus());
    };
  }, []);

  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };
  useEffect(() => {
    if (!isOpenKYCModal) {
      setErrorMessage("");
      setReasonValue("");
    }
  }, [isOpenKYCModal]);

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

  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedImage]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to the clicked button
  };

  // Close menu handler
  const handleClose = () => {
    setAnchorEl(null); // Reset anchor element to hide the menu
    setErrorMessage("");
  };

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
          user_id: agent_id,
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

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(fileArray);

      const formData: any = new FormData();
      formData.append("agent_id", agent_id);

      fileArray.forEach((file, index) => {
        formData.append(`files`, file);
      });

      // Dispatch the uploadAttachment action with formData
      dispatch(uploadAttachment(formData));
    }
    e.target.value = "";
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  const handleDeleteAttachment = async (id: number) => {
    const { payload } = await dispatch(deleteAttachment({ attachment_id: id }));
    if (payload?.data?.status) {
      dispatch(getAgentInfo({ agent_id }));
    }
    setIsOpenDeletedModal(false);
  };

  const handleResetPassword = async () => {
    await dispatch(resetPassword({ client_id: agent_id }));
  };

  useEffect(() => {
    setSelectedItem(agentDetail?.status);
    setChecked(!!agentDetail?.two_factor_authentication);
  }, [agentDetail]);
  const handleScroll = debounce(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      const hasMoreData =
        clientList.length >= limit || clientList.length >= limit; // Check if there are more items to fetch
      const totalRecordsFetched = clientList.length || clientList.length;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // Near bottom
        if (!isFetching && hasMoreData && clientList.length % limit === 0) {
          setIsFetching(true);
          getAssignedAgentClientData(page + 1).finally(() => {
            setPage((page) => page + 1);
            setIsFetching(false);
          });
        }
      }
    }
  });
  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);
  const handleTwoFactor = async (check: boolean) => {
    const newStatus = check ? 1 : 0;
    // setStatus(newStatus);
    await dispatch(
      twoFactorAuthentication({
        user_id: agent_id,
        status: newStatus,
      })
    );
  };
  const getAssignedAgentClientData = async (page = 0) => {
    const payload: filterAgentType = {
      start: page,
      limit: 20,
      search: "",
      agent_id: Number(agent_id),
    };
    try {
      // Dispatch the thunk and await the result
      const response = await dispatch(getAssignedClientList(payload));

      // Store the response in a variable
      const assignedClients = response?.payload?.data?.data?.list || [];
      setClientList((prev) => {
        const newAgents = page
          ? [...prev, ...assignedClients]
          : [...assignedClients];
        return newAgents.filter(
          (agent, index, self) =>
            index === self.findIndex((a) => a.id === agent.id)
        );
      });

      // You can now use `assignedClients` as needed
    } catch (error) {
      console.error("Error fetching assigned clients:", error);
    }
  };
  useEffect(() => {
    getAssignedAgentClientData(page);
  }, []);

  const handleOnChangeReason = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= 500) {
      setErrorMessage("Reason should be less than 500 Characters.");
    }
    setReasonValue(event.target.value);
    if (event.target.value != "") {
      setErrorMessage("");
    }
  };

  const handleChange = (event) => {
    // setChecked(event.target.checked);
    // handleTwoFactor(event.target.checked);
    setIsOpenAuthModal(true);
  };

  if (fetchStatus === "loading" || loading) {
    return <ListLoading />;
  }

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

  const onSubmit = async () => {
    if (kycType === 1) {
      if (reasonValue.trim() === "") {
        setErrorMessage("Reason is required.");
        return false;
      }
      if (reasonValue.trim().length >= 500) {
        setErrorMessage("Reason should be less than 500 Characters.");
        return false;
      }
      setErrorMessage("");
    }
    setIsLoading(true);
    const params = {
      agent_id: agentDetail?.id,
      status: kycType === 1 ? 2 : 1,
      reject_reason: kycType === 1 ? reasonValue : "",
    };
    const res = await dispatch(updateKycRequestStatus(params));
    toast.success(res?.payload?.data?.message);
    setIsLoading(false);
    setIsDisable(false);
    setIsOpenKYCModal(false);
    setErrorMessage("");
    setReasonValue("");
    dispatch(getAgentInfo({ agent_id }));
  };

  return (
    <>
      <div className="px-16">
        <TitleBar title="Agent Profile"> </TitleBar>
      </div>
      <div className="flex lg:flex-row flex-col gap-[20px] lg:gap-0">
        <div className="px-40 xs:px-10  w-[100%]  lg:w-[75%]  gap-10">
          <Grid spacing={3} className="sm:px-10 xs:px-10 ">
            <Grid item xs={12} sm={12} md={9}>
              {/* <div className="flex flex-col gap-10 p-20 bg-[#FFFFFF] h-auto
             md:h-[calc(100vh-164px)] sm:h-auto  rounded-12 xs:px-20 "> */}
              <div
                className="flex flex-col gap-10 p-20 bg-[#FFFFFF] h-auto  w-full
                sm:h-auto  rounded-12 xs:px-20"
              >
                <div
                  className="border border-[#E7E8E9] rounded-lg flex justify-between gap-[30px] items-start sm:p-[3rem]
                 p-[1rem] flex-col sm:flex-row"
                >
                  <div className="w-full">
                    <div
                      className="flex  justify-between  w-full border-b-[#E7E8E9] border-b-[1px] sm:flex-row flex-col 
                    pb-[10px] sm:pb-0"
                    >
                      <div className="flex gap-40 flex-col sm:flex-row overflow-hidden ">
                        <div className="flex justify-between ">
                          <div className="h-[100px] w-[100px] sm:h-[100px] sm:w-[99px] rounded-full overflow-hidden ">
                            {/* <img src="../assets/images/pages/agent/luis_.jpg" /> */}
                            <img
                              src={
                                agentDetail?.user_image
                                  ? urlForImage + agentDetail?.user_image
                                  : "../assets/images/logo/images.jpeg"
                              }
                            />
                          </div>
                          <div className="sm:hidden block ">
                            {" "}
                            {(MainuserDetail?.role_id == 1 ||
                              (MainuserDetail?.role_id == 4 &&
                                agentDetail?.is_edit_access != 0)) && (
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
                        <div className="pt-[20px]">
                          <div className="flex items-center sm:gap-[7rem] gap-[1rem] mb-10 flex-wrap">
                            <span className="text-[24px] text-[#111827] font-semibold inline-block">
                              {`${agentDetail?.first_name} ${agentDetail?.last_name}`}
                              {/* Bernadette Jone */}
                            </span>
                            {agentDetail?.status == "Pending" ? (
                              <Button
                                variant="outlined"
                                className={`h-20 rounded-3xl border-none sm:min-h-24 leading-none cursor-default hover:bg-[#ffeebb]
                          
                                    text-[#f0b402] bg-[#ffeebb]
                                
                                `}
                              // endIcon={<DownGreenIcon color="#f0b402" />}
                              // onClick={handleClick}
                              >
                                {/* {agentDetail?.status || "N/A"} */}
                                {selectedItem}
                              </Button>
                            ) : (
                              <ClientStatus
                                rowstatus={agentDetail?.status}
                                id={agentDetail?.id}
                                title="agent"
                              />
                            )}
                          </div>
                          <div className="flex text-[2rem] text-para_light flex-col sm:flex-row ">
                            <div className="flex">
                              <div>
                                <img
                                  src="../assets/icons/group.svg"
                                  className="mr-4"
                                />
                              </div>

                              <div>{agentDetail?.id || "N/A"}</div>
                            </div>
                            <div className="flex sm:px-20">
                              <div className="flex">
                                <div>
                                  <img
                                    src="../assets/icons/ri_time-line.svg"
                                    className="sm:mr-4"
                                  />{" "}
                                </div>
                                <div>
                                  {agentDetail?.created_at
                                    ? moment(agentDetail?.created_at).format(
                                      "MMMM Do, YYYY"
                                    )
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-baseline justify-start w-full py-20 gap-28 flex-col sm:flex-row">
                            <div className="flex pr-10 gap-32 lgsrc={task1}1:flex-row flex-col">
                              <div className="flex flex-col gap-5 ">
                                <span className="text-[#111827] text-[18px] font-500">
                                  Email Address
                                </span>
                                <div className="flex ">
                                  <img
                                    src="../assets/icons/ic_outline-email.svg"
                                    className="mr-4"
                                  />
                                  {MainuserDetail?.role_id == 1 ||
                                    (MainuserDetail?.role_id == 4 &&
                                      Accesslist.agent_hide_info == 0) ? (
                                    <p className="text-para_light text-[20px] break-words sm:break-normal">
                                      {agentDetail?.email || "N/A"}
                                    </p>
                                  ) : (
                                    <span className="mt-8">*****</span>
                                  )}
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
                                  {MainuserDetail?.role_id == 1 ||
                                    (MainuserDetail?.role_id == 4 &&
                                      Accesslist.agent_hide_info == 0) ? (
                                    <span className="text-para_light text-[20px] ">
                                      {/* {clientDetail?.country_code}{" "} */}
                                      {agentDetail?.phone_number || "N/A"}
                                    </span>
                                  ) : (
                                    <span className="mt-8">*****</span>
                                  )}
                                </div>
                              </div>
                              {/* </div> */}
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between w-full pt-0 pb-20 gap-31 overflow-hidden">
                            <div className="grid pr-10 gap-7">
                              <span className="text-[20px] text-title font-500 w-max">
                                Address
                              </span>
                              <div className="grid grid-cols-[auto,1fr] items-center text-[#757982] text-[20px] font-400 mb-5">
                                <img
                                  src="../assets/icons/loaction.svg"
                                  className="mr-4"
                                />
                                {/* <Tooltip title={agentDetail?.address || "N/A"}>
                                  <p className="truncate max-w-xs">
                                    {agentDetail?.address || "N/A"}
                                  </p>
                                </Tooltip> */}

                                <p style={{ wordBreak: "break-word" }}>
                                  {/* {accManagerDetail?.address || "N/A"} */}
                                  {renderAddress(agentDetail)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        {(MainuserDetail?.role_id == 1 ||
                          (MainuserDetail?.role_id == 4 &&
                            agentDetail?.is_edit_access == 1)) && (
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
                    {/* Id Proof */}
                    {agentDetail?.captured_pic ||
                      agentDetail?.kyc_back_pic ||
                      agentDetail?.kyc_front_pic ? (
                      <div className="flex flex-col  my-[2rem] gap-9">
                        <div className="flex sm:justify-between item-center flex-wrap justify-center gap-10 ">
                          <div className="text-2xl text-title font-600">
                            KYC Info
                          </div>
                          {agentDetail?.is_complete_profile === 4 ? (
                            <div className="flex gap-[10px] flex-wrap justify-center">
                              <Button
                                className="cursor-pointer flex rounded-full py-[1rem] px-[2rem] text-red-400
                                   bg-red-100 sm:w-max hover:bg-red-100 w-[95px] gap-[10px] sm:text-lg  text-[12px] font-500 items-center whitespace-nowrap"
                                onClick={() => {
                                  setIsOpenKYCModal(true);
                                  setKycType(1);
                                }}
                              >
                                <span>Reject KYC</span>
                              </Button>
                              <Button
                                className="cursor-pointer flex rounded-full py-[1rem] px-[2rem] text-green-400
                                bg-green-100 sm:w-max hover:bg-green-100  w-[95px] gap-[10px] sm:text-lg  text-[12px] font-500 items-center whitespace-nowrap"
                                onClick={() => {
                                  setIsOpenKYCModal(true);
                                  setKycType(2);
                                }}
                              >
                                <span>Approve KYC</span>
                              </Button>
                            </div>
                          ) : agentDetail?.is_complete_profile === 6 ? (
                            <Button
                              className="cursor-default flex rounded-full py-[1rem] px-[2rem] text-red-400
                                   bg-red-100 hover:bg-red-100 sm:w-max  w-[95px] gap-[10px] sm:text-lg  text-[12px] font-500 items-center whitespace-nowrap"
                            >
                              <span>Rejected</span>
                            </Button>
                          ) : agentDetail?.is_complete_profile === 5 ? (
                            <Button
                              className="cursor-default flex rounded-full py-[1rem] px-[2rem] text-green-400
                                      bg-green-100 hover:bg-green-100  sm:w-max  w-[95px] gap-[10px] sm:text-lg  text-[12px] font-500 items-center whitespace-nowrap "
                            >
                              <span>Approved</span>
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex gap-10 py-5 flex-wrap border-b-[#E7E8E9] border-b-[1px] pb-[3rem]">
                          {agentDetail?.kyc_front_pic ? (
                            <div className="relative ">
                              <img
                                src={urlForImage + agentDetail?.kyc_front_pic}
                                alt="Black Attachment"
                                className="w-[200px] rounded-md sm:h-[130px]"
                              />
                              <div
                                className="absolute top-7 left-7"
                                onClick={() =>
                                  handleImageClick(
                                    urlForImage + agentDetail?.kyc_front_pic
                                  )
                                }
                              >
                                <AttachmentIcon className="cursor-pointer" />
                              </div>
                              <p className="text-center mt-[3px] text-para_light text-[16px]">
                                ID (Front)
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                          {agentDetail?.kyc_back_pic ? (
                            <div className="relative ">
                              <img
                                src={urlForImage + agentDetail?.kyc_back_pic}
                                alt="Black Attachment"
                                className="w-[200px] rounded-md sm:h-[130px]"
                              />
                              <div
                                className="absolute top-7 left-7"
                                onClick={() =>
                                  handleImageClick(
                                    urlForImage + agentDetail?.kyc_back_pic
                                  )
                                }
                              >
                                <AttachmentIcon className="cursor-pointer" />
                              </div>
                              <p className="text-center mt-[3px] text-para_light text-[16px]">
                                ID (Back)
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                          {agentDetail?.captured_pic ? (
                            <div className="relative ">
                              <img
                                src={urlForImage + agentDetail?.captured_pic}
                                alt="Black Attachment"
                                className="w-[200px] rounded-md sm:h-[130px]"
                              />
                              <div
                                className="absolute top-7 left-7"
                                onClick={() =>
                                  handleImageClick(
                                    urlForImage + agentDetail?.captured_pic
                                  )
                                }
                              >
                                <AttachmentIcon className="cursor-pointer" />
                              </div>
                              <p className="text-center mt-[3px] text-para_light text-[16px]">
                                Captured Image
                              </p>
                            </div>
                          ) : (
                            ""
                          )}

                          {expandedImage && (
                            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
                              <div
                                className="absolute z-10 right-[25px] top-[100px] cursor-pointer"
                                onClick={() => setExpandedImage(null)}
                              >
                                <Button
                                  variant="text"
                                  className="text-[#9DA0A6] hover:text-white bg-transparent hover:bg-transparent text-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300 ..."
                                >
                                  X
                                </Button>
                              </div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   ">
                                <img
                                  src={expandedImage}
                                  alt="Expanded Image"
                                  className="w-[800px] h-[500px] object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Attachment */}
                    <div className="flex flex-col  my-[2rem] gap-9">
                      <div className="text-2xl text-title font-600">
                        Attachment
                      </div>
                      <div className="flex gap-10 py-5 flex-wrap ">
                        {agentDetail?.attachments?.map((item: any) => (
                          <div className="relative ">
                            {item.file.includes(".png") ||
                              item.file.includes(".jpg") ||
                              item.file.includes(".webp") ||
                              item.file.includes(".jfif") ||
                              item.file.includes(".jpeg") ||
                              item.file.startsWith("image/") ? (
                              <>
                                <img
                                  src={urlForImage + item.file}
                                  alt="Black Attachment"
                                  className="w-[200px] rounded-md sm:h-[130px]"
                                />
                                <div
                                  className="absolute top-7 left-7"
                                  onClick={() =>
                                    handleImageClick(urlForImage + item.file)
                                  }
                                >
                                  <AttachmentIcon className="cursor-pointer" />
                                </div>
                                <div
                                  className="absolute top-7 right-7"
                                // onClick={() => handleDeleteAttachment(item.id)}
                                >
                                  <AttachmentDeleteIcon
                                    onClick={() => {
                                      setIsOpenDeletedModal(true);
                                      setIsDeleteId(item.id);
                                    }}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="w-[200px] rounded-md sm:h-[130px] flex items-center justify-center border-1 border-[#4F46E5]">
                                <a
                                  href={urlForImage + item.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="../assets/images/logo/pdfIcon.png"
                                    alt="Black Attachment"
                                    className="h-[50px] w-[50px]"
                                  />
                                </a>

                                {/* <a href="/">check</a> */}
                                <div
                                  className="absolute top-7 left-7"
                                  onClick={() =>
                                    handleImageClick(urlForImage + item.file)
                                  }
                                >
                                  {/* <AttachmentIcon /> */}
                                </div>
                                <div
                                  className="absolute top-7 right-7"
                                // onClick={() => handleDeleteAttachment(item.id)}
                                >
                                  <AttachmentDeleteIcon
                                    onClick={() => {
                                      setIsOpenDeletedModal(true);
                                      setIsDeleteId(item.id);
                                    }}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {expandedImage && (
                          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
                            <div
                              className="absolute z-10 right-[25px] top-[100px] cursor-pointer"
                              onClick={() => setExpandedImage(null)}
                            >
                              <Button
                                variant="text"
                                className="text-[#9DA0A6] hover:text-white bg-transparent hover:bg-transparent text-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300 ..."
                              >
                                X
                              </Button>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   ">
                              <img
                                src={expandedImage}
                                alt="Expanded Image"
                                className="w-[800px] h-[500px] object-contain"
                              />
                            </div>
                          </div>
                        )}

                        <label
                          className=" cursor-pointer border-[0.5px] border-[#4F46E5] rounded-8 bg-[#EDEDFC] flex 
                             flex-col items-center sm:h-[97px] w-[200px] justify-center sm:py-64 py-36"
                          onClick={() => handleUploadFile}
                        >
                          {/* <div className="bg-[#EDEDFC] px-20 mb-10 border-[0.5px] border-solid border-[#4F46E5] rounded-6 min-h-[48px] flex items-center justify-between cursor-pointer"> */}
                          <span>
                            <img src="../assets/images/logo/upload.png" />
                          </span>
                          <label className="text-[16px] text-[#4F46E5] flex items-center cursor-pointer">
                            Upload File
                            <input
                              type="file"
                              style={{ display: "none" }}
                              multiple
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleUploadFile}
                            />
                          </label>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <Grid
                  item
                  lg={12}
                  className="basis-full mt-[30px] flex  gap-28 flex-col sm:flex-row "
                >
                  <div className="flex-1 ">
                    <div className="flex justify-between gap-10 p-24 rounded-lg bg-secondary_bg">
                      <div className="flex gap-[20px]  justify-center flex-col sm:flex-row">
                        <div className="bg-secondary h-[54px] w-[54px] min-w-[54px] rounded-8 flex items-center justify-center ">
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
                        className="shrink-0 w-[5rem] aspect-square  cursor-pointer rounded-lg border-borderColor mt-[5px]"
                        onClick={() => {
                          setIsOpenChangePassModal(true);
                        }}
                      >
                        <ArrowRightCircleIcon />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex  justify-between gap-10 p-24 rounded-lg bg-secondary_bg h-full">
                      <div className="flex gap-[20px] justify-center flex-col sm:flex-row">
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
                            It will send a link to the agent to reset their
                            password.
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 w-[5rem] aspect-square  cursor-pointer rounded-lg border-borderColor">
                        <div
                          className="text-[#4F46E5] font-500 text-[14px] underline mt-[3px]"
                          onClick={handleResetPassword}
                        >
                          Reset
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              </div>
            </Grid>
            <Grid
              item
              lg={9}
              className={`${MainuserDetail?.role_id == 1 ||
                (MainuserDetail?.role_id == 4 &&
                  Accesslist?.is_client_access == 0)
                ? "pb-0"
                : ""
                } "basis-full flex  gap-28 flex-col sm:flex-row mt-20 "`}
            >
              <div className="w-full bg-[#FFFFFF] rounded-[8px] px-20 py-20  flex items-center gap-10 justify-between">
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
                      {MainuserDetail?.role_id == 1 ||
                        (MainuserDetail?.role_id == 4 &&
                          Accesslist.agent_hide_info == 0)
                        ? agentDetail?.email || "N/A"
                        : "*****"}
                    </a>{" "}
                    is linked for Two-Factor Authentication.
                  </p>
                </div>
                <div className="w-[30%] text-right">
                  <Android12Switch
                    checked={checked}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        {/* <div
          className={`${MainuserDetail?.role_id == 1 ||
            (MainuserDetail?.role_id == 4 && Accesslist?.is_client_access == 0)
            ? "pb-20 "
            : ""
            } px-20 sm:px-0`}
        > */}
        <RecentData />
        {/* </div> */}
      </div>
      {(MainuserDetail?.role_id == 1 ||
        (MainuserDetail?.role_id == 4 &&
          Accesslist?.is_client_access == 1)) && (
          <div className=" px-20 w-full mb-10">
            <Grid
              item
              lg={6}
              sm={12}
              className="basis-full mt-[30px] gap-28 flex-col sm:flex-row bg-[#ffffff] rounded-[8px] "
            >
              <Typography className="text-[#0A0F18] font-600 text-[20px] px-20 py-10">
                Assigned Clients
              </Typography>
              <div
                ref={scrollRef}
                onScroll={() => handleScroll}
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
                  {clientList?.length === 0 && (
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
                  {clientList?.map((row, index) => {
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
                          {/* {row.first_name} */}
                          {`${row?.first_name} ${row?.last_name}`}
                        </TableCell>

                        <TableCell
                          align="center"
                          className="whitespace-nowrap font-500"
                        >
                          {row.company_name}
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
                              <Link
                                to={`/admin/client/detail/${row.user_id || row.id}`}
                              >
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
          </div>
        )}
      {/* <div className="px-28 mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm"></div> */}
      {isOpenAddModal && (
        <AddAgentModel
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          isEditing
        />
      )}
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        heading="Delete Attachment"
        description="Are you sure you want to delete this attachment? "
      />
      <ChangePassword
        role={role}
        user_id={agent_id}
        isOpen={isOpenChangePassModal}
        setIsOpen={setIsOpenChangePassModal}
      />
      <TwoFactorAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={checked}
        setIsAuthenticate={setChecked}
        id={agent_id}
      />
      <KYCConfirmationModal
        isOpen={isOpenKYCModal}
        type={kycType}
        error={errorMessage}
        setIsOpen={setIsOpenKYCModal}
        isLoading={isLoading}
        onChangeInput={handleOnChangeReason}
        onSubmit={onSubmit}
        heading={kycType === 1 ? "Reject KYC request" : "Approve KYC request"}
        description={`Are you sure you want to ${kycType === 1 ? "reject" : "approve"} this request? `}
      />
      {/* </div> */}
    </>
  );
}
