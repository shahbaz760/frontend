import i18next from "i18next";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import Faq from "./Faq";

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

// const Department = lazy(() => import("./Department"));
// const SupportDetail = lazy(() => import("../../components/support/SupportDetail"));

/**
 * The Tasks page config.
 */
const faqConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "faq",
      element: <Faq />,
    },
    // {
    //   path: "supportDetail",
    //   element: <SupportDetail />,
    // },
  ],
};

export default faqConfig;
