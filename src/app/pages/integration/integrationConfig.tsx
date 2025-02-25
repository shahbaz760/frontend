import i18next from "i18next";
import { IntegrationIcon } from "public/assets/icons/navabarIcon";
import { lazy } from "react";
import Integration from "./Integration";

// const PasswordManager = lazy(() => import("./PasswordManager"));

/**
 * The Tasks page config.
 */
const IntegrationConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/integration",
      element: <Integration />,
    },
  ],
};

export default IntegrationConfig;
