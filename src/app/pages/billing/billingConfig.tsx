import i18next from "i18next";
import Billing from "./Billing";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import BillingDetails from "src/app/components/billings/BillingDetails";

// const Billing = lazy(() => import("./Billing"));

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

/**
 * The Tasks page config.
 */
const BillingConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/billings",
      element: <Billing />,
    },
    {
      path: "/billings/billings-detail/:subscription_id",
      element: <BillingDetails />,
    },
  ],
};

export const AdminBillingConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/billings",
      element: <Billing />,
    },
    {
      path: "admin/billings/billings-details/:subscription_id",
      element: <BillingDetails />,
    },
  ],
};

export default BillingConfig;
