import { CometChatUIKitConstants } from "src/app/pages/constants/CometChatUIKitConstants";

/**
 * Utility class for handling call-related details in CometChat.
 * It is used in CallingExtensionDecorator component.
 */
export class CallingDetailsUtils {
  /**
   * Retrieves the default message types used in calling.
   *
   * @returns {string[]} An array of default message types for audio, video, and meeting calls.
   */
  static getDefaultMessageTypes = () => {
    return [
      CometChatUIKitConstants.MessageTypes.audio,
      CometChatUIKitConstants.MessageTypes.video,
      CometChatUIKitConstants.calls.meeting,
    ];
  };

  /**
   * Retrieves the default categories associated with calling.
   *
   * @returns {string[]} An array of default message categories for calls and custom messages.
   */
  static getDefaultCategories = () => {
    return [
      CometChatUIKitConstants.MessageCategory.call,
      CometChatUIKitConstants.MessageCategory.custom,
    ];
  };

  /**
   * Checks if the call was sent by the logged-in user.
   *
   * @param {CometChat.Call} call - The call object.
   * @param {CometChat.User} loggedInUser - The logged-in user object.
   * @returns {boolean} True if the call was sent by the logged-in user, otherwise false.
   */
  static isSentByMe(call: CometChat.Call, loggedInUser: CometChat.User) {
    const senderUid: string = call.getSender()?.getUid();
    return !senderUid || senderUid === loggedInUser?.getUid();
  }

  /**
   * Checks if the call is a missed call for the logged-in user.
   *
   * @param {CometChat.Call} call - The call object.
   * @param {CometChat.User} loggedInUser - The logged-in user object.
   * @returns {boolean} True if the call is missed, otherwise false.
   */
  static isMissedCall(call: CometChat.Call, loggedInUser: CometChat.User) {
    const senderUid: string = call.getCallInitiator()?.getUid();
    const callStatus: string = call.getStatus();
    if (!senderUid || senderUid === loggedInUser?.getUid()) {
      return false;
    } else {
      return [
        CometChatUIKitConstants.calls.busy,
        CometChatUIKitConstants.calls.unanswered,
        CometChatUIKitConstants.calls.cancelled,
      ].includes(callStatus);
    }
  }

  /**
   * Retrieves the localized call status message based on the call status and the user.
   *
   * @param {CometChat.Call} call - The call object.
   * @param {CometChat.User} loggedInUser - The logged-in user object.
   * @returns {string} The localized call status message.
   */
  static getCallStatus(
    call: CometChat.Call,
    loggedInUser: CometChat.User
  ): string {
    const callStatus: string = call.getStatus();
    const isSentByMe: boolean = CallingDetailsUtils.isSentByMe(
      call,
      loggedInUser!
    );
    if (isSentByMe) {
      switch (callStatus) {
        case CometChatUIKitConstants.calls.initiated:
          return "Outgoing call"; // Directly return text
        case CometChatUIKitConstants.calls.cancelled:
          return "Cancelled call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.rejected:
          return "Rejected audio call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.busy:
          return "Missed call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.ended:
          return "Call ended"; // Replaced with actual text
        case CometChatUIKitConstants.calls.ongoing:
          return "Ongoing audio call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.unanswered:
          return "Unanswered call"; // Replaced with actual text
        default:
          return "Outgoing call"; // Default text
      }
    } else {
      switch (callStatus) {
        case CometChatUIKitConstants.calls.initiated:
          return "Incoming call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.ongoing:
          return "Call answered"; // Replaced with actual text
        case CometChatUIKitConstants.calls.ended:
          return "Call ended"; // Replaced with actual text
        case CometChatUIKitConstants.calls.unanswered:
        case CometChatUIKitConstants.calls.cancelled:
          return "Missed call"; // Replaced with actual text
        case CometChatUIKitConstants.calls.busy:
          return "Call busy"; // Replaced with actual text
        case CometChatUIKitConstants.calls.rejected:
          return "Rejected video call"; // Replaced with actual text
        default:
          return "Outgoing call"; // Default text
      }
    }
  }
}
