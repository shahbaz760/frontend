import { getRetentionReportList } from "app/store/financialReport/retentionReport";
import { AppDispatch, RootState } from "app/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RetentionGraph from "src/app/components/financialReport/retentionReport/RetentionGraph";
import RetentionTable from "src/app/components/financialReport/retentionReport/RetentionTable";
import TitleBar from "src/app/components/TitleBar";

const RetentionReport = () => {
  // Start date filter for custom date picker passed to retentionChart as prop
  const [startDate, setStartDate] = useState<string>("");

  // End date filter for custom date picker passed to retentionChart as prop
  const [endDate, setEndDate] = useState<string>("");

  // Type filter for custom date picker passed to retentionChart as prop
  const [type, setType] = useState<number>(2);

  // store imports
  const dispatch = useDispatch<AppDispatch>();
  const { retentionData, isLoading, over_all_report } = useSelector(
    (store: RootState) => store.financialRetentionReport
  );

  // use effect to call retention list api
  useEffect(() => {
    if (type === 3 && startDate && endDate) {
      dispatch(
        getRetentionReportList({
          end_date: endDate,
          start_date: startDate,
          type,
        })
      );
    } else if (type != 3) {
      dispatch(getRetentionReportList({ end_date: "", start_date: "", type }));
    } else {
    }
  }, [dispatch, startDate, endDate, type]);

  return (
    <React.Fragment>
      <TitleBar title="Finance Report" />
      <div className="px-[15px] space-y-32 pb-68">
        <RetentionGraph
          isLoading={isLoading}
          retentionDataList={retentionData}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setType={setType}
          type={type}
          over_all_report={over_all_report}
        />
        <RetentionTable
          isLoading={isLoading}
          retentionDataList={retentionData}
        />
      </div>
    </React.Fragment>
  );
};

export default RetentionReport;
