import { getGrowthRateList } from "app/store/financialReport/growthRate";
import { AppDispatch, RootState } from "app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GrowthRateGraph from "src/app/components/financialReport/growthRate/GrowthRateGraph";
import GrowthRateTable from "src/app/components/financialReport/growthRate/GrowthRateTable";
import TitleBar from "src/app/components/TitleBar";

const GrowthRate = () => {
  // Start date filter for custom date picker passed to customerChart as prop
  const [startDate, setStartDate] = useState<string>("");

  // End date filter for custom date picker passed to customerChart as prop
  const [endDate, setEndDate] = useState<string>("");

  // Type filter for custom date picker passed to customerChart as prop
  const [type, setType] = useState<number>(2);

  // store imports
  const dispatch = useDispatch<AppDispatch>();
  const { growthRateData, isLoading, over_all_report } = useSelector(
    (store: RootState) => store.financialGrowthRate
  );

  // use effect to call customer list api
  useEffect(() => {
    if (type === 3 && startDate && endDate) {
      dispatch(
        getGrowthRateList({
          end_date: endDate,
          start_date: startDate,
          type,
        })
      );
    } else if (type != 3) {
      dispatch(getGrowthRateList({ end_date: "", start_date: "", type }));
    } else {
    }
  }, [dispatch, startDate, endDate, type]);

  return (
    <React.Fragment>
      <TitleBar title="Finance Report" />
      <div className="px-[15px] space-y-32 pb-68">
        <GrowthRateGraph
          isLoading={isLoading}
          growthRateDataList={growthRateData}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setType={setType}
          type={type}
          over_all_report={over_all_report}
        />
        <GrowthRateTable
          isLoading={isLoading}
          growthDataList={growthRateData}
        />
      </div>
    </React.Fragment>
  );
};

export default GrowthRate;
