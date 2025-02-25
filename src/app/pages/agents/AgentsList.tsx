import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { getAgentList, sortColumn } from "app/store/Agent";
import { deleteAgent } from "app/store/Agent group";
import { AgentRootState } from "app/store/Agent/Interafce";
import { filterType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchInput from "src/app/components/SearchInput";
import TitleBar from "src/app/components/TitleBar";
import AddAgentModel from "src/app/components/agents/AddAgentModel";
import DeleteAgent from "src/app/components/client/DeleteAgent";
import DeleteClient from "src/app/components/client/DeleteClient";
import ClientStatus from "src/app/components/client/Subscription/ClientStatus";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getClientId, getUserDetail, sortAgentList } from "src/utils";

export default function AgentsList() {
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const agentState = useSelector((store: AgentRootState) => store.agent);
  const { total_items } = useSelector((store: AgentRootState) => store.agent);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  let userDetail = getUserDetail();
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dispatch = useAppDispatch();
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

  const navigate = useNavigate();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        search: inputValue,
        start: 0,
      }));
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 800]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    // debouncedSearch(value);
  };
  const fetchAgentList = useCallback(() => {
    dispatch(getAgentList(filters));
  }, [filters]);

  useEffect(() => {
    if (
      window.location.pathname.includes("agents") &&
      (userDetail?.role_id == 4 || userDetail?.role_id == 5) &&
      Accesslist.is_agent_access == 0
    ) {
      navigate(`/401`);
    }
  }, [Accesslist]);

  useEffect(() => {
    fetchAgentList();
  }, [filters.limit, filters.start, filters.search]);

  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };

  const agent = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const maxVisibleImages = 3;
  const visibleAgents = agent.slice(0, maxVisibleImages);
  const extraAgentsCount = agent.length - maxVisibleImages;
  const columnKey = {
    ID: "id",
    "First Name": "first_name",

    "Last Name": "last_name",
    "Start Date": "created_at",
    "Last Login": "last_login",
    "KYC Status": "is_complete_profile",
    Status: "status",
  };

  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);

    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(sortAgentList(column, isAsc, agentState?.list, columnKey))
    );
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);

  const deleteGroup = async (id: any) => {
    setDeleteLoading(true);
    try {
      const { payload } = await dispatch(deleteAgent(id));

      if (payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: agentState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
        setIsOpenDeletedModal(false);
        setIsDeleteId(null);
        dispatch(getAgentList(filters));
      }
      setDeleteLoading(false);
    } catch (error) {
      // console.error("Failed to delete agent group:", error);
      setDeleteLoading(false);
    }
  };

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
      <TitleBar title="Agents">
        {(userDetail?.role_id == 1 ||
          (userDetail?.role_id == 4 && Accesslist?.agent_view == 0)) && (
          <Button
            variant="outlined"
            color="secondary"
            className="h-[40px] text-[16px] flex gap-8 font-[600]"
            aria-label="Add Tasks"
            size="large"
            onClick={() => setIsOpenAddModal(true)}
          >
            <PlusIcon color={theme.palette.secondary.main} />
            Add Agent
          </Button>
        )}
      </TitleBar>

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

          <CommonTable
            headings={[
              "ID",
              "First Name",
              "Last Name",
              "Start Date",
              "Last Login",
              "KYC Status",
              "Status",
              "",
            ]}
            sortColumn={sortBy}
            isSorting={true}
            sortOrder={sortOrder}
            onSort={sortData}
            check={false}
          >
            {agentState?.list?.length === 0 &&
            agentState.status != "loading" ? (
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
            ) : agentState.status === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render loader component */}
                </TableCell>
              </TableRow>
            ) : (
              agentState?.list?.length > 0 &&
              agentState?.list.map((row, index) => (
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
                    {row.created_at
                      ? moment(row.created_at).format("MMMM Do, YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {row.last_login
                      ? moment(row.last_login).format("MMMM Do, YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500 "
                  >
                    {row?.is_complete_profile !== null &&
                      row?.is_complete_profile !== undefined && (
                        <Button
                          className={`h-20 rounded-3xl border-none !min-h-24 w-[100px] leading-none cursor-default  
                            
      ${row?.is_complete_profile <= 3 ? "text-[#f0b402] bg-[#FFEEBB] hover:bg-[#FFEEBB]" : ""}
      // ${row?.is_complete_profile === 4 ? "text-[#6889AF] bg-[#DFEFF1]" : ""}
      ${row?.is_complete_profile === 5 ? "text-[#4CAF50] bg-[#DFF1E0] hover:bg-[#DFF1E0] " : ""}
      ${row?.is_complete_profile === 6 ? "text-[#FF0000] bg-[#FFD1D1] hover:bg-[#FFD1D1]" : ""}
    `}
                          style={{
                            background:
                              row?.is_complete_profile === 4
                                ? "rgb(177 211 255)"
                                : "",
                            color:
                              row?.is_complete_profile === 4
                                ? "rgb(0 119 255)"
                                : "",
                          }}
                        >
                          {row?.is_complete_profile <= 3
                            ? "Pending"
                            : row?.is_complete_profile === 4
                              ? "In Review"
                              : row?.is_complete_profile === 5
                                ? "Approved"
                                : row?.is_complete_profile === 6
                                  ? "Rejected"
                                  : ""}
                        </Button>
                      )}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {row?.status == "Pending" ? (
                      <Button
                        variant="outlined"
                        className={`h-20 rounded-3xl border-none w-[100px] min-h-24 leading-none cursor-default hover:bg-[#ffeebb]                         
                                    text-[#f0b402] bg-[#ffeebb]
                                
                                `}
                      >
                        {row?.status || "N/A"}
                      </Button>
                    ) : (
                      <ClientStatus
                        rowstatus={row?.status}
                        id={row?.id}
                        title={"agent"}
                      />
                    )}
                  </TableCell>

                  <TableCell align="left" className="w-[1%] font-500">
                    <div className="flex gap-20 pe-20">
                      {userDetail?.role_id == 1 ||
                      (userDetail?.role_id == 4 &&
                        row?.is_delete_access == 1 &&
                        Accesslist.agent_delete != 2) ? (
                        <span
                          className="p-2 cursor-pointer"
                          // onClick={deleteGroup}
                        >
                          <DeleteIcon
                            onClick={() => {
                              setIsOpenDeletedModal(true);
                              setIsDeleteId(row.id);
                            }}
                          />
                        </span>
                      ) : (
                        <span
                          className="p-2 "
                          // onClick={deleteGroup}
                        >
                          <DeleteIcon fill="#ffffff" />
                        </span>
                      )}
                      <span className="p-2 cursor-pointer">
                        <Link to={`/admin/agents/agent-detail/${row.id}`}>
                          <ArrowRightCircleIcon />
                        </Link>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </CommonTable>

          <div className="flex justify-between py-14 sm:px-[3rem] px-[1rem] overflow-x-auto whitespace-nowrap gap-20">
            <>
              <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Agents: ${total_items}`}</Typography>
              {agentState.status !== "loading" && (
                <CommonPagination
                  total={total_items}
                  limit={limit}
                  setLimit={setLimit}
                  count={agentState?.total_records}
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

      {isOpenAddModal && (
        <AddAgentModel
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          fetchAgentList={fetchAgentList}
          isEditing={false}
        />
      )}
      <DeleteAgent
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => deleteGroup(deleteId)}
        heading={"Delete Agent"}
        description={"Are you sure you want to delete this Agent? "}
        isLoading={deleteLoading}
      />
    </>
  );
}
