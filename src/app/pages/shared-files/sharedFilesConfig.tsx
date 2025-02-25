import i18next from "i18next";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import SharedFiles from "./SharedFiles";

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

// const SharedFiles = lazy(() => import("./SharedFiles"));

/**
 * The Tasks page config.
 */
const SharedFilesConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/shared-files",
      element: <SharedFiles />,
    },
  ],
};

export default SharedFilesConfig;
