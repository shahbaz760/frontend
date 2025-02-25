
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatMessageTemplate } from "./modals";
import { MessageBubbleAlignment } from "src/app/pages/Enums/Enums";
import { CometChatUIKitConstants } from "src/app/pages/constants/CometChatUIKitConstants";
import { CometChatMessageBubble } from "src/app/pages/BaseComponents/CometChatMessageBubble/CometChatMessageBubble";

/**
 * Utility class for handling message display and styling.
 * It is used in CometChatMessageInformation component.
 */

export class MessageUtils {

  /**
   * Retrieves the content view for a message based on the provided template.
   *
   * @param {CometChat.BaseMessage} message - The message object for which to get the content view.
   * @param {CometChatMessageTemplate} template - The message template to use for rendering the content view.
   * @returns {object | null} - The content view for the message, or null if not found.
   */
  getContentView(
    message: CometChat.BaseMessage,
    template: CometChatMessageTemplate,
    alignment?: MessageBubbleAlignment
  ) {
    let view;
    const messageTypesMap: any = {};
    messageTypesMap[`${template.category}_${template.type}`] = template;

    if (
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`] &&
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`]
        ?.contentView
    ) {
      view = messageTypesMap[
        `${message?.getCategory()}_${message?.getType()}`
      ]?.contentView(message, alignment);
      // default would be html string using lit components
      if (typeof view === "string") {
        return {
          html: view,
        };
      }
      return view;
    } else {
      return null;
    }
  }
  /**
   * Retrieves the content view for a message based on the provided template.
   *
   * @param {CometChat.BaseMessage} message - The message object for which to get the content view.
   * @param {CometChatMessageTemplate} template - The message template to use for rendering the content view.
   * @returns {object | null} - The content view for the message, or null if not found.
   */
  getStatusInfoView(
    message: CometChat.BaseMessage,
    template: CometChatMessageTemplate,
    alignment?: MessageBubbleAlignment
  ) {
    let view;
    const messageTypesMap: any = {};
    messageTypesMap[`${template.category}_${template.type}`] = template;

    if (
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`] &&
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`]
        ?.statusInfoView
    ) {
      view = messageTypesMap[
        `${message?.getCategory()}_${message?.getType()}`
      ]?.statusInfoView(message, alignment);
      if (typeof view === "string") {
        return {
          html: view,
        };
      }
      return view;
    } else {
      return null;
    }
  }

  /**
   * Retrieves the bubble wrapper for a message based on the provided template.
   *
   * @param {CometChat.BaseMessage} message - The message object for which to get the bubble wrapper.
   * @param {CometChatMessageTemplate} template - The message template to use for rendering the bubble wrapper.
   * @returns {object | null} - The bubble wrapper for the message, or null if not found.
   */
  getBubbleWrapper(
    message: CometChat.BaseMessage,
    template: CometChatMessageTemplate
  ) {
    let view;
    const messageTypesMap: any = {};
    messageTypesMap[`${template.category}_${template.type}`] = template;

    if (
      messageTypesMap &&
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`] &&
      messageTypesMap[`${message?.getCategory()}_${message?.getType()}`]
        .bubbleView
    ) {
      view =
        messageTypesMap[`${message?.getCategory()}_${message?.getType()}`]
          .bubbleView(message);
      return view;
    } else {
      view = null;
      return view;
    }
  }

  /**
   * Constructs a message bubble component based on the message, template, style, and alignment.
   *
   * @param {CometChat.BaseMessage} baseMessage - The message object to be displayed in the bubble.
   * @param {CometChatMessageTemplate} template - The message template to use for rendering the bubble.
   * @param {object} messageBubbleStyle - The style object for the message bubble.
   * @param {MessageBubbleAlignment} alignment - The alignment of the message bubble (left or right).
   * @returns {JSX.Element} - The message bubble component.
   */
  getMessageBubble(
    baseMessage: CometChat.BaseMessage,
    template: CometChatMessageTemplate,
    alignment: MessageBubbleAlignment
  ) {
    return this.getBubbleWrapper(baseMessage, template)
      ? this.getBubbleWrapper(baseMessage, template)
      : <CometChatMessageBubble bottomView={null} headerView={null} options={[]} footerView={null} leadingView={null} statusInfoView={this.getStatusInfoView(baseMessage, template, alignment)} contentView={this.getContentView(baseMessage, template, alignment)} replyView={null} threadView={null} alignment={alignment} id={baseMessage?.getId() || baseMessage?.getMuid()} />
  }
  /**
   *
   * @param {(CometChat.User | CometChat.GroupMember | any)} user
   * @returns {boolean}
   */
  getUserStatusVisible(
    user: CometChat.User | CometChat.GroupMember | any
  ) {
    let userBlockedFlag = false;
    if (user instanceof (CometChat.User || CometChat.GroupMember)) {
      if (user.getBlockedByMe() || user.getHasBlockedMe()) {
        userBlockedFlag = true;
      }
    }
    return userBlockedFlag;
  }
  /**
   * Description placeholder
   *
   * @param {*} message
   * @returns {string}
   */
  getActionMessage(message: CometChat.Action): string {
    let actionMessage = "";
    if (
      message.hasOwnProperty("actionBy") === false ||
      message.hasOwnProperty("actionOn") === false
    ) {
      return actionMessage;
    }
    if (
      message.getAction() !== CometChatUIKitConstants.groupMemberAction.JOINED &&
      message.getAction() !== CometChatUIKitConstants.groupMemberAction.LEFT &&
      (message.getActionBy().hasOwnProperty("name") === false ||
        message.getActionOn().hasOwnProperty("name") === false)
    ) {
      return actionMessage;
    }
    if (
      message.getAction() === CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE
    ) {
      if (
        message.hasOwnProperty("data") &&
        message.getData().hasOwnProperty("extras")
      ) {
        if (message.getData().extras.hasOwnProperty("scope")) {
          if (message.getData().extras.scope.hasOwnProperty("new") === false) {
            return actionMessage;
          }
        } else {
          return actionMessage;
        }
      } else {
        return actionMessage;
      }
    }
    if (
      message.getAction() ===
      CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE &&
      message.getData().extras.hasOwnProperty("scope") === false
    ) {
      return actionMessage;
    }
    if (
      message.getAction() ===
      CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE &&
      message.getData().extras.scope.hasOwnProperty("new") === false
    ) {
      return actionMessage;
    }
    const byEntity: any = message.getActionBy();
    const onEntity: any = message.getActionOn();
    const byString = byEntity.name;
    const forString =
      message.getAction() !== CometChatUIKitConstants.groupMemberAction.JOINED &&
        message.getAction() !== CometChatUIKitConstants.groupMemberAction.LEFT
        ? onEntity.name
        : "";
    switch (message.getAction()) {
      case CometChatUIKitConstants.groupMemberAction.ADDED:
        actionMessage = `${byString} Added ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.JOINED:
        actionMessage = `${byString} joined`;
        break;
      case CometChatUIKitConstants.groupMemberAction.LEFT:
        actionMessage = `${byString} left`;
        break;
      case CometChatUIKitConstants.groupMemberAction.KICKED:
        actionMessage = `${byString} Kicked ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.BANNED:
        actionMessage = `${byString} Banned ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.UNBANNED:
        actionMessage = `${byString} Unbanned ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE: {
        const newScope = message["data"]["extras"]["scope"]["new"];
        actionMessage = `${byString} made ${forString} ${newScope}`;
        break;
      }
      default:
        break;
    }
    return actionMessage;
  }
}
