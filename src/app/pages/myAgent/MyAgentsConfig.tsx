import i18next from "i18next";
import AgentDetail from "src/app/components/client/clientAgent/AgentDetail";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import Myagents from "./Myagents";

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

// const Myagents = lazy(() => import("./Myagents"));
// const AgentDetail = lazy(() => import("src/app/components/client/clientAgent/AgentDetail"));

/**
 * The Tasks page config.
 */
const MyAgentsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/my-agents",
      element: <Myagents />,
    },
    {
      path: "/my-agents/detail/:agents_id",
      element: <AgentDetail />,
    },
  ],
};

export default MyAgentsConfig;
