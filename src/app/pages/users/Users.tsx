import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Checkbox,
  InputAdornment,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  TextField,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { filterType } from "app/store/Client/Interface";
import { GetUserList, GetUserRoleList, deleteUser } from "app/store/User";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import moment from "moment";
import {
  CrossGreyIcon,
  DeleteIcon,
  EditIcon,
  NoDataFound,
} from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { FilterIcon } from "public/assets/icons/user-icon";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ActionModal from "src/app/components/ActionModal";
import DropdownMenu from "src/app/components/Dropdown";
import InputField from "src/app/components/InputField";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import SelectField from "src/app/components/selectField";
import AddUserModal from "src/app/components/users/AddUser";
import EditUserModal from "src/app/components/users/EditUser";
import { getClientId, getToken, getUserDetail } from "src/utils";
import TwoFactorAuth from "../myAgent/TwoFactor";
import { RefreshToken } from "app/store/Auth";
import { GetRolePermissionList } from "app/store/Password";

// id: "1542145611525",
// name: "Web page design",
// companyName: "Account Manager",
// date: "Feb 12,2024",
// status: "In Review",
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  // "&.MuiMenuItem-root": {
  //   "&:hover": {
  //     backgroundColor: "transparent",
  //   },
  // },
  "& .radioIcon": {
    color: "#9DA0A6",
    border: "2px solid currentColor",
    height: "16px",
    aspectRatio: 1,
    borderRadius: "50%",
    position: "relative",
  },
  "&.Mui-selected": {
    backgroundColor: "transparent",
    "& .radioIcon": {
      color: theme.palette.secondary.main,
      "&::after": {
        content: '""',
        display: "block",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "7px",
        aspectRatio: 1,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    },
  },
}));
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

export default function Users() {
  const theme: Theme = useTheme();
  const [isAuthenticated, setIsAuthenticate] = useState(0);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);
  const userDetails = getUserDetail();
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState(null);
  const PasswordState = useSelector((state: RootState) => state.clientUser);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [searchList, setSearchList] = useState("");
  const [initialRender, setInitialRender] = useState(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [roleItems, setRoleItems] = useState([]);
  const [limit, setLimit] = useState(20);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filters, setfilters] = useState<any>({
    start: 0,
    limit,
    search: "",
    filter: {
      role: 0,
      two_factor_authentication: 0,
    },
  });

  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {
      setfilters({
        ...filters,
        filter: {
          ...filters.filter,
          role: values.role,
          two_factor_authentication: values.verification,
        },
      });
    },
  });

  const fetchUserList = async () => {
    try {
      const res = await dispatch(GetUserList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRoleList = async () => {
    const res = await dispatch(
      GetRolePermissionList({ start: 0, limit: -1, search: "" })
    );
    const data = res?.payload?.data?.data;
    setRoleItems(data?.list);
  };
  const handleAuthSwitch = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    toggle
  ) => {
    setIsAuthenticate(toggle);
    const { checked } = e.target;
    setId(id);

    setIsOpenAuthModal(true);
  };
  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      const payload = {
        password_manager_id: deleteId,
      };
      //@ts-ignore
      const res = await dispatch(deleteUser(payload));
      if (res?.payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: PasswordState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
      }
      fetchUserList();
      setOpenDeleteModal(false);
      // setList(res?.payload?.data?.data?.list);
      toast.success(res?.payload?.data?.message);

      // toast.dismiss();
      setIsDeleteId(null);
      setTimeout(() => {
        setDisable(false);
      }, 500);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

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

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      // Update the search filter here
      setfilters((prevFilters) => ({
        ...prevFilters,
        search: searchValue,
      }));
      setInitialRender(true);
    }, 1000),
    []
  ); // Adjust the delay as needed (300ms in this example)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchList(value);
    debouncedSearch(value);
  };
  const handleInputClear = () => {
    setSearchList("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };

  useEffect(() => {
    fetchUserList();
    setFilterMenu(null);
  }, [filters.start, filters.search, filters.limit, filters.filter]);

  useEffect(() => {
    fetchRoleList();
  }, []);

  useEffect(() => {
    setfilters({
      ...filters,
      start: 0,
      limit,
    });
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
    <div>
      <TitleBar title="Users" />
      <div className="px-[15px] mb-[3rem]">
        <div className="shadow-sm bg-white rounded-lg">
          <div className="flex justify-between gap-20 pt-14 pb-[1.8rem] px-20 flex-col sm:flex-row">
            <TextField
              hiddenLabel
              id="filled-hidden-label-small"
              defaultValue=""
              value={searchList}
              variant="standard"
              placeholder="Search User"
              onChange={handleSearchChange}
              className="flex md:items-center items-start justify-center"
              sx={{
                height: "45px",
                pl: "5px", // Adjusted padding to accommodate the icon
                width: {
                  // Full width on extra-small screens
                  sm: "286px", // Full width on small screens
                  md: "286px", // 286px on medium and larger screens
                },
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
                "& .MuiInputAdornment-positionStart": {
                  // marginLeft: "8px", // Adjusted margin to position the icon
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      width: 15,
                      display: "inline-flex",
                    }}
                  >
                    {searchList !== "" ? (
                      <CrossGreyIcon
                        className="cursor-pointer fill-[#c2cad2] h-[14px]"
                        onClick={handleInputClear}
                      />
                    ) : (
                      // Render an empty icon to occupy space when inputValue is empty
                      <div style={{ width: "24px" }} />
                    )}
                    {/* You can add more icons conditionally here */}
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex gap-[3rem] justify-between sm:justify-end">
              <DropdownMenu
                handleClose={() => {
                  setFilterMenu(null);
                  if (!isFilter) {
                    formik.resetForm(); // Reset form if isFilter is true
                  }
                }}
                anchorEl={filterMenu}
                button={
                  <Button
                    variant="text"
                    className={`h-[40px] text-[16px] flex gap-12 text-para_light whitespace-nowrap ${isFilter ? "bg-[#EDEDFC] text-secondary" : ""
                      }`}
                    aria-label="Add User"
                    size="large"
                    onClick={(event) => setFilterMenu(event.currentTarget)}
                    sx={{
                      "& .MuiButtonBase-root-MuiButton-root:active": {
                        background: "#EDEDFC",
                        color: "#4F46E5",
                      },
                    }}
                  >
                    <FilterIcon
                      className="shrink-0 "
                      fill={isFilter ? "#4F46E5" : "#757982"}
                    />
                    Filter
                  </Button>
                }
                popoverProps={{
                  open: !!filterMenu,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                  classes: {
                    paper: "pt-0 pb-0",
                  },
                }}
              >
                <div className="w-[240px]">
                  <div className="text-black text-lg font-500 px-20 py-16 border-b border-b-[#EDF2F6]">
                    Filter Options
                  </div>
                  <div className="px-20 py-14 flex flex-col gap-14">
                    <SelectField
                      formik={formik}
                      name="role"
                      label="Role"
                      placeholder="Select Role"
                      sx={{
                        "& .radioIcon": { display: "none" },
                      }}
                    >
                      {roleItems?.map((item) => (
                        <StyledMenuItem key={item.id} value={item.id}>
                          {/* <div className="flex items-center gap-16"> */}
                          <div className="radioIcon" />
                          {/* <div className="rounded-full h-[8px] aspect-square bg-secondary" />
              </div> */}
                          {item.name}
                          {/* </div> */}
                        </StyledMenuItem>
                      ))}
                    </SelectField>
                    <SelectField
                      label="Two Step Verification"
                      name="verification"
                      formik={formik}
                      placeholder="Select Option"
                      sx={{
                        "&.MuiInputBase-root": {
                          "& .MuiSelect-select": {
                            minHeight: "40px",
                          },
                        },
                      }}
                    >
                      <MenuItem value="1">Enabled</MenuItem>
                      <MenuItem value="2">Disabled</MenuItem>
                    </SelectField>
                    <div className="flex items-center justify-end gap-6 px-20 text-sm">
                      <Button
                        variant="text"
                        className="text-para text-sm"
                        disabled={
                          !formik?.values?.role && !formik.values?.verification
                        }
                        onClick={() => {
                          formik.resetForm();
                          setIsFilter(false);
                          setFilterMenu(null);
                          if (
                            filters.filter.role !== 0 &&
                            filters.filter.two_factor_authentication !== 0
                          ) {
                            setfilters({
                              ...filters,
                              filter: {
                                ...filters.filter,
                                role: 0,
                                two_factor_authentication: 0,
                              },
                            });
                          }
                        }}
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="text"
                        color="secondary"
                        className="text-sm"
                        disabled={
                          !formik?.values?.role && !formik.values?.verification
                        }
                        onClick={() => {
                          formik.handleSubmit();
                          setIsFilter(true);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenu>

              <Button
                variant="outlined"
                color="secondary"
                className="h-[40px] text-[16px] flex gap-8 whitespace-nowrap"
                aria-label="Add User"
                size="large"
                onClick={() => {
                  setIsOpenAddModal(true);
                  setId(null);
                  setIsDeleteId(null);
                }}
              >
                <PlusIcon
                  color={theme.palette.secondary.main}
                  className="shrink-0"
                />
                Add User
              </Button>
            </div>
          </div>
          <CommonTable
            headings={[
              "User",
              "Last Log In",
              "Two Step",
              "Joined Date",
              "Role",
              "Access Assigned Tasks Only",
              "Actions",
            ]}
          >
            <>
              {PasswordState?.list?.length === 0 &&
                PasswordState?.status !== "loading" ? (
                <TableRow
                  sx={{
                    "& td": {
                      borderBottom: "1px solid #EDF2F6",
                      // paddingTop: "12px",
                      // paddingBottom: "12px",
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
              ) : PasswordState.status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <ListLoading /> {/* Render your loader component here */}
                  </TableCell>
                </TableRow>
              ) : (
                PasswordState?.list?.map((row, index) => (
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
                    <TableCell scope="row">
                      <div className="flex items-center pe-[3.25rem]">
                        <div className="flex ml-10 grow">
                          <span className="shrink-0 mr-10">
                            {row?.user_image ? (
                              <img
                                src={urlForImage + row?.user_image}
                                alt=""
                                className="h-[34px] aspect-square rounded-full object-cover"
                              />
                            ) : (
                              <img
                                src="../assets/images/logo/images.jpeg"
                                alt=""
                                className="h-[34px] aspect-square rounded-full object-cover"
                              />
                            )}
                          </span>
                          <div>
                            {row?.userName || "N/A"}
                            <span className="block text-sm text-para">
                              {row?.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      {row.last_login
                        ? moment(row.last_login).format("ll")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
                      ${row.two_factor_authentication == "1" ? "text-[#4CAF50] bg-[#4CAF502E]" : "text-[#F44336] bg-[#F443362E]"}`}
                      >
                        {row.two_factor_authentication == "1"
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      {row.created_at
                        ? moment(row.created_at).format("ll")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      {row.role_name || "N/A"}
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      <Android12Switch
                        checked={row?.is_toggle} // Ensure default state as false if not set
                        onChange={(e) =>
                          handleAuthSwitch(e, row.id, row?.is_toggle)
                        }
                      />
                    </TableCell>
                    <TableCell align="left" className="w-[1%]">
                      <div className="flex gap-20 pe-20">
                        <span
                          className="p-2 cursor-pointer"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setIsDeleteId(row?.id);
                          }}
                        >
                          <DeleteIcon />
                        </span>
                        <span
                          className="p-2 cursor-pointer"
                          onClick={() => {
                            setIsOpenEditModal(true);
                            setId(row?.id);
                          }}
                        >
                          <EditIcon />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </>
          </CommonTable>
          <div
            className={`flex ${userDetails.role_id == 1 ? "justify-between" : "justify-end"}  py-14 px-[3rem]`}
          >
            {/* {PasswordState.status !== "loading" && ( */}
            <>
              {userDetails.role_id == 1 && (
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Users: ${PasswordState?.total_items}`}</Typography>
              )}
              <CommonPagination
                total={PasswordState?.total_items}
                limit={limit}
                setLimit={setLimit}
                responsive={true}
                count={PasswordState?.total_records}
                page={filters.start + 1}
                onChange={(event, pageNumber) =>
                  checkPageNum(event, pageNumber)
                }
              />
            </>
          </div>
        </div>
      </div>
      <ActionModal
        modalTitle="Delete User!"
        modalSubTitle="Are you sure you want to delete this user?"
        open={openDeleteModal}
        handleToggle={() => setOpenDeleteModal((prev) => !prev)}
        type="delete"
        onDelete={onDelete}
        disabled={disable}
      />
      {isOpenEditModal && (
        <EditUserModal
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
          fetchUserList={fetchUserList}
          id={id}
          setId={setId}
        />
      )}
      {isOpenAddModal && (
        <AddUserModal
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          fetchUserList={fetchUserList}
        />
      )}
      <TwoFactorAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={isAuthenticated}
        id={id}
        tableList={true}
        fetchAgentList={fetchUserList}
        title={"assigned task access"}
      />
    </div>
  );
}
