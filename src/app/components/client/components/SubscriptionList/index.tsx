import ListLoading from "@fuse/core/ListLoading";
import { TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { setBreadcrumbFor, setBreadcrumbs } from "app/store/breadCrumb";
import { getClientInfo, subscriptionListItem } from "app/store/Client";
import { filterType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { ArrowRightCircleIcon } from "public/assets/icons/common";
import { SubscriptionImage } from "public/assets/icons/SubscriptionImage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import dotImg from "../../../../../../public/assets/icons/dots.svg";
import LongMenu from "../../Subscription/Dropdown";

export default function SubscriptionList({ clientDetail }) {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [total, setTotal] = useState(0);
  const { client_id } = useParams();
  const [limit, setLimit] = useState(20);

  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
    // client_id: 0,
  });
  const { total_records, list, total_itemsSub, subscriptionlist } = useSelector(
    (state: RootState) => state.client
  );
  const fetchData = async () => {
    try {
      const payload = {
        client_id: client_id,
        ...filters,
      };
      //@ts-ignore
      const res = await dispatch(subscriptionListItem(payload));
      setTotal(res?.payload?.data?.data?.total_count);
      setRows(res?.payload?.data?.data?.list);
      setLoading(false);
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.start, filters.limit, filters.search]);

  const totalPageCount = Math.ceil(rows?.length / itemsPerPage);

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

  const currentRows = rows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setfilters((prevFilters) => {
      return {
        ...prevFilters,
        start: 0,
        limit,
      };
    });
  }, [limit]);

  // useEffect(() => {
  //   dispatch(getClientInfo({ client_id }));
  // }, []);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          path: `/admin/client/detail/${client_id}?type=profile`,
          label: `${clientDetail?.first_name ?? ""} ${clientDetail?.last_name ?? ""
            }`,
        },
        {
          path: "",
          label: `Subscriptions`,
        },
      ])
    );
    dispatch(setBreadcrumbFor("/client/detail"));
  }, [clientDetail]);

  const StatusMapping = (status) => {
    if (status == 0) {
      return "Pending";
    } else if (status == 1) {
      return "Completed";
    } else if (status == 2) {
      return "Paused";
    } else if (status == 3) {
      return "Expired";
    } else if (status == 4) {
      return "Cancelled";
    } else if (status == 5) {
      return "OverDue";
    } else if (status == 6) {
      return "Suspended";
    }
  };
  if (loading == true) {
    return <ListLoading />;
  }
  return (
    <>
      {currentRows?.length === 0 ? (
        <div
          className="flex flex-col justify-center align-items-center gap-40 bg-[#F7F9FB] m-20 mt-0 p-20"
          style={{ alignItems: "center" }}
        >
          <SubscriptionImage />

          <Typography className="text-[24px] text-center font-700 leading-normal">
            No subscription found !
          </Typography>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <CommonTable
            headings={["ID", "Title", "Start Date","Manual Payment", "Status", "Invoice", "", ""]}
          >
            <>
              {subscriptionlist?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell scope="row" className="font-500">
                    #{row.id}
                  </TableCell>
                  <TableCell align="center" className="font-500">
                    {row.title}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {row?.subscription_start_date}
                  </TableCell>
                  <TableCell align="center" className="whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-[1.4rem] font-500
                    `}
                    >
                      {row.is_manual_payment === 0 ? 'No' : 'Yes'}
                    </span>
                  </TableCell>

                  <TableCell align="center" className="whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] text-[1.4rem] font-500
                      ${StatusMapping(row.status)}`}
                    >
                      {`${row?.status == 0 || row?.status == 1 ? "" : ""
                        }${StatusMapping(row?.status)}`}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {row?.invoice ? <a target="_blank" href={row?.invoice} className="whitespace-nowrap cursor-pointer">
                      click here
                    </a> : 'N/A'}
                  </TableCell>

                  <TableCell
                    align="center"
                    className="whitespace-nowrap font-500"
                  >
                    {(row?.status == 0 ||
                      row?.status == 1 ||
                      row?.status == 3) && (
                        <LongMenu
                          icon={dotImg}
                          status={row?.status}
                          link={row?.subscription_payment_link}
                          id={row.id}
                          billing_frequency={row?.billing_frequency}
                        />
                      )}
                    {/* <Link to="#">
                                                   <img src={row.assignedImg} alt="dots" />
                                                </Link> */}
                  </TableCell>
                  <TableCell align="left" className="w-[1%]">
                    <div className="flex gap-20 pe-20">
                      <span className="p-2 cursor-pointer">
                        <Link
                          to={`/admin/client/subscription-detail/${row.id}`}
                        >
                          <ArrowRightCircleIcon />
                        </Link>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          </CommonTable>
        </div>
      )}
      {/* <AddAgentModel isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} /> */}
      <div className="flex justify-between py-14 px-[3rem]  gap-20 sm:gap-0 overflow-x-auto whitespace-nowrap">
        {/* {currentRows?.length > 0 && ( */}
        <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Subscriptions: ${total_itemsSub}`}</Typography>
        <CommonPagination
          total={total_itemsSub}
          limit={limit}
          setLimit={setLimit}
          count={total_records}
          onChange={(e, PageNumber: number) => checkPageNum(e, PageNumber)}
          page={filters.start + 1}
        />
        {/* )} */}
      </div>
    </>
  );
}
