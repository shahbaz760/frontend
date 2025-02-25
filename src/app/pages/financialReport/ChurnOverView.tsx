import { getChurnList } from "app/store/financialReport/churnOverview";
import { AppDispatch, RootState } from "app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChurnOverviewChart from "src/app/components/financialReport/churnOverview/ChurnGraph";
import ChurnTable from "src/app/components/financialReport/churnOverview/ChurnTable";
import TitleBar from "src/app/components/TitleBar";

const ChurnOverView = () => {
  // Start date filter for custom date picker passed to ChurnOverviewChart as prop
  const [startDate, setStartDate] = useState<string>("");

  // End date filter for custom date picker passed to ChurnOverviewChart as prop
  const [endDate, setEndDate] = useState<string>("");

  // Type filter for custom date picker passed to ChurnOverviewChart as prop
  const [type, setType] = useState<number>(2);

  // store imports
  const dispatch = useDispatch<AppDispatch>();
  const { churnData, isLoading, over_all_report } = useSelector(
    (store: RootState) => store.financialChurnReport
  );

  // use effect to call churn list api
  useEffect(() => {
    if (type === 3 && startDate && endDate) {
      dispatch(
        getChurnList({ end_date: endDate, start_date: startDate, type })
      );
    } else if (type != 3) {
      dispatch(getChurnList({ end_date: "", start_date: "", type }));
    } else {
    }
  }, [dispatch, startDate, endDate, type]);

  return (
    <React.Fragment>
      <TitleBar title="Finance Report" />
      <div className="px-[15px] space-y-32 pb-68">
        <ChurnOverviewChart
          isLoading={isLoading}
          churnDataList={churnData}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setType={setType}
          type={type}
          over_all_report={over_all_report}
        />
        <ChurnTable isLoading={isLoading} churnDataList={churnData} />
      </div>
    </React.Fragment>
  );
};

export default ChurnOverView;
