import {
  Button,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { GetPasswordList, deletePassword } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { SitesIcon } from "public/assets/icons/passManager-icons";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ActionModal from "src/app/components/ActionModal";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { filterType } from "app/store/AccountManager/Interface";
import AddPassword from "src/app/components/passwordManager/AddPassword";
import moment from "moment";
import ListLoading from "@fuse/core/ListLoading";
import SearchInput from "src/app/components/SearchInput";
import { debounce } from "lodash";
import { getClientId, getToken, getUserDetail } from "src/utils";
import { RefreshToken } from "app/store/Auth";

const TableCellWithPassword = ({ text, maxWidth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TruncateText
        text={showPassword ? text : "•".repeat(text?.length)}
        maxWidth={maxWidth}
        tooltip={showPassword}
      />
      <button onClick={togglePasswordVisibility} style={{ marginLeft: "10px" }}>
        <img
          src={
            !showPassword
              ? "assets/icons/closeEye.svg"
              : "assets/icons/openEye.svg"
          }
          alt=""
        />
      </button>
    </div>
  );
};

export const TruncateText = ({ text, maxWidth, tooltip }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);

  const content = (
    <Typography
      ref={textRef}
      noWrap
      style={{
        maxWidth: `${maxWidth}px`,
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: `${maxWidth}px`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );

  return tooltip ? (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default function PasswordManager() {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [disable, setDisable] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [id, setId] = useState();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const PasswordState = useSelector((state: RootState) => state.password);
  const userDetails = getUserDetail();
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });

  const fetchPasswordList = async () => {
    try {
      const res = await dispatch(GetPasswordList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    debouncedSearch(value);
  };
  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        start: 0,
        search: searchValue,
      }));
    }, 800),
    []
  );

  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      const payload = {
        password_manager_id: deleteId,
      };
      //@ts-ignore
      const res = await dispatch(deletePassword(payload));
      if (res?.payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: PasswordState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
      }
      fetchPasswordList();
      setOpenDeleteModal(false);
      toast.success(res?.payload?.data?.message);

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

  useEffect(() => {
    fetchPasswordList();
  }, [filters.search, filters.limit, filters.start]);

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
    <div>
      <TitleBar title="Password Manager">
        {(userDetails.role_id == 2 || userDetails.role_id == 5) && (
          <Button
            variant="outlined"
            color="secondary"
            className="h-[40px] text-[16px] flex gap-8 whitespace-nowrap sm:w-[190px] w-[250px] "
            aria-label="Add User"
            size="large"
            onClick={() => setIsOpenAddModal(true)}
            startIcon={
              <PlusIcon
                color={theme.palette.secondary.main}
                className="shrink-0"
              />
            }
          >
            Add Password
          </Button>
        )}
      </TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="shadow-sm bg-white rounded-lg">
          <div className="p-[2rem]">
            <SearchInput
              name="search"
              placeholder="Search Password"
              onChange={handleSearchChange}
              handleInputClear={handleInputClear}
              inputValue={inputValue}
            />
          </div>
          <CommonTable
            headings={[
              "Site Name",
              "Username",
              "Password",
              userDetails.role_id == 2 || userDetails.role_id == 5
                ? "Assigned to"
                : null,
              "Created on",
              userDetails?.role_id == 2 || userDetails.role_id == 5
                ? "Actions"
                : null,
            ]}
          >
            <>
              {PasswordState?.list?.length === 0 &&
              PasswordState?.statusList != "loading" ? (
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
              ) : PasswordState.statusList == "loading" ? (
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
                        fontWeight: 500,
                        borderBottom: "1px solid #EDF2F6",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        color: theme.palette.primary.main,
                        height: 65,
                      },
                    }}
                  >
                    <TableCell scope="row" className=" h-[63.5px]">
                      <div className="flex items-center pe-[3.25rem]">
                        <div className="flex items-center grow">
                          <span
                            className="shrink-0 mr-10 h-[38px] aspect-square flex items-center justify-center 
                          rounded-full bg-secondary_bg text-secondary"
                          >
                            <SitesIcon />
                          </span>
                          <span>
                            <TruncateText
                              text={row.site_name}
                              maxWidth={150}
                              tooltip={true}
                            />
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="whitespace-nowrap h-[63.5px] "
                    >
                      <div className="flex justify-center">
                        <TruncateText
                          text={row.user_name}
                          maxWidth={150}
                          tooltip={true}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      {/* <TruncateText text={row.password} maxWidth={150} /> */}
                      <TableCellWithPassword
                        text={row.password}
                        maxWidth={150}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      className="whitespace-nowrap  h-[63.5px] "
                    >
                      {(userDetails.role_id == 2 ||
                        userDetails.role_id == 5) && (
                        // <TableCell align="center">
                        <div
                          className="flex  
                      items-center justify-center"
                        >
                          {row?.password_assigned_agent?.length === 0 ? (
                            "N/A"
                          ) : (
                            <>
                              {row?.password_assigned_agent
                                ?.slice(0, 3)
                                .map((item, index) => {
                                  return (
                                    <img
                                      className={`  h-[34px] w-[34px] rounded-full border-2  border-white ${
                                        row?.password_assigned_agent?.length > 1
                                          ? "ml-[-16px] "
                                          : ""
                                      } z-0 `}
                                      src={
                                        item?.agent_details?.user_image
                                          ? urlForImage +
                                            item?.agent_details?.user_image
                                          : "../assets/images/logo/images.jpeg"
                                      }
                                      alt={`User ${index + 1}`}
                                    />
                                  );
                                })}
                              {row?.password_assigned_agent?.length > 3 && (
                                <span
                                  className="ml-[-16px] z-0 h-[34px] w-[34px] rounded-full border-2 border-white bg-[#4F46E5] flex 
                        items-center justify-center text-[12px] font-500 text-white "
                                >
                                  +{row?.password_assigned_agent?.length - 3}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        // </TableCell>
                      )}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="whitespace-nowrap h-[63.5px]"
                    >
                      {moment(row.createdAt).format("ll")}
                    </TableCell>
                    {(userDetails.role_id == 2 ||
                      (userDetails.role_id == 5 &&
                        row.user_id == userDetails.id)) && (
                      <TableCell align="left" className="w-[1%] h-[63.5px]">
                        <div className="flex gap-20 pe-20">
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
                              setIsOpenAddModal(true);
                              setId(row.id);
                            }}
                          >
                            <EditIcon />
                          </span>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </>
          </CommonTable>
          <div className={`flex  justify-end  py-14 px-[3rem]`}>
            {/* // PasswordState?.total_records > 10 && */}
            <>
              {/* {(userDetails.role_id == 2 || userDetails.role_id == 5) && (
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Password Managers: ${PasswordState?.total_items}`}</Typography>
              )} */}
              {PasswordState.statusList !== "loading" && (
                <CommonPagination
                  limit={limit}
                  total={PasswordState?.total_items}
                  setLimit={setLimit}
                  responsive={true}
                  count={PasswordState?.total_records}
                  page={filters.start + 1}
                  onChange={(event, pageNumber) =>
                    checkPageNum(event, pageNumber)
                  }
                  onPageChange={function (
                    event: ChangeEvent<unknown>,
                    page: number
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  currentPage={0}
                />
              )}
            </>
          </div>
        </div>
      </div>
      <AddPassword
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        fetchPasswordList={fetchPasswordList}
        id={id}
        setId={setId}
      />
      <ActionModal
        modalTitle="Delete Password!"
        modalSubTitle="Are you sure you want to delete this password?"
        open={openDeleteModal}
        handleToggle={() => setOpenDeleteModal((prev) => !prev)}
        type="delete"
        onDelete={onDelete}
        disabled={disable}
      />
    </div>
  );
}
