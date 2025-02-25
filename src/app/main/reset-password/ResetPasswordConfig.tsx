import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import ResetPassword from "./ResetPassword";

const ResetPasswordConfig: FuseRouteConfigType = {
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
      // path: "reset-password/:token",
      path: "reset-password/:token?",
      element: <ResetPassword />,
    },
  ],
};

export default ResetPasswordConfig;
