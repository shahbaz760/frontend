import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { NoDataFound } from "public/assets/icons/common";
import { CsvIcon } from "public/assets/icons/task-icons";
import { useEffect, useState } from "react";
import { downloadCSV, formatCurrency } from "src/utils";
import CommonTable from "../../commonTable";
import TitleBar from "../../TitleBar";

const RetentionTable = ({ isLoading, retentionDataList }) => {
  // state to get table heading from retentionDataList
  const [retentionTableHeadings, setRetentionTableHeadings] = useState([""]);

  // state to get all churn revenue from retentionDataList
  const [churnList, setChurnList] = useState([]);

  // state to get all voluntary list from retentionDataList
  const [reactivationsList, setReactivationsList] = useState([""]);

  // state to get all delinquent list from retentionDataList
  const [retentionRateList, setRetentionRateList] = useState([""]);

  // state to get all total churn list from retentionDataList
  const [totalNetList, setTotalNetList] = useState([""]);

  // useEffect to update all relevent state from retentionDataList
  useEffect(() => {
    if (retentionDataList?.length > 0) {
      const headings = [];
      const churn = [];
      const reactivation = [];
      const retention_rate = [];
      const total_net = [];

      retentionDataList.forEach((churnItem) => {
        headings.push(churnItem?.name);
        churn.push(churnItem?.churn);
        reactivation.push(churnItem?.reactivation);
        retention_rate.push(churnItem?.retention_rate);
        total_net.push(churnItem?.total_net);
      });

      setRetentionTableHeadings([...headings]);
      setChurnList([...churn]);
      setReactivationsList([...reactivation]);
      setRetentionRateList([...retention_rate]);
      setTotalNetList([...total_net]);
    }
  }, [retentionDataList]);

  return (
    <div className="bg-[#FFFFFF] rounded-6">
      <TitleBar title="Breakdown">
        <Button
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] rounded-4 bg-[#EDEDFC] px-10"
          aria-label="Add Tasks"
          size="large"
          onClick={() => {
            const csvHeadings = ["", ...retentionTableHeadings];
            const csvRows = [
              ["Reactivations", ...reactivationsList],
              ["Churn", ...churnList],
              ["Net Total", ...totalNetList],
              ["Retention Rate", ...churnList],
            ];
            downloadCSV(csvHeadings, csvRows, "Retention Report");
          }}
        >
          CSV
          <CsvIcon />
        </Button>
      </TitleBar>
      {isLoading ? (
        <ListLoading />
      ) : (
        <CommonTable headings={["", ...retentionTableHeadings]}>
          {retentionDataList?.length > 0 ? (
            <>
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    padding: 2.2,
                    //   color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell align="left" className="whitespace-nowrap font-500">
                  Reactivations
                </TableCell>
                {reactivationsList?.map((reactivationsItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(reactivationsItem)}
                    </TableCell>
                  );
                })}
              </TableRow>

              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    padding: 2.2,
                    //   color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell align="left" className="whitespace-nowrap font-500">
                  Total net{" "}
                </TableCell>
                {totalNetList?.map((totalChurnItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(totalChurnItem)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    padding: 2.2,
                    //   color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell align="left" className="whitespace-nowrap font-500">
                  Churn{" "}
                </TableCell>
                {churnList?.map((churnItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(churnItem)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    padding: 2.2,
                    //   color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell align="left" className="whitespace-nowrap font-500">
                  Retention Rate{" "}
                </TableCell>
                {retentionRateList?.map((retentionRateItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {retentionRateItem}%
                    </TableCell>
                  );
                })}
              </TableRow>
            </>
          ) : (
            <TableRow
              sx={{
                "& td": {
                  borderBottom: "1px solid #EDF2F6",
                  paddingTop: "12px",
                  paddingBottom: "12px",
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
          )}
        </CommonTable>
      )}
    </div>
  );
};

export default RetentionTable;
