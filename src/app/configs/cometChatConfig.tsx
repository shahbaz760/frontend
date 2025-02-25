import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(import.meta.env.VITE_CHAT_APP_ID)
  .setRegion(import.meta.env.VITE_CHAT_REGION)
  .setAuthKey(import.meta.env.VITE_CHAT_AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

export const initCometChat = () => {
  return CometChatUIKit && CometChatUIKit?.init(UIKitSettings)?.then(
    () => {
      console.log("Initialization completed successfully");
    },
    (error) => {
      console.log("Initialization failed with error:", error);
    }
  );
};


export const loginCometChat = async (uid) => {
  let userData = null;

  await CometChatUIKit.login(uid)?.then(
    (user) => {
      userData = user
    },
    (error) => {
    }
  )
    .catch((err) => {
      console.log("login chat eerrrr=-----", err);
    });
  return userData;
};



export const logoutCometChat = async () => {
  return CometChatUIKit?.logout()
    .then(
      () => {
        console.log();
      },
      (error) => {
        console.error("Chat Logout failed with exception:", error);
      }
    )
    .catch((err) => {
      console.log("Logout chat eerrrr=-----", err);
    });
};
