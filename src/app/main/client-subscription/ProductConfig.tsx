import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";

import authRoles from "../../auth/authRoles";
import Product from "./Product";
import CartPage from "./cart/CartPage";
import { getUserDetail } from "src/utils";
import SuccessScreen from "./success.tsx/SuccessScreen";

const details = getUserDetail();
const ProductConfig: FuseRouteConfigType = {
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

  auth: details == "{}" ? authRoles.onlyGuest : undefined, // Fixed condition check
  routes: [
    {
      path: "client-subscription",
      element: <Product />,
    },
    {
      path: "client-subscription/cart",
      element: <CartPage />,
    },
    {
      path: "client-subscription/success",
      element: <SuccessScreen />,
    },
  ],
};

export default ProductConfig;
