import { Avatar } from "@mui/material";
import moment from "moment";
import React from "react";
import { formatCurrency } from "src/utils";

const CustomerActivityCard = ({ customerData }) => {
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  return (
    <div className="flex justify-between gap-28 border-b-1 pb-10">
      <div className="avatar">
        {" "}
        <Avatar
          alt="Remy Sharp"
          src={
            customerData?.user_image
              ? urlForImage + customerData?.user_image
              : ""
          }
        />
      </div>
      <div className="activityContent flex-1 flex justify-start flex-col gap-8">
        <div className="flex w-full justify-between ">
          <span className="font-500 text-[14px] text-[#151D48]">
            {customerData?.subscription_name
              ? customerData?.subscription_name
              : "N/A"}
          </span>
          <span className="font-400 text-[12px] text-[#757982] whitespace-nowrap">
            {moment(customerData?.created_at).format("ll")}
          </span>
        </div>
        <p className="font-400 text-[12px] text-[#757982]">
          {customerData?.userName ? customerData?.userName : ""}-{" "}
          {customerData?.email ? customerData?.email : "N/A"}
        </p>
        <p className="font-500 text-[14px] text-[#4F46E5]">
          {customerData?.log ? customerData?.log : "N/A"} |{" "}
          {formatCurrency(customerData?.price)}
        </p>
      </div>
    </div>
  );
};

export default CustomerActivityCard;
