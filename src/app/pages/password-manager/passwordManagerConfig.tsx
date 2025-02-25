import i18next from "i18next";
import { lazy } from "react";
import en from "./i18n/en";
import tr from "./i18n/tr";
import ar from "./i18n/ar";
import PasswordManager from "./PasswordManager";

// const PasswordManager = lazy(() => import("./PasswordManager"));

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

/**
 * The Tasks page config.
 */
const PasswordManagerConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/password-manager",
      element: <PasswordManager />,
    },
  ],
};

export default PasswordManagerConfig;
