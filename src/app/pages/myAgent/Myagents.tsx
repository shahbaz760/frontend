import ListLoading from "@fuse/core/ListLoading";
import { Switch, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/styles";
import { GetAssignAgentsInfo } from "app/store/Client";
import { ClientRootState, filterType } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import moment from "moment";
import { NoDataFound } from "public/assets/icons/common";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchInput from "src/app/components/SearchInput";
import TitleBar from "src/app/components/TitleBar";
import AddAgentModel from "src/app/components/agents/AddAgentModel";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getUserDetail } from "src/utils";
import TwoFactorAuth from "./TwoFactor";

const Android12Switch = styled(Switch)(() => ({
  padding: 0,
  height: 29,
  width: 74,
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
      content: '"Yes"',
      left: 10,
      color: "#fff",
      display: "none",
    },
    "&::after": {
      content: '"No"',
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
    width: "24px",
    height: "auto",
    aspectRatio: 1,
    margin: 3,
    backgroundColor: "white",
  },
}));

export default function Myagents() {
  const agentState = useSelector((store: ClientRootState) => store.client);
  const { fetchStatus, getStatus } = useSelector(
    (store: ClientRootState) => store.client
  );
  const dispatch = useAppDispatch();
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);
  const userDetails = getUserDetail();
  const [id, setId] = useState(null);
  const client_id = getUserDetail();
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
    // client_id: 0,
  });
  const theme: Theme = useTheme();
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilters((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };
  // Debounce function to delay executing the search
  const debouncedSearch = debounce((searchValue) => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      search: searchValue,
    }));
  }, 300);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        limit,
        search: inputValue,
        start: 0,
      }));
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 800, limit]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    // debouncedSearch(value);
  };
  const fetchAgentList = useCallback(() => {
    dispatch(GetAssignAgentsInfo({ ...filters, client_id: client_id?.id }));
  }, [filters]);

  useEffect(() => {
    fetchAgentList();
  }, [filters.limit, filters.client_id, filters.search, filters.start]);

  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };
  const [isAuthenticated, setIsAuthenticate] = useState(0);

  const handleAuthSwitch = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    toggle
  ) => {
    const { checked } = e.target;
    setId(id);
    setIsAuthenticate(toggle);
    setIsOpenAuthModal(true);
  };

  // if (agentState?.fetchStatus == "loading") {
  //   return <ListLoading />;
  // }
  const headings = [
    // "ID",
    "First Name",
    "Last Name",
    "Start Date",
    "Last Login",
    (userDetails?.role_id === 2 || userDetails?.role_id === 5) &&
    "Access Assigned Tasks Only",
    // "Status",
    // "",
  ];
  return (
    <>
      <TitleBar title="Agents"></TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-[2rem]">
            <SearchInput
              name="search"
              placeholder="Search Agents"
              onChange={handleSearchChange}
              handleInputClear={handleInputClear}
              inputValue={inputValue}
            />
          </div>

          <CommonTable headings={headings}>
            {agentState?.assignedAgentDetail?.length == 0 &&
              getStatus !== "loading" ? (
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
            ) : getStatus == "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render loader component */}
                </TableCell>
              </TableRow>
            ) : (
              agentState?.assignedAgentDetail?.map((row, index) => (
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
                  <TableCell
                    align="left"
                    className="whitespace-nowrap font-500"
                  >
                    {row.first_name}
                  </TableCell>

                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {row.last_name}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {moment(row.created_at).format("MMMM Do, YYYY")}
                  </TableCell>
                  {/* {userDetails?.role_id == 5 &&
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >

                    </TableCell>
                  } */}
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {row.last_login
                      ? moment(row.last_login).format("MMMM Do, YYYY")
                      : "N/A"}
                  </TableCell>
                  {(userDetails?.role_id == 2 || userDetails?.role_id == 5) && (
                    <TableCell align="center" className="whitespace-nowrap">
                      <Android12Switch
                        checked={row?.is_toggle} // Ensure default state as false if not set
                        onChange={(e) =>
                          handleAuthSwitch(e, row.agent_id, row?.is_toggle)
                        }
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </CommonTable>

          <div
            className={`flex ${userDetails.role_id == 1 ? "justify-between" : "justify-end"}  py-14 px-[3rem] `}
          >
            {/* {agentState?.assignedAgentDetail.length > 0 && ( */}
            {userDetails.role_id == 1 && (
              <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Agents: ${agentState?.total_items}`}</Typography>
            )}
            {fetchStatus !== "loading" && (
              <CommonPagination
                total={agentState?.total_items}
                count={agentState?.agentTotal_records}
                setLimit={setLimit}
                limit={limit}
                responsive={true}
                onChange={(e, PageNumber: number) =>
                  checkPageNum(e, PageNumber)
                }
                page={filters.start + 1}
              />
            )}
          </div>
        </div>
      </div>

      {isOpenAddModal && (
        <AddAgentModel
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          fetchAgentList={fetchAgentList}
          isEditing={false}
        />
      )}

      <TwoFactorAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={isAuthenticated}
        id={id}
        tableList={true}
        fetchAgentList={fetchAgentList}
        title={"assigned task access"}
      />
    </>
  );
}
