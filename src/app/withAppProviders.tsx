// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import ErrorBoundary from "@fuse/utils/ErrorBoundary";
import { StyledEngineProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  UserRoutes,
  accManagerRoutes,
  adminRoutes,
  agentRoutes,
  clientRoutes,
} from "app/configs/routesConfig";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { getUserDetail } from "src/utils";
import AppContext from "./AppContext";
import StripeProvider from "./components/billings/StripeProvider";
import store from "./store/store";

type ComponentProps = {
  name?: string;
};

/**
 * A Higher Order Component that provides the necessary context providers for the app.
 */
function withAppProviders(Component: React.ComponentType<ComponentProps>) {
  /**
   * The component that wraps the provided component with the necessary context providers.
   */
  function WithAppProviders(props: React.PropsWithChildren<ComponentProps>) {
    const userDetail = getUserDetail();
    /**
     * The value to pass to the AppContext provider.
     */
    const val = useMemo(() => {
      if (userDetail?.role_id == 1) {
        return { routes: adminRoutes };
      } else if (userDetail?.role_id == 3) {
        return { routes: agentRoutes };
      } else if (userDetail?.role_id == 4) {
        return { routes: accManagerRoutes };
      } else if (userDetail?.role_id == 5) {
        return { routes: UserRoutes };
      } else {
        return { routes: clientRoutes };
      }
    }, [
      adminRoutes,
      clientRoutes,
      agentRoutes,
      accManagerRoutes,
      UserRoutes,
      userDetail,
    ]);


    return (
      <ErrorBoundary>
        <AppContext.Provider value={val}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Provider store={store}>
              <StyledEngineProvider injectFirst>
                <StripeProvider>
                  <Component {...props} />
                </StripeProvider>
              </StyledEngineProvider>
            </Provider>
          </LocalizationProvider>
        </AppContext.Provider>
      </ErrorBoundary>
    );
  }

  return WithAppProviders;
}

export default withAppProviders;
