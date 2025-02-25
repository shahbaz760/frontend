import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import PrivacyPolicy from "./PrivacyPolicy";

const PrivacyPolicyConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "privacy-policy",
      element: <PrivacyPolicy />,
    },
  ],
};

export default PrivacyPolicyConfig;
