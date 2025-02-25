import { getMrrList } from "app/store/financialReport/mrrOverview";
import { AppDispatch, RootState } from "app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerOverviewTable from "src/app/components/financialReport/customerOverview/CustomerOverviewTable";
import GrowthRateGraph from "src/app/components/financialReport/growthRate/GrowthRateGraph";
import MrrGraph from "src/app/components/financialReport/MrrOverview/MrrGraph";
import MrrTable from "src/app/components/financialReport/MrrOverview/MrrTable";
import TitleBar from "src/app/components/TitleBar";

const MrrOverview = () => {
  // Start date filter for custom date picker passed to customerChart as prop
  const [startDate, setStartDate] = useState<string>("");

  // End date filter for custom date picker passed to customerChart as prop
  const [endDate, setEndDate] = useState<string>("");

  // Type filter for custom date picker passed to customerChart as prop
  const [type, setType] = useState<number>(2);

  // store imports
  const dispatch = useDispatch<AppDispatch>();
  const { mrrData, isLoading, over_all_report } = useSelector(
    (store: RootState) => store.financialMrrOverview
  );

  // use effect to call customer list api
  useEffect(() => {
    if (type === 3 && startDate && endDate) {
      dispatch(
        getMrrList({
          end_date: endDate,
          start_date: startDate,
          type,
        })
      );
    } else if (type != 3) {
      dispatch(getMrrList({ end_date: "", start_date: "", type }));
    } else {
    }
  }, [dispatch, startDate, endDate, type]);

  return (
    <React.Fragment>
      <TitleBar title="Finance Report" />
      <div className="px-[15px] space-y-32 pb-68">
        <MrrGraph
          isLoading={isLoading}
          growthRateDataList={mrrData}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setType={setType}
          type={type}
          over_all_report={over_all_report}
        />
        <MrrTable isLoading={isLoading} mrrDataList={mrrData} />
      </div>
    </React.Fragment>
  );
};

export default MrrOverview;
