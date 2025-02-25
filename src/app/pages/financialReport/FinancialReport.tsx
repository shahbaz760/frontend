import ListLoading from "@fuse/core/ListLoading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import {
  financialReportCustomerActivityApi,
  financialReportDashboardApi,
} from "app/store/financialReport";
import { AppDispatch, RootState } from "app/store/store";
import { NoDataFound } from "public/assets/icons/common";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerActivityCard from "src/app/components/financialReport/dashboard/CustomerActivityCard";
import FinancialAreaGraph from "src/app/components/financialReport/dashboard/FinancialAreaGraph";
import FinancialDashboardGraph from "src/app/components/financialReport/dashboard/FinancialDashboardGraph";
import PreviewBoxes from "src/app/components/financialReport/dashboard/PreviewBoxes";
import TitleBar from "src/app/components/TitleBar";

const FinancialReport = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [type, setType] = useState(0);
  const [limit, setLimit] = useState(20); // Initialize limit for pagination
  const [start, setStart] = useState(0); // Initialize start

  const {
    over_all_report,
    growth,
    customerActivityList,
    newCustomers,
    churn,
    isLoadingLeftContent,
    isLoadingRightContent,
    customerActivityTotalRecords,
    reactivation,
    overAllGrowth,
    overAllGrowthRate,
    overAllNewCustomers,
    overAllNewCustomersRate,
    overAllChurn,
    overAllChurnRate,
    overAllReactivation,
    overAllReactivationRate,
  } = useSelector((store: RootState) => store.financialReportDashboard);

  useEffect(() => {
    dispatch(financialReportDashboardApi({ type }));
  }, [type]);

  useEffect(() => {
    dispatch(financialReportCustomerActivityApi({ start, limit }));
  }, [dispatch]);

  // Function to load more data
  const loadMoreCustomerActivity = useCallback(() => {
    if (!isLoadingRightContent) {
      setLimit((prevLimit) => prevLimit + 20);
      dispatch(financialReportCustomerActivityApi({ start, limit }));
    }
  }, [limit, isLoadingRightContent, dispatch]);

  // Debounced scroll handler
  const debounce = (func: () => void, delay: number) => {
    let debounceTimer: NodeJS.Timeout;
    return () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(), delay);
    };
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && !isLoadingRightContent) {
      if (customerActivityList?.length < customerActivityTotalRecords)
        debounce(loadMoreCustomerActivity, 300)(); // Adding 300ms debounce
    }
  };

  return (
    <div className="bg-[#f5f6fa00]">
      <TitleBar title="Finance Report" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-16 gap-28 mb-20">
        {/* left side content of financial-report */}
        <div className="lg:col-span-2 space-y-24">
          <PreviewBoxes
            previewData={over_all_report}
            isLoading={isLoadingLeftContent}
          />
          <FinancialDashboardGraph
            growthData={growth}
            setType={setType}
            type={type}
            isLoading={isLoadingLeftContent}
            overAllGrowth={overAllGrowth}
            overAllGrowthRate={overAllGrowthRate}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-28">
            <FinancialAreaGraph
              height={200}
              graphName={"New Customer"}
              graphData={newCustomers}
              type={type}
              isLoading={isLoadingLeftContent}
              overAllData={overAllNewCustomers}
              overAllRate={overAllNewCustomersRate}
            />
            <FinancialAreaGraph
              height={200}
              type={type}
              graphName={"Churn"}
              graphData={churn}
              isLoading={isLoadingLeftContent}
              overAllData={overAllChurn}
              overAllRate={overAllChurnRate}
            />
            <FinancialAreaGraph
              height={200}
              type={type}
              graphName={"Reactivations"}
              graphData={reactivation}
              isLoading={isLoadingLeftContent}
              overAllData={overAllReactivation}
              overAllRate={overAllReactivationRate}
            />
          </div>
        </div>

        {/* right side content of financial-report */}
        <div className="rounded-8 bg-[#FFFFFF] h-full">
          {/* <TitleBar title="Breakdown" /> */}
          {/* <div className="px-12">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Accordion 1
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                Accordion 2
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
          </div> */}
          <TitleBar title="Customer Activity" color={true} />
          <div
            className="border-t-1 my-3 p-20 flex flex-col gap-10 h-[1100px]  overflow-auto   lg:h-[1290px]
            sm:h-[1925px]
            md:h-[1925px]
            [@media(min-width:950px)_and_(max-width:1100px)]:h-[1633px]"
            onScroll={handleScroll}
          >
            {isLoadingRightContent && <ListLoading />}
            {customerActivityList?.map((item) => (
              <CustomerActivityCard key={item?.id} customerData={item} />
            ))}
            {customerActivityList.length == 0 &&
              isLoadingRightContent == false && (
                <div
                  className="flex flex-col justify-center align-items-center gap-20 min-h-[400px] py-40"
                  style={{ alignItems: "center" }}
                >
                  <NoDataFound />
                  <Typography className="text-[24px] text-center font-600 leading-normal">
                    No Activity found !
                  </Typography>
                </div>
              )}
            {/* {isLoadingRightContent && <ListLoading />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
