import i18next from "i18next";
import { getPermission, getUserDetail } from "src/utils";

import AccManagerDashboard from "./AccManagerDashBoard";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashBoard";
import Dashboard from "./Dashboard";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import AgentDashBoard from "./AgentDashBoard";
// import NewAgentDashBoard from "./NewAgentDashBoard";

i18next.addResourceBundle("en", "dashboardPage", en);
i18next.addResourceBundle("tr", "dashboardPage", tr);
i18next.addResourceBundle("ar", "dashboardPage", ar);

const data = getUserDetail();
let permissionRoute;
permissionRoute = getPermission(data);
setTimeout(() => {
  permissionRoute = getPermission(data);
}, 20);
const commonSetting = {
  settings: {
    layout: {},
  },
};
/**
 * The Dashboard page config.
 */
export const AdminDashboardConfig = {
  ...commonSetting,
  routes: [
    {
      path: "admin/dashboard",
      element: <AdminDashboard />,
    },
  ],
};

/**
 * The Dashboard page config.
 */
export const ClientDashboardConfig = {
  ...commonSetting,
  routes: [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ],
};

export const AgentDashboardConfig = {
  ...commonSetting,
  routes: [
    {
      path: "agent/dashboard",
      element: <AgentDashBoard />,
      // element: <NewAgentDashBoard />,
    },
  ],
};
export const AccMangerConfig = {
  ...commonSetting,
  routes: [
    {
      path: "accountManager/dashboard",
      element: <AdminDashboard />,
    },
  ],
};
export const UserConfig = {
  ...commonSetting,
  routes: [
    {
      path: "user/dashboard",
      element: <AccManagerDashboard />,
    },
  ],
};
// export default DashboardConfig;
