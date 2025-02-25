import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { GetBillingHistory } from "app/store/Billing";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import moment from "moment";
import { BillingClock, NoDataFound } from "public/assets/icons/common";
import { FilterIcon } from "public/assets/icons/user-icon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import CommonTable from "../commonTable";
import DropdownMenu from "../Dropdown";
import CommonPagination from "../pagination";
import SelectField from "../selectField";
const userDetails = getUserDetail();

function BillingHistory() {
  const theme = useTheme();
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);
  const BillingState = useSelector((state: RootState) => state.billing);
  const currentYear = 2024;
  const futureYears = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const [limit, setLimit] = useState(20);
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const [filters, setfilters] = useState<any>({
    start: 0,
    limit,
    search: "",
    filter: {
      month: 0,
      year: 0,
    },
  });

  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      month: "",
      year: "",
    },
    onSubmit: (values) => {
      setfilters({
        ...filters,
        filter: {
          ...filters.filter,
          month: values.month,
          year: values.year,
        },
      });
    },
  });

  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetBillingHistory(filters));
      setFilterMenu(null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartmentList();
  }, [filters.start, filters.limit, filters.search, filters.filter]);

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
    <div className="shadow-sm bg-white rounded-lg ">
      <div className="flex items-center justify-between  p-24">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          <BillingClock className="text-secondary" /> Billing History
        </h5>
        <DropdownMenu
          handleClose={() => {
            setFilterMenu(null);
            if (!isFilter) {
              formik.resetForm();
            }
          }}
          anchorEl={filterMenu}
          button={
            <Button
              variant="text"
              className={`h-[40px] text-[16px] flex gap-12 text-para_light whitespace-nowrap ${isFilter ? "text-secondary bg-[#EDEDFC]" : ""}`}
              aria-label="Add User"
              size="large"
              onClick={(event) => setFilterMenu(event.currentTarget)}
            >
              <FilterIcon
                className="shrink-0"
                fill={isFilter ? "#4F46E5" : "#757982"}
              />
              Filter
            </Button>
          }
          popoverProps={{
            open: !!filterMenu,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            classes: {
              paper: "pt-0 pb-0",
            },
          }}
        >
          <div className="w-[240px]">
            <div className="text-black text-lg font-500 px-20 py-16 border-b border-b-[#EDF2F6]">
              Filter Option
            </div>
            <div className="px-20 py-14 flex flex-col gap-14">
              <SelectField
                label="Month"
                name="month"
                formik={formik}
                placeholder="Select Month"
                sx={{
                  "&.MuiInputBase-root": {
                    "& .MuiSelect-select": {
                      minHeight: "40px",
                    },
                  },
                }}
              >
                <MenuItem value="1">January</MenuItem>
                <MenuItem value="2">February</MenuItem>
                <MenuItem value="3">March</MenuItem>
                <MenuItem value="4">April</MenuItem>
                <MenuItem value="5">May</MenuItem>
                <MenuItem value="6">June</MenuItem>
                <MenuItem value="7">July</MenuItem>
                <MenuItem value="8">August</MenuItem>
                <MenuItem value="9">September</MenuItem>
                <MenuItem value="10">Octomber</MenuItem>
                <MenuItem value="11">November</MenuItem>
                <MenuItem value="12">December</MenuItem>
              </SelectField>
              <SelectField
                label="Year"
                name="year"
                formik={formik}
                placeholder="Select Year"
                sx={{
                  "&.MuiInputBase-root": {
                    "& .MuiSelect-select": {
                      minHeight: "40px",
                    },
                  },
                }}
              >
                {futureYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </SelectField>
              <div className="flex items-center justify-end gap-6 px-20 text-sm">
                <Button
                  variant="text"
                  className="text-para text-sm"
                  disabled={!formik?.values?.month && !formik.values?.year}
                  onClick={() => {
                    formik.resetForm();

                    setFilterMenu(null);
                    setIsFilter(false);
                    if (
                      filters.filter.month !== 0 &&
                      filters.filter.year !== 0
                    ) {
                      setfilters({
                        ...filters,
                        filter: {
                          ...filters.filter,
                          month: 0,
                          year: 0,
                        },
                      });
                    }
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  className="text-sm"
                  disabled={!formik?.values?.month && !formik.values?.year}
                  onClick={() => {
                    formik.handleSubmit(), setIsFilter(true);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <CommonTable
        headings={["Date", "Description", "Amount", "Invoice"]}
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
                  {moment(row?.subscription_start_date).format("ll") || "N/A"}
                </TableCell>
                <TableCell align="center" className="whitespace-nowrap">
                  {row?.description || "N/A"}
                </TableCell>
                <TableCell align="center">${row?.price}</TableCell>
                <TableCell align="center">
                  <a target="_blank" href={row?.invoice} className="whitespace-nowrap">
                    click here
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </>
      </CommonTable>
      <div
        className={`flex ${userDetails.role_id == 1 ? "justify-between" : "justify-end"}  py-14 px-[3rem]`}
      >
        {/* {PasswordState.status !== "loading" && ( */}
        <>
          {userDetails.role_id == 1 && (
            <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Billing History: ${BillingState?.total_items}`}</Typography>
          )}
          <CommonPagination
            total={BillingState?.total_items}
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

export default BillingHistory;
