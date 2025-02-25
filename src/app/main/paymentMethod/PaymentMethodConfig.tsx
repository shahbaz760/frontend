import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import authRoles from "../../auth/authRoles";
import PaymentMethod from "./PaymentMethod";
import { getUserDetail } from "src/utils";

const details = getUserDetail();

export const PaymentMethodConfig = {
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
  auth: details.role_id !== 2 ? authRoles.onlyGuest : undefined,
  routes: [
    {
      path: "payment-method/:token",
      element: <PaymentMethod />,
    },
  ],
};
