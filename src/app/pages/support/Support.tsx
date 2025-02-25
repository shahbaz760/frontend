import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { filterType } from "app/store/Client/Interface";
import {
  DeleteSupportList,
  GetSupportList,
  addSupportMarkClose,
} from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import moment from "moment";
import { NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionModal from "src/app/components/ActionModal";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import AddNewTicket from "src/app/components/support/AddNewTicket";
import {
  getBgColorOfChip,
  getClientId,
  getTextColorOfChip,
  getUserDetail,
  removeDash,
} from "src/utils";

export const TruncateText = ({ text, maxWidth, tooltip = true }) => {
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
        ...(maxWidth
          ? {
              maxWidth: `${maxWidth}px`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: `${maxWidth}px`,
              whiteSpace: "nowrap",
            }
          : {
              overflow: "visible", // Ensure full text is visible if no maxWidth
              whiteSpace: "normal",
            }),
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

export default function Support() {
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const PasswordState = useSelector((state: RootState) => state.password);
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const dispatch = useAppDispatch();
  const userDetails = getUserDetail();
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });

  const fetchSupportList = async () => {
    try {
      const res = await dispatch(GetSupportList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      const payload = {
        password_manager_id: deleteId,
      };
      //@ts-ignore
      const res = await dispatch(DeleteSupportList(payload));
      if (res?.payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start:
            PasswordState?.supportlist.length === 1 ? 0 : prevFilters.start,
        }));
      }
      fetchSupportList();
      setOpenDeleteModal(false);
      setIsDeleteId(null);
      // setList(res?.payload?.data?.data?.list);
      toast.success(res?.payload?.data?.message);

      // toast.dismiss();

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
    // if (userDetails.role_id != 1) {
    fetchSupportList();
    // }
  }, [filters.limit, filters.start, filters.search]);

  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);

  const handleCompleteTask = async (id) => {
    if (id) {
      const payload = {
        type: 1,
        support_ids: [id],
      };
      try {
        // Dispatch the action and wait for the result
        const res = await dispatch(addSupportMarkClose(payload));

        // Check the response status
        // if (res?.data?.status === 1) {
        // Show a success message
        toast.success(res?.payload?.data?.message, {
          duration: 4000,
        });

        // Optionally dismiss the toast after a delay
        setTimeout(() => {
          toast.dismiss();
        }, 4000);

        // Update MainlistData
        await fetchSupportList();
        // }
      } catch (error) {
        console.error("Error handling task completion:", error);
        // Handle any errors if needed
      }
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
      <div>
        <TitleBar title="Support">
          {(userDetails?.role_id == 2 || userDetails?.role_id == 5) && (
            <Button
              variant="outlined"
              color="secondary"
              className="h-[40px] text-[16px] flex gap-8"
              aria-label="Add Tasks"
              size="large"
              onClick={() => {
                setId(null);
                setIsDeleteId(null);
                setIsOpenAddModal(true);
              }}
            >
              <PlusIcon color={theme.palette.secondary.main} />
              New Ticket
            </Button>
          )}
        </TitleBar>
        <div className="px-[15px] mb-[3rem]">
          <div className="shadow-sm bg-white rounded-lg">
            <div className="h-24" />

            <CommonTable
              headings={[
                ...(userDetails.role_id === 1 || userDetails.role_id === 4
                  ? []
                  : ["Mark as Closed"]),
                " Ticket # / Subject",
                "Status",
                "Department",
                "Last Reply",
                "Priority",
                "Date",
                // "Actions",
              ]}
              noWrap={true}
            >
              <>
                {PasswordState?.supportlist?.length === 0 &&
                PasswordState?.supportStatus !== "loading" ? (
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
                    <TableCell colSpan={12} align="center">
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
                ) : PasswordState.supportStatus === "loading" ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <ListLoading /> {/* Render your loader component here */}
                    </TableCell>
                  </TableRow>
                ) : (
                  PasswordState?.supportlist.length > 0 &&
                  PasswordState?.supportlist?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": {
                          borderBottom: "1px solid #EDF2F6",
                          paddingTop: "12px",
                          paddingBottom: "12px",
                          color: theme.palette.primary.main,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/supportdetail/${row?.id}${clientId ? `?ci=${clientId}` : ""}`
                        )
                      }
                    >
                      {userDetails.role_id !== 1 &&
                        userDetails.role_id !== 4 && (
                          <TableCell className="">
                            <div className="flex items-center gap-10">
                              {row.is_close == 1 ? (
                                <Checkbox
                                  sx={{
                                    padding: "4px",
                                    "&:hover": {
                                      backgroundColor: "transparent", // No hover background globally
                                    },
                                  }}
                                  // color="primary"
                                  checked={true}
                                  defaultChecked={true}
                                  inputProps={{
                                    "aria-labelledby": `table - checkbox - ${index}`,
                                  }}
                                />
                              ) : (
                                <Checkbox
                                  sx={{
                                    padding: "4px",
                                    "&:hover": {
                                      backgroundColor: "transparent", // No hover background globally
                                    },
                                  }}
                                  // color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteTask(row?.id);
                                  }}
                                  defaultChecked={row.is_close}
                                  inputProps={{
                                    "aria-labelledby": `table - checkbox - ${index}`,
                                  }}
                                />
                              )}
                            </div>
                          </TableCell>
                        )}
                      <TableCell
                        scope="row"
                        className="whitespace-nowrap flex items-center justify-center"
                        align={
                          userDetails.role_id !== 1 && userDetails.role_id !== 4
                            ? "center"
                            : "left"
                        }
                      >
                        <TruncateText
                          text={`#${row?.id} / ${row?.subject}`}
                          maxWidth={200} // Specify the maximum width for truncation
                          tooltip={true} // Enable tooltip when truncated
                        />
                      </TableCell>

                      <TableCell align="center" className="whitespace-nowrap">
                        <div
                          className="text-base"
                          style={{
                            display: "inline-block",
                            backgroundColor: getBgColorOfChip(row?.status),
                            color: getTextColorOfChip(row?.status),
                            width: 95,
                            borderRadius: 40,
                            padding: 2,
                          }}
                        >
                          {removeDash(row.status) ?? "N/A"}
                        </div>
                      </TableCell>

                      <TableCell align="center" className="whitespace-nowrap">
                        {row.Department}
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        {row?.last_reply
                          ? moment(row?.last_reply).format("lll")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-base font-500
                      ${row.priority === "Low" ? "text-[#4CAF50] bg-[#4CAF502E]" : row.priority === "High" ? "text-[#F44336] bg-[#F443362E]" : "text-[#F0B402] bg-[#FFEEBB]"}`}
                        >
                          {row.priority ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        {moment(row.created_at).format("ll")}
                      </TableCell>
                      {/* <TableCell align="center" className="w-[1%]">
                        <div className="flex gap-20 pe-20 justify-center">
                          {userDetails?.role_id !== 1 && (
                            <>
                              {" "}
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
                                className={`p-2 cursor-pointer ${row.is_close == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                  if (row.is_close !== 1) {
                                    setIsOpenAddModal(true);
                                    setId(row.id);
                                  }
                                }}
                                aria-disabled={row.is_close == 1}
                              >
                                <EditIcon />
                              </span>
                              
                            </>
                          )}
                          <span className="p-2 cursor-pointer">
                            <Link to={`/supportdetail/${row.id}`}>
                              <ArrowRightCircleIcon />
                            </Link>
                          </span>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </>
            </CommonTable>
            <div
              className={`flex  ${userDetails.role_id == 1 || userDetails.role_id == 4 ? "justify-between" : "justify-end"}  py-14 px-[3rem]  overflow-x-auto whitespace-nowrap gap-20`}
            >
              <>
                {(userDetails.role_id == 1 || userDetails.role_id == 4) && (
                  <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Supports: ${PasswordState?.Support_total_items}`}</Typography>
                )}
                <CommonPagination
                  total={PasswordState?.Support_total_items}
                  limit={limit}
                  setLimit={setLimit}
                  count={PasswordState?.Support_total_records}
                  page={filters.start + 1}
                  onChange={(event, pageNumber) =>
                    checkPageNum(event, pageNumber)
                  }
                />
              </>
            </div>
          </div>
        </div>
        {/* <AddDepartmentModal isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} fetchSupportList={fetchSupportList} id={id} setId={setId} /> */}
        <ActionModal
          modalTitle="Delete Ticket!"
          modalSubTitle="Are you sure you want to delete this ticket?"
          open={openDeleteModal}
          handleToggle={() => setOpenDeleteModal((prev) => !prev)}
          type="delete"
          onDelete={onDelete}
          disabled={disable}
        />
        {/* {isOpenAddModal && ( */}
        <AddNewTicket
          isOpen={isOpenAddModal}
          setIsOpen={setIsOpenAddModal}
          fetchSupportList={fetchSupportList}
          id={id}
          setId={setId}
        />
        {/* )} */}
      </div>
    </>
  );
}
