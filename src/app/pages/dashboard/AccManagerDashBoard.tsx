import {
  InputAdornment,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { DateCalendar } from "@mui/x-date-pickers";
import { useAppDispatch } from "app/store/store";
import {
  ArrowRightCircleIcon,
  CrossGreyIcon,
  NoTaskFound,
} from "public/assets/icons/common";
import { GetUserDashboardData } from "app/store/Projects";
import { debounce } from "lodash";
import { SearchFilterIcon } from "public/assets/icons/topBarIcons";
import moment from "moment";
import { filterType } from "app/store/Projects/Interface";
import ListLoading from "@fuse/core/ListLoading";
import { useNotificationContext } from "src/app/notificationContext/NotificationProvider";
import AddTaskInline from "src/app/components/tasks/AddTaskInline";

function a11yProps(index: number) {
  return {
    className:
      "px-4 py-6 min-w-0 min-h-0 text-[1.8rem] font-400 text-[#757982]",
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
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
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};
export default function AccManagerDashboard() {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loadingTable, setLoadingTable] = useState<boolean>(true);
  const [loadingCalendar, setLoadingCalender] = useState<boolean>(true);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const [tableRecords, setTableRecords] = useState([]);
  const [totalRecordsTable, setTotalRecordsTable] = useState(0);
  const [calendarRecords, setCalendarRecords] = useState([]);
  const [totalRecordsCalendar, setTotalRecordsCalendar] = useState(0);
  const [id, setId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const limit = 20;
  const [filters, setfilters] = useState<filterType & { type: number }>({
    start: 0,
    limit,
    search: "",
    type: 0,
  });
  const scrollRef = useRef(null);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [calendarFilters, setCalendarFilters] = useState({
    start: 0,
    limit: 10,
    date: new Date(),
    search: "",
  });

  const { getUnreadCount } = useNotificationContext();

  useEffect(() => {
    getUnreadCount();
  }, []);

  useEffect(() => {
    getDashboardTaskList(filters.search);
  }, [filters.start, filters.type]);

  useEffect(() => {
    getCalendarTaskList();
  }, [calendarFilters.start, calendarFilters.date]);

  const getDashboardTaskList = async (search) => {
    setLoadingTable(true);
    setTotalRecordsTable(0);

    const res = await dispatch(GetUserDashboardData({ ...filters, search }));
    if (res?.payload?.data?.data) {
      setTableRecords(res?.payload?.data?.data?.list || []);
      setTotalRecordsTable(res?.payload?.data?.data?.total_records || 0);
    }
    setLoadingTable(false);
  };

  const getCalendarTaskList = async () => {
    const res = await dispatch(
      GetUserDashboardData({
        ...calendarFilters,
        date: moment(calendarFilters.date).format("YYYY-MM-DD"),
      })
    );
    if (res?.payload?.data?.data) {
      const newList =
        calendarFilters.start === 0
          ? res?.payload?.data?.data?.list || []
          : [...calendarRecords, ...res?.payload?.data?.data?.list];
      setCalendarRecords(newList);
      setTotalRecordsCalendar(res?.payload?.data?.data?.total_records || 0);
    }
    setLoadingCalender(false);
  };

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      await getDashboardTaskList(value);
    }, 800),
    []
  );

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilters((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters;
    });
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: value,
      start: 0,
    }));
    debouncedSearch(value);
  };

  const handleInputClear = async () => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
    }));
    await getDashboardTaskList("");
  };

  const handleDateChange = (date) => {
    setLoadingCalender(true);
    setCalendarFilters((prevFilters) => ({
      ...prevFilters,
      date: new Date(date),
      start: 0,
    }));
  };

  const handleScroll = debounce(async () => {
    if (
      scrollRef.current &&
      !loadingCalendar &&
      !pageLoading &&
      calendarRecords.length < totalRecordsCalendar
    ) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        scrollTop > lastScrollTop
      ) {
        setPageLoading(true);
        setCalendarFilters((prevFilters) => ({
          ...prevFilters,
          start: prevFilters.start + 1,
        }));
      }
      setLastScrollTop(scrollTop);
    }
  }, 300);

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

  return (
    <div>
      <div className="relative flex items-center justify-between py-10 px-28 ">
        <Typography className="text-[18px] py-28 font-bold sm:text-[30px]  ">
          Welcome On Dashboard !
        </Typography>
      </div>
      <div className="px-28 mb-[3rem] ">
        <div className="bg-white rounded-lg ">
          <div className="shadow-md bg-white rounded-lg">
            <div className="relative">
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                aria-label="basic tabs example"
                className="min-h-0 pb-14 pt-20 px-20 "
                sx={{
                  "& .MuiTabs-flexContainer": {
                    gap: "50px",
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: theme.palette.secondary.main,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                  "& .MuiButtonBase-root-MuiPickersDay-root": {
                    color: "#4F46E5",
                  },
                }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab
                  label="Assigned Tasks"
                  {...a11yProps(0)}
                  onClick={() => {
                    setfilters((prevFilters) => ({
                      ...prevFilters,
                      type: 0,
                      start: 0,
                    }));
                  }}
                />
                <Tab
                  label="Upcoming Due Task"
                  {...a11yProps(0)}
                  onClick={() => {
                    setfilters((prevFilters) => ({
                      ...prevFilters,
                      type: 1,
                      start: 0,
                    }));
                  }}
                />
              </Tabs>
              <div className="sm:absolute top-[12px] right-[18px]">
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  defaultValue=""
                  value={filters.search}
                  variant="standard"
                  placeholder="Search Task"
                  onChange={handleSearchChange}
                  className="flex justify-center text-[12px]"
                  sx={{
                    // marginRight: { xs: 10 },
                    height: "45px",
                    pl: "5px",
                    maxWidth: { sm: "286px", xs: "90%" },
                    margin: { xs: "auto", sm: 0 },
                    marginBottom: { xs: "10px", sm: 0 },
                    pr: 2,
                    backgroundColor: "#F6F6F6",
                    borderRadius: "8px",
                    border: "1px solid transparent",
                    "&:focus-within": {
                      border: "1px solid blue",
                    },
                    "& .MuiInputBase-input": {
                      textDecoration: "none",
                      border: "none",
                      fontSize: "12px",
                    },
                    "& .MuiInput-underline:before": {
                      border: "none !important",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottom: "none !important",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#757982",
                      opacity: 1,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        // sx={{
                        //   "& .MuiInputAdornment-root": {
                        //     marginRight: { xs: 0 },
                        //   },
                        // }}
                      >
                        <SearchFilterIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {filters.search !== "" ? (
                          <CrossGreyIcon
                            className="cursor-pointer fill-[#c2cad2] h-[14px]"
                            onClick={handleInputClear}
                          />
                        ) : (
                          <div style={{ width: "15px" }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            {/* </div> */}

            <CommonTable headings={["Title", "Due Date", "Priority", ""]}>
              <>
                {loadingTable ? (
                  <TableRow
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #EDF2F6",
                        paddingTop: "0px",
                        paddingBottom: "0px",
                        // color: theme?.palette?.primary.main,
                        color: "#111827",
                      },
                    }}
                  >
                    <TableCell colSpan={4} align="center">
                      <ListLoading />
                    </TableCell>
                  </TableRow>
                ) : tableRecords && tableRecords.length > 0 ? (
                  tableRecords.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": {
                          borderBottom: "1px solid #EDF2F6",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                          // color: theme?.palette?.primary.main,
                          color: "#111827",
                        },
                      }}
                    >
                      <TableCell
                        scope="row"
                        className="!py-5 whitespace-nowrap"
                      >
                        {" "}
                        <TruncateText text={row.title} maxWidth={500} />
                      </TableCell>

                      <TableCell
                        align="center"
                        className="whitespace-nowrap !py-5"
                      >
                        {row?.due_date_time
                          ? moment(row.due_date_time).format("ll")
                          : "N/A"}
                      </TableCell>

                      <TableCell
                        align="center"
                        className="whitespace-nowrap !py-5"
                      >
                        {!row?.priority ? (
                          "N/A"
                        ) : (
                          <span
                            className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
                            ${
                              row.priority === "Low"
                                ? "text-[#4CAF50] bg-[#4CAF502E]"
                                : row.priority === "Medium"
                                  ? "text-[#FF5F15] bg-[#FF5F152E]"
                                  : "text-[#F44336] bg-[#F443362E]"
                            }`}
                          >
                            {row.priority}
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap !py-5"
                      >
                        <span
                          className="p-2 cursor-pointer"
                          onClick={() => {
                            setIsOpenModal(true);
                            setId(row.id);
                            setProjectId(row.project_id);
                          }}
                        >
                          <ArrowRightCircleIcon />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
                    <TableCell colSpan={4} align="center">
                      <div
                        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[200px] max-h-[214px] py-10"
                        style={{ alignItems: "center" }}
                      >
                        <NoTaskFound />
                        <Typography className="text-[24px] text-center font-600 leading-normal">
                          {filters.search ? "No data found!" : "No Task Yet !"}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            </CommonTable>

            <div className="flex justify-end py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
              <>
                {!loadingTable && (
                  <CommonPagination
                    limit={limit}
                    count={
                      parseInt((totalRecordsTable / limit).toString()) +
                      (totalRecordsTable % limit === 0 ? 0 : 1)
                    }
                    onChange={(e, PageNumber: number) =>
                      checkPageNum(e, PageNumber)
                    }
                    page={filters.start + 1}
                  />
                )}
              </>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:px-28 xs:px-[1.8rem] mb-[3rem] flex justify-between gap-20 ">
        <div className="bg-white rounded-lg flex-1 flex  flex-wrap sm:flex-nowrap">
          <div className="sm:w-3/4">
            <DateCalendar
              sx={{
                paddingLeft: "10px",
                width: { sm: 500, xs: "100%" },
                "& .MuiDayCalendar-header": {
                  margin: "2px 0",
                  display: "flex",
                  justifyContent: "space-around",
                },
                "& .MuiDayCalendar-weekContainer ": {
                  margin: "2px 0",
                  display: "flex",
                  justifyContent: "space-around",
                },
                "& .Mui-selected": {
                  backgroundColor: "#4F46E5 !important",
                },
              }}
              value={calendarFilters.date}
              onChange={handleDateChange}
            />
          </div>
          <div className="border-l-1 border-solid sm:w-1/3 md:w-[100%] px-20 py-10">
            {!loadingCalendar &&
            !(calendarRecords && calendarRecords.length > 0) ? (
              <div
                className="flex flex-col justify-center align-items-center gap-20 min-h-[200px] h-full py-10"
                style={{ alignItems: "center" }}
              >
                <NoTaskFound />
                <Typography className="text-[20px] text-center leading-[24.2px] font-600 text-[#111827]">
                  No Tasks Yet !
                </Typography>
                <Typography className="text-[18px] text-center leading-[21.78px] font-400 text-[#757982]">
                  You currently have no tasks in your list.
                </Typography>
              </div>
            ) : (
              <>
                {" "}
                <Typography className="text-[18px] text-[#111827] font-600 py-10">
                  Tasks
                </Typography>
                <div
                  className="flex flex-col gap-10 max-h-[255px] overflow-y-auto"
                  ref={scrollRef}
                  onScroll={() => handleScroll}
                >
                  {loadingCalendar ? (
                    <ListLoading />
                  ) : (
                    calendarRecords &&
                    calendarRecords.length > 0 &&
                    calendarRecords.map((row, index) => (
                      <div
                        key={`calen-${index}`}
                        className="border-[0.5px] border-solid border-[#9DA0A6] py-5 px-6 bg-[#F6F6F6] flex items-center gap-5 rounded-[2px]"
                      >
                        <div className="h-auto min-h-20 bg-[#4F46E5] w-3 min-w-3 rounded-[2px]"></div>
                        <Typography className="text-[12px] text-[#757982]">
                          {row?.title || "NA"}
                        </Typography>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isOpenModal && (
        <AddTaskInline
          isOpen={isOpenModal}
          project_id={projectId}
          setIsOpen={setIsOpenModal}
          ColumnId={id}
          Edit
          onUpdate={() => {
            setLoadingTable(true);
            getDashboardTaskList(filters.search);
          }}
        />
      )}
    </div>
  );
}
