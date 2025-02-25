import ClientDetail from "src/app/components/client/ClientDetail";
import EditSubscription from "src/app/components/client/Subscription/EditSubscription";
import SubscriptionDetails from "src/app/components/client/Subscription/SubscriptionDetails";
import AddSubscription from "../../components/client/Subscription/AddSubscription";
import Client from "./Client";
// const Client = lazy(() => import("./Client"));
// const ClientDetail = lazy(() => import("../../components/client/ClientDetail"));
// const AddSubscription = lazy(
//   () => import("../../components/client/Subscription/AddSubscription")
// );
// const SubscriptionDetails = lazy(
//   () => import("../../components/client/Subscription/SubscriptionDetails")
// );

/**
 * The Tasks page config.
 */
const ClientConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/client",
      element: <Client />,
    },
    {
      path: "admin/client/detail/:client_id",
      element: <ClientDetail />,
    },
    {
      path: "admin/client/add-subscription",
      element: <AddSubscription />,
    },
    {
      path: "admin/client/edit-subscription/:subscription_id",
      element: <EditSubscription />,
    },
    {
      path: "admin/client/subscription-detail/:subscription_id",
      element: <SubscriptionDetails />,
    },
  ],
};

export default ClientConfig;
