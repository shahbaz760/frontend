import {
  initCometChat,
  loginCometChat,
  logoutCometChat,
} from "app/configs/cometChatConfig";
import { createContext, useContext, useEffect, useState } from "react";
import IncomingCallHandler from "../components/chatBoard/IncomingCallHandler";
import { getClientId, getUserDetail } from "src/utils";

const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const userDetails = getUserDetail();
  const clientId = getClientId();
  let userDetailMain = JSON.parse(localStorage.getItem("userDetail"));
  const [login, setLogin] = useState(false);
  useEffect(() => {
    if (userDetails) {
      initCometChat()
        .then(async () => {
          const userToLogin = clientId ? userDetails?.id : userDetailMain?.id;
          let login = await loginCometChat(userToLogin);
          if (login && login.uid != userToLogin) {
            await logoutCometChat();
            login = await loginCometChat(userToLogin);
          }
          setLogin(true);
        })
        .catch((err) => {
          console.log("cometeerrrr=-----", err);
        });
    }
  }, [userDetails]);

  return (
    <ChatContext.Provider value={{}}>
      {/* <IncomingCallHandler
        userId={clientId ? userDetails?.id : userDetailMain?.id}
      /> */}
      {login ? children : <></>}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
