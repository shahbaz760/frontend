import { CollaborativeWhiteboardExtension } from "src/app/pages/Extensions/CollaborativeWhiteboard/CollaborativeWhiteboardExtension";
import { CometChat } from "@cometchat/chat-sdk-javascript";

import { LinkPreviewExtension } from "src/app/pages/Extensions/LinkPreview/LinkPreviewExtension";
import { MessageTranslationExtension } from "src/app/pages/Extensions/MessageTranslation/MessageTranslationExtension";

import { StickersExtension } from "src/app/pages/Extensions/Stickers/StickersExtension";
import { ThumbnailGenerationExtension } from "src/app/pages/Extensions/ThumbnailGeneration/ThumbnailGenerationExtension";
import { UIKitSettings } from "./UIKitSettings";
import { CometChatUIKitLoginListener } from "./CometChatUIKitLoginListener";
import { CometChatUIKitUtility } from "./CometChatUIKitUtility";
import { CometChatUIKitCalls } from "./CometChatCalls";
import { CallingExtension } from "src/app/pages/Calling/CallingExtension";
import { ChatConfigurator } from "../ChatConfigurator";
import { MessageStatus } from "src/app/pages/Enums/Enums";
import { CometChatMessageEvents } from "src/app/pages/events/CometChatMessageEvents";
import { PollsExtension } from "src/app/pages/Extensions/Polls/PollsExtension";
import { ChatSdkEventInitializer } from "../ChatSdkEventInitializer";
import { ExtensionsDataSource } from "src/app/pages/Extensions/ExtensionsDataSource";
import { CollaborativeDocumentExtension } from "src/app/pages/Extensions/CollaborativeDocument/CollaborativeDocumentExtension";
import { CometChatLocalize } from "src/app/pages/resources/CometChatLocalize/cometchat-localize";
import { CometChatSoundManager } from "src/app/pages/resources/CometChatSoundManager/CometChatSoundManager";
import { DataSource } from "../DataSource";

interface CometChatUiKit {
  name: string;
  version: string;
}
declare global {
  interface Window {
    CometChatUiKit: CometChatUiKit;
  }
}
/**
 * `CometChatUIKit` is a class that provides an interface for initializing and interacting with the CometChat UI Kit.
 * It handles various aspects of the UI Kit, including configuration, messaging, and extension management.
 * It is used in Calling, Conversations, Groups and Users components.
 * @class
 */
class CometChatUIKit {
  /**
   * `CometChatUIKit` is a class that provides an interface for initializing and interacting with the CometChat UI Kit.
   * It handles various aspects of the UI Kit, including configuration, messaging, and extension management.
   *
   * @class
   */
  static uiKitSettings: UIKitSettings | null;

  /**
   * The sound manager for handling sound-related functionalities in the UI Kit.
   * @type {typeof CometChatSoundManager}
   */
  static SoundManager: typeof CometChatSoundManager = CometChatSoundManager;

  /**
   * The localizer for internationalization.
   * @type {typeof CometChatLocalize}
   */
  static Localize: typeof CometChatLocalize = CometChatLocalize;

  /**
   * Settings related to conversation updates.
   * @type {CometChat.ConversationUpdateSettings}
   */
  static conversationUpdateSettings: CometChat.ConversationUpdateSettings;

  /**
   * Variable for storing theme mode of the UIKit.
   */

  static themeMode: "light" | "dark" = "light";

  /**
   * Initializes the CometChat UI Kit with the provided settings.
   * @param {UIKitSettings | null} uiKitSettings - The settings for initializing the UI Kit.
   * @returns {Promise<Object> | undefined} - A promise that resolves with an object if initialization is successful, otherwise `undefined`.
   */
  static init(
    uiKitSettings: UIKitSettings | null
  ): Promise<Object> | undefined {
    CometChatUIKit.uiKitSettings = uiKitSettings;
    if (!CometChatUIKit.checkAuthSettings()) return undefined;
    const appSettingsBuilder = new CometChat.AppSettingsBuilder();
    if (uiKitSettings!.getRoles()) {
      appSettingsBuilder.subscribePresenceForRoles(uiKitSettings!.getRoles());
    } else if (uiKitSettings!.getSubscriptionType() === "ALL_USERS") {
      appSettingsBuilder.subscribePresenceForAllUsers();
    } else if (uiKitSettings!.getSubscriptionType() === "FRIENDS") {
      appSettingsBuilder.subscribePresenceForFriends();
    }
    appSettingsBuilder.autoEstablishSocketConnection(
      uiKitSettings!.isAutoEstablishSocketConnection()
    );
    appSettingsBuilder.setRegion(uiKitSettings!.getRegion());
    appSettingsBuilder.overrideAdminHost(uiKitSettings!.getAdminHost());
    appSettingsBuilder.overrideClientHost(uiKitSettings!.getClientHost());

    const appSettings = appSettingsBuilder.build();
    if (CometChat.setSource) {
      CometChat.setSource("uikit-v5", "web", "reactjs");
    }
    return new Promise((resolve, reject) => {
      window.CometChatUiKit = {
        name: "@cometchat/chat-uikit-react",
        version: "5.0.0",
      };
      CometChat.init(uiKitSettings?.appId, appSettings)
        .then(() => {
          CometChat.getLoggedinUser()
            .then((user: CometChat.User | null) => {
              if (user) {
                CometChatUIKitLoginListener.setLoggedInUser(user);
                ChatConfigurator.init();
                this.initiateAfterLogin();
              }
              return resolve(user!);
            })
            .catch((error: CometChat.CometChatException) => {
              console.log(error);
              return reject(error);
            });
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Default extensions included in the UI Kit.
   * @type {ExtensionsDataSource[]}
   */
  static defaultExtensions: ExtensionsDataSource[] = [
    new StickersExtension(),
    new CollaborativeWhiteboardExtension(),
    new CollaborativeDocumentExtension(),
    new MessageTranslationExtension(),
    new ThumbnailGenerationExtension(),
    new LinkPreviewExtension(),
    new PollsExtension(),
  ];
  /**
   * Default callingExtension included in the UI Kit.
   * @type {CallingExtension}
   */
  static defaultCallingExtension: CallingExtension = new CallingExtension();

  /**
   * Checking if the SDK is initialized.
   */
  static isInitialized() {
    try {
      return CometChat.isInitialized();
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Enables calling functionality in the UI Kit.
   */
  static enableCalling() {
    try {
      if (CometChatUIKitCalls) {
        const callAppSetting = new CometChatUIKitCalls.CallAppSettingsBuilder()
          .setAppId(CometChatUIKit.uiKitSettings?.appId)
          .setRegion(CometChatUIKit.uiKitSettings?.region)
          .build();
        CometChatUIKitCalls.init(callAppSetting).then(
          () => {
            if (this.uiKitSettings?.getCallsExtension()) {
              this.uiKitSettings?.getCallsExtension().enable();
            } else {
              this.defaultCallingExtension.enable();
            }
          },
          (error: ErrorEvent) => {
            console.log(
              "CometChatCalls initialization failed with error:",
              error
            );
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Performs post-login initialization tasks.
   * @private
   */
  private static initiateAfterLogin() {
    if (CometChatUIKit.uiKitSettings != null) {
      CometChat.getConversationUpdateSettings().then(
        (res: CometChat.ConversationUpdateSettings) => {
          this.conversationUpdateSettings = res;
        }
      );
      let extensionList: ExtensionsDataSource[] =
        this.uiKitSettings?.extensions || this.defaultExtensions;
      ChatSdkEventInitializer.attachListeners();
      CometChatUIKitLoginListener.attachListener();

      if (extensionList.length > 0) {
        extensionList.forEach((extension: ExtensionsDataSource) => {
          extension?.enable();
        });
      }
      this.enableCalling();
    }
  }

  /**
   * Logs in a user with the specified UID.
   * @param {string} uid - The UID of the user to log in.
   * @returns {Promise<CometChat.User>} - A promise that resolves with the logged-in user.
   */
  static login(uid: string): Promise<CometChat.User> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings())
        return reject("uiKitSettings not available");
      CometChatUIKit.getLoggedinUser()?.then((user) => {
        if (user) {
          CometChatUIKitLoginListener.setLoggedInUser(user);
          this.initiateAfterLogin();
          return resolve(user);
        } else {
          CometChat.login(uid, CometChatUIKit.uiKitSettings!.authKey!)
            .then((user: CometChat.User) => {
              CometChatUIKitLoginListener.setLoggedInUser(user);
              ChatConfigurator.init();
              CometChatUIKitLoginListener.setLoggedInUser(user);
              this.initiateAfterLogin();
              return resolve(user);
            })
            .catch((error: CometChat.CometChatException) => {
              return reject(error);
            });
        }
      });
    });
  }

  /**
   * Logs in a user with the specified authentication token.
   * @param {string} authToken - The authentication token for the user.
   * @returns {Promise<CometChat.User>} - A promise that resolves with the logged-in user.
   */
  static loginWithAuthToken(authToken: string): Promise<CometChat.User> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings())
        return reject("uiKitSettings not available");
      CometChat.login(authToken)
        .then((user: CometChat.User) => {
          CometChatUIKitLoginListener.setLoggedInUser(user);
          ChatConfigurator.init();
          this.initiateAfterLogin();
          return resolve(user);
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Retrieves the currently logged-in user.
   * @returns {Promise<CometChat.User | null>} - A promise that resolves with the logged-in user or `null` if no user is logged in.
   */
  static getLoggedinUser(): Promise<CometChat.User | null> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings())
        return reject("uiKitSettings not available");

      CometChat.getLoggedinUser()
        .then((user: CometChat.User | null) => {
          if (user) {
            CometChatUIKitLoginListener.setLoggedInUser(user);
          }
          return resolve(user);
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Creates a new user with the specified details.
   * @param {CometChat.User} user - The user details to create.
   * @returns {Promise<CometChat.User>} - A promise that resolves with the created user.
   */
  static createUser(user: CometChat.User): Promise<CometChat.User> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings())
        return reject("uiKitSettings not available");
      CometChat.createUser(user, CometChatUIKit.uiKitSettings!.authKey!)
        .then((user: CometChat.User) => {
          return resolve(user);
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Updates the details of an existing user.
   * @param {CometChat.User} user - The user details to update.
   * @returns {Promise<CometChat.User>} - A promise that resolves with the updated user.
   */
  static updateUser(user: CometChat.User): Promise<CometChat.User> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings())
        return reject("uiKitSettings not available");
      CometChat.updateUser(user, CometChatUIKit.uiKitSettings!.authKey!)
        .then((user: CometChat.User) => {
          return resolve(user);
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Logs out the current user.
   * @returns {Promise<Object>} - A promise that resolves with a message object upon successful logout.
   */
  static logout(): Promise<Object> {
    return new Promise((resolve, reject) => {
      if (!CometChatUIKit.checkAuthSettings()) {
        const error = {
          code: "ERROR_UIKIT_NOT_INITIALISED",
          message: "UIKItSettings not available",
        };
        return reject(error);
      }
      CometChat.logout()
        .then((message: object) => {
          CometChatUIKitLoginListener.removeLoggedInUser();
          return resolve(message);
        })
        .catch((error: CometChat.CometChatException) => {
          return reject(error);
        });
    });
  }

  /**
   * Checks if the UI Kit settings are properly configured.
   * @returns {boolean} - `true` if UI Kit settings are available and valid, otherwise `false`.
   */
  static checkAuthSettings(): boolean {
    if (CometChatUIKit.uiKitSettings == null) {
      return false;
    }

    if (CometChatUIKit.uiKitSettings!.appId == null) {
      return false;
    }

    return true;
  }

  /**
   * Sends a custom message and returns a promise with the result.
   * @param {CometChat.CustomMessage} message - The custom message to be sent.
   * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
   */
  static sendCustomMessage(message: CometChat.CustomMessage) {
    return new Promise((resolve, reject) => {
      message.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
      if (!message?.getMuid()) {
        message.setMuid(CometChatUIKitUtility.ID());
      }
      CometChatMessageEvents.ccMessageSent.next({
        message: message,
        status: MessageStatus.inprogress,
      });

      CometChat.sendCustomMessage(message)
        .then((message: CometChat.BaseMessage) => {
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.success,
          });
          return resolve(message);
        })
        .catch((error: CometChat.CometChatException) => {
          message.setMetadata({ error });
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.error,
          });
          return reject(error);
        });
    });
  }

  /**
   * Sends a text message and returns a promise with the result.
   * @param {CometChat.TextMessage} message - The text message to be sent.
   * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
   */
  static sendTextMessage(
    message: CometChat.TextMessage
  ): Promise<CometChat.BaseMessage> {
    return new Promise((resolve, reject) => {
      message.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
      if (!message?.getMuid()) {
        message.setMuid(CometChatUIKitUtility.ID());
      }
      CometChatMessageEvents.ccMessageSent.next({
        message: message,
        status: MessageStatus.inprogress,
      });

      CometChat.sendMessage(message)
        .then((message: CometChat.BaseMessage) => {
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.success,
          });
          return resolve(message);
        })
        .catch((error: CometChat.CometChatException) => {
          message.setMetadata({ error });
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.error,
          });
          return reject(error);
        });
    });
  }

  /**
   * Sends a media message and returns a promise with the result.
   * @param {CometChat.MediaMessage} message - The media message to be sent.
   * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
   */
  static sendMediaMessage(
    message: CometChat.MediaMessage
  ): Promise<CometChat.BaseMessage> {
    message.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
    if (!message?.getMuid()) {
      message.setMuid(CometChatUIKitUtility.ID());
    }
    return new Promise((resolve, reject) => {
      CometChatMessageEvents.ccMessageSent.next({
        message: message,
        status: MessageStatus.inprogress,
      });

      CometChat.sendMediaMessage(message)
        .then((message: CometChat.BaseMessage) => {
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.success,
          });
          return resolve(message);
        })
        .catch((error: CometChat.CometChatException) => {
          message.setMetadata({ error });
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.error,
          });
          return reject(error);
        });
    });
  }

  /**
   * Retrieves the data source for chat configuration.
   * @returns {DataSource} - The chat data source.
   */
  static getDataSource(): DataSource {
    return ChatConfigurator.getDataSource();
  }
}

export { CometChatUIKit };
