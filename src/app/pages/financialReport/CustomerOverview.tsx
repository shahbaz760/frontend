import { getCustomerList } from "app/store/financialReport/customerOverview";
import { AppDispatch, RootState } from "app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerOverviewChart from "src/app/components/financialReport/customerOverview/CustomerOverviewGraph";
import CustomerOverviewTable from "src/app/components/financialReport/customerOverview/CustomerOverviewTable";
import TitleBar from "src/app/components/TitleBar";

const CustomerOverview = () => {
  // Start date filter for custom date picker passed to customerChart as prop
  const [startDate, setStartDate] = useState<string>("");

  // End date filter for custom date picker passed to customerChart as prop
  const [endDate, setEndDate] = useState<string>("");

  // Type filter for custom date picker passed to customerChart as prop
  const [type, setType] = useState<number>(2);

  // store imports
  const dispatch = useDispatch<AppDispatch>();
  const { customerData, isLoading, over_all_report } = useSelector(
    (store: RootState) => store.financialCustomerOverView
  );

  // use effect to call customer list api
  useEffect(() => {
    if (type === 3 && startDate && endDate) {
      dispatch(
        getCustomerList({
          end_date: endDate,
          start_date: startDate,
          type,
        })
      );
    } else if (type != 3) {
      dispatch(getCustomerList({ end_date: "", start_date: "", type }));
    } else {
    }
  }, [dispatch, startDate, endDate, type]);

  return (
    <React.Fragment>
      <TitleBar title="Finance Report" />
      <div className="px-[15px] space-y-32 pb-68">
        <CustomerOverviewChart
          isLoading={isLoading}
          customerDataList={customerData}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setType={setType}
          type={type}
          over_all_report={over_all_report}
        />
        <CustomerOverviewTable
          isLoading={isLoading}
          customerDataList={customerData}
        />
      </div>
    </React.Fragment>
  );
};

export default CustomerOverview;
