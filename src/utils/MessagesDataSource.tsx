import { ChatConfigurator } from "./ChatConfigurator";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { DataSource } from "./DataSource";
import React from "react";

import { ConversationUtils, additionalParams } from "./ConversationUtils";


import { CometChatFullScreenViewer } from "src/app/pages/BaseComponents/CometChatFullScreenViewer/CometChatFullScreenViewer";
import { CometChatImageBubble } from "src/app/pages/BaseComponents/CometChatImageBubble/CometChatImageBubble";

import AudioIcon from "../assets/play_circle.svg";
import CopyIcon from "../assets/Copy.svg";
import DeleteIcon from "../assets/delete.svg";
import EditIcon from "../assets/edit_icon.svg";
import FileIcon from "../assets/document_icon.svg";
import ImageIcon from "../assets/photo.svg";
import InformationIcon from "../assets/info_icon.svg";
import PlaceholderImage from "../assets/placeholder.png";
import PrivateMessageIcon from "../assets/send_message_privately.svg";
import ReactionIcon from "../assets/add_reaction_icon.svg";
import ThreadIcon from "../assets/reply_in_thread.svg";
import VideoIcon from "../assets/videocam.svg";
import { CometChatDeleteBubble } from "src/app/pages/BaseComponents/CometChatDeleteBubble/CometChatDeleteBubble";
import { CometChatVideoBubble } from "src/app/pages/BaseComponents/CometChatVideoBubble/CometChatVideoBubble";
import { CometChatAudioBubble } from "src/app/pages/BaseComponents/CometChatAudioBubble/CometChatAudioBubble";
import { CometChatFileBubble } from "src/app/pages/BaseComponents/CometChatFileBubble/CometChatFileBubble";
import jpgIcon from '/assets/icons/file_type_jpg.png';
import linkIcon from '/assets/icons/file_type_link.png';
import movIcon from '/assets/icons/file_type_mov.png';
import mp3Icon from '/assets/icons/file_type_mp3.png';
import pdfIcon from '/assets/icons/file_type_pdf.png';
import pptIcon from '/assets/icons/file_type_ppt.png';
import txtIcon from '/assets/icons/assets/file_type_txt.png';
import unsupportedIcon from '/assets/icons/file_type_unsupported.png';
import wordIcon from '/assets/icons/file_type_word.png';
import xlsxIcon from '/assets/icons/file_type_xlsx.png';
import zipIcon from '/assets/icons/file_type_zip.png';
import { CometChatActionBubble } from "src/app/pages/BaseComponents/CometChatActionBubble/CometChatActionBubble";
import { CometChatDate } from "src/app/pages/BaseComponents/CometChatDate/CometChatDate";
import { MessageReceiptUtils } from "./MessageReceiptUtils";
import { isMobileDevice } from "./util";
import { CometChatTextBubble } from "src/app/pages/BaseComponents/CometChatTextBubble/CometChatTextBubble";
import { CometChatUIEvents } from "src/app/pages/events/CometChatUIEvents";
import { CometChatUIKitLoginListener } from "./CometChatUIKit/CometChatUIKitLoginListener";
import { CometChatActionsIcon, CometChatActionsView, CometChatMessageComposerAction, CometChatMessageTemplate } from "./modals";
import { CometChatUIKitConstants } from "src/app/pages/constants/CometChatUIKitConstants";
import { CometChatMentionsFormatter, CometChatTextFormatter, CometChatUrlsFormatter } from "./formatters";
import { MessageBubbleAlignment, DatePatterns, MentionsTargetElement, Receipts } from "src/app/pages/Enums/Enums";
export type ComposerId = { parentMessageId: number | null, user: string | null, group: string | null };
/**
 * Utility class that extends DataSource and provides getters for message options.
 * It is used in message and dataSource utils.
 */

export interface additionalParamsOptions {
  hideReplyInThreadOption?: boolean,
  hideTranslateMessageOption?: boolean,
  hideReactionOption?: boolean,
  hideEditMessageOption?: boolean,
  hideDeleteMessageOption?: boolean,
  hideMessagePrivatelyOption?: boolean,
  hideCopyMessageOption?: boolean,
  hideMessageInfoOption?: boolean,
}

export class MessagesDataSource implements DataSource {
  getEditOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.editMessage,
      title: "Edit",
      iconURL: EditIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  getDeleteOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.deleteMessage,
      title: "Detele",
      iconURL: DeleteIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  getReactionOption(): CometChatActionsView {
    return new CometChatActionsView({
      id: CometChatUIKitConstants.MessageOption.reactToMessage,
      title: "React",
      iconURL: ReactionIcon,
      customView: undefined,
    });
  }

  getReplyInThreadOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.replyInThread,
      title: "Reply",
      iconURL: ThreadIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  getSendMessagePrivatelyOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.sendMessagePrivately,
      title: "Message Privately",
      iconURL: PrivateMessageIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  getCopyOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.copyMessage,
      title: "Copy",
      iconURL: CopyIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  getMessageInfoOption(): CometChatActionsIcon {
    return new CometChatActionsIcon({
      id: CometChatUIKitConstants.MessageOption.messageInformation,
      title: "Info",
      iconURL: InformationIcon,
      onClick: undefined as unknown as (id: number) => void,
    });
  }

  isSentByMe(
    loggedInUser: CometChat.User,
    message: CometChat.BaseMessage
  ): boolean {
    return (
      !message.getSender() ||
      loggedInUser.getUid() === message.getSender().getUid()
    );
  }

  getTextMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: additionalParamsOptions
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let isSentByMe: boolean = this.isSentByMe(loggedInUser, messageObject);
    let isParticipant: boolean = false;

    if (
      group?.getScope() === CometChatUIKitConstants.groupMemberScope.participant
    ) {
      isParticipant = true;
    }

    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> = [];
    if (!additionalParams?.hideReactionOption) {
      messageOptionList.push(this.getReactionOption());
    }
    if (!messageObject.getParentMessageId() && !additionalParams?.hideReplyInThreadOption) {
      messageOptionList.push(this.getReplyInThreadOption());
    }
    if (!additionalParams?.hideCopyMessageOption) {
      messageOptionList.push(this.getCopyOption());
    }
    if ((isSentByMe || (!isParticipant && group)) && !additionalParams?.hideEditMessageOption) {
      messageOptionList.push(this.getEditOption());
    }
    if (isSentByMe && !additionalParams?.hideMessageInfoOption) {
      messageOptionList.push(this.getMessageInfoOption());
    }
    if ((isSentByMe || (!isParticipant && group)) && !additionalParams?.hideDeleteMessageOption)
      messageOptionList.push(this.getDeleteOption());
    if (group && !isSentByMe && !additionalParams?.hideMessagePrivatelyOption) {
      messageOptionList.push(this.getSendMessagePrivatelyOption());
    }
    return messageOptionList;
  }
  getIsSentByMe(message: CometChat.BaseMessage) {
    return !message.getSender() || message.getSender().getUid() == CometChatUIKitLoginListener.getLoggedInUser()?.getUid()
  }
  getImageMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: Object | undefined
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> =
      [];
    messageOptionList = ChatConfigurator.getDataSource().getCommonOptions(
      loggedInUser,
      messageObject,
      group,
      additionalParams
    );

    return messageOptionList;
  }

  getVideoMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: Object | undefined
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> =
      [];
    messageOptionList = ChatConfigurator.getDataSource().getCommonOptions(
      loggedInUser,
      messageObject,
      group,
      additionalParams
    );

    return messageOptionList;
  }

  getAudioMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: Object | undefined
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> =
      [];
    messageOptionList = ChatConfigurator.getDataSource().getCommonOptions(
      loggedInUser,
      messageObject,
      group,
      additionalParams
    );

    return messageOptionList;
  }

  getFileMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: Object | undefined
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> =
      [];
    messageOptionList = ChatConfigurator.getDataSource().getCommonOptions(
      loggedInUser,
      messageObject,
      group,
      additionalParams
    );

    return messageOptionList;
  }
  getReceiptClass(status?: number) {
    if (status == Receipts.error) {
      return "error";
    }
    if (status == Receipts.read) {
      return "read";
    }
    if (status == Receipts.delivered) {
      return "delivered";
    }
    if (status == Receipts.sent) {
      return "sent";
    }
    if (status == Receipts.wait) {
      return "wait";
    }
  }
  /**
* Function to get receipt for message bubble
* @param {CometChat.BaseMessage} item - The message bubble for which the receipt needs to be fetched
* @returns {JSX.Element | null} Returns JSX.Element for receipt of a message bubble or null
*/

  getBubbleStatusInfoReceipt: (item: CometChat.BaseMessage, hideReceipt?: boolean) => JSX.Element | null =
    (item: CometChat.BaseMessage, hideReceipt?: boolean) => {
      if (

        !hideReceipt &&
        (!item?.getSender() ||
          CometChatUIKitLoginListener.getLoggedInUser()?.getUid() === item?.getSender()?.getUid()) &&
        item?.getCategory() !==
        CometChatUIKitConstants.MessageCategory.action &&
        item?.getCategory() !== CometChatUIKitConstants.MessageCategory.call &&
        !item?.getDeletedAt()
      ) {
        let state = MessageReceiptUtils.getReceiptStatus(item)
        return (
          <div className={`cometchat-receipts cometchat-message-bubble__status-info-view-receipts cometchat-message-bubble__status-info-view-receipts-${this.getReceiptClass(state)} cometchat-receipts-${this.getReceiptClass(state)}`}>
            <div className="cometchat-message-list__receipt"></div>
          </div>
        );
      } else {
        return null;
      }
    }
  /**
* Function to get status and date for message bubble
* @param {CometChat.BaseMessage} item - The message bubble for which the information needs to be fetched
* @returns {JSX.Element | null} Returns JSX.Element for status and date of a message bubble or null
*/
  getBubbleStatusInfoDate: (item: CometChat.BaseMessage, datePattern?: DatePatterns) => JSX.Element | null =
    (item: CometChat.BaseMessage, datePattern: DatePatterns = DatePatterns.time) => {
      if (
        item?.getCategory() !==
        CometChatUIKitConstants.MessageCategory.action &&
        item?.getCategory() !== CometChatUIKitConstants.MessageCategory.call
      ) {
        return (
          <CometChatDate
            timestamp={item.getSentAt()}
            pattern={datePattern}
          ></CometChatDate>
        );
      } else {
        return null;
      }
    }
  getStatusInfoView = (_messageObject: CometChat.BaseMessage,
    _alignment: MessageBubbleAlignment, hideReceipt?: boolean, datePattern?: DatePatterns) => {
    if (!(_messageObject instanceof CometChat.Action) && !(_messageObject instanceof CometChat.Call) && (_messageObject.getType() != "meeting" || (_messageObject.getType() == "meeting" && _messageObject.getDeletedAt()))) {
      return (
        <div
          className="cometchat-message-bubble__status-info-view"
        >
          <span className="cometchat-message-bubble__status-info-view-helper-text">   {!_messageObject.getDeletedAt() && _messageObject.getType() == CometChatUIKitConstants.MessageTypes.text && _messageObject.getEditedAt() ? "Edited" : null}</span>

          {this.getBubbleStatusInfoDate(_messageObject, datePattern)}
          {this.getBubbleStatusInfoReceipt(_messageObject, hideReceipt)}
        </div>
      );
    } else {
      return null;
    }
  }

  getBottomView(
    _messageObject: CometChat.BaseMessage,
    _alignment: MessageBubbleAlignment
  ) {
    return null;
  }

  getTextMessageTemplate(
    additionalConfigurations?: additionalParams
  ): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.text,
      category: CometChatUIKitConstants.MessageCategory.message,
      statusInfoView: ChatConfigurator.getDataSource().getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        let textMessage: CometChat.TextMessage =
          message as CometChat.TextMessage;
        if (textMessage.getDeletedAt() != null) {
          return this.getDeleteMessageBubble(textMessage, undefined, _alignment);
        }
        return ChatConfigurator.getDataSource().getTextMessageContentView(
          textMessage,
          _alignment,

          additionalConfigurations
        );
      },
      options: ChatConfigurator.getDataSource().getMessageOptions,
      bottomView: (
        _message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return ChatConfigurator.getDataSource().getBottomView(
          _message,
          _alignment
        );
      },
    });
  }

  getAudioMessageTemplate(): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.audio,
      category: CometChatUIKitConstants.MessageCategory.message,
      statusInfoView: ChatConfigurator.getDataSource().getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        let audioMessage: CometChat.MediaMessage =
          message as CometChat.MediaMessage;
        if (audioMessage.getDeletedAt() != null) {
          return this.getDeleteMessageBubble(message, undefined, _alignment);
        }
        return ChatConfigurator.getDataSource().getAudioMessageContentView(
          audioMessage,
          _alignment
        );
      },
      options: ChatConfigurator.getDataSource().getMessageOptions,
      bottomView: (
        _message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return ChatConfigurator.getDataSource().getBottomView(
          _message,
          _alignment
        );
      },
    });
  }

  getVideoMessageTemplate(): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.video,
      category: CometChatUIKitConstants.MessageCategory.message,
      statusInfoView: ChatConfigurator.getDataSource().getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        let videoMessage: CometChat.MediaMessage =
          message as CometChat.MediaMessage;
        if (videoMessage.getDeletedAt() != null) {
          return this.getDeleteMessageBubble(message, undefined, _alignment);
        }
        return ChatConfigurator.getDataSource().getVideoMessageContentView(
          videoMessage,
          _alignment
        );
      },
      options: ChatConfigurator.getDataSource().getMessageOptions,
      bottomView: (
        _message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return ChatConfigurator.getDataSource().getBottomView(
          _message,
          _alignment
        );
      },
    });
  }

  getImageMessageTemplate(): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.image,
      category: CometChatUIKitConstants.MessageCategory.message,
      statusInfoView: ChatConfigurator.getDataSource().getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        let imageMessage: CometChat.MediaMessage =
          message as CometChat.MediaMessage;
        if (imageMessage.getDeletedAt() != null) {
          return this.getDeleteMessageBubble(message, undefined, _alignment);
        }

        return ChatConfigurator.getDataSource().getImageMessageContentView(
          imageMessage,
          _alignment
        );
      },
      options: ChatConfigurator.getDataSource().getMessageOptions,
      bottomView: (
        _message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return ChatConfigurator.getDataSource().getBottomView(
          _message,
          _alignment
        );
      },
    });
  }

  getGroupActionTemplate(additionalConfigurations?: { hideGroupActionMessages?: boolean }): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.groupMember,
      category: CometChatUIKitConstants.MessageCategory.action,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return !additionalConfigurations?.hideGroupActionMessages ? this.getGroupActionBubble(message) : null;
      },
    });
  }

  getFileMessageTemplate(): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CometChatUIKitConstants.MessageTypes.file,
      category: CometChatUIKitConstants.MessageCategory.message,
      statusInfoView: ChatConfigurator.getDataSource().getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        let fileMessage: CometChat.MediaMessage =
          message as CometChat.MediaMessage;
        if (fileMessage.getDeletedAt() != null) {
          return this.getDeleteMessageBubble(message, undefined, _alignment);
        }

        return ChatConfigurator.getDataSource().getFileMessageContentView(
          fileMessage,
          _alignment
        );
      },
      options: ChatConfigurator.getDataSource().getMessageOptions,
      bottomView: (
        _message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        return ChatConfigurator.getDataSource().getBottomView(
          _message,
          _alignment
        );
      },
    });
  }


  getAllMessageTemplates(
    additionalConfigurations?: additionalParams
  ): Array<CometChatMessageTemplate> {
    if (!additionalConfigurations) {
      additionalConfigurations = {
        disableMentions: false,
      };
    }
    return [
      ChatConfigurator.getDataSource().getTextMessageTemplate(
        additionalConfigurations
      ),
      ChatConfigurator.getDataSource().getImageMessageTemplate(),
      ChatConfigurator.getDataSource().getVideoMessageTemplate(),
      ChatConfigurator.getDataSource().getAudioMessageTemplate(),
      ChatConfigurator.getDataSource().getFileMessageTemplate(),
      ChatConfigurator.getDataSource().getGroupActionTemplate(additionalConfigurations)
    ];
  }

  getMessageTemplate(
    messageType: string,
    messageCategory: string,
    additionalConfigurations?: additionalParams
  ): CometChatMessageTemplate | null {

    if (!additionalConfigurations) {
      additionalConfigurations = {
        disableMentions: false,
      };
    }

    let _template: CometChatMessageTemplate | null = null;
    if (messageCategory !== CometChatUIKitConstants.MessageCategory.call) {
      switch (messageType) {
        case CometChatUIKitConstants.MessageTypes.text:
          _template =
            ChatConfigurator.getDataSource().getTextMessageTemplate(additionalConfigurations);
          break;

        case CometChatUIKitConstants.MessageTypes.image:
          _template =
            ChatConfigurator.getDataSource().getImageMessageTemplate();
          break;

        case CometChatUIKitConstants.MessageTypes.video:
          _template =
            ChatConfigurator.getDataSource().getVideoMessageTemplate();
          break;

        case CometChatUIKitConstants.MessageTypes.groupMember:
          _template =
            ChatConfigurator.getDataSource().getGroupActionTemplate(additionalConfigurations);
          break;

        case CometChatUIKitConstants.MessageTypes.file:
          _template =
            ChatConfigurator.getDataSource().getFileMessageTemplate();
          break;

        case CometChatUIKitConstants.MessageTypes.audio:
          _template =
            ChatConfigurator.getDataSource().getAudioMessageTemplate();
          break;
      }
    }
    return _template;
  }

  getMessageOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: additionalParamsOptions
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let _optionList: Array<CometChatActionsIcon | CometChatActionsView> = [];

    if (
      messageObject.getCategory() ===
      CometChatUIKitConstants.MessageCategory.message
    ) {
      switch (messageObject.getType()) {
        case CometChatUIKitConstants.MessageTypes.text:
          _optionList = ChatConfigurator.getDataSource().getTextMessageOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
        case CometChatUIKitConstants.MessageTypes.image:
          _optionList = ChatConfigurator.getDataSource().getImageMessageOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
        case CometChatUIKitConstants.MessageTypes.video:
          _optionList = ChatConfigurator.getDataSource().getVideoMessageOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
        case CometChatUIKitConstants.MessageTypes.groupMember:
          _optionList = [];
          break;
        case CometChatUIKitConstants.MessageTypes.file:
          _optionList = ChatConfigurator.getDataSource().getFileMessageOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
        case CometChatUIKitConstants.MessageTypes.audio:
          _optionList = ChatConfigurator.getDataSource().getAudioMessageOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
        default:
          _optionList = ChatConfigurator.getDataSource().getCommonOptions(
            loggedInUser,
            messageObject,
            group,
            additionalParams
          );
          break;
      }
    }
    return _optionList;
  }

  getCommonOptions(
    loggedInUser: CometChat.User,
    messageObject: CometChat.BaseMessage,
    group?: CometChat.Group,
    additionalParams?: additionalParamsOptions
  ): Array<CometChatActionsIcon | CometChatActionsView> {
    let isSentByMe: boolean = this.isSentByMe(loggedInUser, messageObject);
    let isParticipant: boolean = false;
    if (group?.getScope() === CometChatUIKitConstants.groupMemberScope.participant)
      isParticipant = true;

    let messageOptionList: Array<CometChatActionsIcon | CometChatActionsView> =
      [];

    if (!additionalParams?.hideReactionOption) {
      messageOptionList.push(this.getReactionOption());
    }
    if (!messageObject?.getParentMessageId() && !additionalParams?.hideReplyInThreadOption) {
      messageOptionList.push(this.getReplyInThreadOption());
    }
    if (isSentByMe && !additionalParams?.hideMessageInfoOption) {
      messageOptionList.push(this.getMessageInfoOption());
    }
    if ((isSentByMe || (!isParticipant && group)) && !additionalParams?.hideDeleteMessageOption)
      messageOptionList.push(this.getDeleteOption());

    if (group?.getGuid() && !isSentByMe && !additionalParams?.hideMessagePrivatelyOption) {
      messageOptionList.push(this.getSendMessagePrivatelyOption());
    }
    return messageOptionList;
  }

  getAllMessageTypes(): Array<string> {
    return [
      CometChatUIKitConstants.MessageTypes.text,
      CometChatUIKitConstants.MessageTypes.image,
      CometChatUIKitConstants.MessageTypes.audio,
      CometChatUIKitConstants.MessageTypes.video,
      CometChatUIKitConstants.MessageTypes.file,
      CometChatUIKitConstants.MessageTypes.groupMember,
    ];
  }

  addList(): string {
    return "<Message Utils>";
  }

  getAllMessageCategories(additionalConfigurations?: { hideGroupActionMessages?: boolean }): Array<string> {
    return [
      CometChatUIKitConstants.MessageCategory.message,
      !additionalConfigurations?.hideGroupActionMessages ? CometChatUIKitConstants.MessageCategory.action : "",
    ];
  }

  getStickerButton(
    id: ComposerId,

    user?: CometChat.User,
    group?: CometChat.Group
  ): JSX.Element | undefined {
    return undefined;
  }

  getId(): string {
    return "messageUtils";
  }

  getTextMessageContentView(
    message: CometChat.TextMessage,
    _alignment: MessageBubbleAlignment,

    additionalConfigurations?: additionalParams
  ) {
    return ChatConfigurator.getDataSource().getTextMessageBubble(
      message.getText(),
      message,
      _alignment,
      additionalConfigurations
    );
  }

  getAudioMessageContentView(
    message: CometChat.MediaMessage,
    _alignment: MessageBubbleAlignment,

  ): Element | JSX.Element {
    return ChatConfigurator.getDataSource().getAudioMessageBubble(
      message?.getAttachments()[0]?.getUrl(),
      message,
      message?.getAttachments()[0]?.getName(),
      _alignment
    );
  }

  getFileMessageContentView(
    message: CometChat.MediaMessage,
    _alignment: MessageBubbleAlignment,

  ): Element | JSX.Element {
    return ChatConfigurator.getDataSource().getFileMessageBubble(
      message?.getAttachments()[0]?.getUrl(),
      message,
      message?.getAttachments()[0]?.getName(),
      _alignment
    );
  }

  getImageMessageContentView(
    message: CometChat.MediaMessage,
    _alignment: MessageBubbleAlignment,

  ): Element | JSX.Element {
    let imageUrl = message?.getAttachments()[0]?.getUrl() || "";
    return ChatConfigurator.getDataSource().getImageMessageBubble(
      imageUrl,
      PlaceholderImage,
      message,
      undefined,
      _alignment
    );
  }

  getVideoMessageContentView(
    message: CometChat.MediaMessage,
    _alignment: MessageBubbleAlignment,

  ): Element | JSX.Element {
    return ChatConfigurator.getDataSource().getVideoMessageBubble(
      message?.getAttachments()[0]?.getUrl(),
      message,
      undefined, undefined,
      _alignment
    );
  }

  getActionMessage(message: any): string {
    let actionMessage = "";
    if (
      message.hasOwnProperty("actionBy") === false ||
      message.hasOwnProperty("actionOn") === false
    ) {
      return actionMessage;
    }
    if (
      message.action !== CometChatUIKitConstants.groupMemberAction.JOINED &&
      message.action !== CometChatUIKitConstants.groupMemberAction.LEFT &&
      (message.actionBy.hasOwnProperty("name") === false ||
        message.actionOn.hasOwnProperty("name") === false)
    ) {
      return actionMessage;
    }
    if (
      message.action === CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE
    ) {
      if (
        message.hasOwnProperty("data") &&
        message.data.hasOwnProperty("extras")
      ) {
        if (message.data.extras.hasOwnProperty("scope")) {
          if (message.data.extras.scope.hasOwnProperty("new") === false) {
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
      message.action ===
      CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE &&
      message.data.extras.hasOwnProperty("scope") === false
    ) {
      return actionMessage;
    }
    if (
      message.action ===
      CometChatUIKitConstants.groupMemberAction.SCOPE_CHANGE &&
      message.data.extras.scope.hasOwnProperty("new") === false
    ) {
      return actionMessage;
    }
    const byEntity = message.actionBy;
    const onEntity = message.actionOn;
    const byString = byEntity.name;
    const forString =
      message.action !== CometChatUIKitConstants.groupMemberAction.JOINED &&
        message.action !== CometChatUIKitConstants.groupMemberAction.LEFT
        ? onEntity.name
        : "";
    switch (message.action) {
      case CometChatUIKitConstants.groupMemberAction.ADDED:
        actionMessage = `${byString} Added ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.JOINED:
        actionMessage = `${byString} Joined}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.LEFT:
        actionMessage = `${byString} left}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.KICKED:
        actionMessage = `${byString} kicked ${forString}`;
        break;
      case CometChatUIKitConstants.groupMemberAction.BANNED:
        actionMessage = `${byString} Banned} ${forString}`;
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

  getDeleteMessageBubble(
    message: CometChat.BaseMessage,
    text?: string,
    alignment?: MessageBubbleAlignment
  ) {
    return <CometChatDeleteBubble isSentByMe={alignment == MessageBubbleAlignment.right} text={text} />;
  }

  getGroupActionBubble(
    message: CometChat.BaseMessage,

  ) {
    let messageText = this.getActionMessage(message);
    return <CometChatActionBubble messageText={messageText} />;
  }


  getTextMessageBubble(
    messageText: string,
    message: CometChat.TextMessage,
    alignment: MessageBubbleAlignment,
    additionalConfigurations?: additionalParams
  ): Element | JSX.Element {
    let config = {
      ...additionalConfigurations,
      textFormatters:
        additionalConfigurations?.textFormatters &&
          additionalConfigurations?.textFormatters.length
          ? [...additionalConfigurations.textFormatters]
          : this.getAllTextFormatters({ alignment, disableMentions: additionalConfigurations?.disableMentions }),
    };

    let textFormatters: Array<CometChatTextFormatter> = config.textFormatters;
    let urlTextFormatter!: CometChatUrlsFormatter;
    if (config && !config.disableMentions) {
      let mentionsTextFormatter!: CometChatMentionsFormatter;
      for (let i = 0; i < textFormatters.length; i++) {
        if (textFormatters[i] instanceof CometChatMentionsFormatter) {
          mentionsTextFormatter = textFormatters[
            i
          ] as CometChatMentionsFormatter;
          mentionsTextFormatter.setMessage(message);
          if (message.getMentionedUsers().length) {
            mentionsTextFormatter.setCometChatUserGroupMembers(
              message.getMentionedUsers()
            );
          }
          mentionsTextFormatter.setLoggedInUser(
            CometChatUIKitLoginListener.getLoggedInUser()!
          );
          if (urlTextFormatter) {
            break;
          }
        }
        if (textFormatters[i] instanceof CometChatUrlsFormatter) {
          urlTextFormatter = textFormatters[i] as CometChatUrlsFormatter;
          if (mentionsTextFormatter) {
            break;
          }
        }
      }
      if (!mentionsTextFormatter) {
        mentionsTextFormatter =
          ChatConfigurator.getDataSource().getMentionsTextFormatter({
            message,
            ...config,
            alignment,

          });
        textFormatters.push(mentionsTextFormatter);
      }
    } else {
      for (let i = 0; i < textFormatters.length; i++) {
        if (textFormatters[i] instanceof CometChatUrlsFormatter) {
          urlTextFormatter = textFormatters[i] as CometChatUrlsFormatter;
          break;
        }
      }
    }

    if (!urlTextFormatter) {
      urlTextFormatter = ChatConfigurator.getDataSource().getUrlTextFormatter({

        alignment,
      });
      textFormatters.push(urlTextFormatter);
    }


    for (let i = 0; i < textFormatters.length; i++) {
      textFormatters[i].setMessageBubbleAlignment(alignment);
      textFormatters[i].setMessage(message);
    }
    return (
      <CometChatTextBubble
        isSentByMe={alignment == MessageBubbleAlignment.right} text={messageText}
        textFormatters={textFormatters}
      />
    );
  }

  getAudioMessageBubble(
    audioUrl: string,
    message: CometChat.MediaMessage,
    title?: string, alignment?: MessageBubbleAlignment): Element | JSX.Element {
    return <CometChatAudioBubble isSentByMe={alignment == MessageBubbleAlignment.right}
      src={audioUrl} />;
  }
  /**
   * Function to check mimeType and return the iconUrl of that type
   * @param mimeType 
   * @returns 
   */
  getFileType = (mimeType: string): string => {
    if (!mimeType) {
      return "";
    }
    if (mimeType.startsWith('audio/')) {
      return mp3Icon;
    }

    if (mimeType.startsWith('video/')) {
      return movIcon;
    }

    if (mimeType.startsWith('image/')) {
      return jpgIcon;
    }
    if (mimeType.startsWith('text/')) {
      let icon = mimeType == 'text/html' ? linkIcon : txtIcon
      return icon;
    }
    const mimeTypeMap: { [key: string]: string } = {
      'application/pdf': pdfIcon,
      'application/msword': wordIcon,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': wordIcon,
      'application/vnd.ms-excel': xlsxIcon,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': xlsxIcon,
      'application/vnd.ms-powerpoint': pptIcon,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': pptIcon,
      'application/zip': zipIcon,
      'application/x-rar-compressed': zipIcon,
    };

    return mimeTypeMap[mimeType] || unsupportedIcon;
  };
  /**
   * Function to convert bites to human readable fromat eg. kb,mb,gb
   * @param sizeInBytes 
   * @returns 
   */
  getFileSize = (sizeInBytes: number): string => {
    if (!sizeInBytes) {
      return "";
    }
    const sizeUnits = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < sizeUnits.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${Math.round(size)} ${sizeUnits[unitIndex]}`;
  };


  getFileMessageBubble(
    fileUrl: string,
    message: CometChat.MediaMessage,
    title?: string,
    alignment?: MessageBubbleAlignment): Element | JSX.Element {
    let attachment = message.getAttachments()[0];
    const metadataFile = (message.getMetadata() as any)?.file as File | undefined;
    const name = title ?? attachment?.getName() ?? metadataFile?.name;
    const mimeType = attachment?.getMimeType() ?? metadataFile?.type;
    const size = this.getFileSize(attachment?.getSize() ?? metadataFile?.size);
    const icon = this.getFileType(mimeType);
    const subtitle = `${size} ${attachment?.getExtension() ? `• ${attachment.getExtension()}` : ''}`.trim();
    return (
      <CometChatFileBubble
        fileTypeIconURL={icon}
        subtitle={subtitle}
        title={name}
        fileURL={fileUrl}
        isSentByMe={alignment == MessageBubbleAlignment.right}
      />
    );
  }

  getImageMessageBubble(
    imageUrl: string,
    placeholderImage: string,
    message: CometChat.MediaMessage,

    onClick?: Function) {


    const fullScreenViewer = (
      <CometChatFullScreenViewer
        URL={message?.getAttachments()[0]?.getUrl() ?? imageUrl}
        ccCloseClicked={() => {
          CometChatUIEvents.ccHideDialog.next();
        }}
        message={message}
      />
    );
    return (
      <CometChatImageBubble
        src={imageUrl}
        placeholderImage={placeholderImage}
        isSentByMe={this.getIsSentByMe(message)}
        onImageClicked={!isMobileDevice() ? () => {
          CometChatUIEvents.ccShowDialog.next({
            child: fullScreenViewer,
            confirmCallback: null,
          });
        } : undefined}
      />
    );
  }

  getVideoMessageBubble(
    videoUrl: string,
    message: CometChat.MediaMessage,

    thumbnailUrl?: string,
    onClick?: Function
  ): Element | JSX.Element {


    return (
      <CometChatVideoBubble
        isSentByMe={this.getIsSentByMe(message)}
        src={videoUrl}
      />
    );
  }

  imageAttachmentOption(): CometChatMessageComposerAction {
    return new CometChatMessageComposerAction({
      id: CometChatUIKitConstants.MessageTypes.image,
      title: "Attach image", // Replaced with actual text
      iconURL: ImageIcon,
      onClick: null
    });
  }

  videoAttachmentOption(): CometChatMessageComposerAction {
    return new CometChatMessageComposerAction({
      id: CometChatUIKitConstants.MessageTypes.video,
      title: "Attach video", // Replaced with actual text
      iconURL: VideoIcon,
      onClick: null
    });
  }

  audioAttachmentOption(): CometChatMessageComposerAction {
    return new CometChatMessageComposerAction({
      id: CometChatUIKitConstants.MessageTypes.audio,
      title: "Attach audio", // Replaced with actual text
      iconURL: AudioIcon,
      onClick: null
    });
  }

  fileAttachmentOption(): CometChatMessageComposerAction {
    return new CometChatMessageComposerAction({
      id: CometChatUIKitConstants.MessageTypes.file,
      title: "Attach file", // Replaced with actual text
      iconURL: FileIcon,
      onClick: null
    });
  }


  getAttachmentOptions(

    id: ComposerId,
    additionalConfigurations?: any
  ): Array<CometChatMessageComposerAction> {
    const actionsData: CometChatMessageComposerAction[] = [
      this.imageAttachmentOption(),
      this.videoAttachmentOption(),
      this.audioAttachmentOption(),
      this.fileAttachmentOption(),
    ];
    const showAttachmentsMap = {
      [CometChatUIKitConstants.MessageTypes.image]: additionalConfigurations?.hideImageAttachmentOption,
      [CometChatUIKitConstants.MessageTypes.video]: additionalConfigurations?.hideVideoAttachmentOption,
      [CometChatUIKitConstants.MessageTypes.audio]: additionalConfigurations?.hideAudioAttachmentOption,
      [CometChatUIKitConstants.MessageTypes.file]: additionalConfigurations?.hideFileAttachmentOption,
    };
    const actions = actionsData.filter(action => !showAttachmentsMap[action.id]);
    return actions;
  }

  getLastConversationMessage(
    conversation: CometChat.Conversation,
    loggedInUser: CometChat.User,
    additionalConfigurations: additionalParams
  ): string {
    let config = {
      ...additionalConfigurations,
      textFormatters:
        additionalConfigurations?.textFormatters &&
          additionalConfigurations?.textFormatters.length
          ? [...additionalConfigurations.textFormatters]
          : [this.getMentionsTextFormatter({ disableMentions: additionalConfigurations.disableMentions })],
    };
    let message = ConversationUtils.getLastConversationMessage(
      conversation,
      loggedInUser,
      config as any  // toDo remove any
    );
    let messageObject = conversation.getLastMessage();


    if (messageObject) {

      let textFormatters: Array<CometChatTextFormatter> = config.textFormatters;
      if (config && !config.disableMentions) {
        let mentionsTextFormatter!: CometChatMentionsFormatter;
        for (let i = 0; i < textFormatters.length; i++) {
          if (textFormatters[i] instanceof CometChatMentionsFormatter) {
            mentionsTextFormatter = textFormatters[
              i
            ] as unknown as CometChatMentionsFormatter;
            mentionsTextFormatter.setMessage(messageObject);
            if (messageObject.getMentionedUsers().length) {
              mentionsTextFormatter.setCometChatUserGroupMembers(
                messageObject.getMentionedUsers()
              );
            }
            mentionsTextFormatter.setLoggedInUser(
              CometChatUIKitLoginListener.getLoggedInUser()!
            );
          }
          if (mentionsTextFormatter) {
            break;
          }
        }
        if (!mentionsTextFormatter) {
          mentionsTextFormatter =
            ChatConfigurator.getDataSource().getMentionsTextFormatter({
              messageObject,
              ...config,
              alignment: null
            });
          textFormatters.push(mentionsTextFormatter);
        }
      }

      if (
        messageObject &&
        messageObject instanceof CometChat.TextMessage
      ) {
        for (let i = 0; i < textFormatters.length; i++) {
          let temp_message = textFormatters[i].getFormattedText(message, { mentionsTargetElement: MentionsTargetElement.conversation });
          if (typeof (temp_message) == "string") {
            message = temp_message;
          }
        }
      }
    }


    return message;
  }



  getAuxiliaryHeaderMenu(user?: CometChat.User, group?: CometChat.Group, additionalConfigurations?: any): Element[] | JSX.Element[] {
    return [];
  }


  /**
   * Adds styled @ for every mention in the text by matching uid
   *
   * @param {CometChat.TextMessage} message
   * @param {string} subtitle
   * @returns {void}
   */
  getMentionsFormattedText(
    message: CometChat.TextMessage,
    subtitle: string,
    mentionsFormatterParams: {
      mentionsTargetElement: MentionsTargetElement
    }
  ) {
    const regex = /<@uid:(.*?)>/g;
    let messageText = message.getText();
    let messageTextTmp: string = subtitle;
    let match = regex.exec(messageText);
    let cometChatUsers: Array<CometChat.User | CometChat.GroupMember> = [];
    let mentionedUsers = message.getMentionedUsers();
    while (match !== null) {
      let user;
      for (let i = 0; i < mentionedUsers.length; i++) {
        if (match[1] == mentionedUsers[i].getUid()) {
          user = mentionedUsers[i];
        }
      }
      if (user) {
        cometChatUsers.push(user);
      }
      match = regex.exec(messageText);
    }
    let mentionsFormatter = this.getMentionsTextFormatter({

    });

    mentionsFormatter.setClasses(["cc-mentions"]);
    mentionsFormatter.setCometChatUserGroupMembers(cometChatUsers);

    messageTextTmp = mentionsFormatter.getFormattedText(
      messageTextTmp,
      mentionsFormatterParams
    ) as string;
    return messageTextTmp;
  }

  getAllTextFormatters(formatterParams: additionalParams): CometChatTextFormatter[] {
    let formatters = [];
    const mentionsFormatter = formatterParams.disableMentions ? null : ChatConfigurator.getDataSource().getMentionsTextFormatter(
      formatterParams
    );
    const urlTextFormatter = ChatConfigurator.getDataSource().getUrlTextFormatter(formatterParams);
    if (mentionsFormatter) {
      formatters.push(mentionsFormatter);
    }
    if (urlTextFormatter) {
      formatters.push(urlTextFormatter);
    }
    return formatters;
  }

  getMentionsTextFormatter(params: additionalParams): CometChatMentionsFormatter {
    let mentionsTextFormatter = new CometChatMentionsFormatter();
    return mentionsTextFormatter;
  }

  getUrlTextFormatter(params: additionalParams = {}): CometChatUrlsFormatter {
    let urlTextFormatter = new CometChatUrlsFormatter([
      /((https?:\/\/|www\.)[^\s]+)/i,
    ]);
    return urlTextFormatter;
  }
}
