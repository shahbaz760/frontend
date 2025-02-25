import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import OtpVerification from "./OtpVerification";

const OtpVerificationConfig: FuseRouteConfigType = {
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
      path: "otp-verification",
      element: <OtpVerification />,
    },
  ],
};

export default OtpVerificationConfig;
