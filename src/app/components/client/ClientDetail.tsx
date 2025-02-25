import { Box, Button, Checkbox, Theme } from "@mui/material";
import { useTheme } from "@mui/styles";

import ListLoading from "@fuse/core/ListLoading";
import { logoutCometChat } from "app/configs/cometChatConfig";
import { getAccManagerList } from "app/store/AccountManager";
import { AccManagerRootState } from "app/store/AccountManager/Interface";
import { addAgentInagentGroup } from "app/store/Agent group";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { logInAsClient } from "app/store/Auth";
import {
  GetAssignAgentsInfo,
  addAssignAccManager,
  addAssignAgents,
  changeFetchStatus,
  getAssignAccMangerInfo,
  getClientInfo,
} from "app/store/Client";
import { ClientRootState, filterType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import {
  DownArrowIconWhite,
  LoginIcon,
  PlusIcon,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import TitleBar from "src/app/components/TitleBar";
import { getClientId, getUserDetail } from "src/utils";
import DropdownMenu from "../../../app/components/Dropdown";
import CommonTab from "../../components/CommonTab";
import InputField from "../InputField";
import ChangePassword from "../profile/ChangePassword";
import EditProfile from "../profile/EditProfile";
import AssignedAccountManager from "./components/AssignedAccountManager";
import AssignedAgents from "./components/AssignedAgents";
import Profile from "./components/Profile";
import SubscriptionList from "./components/SubscriptionList";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { restAll } from "app/store/Client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export default function ClientDetail() {
  // get current user detail
  let userDetail = getUserDetail();
  // get loginAsClientSignIn function from use Auth
  const { jwtService, signOut } = useAuth();

  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenChangePassModal, setIsOpenChangePassModal] =
    useState<boolean>(false);
  const location: Location = useLocation();
  const {
    clientDetail,
    actionStatus,
    fetchStatus,
    assignAccManagerDetail,
  }: any = useSelector((store: ClientRootState) => store?.client);
  const { role_id, role } = useSelector((store: any) => store?.user);

  const { searchAgentList, status } = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );
  const { list, accountstatus } = useSelector(
    (store: AccManagerRootState) => store.accManagerSlice
  );
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const [filteredAgentList, setFilteredAgentList] = useState(searchAgentList);
  const [filteredAccMaangerList, setFilteredAccMaangerList] = useState(list);

  useEffect(() => {
    setFilteredAgentList(searchAgentList);
  }, [searchAgentList]);

  useEffect(() => {
    setFilteredAccMaangerList(list);
  }, [list]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(id)) {
        return prevCheckedItems.filter((item) => item !== id);
      } else {
        return [...prevCheckedItems, id];
      }
    });
  };

  const handleAddnewAgents = () => {
    dispatch(
      addAssignAgents({
        client_id: client_id,
        agent_ids: checkedItems,
      })
    );
    // dispatch(
    //   GetAssignAgentsInfo({
    //     client_id,
    //     agentfilterMenu,
    //   })
    // );
    handleClose();
    setIsOpenEditModal(false);

    // Filter out the selected items
    setFilteredAgentList((prevList: any) =>
      prevList.filter((item) => !checkedItems.includes(item.id))
    );
    setCheckedItems([]); // Clear the checked items
    setInitialRender(false);
    setSearch("");
  };

  const { client_id } = useParams();
  if (client_id) {
    localStorage.setItem("client_id", client_id);
  }
  const navigate: NavigateFunction = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Get a specific query parameter
  const paramValue = queryParams.get("type");
  //custom dropdown
  const [anchorEl3, setAnchorEl3] = useState<HTMLElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const [initialRender, setInitialRender] = useState(false);
  const isInitialMount = useRef(true);
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const [agentfilterMenu, setAgentFilterMenu] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
  });
  const [managerfilterMenu, setManagerFilterMenu] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
  });
  const [checkedItems, setCheckedItems] = useState([]);

  const handleClose = () => {
    setAnchorEl3(null);
    setAnchorEl(null);
    setCheckedItems([]);
    debouncedSearch("");
    setInitialRender(false);
    setSearch("");
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl3(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      // Update the search filter here
      setFilterMenu((prevFilters) => ({
        ...prevFilters,
        search: searchValue,
      }));
      setInitialRender(true);
    }, 800),
    []
  ); // Adjust the delay as needed (300ms in this example)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleAddnewAccManager = () => {
    dispatch(
      addAssignAccManager({
        client_id: client_id,
        account_manager_ids: checkedItems,
      })
    );
    // dispatch(
    //   GetAssignAgentsInfo({
    //     client_id,
    //     managerfilterMenu,
    //   })
    // );
    handleClose();
    setIsOpenEditModal(false);

    // Filter out the selected items
    setFilteredAccMaangerList((prevList: any) =>
      prevList.filter((item) => !checkedItems.includes(item.id))
    );
    setCheckedItems([]); // Clear the checked items
    setInitialRender(false);
    setSearch("");
  };
  // const fetchManagerList = useCallback(() => {
  //   dispatch(getAccManagerList({ ...filterMenu, client_id: client_id }));
  // }, [paramValue]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // After the initial render, set this to false
      if (paramValue === "assigned-agents") {
        dispatch(addAgentInagentGroup({ ...filterMenu, client_id: client_id }));
      }
    } else if (
      paramValue === "assigned-agents" &&
      filterMenu.search.trim() !== ""
    ) {
      dispatch(addAgentInagentGroup({ ...filterMenu, client_id: client_id }));
    }
  }, [filterMenu, paramValue, client_id]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // After the initial render, set this to false
      if (paramValue === "assigned-account") {
        dispatch(getAccManagerList({ ...filterMenu, client_id: client_id }));
      }
    } else if (
      paramValue === "assigned-account" &&
      filterMenu.search.trim() !== ""
    ) {
      dispatch(getAccManagerList({ ...filterMenu, client_id: client_id }));
    }
  }, [filterMenu, paramValue, client_id]);
  const managerCallApi = () => {
    dispatch(
      getAssignAccMangerInfo({
        ...managerfilterMenu,
        client_id,
      })
    );
  };

  const callAgentApi = () => {
    // if (paramValue == "assigned-agents") {
    dispatch(
      GetAssignAgentsInfo({
        ...agentfilterMenu,
        client_id,
      })
    );
    // }
  };

  useEffect(() => {
    if (paramValue == "assigned-agents") {
      callAgentApi();
    }
  }, [
    agentfilterMenu.start,
    agentfilterMenu.limit,
    agentfilterMenu.search,
    paramValue,
  ]);

  useEffect(() => {
    if (paramValue == "assigned-account") {
      managerCallApi();
    }
  }, [
    managerfilterMenu.start,
    managerfilterMenu.limit,
    managerfilterMenu.search,
    paramValue,
  ]);

  useEffect(() => {
    if (
      paramValue == "assigned-account" &&
      userDetail?.role_id == 4 &&
      Accesslist.client_account_manager == 0
    ) {
      queryParams.set("type", "profile");
      navigate(`${window.location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
    } else if (
      paramValue == "assigned-agents" &&
      userDetail?.role_id == 4 &&
      Accesslist.client_assigned_agent == 0
    ) {
      queryParams.set("type", "profile");
      navigate(`${window.location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
    } else if (
      paramValue == "subscription" &&
      userDetail?.role_id == 4 &&
      Accesslist.client_subscriptions == 0
    ) {
      queryParams.set("type", "profile");
      navigate(`${window.location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
    }
  }, [Accesslist]);

  const CustomDropDown = (): JSX.Element => {
    return (
      <DropdownMenu
        marginTop={"mt-20"}
        button={
          <div
            className="relative flex items-center"
            onClick={handleButtonClick}
          >
            <Button
              variant="outlined"
              className="h-[40px] sm:text-[16px] flex gap-8  text-white leading-none bg-secondary hover:bg-secondary"
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
              Assign New Agent
            </Button>
          </div>
        }
        anchorEl={anchorEl3}
        handleClose={handleClose}
      >
        <div className="sm:w-[375px] p-20">
          <p className="text-title font-600 text-[1.6rem]">Agent Name</p>

          <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
            <InputField
              name={"agent"}
              placeholder={"Enter Agent Name"}
              className="common-inputField "
              inputProps={{
                className: "ps-[2rem] w-full sm:w-full",
              }}
              onChange={handleSearchChange}
            />
            <div className="max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
              {fetchStatus == "loading" ? (
                <ListLoading />
              ) : (
                <>
                  {initialRender && search != "" && (
                    <>
                      {filteredAgentList.map((item: any) => (
                        <div
                          className="flex items-center gap-10 px-20 w-full"
                          key={item.id}
                        >
                          <label className="flex items-center gap-10 w-full cursor-pointer">
                            <Checkbox
                              checked={checkedItems.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent", // No hover background globally
                                },
                              }}
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
              onClick={handleAddnewAgents}
              disabled={checkedItems.length === 0 || actionStatus}
            >
              {/* {checkedItems.length == 0 || actionStatus ? (
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
              ) : ( */}
              Assign
              {/* )} */}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="w-[156px] h-[48px] text-[16px] font-400 ml-14"
              onClick={handleClose}
              disabled={actionStatus}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DropdownMenu>
    );
  };
  const AssignedAccManagerDropDown = (): JSX.Element => {
    return (
      <>
        <DropdownMenu
          marginTop={"mt-20"}
          button={
            <div
              className="relative flex items-center"
              onClick={handleButtonClick}
            >
              <Button
                variant="outlined"
                className="h-[40px] sm:text-[16px] flex gap-8  text-white leading-none bg-secondary hover:bg-secondary"
                aria-label="Manage Sections"
                size="large"
                endIcon={
                  <>
                    {anchorEl ? (
                      <UpArrowBlank fill="white" />
                    ) : (
                      <DownArrowIconWhite className="cursor-pointer" />
                    )}
                  </>
                }
              >
                Assign New Admin User
              </Button>
            </div>
          }
          anchorEl={anchorEl}
          handleClose={handleClose}
        >
          <div className="sm:w-[375px] p-20">
            <p className="text-title font-600 text-[1.6rem]">Admin User Name</p>

            <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
              <InputField
                name={"agent"}
                placeholder={"Enter Admin User Name"}
                className="common-inputField "
                inputProps={{
                  className: "ps-[2rem] w-full sm:w-full",
                }}
                onChange={handleSearchChange}
              />
              <div className=" max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                {actionStatus ? (
                  <ListLoading />
                ) : (
                  <>
                    {initialRender && search != "" && (
                      <>
                        {filteredAccMaangerList.map((item: any) => (
                          <div
                            className="flex items-center gap-10 px-20 w-full"
                            key={item.id}
                          >
                            <label className="flex items-center gap-10 w-full cursor-pointer">
                              <Checkbox
                                checked={checkedItems.includes(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "transparent", // No hover background globally
                                  },
                                }}
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
                onClick={handleAddnewAccManager}
                disabled={checkedItems.length === 0}
              >
                Assign
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className="w-[156px] h-[48px] text-[16px] font-400 ml-14"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DropdownMenu>
      </>
    );
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <Profile
          clientDetail={clientDetail}
          setIsOpenEditModal={setIsOpenEditModal}
          setIsOpenChangePassModal={setIsOpenChangePassModal}
        />
      ),
      actionBtn: () => null,
      tabHeight: false,
    },
    ...(userDetail?.role_id == 1 ||
    (userDetail?.role_id == 4 && Accesslist.client_assigned_agent == 1)
      ? [
          {
            id: "assigned-agents",
            label: "Assigned Agents",
            content: (
              <AssignedAgents
                clientDetail={clientDetail}
                setAgentFilterMenu={setAgentFilterMenu}
                agentfilterMenu={agentfilterMenu}
              />
            ),
            actionBtn: CustomDropDown,
            tabHeight: true,
          },
        ]
      : []),

    ...(userDetail?.role_id == 1 ||
    (userDetail?.role_id == 4 && Accesslist.client_account_manager == 1)
      ? [
          {
            id: "assigned-account",
            label: "Assigned Admin User ",
            content: (
              <AssignedAccountManager
                clientDetail={clientDetail}
                setManagerFilterMenu={setManagerFilterMenu}
                managerfilterMenu={managerfilterMenu}
              />
            ),
            actionBtn: AssignedAccManagerDropDown,
            tabHeight: true,
          },
        ]
      : []),
    ...(userDetail?.role_id == 1 ||
    (userDetail?.role_id == 4 && Accesslist.client_subscriptions == 1)
      ? [
          {
            id: "subscription",
            label: "Subscriptions",
            content: <SubscriptionList clientDetail={clientDetail} />,
            actionBtn: () => null,
            tabHeight: false,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (!client_id) return null;
    const fetchClientInfo = async () => {
      try {
        const res = await dispatch(getClientInfo({ client_id }));
        if (
          (userDetail.role_id == 4 || userDetail.role_id == 5) &&
          res.payload.data.code == 400
        ) {
          navigate("/401");
        }
      } catch (error) {
        console.error("Failed to fetch client info:", error);
      }
    };

    fetchClientInfo();
    return () => {
      dispatch(changeFetchStatus());
    };
  }, []);

  const handleLoginAsClient = () => {
    const clientId = (clientDetail as any)?.id;
    dispatch(logInAsClient(clientId)).then((res) => {
      if (res?.payload?.status == 0) {
        toast.error(res?.payload?.message);
      } else if (res?.payload?.status == 1) {
        logoutCometChat();
        dispatch(restAll());
        const clientId = getClientId();
        if (clientId) {
          const localStorageKeys = Object.keys(localStorage);
          localStorageKeys
            .filter((data) => data.includes(clientId))
            .forEach((data) => localStorage.removeItem(data));
          localStorage.removeItem("client_id");
          // localStorage.removeItem("jwt_access_token")
        } else {
          signOut();
        }
        jwtService.handleLoginAsClientSignIn(res?.payload);
        window.close();
      }
    });
  };

  return (
    <>
      {clientDetail?.id && (
        <>
          <TitleBar title="Client" minHeight="min-h-[80px]">
            <Box
              display={"flex"}
              gap={2}
              sx={{
                flexDirection: {
                  xs: "column", // column direction on small screens (xs and down)
                  sm: "row", // row direction on medium screens (sm and up)
                },
              }}
            >
              {(userDetail?.role_id == 1 ||
                (userDetail?.role_id == 4 &&
                  Accesslist.client_as_login == 1)) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className="h-[40px] text-[16px] flex gap-8 font-[600]"
                  aria-label="Add Tasks"
                  size="large"
                  onClick={handleLoginAsClient}
                >
                  Login As Client
                  <LoginIcon color={theme.palette.secondary.main} />
                </Button>
              )}
              {paramValue == "subscription" && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className="h-[40px] text-[16px] flex gap-8 font-[600] leading-3 sm:leading-none"
                  aria-label="Add Tasks"
                  size="large"
                  onClick={() => {
                    navigate("/admin/client/add-subscription");
                  }}
                  startIcon={<PlusIcon color={theme.palette.secondary.main} />}
                >
                  Add A Subscription
                </Button>
              )}
            </Box>
          </TitleBar>

          <div className="px-[15px] mb-[3rem]">
            <div className="bg-white rounded-lg shadow-sm ">
              <CommonTab tabs={tabs} />

              {/* <div className="h-24" /> */}
            </div>
          </div>

          {/* <AddAgentModel isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} /> */}
          {isOpenEditModal && (
            <EditProfile
              isOpen={isOpenEditModal}
              setIsOpen={setIsOpenEditModal}
              clientDetail={clientDetail}
              loading={actionStatus}
            />
          )}
          <ChangePassword
            user_id={client_id}
            role={role}
            isOpen={isOpenChangePassModal}
            setIsOpen={setIsOpenChangePassModal}
          />
        </>
      )}
    </>
  );
}
