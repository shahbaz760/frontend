import { useEffect, useRef, useState } from "react";
import CommonTable from "../../commonTable";

import {
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { getLabelByValue } from "src/utils";
import { ClientRootState } from "app/store/Client/Interface";
import { useSelector } from "react-redux";

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

const ItemTable = ({ rows, description }) => {
  const theme = useTheme();
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);
  const [data, setData] = useState(rows?.subscription_plans);
  const { clientDetail, globalfess }: any = useSelector(
    (store: ClientRootState) => store?.client
  );
  const formik = useFormik({
    initialValues: {
      month: "",
      year: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });
  useEffect(() => {
    setData(rows?.subscription_plans);
  }, [rows]);

  let discountedSubtotal;

  if (rows.one_time_discount_type == 2) {
    discountedSubtotal = rows?.subtotal - rows?.one_time_discount;
  } else {
    discountedSubtotal =
      rows.subtotal - (rows?.subtotal * rows?.one_time_discount) / 100;
  }
  return (
    <div
      className="bg-white rounded-lg shadow-sm py-[2rem] 
    mx-[15px] mb-[3rem]"
    >
      <div className="flex items-center gap-[18px] pb-24 px-[2rem] flex-wrap">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          {rows?.title} items
        </h5>
      </div>

      <CommonTable
        headings={[
          "Name",
          "Description",
          "Frequency",
          "No. of Payment",
          "Unit Discount",
          "Unit Price",
          "Net Price",
          "Quantity",
          "Billing Terms",
          "Start Date",
        ]}
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
          {data?.map((row, index) => (
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
                className="items-center gap-8 font-500 flex-col sm:flex-row"
              >
                {row?.product_name ? row?.product_name : "---"}
              </TableCell>
              <TableCell align="center" className="font-500">
                {row?.description ? (
                  <TruncateText text={row?.description} maxWidth={200} />
                ) : (
                  "---"
                )}
              </TableCell>

              <TableCell align="center" className="font-500">
                {getLabelByValue(row.billing_frequency)}
              </TableCell>

              <TableCell align="center" className="font-500">
                {rows?.no_of_payments ? rows?.no_of_payments : "0"}
              </TableCell>
              <TableCell align="center" className="font-500">
                {/* {row?.unit_discount ? row?.unit_discount : "N/A"} */}
                {row?.unit_discount
                  ? `${row?.unit_discount_type == 2 ? "$" : ""}${row.unit_discount
                  }${row?.unit_discount_type == 1 ? "%" : ""}`
                  : "N/A"}
              </TableCell>
              <TableCell align="center" className="font-500">
                ${row?.unit_price ? row?.unit_price : "---"}
              </TableCell>
              <TableCell align="center" className="whitespace-nowrap font-500">
                ${row?.net_price ? row?.net_price : "---"}
              </TableCell>

              <TableCell align="center" className="whitespace-nowrap font-500">
                {row?.quantity ? row?.quantity : "---"}
              </TableCell>
              <TableCell align="center" className="whitespace-nowrap font-500">
                {/* {rows?.billing_terms == 1
                  ? "Fixed Number"
                  : ("Automatically" || "N/A")} */}
                {rows?.billing_terms === 1
                  ? "Fixed Number"
                  : rows?.billing_terms != 1
                    ? "Automatically"
                    : "N/A"}
              </TableCell>
              <TableCell align="center" className="whitespace-nowrap font-500">
                {rows?.subscription_start_date
                  ? moment(rows?.subscription_start_date).format("DD/MM/yyyy")
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </>
      </CommonTable>
      <div className="bg-[#F7F9FB] mt-[44px] mx-[16px] px-[22px] py-[18px] rounded-8">
        <Typography
          sx={{
            // paddingBottom: "40px",
            color: "gray",
          }}
          variant="body1"
        >
          <span
            style={{
              color: "black",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            Note :{" "}
          </span>
          {description ? description : "N/A"}
        </Typography>
      </div>
      <div className="bg-[#F7F9FB] mt-[44px] mx-[16px] px-[22px] py-[18px] rounded-8">
        <div className="flex items-center gap-[18px]  ">
          <p className="text-title text-xl font-600 ">Subtotal</p>
          <div className="border-1 border-dashed w-full"></div>
          <p className="text-title text-xl font-600 ">${rows?.subtotal}</p>
        </div>
        {rows?.global_processing_fee !== null &&
          rows?.global_processing_fee !== 0 && (
            <div className="flex items-center gap-[18px] mt-5">
              <p className="text-title text-xl font-600 w-max sm:whitespace-nowrap whitespace-pre-line">
                {rows?.global_processing_fee_description} (
                {rows?.global_processing_fee}% on {Number(discountedSubtotal)})
              </p>
              <div className="border-1 border-dashed w-full"></div>
              <p className="text-title text-xl font-600 w-max whitespace-nowrap ">
                ${(rows?.global_processing_fee * discountedSubtotal) / 100}
              </p>
            </div>
          )}
        <div className="flex items-center gap-[18px] mt-[16px] ">
          <p className="text-title text-[18px] font-600 w-max whitespace-pre-line md:whitespace-nowrap">
            Additional Discount
          </p>
          <div className="border-1 border-dashed w-full"></div>
          <p className="text-title text-xl font-600 ">
            {rows?.one_time_discount
              ? `${rows?.one_time_discount_type == 2 ? "$" : ""}${rows.one_time_discount
              }${rows?.one_time_discount_type == 1 ? "%" : ""}`
              : "N/A"}
          </p>
        </div>
      </div>
      <p className="text-[#4F46E5] text-[20px] font-700 text-right mt-[16px] mr-[38px]">
        <span className="text-[#111827] text-[20px] font-500 ">Total : </span>$
        {rows?.total_price ? rows?.total_price : "0"}
      </p>
    </div>
  );
};

export default ItemTable;
