import Keyword from "./Keyword";

// const Keyword = lazy(() => import("./Keyword"));

/**
 * The Tasks page config.
 */
const KeywordConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "keyword",
      element: <Keyword />,
    },
  ],
};

export default KeywordConfig;
