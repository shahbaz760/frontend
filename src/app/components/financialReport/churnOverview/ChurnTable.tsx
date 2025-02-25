import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { NoDataFound } from "public/assets/icons/common";
import { CsvIcon } from "public/assets/icons/task-icons";
import { useEffect, useState } from "react";
import { downloadCSV } from "src/utils";
import CommonTable from "../../commonTable";
import TitleBar from "../../TitleBar";

const ChurnTable = ({ isLoading, churnDataList }) => {
  // state to get table heading from churnDataList
  const [churnTableHeadings, setChurnTableHeadings] = useState([""]);

  // state to get all churn revenue from churnDataList
  const [churnList, setChurnList] = useState([]);

  // state to get all voluntary list from churnDataList
  const [voluntaryList, setVoluntaryList] = useState([""]);

  // state to get all delinquent list from churnDataList
  const [delinquentList, setDelinquentList] = useState([""]);

  // state to get all total churn list from churnDataList
  const [totalChurnList, setTotalChurnList] = useState([""]);

  // useEffect to update all relevent state from churnDataList
  useEffect(() => {
    if (churnDataList?.length > 0) {
      const headings = [];
      const churn = [];
      const voluntary = [];
      const delinquent = [];
      const totalChurn = [];

      churnDataList.forEach((churnItem) => {
        headings.push(churnItem?.name);
        churn.push(churnItem?.churnRate);
        voluntary.push(churnItem?.voluntaryChurn);
        delinquent.push(churnItem?.delinquentChurn);
        totalChurn.push(churnItem?.totalChurn);
      });

      setChurnTableHeadings([...headings]);
      setChurnList([...churn]);
      setVoluntaryList([...voluntary]);
      setDelinquentList([...delinquent]);
      setTotalChurnList([...totalChurn]);
    }
  }, [churnDataList]);

  return (
    <div className="bg-[#FFFFFF] rounded-6">
      <TitleBar title="Breakdown">
        <Button
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] rounded-4 bg-[#EDEDFC] px-10"
          aria-label="Add Tasks"
          size="large"
          onClick={() => {
            const csvHeadings = ["MRR", ...churnTableHeadings];
            const csvRows = [
              ["Voluntary Churn", ...voluntaryList],
              ["Delinquent Churn", ...delinquentList],
              ["Total Revenue Churn", ...totalChurnList],
              ["Churn Rate", ...churnList],
            ];
            downloadCSV(csvHeadings, csvRows, "Churn Overview");
          }}
        >
          CSV
          <CsvIcon />
        </Button>
      </TitleBar>
      {isLoading ? (
        <ListLoading />
      ) : (
        <CommonTable headings={["MRR", ...churnTableHeadings]}>
          {churnDataList?.length > 0 ? (
            <>
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    padding: 2.2,
                    minWidth: 120, // Apply minWidth to the first 4 td elements
                  },
                }}
              >
                <TableCell align="left" className="whitespace-nowrap font-500">
                  Voluntary Churn
                </TableCell>
                {voluntaryList?.map((voluntaryItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      ${voluntaryItem}
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
                  Delinquent Churn{" "}
                </TableCell>
                {delinquentList?.map((delinquentItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      ${delinquentItem}
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
                  Total Churn{" "}
                </TableCell>
                {totalChurnList?.map((totalChurnItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      ${totalChurnItem}
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
                  Churn Rate{" "}
                </TableCell>
                {churnList?.map((churnItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {churnItem}%
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

export default ChurnTable;
