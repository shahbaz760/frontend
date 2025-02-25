import ListLoading from "@fuse/core/ListLoading";
import {
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { GetBillingList } from "app/store/Billing";
import { filterType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import { ArrowRightCircleIcon, NoDataFound } from "public/assets/icons/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getClientId, getLabelByValue } from "src/utils";
import CommonTable from "../commonTable";
import CancelButtonPage from "./CancelModal";
import DetailsModal from "./DetailsModal";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { Link, useNavigate } from "react-router-dom";

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
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

function BillingSubscriptionHistory() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const BillingState = useSelector((state: RootState) => state.billing);
  const [page, setPage] = useState(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [name, setName] = useState<string>("");
  const [authSubcription, setauthSubcription] = useState(null);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [id, setId] = useState(null);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: 10,
    search: "",
  });
  const scrollRef = useRef();
  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetBillingList({ filters, loader: true }));

      const clientSubscription =
        res.payload.data.data.cancel_subscription_setting;
      setauthSubcription(clientSubscription);
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDepartmentList();
  }, []);

  const handleScroll = useCallback(
    debounce(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const hasMoreData = BillingState?.list?.length > 10; // Check if there's more data to fetch
        const totalRecordsFetched = BillingState?.list?.length;

        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMoreData) {
          // fetchDepartmentList().finally(() => {
          const payload = {
            start: page + 1,
            limit: 10,
            search: "",
          };
          try {
            const res = dispatch(GetBillingList({ payload, loader: false }));

            // toast.success(res?.payload?.data?.message);
            setPage(page + 1);
          } catch (error) {
            console.error("Error fetching data:", error);
          }

          // });
        }
        setLastScrollTop(scrollTop);
      }
    }, 300),
    [BillingState?.list, page]
  );
  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      //@ts-ignore
      scrolledElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrolledElement) {
        //@ts-ignore
        scrolledElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);
  const navigate = useNavigate()

  return (
    <>
      {/* <Typography className=" text-[18px]  text-[#757982]">Subscriptions</Typography> */}
      <div className="shadow-sm bg-white rounded-lg mt-10 mb-20 ">
        <div className="flex items-center justify-between  py-20 px-16">
          <h5 className="text-title text-xl font-600 flex items-center gap-12">
            Subscriptions
          </h5>
        </div>
        <div className="max-h-[250px] overflow-auto" ref={scrollRef}>
          <CommonTable
            headings={["Name", , "Frequency", "Billing Terms", "Action"]}
            headingRowProps={{
              sx: {
                textAlign: "center",
                "& th:last-child": {
                  textAlign: "center",
                },
              },
            }}
          >
            <>
              {BillingState?.list?.length === 0 &&
                BillingState?.status !== "loading" ? (
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
              ) : BillingState?.status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <ListLoading /> {/* Render your loader component here */}
                  </TableCell>
                </TableRow>
              ) : (
                BillingState?.list?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
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
                      className="items-center gap-8  flex-col sm:flex-row"
                    >
                      {row?.title || "N/A"}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="  cursor-default"
                    >
                      {getLabelByValue(row.billing_frequency)}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="whitespace-nowrap   cursor-default"
                    >
                      {row?.billing_terms === 1
                        ? "Fixed Number"
                        : row?.billing_terms === 2
                          ? "Automatically"
                          : "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="whitespace-nowrap "
                    >
                      <div className="flex gap-20 justify-end">
                        {row?.status !== 4 ? (
                          authSubcription == 1 && (
                            <CancelButtonPage
                              client_id={row?.client_id}
                              Sub_id={row?.id}
                              fetchDepartmentList={fetchDepartmentList}
                            />
                          )
                        ) : (
                          <Typography className="text-[16px]  flex items-center justify-center gap-8 text-red cursor-default">
                            Cancelled
                          </Typography>
                        )}
                        {/* <span
                          className="p-2 cursor-pointer"
                          onClick={() => {
                            setIsOpenDetailsModal(true);
                            setId(row?.id);
                            setName(row?.title);
                          }}
                        > */}
                        <span
                          className="p-2 cursor-pointer"
                          onClick={(e) => {
                            const clientId = getClientId();
                            event.preventDefault();
                            e.stopPropagation();
                            navigate(
                              `/billings/billings-detail/${row.id}${clientId ? `?ci=${clientId}` : ""}`,
                              { state: { title: row?.title } }
                            );
                          }}
                        >
                          <Typography className=" text-[16px]  flex items-center justify-center gap-8 text-[#4F46E5] cursor-pointer">
                            <ArrowRightCircleIcon /> View Details
                          </Typography>
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </>
          </CommonTable>
        </div>
      </div>

      {/* {isOpenDetailsModal && (
        <DetailsModal
          isOpen={isOpenDetailsModal}
          setIsOpen={setIsOpenDetailsModal}
          id={id}
          name={name}
        />
      )} */}
    </>
  );
}

export default BillingSubscriptionHistory;
