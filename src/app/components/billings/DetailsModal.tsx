import { TableCell, TableRow, Theme, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { RootState, useAppDispatch } from "app/store/store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getLabelByValue, getUserDetail } from "src/utils";
// import { array } from "zod";
import ListLoading from "@fuse/core/ListLoading";
import { GetSubscriptionPlanDetails } from "app/store/Billing";
import moment from "moment";
import { NoDataFound } from "public/assets/icons/common";
import { useSelector } from "react-redux";
import CommonModal from "../CommonModal";
import CommonTable from "../commonTable";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import { useLocation, useParams } from "react-router";
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id?: any;
  name?: any;
}
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
const DetailsModal = () => {
  const [list, setList] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { subscription_id } = useParams()
  const theme: Theme = useTheme();
  const location = useLocation();
  const title = location.state?.title;
  const dispatch = useAppDispatch();
  const BillingState = useSelector((state: RootState) => state.billing);
  const userDetails = getUserDetail();
  const fetchDetails = async () => {
    try {
      const res = await dispatch(GetSubscriptionPlanDetails(subscription_id));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (
      userDetails?.role_id === 5 ||
      userDetails?.role_id === 2 ||
      userDetails.is_signed == 1
    ) {
      fetchDetails();
    }
  }, []);
  return (
    <div className="flex flex-col gap-20 mb-20  border-[#D9D9D9] rounded-[10px] overflow-hidden max-h-[300px] ">
      <div className="flex items-center gap-[18px] px-[2rem] flex-wrap">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          {title} items
        </h5>
      </div>
      <CommonTable
        headings={[
          "Name",
          "Description",
          "Frequency",
          "No. of Payment",
          "Active until",
          "Net Price",
          "Quantity",
          "Billing Terms",
          "Start Date",
        ]}
      >
        {BillingState?.planList?.length === 0 &&
          BillingState?.planstatus !== "loading" ? (
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
            <TableCell colSpan={10} align="center">
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
        ) : BillingState?.planstatus == "loading" ? (
          <TableRow>
            <TableCell colSpan={10} align="center">
              <ListLoading /> {/* Render your loader component here */}
            </TableCell>
          </TableRow>
        ) : (
          BillingState &&
          BillingState?.planList?.map((row, index) => (
            <TableRow key={index}>
              <TableCell scope="row" className=" px-[6px]">
                <div
                  className="py-2 flex pl-20 "
                  style={{ alignItems: "center" }}
                >
                  {row?.product_name ? (
                    <TruncateText text={row?.product_name} maxWidth={200} />
                  ) : (
                    "N/A"
                  )}
                  {/* {row.name} */}
                </div>
              </TableCell>
              <TableCell align="center" className="">
                {row?.description ? (
                  <div className="flex justify-center">
                    <TruncateText text={row?.description} maxWidth={200} />
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row.billing_frequency
                  ? getLabelByValue(row.billing_frequency)
                  : "N/A"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row.no_of_payments ? row?.no_of_payments : "0"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row.active_until ? row?.active_until : "N/A"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row.net_price ? row?.net_price : "N/A"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row.quantity ? row?.quantity : "N/A"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row?.billing_terms == 1 ? "Fixed Number" : "Automatically"}
              </TableCell>
              <TableCell
                align="center"
                className="whitespace-nowrap "
              >
                {row?.start_date
                  ? moment(row?.start_date).format("DD/MM/YYYY")
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))
        )}
      </CommonTable>
    </div>
  );
}
export default DetailsModal;