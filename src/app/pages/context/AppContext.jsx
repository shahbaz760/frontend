import { createContext, useEffect, useReducer } from "react";
import { appReducer, defaultAppState } from "./appReducer";
import { useLocation } from "react-router";

export const AppContext = createContext({
  appState: defaultAppState,
  setAppState: ({}) => {},
});

export const AppContextProvider = ({ children }) => {
  const [appState, setAppState] = useReducer(appReducer, defaultAppState);
  const location = useLocation();
  useEffect(() => {
    const handleCleanup = async () => {
      const activeCall = await CometChat.getActiveCall();
      if (activeCall) {
        const sessionID = activeCall.getSessionId();
        await CometChat.endCall(sessionID);
        CometChat.clearActiveCall();
      }
    };

    window.addEventListener("beforeunload", handleCleanup);

    return () => {
      handleCleanup(); // Call this when the component unmounts
      window.removeEventListener("beforeunload", handleCleanup);
    };
  }, [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
