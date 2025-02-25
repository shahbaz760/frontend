import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  changeFetchStatus,
  deleteAccManager,
  getAccManagerList,
  sortColumn,
} from "app/store/AccountManager";
import { filterType } from "app/store/AccountManager/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import SearchInput from "src/app/components/SearchInput";
import TitleBar from "src/app/components/TitleBar";
import AddAccountManagerModel from "src/app/components/accountManager/AddAccountmanagerModal";
import DeleteClient from "src/app/components/client/DeleteClient";
import ClientStatus from "src/app/components/client/Subscription/ClientStatus";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getUserDetail, sortAgentList } from "src/utils";

export default function AccountManager() {
  const accountManager_Id = useParams();
  const { Accesslist } = useSelector((state: RootState) => state.project);
  let userDetail = getUserDetail();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  let MainuserDetail = JSON.parse(localStorage.getItem("userDetail"));
  const dispatch = useAppDispatch();
  const accManagerState = useSelector(
    (state: RootState) => state.accManagerSlice
  );
  const { total_items } = useSelector(
    (state: RootState) => state.accManagerSlice
  );
  const [limit, setLimit] = useState(20);

  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {
    },
  });

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        search: searchValue,
        start: 0,
      }));
      dispatch(
        getAccManagerList({ ...filters, search: searchValue, start: 0 })
      );
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    debouncedSearch(value);
  };

  const [isOpenSupportDetail, setIsOpenDetailPage] = useState<boolean>(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchManagerList = () => {
    dispatch(getAccManagerList(filters));
  }

  useEffect(() => {
    // fetchManagerList();
    setIsOpenAddModal(false);
    dispatch(changeFetchStatus());
  }, []);

  useEffect(() => {
    dispatch(getAccManagerList(filters));
  }, [filters.start, filters.limit]);


  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  // Other component logic

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

  const deleteAccManagerList = async (id: any) => {
    if (!!accManagerState.actionStatus || !id) return;
    try {
      const { payload } = await dispatch(
        deleteAccManager({ accountManger_id: id })
      );

      if (payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: accManagerState?.list?.length === 1 ? 0 : prevFilters.start,
        }));
        setIsOpenDeletedModal(false);
        setIsDeleteId(null);
      }
    } catch (error) {
      console.error("Failed to delete agent group:", error);
    }
  };

  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
    dispatch(getAccManagerList({ ...filters, search: "", start: 0 }));
  };

  const columnKey = {
    ID: "id",
    "First Name": "first_name",
    "Last Name": "last_name",
    Email: "email",
    Status: "status",
    Role: "role_permission_name",
  };
  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(sortAgentList(column, isAsc, accManagerState?.list, columnKey))
    );
  };

  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);
  useEffect(() => {
    if (
      window.location.pathname.includes("admin/setting/Subscription") &&
      (userDetail?.role_id == 4 || userDetail?.role_id == 5) &&
      Accesslist.is_admin_users == 0
    ) {
      navigate(`/401`);
    }
  }, [Accesslist]);
  return (
    <>
      <TitleBar title="Admin User">
        {/* {((userDetail?.role_id == 1) || (userDetail?.role_id == 4 && Accesslist.admin_view == 0)) && */}
        <Button
          variant="outlined"
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] sm:leading-3 leading-none"
          aria-label="Add New Group"
          size="large"
          onClick={() => {
            setIsOpenAddModal(true);
          }}
          startIcon={<PlusIcon color={theme.palette.secondary.main} />}
        >
          Add Admin User
        </Button>
        {/* } */}
      </TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-[2rem]">
            <SearchInput
              name="search"
              placeholder="Search Admin User"
              onChange={(e) => handleSearchChange(e)}
              handleInputClear={handleInputClear}
              inputValue={inputValue}
            />
          </div>
          <CommonTable
            headings={[
              "ID",
              "First Name",
              "Last Name",
              "Email",
              "Role",
              "Status",
              "",
            ]}
            sortColumn={sortBy}
            isSorting={true}
            sortOrder={sortOrder}
            onSort={sortData}
            check={false}
          >
            {accManagerState?.list?.length === 0 &&
              accManagerState.status != "loading" ? (
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
            ) : accManagerState?.status === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render loader component */}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {accManagerState?.list?.length > 0 &&
                  accManagerState?.list?.map((row: any, index: number) => (
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
                        scope="row"
                        className="text-[14px] font-500 px-[20px]"
                      >
                        #{row.id}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap text-[14px] font-500"
                      >
                        {row.first_name}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap text-[14px] font-500"
                        align="center"
                      >
                        {row.last_name}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap text-[14px] font-500"
                        align="center"
                      >
                        {MainuserDetail?.role_id === 1 ||
                          (MainuserDetail?.role_id === 4 &&
                            Accesslist.admin_hide_info == 0)
                          ? row.email
                          : "*****"}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap text-[14px] font-500"
                        align="center"
                      >
                        {row.role_permission_name || "N/A"}
                      </TableCell>

                      <TableCell
                        className="whitespace-nowrap text-[14px] font-500"
                        align="center"
                      >
                        <ClientStatus
                          rowstatus={row?.status}
                          id={row?.id}
                          title={"admin user"}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap text-[14px] font-500 cursor-pointer"
                      >
                        <div className="flex items-center gap-20 ">
                          {(MainuserDetail?.role_id === 1 ||
                            (MainuserDetail?.role_id === 4 &&
                              Accesslist.admin_delete == 1)) && (
                              <DeleteIcon
                                onClick={() => {
                                  setIsOpenDeletedModal(true);
                                  setIsDeleteId(row.id);
                                }}
                              />
                            )}
                          {/* <DeleteIcon onClick={() => deleteAccManger(row.id)} /> */}
                          <Link to={`/admin/acc-manager/detail/${row.id}`}>
                            <ArrowRightCircleIcon />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </CommonTable>
          <div className="flex justify-between py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
            <>
              <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Admin Users: ${total_items}`}</Typography>
              {accManagerState.status != "loading" && (
                <CommonPagination
                  total={total_items}
                  limit={limit}
                  setLimit={setLimit}
                  count={accManagerState?.total_records}
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
      {isOpenAddModal && (
        <AddAccountManagerModel
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          isEditing={false}
          fetchManagerList={fetchManagerList}
        />
      )}
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => deleteAccManagerList(deleteId)}
        heading={"Delete Admin User"}
        description={"Are you sure you want to delete this Admin User? "}
      />
    </>
  );
}
