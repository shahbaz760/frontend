import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { NoDataFound } from "public/assets/icons/common";
import { CsvIcon } from "public/assets/icons/task-icons";
import { useEffect, useState } from "react";
import { downloadCSV } from "src/utils";
import CommonTable from "../../commonTable";
import TitleBar from "../../TitleBar";

const CustomerOverviewTable = ({ isLoading, customerDataList }) => {
  // state to get table heading from customerDataList
  const [customerTableHeadings, setCustomerTableHeadings] = useState([""]);

  // state to get all voluntary list from customerDataList
  const [newCustomerList, setNewCustomerList] = useState([""]);

  // state to get all delinquent list from customerDataList
  const [reactivationList, setReactivationList] = useState([""]);

  // state to get all total churn list from customerDataList
  const [delinquentList, setDelinquentList] = useState([""]);

  // state to get all total churn list from customerDataList
  const [voluntaryList, setVoluntaryList] = useState([""]);

  // state to get all total churn list from customerDataList
  const [existingList, setExistingList] = useState([""]);

  // state to get all total churn list from customerDataList
  const [totalCustomerList, setTotalCustomer] = useState([""]);

  // state to get all total churn list from customerDataList
  const [activeCustomerList, setActiveCustomerList] = useState([""]);

  // useEffect to update all relevent state from customerDataList
  useEffect(() => {
    if (customerDataList?.length > 0) {
      const headings = [];
      const voluntary = [];
      const delinquent = [];
      const existing = [];
      const newCustomers = [];
      const reactivation = [];
      const totalCustomers = [];
      const activeCustomers = [];

      customerDataList.forEach((customerItem) => {
        headings.push(customerItem?.name);
        newCustomers.push(customerItem?.new);
        reactivation.push(customerItem?.reactivation);
        voluntary.push(customerItem?.voluntary_churn);
        delinquent.push(customerItem?.deliquent_churn);
        existing.push(customerItem?.existing);
        totalCustomers.push(customerItem?.total_customers);
        activeCustomers.push(customerItem?.active_cutomers);
      });

      setCustomerTableHeadings([...headings]);
      setNewCustomerList([...newCustomers]);
      setReactivationList([...reactivation]);
      setVoluntaryList([...voluntary]);
      setDelinquentList([...delinquent]);
      setExistingList([...existing]);
      setTotalCustomer([...totalCustomers]);
      setActiveCustomerList([...activeCustomers]);
    }
  }, [customerDataList]);

  return (
    <div className="bg-[#FFFFFF] rounded-6">
      <TitleBar title="Breakdown">
        <Button
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] rounded-4 bg-[#EDEDFC] px-10"
          aria-label="Add Tasks"
          size="large"
          onClick={() => {
            const csvHeadings = ["", ...customerTableHeadings];
            const csvRows = [
              ["New Customers", ...newCustomerList],
              ["Reactivations", ...reactivationList],
              ["Voluntary Churn", ...voluntaryList],
              ["Delinquent Churn", ...delinquentList],
              ["Existing", ...existingList],
              ["Customers", ...totalCustomerList],
              ["Active Customer", ...activeCustomerList],
            ];
            downloadCSV(csvHeadings, csvRows, "Customer_Overview");
          }}
        >
          CSV
          <CsvIcon />
        </Button>
      </TitleBar>
      {isLoading ? (
        <ListLoading />
      ) : (
        <CommonTable headings={["", ...customerTableHeadings]}>
          {customerDataList?.length > 0 ? (
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
                  New Customers
                </TableCell>
                {newCustomerList?.map((newCustomerItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {newCustomerItem}
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
                      {reactivationItem}
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
                  Voluntary Churn{" "}
                </TableCell>
                {voluntaryList?.map((voluntaryItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {voluntaryItem}
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
                      {delinquentItem}
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
                  Existing{" "}
                </TableCell>
                {existingList?.map((existingItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {existingItem}
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
                  Total Customers{" "}
                </TableCell>
                {totalCustomerList?.map((totalCustomerItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {totalCustomerItem}
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
                  Active Customers{" "}
                </TableCell>
                {activeCustomerList?.map((activeCustomerItem) => {
                  return (
                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {activeCustomerItem}
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

export default CustomerOverviewTable;
