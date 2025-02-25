import i18next from "i18next";
import ChangePassword from "./ChangePassword";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import Profile from "./Profile";

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

// const Profile = lazy(() => import("./Profile"));

/**
 * The Tasks page config.
 */
const ProfileConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "change-password",
      element: <ChangePassword />,
    },
  ],
};

export default ProfileConfig;
