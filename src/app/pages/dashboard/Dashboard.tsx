import ListLoading from "@fuse/core/ListLoading";
import {
  Box,
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/styles";
import { RefreshToken } from "app/store/Auth";
import {
  GetAssignAgentsDashboardInfo,
  GetRecentActivityData,
} from "app/store/Client";
import { ClientRootState, filterType } from "app/store/Client/Interface";
import { projectList as api, projectColumnList } from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { setInitialState } from "app/theme-layouts/shared-components/navigation/store/navigationSlice";
import moment from "moment";
import { NoDataFound } from "public/assets/icons/common";
import {
  DownArrowBlank,
  DownArrowIcon,
  UpArrowBlank,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "src/app/components/Dropdown";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import SignDocuement from "src/app/main/clientOnBoard/SignDocuement";
import VerificationPage from "src/app/main/testing/VerificationPage";
import {
  getCheckBoxDetails,
  getClientId,
  getToken,
  getUserDetail,
  getcolumnListDetails,
} from "src/utils";
import DashboardRecentActivity from "../../components/dashboard/DashboardRecentActivity";
import DashboaredAgenda from "../../components/dashboard/DashboaredAgenda";
import Error401Page from "src/app/main/401/Error401Page";
import { useNotificationContext } from "src/app/notificationContext/NotificationProvider";

interface CheckboxState {
  agents: boolean;
  activity: boolean;
  agenda: boolean;
}

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
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const clientId = getClientId();
  const theme: Theme = useTheme();
  const [isChecked, setIsChecked] = useState<CheckboxState>(() => {
    const checkData = getCheckBoxDetails();
    return checkData
      ? checkData
      : { agents: true, activity: true, agenda: true };
  });

  const userId = getUserDetail();
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const project = useSelector((store: ProjectRootState) => store.project);
  const client_id = getUserDetail();
  const userDetails = getUserDetail();
  const [showProject, setShowProject] = useState<boolean>(false);
  const [userDetailUpdate, setUserDetailUpdate] = useState<any>({});
  const { projectList } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const { getUnreadCount } = useNotificationContext();

  useEffect(() => {
    getUnreadCount();
  }, []);

  useEffect(() => {
    let localData = localStorage.getItem("checkboxState");
    const activeUserData = localData ? JSON.parse(localData) : null;
    const prevData = activeUserData ? activeUserData : null;
    let checkBoxFields = { ...prevData, [userDetails?.uuid]: isChecked };
    if (clientId) {
      checkBoxFields = { ...checkBoxFields, [clientId]: isChecked };
    }
    localStorage.setItem("checkboxState", JSON.stringify(checkBoxFields));
  }, [isChecked]);
  const [columnList, setColumnList] = useState(projectList);

  useEffect(() => {
    const updatedProjects = project?.projectList?.map((project) => ({
      ...project,
      checked: true,
    }));
    setColumnList(updatedProjects);
  }, []);

  const [filtersPage, setfiltersPage] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
  });

  const {
    agentTotal_records,
    fetchStatus,
    totalAgent,
    total_items,
    assignedAgentDetailDashboard,
  } = useSelector((store: ClientRootState) => store.client);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isShowProject, setIsShowProject] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const token = getToken();

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowProject(false);
  };

  const capitalizeFirstLetter = (string: string) => {
    if (typeof string === "string" && string?.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  };

  const checkPageNum = (e: any, pageNumber: number) => {
    setfiltersPage((prevFilters) => {
      if (pageNumber !== prevFilters?.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  const onLimitChange = (limit) => {
    setfiltersPage((prev) => {
      return { ...prev, start: 0, limit };
    });
  };

  const checkHandler = (key: string) => {
    setIsChecked((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const storedColumnList = getcolumnListDetails();
  useEffect(() => {
    setColumnList(projectList);
  }, [projectList]);

  useEffect(() => {
    // Fetch columnList from localStorage on component mount
    if (storedColumnList?.length == projectList?.length) {
      setColumnList(storedColumnList);
    } else {
      if (projectList?.length > 0) {
        let localData = localStorage.getItem("columnList");
        const activeUserColumnData = localData ? JSON.parse(localData) : null;
        const prevData = activeUserColumnData ? activeUserColumnData : null;

        // Compare projectList and storedList and update checked values
        const updatedProjectList = projectList.map((project) => {
          const storedProject =
            storedColumnList.length > 0 &&
            storedColumnList?.find((stored) => stored.id == project.id);
          return {
            ...project,
            checked: storedProject ? storedProject.checked : true, // Set checked from storedList or default to true
          };
        });

        // Set initial column list based on updated project list
        let initialColumnList = updatedProjectList.map((project) => ({
          id: project.id,
          name: project.name,
          checked: project.checked,
        }));

        setColumnList(initialColumnList);

        // Save to localStorage with additional user and client data if available
        initialColumnList = {
          ...prevData,
          [userDetails.uuid]: initialColumnList,
        };
        if (clientId) {
          initialColumnList = {
            ...initialColumnList,
            [clientId]: initialColumnList,
          };
        }
        localStorage.setItem("columnList", JSON.stringify(initialColumnList));
      }
    }
  }, [projectList]);

  const handleSelectProject = (event, item) => {
    const isChecked = event ? event.target.checked : !item.checked;

    const projectIndex = columnList?.findIndex(
      (project) => project.id === item.id
    );

    let updatedProjects;

    if (projectIndex !== -1) {
      updatedProjects = [...columnList];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        checked: isChecked,
      };
    } else {
      updatedProjects = [
        ...columnList,
        { id: item.id, name: item.name, checked: isChecked },
      ];
    }

    // Update the columnList state
    setColumnList(updatedProjects);

    // Update local storage
    let columnListLocal = localStorage.getItem("columnList");

    const activeUserColumnData = columnListLocal
      ? JSON.parse(columnListLocal)
      : null;
    const prevData = activeUserColumnData ? activeUserColumnData : null;
    const updatedProjectsStorage = {
      ...prevData,
      [userDetails.uuid]: updatedProjects,
    };
    localStorage.setItem("columnList", JSON.stringify(updatedProjectsStorage));

    // Logic to update isShowProject state
    const anyChecked = updatedProjects.some((project) => project.checked); // Check if any item is checked
    const allUnchecked = updatedProjects?.every((project) => !project.checked); // Check if all are unchecked
    localStorage.setItem("option", item?.name);

    // Set isShowProject based on checked state
    setIsShowProject(!allUnchecked);

    // If any project is checked, find the first checked project's name and set it as the selectedValue
    if (anyChecked) {
      const selectedProject = updatedProjects.find(
        (project) => project.checked
      );

      const selectedValue = selectedProject ? selectedProject.name : "";
      setSelectedValue(selectedValue);
      const payload: any = {
        start: 0,
        limit: 10,
        search: "",
        project_id: selectedProject.id,
        task_start: 0,
        task_limit: 20,
        project_column_id: 0,
        is_view: null,
        is_filter_save: 0,
        is_filter: 0,
        group: {
          key: null,
          order: 0,
        },
        sort: [],
        filter: [],
        type: 1,
      };
      dispatch(projectColumnList({ payload }));
    } else {
      setSelectedValue("");
    }
  };

  useEffect(() => {
    if (isChecked?.agents) {
      dispatch(
        GetAssignAgentsDashboardInfo({
          ...filtersPage,
          client_id: client_id?.id,
          is_user: 0,
        })
      );
    }
    window.scrollTo(0, 0);
  }, [
    filtersPage.limit,
    filtersPage.client_id,
    filtersPage.search,
    filtersPage.start,
    isChecked?.agents,
  ]);
  const checkedItems = columnList?.filter((item) => item.checked);
  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = true,
    drag = true,
    search = null,
    applyopMain = "",
    filter = null,
    groupkey = null,
    order = 0,
    sort = [],
    condition = [],
  }) => {
    const payload: any = {
      start: 0,
      limit: -1,
      search: search,
      project_id: checkedItems[0]?.id as string,
      task_start: task_start,
      task_limit: 20,
      project_column_id: columnid,
      is_filter: 0,
      group: {
        key: null,
        order: 0,
      },
      sort: [],
      filter: [],
      is_view: 0,
      is_filter_save: 0,
      type: 1,
    };
    try {
      await dispatch(projectColumnList({ payload, loader, drag }));
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isChecked?.activity) {
      dispatch(GetRecentActivityData());
    }
  }, [isChecked?.activity]);
  useEffect(() => {
    if (isChecked?.agenda) {
      dispatch(
        api({
          start: 0,
          limit: -1,
          search: "",
        })
      );
    }
  }, [isChecked?.agenda]);

  useEffect(() => {
    if (userDetails?.projects?.length > storedColumnList?.length) {
      setColumnList((prevColumnList) => {
        const newProjects = userDetails?.projects?.filter(
          (project) =>
            !prevColumnList?.some((column) => column.id === project.id)
        );
        if (newProjects?.length > 0) {
          let updatedColumnList: any = [
            ...prevColumnList,
            ...newProjects.map((project) => ({
              id: project.id,
              name: project.name,
              checked: true,
            })),
          ];
          const stateList = updatedColumnList;
          let columnListLocal = localStorage.getItem("columnList");
          const activeUserColumnData = columnListLocal
            ? JSON.parse(columnListLocal)
            : null;
          const prevData = activeUserColumnData ? activeUserColumnData : null;
          updatedColumnList = {
            ...prevData,
            [userDetails.uuid]: updatedColumnList,
          };
          localStorage.setItem("columnList", JSON.stringify(updatedColumnList));

          return stateList;
        }
        return prevColumnList;
      });
    }
  }, [userDetails?.projects]);

  useEffect(() => {
    const columnListLocal = localStorage.getItem("columnList");

    if (columnListLocal) {
      const activeUserColumnData = JSON.parse(columnListLocal);
      const userColumnList = activeUserColumnData
        ? activeUserColumnData[userDetails.uuid]
        : [];

      const allUnchecked =
        userColumnList &&
        Array.isArray(userColumnList) &&
        userColumnList?.every((project) => !project.checked);
      setIsShowProject(!allUnchecked);
    }
  }, []);

  useEffect(() => {
    setUserDetailUpdate(userId);
  }, []);

  const fetchDataREfresh = async () => {
    try {
      const payload = {
        token,
      };
      //@ts-ignore
      const res = await dispatch(RefreshToken(payload));
      await dispatch(setInitialState(res?.payload?.data?.data?.user));
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataREfresh();
  }, []);

  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (columnList?.length > 0) {
      setHasTriggered(false);
    }
  }, [columnList?.length]);

  useEffect(() => {
    if (!hasTriggered && columnList?.length > 0 && isChecked?.agenda) {
      listData({}); // Your API call or logic
      setHasTriggered(true); // Ensure it runs only once
    }
  }, [columnList, hasTriggered, isChecked?.agenda]);

  // useMemo(() => {
  //   if (columnList.length > 0 && isChecked?.agenda) {
  //     listData({});
  //   }
  // }, [columnList]);

  // Get the URL search parameters
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

  const [isLoadingNew, setIsLoadingNew] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingNew(true);
    }, 1000);
    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {userDetailUpdate?.is_signed == 0 ? (
        <VerificationPage />
      ) : userDetailUpdate?.projects == false ||
        userDetailUpdate?.projects?.length == 0 ? (
        <SignDocuement />
      ) : null}

      {userDetailUpdate?.is_signed == 1 &&
      (userDetailUpdate?.projects == true ||
        userDetailUpdate?.projects?.length > 0) ? (
        <div>
          <div className="relative flex items-center justify-between py-10 px-28 ">
            <Typography className="text-[18px] py-28 font-bold sm:text-[30px]  ">
              Welcome On Dashboard !
            </Typography>
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
              <DropdownMenu
                button={
                  <div
                    className="relative flex items-center"
                    onClick={handleButtonClick}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="h-[40px] sm:text-[16px] flex gap-8 sm:mb-[1rem] leading-none"
                      aria-label="Manage Sections"
                      size="large"
                      endIcon={
                        anchorEl ? (
                          <UpArrowIcon />
                        ) : (
                          <DownArrowIcon className="cursor-pointer" />
                        )
                      }
                    >
                      Manage Sections
                    </Button>
                  </div>
                }
                anchorEl={anchorEl}
                handleClose={handleClose}
              >
                <div className="w-[375px] ">
                  <MenuItem>
                    <label
                      htmlFor="agents"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => {
                          e.stopPropagation();
                          checkHandler("agents");
                        }}
                        checked={isChecked?.agents}
                        id="agents"
                        className="hover:bg-transparent"
                      />
                      Agents logged-in
                    </label>
                  </MenuItem>
                  <MenuItem>
                    <label
                      htmlFor="activity"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => {
                          e.stopPropagation();
                          checkHandler("activity");
                        }}
                        className="hover:bg-transparent"
                        checked={isChecked?.activity}
                        id="activity"
                      />
                      Recent activity
                    </label>
                  </MenuItem>
                  <MenuItem>
                    <label
                      htmlFor="agenda"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <Checkbox
                        onChange={(e) => {
                          e.stopPropagation();
                          checkHandler("agenda");
                        }}
                        checked={isChecked?.agenda}
                        className="hover:bg-transparent"
                        id="agenda"
                      />
                      Agenda
                    </label>
                  </MenuItem>
                  <div className="relative flex flex-col items-start justify-start ">
                    <Button
                      variant="text"
                      className="h-[40px] text-[16px] flex gap-8 mb-[1rem] w-full rounded-none justify-start px-24 "
                      aria-label="Add Tasks"
                      size="large"
                      onClick={() => setShowProject(!showProject)}
                    >
                      {showProject ? (
                        <UpArrowBlank className="cursor-pointer fill-none" />
                      ) : (
                        <DownArrowBlank className="cursor-pointer fill-none" />
                      )}
                      Project Summary
                    </Button>
                    {showProject && (
                      <div className="w-[375px]  rounded-none shadow-none py-10 max-h-[200px] overflow-y-auto">
                        {columnList?.length > 0 &&
                          columnList?.map((item, index) => {
                            return (
                              <MenuItem
                                className="px-"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleSelectProject(null, item);
                                }}
                                key={item.id}
                              >
                                <label
                                  htmlFor={`project-${item.id}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    // width: '100%'
                                  }}
                                >
                                  <Checkbox
                                    id={`project-${item.id}`}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                    }}
                                    checked={columnList[index]?.checked}
                                    className="hover:bg-transparent"
                                  />
                                  {item?.name?.length > 20 ? ( // Replace 20 with the desired length threshold
                                    <Tooltip
                                      title={capitalizeFirstLetter(item.name)}
                                      arrow
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="w-5/6 overflow-hidden truncate">
                                        {capitalizeFirstLetter(item.name)}
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <span
                                      className="w-3/4 overflow-hidden truncate "
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {capitalizeFirstLetter(item.name)}
                                    </span>
                                  )}
                                </label>
                              </MenuItem>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenu>
            </Box>
          </div>
          {isChecked?.agents && (
            <div className="px-[15px] mb-[1rem] ">
              <div className="bg-white rounded-lg ">
                <div className="flex sm:items-center justify-between px-24 py-16 sm:flex-row flex-col">
                  <Typography className="sm:text-[16px]   text-[13px] font-600">
                    Agents Listing
                  </Typography>

                  <div className="flex items-center sm:justify-center sm:mr-20 sm:gap-32 ">
                    <Typography className="sm:text-[16px] text-[13px] font-500">
                      No. of Agents Logged in
                    </Typography>
                    <span className="text-[#4F46E5] p-10 rounded-md bg-[#F6F6F6] font-600">
                      {" "}
                      {totalAgent}
                    </span>
                  </div>
                </div>

                <CommonTable
                  headings={["Name", "Agent ID", "Start Date", "Last Login"]}
                >
                  {assignedAgentDetailDashboard?.length === 0 &&
                  fetchStatus !== "loading" ? (
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
                  ) : fetchStatus === "loading" ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <ListLoading />{" "}
                        {/* Render your loader component here */}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {assignedAgentDetailDashboard?.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "& td": {
                              borderBottom: "1px solid #EDF2F6",
                              paddingTop: "12px",
                              paddingBottom: "12px",
                              // color: theme?.palette?.primary.main,
                              color: " #111827",
                              fontSize: "14px",
                              fontWeight: 500,
                            },
                          }}
                        >
                          <TableCell
                            scope="row"
                            className="flex items-center gap-8 font-500 whitespace-nowrap"
                          >
                            <img
                              className="h-40 w-40 rounded-full"
                              src={
                                row.user_image
                                  ? urlForImage + row.user_image
                                  : "../assets/images/logo/images.jpeg"
                              }
                            ></img>
                            <span>{row.first_name + " " + row.last_name}</span>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="whitespace-nowrap"
                          >
                            {row.agent_id}
                          </TableCell>

                          <TableCell
                            align="center"
                            className="whitespace-nowrap"
                          >
                            {row.created_at
                              ? moment(row.created_at).format("MMMM Do, YYYY")
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="whitespace-nowrap"
                          >
                            {row.last_login
                              ? moment(row.last_login).format("MMMM Do, YYYY")
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </CommonTable>
                <div
                  className={`flex ${userDetails?.role_id == 1 ? "justify-between" : "justify-end"}  py-14 px-[3rem]`}
                >
                  {userDetails?.role_id == 1 && (
                    <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Agents: ${total_items}`}</Typography>
                  )}
                  {assignedAgentDetailDashboard?.length > 0 &&
                    fetchStatus !== "loading" && (
                      <CommonPagination
                        total={total_items}
                        limit={filtersPage.limit}
                        setLimit={onLimitChange}
                        count={agentTotal_records}
                        onChange={(e, PageNumber: number) =>
                          checkPageNum(e, PageNumber)
                        }
                        responsive={true}
                        page={filtersPage.start + 1}
                      />
                    )}
                </div>
              </div>
            </div>
          )}
          {isChecked?.activity && <DashboardRecentActivity />}
          {isChecked?.agenda && (
            <DashboaredAgenda
              showAgenda={isChecked}
              columnList={columnList}
              capitalizeFirstLetter={capitalizeFirstLetter}
              isShowProject={isShowProject}
              setIsShowProject={setIsShowProject}
              setSelectedValue={setSelectedValue}
              selectedValue={selectedValue}
            />
          )}
        </div>
      ) : userDetailUpdate?.is_signed != 1 &&
        userDetailUpdate?.is_signed != 0 &&
        isLoadingNew ? (
        <Error401Page />
      ) : null}
    </>
  );
}
