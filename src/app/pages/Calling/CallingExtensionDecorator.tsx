import { CometChat } from "@cometchat/chat-sdk-javascript";
import React from "react";
import { DataSourceDecorator } from "src/utils/DataSourceDecorator";
import incomingVideoCall from 'assets/icons/incoming_video.svg';
import outgoingVideoCall from 'assets/icons/outgoing_video.svg';
import incomingAudioCall from 'assets/icons/phone_incoming.svg';
import outgoingAudioCall from 'assets/icons/phone_outgoing.svg';
import { CometChatOngoingCall } from "./CometChatOngoingCall/CometChatOngoingCall";
import { CometChatCallButtons } from "./CometChatCallButtons/CometChatCallButtons";
import { CallingConfiguration } from "./CallingConfiguration";
import { CallingDetailsUtils } from "src/utils/CallingDetailsUtils";
import { CometChatActionBubble } from "../BaseComponents/CometChatActionBubble/CometChatActionBubble";
import { ChatConfigurator } from "src/utils/ChatConfigurator";
import { DataSource } from "src/utils/DataSource";
import { CometChatUIKitConstants } from "../constants/CometChatUIKitConstants";
import { MessageBubbleAlignment, CallWorkflow, DatePatterns } from "../Enums/Enums";
import { CometChatMessageTemplate } from "src/utils/modals";
import { CometChatCallBubble } from "../BaseComponents/CometChatCallBubble/CometChatCallBubble";
import { CometChatUIEvents } from "../events/CometChatUIEvents";
import { CometChatDate } from "../BaseComponents/CometChatDate/CometChatDate";
import { CometChatUIKitCalls } from "src/utils/CometChatUIKit/CometChatCalls";

const CallingConstants = Object.freeze({
  meeting: "meeting",
  ongoing: "ongoing",
  ended: "ended",
  initiated: "initiated",
  cancelled: "cancelled",
  rejected: "rejected",
  unanswered: "unanswered",
});



export class CallingExtensionDecorator extends DataSourceDecorator {
  public loggedInUser: CometChat.User | null = null;
  public configuration?: CallingConfiguration = new CallingConfiguration({});

  constructor(dataSource: DataSource, configuration?: CallingConfiguration) {
    super(dataSource);
    this.addLoginListener();
    this.getLoggedInUser();
    this.configuration = configuration;
  }

  addLoginListener() {
    var listenerID: string = "login_listener";
    CometChat.addLoginListener(
      listenerID,
      new CometChat.LoginListener({
        logoutSuccess: () => {
          try {
            let call: CometChat.Call = CometChat.getActiveCall();
            if (call) {
              CometChat.endCall(call.getSessionId());
            }
          } catch (error) {
            console.log("error in endCall on logout", error);
          }
        },
      })
    );
  }

  async getLoggedInUser() {
    this.loggedInUser = await CometChat.getLoggedinUser();
  }

  override getAllMessageTypes(): string[] {
    const types = super.getAllMessageTypes();
    if (!types.includes(CallingConstants.meeting)) {
      types.push(CallingConstants.meeting);
    }
    if (!types.includes(CometChatUIKitConstants.MessageTypes.audio)) {
      types.push(CometChatUIKitConstants.MessageTypes.audio);
    }
    if (!types.includes(CometChatUIKitConstants.MessageTypes.video)) {
      types.push(CometChatUIKitConstants.MessageTypes.video);
    }
    return types;
  }

  override getId(): string {
    return "calling";
  }

  override getAllMessageCategories(additionalConfigurations?: Object | undefined): string[] {
    const categories = super.getAllMessageCategories(additionalConfigurations);
    if (!categories.includes(CometChatUIKitConstants.MessageCategory.call)) {
      categories.push(CometChatUIKitConstants.MessageCategory.call);
    }
    if (!categories.includes(CometChatUIKitConstants.MessageCategory.custom)) {
      categories.push(CometChatUIKitConstants.MessageCategory.custom);
    }
    return categories;
  }

  checkIfTemplateTypeExist(
    template: CometChatMessageTemplate[],
    type: string
  ): boolean {
    return template.some((obj) => obj.type === type);
  }

  checkIfTemplateCategoryExist(
    template: CometChatMessageTemplate[],
    category: string
  ): boolean {
    return template.some((obj) => obj.category === category);
  }

  override getAllMessageTemplates(
    additionalConfigurations?: any
  ): CometChatMessageTemplate[] {
    const templates = super.getAllMessageTemplates(
      additionalConfigurations
    );
    if (!this.checkIfTemplateTypeExist(templates, CallingConstants.meeting)) {
      templates.push(this.getDirectCallTemplate());
    }
    if (
      !this.checkIfTemplateCategoryExist(
        templates,
        CometChatUIKitConstants.MessageCategory.call
      )
    ) {
      templates.push(...this.getDefaultCallTemplate());
    }
    return templates;
  }

  getDirectCallTemplate(): CometChatMessageTemplate {
    return new CometChatMessageTemplate({
      type: CallingConstants.meeting,
      category: CometChatUIKitConstants.MessageCategory.custom,
      statusInfoView: super.getStatusInfoView,
      contentView: (
        message: CometChat.BaseMessage,
        _alignment: MessageBubbleAlignment
      ) => {
        if (message.getDeletedAt()) {
          return super.getDeleteMessageBubble(message, undefined, _alignment);
        }
        return this.getDirectCallMessageBubble(
          message as CometChat.CustomMessage,
          _alignment,
        );
      },
      options: (
        loggedInUser: CometChat.User,
        messageObject: CometChat.BaseMessage,
        group?: CometChat.Group,
        additionalParams?: Object | undefined
      ) => {
        return ChatConfigurator.getDataSource().getCommonOptions(
          loggedInUser,
          messageObject,
          group,
          additionalParams
        );
      },
      bottomView: (
        message: CometChat.BaseMessage,
        alignment: MessageBubbleAlignment
      ) => {
        return super.getBottomView(message, alignment);
      },
    });
  }

  getDefaultCallTemplate(): CometChatMessageTemplate[] {
    let templates: CometChatMessageTemplate[] = [
      new CometChatMessageTemplate({
        type: CometChatUIKitConstants.MessageTypes.audio,
        category: CometChatUIKitConstants.MessageCategory.call,
        contentView: (
          message: CometChat.BaseMessage,
          _alignment: MessageBubbleAlignment
        ) => {
          return this.getDefaultAudioCallMessageBubble(
            message as CometChat.Call,
            _alignment
          );
        },
        bottomView: (
          message: CometChat.BaseMessage,
          alignment: MessageBubbleAlignment
        ) => {
          return super.getBottomView(message, alignment);
        },
      }),
      new CometChatMessageTemplate({
        type: CometChatUIKitConstants.MessageTypes.video,
        category: CometChatUIKitConstants.MessageCategory.call,
        contentView: (
          message: CometChat.BaseMessage,
          _alignment: MessageBubbleAlignment
        ) => {
          return this.getDefaultVideoCallMessageBubble(
            message as CometChat.Call,
            _alignment
          );
        },
        bottomView: (
          message: CometChat.BaseMessage,
          alignment: MessageBubbleAlignment
        ) => {
          return super.getBottomView(message, alignment);
        },
      }),
    ];
    return templates;
  }

  getSessionId(_message: CometChat.CustomMessage) {
    let data = _message.getData();
    return data?.customData?.sessionID;
  }



  getDirectCallMessageBubble(
    _message: CometChat.CustomMessage,
    _alignment: MessageBubbleAlignment
  ) {
    let sessionId = this.getSessionId(_message);

    let joinCallButtonText = "join";
    let isMyMessage = !_message.getSender() || this.loggedInUser?.getUid() == _message.getSender().getUid();
    let isAudioCall = (_message.getCustomData() as any).callType == CometChatUIKitConstants.MessageTypes.audio;
    let audioIcon = isMyMessage ? outgoingAudioCall : incomingAudioCall;
    let videoIcon = isMyMessage ? outgoingVideoCall : incomingVideoCall;
    let callIcon = isAudioCall ? audioIcon : videoIcon;
    let callBubbleTitle = isAudioCall ? "Voice Call" : "Video Call";
    return (
      <CometChatCallBubble
        subtitle={<CometChatDate timestamp={_message.getSentAt()} pattern={DatePatterns.DateTime} />}
        isSentByMe={isMyMessage}
        sessionId={sessionId}
        title={callBubbleTitle}
        buttonText={joinCallButtonText}
        onClicked={() => {
          this.startDirectCall(sessionId, _message);
        }}
        iconURL={callIcon}
      />
    );
  }

  startDirectCall(sessionId: string, message: CometChat.CustomMessage) {
    let callBuilder;
    let audioOnlyCall = (message.getCustomData() as any)?.callType == CometChatUIKitConstants.MessageTypes.audio;
    if (this.configuration?.groupCallSettingsBuilder) {
      callBuilder = this.configuration?.groupCallSettingsBuilder(message)
    }
    else {
      callBuilder = new CometChatUIKitCalls.CallSettingsBuilder()
        .enableDefaultLayout(true)
        .setIsAudioOnlyCall(audioOnlyCall);

      callBuilder.setCallListener(
        new CometChatUIKitCalls.OngoingCallListener({
          onCallEndButtonPressed: () => {
            CometChatUIEvents.ccShowOngoingCall.next({ child: null });
          },
        })
      );
    }

    const ongoingCallScreen = (
      <CometChatOngoingCall callSettingsBuilder={callBuilder} sessionID={sessionId} callWorkflow={CallWorkflow.directCalling} />
    );
    CometChatUIEvents.ccShowOngoingCall.next({ child: ongoingCallScreen });
  }


  getCallActionMessage(_message: CometChat.Call) {
    return CallingDetailsUtils.getCallStatus(_message, this.loggedInUser!);
  }
  getCallStatusClass(message: CometChat.Call) {
    switch (CallingDetailsUtils.getCallStatus(message, this.loggedInUser!)) {
      case "Outgoing Call":
        return "cometchat-message-bubble__outgoing-call";
      case "Incoming Call":
        return "cometchat-message-bubble__incoming-call";
      case "Call Cancelled":
        return "cometchat-message-bubble__cancelled-call";
      case "Call Rejected":
        return "cometchat-message-bubble__rejected-call";
      case "Call Busy":
        return "cometchat-message-bubble__busy-call";
      case "Call Ended":
        return "cometchat-message-bubble__ended-call";
      case "Call Answered":
        return "cometchat-message-bubble__answered-call";
      case "Call Unanswered":
        return "cometchat-message-bubble__unanswered-call";
      case "Missed Call":
        return "cometchat-message-bubble__missed-call";

      default:
        return "";
    }
  }

  getDefaultAudioCallMessageBubble(
    _message: CometChat.Call,
    _alignment: MessageBubbleAlignment
  ) {
    return (
      <div className={this.getCallStatusClass(_message)}><CometChatActionBubble messageText={this.getCallActionMessage(_message)} /></div>
    );
  }

  getDefaultVideoCallMessageBubble(
    _message: CometChat.Call,
    _alignment: MessageBubbleAlignment
  ) {
    return (
      <div className={this.getCallStatusClass(_message)}><CometChatActionBubble messageText={this.getCallActionMessage(_message)} /></div>
    );
  }

  override getLastConversationMessage(
    conversation: CometChat.Conversation,
    loggedInUser: CometChat.User,
    additionalParams?: any
  ): string {
    let actionMessage: string = "";

    if (
      conversation.getLastMessage() &&
      conversation.getLastMessage().category ==
      CometChatUIKitConstants.MessageCategory.call
    ) {
      let call: CometChat.Call = conversation.getLastMessage();

      actionMessage = CallingDetailsUtils.getCallStatus(call, loggedInUser);
    } else if (
      conversation?.getLastMessage() &&
      conversation.getLastMessage().type ==
      CometChatUIKitConstants.calls.meeting
    ) {
      let message: CometChat.CustomMessage = conversation.getLastMessage();
      let callType = message.getData().customData?.callType;
      if (
        !message.getSender() ||
        message?.getSender()?.getUid() == loggedInUser.getUid()
      ) {
        if (callType === CometChatUIKitConstants.MessageTypes.audio) {
          actionMessage = "You've initiated an audio call";
        } else if (callType === CometChatUIKitConstants.MessageTypes.video) {
          actionMessage = "You've initiated a video call";
        } else {
          if (callType === CometChatUIKitConstants.MessageTypes.audio) {
            actionMessage = `${message.getSender().getName()} has initiated an audio call`;
          } else if (callType === CometChatUIKitConstants.MessageTypes.video) {
            actionMessage = `${message.getSender().getName()} has initiated a video call`;
          }
        }
      }

      let messageObject = conversation.getLastMessage();
      if (
        messageObject &&
        messageObject.getMentionedUsers().length &&
        messageObject instanceof CometChat.TextMessage &&
        additionalParams &&
        !additionalParams.disableMentions
      ) {
        actionMessage = this.getMentionsFormattedText(
          messageObject,
          actionMessage,
          additionalParams
        );
      }
    } else {
      actionMessage = super.getLastConversationMessage(
        conversation,
        loggedInUser,
        additionalParams
      );
    }
    return actionMessage;
  }

  override getAuxiliaryHeaderMenu(
    user?: CometChat.User,
    group?: CometChat.Group,
    additionalConfigurations?: any
  ) {
    let auxMenus: Array<any> = [];
    if (additionalConfigurations?.hideVideoCallButton && additionalConfigurations?.hideVoiceCallButton) {
      return []
    }
    let callButtons = (
      <CometChatCallButtons
        user={user!}
        group={group!}
        key={"callbuttons"}
        onError={this.configuration?.callButtonConfiguration?.onError}
        outgoingCallConfiguration={this.configuration?.callButtonConfiguration?.outgoingCallConfiguration}
        callSettingsBuilder={this.configuration?.callButtonConfiguration?.callSettingsBuilder}
        hideVideoCallButton={additionalConfigurations?.hideVideoCallButton}
        hideVoiceCallButton={additionalConfigurations?.hideVoiceCallButton}
      />
    );
    auxMenus.push(callButtons);
    return auxMenus;
  }
}
