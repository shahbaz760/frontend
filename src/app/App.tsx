import createCache, { Options } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import FuseLayout from "@fuse/core/FuseLayout";
import { selectMainTheme } from "@fuse/core/FuseSettings/store/fuseSettingsSlice";
import FuseTheme from "@fuse/core/FuseTheme";
import MockAdapterProvider from "@mock-api/MockAdapterProvider";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import themeLayouts from "app/theme-layouts/themeLayouts";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { getClientId, getToken, getUserDetail } from "src/utils";
import rtlPlugin from "stylis-plugin-rtl";
import { AuthRouteProvider } from "./auth/AuthRouteProvider";
import { ChatProvider } from "./chatContext/ChatProvider";
import store, { AppDispatch, persistor } from "./store/store";
import { setInitialState } from "./theme-layouts/shared-components/navigation/store/navigationSlice";
import withAppProviders from "./withAppProviders";
import { useSearchParams } from "react-router-dom";
import { NotificationProvider } from "./notificationContext/NotificationProvider";
import { AppContextProvider } from "./pages/context/AppContext";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

/**
 * The main App component.
 */
function App() {
  const dispatch = useDispatch<AppDispatch>();
  // const persistor = persistStore(store);
  const navigate = useNavigate();
  const userDetail = getUserDetail();
  const [userDetailUpdate, setUserDetailUpdate] = useState<any>({});

  // useEffect(() => {
  //   setUserDetailUpdate(userDetail)
  // }, [userDetail])

  useEffect(() => {
    const token = getToken();
    if (token) {
      const tokenData: any = jwtDecode(token);

      if (tokenData?.is_admin) {
        const location = window.location.href;
        const isRedirectPage = location.includes("redirect-page");
        if (isRedirectPage) {
          navigate(`/dashboard?ci=${tokenData?.uuid}`);
        }
      }
      dispatch(setInitialState(userDetail));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  /**
   * The language direction from the Redux store.
   */
  const langDirection = useSelector(selectCurrentLanguageDirection);

  /**
   * The main theme from the Redux store.
   */
  const mainTheme = useSelector(selectMainTheme);
  const [searchParams] = useSearchParams();
  const clientId = getClientId();

  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );
      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  const location = useLocation();
  useEffect(() => {
    const handleCleanup = async () => {
      const activeCall = await CometChat.getActiveCall();
      // if (activeCall) {
      const sessionID = activeCall.getSessionId();
      CometChat.clearActiveCall();
      await CometChat.endCall(sessionID);
      CometChat.clearActiveCall();
      // }
    };
    handleCleanup(); // This runs when the route changes
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MockAdapterProvider>
          <AppContextProvider>
            <CacheProvider
              value={createCache(emotionCacheOptions[langDirection] as Options)}
            >
              <FuseTheme theme={mainTheme} direction={langDirection}>
                <AuthRouteProvider>
                  <NotificationProvider>
                    <ChatProvider>
                      <FuseLayout layouts={themeLayouts} />
                      <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                          style: {
                            zIndex: 9999,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflow: "visible",
                            maxWidth: "400px",
                          },
                        }}
                      />
                    </ChatProvider>
                  </NotificationProvider>
                </AuthRouteProvider>
              </FuseTheme>
            </CacheProvider>
          </AppContextProvider>
        </MockAdapterProvider>
      </PersistGate>
    </Provider>
  );
}

export default withAppProviders(App);