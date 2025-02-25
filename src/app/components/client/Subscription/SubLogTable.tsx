import { useState } from "react";
import CommonTable from "../../commonTable";

import { TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { NoDataFound } from "public/assets/icons/common";

const rows = [];
const SubLogTable = () => {
  const theme = useTheme();
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);

  const formik = useFormik({
    initialValues: {
      month: "",
      year: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });
  return (
    <div className="bg-white rounded-lg shadow-sm py-[2rem] mx-28">
      <div className="flex items-center justify-between   px-[2rem] mb-10">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          Subscription Log
        </h5>
      </div>
      <CommonTable
        headings={["Title", "Date", "Status"]}
        headingRowProps={{
          sx: {
            textAlign: "center",
            "& th:last-child": {
              textAlign: "center",
            },
          },
        }}
      >
        {rows.length == 0 ? (
          <TableRow
            sx={{
              "& td": {
                borderBottom: "1px solid #EDF2F6",
                paddingTop: "12px",
                paddingBottom: "12px",
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
        ) : (
          <>
            {rows?.map((row, index) => (
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
                <TableCell scope="row" className="font-500">
                  {row.title}
                </TableCell>
                <TableCell align="center" className="font-500">
                  ${row.Date}
                </TableCell>
                <TableCell align="center" className="font-500">
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </CommonTable>
    </div>
  );
};

export default SubLogTable;
