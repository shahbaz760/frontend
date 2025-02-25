import ChurnOverView from "./ChurnOverView";
import CustomerOverview from "./CustomerOverview";
import FinancialReport from "./FinancialReport";
import GrowthRate from "./GrowthRate";
import MrrOverview from "./MrrOverview";
import RetentionReport from "./RetentionReport";

/**
 * The Tasks page config.
 */
const AdminFinancialConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/financial-report",
      element: <FinancialReport />,
    },
    {
      path: "admin/financial-report/churn-overview",
      element: <ChurnOverView />,
    },
    {
      path: "/admin/financial-report/retention-rate",
      element: <RetentionReport />,
    },
    {
      path: "/admin/financial-report/customer_overview",
      element: <CustomerOverview />,
    },
    {
      path: "/admin/financial-report/growth_rate",
      element: <GrowthRate />,
    },
    {
      path: "/admin/financial-report/mrr_overview",
      element: <MrrOverview />,
    },
  ],
};

export default AdminFinancialConfig;
