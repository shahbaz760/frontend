import {
  Button,
  Switch,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/styles";
import {
  DeleteRolePermissionList,
  GetReminder,
  GetRolePermissionList,
} from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchInput from "src/app/components/SearchInput";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getClientId, getUserDetail } from "src/utils";
import TwoFactorAuth from "./TwoFactor";
import { NavigateFunction, useNavigate } from "react-router";
import ActionModal from "src/app/components/ActionModal";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ListLoading from "@fuse/core/ListLoading";
import { debounce } from "lodash";

const Android12Switch = styled(Switch)(() => ({
  padding: 0,
  height: 27,
  width: 66,
  borderRadius: 100,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#9DA0A6",

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
      color: "#fff",
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
      transform: "translateX(36px)",
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
    width: "23px",
    height: "auto",
    aspectRatio: 1,
    margin: "2px 4px",
    backgroundColor: "white",
  },
}));

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
        {text || "N/A"}
      </Typography>
    </Tooltip>
  );
};

const userDetail = getUserDetail();

export default function Setting() {
  const dispatch = useAppDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const { total_items, status, total_records, list } = useSelector(
    (state: RootState) => state.password
  );
  const { Accesslist, AccessStatus } = useSelector(
    (state: RootState) => state.project
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(total_items);
  }, [list]);

  const [limit, setLimit] = useState(20);
  const theme: Theme = useTheme();
  const [updatedAuth, setUpdatedAuth] = useState([]);
  const [isAuthenticated, setIsAuthenticate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [disable, setDisable] = useState(false);
  const [authSwitches, setAuthSwitches] = useState([]);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [filterMenu, setfilterMenu] = useState<any>({
    start: 0,
    limit,
    search: "",
  });
  const navigate: NavigateFunction = useNavigate();
  const handleAuthSwitch = (index) => (e) => {
    const updatedSwitches = authSwitches?.map((item, idx) =>
      idx === index ? { ...item, value: e.target.checked ? 1 : 0 } : item
    );
    setUpdatedAuth(updatedSwitches);
    const matchingValue = updatedSwitches[index].value;
    setIsAuthenticate(matchingValue == 1 ? true : false);
    setIsOpenAuthModal(true);
  };

  const fetchList = async (loader = true) => {
    setLoading(loader);
    try {
      const res = await dispatch(GetRolePermissionList(filterMenu));
      // toast.success(res?.payload?.data?.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, [filterMenu.search, filterMenu.limit, filterMenu.start]);

  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      //@ts-ignore
      const res = await dispatch(DeleteRolePermissionList(deleteId));
      if (res?.payload?.data?.status) {
        setfilterMenu((prevFilters) => ({
          ...prevFilters,
          start: list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
      }

      setOpenDeleteModal(false);
      // setList(res?.payload?.data?.data?.list);
      if (res?.payload?.data?.status == 1) {
        fetchList(false);
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error(res?.payload?.data?.message);
      }

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

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      // Update the search filter here
      setfilterMenu((prevFilters) => ({
        ...prevFilters,
        search: searchValue,
      }));
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleInputClear = () => {
    setInputValue("");
    setfilterMenu((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilterMenu((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  useEffect(() => {
    setfilterMenu((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);

  // if (loading == true) {
  //   return <FuseLoading />;
  // }

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
    if (
      window.location.pathname.includes("setting") &&
      (userDetail?.role_id == 4 || userDetail?.role_id == 5) &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/401`);
    }
    // client_id
  }, [Accesslist]);
  return (
    <>
      <>
        <TitleBar title="Settings">
          <Button
            variant="outlined"
            color="secondary"
            className="h-[40px] text-[16px] flex gap-8 font-[600] leading-none sm:leading-0 "
            aria-label="Add Role & Permission"
            size="large"
            // onClick={() => setIsOpenAddModal(true)}
            onClick={() => {
              navigate(
                userDetail?.role_id == 1 || userDetail?.role_id == 4
                  ? "/admin/setting/add-role-permission"
                  : `/settings/add-role-permission${clientId ? `?ci=${clientId}` : ""}`
              );
            }}
          >
            <PlusIcon color={theme.palette.secondary.main} />
            Add Role & Permissions
          </Button>
        </TitleBar>

        <div className="px-[15px] mb-[3rem]">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-[2rem] flex items-center justify-between flex-wrap gap-10">
              <Typography className="text-[18px] font-600 text-[#0A0F18]">
                Roles and Permissions
              </Typography>
              <SearchInput
                name="search"
                placeholder="Search Role"
                onChange={(e) => handleSearchChange(e)}
                handleInputClear={handleInputClear}
                inputValue={inputValue}
              />
            </div>
            <CommonTable headings={["Role", "Description", "", "Action"]}>
              <>
                {list?.length === 0 && status != "loading" ? (
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
                ) : status == "loading" ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <ListLoading /> {/* Render loader component */}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {list.map((row, index) => (
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
                        <TableCell scope="row" className="w-[33%] ">
                          {" "}
                          <TruncateText text={row.name} maxWidth={250} />
                        </TableCell>
                        <TableCell
                          align="center"
                          className="whitespace-nowrap w-[33%] "
                        >
                          <div className="flex justify-center">
                            <TruncateText
                              text={row.description}
                              maxWidth={250}
                            />
                          </div>
                        </TableCell>

                        <TableCell
                          align="center"
                          className="whitespace-nowrap w-0"
                        ></TableCell>
                        <TableCell align="center" className="w-[1%]">
                          <div className="flex gap-20  justify-center">
                            <span
                              className="p-2 cursor-pointer"
                              onClick={() => {
                                setOpenDeleteModal(true);
                                setIsDeleteId(row.id);
                              }}
                            >
                              <DeleteIcon />
                            </span>
                            <span
                              className="p-2 cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `/${userDetail?.role_id == 1 || userDetail?.role_id == 4 ? "admin/setting" : "settings"}/edit-role-permission/${row.id}${clientId ? `?ci=${clientId}` : ""}`
                                );
                              }}
                            >
                              <EditIcon />
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </>
            </CommonTable>
            <div className="flex justify-between py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
              <>
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{` Total Roles and Permissions: ${total == undefined ? 0 : total}`}</Typography>
                {status != "loading" && (
                  <CommonPagination
                    total={total_items}
                    limit={limit}
                    setLimit={setLimit}
                    count={total_records}
                    page={filterMenu.start + 1}
                    onChange={(event, pageNumber) =>
                      checkPageNum(event, pageNumber)
                    }
                  />
                )}
              </>
            </div>
          </div>
        </div>

        <ActionModal
          modalTitle="Delete Role!"
          modalSubTitle="Are you sure you want to delete this role?"
          open={openDeleteModal}
          handleToggle={() => setOpenDeleteModal((prev) => !prev)}
          type="delete"
          onDelete={onDelete}
          disabled={disable}
        />
      </>
    </>
  );
}
