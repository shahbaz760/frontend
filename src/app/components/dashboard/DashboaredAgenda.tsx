import {
  Button,
  Checkbox,
  Grid,
  Menu,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";

import ListLoading from "@fuse/core/ListLoading";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { RefreshToken } from "app/store/Auth";
import { GetAgendaData } from "app/store/Client";
import { ClientRootState, filterType } from "app/store/Client/Interface";
import {
  CheckedTask,
  OnScrollprojectColumnList,
  projectColumnList,
  projectTaskTableList,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { addDays, format, subDays } from "date-fns";
import { debounce } from "lodash";
import { transparent } from "material-ui/styles/colors";
import moment from "moment";
import { NoDataFoundDash } from "public/assets/icons/common";
import {
  DownArrowIcon,
  LeftIcon,
  RightIcon,
  UpArrowIcon,
} from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DropdownMenu from "src/app/components/Dropdown";
import CommonTable from "src/app/components/commonTable";
import { getClientId, getToken, getUserDetail } from "src/utils";

function a11yProps(index: number) {
  return {
    className:
      "px-4 py-6 min-w-0 min-h-0 text-[1.8rem] font-400 text-[#757982]",
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  columnList: object[];
  scrollRef: any;
  showAgenda?: boolean;
  capitalizeFirstLetter?: () => void;
}

function CustomTabPanel(props: TabPanelProps) {
  const {
    children,
    value,
    index,
    scrollRef,
    showAgenda,
    capitalizeFirstLetter,
    ...other
  } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}
const shouldShowTooltip = (text) => text?.length > 20;

const DashboaredAgenda = ({
  columnList,
  showAgenda,
  setIsShowProject,
  isShowProject,
  capitalizeFirstLetter,
  setSelectedValue,
  selectedValue,
}) => {

  const navigate = useNavigate();
  const theme: Theme = useTheme();
  const userDetails = getUserDetail();

  const [selectedTab, setSelectedTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [columnId, setcolumnId] = useState();
  const dispatch = useAppDispatch();
  const [projectId, setProjectId] = useState("");
  const [tabLoader, setTabLoader] = useState(false);
  // const [selectedValue, setSelectedValue] = useState<string | null>("");
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
    date: moment(currentDate).format("YYYY-MM-DD"),
  });
  const { projectInfo, fetchStatusNews, clientDashBoaredTask, projectList } =
    useSelector((store: ProjectRootState) => store?.project);

  useEffect(() => {
    // Check if columnId is valid and projectInfo.list has elements
    if (projectInfo?.list?.length > 0) {
      const selectedColumn =
        projectInfo.list.find((column) => column.id == columnId) ||
        projectInfo.list[0];
      handleChange(null, projectInfo.list.indexOf(selectedColumn));
      setTimeout(() => {
        const firstTab = document.getElementById("tab-" + selectedColumn.id);
        if (firstTab) {
          firstTab.click();
        }
      }, 500);
    }
  }, [projectInfo]);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number
  ) => {
    setSelectedTab(newValue);
    setPage(0);
    setTaskData([]); // Clear task data before loading new data
    const selectedProjectColumn = projectInfo?.list[newValue];
    if (selectedProjectColumn) {
      setProjectId(
        selectedProjectColumn.project_id ||
        selectedProjectColumn?.tasks[0]?.project_id
      ); // Update project ID state
      listData(
        selectedProjectColumn.project_id ||
        selectedProjectColumn?.tasks[0]?.project_id,
        selectedProjectColumn.id
      );
    }
  };
  useEffect(() => {
    const storedName = localStorage.getItem("option") || "";
    setSelectedValue(storedName);
  }, []);
  useEffect(() => {
    setIsShowProject(true);
  }, []);
  const [isChecked, setIscheked] = useState<boolean>(true);
  const scrollRef = useRef(null);
  // const [currentDate, setCurrentDate] = useState(new Date());
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [taskData, setTaskData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const capitalizedValue = capitalizeFirstLetter(selectedValue);
  const [isDefault, setIsDefault] = useState();
  const [page, setPage] = useState(0);
  const { dashBoardAgenda, fetchAgendaData } = useSelector(
    (store: ClientRootState) => store.client
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [disable, setDisabled] = useState(false);
  const [id, setId] = useState<number>(0);
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const previousId = useMemo(() => localStorage.getItem("id"), [selectedValue]);

  const handleMenuItemClick = (id: number, name: string) => {
    if (previousId && parseInt(previousId) === id) {
      setAnchorEl(null);
      return;
    }

    const payload: any = {
      start: 0,
      limit: 10,
      search: "",
      project_id: id,
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
    // if (!columnId) return "";
    dispatch(projectColumnList({ payload }));
    // localStorage.setItem("option", name);

    localStorage.setItem("id", id.toString());
    setSelectedValue(name);

    setAnchorEl(null);
  };
  useEffect(() => {
    if (columnList?.length > 0) {
      const firstCheckedItem = columnList.find((item) => item?.checked);
      if (firstCheckedItem) {
        localStorage.setItem("option", firstCheckedItem.name);
        setSelectedValue(firstCheckedItem.name);
      }
    }
  }, [columnList]);

  const listData = async (
    projectId,
    columnId,
    task_start = 0,
    loader = true
  ) => {
    // if (!projectId || !columnId) {
    //   return;
    // }
    setTabLoader(true);
    const start = task_start;
    const limit = 20;

    const payload = {
      start: 0,
      limit: -1,
      search: "",
      project_id: projectId,
      task_start: start,
      task_limit: limit,
      project_column_id: columnId,
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

    try {
      const res = await dispatch(projectTaskTableList({ payload, loader }));
      if (res.payload?.data?.data?.list?.length > 0) {
        const newListData = res.payload.data.data.list[0]?.tasks || [];
        setTaskData((prevTaskData) =>
          task_start ? [...prevTaskData, ...newListData] : newListData
        );
        setIsDefault(res.payload.data.data.list[0]?.defalut_name);
      }
      setTabLoader(false);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setTabLoader(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  const handleScroll = useCallback(
    debounce(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        const hasMoreData = taskData?.length > 20; // Check if there's more data to fetch
        const totalRecordsFetched = taskData?.length;
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          !isFetching &&
          hasMoreData &&
          scrollTop > lastScrollTop
        ) {
          setIsFetching(true);
          listData(projectId, columnId, page + 1, false).finally(() => {
            setPage(page + 1);
            setIsFetching(false);
          });
        }
        setLastScrollTop(scrollTop);
      }
    }, 300),
    [isFetching, taskData, page, projectId, columnId]
  );

  // Effect to attach scroll event listener when component mounts

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
  const handlePreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  const minDate = new Date();
  useEffect(() => {
    dispatch(
      GetAgendaData({
        ...filters,
        date: moment(currentDate).format("YYYY-MM-DD"),
      })
    );
  }, [currentDate, filters.start, filters.limit, filters.search]);

  const handleCompleteTask = (id) => {
    if (id && !disable) {

      // Disable the checkbox first
      setDisabled(true);
      // Call your API to mark the task as completed
      dispatch(CheckedTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            // Assuming projectId and columnId are defined somewhere
            listData(projectId, columnId);
            dispatch(
              GetAgendaData({
                ...filters,
                date: moment(currentDate).format("YYYY-MM-DD"),
              })
            );
            toast.success(res?.data?.message, {
              duration: 4000,
            });
          }
        })
        .finally(() => {
          // After the API call completes (success or failure), re-enable the checkbox
          setDisabled(false);
        });
    }
  };

  // useEffect(() => {
  //   if (projectInfo?.list?.length > 0) {
  //     listData(projectInfo?.list[0]?.column_ids, projectInfo?.list[selectedTab]?.project_id);
  //     setcolumnId(projectInfo?.list[selectedTab]?.id);
  //   }
  // }, [projectInfo?.list, selectedTab]);

  const handleCheckedItem = (id) => {
    if (id && !disable) {
      setDisabled(true);
      dispatch(CheckedTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === 1) {
            dispatch(
              GetAgendaData({
                ...filters,
                date: moment(currentDate).format("YYYY-MM-DD"),
              })
            );
            listData(projectId, columnId);
            toast.success(res?.data?.message, {
              duration: 4000,
            });
          } else {
            toast.error("An error occurred");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("An error occurred");
        })
        .finally(() => {
          setDisabled(false);
        });
    }
  };
  const token = getToken();
  const RefreshTokenApi = async () => {
    const payload = {
      token,
    };
    try {
      //@ts-ignore
      const res = await dispatch(RefreshToken(payload));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    RefreshTokenApi();
  }, []);

  const anyChecked = columnList.some(item => item.checked);
  return (
    <Grid container spacing={3} className="px-[15px] mb-[1rem]">
      <Grid item xs={12} lg={(isShowProject && anyChecked) ? 6 : 12}>
        {showAgenda?.agenda && (
          <div className="shadow-sm rounded-lg bg-white h-[450px]">
            <div className="flex sm:items-center justify-between sm:pr-20 sm:flex-row flex-col items-start gap-11">
              <div className="flex items-center pb-10 justify-between w-full py-28 sm:py-0 pr-[10px] sm:flex-col sm:items-start ">
                <Typography className="text-[16px] font-600 sm:pt-16 px-20 sm:pb-10 ">
                  Agenda
                </Typography>
                <div className="flex items-center sm:gap-8 sm:pb-20">
                  <DatePicker
                    sx={{
                      " & .MuiInputBase-input": {
                        display: "none",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        display: "none",
                      },
                    }}
                    minDate={minDate}
                    onChange={handleDateChange}
                  />

                  <div className="sm:text-[16px] text-[#757982]">
                    {format(currentDate, "MMM d yyyy")}
                  </div>
                  <div className="flex gap-3 ">
                    <div
                      style={{
                        cursor:
                          currentDate <= minDate ? "not-allowed" : "pointer",
                        color: currentDate <= minDate ? "grey" : "inherit",
                      }}
                    >
                      <LeftIcon
                        onClick={
                          currentDate > minDate ? handlePreviousDay : null
                        }
                        style={{
                          pointerEvents:
                            currentDate <= minDate ? "none" : "auto",
                          opacity: currentDate <= minDate ? 0.5 : 1,
                        }}
                      />
                    </div>
                    <span> </span>
                    <span style={{ cursor: "pointer" }}>
                      <RightIcon onClick={handleNextDay} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="max-h-[310px] overflow-y-auto w-full"
            >
              <CommonTable headings={["Tasks"]} isCustomHeight={false}>
                {dashBoardAgenda?.length === 0 && fetchAgendaData == false && (
                  // &&
                  // agentState.status != "loading"
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
                        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[200px] max-h-[214px] py-10"
                        style={{ alignItems: "center" }}
                      >
                        <NoDataFoundDash />
                        <Typography className="text-[24px] text-center font-600 leading-normal">
                          No Task Yet !
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}{" "}
                {fetchAgendaData === true ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <ListLoading /> {/* Render your loader component here */}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {dashBoardAgenda?.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "& td": {
                            borderBottom: "1px solid #EDF2F6",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            color: theme.palette.primary.main,
                            textAlign: "center",
                            "@media (max-width: 600px)": {
                              // Adjust screen width as needed for small screens
                              textAlign: "left",
                            },
                          },
                        }}
                      >
                        <TableCell
                          scope="row"
                          className="flex items-center gap-8"
                        >
                          <span>
                            <Checkbox
                              onClick={() => handleCheckedItem(row.id)}
                              disabled={disable}
                              className="hover:!bg-transparent"
                            />
                          </span>

                          <span
                            // onClick={() => {
                            //   const clientId = getClientId();
                            //   navigate(
                            //     `/${projectId}/tasks/detail/${row.id}${clientId ? `?ci=${clientId}` : ""}`
                            //   );
                            // }}
                            className="text-left cursor-pointer"
                          >
                            {row.title}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span></span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </CommonTable>
            </div>
          </div>
        )}
      </Grid>
      {isShowProject && anyChecked && (
        <Grid item xs={12} lg={showAgenda?.agenda ? 6 : 12} sm={12}>
          <div className="shadow-sm bg-white rounded-lg h-[450px]">
            <div className="basis-full lg:basis-auto lg:grow">
              <div className=" flex  sm:items-center justify-between px-20 border-0 border-none flex-col  sm:flex-row ">
                <Tabs
                  value={selectedTab}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className="min-h-0 pb-14 pt-20  sm:px-20  border-none bg-none w-3/4 text-[18px] text-[#333333]"
                  sx={{
                    "& .MuiTabs-flexContainer": {
                      overflowX: "scroll",
                      gap: "50px", // Default gap for large screens
                      // "@media (max-width: 425px)": {
                      //   gap: "6px", // Change gap to 6px on small screens
                      // },
                    },
                    "& .MuiTab-root": {
                      borderBottomWidth: "2px",
                      borderBottom: "solid",
                      borderBottomColor: transparent,
                      color: "#333333",
                      fontSize: "16px",
                    },
                    "& .MuiTab-root.Mui-selected": {
                      color: theme.palette.secondary.main,
                      borderBottomWidth: "2px",
                      borderBottomColor: theme.palette.secondary.main,
                      borderBottom: "solid",
                      fontSize: "16px",
                    },
                    "& .MuiTabs-indicator": {
                      visibility: "hidden",
                      display: "none",
                      backgroundColor: theme.palette.secondary.main,
                    },
                  }}
                >
                  {projectInfo?.list?.map((row, index: number) => {
                    return (
                      <Tab
                        key={row.id}
                        label={row.name}
                        {...a11yProps(row.id)}
                        id={"tab-" + row.id}
                        onClick={() => {
                          setcolumnId(row.id);
                        }}
                      />
                    );
                  })}
                </Tabs>

                <div className=" mr-[6px] text-right flex justify-end items-center drop-down-ui">
                  <DropdownMenu
                    button={
                      <div className="flex items-start">
                        <Button onClick={handleButtonClick}>
                          {shouldShowTooltip(capitalizedValue) ? (
                            <Tooltip title={capitalizedValue} arrow>
                              <span className="truncate w-[100px]">
                                {capitalizedValue}
                              </span>
                            </Tooltip>
                          ) : (
                            <span className="truncate">{capitalizedValue}</span>
                          )}
                          {anchorEl ? (
                            <UpArrowIcon />
                          ) : (
                            <DownArrowIcon className="cursor-pointer" />
                          )}
                        </Button>
                      </div>
                    }
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                  >
                    <Menu
                      style={{ left: "-20px" }}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      keepMounted
                      onClose={handleClose}
                      MenuListProps={{
                        sx: {
                          maxHeight: "200px", // Example: Set max height of the menu container
                          width: 200,
                        },
                      }}
                    >
                      {columnList?.length > 0 &&
                        columnList
                          ?.filter((item) => item?.checked)
                          .map((item) => {
                            const itemName = capitalizeFirstLetter(item.name);
                            const shouldShowTooltip = itemName?.length > 20; // Set your desired length here

                            return (
                              <MenuItem
                                key={item.id}
                                onClick={() =>
                                  handleMenuItemClick(item.id, item.name)
                                }
                              >
                                {shouldShowTooltip ? (
                                  <Tooltip title={itemName} arrow>
                                    <span className="w-3/4 overflow-hidden truncate">
                                      {itemName}
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <span className="w-3/4 overflow-hidden truncate">
                                    {itemName}
                                  </span>
                                )}
                              </MenuItem>
                            );
                          })}
                    </Menu>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="max-h-[350px] overflow-y-auto w-full"
            >
              <CommonTable headings={[]} isCustomHeight={false}>
                {taskData?.length === 0 && !tabLoader ? (
                  <TableRow
                    style={{}}
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
                        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[290px] py-40"
                        style={{ alignItems: "center" }}
                      >
                        <NoDataFoundDash />
                        <Typography className="text-[24px] text-center font-600 leading-normal">
                          No Task Yet !
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {fetchStatusNews ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <ListLoading />{" "}
                          {/* Replace 'ListLoading' with your loader component */}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {taskData?.map((row, id) => {
                          const dueDateTime = row?.due_date_time
                            ? moment.utc(row?.due_date_time)
                            : null;
                          const isDateBeforeToday = dueDateTime
                            ? dueDateTime.isBefore(moment())
                            : false;
                          const formattedDateTime = dueDateTime
                            ? dueDateTime.format("MMM Do")
                            : "N/A";
                          // const dueDateTime = moment(row.due_date_time);

                          return (
                            <TableRow
                              key={row.id}
                              sx={{
                                "& td": {
                                  width: "100%",
                                  borderBottom: "1px solid #EDF2F6",
                                  paddingTop: "12px",
                                  paddingBottom: "12px",
                                  color: theme.palette.primary.main,
                                  textAlign: "center",
                                  "@media (max-width: 600px)": {
                                    textAlign: "left",
                                  },
                                },
                              }}
                            >
                              <TableCell
                                scope="row"
                                className="flex items-center w-full justify-between gap-8"
                              >
                                <div className="flex items-center justify-start w-2/3">
                                  <>
                                    {isDefault === "Completed" ? (
                                      <>
                                        <Checkbox
                                          className="hover:!bg-transparent"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                          checked={true} // Set checked to true when isDefault is "Completed"
                                        />
                                        <div
                                          style={{
                                            wordWrap: "break-word",
                                            textAlign: "start",
                                          }}
                                          onClick={() => {
                                            const clientId = getClientId();
                                            // navigate(
                                            //   `/${projectId}/tasks/detail/${row.id}${clientId ? `?ci=${clientId}` : ""}`
                                            // );
                                          }}
                                        >
                                          {row.title}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <Checkbox
                                            className="hover:!bg-transparent"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCompleteTask(row.id);
                                            }}
                                            disabled={disable}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            wordWrap: "break-word",
                                            textAlign: "start",
                                          }}
                                          onClick={() => {
                                            const clientId = getClientId();
                                            // navigate(
                                            //   `/${projectId}/tasks/detail/${row.id}${clientId ? `?ci=${clientId}` : ""}`
                                            // );
                                          }}
                                        >
                                          {row.title}
                                        </div>
                                      </>
                                    )}
                                  </>
                                </div>
                                <Typography
                                  sx={{
                                    color: isDateBeforeToday
                                      ? "red"
                                      : "inherit",
                                  }}
                                >
                                  {dueDateTime ? (
                                    isDateBeforeToday ? (
                                      <Tooltip
                                        title={
                                          <span style={{ fontSize: 12 }}>
                                            This task is overdue
                                          </span>
                                        }
                                        enterDelay={500}
                                        componentsProps={{
                                          tooltip: {
                                            sx: {
                                              bgcolor: "common.white",
                                              color: "common.black",
                                              padding: 1,
                                              borderRadius: 10,
                                              boxShadow: 3,
                                              "& .MuiTooltip-arrow": {
                                                color: "common.white",
                                              },
                                            },
                                          },
                                        }}
                                      >
                                        <div>{formattedDateTime}</div>
                                      </Tooltip>
                                    ) : (
                                      <span
                                        style={{
                                          color: isDateBeforeToday
                                            ? "red"
                                            : "inherit",
                                        }}
                                      >
                                        {formattedDateTime}
                                      </span>
                                    )
                                  ) : (
                                    "N/A"
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </CommonTable>
            </div>
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default DashboaredAgenda;
