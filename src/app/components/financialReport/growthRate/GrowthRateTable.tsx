import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { NoDataFound } from "public/assets/icons/common";
import { CsvIcon } from "public/assets/icons/task-icons";
import { useEffect, useState } from "react";
import { downloadCSV, formatCurrency } from "src/utils";
import CommonTable from "../../commonTable";
import TitleBar from "../../TitleBar";

const GrowthRateTable = ({ isLoading, growthDataList }) => {
  // state to get table heading from growthDataList
  const [growthRateTableHeadings, setGrowthRateTableHeadings] = useState([""]);

  // state to get all voluntary list from growthDataList
  const [newList, setNewList] = useState([""]);

  // state to get all delinquent list from growthDataList
  const [reactivationList, setReactivationList] = useState([""]);

  // state to get all total churn list from growthDataList
  const [growthRateList, setGrowthRateList] = useState([""]);

  // state to get all total churn list from growthDataList
  const [mrrList, setMrrList] = useState([""]);

  // state to get all total churn list from growthDataList
  const [churnList, setChurnList] = useState([""]);

  // useEffect to update all relevent state from growthDataList
  useEffect(() => {
    if (growthDataList?.length > 0) {
      const headings = [];
      const churn = [];
      const growthRate = [];
      const newCustomers = [];
      const reactivation = [];
      const mrr = [];

      growthDataList.forEach((growthRateItem) => {
        headings.push(growthRateItem?.name);
        newCustomers.push(growthRateItem?.new);
        reactivation.push(growthRateItem?.reactivation);
        growthRate.push(growthRateItem?.growth_rate);
        churn.push(growthRateItem?.churn);
        mrr.push(growthRateItem?.net_new_mrr);
      });

      setGrowthRateTableHeadings([...headings]);
      setNewList([...newCustomers]);
      setReactivationList([...reactivation]);
      setMrrList([...mrr]);
      setGrowthRateList([...growthRate]);
      setChurnList([...churn]);
    }
  }, [growthDataList]);

  return (
    <div className="bg-[#FFFFFF] rounded-6">
      <TitleBar title="Breakdown">
        <Button
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] rounded-4 bg-[#EDEDFC] px-10"
          aria-label="Add Tasks"
          size="large"
          onClick={() => {
            const csvHeadings = ["", ...growthRateTableHeadings];
            const csvRows = [
              ["New", ...newList],
              ["Reactivations", ...reactivationList],
              ["Growth Rate", ...growthRateList],
              ["MRR", ...mrrList],
              ["Churn", ...churnList],
            ];
            downloadCSV(csvHeadings, csvRows, "Growth_Rate");
          }}
        >
          CSV
          <CsvIcon />
        </Button>
      </TitleBar>
      {isLoading ? (
        <ListLoading />
      ) : (
        <CommonTable headings={["", ...growthRateTableHeadings]}>
          {growthDataList?.length > 0 ? (
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
                  Net New
                </TableCell>
                {newList?.map((newCustomerItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(newCustomerItem)}
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
                  Reactivations{" "}
                </TableCell>
                {reactivationList?.map((reactivationItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(reactivationItem)}
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
                  Net New MRR{" "}
                </TableCell>
                {mrrList?.map((mrrItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {formatCurrency(mrrItem)}
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
                  Growth Rate{" "}
                </TableCell>
                {growthRateList?.map((growthRateItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {growthRateItem}%
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

export default GrowthRateTable;
