import { TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { NoDataFound } from "public/assets/icons/common";
import { useEffect, useState } from "react";

import ListLoading from "@fuse/core/ListLoading";
import { GetSubscriptionLog } from "app/store/Billing";
import { RootState, useAppDispatch } from "app/store/store";
import moment from "moment";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import CommonTable from "../../commonTable";
import CommonPagination from "../../pagination";
const userDetails = getUserDetail();

function SubscriptionLog({ id }) {
  const theme = useTheme();
  const BillingState = useSelector((state: RootState) => state.billing);
  const currentYear = 2024;
  const futureYears = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const [limit, setLimit] = useState(20);

  const [filters, setfilters] = useState<any>({
    subscription_id: id,
    start: 0,
    limit,
    search: "",
  });

  const dispatch = useAppDispatch();

  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetSubscriptionLog(filters));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartmentList();
  }, [filters.start, filters.search, filters.limit]);

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilters((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters;
    });
  };

  useEffect(() => {
    setfilters((prev) => {
      return {
        ...prev,
        start: 0,
        limit,
      };
    });
  }, [limit]);
  return (
    <div className="shadow-sm bg-white rounded-lg mx-[15px] ">
      <div className="flex items-center justify-between  p-24">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          Subscription Log
        </h5>
      </div>
      <CommonTable
        headings={["Title", "Price", "Date", "Statue"]}
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
          {BillingState?.BillingList?.length === 0 &&
            BillingState?.Billingstatus !== "loading" ? (
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
              <TableCell
                colSpan={7}
                align="center"
                className="whitespace-nowrap"
              >
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
          ) : BillingState?.Billingstatus === "loading" ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <ListLoading /> {/* Render your loader component here */}
              </TableCell>
            </TableRow>
          ) : (
            BillingState?.BillingList?.map((row, index) => (
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
                <TableCell scope="row" className="whitespace-nowrap">
                  {row?.title || "N/A"}
                </TableCell>
                <TableCell align="center" className="whitespace-nowrap">
                  {row?.price || "N/A"}
                </TableCell>
                <TableCell align="center" className="whitespace-nowrap">
                  {moment(row?.subscription_start_date).format("ll") || "N/A"}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ width: "300px" }}
                  className="whitespace-nowrap"
                >
                  {row?.log || "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </>
      </CommonTable>
      <div
        className={`flex ${userDetails.role_id == 1 ? "justify-between" : "justify-end"}  py-14 px-[3rem] gap-20 sm:gap-0 `}
      >
        {/* {PasswordState.status !== "loading" && ( */}
        <>
          {userDetails.role_id == 1 && (
            <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Subscription Logs: ${BillingState?.total_items}`}</Typography>
          )}
          <CommonPagination
            limit={limit}
            setLimit={setLimit}
            count={BillingState?.total_records}
            page={filters.start + 1}
            onChange={(event, pageNumber) => checkPageNum(event, pageNumber)}
          />
        </>
      </div>
    </div>
  );
}

export default SubscriptionLog;
