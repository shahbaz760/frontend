//agentgroup
import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  deleteAgentGroup,
  getAgentGroupList,
  sortColumn,
} from "app/store/Agent group";
import {
  AgentGroupRootState,
  filterType,
} from "app/store/Agent group/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import SearchInput from "src/app/components/SearchInput";
import TitleBar from "src/app/components/TitleBar";
import AddGroupModel from "src/app/components/agents/AddGroupModel";
import DeleteClient from "src/app/components/client/DeleteClient";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getClientId, getUserDetail, sortAgentList } from "src/utils";

export default function AgentsGroup() {
  const group_id = useParams();
  const agentGroupState = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );
  const { total_item } = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );

  const dispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [isOpenSupportDetail, setIsOpenDetailPage] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });
  const { search, start } = filters;
  const navigate = useNavigate();
  const userDetail = getUserDetail();

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

  const { Accesslist } = useSelector((state: RootState) => state.project);
  useEffect(() => {
    if (
      window.location.pathname.includes("agents") &&
      userDetail?.role_id == 4 &&
      Accesslist.is_agent_group_access == 0
    ) {
      navigate(`/401`);
    }
  }, [Accesslist]);

  const fetchAgentGroupList = useCallback(() => {
    dispatch(getAgentGroupList(filters));
  }, [filters]);
  const deleteGroup = async (id: any) => {
    if (!!agentGroupState.actionStatusDisabled || !id) return;
    try {
      const { payload } = await dispatch(deleteAgentGroup({ group_id: id }));

      if (payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: agentGroupState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
        setIsOpenDeletedModal(false);
        fetchAgentGroupList()
        setIsDeleteId(null);
        dispatch(getAgentGroupList(filters));
      }
    } catch (error) {
      // console.error("Failed to delete agent group:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        search: inputValue,
        start: 0,
      }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 300]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);

    // debouncedSearch(value);
  };


  useEffect(() => {
    fetchAgentGroupList();
  }, [filters.limit, filters.start, filters.search]);

  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };

  const columnKey = {
    ID: "id",
    "Group Name": "group_name",
    "Number of Agents": "members_count",
  };
  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);

    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(sortAgentList(column, isAsc, agentGroupState?.list, columnKey))
    );
  };
  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);

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
      {(userDetail?.role_id == 1 ||
        (window.location.pathname.includes("agents/groups") &&
          userDetail?.role_id == 4 &&
          Accesslist.agent_group_view == 0)) && (
          <TitleBar title="Agents Groups">
            <Button
              variant="outlined"
              color="secondary"
              className="h-[40px] text-[16px] flex gap-8 font-[600] leading-none whitespace-nowrap"
              aria-label="Add New Group"
              size="large"
              onClick={() => {
                setIsOpenAddModal(true);
              }}
            >
              <PlusIcon color={theme.palette.secondary.main} />
              Add New Group
            </Button>
          </TitleBar>
        )}
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-[2rem]">
            <SearchInput
              name="search"
              placeholder="Search Agents Group"
              onChange={handleSearchChange}
              handleInputClear={handleInputClear}
              inputValue={inputValue}
            />
          </div>
          <CommonTable
            headings={["ID", "Group Name", "Number of Agents", "Action"]}
            sortColumn={sortBy}
            isSorting={true}
            sortOrder={sortOrder}
            onSort={sortData}
            check={false}
          >
            {" "}
            {agentGroupState?.list?.length == 0 &&
              agentGroupState?.status !== "loading" ? (
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
            ) : agentGroupState.status == "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render loader component */}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {agentGroupState?.list?.map((row, index) => {
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
                      <TableCell scope="row" className="px-[20px]">
                        #{row.id}
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        {row.group_name}
                      </TableCell>

                      <TableCell align="center" className="whitespace-nowrap">
                        {row.members_count}
                      </TableCell>

                      <TableCell align="center" className="w-[1%]">
                        <div className="flex gap-20 pe-20">
                          {/* <span
                            className="p-2 cursor-pointer"
                          // onClick={deleteGroup}
                          >
                            <DeleteIcon
                              onClick={() => {
                                setIsOpenDeletedModal(true);
                                setIsDeleteId(row.id);
                              }}
                            />
                          </span> */}
                          {userDetail?.role_id == 1 ||
                            (userDetail?.role_id == 4 &&
                              row?.is_delete_access == 1 &&
                              Accesslist.agent_group_delete != 2) ? (
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
                              <DeleteIcon fill="#9da0a6" />
                            </span>
                          )}
                          {userDetail?.role_id == 1 ||
                            (userDetail?.role_id == 4 &&
                              //row?.is_edit_access == 1 &&
                              Accesslist.agent_group_edit != 2) ? (
                            <span className="p-2 cursor-pointer">
                              <Link to={`/admin/agents/groups/${row.id}`}>
                                <EditIcon />
                              </Link>
                            </span>
                          ) : (
                            <span
                              className="p-2 "
                            // onClick={deleteGroup}
                            >
                              <EditIcon fill="#9da0a6" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </CommonTable>
          <div className="flex justify-between py-14 sm:px-[3rem] px-[1rem] overflow-x-auto whitespace-nowrap gap-20">
            <>
              <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Agent Groups: ${total_item}`}</Typography>
              {agentGroupState?.status !== "loading" && (
                <CommonPagination
                  total={total_item}
                  limit={limit}
                  setLimit={setLimit}
                  count={agentGroupState?.total_records}
                  page={filters.start + 1}
                  onChange={(event, pageNumber) =>
                    checkPageNum(event, pageNumber)
                  }
                />
              )}
            </>
          </div>
        </div>
      </div>
      <AddGroupModel
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        isNewAgent={false}
        fetchAgentGroupList={fetchAgentGroupList}
      />
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => deleteGroup(deleteId)}
        heading={"Delete Group"}
        description={"Are you sure you want to delete this Group? "}
      />
    </>
  );
}
