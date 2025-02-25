import ListLoading from "@fuse/core/ListLoading";
import {
  ActiveCustomerIcon,
  Arrow1,
  CurrentCustomerIcon,
  CurrentMrrIcon,
} from "public/assets/icons/common";
import React from "react";
import { formatCurrency } from "src/utils";

const PreviewBoxes = ({ previewData, isLoading }) => {
  return (
    <div className="previewBoxes grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full items-center justify-between gap-6 overflow-hidden">
      <div className="bg-[#C7C4F6] rounded-lg p-[20px] min-h-[200px] relative overflow-hidden w-full">
        <Arrow1 color="#4F46E5" />
        <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
          Current MRR{" "}
        </div>
        {isLoading ? (
          <ListLoading />
        ) : (
          <div className="text-indigo-600 text-[30px] font-bold font-['Inter'] mt-[8px] h-[53.96px]">
            {formatCurrency(previewData?.current_mmr)}
          </div>
        )}
        <div className="financialDashboardPrevieImgs">
          <CurrentMrrIcon />
        </div>
      </div>
      <div className="bg-[#BAEAFE] shadow rounded-lg p-[20px] min-h-[200px] relative overflow-hidden w-full">
        <Arrow1 color="#2BA7DB" />
        <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
          Current Customers
        </div>
        {isLoading ? (
          <ListLoading />
        ) : (
          <div className="text-indigo-600 text-[30px] font-bold font-['Inter'] mt-[8px] h-[53.96px]">
            {previewData?.current_customers}
          </div>
        )}
        <div className="financialDashboardPrevieImgs">
          <CurrentCustomerIcon />{" "}
        </div>
      </div>
      <div className="bg-[#F2CBFB] rounded-lg p-[20px] min-h-[200px] relative overflow-hidden w-full">
        <Arrow1 color="#A54BBB" />
        <div className="text-gray-900 text-[16px] font-medium font-['Inter'] mt-[23px]">
          Active Customers
        </div>

        {isLoading ? (
          <ListLoading />
        ) : (
          <div className="text-indigo-600 text-[30px] font-bold font-['Inter'] mt-[8px] h-[53.96px]">
            {previewData?.active_customers}
          </div>
        )}
        <div className="financialDashboardPrevieImgs">
          <ActiveCustomerIcon />{" "}
        </div>
      </div>
    </div>
  );
};

export default PreviewBoxes;
