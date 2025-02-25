import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import TwoFactorAuthentication from "./TwoFactorAuthentication";

const TwoFactorAuthenticationConfig: FuseRouteConfigType = {
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
      path: "2fa-verification/:token",
      element: <TwoFactorAuthentication />,
    },
  ],
};

export default TwoFactorAuthenticationConfig;
