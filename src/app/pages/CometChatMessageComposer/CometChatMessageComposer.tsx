import React, {
  JSX,
  LegacyRef,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUserMemberWrapper } from "../CometChatUserMemberWrapper/CometChatUserMemberWrapper";
import { useCometChatMessageComposer } from "./useCometChatMessageComposer";
import MicIcon from "/assets/icons/mic.svg";
import MicIconFill from "/assets/icons/mic_fill.svg";
import PlusIcon from "/assets/icons/add_circle.svg";
import PlusIconFill from "/assets/icons/add_circle_fill.svg";
import SendIconFill from "/assets/icons/send_fill.svg";
import SmileysIcon from "/assets/icons/mood.svg";
import SmileysIconFill from "/assets/icons/mood_fill.svg";
import { flushSync } from "react-dom";
import { EnterKeyBehavior, MentionsTargetElement, MessageStatus, Placement, PreviewMessageMode, UserMemberListType } from "../Enums/Enums";
import { CometChatButton } from "../BaseComponents/CometChatButton/CometChatButton";
import { CometChatPopover } from "../BaseComponents/CometChatPopover/CometChatPopover";
import { CometChatActionSheet } from "../BaseComponents/CometChatActionSheet/CometChatActionSheet";
import { CometChatUIKitLoginListener } from "src/utils/CometChatUIKit/CometChatUIKitLoginListener";
import { useCometChatErrorHandler, useRefSync } from "src/utils/CometChatCustomHooks";
import { ChatConfigurator } from "src/utils/ChatConfigurator";
import { CometChatUIKitUtility } from "src/utils/CometChatUIKit/CometChatUIKitUtility";
import { CometChatMentionsFormatter, CometChatTextFormatter } from "src/utils/formatters";
import { CometChatMessageComposerAction, CometChatActionsView } from "src/utils/modals";
import { CometChatUIKitConstants } from "../constants/CometChatUIKitConstants";
import { CometChatSoundManager } from "../resources/CometChatSoundManager/CometChatSoundManager";
import { CometChatMediaRecorder } from "../BaseComponents/CometChatMediaRecorder/CometChatMediaRecorder";
import { CometChatEditPreview } from "../BaseComponents/CometChatEditPreview/CometChatEditPreview";
import { CometChatEmojiKeyboard } from "../BaseComponents/CometChatEmojiKeyboard/CometChatEmojiKeyboard";
import { ComposerId } from "src/utils/MessagesDataSource";
import { processFileForAudio, getThemeVariable, isMobileDevice, isSafari } from "src/utils/util";
import { CometChatMessageEvents } from "../events/CometChatMessageEvents";
import { CometChatUIEvents } from "../events/CometChatUIEvents";

export type ContentToDisplay =
  | "attachments"
  | "emojiKeyboard"
  | "voiceRecording"
  | "ai"
  | "none";
type MediaMessageFileType =
  | typeof CometChatUIKitConstants.MessageTypes.image
  | typeof CometChatUIKitConstants.MessageTypes.video
  | typeof CometChatUIKitConstants.MessageTypes.audio
  | typeof CometChatUIKitConstants.MessageTypes.file;
export type ActionOnClickType = (() => void) | null;

interface MessageComposerProps {
  /**
   * The initial text pre-filled in the message input when the component mounts.
   * @defaultValue ""
   */
  initialComposerText?: string;

  /**
   * Disables the typing indicator for the current message composer.
   * @defaultValue `false`
   */
  disableTypingEvents?: boolean;

  /**
   * Disables the mentions functionality in the message composer.
   * @defaultValue `false`
   */
  disableMentions?: boolean;

  /**
   * Hides the image attachment option in the message composer.
   * @defaultValue `false`
   */
  hideImageAttachmentOption?: boolean;

  /**
   * Hides the video attachment option in the message composer.
   * @defaultValue `false`
   */
  hideVideoAttachmentOption?: boolean;

  /**
   * Hides the audio attachment option in the message composer.
   * @defaultValue `false`
   */
  hideAudioAttachmentOption?: boolean;

  /**
   * Hides the file attachment option in the message composer.
   * @defaultValue `false`
   */
  hideFileAttachmentOption?: boolean;

  /**
   * Hides the polls option in the message composer.
   * @defaultValue `false`
   */
  hidePollsOption?: boolean;

  /**
   * Hides the collaborative document option in the message composer.
   * @defaultValue `false`
   */
  hideCollaborativeDocumentOption?: boolean;

  /**
   * Hides the collaborative whiteboard option in the message composer.
   * @defaultValue `false`
   */
  hideCollaborativeWhiteboardOption?: boolean;

  /**
   * Hides the attachment button in the message composer.
   * @defaultValue `false`
   */
  hideAttachmentButton?: boolean;

  /**
   * Hides the voice recording button in the message composer.
   * @defaultValue `false`
   */
  hideVoiceRecordingButton?: boolean;

  /**
   * Hides the emoji keyboard button in the message composer.
   * @defaultValue `false`
   */
  hideEmojiKeyboardButton?: boolean;

  /**
   * Hides the stickers button in the message composer.
   * @defaultValue `false`
   */
  hideStickersButton?: boolean;

  /**
   * Hides the send button in the message composer.
   * @defaultValue `false`
   */
  hideSendButton?: boolean;

  /**
   * The user to send messages to. This prop specifies the recipient of the message.
   */
  user?: CometChat.User;

  /**
   * The group to send messages to.
   * @remarks This prop is used if the `user` prop is not provided.
   */
  group?: CometChat.Group;

  /**
   * The ID of the parent message. This is used for threading or replying to a specific message.
   */
  parentMessageId?: number;

  /**
   * Options for default attachments, including various attachment types available in the composer.
   */
  attachmentOptions?: CometChatMessageComposerAction[];

  /**
   * Array of text formatters to apply to the message text for customization and styling.
   */
  textFormatters?: Array<CometChatTextFormatter>;

  /**
   * Determines the behavior of the Enter key in the composer (e.g., send message or add a new line).
   * @default EnterKeyBehavior.SendMessage
   */
  enterKeyBehavior?: EnterKeyBehavior;

  /**
   * Disables sound for incoming messages.
   *
   * @defaultValue `false`
   */
  disableSoundForMessage?: boolean;

  /**
   * Custom audio sound for incoming messages.
   */
  customSoundForMessage?: string;

  /**
   * Callback function triggered when the message input text changes.
   *
   * @param text - The current text value of the message input.
   * @returns void
   */
  onTextChange?: (text: string) => void;

  /**
   * Callback function triggered when the message composer encounters an error.
   *
   * @param error - An instance of `CometChat.CometChatException` representing the error.
   * @returns void
   */
  onError?: ((error: CometChat.CometChatException) => void) | null;

  /**
   * Callback function triggered when the send button is clicked.
   *
   * @param message - The message that was sent.
   * @param previewMessageMode - Optionally, specify if the message is in preview mode.
   */
  onSendButtonClick?: (
    message: CometChat.BaseMessage,
    previewMessageMode?: PreviewMessageMode
  ) => void;

  /**
   * A custom view for the send button to customize its appearance or behavior.
   */
  sendButtonView?: JSX.Element;

  /**
   * A custom view for an auxiliary button, which can be used alongside the send button.
   */
  auxiliaryButtonView?: JSX.Element;

  /**
   * A custom header section displayed at the top of the message composer, often used for media previews or additional information.
   */
  headerView?: JSX.Element;
}

/**
 * Represents the state of the message composer.
 * @type {State}
 */
type State = {
  /** The current text entered in the message input field. */
  text: string;

  /** Additional text to be added to the message input field, often from mentions or formatting. */
  addToMsgInputText: string;
  /** A reference to the text message that is currently being edited, or null if none. */

  textMessageToEdit: CometChat.TextMessage | null;
  /** The content that is currently being displayed in the composer (e.g., text, polls, media). */

  contentToDisplay: ContentToDisplay;
  /** The currently logged-in user, or null if no user is logged in. */

  loggedInUser: CometChat.User | null;
  /** A flag indicating whether the poll UI is visible. */

  showPoll: boolean;
  /** A flag indicating whether a warning about the mention count should be shown. */
  showMentionsCountWarning: boolean;
  /** A flag indicating whether a warning about the file validation should be shown. */
  showValidationError: boolean;
};
/**
 * Represents the possible actions that can be dispatched to update the state.
 * @type {Action}
 */
export type Action =
  /** Action to update the text in the message input field. */

  { type: "setText"; text: State["text"] }
  /** Action to update the additional text to be added to the message input field (e.g., mentions). */

  | {
    type: "setAddToMsgInputText";
    addToMsgInputText: State["addToMsgInputText"];
  }
  /** Action to set the message that is being edited. */

  | {
    type: "setTextMessageToEdit";
    textMessageToEdit: State["textMessageToEdit"];
  }
  /** Action to change the content being displayed in the composer (e.g., text, polls). */

  | { type: "setContentToDisplay"; contentToDisplay: ContentToDisplay }
  /** Action to update the logged-in user in the state. */

  | { type: "setLoggedInUser"; loggedInUser: CometChat.User }
  /** Action to show or hide the poll UI. */

  | { type: "setShowPoll"; showPoll: boolean }
  /** Action to show or hide the mentions count warning. */

  | { type: "setShowMentionsCountWarning"; showMentionsCountWarning: boolean }
  /** Action to show or hide the validation error */

  | { type: "setShowValidationError"; showValidationError: boolean };


const USER_GROUP_NOT_PROVIDED_ERROR_STR =
  "No user or group object provided. Should at least provide one.";
const END_TYPING_AFTER_START_IN_MS = 500;
/**
 * Reducer function to handle state changes for various actions in the message composer.
 * @param {State} state - The current state of the message composer.
 * @param {Action} action - The action to be processed.
 * @returns {State} The updated state based on the dispatched action.
 */
function stateReducer(state: State, action: Action) {
  let newState = state;
  const { type } = action;
  switch (type) {
    case "setText":
      newState = { ...state, text: action.text };
      break;
    case "setAddToMsgInputText":
      newState = { ...state, addToMsgInputText: action.addToMsgInputText };
      break;
    case "setTextMessageToEdit":
      newState = { ...state, textMessageToEdit: action.textMessageToEdit };
      break;
    case "setContentToDisplay":
      newState = { ...state, contentToDisplay: action.contentToDisplay };
      break;
    case "setLoggedInUser":
      newState = { ...state, loggedInUser: action.loggedInUser };
      break;
    case "setShowPoll":
      newState = { ...state, showPoll: action.showPoll };
      break;
    case "setShowMentionsCountWarning":
      newState = {
        ...state,
        showMentionsCountWarning: action.showMentionsCountWarning,
      };
      break;
    case "setShowValidationError":
      newState = {
        ...state,
        showValidationError: action.showValidationError,
      };
      break;
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const x: never = type;
    }
  }
  return newState;
}

/**
 * Renders a message composer to send messages to a user or group of a CometChat App
 */
export function CometChatMessageComposer(props: MessageComposerProps) {
  /**
 * Props destructuring for message input and related UI functionalities.
 */
  const {
    user,
    group,
    initialComposerText: initialText = "",
    onTextChange,
    onSendButtonClick,
    onError,
    sendButtonView,
    auxiliaryButtonView,
    headerView = null,
    attachmentOptions,
    parentMessageId = null,
    disableTypingEvents = false,
    disableMentions = false,
    hideImageAttachmentOption = false,
    hideVideoAttachmentOption = false,
    hideAudioAttachmentOption = false,
    hideFileAttachmentOption = false,
    hidePollsOption = false,
    hideCollaborativeDocumentOption = false,
    hideCollaborativeWhiteboardOption = false,
    hideAttachmentButton = false,
    hideVoiceRecordingButton = false,
    hideEmojiKeyboardButton = false,
    hideStickersButton = false,
    hideSendButton = false,
    textFormatters = [],
    enterKeyBehavior = EnterKeyBehavior.SendMessage,
    disableSoundForMessage = false,
    customSoundForMessage,
  } = props;

  /**
   * Initialize state with the reducer, passing initial values for the text input and editor state.
   */
  const [state, dispatch] = useReducer(stateReducer, {
    text: initialText,
    addToMsgInputText: initialText,
    textMessageToEdit: null,
    contentToDisplay: "none",
    loggedInUser: null,
    showPoll: false,
    showMentionsCountWarning: false,
    showValidationError: false
  });
  /**
 * Refs for handling various elements and their functionalities.
 */
  const textInputRef = useRef<HTMLDivElement | null>(null);
  const mediaFilePickerRef = useRef<HTMLInputElement | null>(null);
  const aiBtnRef = React.createRef<{
    openPopover: () => void;
    closePopover: () => void;
  }>();
  const attachmentsBtnRef = React.createRef<{
    openPopover: () => void;
    closePopover: () => void;
  }>();
  const emojiBtnRef = React.createRef<{
    openPopover: () => void;
    closePopover: () => void;
  }>();
  const voiceRecordingBtnRef = React.createRef<{
    openPopover: () => void;
    closePopover: () => void;
  }>();
  /**
 * Processes a file by reading its binary content and creating a new File object.
 * @param {File} file - The file to be processed.
 * @returns {Promise<File>} A promise that resolves with the processed file.
 */
  function processFile(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result !== null) {
            resolve(new File([reader.result], file.name, file));
          }
        };
        reader.onerror = () => {
          reject(
            new Error(`Converting the file named "${file.name}" to binary failed`)
          );
        }
        reader.readAsArrayBuffer(file);
      } catch (error) {
        errorHandler(error, "processFile")
      }
    });
  }
  /*
  * isPartOfCurrentChatForUIEvent: To check if the message belongs for this list and is not part of thread even for current list
    it only runs for UI event because it assumes logged in user is always sender
  * @param: message: CometChat.BaseMessage
*/
  const isPartOfCurrentChatForUIEvent: (message: CometChat.BaseMessage) => boolean | undefined = useCallback(
    (message: CometChat.BaseMessage) => {
      try {
        const receiverId = message?.getReceiverId();
        const receiverType = message?.getReceiverType();
        if (parentMessageIdPropRef.current) {
          if (message.getParentMessageId() === parentMessageIdPropRef.current) {
            return true;
          }
        } else {
          if (message.getParentMessageId()) {
            return false
          }

          if (userPropRef.current) {
            if (receiverType === CometChatUIKitConstants.MessageReceiverType.user && receiverId === userPropRef.current.getUid()) {
              return true
            }
          } else if (groupPropRef.current) {
            if (receiverType === CometChatUIKitConstants.MessageReceiverType.group && receiverId === groupPropRef.current.getGuid()) {
              return true
            }
          }
          return false;
        }
      } catch (error) {
        errorHandler(error, "isPartOfCurrentChatForUIEvent")
      }
    },
    []
  );

  /**
   * Sync props with refs for keeping track of previous values.
   */
  const actionIdToActionOnClick = useRef(new Map<string, ActionOnClickType>());
  const endTypingTimeoutId = useRef<number | null>(null);
  const createPollViewRef = useRef(null);
  const errorHandler = useCometChatErrorHandler(onError);
  const userPropRef = useRefSync(user);
  const groupPropRef = useRefSync(group);
  const parentMessageIdPropRef = useRefSync(parentMessageId);
  const onSendButtonClickPropRef = useRefSync(onSendButtonClick);
  const [smartRepliesView, setSmartRepliesView] = React.useState<React.ReactNode | null>(null);
  const [textFormatterArray, setTextFormatters] = useState(textFormatters);
  const [mentionsSearchTerm, setMentionsSearchTerm] = useState("");
  const mentionsSearchTermTemp = React.useRef<string>("");
  const lastEmptySearchTerm = React.useRef("");
  const sel = React.useRef<Selection | undefined>(undefined);
  const range = React.useRef<Range | undefined>(undefined);
  const [showListForMentions, setShowListForMentions] = useState(false);
  const mentionsTextFormatterInstanceRef =
    useRef<CometChatMentionsFormatter>(
      ChatConfigurator.getDataSource().getMentionsTextFormatter({})
    );
  const [mentionsSearchCount, setMentionsSearchCount] = useState(0);

  const [userMemberListType, setUserMemberListType] = useState<
    UserMemberListType | undefined
  >();
  const [usersRequestBuilder, setUsersRequestBuilder] = useState<
    CometChat.UsersRequestBuilder | undefined
  >(undefined);
  const [groupMembersRequestBuilder, setGroupMembersRequestBuilder] = useState<
    CometChat.GroupMembersRequestBuilder | undefined
  >(undefined);
  const userMemberWrapperRef = useRef<any>(null);
  const currentSelectionForRegex = useRef<Selection | null>(null);
  const currentSelectionForRegexRange = useRef<Range | null>(null);

  const mentionsFormatterInstanceId = "composer_" + Date.now();
  const disableSoundForMessagePropRef = useRefSync(disableSoundForMessage);
  const customSoundForMessagePropRef = useRefSync(customSoundForMessage);
  /**
 * Manages playing audio
 */
  const playAudioIfSoundNotDisabled = useCallback((): void => {
    const disableSoundForMessage = disableSoundForMessagePropRef.current;
    if (!disableSoundForMessage) {
      CometChatSoundManager.play(
        CometChatSoundManager.Sound.outgoingMessage!,
        customSoundForMessagePropRef.current
      );
    }
  }, [customSoundForMessagePropRef, disableSoundForMessagePropRef]);

  /**
   * Called when clicking a user from the mentions list.
   * Add the user to mentions text formatter instance and then call rerender to style the mention
   * within message input.
   *
   * @param {CometChat.User} user
   */

  const defaultMentionsItemClickHandler = (
    user: CometChat.User | CometChat.GroupMember
  ) => {
    try {
      let cometChatUsers = [user];
      mentionsTextFormatterInstanceRef.current.setCometChatUserGroupMembers(
        cometChatUsers
      );
      reRenderMentions()
      setShowListForMentions(false);
      setMentionsSearchCount(1);
      setMentionsSearchTerm("");
    } catch (error) {
      errorHandler(error, "defaultMentionsItemClickHandler")
    }
  };
  /**
   * Callback to handle resetting mentions search term when there is no valid mention found.
   * Updates the last empty search term, hides the mentions list, and resets the search term state.
   */
  const defaultOnEmptyForMentions = useCallback(() => {
    lastEmptySearchTerm.current = mentionsSearchTermTemp.current;
    setShowListForMentions(false);
    setMentionsSearchTerm("");
    mentionsSearchTermTemp.current = "";
  }, [setShowListForMentions, setMentionsSearchTerm]);
  useEffect(() => {
    try {
      var activePopoverSub = CometChatUIEvents.ccActivePopover.subscribe((id: string) => {
        if (state.contentToDisplay != id) {
          dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          aiBtnRef.current?.closePopover();
          attachmentsBtnRef.current?.closePopover();
          emojiBtnRef.current?.closePopover();
          voiceRecordingBtnRef.current?.closePopover();
        }
      })
      return () => {
        activePopoverSub.unsubscribe();
      };
    } catch (error) {
      errorHandler(error, "ccActivePopover")

    }
  }, [state.contentToDisplay])

  /**
 * Callback to search mentions based on the search term input by the user.
 * - If no valid search term is provided, resets the search term, hides the mentions list,
 *   and sets a default mentions search count.
 * - Otherwise, updates the search term, displays the mentions list, and increments the search count.
 * 
 * @param searchTerm The term to search for mentions, usually following an "@" symbol.
 */
  const searchMentions = useCallback(
    (searchTerm: any) => {
      try {
        if (!searchTerm || !searchTerm.length) {
          setMentionsSearchTerm("");
          mentionsSearchTermTemp.current = "";
          setShowListForMentions(false);
          setMentionsSearchCount(1);
          return;
        }
        let currentSearchTerm = searchTerm.split("@")[1].toLowerCase()
          ? searchTerm.split("@")[1].toLowerCase()
          : undefined;

        if (
          (!currentSearchTerm ||
            !(
              lastEmptySearchTerm.current &&
              currentSearchTerm.startsWith(
                lastEmptySearchTerm.current.toLowerCase()
              )
            )) &&
          currentSearchTerm !== mentionsSearchTerm
        ) {
          setMentionsSearchTerm(currentSearchTerm);
          mentionsSearchTermTemp.current = currentSearchTerm;
          setShowListForMentions(true);
          lastEmptySearchTerm.current = "";
          setMentionsSearchCount(mentionsSearchCount + 1);
        }
      } catch (error) {
        errorHandler(error, "searchMentions")
      }
    },
    [setMentionsSearchTerm, setShowListForMentions, setMentionsSearchCount]
  );
  /**
   * Callback to re-render mentions and apply text formatting inside the message composer input field.
   * - It ensures the correct caret position and range for mentions, retrieves formatted text,
   *   and dispatches the input changes for further processing.
   */
  const reRenderMentions = useCallback(() => {
    try {
      const contentEditable: any = getCurrentInput();
      if (textFormatterArray && textFormatterArray.length) {
        for (let i = 0; i < textFormatterArray.length; i++) {
          if (contentEditable) {
            textFormatterArray[i].setInputElementReference(contentEditable);
          }
        }
      }

      if (
        currentSelectionForRegex &&
        textFormatterArray &&
        textFormatterArray.length
      ) {
        if (textFormatterArray && textFormatterArray.length) {
          for (let i = 0; i < textFormatterArray.length; i++) {
            textFormatterArray[i].setCaretPositionAndRange(
              currentSelectionForRegex.current!,
              currentSelectionForRegexRange.current!
            );
            textFormatterArray[i].getFormattedText(
              null,
              { mentionsTargetElement: MentionsTargetElement.textinput }

            );
          }
        }

        let textToDispatch = contentEditable?.innerHTML?.trim() == "<br>" ? undefined : contentEditable?.innerHTML;
        if (contentEditable?.innerHTML?.trim() == "<br>") {
          contentEditable.innerHTML = "";
        }
        if (textToDispatch) {
          if (textFormatterArray && textFormatterArray.length) {
            for (let i = 0; i < textFormatterArray.length; i++) {
              textToDispatch =
                textFormatterArray[i].getOriginalText(textToDispatch);
            }
          }
        }
        onTextInputChange(undefined, textToDispatch)
      }
    } catch (error) {
      errorHandler(error, "reRenderMentions")
    }
  }, [textFormatterArray])

  /**
   * Creates receiver details object
   *
   * @throws `Error`
   * Thrown if `user` or 'group' both props are missing
   */
  const getReceiverDetails = useCallback((): {
    receiverId: string;
    receiverType: string;
    isBlocked?: boolean;
  } => {
    try {
      const user = userPropRef.current;
      const group = groupPropRef.current;
      if (user) {
        const isBlocked = user.getBlockedByMe() || user.getHasBlockedMe();
        return {
          receiverId: user?.getUid(),
          receiverType: CometChatUIKitConstants.MessageReceiverType.user,
          isBlocked: isBlocked
        };
      }
      if (group) {
        return {
          receiverId: group?.getGuid(),
          receiverType: CometChatUIKitConstants.MessageReceiverType.group,
        };
      }
      throw new Error(USER_GROUP_NOT_PROVIDED_ERROR_STR);
    } catch (error) {
      errorHandler(error, "getReceiverDetails")
      throw new Error(USER_GROUP_NOT_PROVIDED_ERROR_STR);


    }
  }, [groupPropRef, userPropRef]);

  /**
   * Creates a `CometChat.TypingIndicator` instance
   */
  const getTypingNotification = useCallback((): CometChat.TypingIndicator | undefined => {
    try {
      const { receiverId, receiverType, isBlocked } = getReceiverDetails();
      if (isBlocked) {
        return undefined;
      }
      return new CometChat.TypingIndicator(receiverId, receiverType);
    } catch (error) {
      errorHandler(error, "getTypingNotification")
    }
  }, [getReceiverDetails]);

  /**
   * Calls `startTyping` SDK function after creating a `CometChat.TypingIndicator` instance
   */
  const startTyping = useCallback((): void => {
    try {
      const typingNotification = getTypingNotification();
      if (!typingNotification) {
        return;
      }
      CometChat.startTyping(typingNotification);
    } catch (error) {
      errorHandler(error, "startTyping");
    }
  }, [getTypingNotification, errorHandler]);

  /**
   * Calls `endTyping` SDK function after creating a `CometChat.TypingIndicator` instance
   */
  const endTyping = useCallback((): void => {
    try {
      CometChat.endTyping(getTypingNotification());
      endTypingTimeoutId.current = null;
    } catch (error) {
      errorHandler(error, "endTyping");
    }
  }, [getTypingNotification, errorHandler]);

  /**
   * Handles emitting typing events
   */
  const handleTyping = useCallback((): void => {
    try {
      if (disableTypingEvents) {
        return;
      }
      if (endTypingTimeoutId.current !== null) {
        window.clearTimeout(endTypingTimeoutId.current);
        endTypingTimeoutId.current = null;
      } else {
        startTyping();
      }
      endTypingTimeoutId.current = window.setTimeout(
        () => endTyping(),
        END_TYPING_AFTER_START_IN_MS
      );
    } catch (error) {
      errorHandler(error, "handleTyping")
    }
  }, [startTyping, endTyping, disableTypingEvents]);

  /**
   * Creates a composerId object
   */
  function getComposerId(): ComposerId {
    try {
      const user = userPropRef.current;
      if (user) {
        return { user: user.getUid(), group: null, parentMessageId };
      }

      const group = groupPropRef.current;
      if (group) {
        return { user: null, group: group.getGuid(), parentMessageId };
      }

      return { user: null, group: null, parentMessageId };
    } catch (error) {
      errorHandler(error, "getComposerId");
      return { user: null, group: null, parentMessageId: null };
    }
  }

  /**
   * Sets the `setAddToMsgInputText` state
   *
   * @remarks
   * Setting `addToMsgInputText` is a two-step process.
   * This is a workaround for an issue faced when setting the cometchat-message-input's text state
   */
  const mySetAddToMsgInputText = useCallback(
    function (text: string): void {
      try {
        flushSync(() => {
          dispatch({ type: "setAddToMsgInputText", addToMsgInputText: "" });
        });
        dispatch({ type: "setAddToMsgInputText", addToMsgInputText: text });


        setTimeout(() => {
          dispatch({ type: "setAddToMsgInputText", addToMsgInputText: "" });
        }, 0)
      } catch (error) {
        errorHandler(error, "setAddToMsgInputText")
      }
    },
    [dispatch]
  );

  /**
   * Handles SDK errors
   */
  const handleSDKError = useCallback(
    (
      error: unknown,
      message: CometChat.TextMessage | CometChat.MediaMessage,
      wasEditMethodCall: boolean
    ): void => {
      try {
        message.setMetadata({ error });
        if (wasEditMethodCall) {
          CometChatMessageEvents.ccMessageEdited.next({
            message,
            status: MessageStatus.error,
          });

        } else {
          CometChatMessageEvents.ccMessageSent.next({
            message: message,
            status: MessageStatus.error,
          });

        }
      } catch (error) {
        errorHandler(error, "handleSDKError")
      }
    },
    []
  );



  /**
   * Creates a `CometChat.TextMessage` instance
   */
  const getTextMessage = useCallback(
    (text: string) => {
      try {
        const { receiverId, receiverType } = getReceiverDetails();
        const textMessage = new CometChat.TextMessage(
          receiverId,
          text,
          receiverType
        );
        textMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
        textMessage.setMuid(CometChatUIKitUtility.ID());
        const parentMessageId = parentMessageIdPropRef.current;
        if (parentMessageId !== null) {
          textMessage.setParentMessageId(parentMessageId);
        }
        return textMessage;
      } catch (error) {
        errorHandler(error, "getTextMessage");
        throw error;
      }
    },
    [getReceiverDetails, parentMessageIdPropRef]
  );

  /**
   * Calls `sendMessage` SDK function
   */
  const sendTextMessage = useCallback(
    async <T extends CometChat.TextMessage>(
      textMessage: T
    ): Promise<T | undefined> => {
      try {
        for (let i = 0; i < textFormatterArray.length; i++) {
          textMessage = textFormatterArray[i].formatMessageForSending(
            textMessage
          ) as T;
        }
        const sentTextMessage = await CometChat.sendMessage(textMessage);
        mentionsTextFormatterInstanceRef.current.resetCometChatUserGroupMembers();
        mentionsTextFormatterInstanceRef.current.reset();
        return sentTextMessage as T;
      } catch (error) {
        errorHandler(error, "sendTextMessage")
        handleSDKError(error, textMessage, false);
      }
    },
    [handleSDKError]
  );

  /**
   * Handles sending text message
   */
  const handleTextMessageSend = useCallback(
    async (text: string): Promise<void> => {
      try {
        const textMessage = getTextMessage(text);
        let mentionedUsers =
          mentionsTextFormatterInstanceRef.current.getCometChatUserGroupMembers();
        if (mentionedUsers) {
          let userObj = [];
          for (let i = 0; i < mentionedUsers.length; i++) {
            userObj.push(
              new CometChat.User({
                uid: mentionedUsers[i].getUid(),
                name: mentionedUsers[i].getName(),
              })
            );
          }
          textMessage.setMentionedUsers(userObj);
          mentionedUsers = [];
        }
        CometChatMessageEvents.ccMessageSent.next({
          message: textMessage,
          status: MessageStatus.inprogress,
        });


        const sentTextMessage = await sendTextMessage(textMessage);
        if (sentTextMessage) {
          CometChatMessageEvents.ccMessageSent.next({
            message: sentTextMessage,
            status: MessageStatus.success,
          });
          playAudioIfSoundNotDisabled();
        }
      } catch (error) {
        errorHandler(error, "handleTextMessageSend");
      }
    },
    [getTextMessage, sendTextMessage, errorHandler, playAudioIfSoundNotDisabled]
  );

  /**
   * Creates a `CometChat.TextMessage` instance with the `id` of the instance set to `textMessageId`
   */
  const getEditedTextMessage = useCallback(
    (newText: string, textMessageId: number) => {
      try {
        const { receiverId, receiverType } = getReceiverDetails();
        const newTextMessage = new CometChat.TextMessage(
          receiverId,
          newText,
          receiverType
        );
        newTextMessage.setId(textMessageId);
        return newTextMessage;
      } catch (error) {
        errorHandler(error, "getEditedTextMessage");
        throw error;
      }
    },
    [getReceiverDetails]
  );

  /**
   * Calls `editMessage` SDK function
   */
  const sendEditedTextMessage = useCallback(
    async <T extends CometChat.TextMessage>(
      editedTextMessage: T
    ): Promise<T | undefined> => {
      try {
        for (let i = 0; i < textFormatterArray.length; i++) {
          editedTextMessage = textFormatterArray[i].formatMessageForSending(
            editedTextMessage
          ) as T;
        }
        const editedMessage = await CometChat.editMessage(editedTextMessage);
        mentionsTextFormatterInstanceRef.current.resetCometChatUserGroupMembers();
        return editedMessage as T;
      } catch (error) {
        errorHandler(error, "sendEditedTextMessage")
        handleSDKError(error, editedTextMessage, true);
      }
    },
    [handleSDKError]
  );

  /**
   * Handles sending edited messages
   */
  const handleEditTextMessageSend = useCallback(
    async (
      newText: string,
      textMessage: CometChat.TextMessage
    ): Promise<void> => {
      try {
        if (onSendButtonClickPropRef.current) {
          onSendButtonClickPropRef.current(getEditedTextMessage(newText, textMessage.getId()), PreviewMessageMode.edit)
          mySetAddToMsgInputText("");
        }
        else {
          const editedMessage = await sendEditedTextMessage(
            getEditedTextMessage(newText, textMessage.getId())
          );
          mySetAddToMsgInputText("");
          if (editedMessage) {

            CometChatMessageEvents.ccMessageEdited.next({
              message: editedMessage,
              status: MessageStatus.success,
            });
          }
        }
      } catch (error) {
        errorHandler(error, "handleEditTextMessageSend");
      }
    },
    [sendEditedTextMessage, getEditedTextMessage, errorHandler]
  );

  /**
   * Handles sending a new text message or an edited message
   *
   * @remarks
   * The function closes the emojiKeyboard if it is visible before sending or editing a message
   */
  const handleSendButtonClick = useCallback(
    async (textToDispatch: string): Promise<void> => {
      try {

        let text = textToDispatch;
        if (textFormatterArray && textFormatterArray.length) {
          for (let i = 0; i < textFormatterArray.length; i++) {
            text =
              textFormatterArray[i].getOriginalText(textToDispatch);
          }
        }
        if (
          (text = text.trim()).length === 0 ||
          (state.textMessageToEdit !== null &&
            state.textMessageToEdit.getText() === text)
        ) {
          return;
        }
        if (state.contentToDisplay === "emojiKeyboard") {
          dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
        }
        if (state.contentToDisplay === "voiceRecording") {
          dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
        }
        dispatch({ type: "setText", text: "" });
        emptyInputField()
        let onSendButtonClick:
          | ((message: CometChat.BaseMessage, previewMessageMode?: PreviewMessageMode) => void)
          | undefined;
        if (state.textMessageToEdit !== null) {
          dispatch({ type: "setTextMessageToEdit", textMessageToEdit: null });
          await handleEditTextMessageSend(text, state.textMessageToEdit);
        } else if ((onSendButtonClick = onSendButtonClickPropRef.current)) {
          await Promise.all([onSendButtonClick(getTextMessage(text), PreviewMessageMode.none)]);

        } else {
          await handleTextMessageSend(text);
        }
      } catch (error) {
        errorHandler(error, "handleSendButtonClick");
      }
    },
    [
      state.textMessageToEdit,
      state.contentToDisplay,
      dispatch,
      handleEditTextMessageSend,
      handleTextMessageSend,
      errorHandler,
      getTextMessage,
      onSendButtonClickPropRef,
      userPropRef,
      textFormatterArray]
  );

  /**
   * Creates a `CometChat.MediaMessage` instance
   */
  const getMediaMessage = useCallback(
    async (
      file: File,
      fileType: MediaMessageFileType
    ): Promise<CometChat.MediaMessage> => {
      try {

        const processedFile = fileType == CometChatUIKitConstants.MessageTypes.audio ? await processFileForAudio(file) : await processFile(file);
        processedFile.type.replace("webm", "wav")
        const { receiverId, receiverType } = getReceiverDetails();
        const mediaMessage = new CometChat.MediaMessage(
          receiverId,
          processedFile,
          fileType,
          receiverType
        );
        mediaMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
        mediaMessage.setMuid(CometChatUIKitUtility.ID());
        mediaMessage.setMetadata({ file: processedFile });
        const parentMessageId = parentMessageIdPropRef.current;
        if (parentMessageId !== null) {
          mediaMessage.setParentMessageId(parentMessageId);
        }
        return mediaMessage;
      } catch (error) {
        errorHandler(error, "getMediaMessage");
        throw error;
      }
    },
    [getReceiverDetails, parentMessageIdPropRef]
  );

  /**
   * Calls `sendMediaMessage` SDK function
   */
  const sendMediaMessage = useCallback(
    async <T extends CometChat.MediaMessage>(
      mediaMessage: T
    ): Promise<T | undefined> => {
      try {
        const sentMediaMessage = await CometChat.sendMediaMessage(mediaMessage);
        return sentMediaMessage as T;
      } catch (error) {
        handleSDKError(error, mediaMessage, false);
        errorHandler(error, "sendMediaMessage");

      }
    },
    [handleSDKError]
  );

  /**
   * Handles sending media message
   */
  const handleMediaMessageSend = useCallback(
    async (file: File, fileType: MediaMessageFileType): Promise<void> => {
      try {
        const mediaMessage = await getMediaMessage(file, fileType);
        CometChatMessageEvents.ccMessageSent.next({
          message: mediaMessage,
          status: MessageStatus.inprogress,
        });

        const sentMediaMessage = await sendMediaMessage(mediaMessage);
        if (sentMediaMessage) {
          CometChatMessageEvents.ccMessageSent.next({
            message: sentMediaMessage,
            status: MessageStatus.success,
          });
          playAudioIfSoundNotDisabled();

        }
      } catch (error) {
        errorHandler(error, "handleMediaMessageSend");
      }
    },
    [playAudioIfSoundNotDisabled,
      getMediaMessage,
      sendMediaMessage,
      errorHandler,
    ]
  );

  /**
   * Handles sending recorded voice message
   */
  const handleSendVoiceMessage = useCallback(
    async (blob: Blob): Promise<void> => {
      dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
      voiceRecordingBtnRef.current?.closePopover()
      try {
        const audioFile = new File(
          [blob],
          `${audioRecordingSimpleDateFormat()}.wav`,
          { type: blob.type }
        );
        handleMediaMessageSend(
          audioFile,
          CometChatUIKitConstants.MessageTypes.audio
        );
      } catch (error) {
        errorHandler(error, "handleSendVoiceMessage");
      }
    },
    [handleMediaMessageSend, errorHandler]
  );

  /**
   * @returns A string in the format `audio-recording-yyyyMMddHHmmss`
   */
  function audioRecordingSimpleDateFormat() {
    try {
      const now = new Date();
      const string = "audio-recording-yyyyMMddHHmmss";
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const date = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      return string
        .replace("yyyyMMdd", `${year}${month}${date}`)
        .replace("HHmmss", `${hours}${minutes}${seconds}`);
    } catch (error) {
      errorHandler(error, "audioRecordingSimpleDateFormat")
    }
  }

  /**
   * Wrapper around `handleMediaMessageSend`
   */
  const handleMediaMessageSendWrapper = useCallback(async (): Promise<void> => {
    try {
      const mediaFilePickerElement = mediaFilePickerRef.current;
      if (
        !mediaFilePickerElement?.files?.length ||
        userPropRef.current?.getBlockedByMe()
      ) {
        return;
      }

      const file = mediaFilePickerElement.files[0];
      const expectedFileType = mediaFilePickerElement.accept.slice(0, -2);
      const actualFileType = expectedFileType === "file" ? "file" : file.type.split('/')[0];
      if (expectedFileType !== "file" && expectedFileType !== actualFileType) {
        dispatch({ type: "setShowValidationError", showValidationError: true });
        return;
      }

      const onSendButtonClick = onSendButtonClickPropRef.current;
      if (onSendButtonClick) {
        try {
          await Promise.all([
            onSendButtonClick(await getMediaMessage(file, actualFileType), PreviewMessageMode.none),
          ]);
        } catch (error) {
          errorHandler(error, "onSendButtonClick");
        }
      } else {
        await handleMediaMessageSend(file, actualFileType);
      }

      mediaFilePickerElement.value = "";
    } catch (error) {
      errorHandler(error, "handleMediaMessageSendWrapper")

    }
  }, [
    handleMediaMessageSend,
    errorHandler,
    getMediaMessage,
    onSendButtonClickPropRef,
    userPropRef,
  ]);


  /**
   * @returns Should the component show the send button view
   */
  function shouldShowSendButton(): boolean {
    return (
      state.text.trim() === "" ||
      (state.textMessageToEdit !== null &&
        state.textMessageToEdit.getText() === state.text)
    );
  }
  /**
   * Function to render the send button.
   * - If `sendButtonView` is provided, it uses the custom send button view.
   * - Otherwise, it displays a default send button.
   * 
   * @returns JSX.Element The send button element.
   */
  function getSendButton(): JSX.Element {
    if (sendButtonView) {
      return <div onClick={onSendclick}>
        {sendButtonView}
      </div>
    }
    return (
      <div
        className={`cometchat-message-composer__send-button ${shouldShowSendButton() ? "" : "cometchat-message-composer__send-button-active"}`}
      >
        <CometChatButton
          onClick={onSendclick}
          iconURL={SendIconFill}
          hoverText={"Send Message"}
        />
      </div>
    );

  }
  /**
 * Function to handle the auxiliary button click event (likely emoji keyboard).
 * - Depending on the current `state.contentToDisplay`, it changes the view to emoji keyboard or hides it.
 */
  function onEmojiButtonClick() {
    try {

      switch (state.contentToDisplay) {
        case "attachments":
          attachmentsBtnRef.current?.closePopover()
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "emojiKeyboard",
          });
          break;
        case "voiceRecording":
          voiceRecordingBtnRef.current?.closePopover()

          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "emojiKeyboard",
          });
          break;
        case "emojiKeyboard":
          dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          break;
        case "ai":
          aiBtnRef.current?.closePopover()

          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "emojiKeyboard",
          });
          break;
        case "none":
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "emojiKeyboard",
          });
          break;
        default: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const x: never = state.contentToDisplay;
        }
      }
      setActivePopover(state.contentToDisplay)
    } catch (error) {
      errorHandler(error, "onEmojiButtonClick")
    }

  }
  /**
 * Function to handle voice recording button click event.
 * - Depending on the current `state.contentToDisplay`, it switches between voice recording and other modes.
 */
  function onVoiceRecordingBtnClick() {
    try {
      switch (state.contentToDisplay) {
        case "attachments":
          attachmentsBtnRef.current?.closePopover()
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "voiceRecording",
          });
          break;
        case "emojiKeyboard":
          emojiBtnRef.current?.closePopover()
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "voiceRecording",
          });
          break;
        case "voiceRecording":
          dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          break;
        case "ai":
          aiBtnRef.current?.closePopover()
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "voiceRecording",
          });
          break;
        case "none":
          dispatch({
            type: "setContentToDisplay",
            contentToDisplay: "voiceRecording",
          });
          break;
        default: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const x: never = state.contentToDisplay;
        }
      }
      setActivePopover(state.contentToDisplay)

    } catch (error) {
      errorHandler(error, "onVoiceRecordingBtnClick")
    }
  }
  /**
 * Function to handle the text input change event.
 * - Dispatches the new text value.
 * - Updates the typing status and executes the `onTextChange` callback if available.
 * 
 * @param e Event object from the input.
 * @param text Optional text to set instead of using the event target's innerText.
 */
  function onTextInputChange(e: any, text?: string) {
    try {
      const newText = text ?? e.target.innerText;
      if (typeof newText === "string") {
        handleTyping();
        dispatch({ type: "setText", text: newText });
        mySetAddToMsgInputText("")
        if (onTextChange !== undefined) onTextChange(newText);
      }
    } catch (error) {
      errorHandler(error, "onTextInputChange")
    }
  }
  /**
 * Callback for handling the Enter key press in the text input.
 * - Sends the message when Enter is pressed.
 * - Clears the mentions list and resets the text in the message composer.
 * 
 * @param text The current input text when Enter is pressed.
 */
  const onTextInputEnter = useCallback(
    (text: string) => {
      setShowListForMentions(false);

      if (typeof text === "string") handleSendButtonClick(text);
      // Empty the text in the message composer
      dispatch({ type: "setText", text: "" });

      mySetAddToMsgInputText("");
    }, [state.textMessageToEdit, setShowListForMentions]
  )
  /**
 * Callback to handle the send button click event.
 * - Triggers the send message action using the current text from the state.
 */
  const onSendclick = useCallback(() => {
    try {
      var contenteditable = getCurrentInput();
      let text = "";
      if (contenteditable?.innerHTML) {
        text = contenteditable.innerHTML.replace(/(<br>\s*)+$/, '');
      }
      handleSendButtonClick(text);
    } catch (error) {
      errorHandler(error, "onSendclick")
    }
  }, [state.text, handleSendButtonClick])

  /**
 * Function to handle emoji click events.
 * - Adds the clicked emoji to the message input.
 * 
 * @param input Object containing the clicked emoji.
 */
  const onEmojiClicked = (emoji: string) => {
    try {
      dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
      emojiBtnRef.current?.closePopover()
      if (typeof emoji === "string") pasteHtmlAtCaret(emoji);
      dispatch({ type: "setText", text: emoji });
    } catch (error) {
      errorHandler(error, "onEmojiClicked")
    }

  }
  function shouldShowAttachmentButton() {
    return hideAttachmentButton || (hideAudioAttachmentOption && hideVideoAttachmentOption && hideFileAttachmentOption && hideImageAttachmentOption && hidePollsOption && hideCollaborativeDocumentOption && hideCollaborativeWhiteboardOption) || (attachmentOptions && attachmentOptions?.length == 0);
  }

  /**
   * Creates the action sheet view for attachments and other actions.
   * - This function builds a button that, when clicked, opens a popover with available actions.
   * 
   * @returns JSX.Element The action sheet view component.
   */
  function getActionsheetView() {
    try {
      const defaultSecondaryBtn = (
        <CometChatButton
          hoverText={"Attach"}
          onClick={onSecondaryBtnClick}
          iconURL={
            state.contentToDisplay === "attachments"
              ? PlusIconFill
              : PlusIcon
          }
        />
      );
      // Use default secondary content
      let actions: CometChatMessageComposerAction[];
      if (attachmentOptions && attachmentOptions.length == 0) {
        return;
      }
      if (
        attachmentOptions &&
        (user !== undefined || group !== undefined)
      ) {
        actions = attachmentOptions;
      } else {
        actions = ChatConfigurator.getDataSource().getAttachmentOptions(
          getComposerId(),
          { hideAudioAttachmentOption, hideCollaborativeDocumentOption, hideCollaborativeWhiteboardOption, hideFileAttachmentOption, hideImageAttachmentOption, hideVideoAttachmentOption, hidePollsOption }
        );
      }
      for (let i = 0; i < actions.length; i++) {
        const curAction = actions[i];
        const { id } = curAction;
        if (typeof id === "string") {
          let overrideOnClick = curAction.onClick;
          if (id === "extension_poll") {
            overrideOnClick = () => {
              (curAction as any).onClick([user, group])

            };
          }
          actionIdToActionOnClick.current.set(
            id,
            overrideOnClick ? overrideOnClick : null
          );
        }
      }
      const defaultSecondaryContent = (
        <CometChatActionSheet
          actions={actions}
          onActionItemClick={(action: CometChatMessageComposerAction | CometChatActionsView) => {
            showAttachments(action);

          }}
        />
      );
      return (
        <div

          className={`cometchat-message-composer__secondary-button-view-attachment-button ${state.contentToDisplay === "attachments" ? "cometchat-message-composer__secondary-button-view-attachment-button-active" : ""} cometchat-message-composer__secondary-button-view-attachment-button-${actions?.length}`}
        >  <CometChatPopover
          onOutsideClick={() => {
            dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          }}
          placement={Placement.top}
          closeOnOutsideClick={true}
          ref={attachmentsBtnRef}
          content={
            defaultSecondaryContent
          }
        >
            {defaultSecondaryBtn}

          </CometChatPopover>

        </div>

      );
    } catch (error) {
      errorHandler(error, "getActionsheetView")
    }
  }

  /**
 * Renders the default buttons in the message composer.
 * - This function lays out the buttons in a flex container.
 * 
 * @returns JSX.Element The default buttons container.
 */
  function getDefaultButtons() {
    try {
      const stickerButton = ChatConfigurator.getDataSource().getStickerButton(
        getComposerId() as unknown as ComposerId,
        user,
        group
      );

      return (
        <div className="cometchat-message-composer__default-buttons">
          {hideVoiceRecordingButton ? null : getVoiceRecordingView()}
          {hideEmojiKeyboardButton || isMobileDevice() ? null : getEmojiKeyboardView()}
          {hideStickersButton ? null : stickerButton}
        </div>
      );
    } catch (error) {
      errorHandler(error, "getDefaultButtons");
    }
  }
  /**
 * Handles the secondary button click event.
 * - This function toggles the visibility of the attachment options based on the current content display state.
 */
  const onSecondaryBtnClick = useCallback(
    () => {
      try {
        switch (state.contentToDisplay) {
          case "attachments":
            dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
            break;
          case "emojiKeyboard":
            emojiBtnRef.current?.closePopover()
            dispatch({
              type: "setContentToDisplay",
              contentToDisplay: "attachments",
            });
            break;
          case "voiceRecording":
            voiceRecordingBtnRef.current?.closePopover()
            dispatch({
              type: "setContentToDisplay",
              contentToDisplay: "attachments",
            });
            break;
          case "ai":
            aiBtnRef.current?.closePopover()
            dispatch({
              type: "setContentToDisplay",
              contentToDisplay: "attachments",
            });
            break;
          case "none":
            dispatch({
              type: "setContentToDisplay",
              contentToDisplay: "attachments",
            });
            break;
          default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const x: never = state.contentToDisplay;
          }
        }
        setActivePopover(state.contentToDisplay)

      } catch (error) {
        errorHandler(error, "onSecondaryBtnClick")
      }
    }, [state.contentToDisplay]
  )
  /**
 * Handles the close event for the preview.
 * - Resets the text message to edit and clears the text input field.
 */

  function onPreviewCloseClick() {
    dispatch({ type: "setTextMessageToEdit", textMessageToEdit: null });
    // Empty the text in the message composer
    dispatch({ type: "setText", text: "" });
    emptyInputField()
    mySetAddToMsgInputText("");
  }
  function setActivePopover(id: string) {
    CometChatUIEvents.ccActivePopover.next(id);

  }
  /**
 * Displays attachments based on the selected action.
 * - It dispatches the content display state to none and executes the corresponding action if it exists.
 * 
 * @param action The action item clicked to show attachments.
 */
  function showAttachments(action: CometChatActionsView | CometChatMessageComposerAction) {
    try {
      const actionOnClick = actionIdToActionOnClick.current.get(
        `${action.id}`
      );
      if (typeof actionOnClick === "function") {
        actionOnClick();
      } else {
        // Open the correct file picker
        mediaFilePickerRef.current!.accept = `${action.id}/*`;
        mediaFilePickerRef.current!.click();
      }
      dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
      attachmentsBtnRef.current?.closePopover()
    } catch (error) {
      errorHandler(error, "showAttachments")
    }
  }

  function getCurrentInput() {
    if (parentMessageIdPropRef.current) {
      return document.querySelector(".cometchat-message-composer__input-thread")
    }
    return document.querySelector(".cometchat-message-composer__input")
  }


  /**
    * Creates the header view for the message composer, displaying 
    * either the provided headerView or the text message edit preview.
    */
  function getHeaderView(): JSX.Element {
    if (state.showValidationError) {
      setTimeout(() => {
        dispatch({ type: "setShowValidationError", showValidationError: false });
      }, 5000);
    }

    let errorText = state.showMentionsCountWarning ? "You can mention up to 10 users at once." : "You selected a different type of file. Please choose the appropriate file.";
    return (
      <div
        className='cometchat-message-composer__header'
      >
        {state.showMentionsCountWarning || state.showValidationError ? (
          <div className='cometchat-message-composer__header-error-state'
          >
            <div className='cometchat-message-composer__header-error-state-icon-wrapper'>
              <div className='cometchat-message-composer__header-error-state-icon
         '></div>
            </div>
            <span className='cometchat-message-composer__header-error-state-text
         '>{errorText}</span>

          </div>
        ) : null}
        {headerView ?? getTextMessageEditPreview()}
      </div>
    );
  }

  /**
    * Creates the voice recording view, including the media recorder 
    * and a button to initiate voice recording. The button's appearance 
    * changes based on the current state of the composer.
    */
  function getVoiceRecordingView(): JSX.Element | null {
    const defaultSecondaryContent = (
      <CometChatMediaRecorder
        onSubmitRecording={handleSendVoiceMessage}
        autoRecording={true}
      />

    );

    const defaultSecondaryBtn = (
      <CometChatButton
        onClick={onVoiceRecordingBtnClick}
        hoverText="Voice Recording"
        iconURL={
          state.contentToDisplay === "voiceRecording"
            ? MicIconFill
            : MicIcon
        }
      />
    );

    return (
      <div className={`cometchat-message-composer__voice-recording-button ${state.contentToDisplay === "voiceRecording" ? "cometchat-message-composer__voice-recording-button-active" : ""}`}>
        <CometChatPopover
          ref={voiceRecordingBtnRef}
          onOutsideClick={() => {
            dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          }}
          placement={Placement.top}
          closeOnOutsideClick={true}
          content={state.contentToDisplay === "voiceRecording"
            ? defaultSecondaryContent
            : null}
        >
          {defaultSecondaryBtn}

        </CometChatPopover>
      </div>
    );
  }

  /**
   * Creates the auxiliary view that may include additional 
   * functionalities or buttons specific to the message composer. 
   * It integrates AI options and any auxiliary buttons provided.
   */
  function getAuxiliaryView(): JSX.Element | undefined {



    return auxiliaryButtonView ? <div
      className="cometchat-message-composer__auxilary-button-view"
    >
      {auxiliaryButtonView}
    </div> : undefined;





  }
  /**
  * Creates the emoji keyboard view, displaying a button to toggle 
  * the emoji keyboard and the keyboard itself when activated. 
  * The button's appearance reflects the current display state.
  */
  function getEmojiKeyboardView() {
    // Use default auxiliary button
    const defaultAuxiliaryBtn = (
      <CometChatButton
        onClick={onEmojiButtonClick}
        hoverText="Emoji"
        iconURL={
          state.contentToDisplay === "emojiKeyboard"
            ? SmileysIconFill
            : SmileysIcon
        }
      />
    );
    // Use default auxiliary content
    const defaultAuxiliaryContent = (
      <CometChatEmojiKeyboard
        onEmojiClick={onEmojiClicked}
      />
    );
    return (
      <div
        className={`cometchat-message-composer__emoji-keyboard-button ${state.contentToDisplay === "emojiKeyboard" ? "cometchat-message-composer__emoji-keyboard-button-active" : ""}`}
      >
        <CometChatPopover
          ref={emojiBtnRef}
          closeOnOutsideClick={true}
          onOutsideClick={() => {
            dispatch({ type: "setContentToDisplay", contentToDisplay: "none" });
          }}
          placement={Placement.top}
          content={defaultAuxiliaryContent}
        >
          {defaultAuxiliaryBtn}

        </CometChatPopover>
      </div>
    );
  }

  /**
    * Creates the preview view for text messages being edited, 
    * formatting mentions within the message and returning a preview 
    * component with the formatted text.
    */
  function getTextMessageEditPreview(): JSX.Element | null {
    const checkForMentions = (message: CometChat.TextMessage) => {
      const regex = /<@uid:(.*?)>/g;
      let messageText = message.getText();
      let messageTextTmp = messageText;
      let match = regex.exec(messageText);
      let cometChatUsersGroupMembers = [];
      let mentionedUsers = message.getMentionedUsers();
      while (match !== null) {
        let user;
        for (let i = 0; i < mentionedUsers.length; i++) {
          if (match[1] === mentionedUsers[i].getUid()) {
            user = mentionedUsers[i];
          }
        }
        if (user) {
          messageTextTmp = messageTextTmp.replace(
            match[0],
            "@" + user.getName()
          );
          cometChatUsersGroupMembers.push(user);
        }
        match = regex.exec(messageText);
      }
      mentionsTextFormatterInstanceRef.current.setCometChatUserGroupMembers(
        cometChatUsersGroupMembers
      );
      mentionsTextFormatterInstanceRef.current.setLoggedInUser(
        CometChatUIKitLoginListener.getLoggedInUser()!
      );
      return messageTextTmp;
    };

    if (state.textMessageToEdit === null) {
      return null;
    }
    const messageToBeEdited = state.textMessageToEdit;
    return (
      <CometChatEditPreview
        onClose={onPreviewCloseClick}
        previewSubtitle={checkForMentions(messageToBeEdited)}
      />

    );
  }

  /**
   * Creates the file picker component for selecting media files to send. 
   * The input element is hidden and triggers the media message 
   * send handler when a file is selected.
   */
  function getMediaFilePicker(): JSX.Element {
    // Purposely not given classname
    return (
      <input
        style={{
          display: "none"
        }}
        ref={mediaFilePickerRef}
        type='file'
        onChange={handleMediaMessageSendWrapper}
      />
    );
  }
  /**
 * Handles mouse down events to hide the mentions list 
 * when the click occurs outside of the user member wrapper.
 */
  const handleMouseDown = useCallback(
    (event: { target: any }) => {
      if (
        userMemberWrapperRef.current &&
        !userMemberWrapperRef.current.contains(event.target)
      ) {
        setShowListForMentions(false);
      }
    }, [showListForMentions]
  );
  /**
 * Function to update selection when the focus changes from composer.
 * @returns void
 */
  const updateSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0);
      const inputElement = getCurrentInput();
      if (inputElement && inputElement.contains(currentRange.startContainer)) {
        sel.current = selection;
        range.current = currentRange.cloneRange();
      }
    }
  }, [textInputRef]);

  /**
  * Handles key down events for the message composer input, 
  * capturing the Enter key to dispatch the text message, 
  * and applying any relevant text formatting before sending.
  */
  const onKeyDown = useCallback(
    (event: any) => {
      var contenteditable = getCurrentInput();
      if (event.keyCode === 13 && !event.shiftKey) {
        if (enterKeyBehavior == EnterKeyBehavior.NewLine) {
          return;
        }
        event.preventDefault();
        if (enterKeyBehavior == EnterKeyBehavior.None) {
          return;
        }
        if (contenteditable?.textContent?.trim()) {
          let textToDispatch = contenteditable?.innerHTML?.trim() == "<br>" ? undefined : contenteditable?.innerHTML.replace(/(<br>\s*)+$/, '');
          if (contenteditable?.innerHTML?.trim() == "<br>") {
            contenteditable.innerHTML = "";
          }
          if (textFormatterArray && textFormatterArray.length) {
            for (let i = 0; i < textFormatterArray.length; i++) {
              textToDispatch =
                textFormatterArray[i].getOriginalText(textToDispatch);
            }
          }
          onTextInputEnter(textToDispatch!)
        }
        return;
      }
      if (textFormatterArray && textFormatterArray.length) {
        for (let i = 0; i < textFormatterArray.length; i++) {
          if (contenteditable) {
            textFormatterArray[i].setInputElementReference(contenteditable as HTMLElement);
          }
          textFormatterArray[i].setCaretPositionAndRange(
            currentSelectionForRegex.current!,
            currentSelectionForRegexRange.current!
          );
          textFormatterArray[i].onKeyDown(event);
        }
      }
    }, [textFormatterArray, user, group, state.textMessageToEdit]
  )

  /**
   * On Every KeyUp Event, pass the event to registered text formatters in order to track characters
   * and format the text in real time.
   */
  const onKeyUp = useCallback(
    (event: any) => {
      if (event.keyCode === 13 && !event.shiftKey || (event.keyCode === 13 && !event.shiftKey && enterKeyBehavior == EnterKeyBehavior.None)) {
        event.preventDefault();
        return;
      }
      if (isSafari()) {
        updateSelection()

      }
      const element = getCurrentInput() as HTMLElement;

      if (event.keyCode === 8) {
        if (element.innerHTML === '<br>') {
          emptyInputField();
        }
      }
      if (textFormatterArray && textFormatterArray.length) {
        for (let i = 0; i < textFormatterArray.length; i++) {
          if (element) {
            textFormatterArray[i].setInputElementReference(element);
          }
          textFormatterArray[i].setCaretPositionAndRange(
            currentSelectionForRegex.current!,
            currentSelectionForRegexRange.current!
          );
          textFormatterArray[i].onKeyUp(event);
        }
      }
    }, [textFormatterArray, user, group]
  );
  /**
  * Checks if the provided selection is a descendant of the 
  * message composer input element. Returns true if the selection 
  * is within the input, and false if it is not, including checks 
  * for specific node types.
  */
  function isDescendant(sel: Selection): boolean {
    if (sel.rangeCount > 0) {
      let range = sel.getRangeAt(0);
      let elm = getCurrentInput();
      let parentElm = range.commonAncestorContainer.parentNode;
      if (parentElm?.nodeName === "SPAN") {
        return false;
      }

      if (
        elm?.contains(range.startContainer) &&
        elm?.contains(range.endContainer)
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  /**
  * Empties the content of the message composer input field 
  * and sets focus back to it for immediate user input.
  */
  const emptyInputField = () => {
    try {
      let contentEditable: any = getCurrentInput();
      contentEditable.textContent = "";
      contentEditable?.focus();
    } catch (error) {
      errorHandler(error, "emptyInputField")
    }
  };
  /**
 * Sets the current selection and updates caret position and 
 * range for text formatting tools if the selection is a 
 * descendant of the message composer input.
 */
  function setSelection(selection: Selection | null) {
    try {
      if (selection && selection.rangeCount) {
        if (isDescendant(selection)) {
          sel.current = selection;
          range.current = sel.current.getRangeAt(0);
          currentSelectionForRegex.current = sel.current;
          if (sel.current.getRangeAt && sel.current.rangeCount) {
            range.current = sel.current.getRangeAt(0);
            currentSelectionForRegexRange.current = sel.current.getRangeAt(0);

            if (textFormatterArray && textFormatterArray.length) {
              for (let i = 0; i < textFormatterArray.length; i++) {
                textFormatterArray[i].setCaretPositionAndRange(
                  currentSelectionForRegex.current!,
                  currentSelectionForRegexRange.current!
                );
              }
              onKeyUp(new Event("mention_keyup_event"));
            }
          }
        }
      }
    } catch (error) {
      errorHandler(error, "setSelection");
    }
  }
  /**
 * Checks the availability of the 'plaintext-only' content 
 * editable option in the browser. Returns 'plaintext-only' if 
 * supported and not disabled; otherwise, returns false.
 */
  const checkPlainTextAvailability = (disabled?: boolean): any => {
    try {
      const temp = document.createElement('div');
      // Type cast to 'any' to bypass the type check
      temp.contentEditable = 'plaintext-only';
      const value = temp.contentEditable === 'plaintext-only';

      if (!disabled && value) {
        return 'plaintext-only';
      } else {
        return false;
      }
    } catch (error) {
      errorHandler(error, "checkPlainTextAvailability")
      return !disabled;
    }

  };
  /**
  * Inserts HTML content at the current caret position in the 
  * message composer input. It handles text formatting and updates 
  * the content based on any registered text formatter functions.
  * If selection is not valid, it handles pasting behavior accordingly.
  */
  const pasteHtmlAtCaret = useCallback(
    (html: string) => {
      try {
        if (sel.current && range.current) {
          range.current.deleteContents();
          let el = document.createElement("div");
          el.innerHTML = html;
          let frag = document.createDocumentFragment(),
            node,

            lastNode;
          while ((node = el.firstChild)) {
            if (node instanceof HTMLElement) {
              if (textFormatterArray && textFormatterArray.length) {
                for (let i = 0; i < textFormatterArray.length; i++) {
                  node = textFormatterArray[i].registerEventListeners(
                    node,
                    node.classList
                  );
                }
              }
              lastNode = frag.appendChild(el.removeChild(node));
            } else if (node instanceof Text) {
              lastNode = frag.appendChild(el.removeChild(node));
            }
          }
          range.current.insertNode(frag);
          if (lastNode) {
            range.current = range.current.cloneRange();
            range.current.setStartAfter(lastNode);
            range.current.collapse(true);
            sel.current.removeAllRanges();
            sel.current.addRange(range.current);
            const contentEditable = getCurrentInput();
            let textToDispatch = contentEditable?.innerHTML?.trim() == "<br>" ? undefined : contentEditable?.innerHTML;
            if (contentEditable?.innerHTML?.trim() == "<br>") {
              contentEditable.innerHTML = "";
            }
            if (textFormatterArray && textFormatterArray.length) {
              for (let i = 0; i < textFormatterArray.length; i++) {
                textToDispatch =
                  textFormatterArray[i].getOriginalText(textToDispatch);
              }
            }
            mySetAddToMsgInputText(textToDispatch!);

          }
        } else if (sel.current && sel.current.type != "Control") {
          (sel as any).current.createRange().pasteHTML(html);
        } else {
          const contentEditable: any = getCurrentInput();
          contentEditable.textContent = state.addToMsgInputText;
        }
      } catch (error) {
        errorHandler(error, "pasteHtmlAtCaret")
      }
    }, [state.addToMsgInputText, state.text]
  )
  /**
   * Creates the message input component, which includes a content 
   * editable div for user input and additional UI elements like 
   * buttons and views for sending messages, creating polls, etc.
   */
  function getTextInput(): JSX.Element {
    return (
      <>
        <div
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          contentEditable={checkPlainTextAvailability(false)}
          onMouseDown={handleMouseDown}
          onInput={onTextInputChange}
          className={`cometchat-message-composer__input ${parentMessageIdPropRef.current ? "cometchat-message-composer__input-thread" : ""} ${isMobileDevice() ? "cometchat-message-composer__input-mobile" : ""}`}
          data-placeholder={"Enter your message here"}
          ref={textInputRef}
        ></div>
        <div
          style={{
            display: "flex",
            padding: `${getThemeVariable('--cometchat-padding-2')} ${getThemeVariable('--cometchat-padding-2')}`,
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            gap: getThemeVariable('--cometchat-padding-4')
          }}
        >
          {shouldShowAttachmentButton() ? null : getActionsheetView()}
          {getDefaultButtons()}
          {getAuxiliaryView()}
          {hideSendButton ? null : getSendButton()}
        </div>
      </>

    );
  }
  /**
   * Returns a modal for creating a poll if the state indicates that 
   * the poll creation view should be shown. Returns null if the view 
   * is not currently active.
   */
  function getCreatePollModal(): JSX.Element | null {
    if (state.showPoll && createPollViewRef?.current) {
      return createPollViewRef.current;
    }

    return null;
  }

  // Hook to manage state and effects related to message composition, including
  // selection management, user interactions, text formatting, and mentions handling.
  useCometChatMessageComposer({
    currentSelectionForRegex,
    currentSelectionForRegexRange,
    setSelection,
    dispatch,
    textInputRef,
    mySetAddToMsgInputText,
    errorHandler,
    createPollViewRef,
    textFormatters,
    disableMentions,
    textFormatterArray,
    mentionsTextFormatterInstanceRef,
    setTextFormatters,
    CometChatUIKitLoginListener,
    group,
    user,
    userPropRef,
    groupPropRef,
    setShowListForMentions,
    searchMentions,
    mentionsFormatterInstanceId,
    setUsersRequestBuilder,
    setGroupMembersRequestBuilder,
    setUserMemberListType,
    getComposerId,
    pasteHtmlAtCaret,
    parentMessageIdPropRef,
    emptyInputField,
    text: state.text,
    propsText: props.initialComposerText,
    getCurrentInput,
    isPartOfCurrentChatForUIEvent
  });
  // Main rendering of the message composer component
  return (
    <>
      {getCreatePollModal()}
      <div className="cometchat" style={{ height: "fit-content", width: "100%", position: "relative" }}>
        {showListForMentions && !disableMentions && (
          <div
            className='cometchat-mention-list'

            ref={userMemberWrapperRef}>
            <CometChatUserMemberWrapper
              userMemberListType={userMemberListType}
              onItemClick={defaultMentionsItemClickHandler}
              usersRequestBuilder={usersRequestBuilder}
              searchKeyword={mentionsSearchTerm}
              onEmpty={defaultOnEmptyForMentions}
              group={group}
              groupMemberRequestBuilder={groupMembersRequestBuilder}
              disableLoadingState={true}
              onError={defaultOnEmptyForMentions}
            />
          </div>
        )}
        <div
          key={getComposerId()?.group || getComposerId()?.user}
          className='cometchat-message-composer'
        >
          {getMediaFilePicker()}
          {state.showValidationError || state.showMentionsCountWarning || headerView || getTextMessageEditPreview() ? getHeaderView() : null}
          {getTextInput()}
        </div>
      </div></>
  );
}
