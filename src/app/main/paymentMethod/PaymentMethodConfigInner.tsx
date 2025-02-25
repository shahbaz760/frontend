

import i18next from "i18next";
import PaymentMethod from "./PaymentMethod";
import { authRoles } from "src/app/auth";


// const Users = lazy(() => import("./Users"));

/**
 * The Tasks page config.
 */
const PaymentMethodConfigInner = {
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
  // auth: authRoles.onlyGuest,
  routes: [
    {
      path: "payment-method/:token",
      element: <PaymentMethod />,
    },
  ],
};

export default PaymentMethodConfigInner;
