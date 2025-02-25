import ChurnOverView from "./ChurnOverView";
import CustomerOverview from "./CustomerOverview";
import FinancialReport from "./FinancialReport";
import GrowthRate from "./GrowthRate";
import MrrOverview from "./MrrOverview";
import RetentionReport from "./RetentionReport";

/**
 * The Tasks page config.
 */
const AdminFinancialConfigAcc = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "accountManager/financial-report",
      element: <FinancialReport />,
    },
    {
      path: "accountManager/financial-report/churn-overview",
      element: <ChurnOverView />,
    },
    {
      path: "/accountManager/financial-report/retention-rate",
      element: <RetentionReport />,
    },
    {
      path: "/accountManager/financial-report/customer_overview",
      element: <CustomerOverview />,
    },
    {
      path: "/accountManager/financial-report/growth_rate",
      element: <GrowthRate />,
    },
    {
      path: "/accountManager/financial-report/mrr_overview",
      element: <MrrOverview />,
    },
  ],
};

export default AdminFinancialConfigAcc;
