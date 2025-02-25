import AddClientRolePermission from "./AddClientRolePermission";
import AddRolePermission from "./AddRolePermission";
import Reminder from "./Reminder";
import Setting from "./Setting";
import Setting2FA from "./Setting2FA";
import SettingSubscription from "./SettingSubscription";

// const Setting = lazy(() => import("./Setting"));

/**
 * The Tasks page config.
 */
const SettingConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/setting",
      element: <Setting />,
    },
    {
      path: "admin/setting/add-role-permission",
      element: <AddRolePermission />,
    },
    {
      path: "admin/setting/edit-role-permission/:id",
      element: <AddRolePermission />,
    },
    {
      path: "admin/setting/2FA",
      element: <Setting2FA />,
    },
    {
      path: "admin/setting/Subscription",
      element: <SettingSubscription />,
    },
  ],
};

export const AdminUserConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/setting",
      element: <Setting />,
    },

    {
      path: "admin/setting/add-role-permission",
      element: <AddRolePermission />,
    },
    {
      path: "admin/setting/edit-role-permission/:id",
      element: <AddRolePermission />,
    },
    {
      path: "admin/setting/2FA",
      element: <Setting2FA />,
    },

  ],
};

export const clientSettingConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/settings",
      element: <Setting />,
    },
    {
      path: "/settings/reminder",
      element: <Reminder />,
    },
    {
      path: "/settings/add-role-permission",
      element: <AddClientRolePermission />,
    },
    {
      path: "/settings/edit-role-permission/:id",
      element: <AddClientRolePermission />,
    },
  ],
};

export default SettingConfig;
