import { useCallback, useEffect, useState } from "react";
import outgoingCallSuccess from "/assets/icons/outgoingCallSuccess.svg";
import callRejectedIcon from "/assets/icons/callRejectedIcon.svg";
import incomingCallIcon from "/assets/icons/incomingCallIcon.svg";
import incomingCallSuccessIcon from "/assets/icons/incomingCallSuccess.svg";
import missedCallIcon from "/assets/icons/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogInfo.css";
import { CometChatDate, CometChatListItem, CometChatUIKit, CometChatUIKitConstants, DatePatterns, convertMinutesToHoursMinutesSeconds, localize } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsInfo = (props: { call: any }) => {
    const { call } = props;
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

    useEffect(
        () => {
            CometChatUIKit.getLoggedinUser().then(
                (user) => {
                    setLoggedInUser(user);
                }
            );
        },
        [setLoggedInUser]
    );

    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <div className="cometchat-call-log-info__subtitle">
                <CometChatDate
                    pattern={DatePatterns.DateTime}
                    timestamp={item?.getInitiatedAt()}
                ></CometChatDate>
            </div>
        );
    }, [])

    const getCallDuration = useCallback((item: any) => {
        try {
            if (item?.getTotalDurationInMinutes()) {
                return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }, []);

    const getListItemTailView = useCallback((item: any): JSX.Element => {
        return (
            <div className={getCallDuration(item) ? "cometchat-call-log-info__trailing-view" : "cometchat-call-log-info__trailing-view-disabled"}>
                {getCallDuration(item) ? getCallDuration(item) : '00:00'}
            </div>
        );
    }, [getCallDuration]);

    const getCallStatus = (call: CometChat.Call, loggedInUser: CometChat.User): string => {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.callInitiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const callStatus: string = call.getStatus();
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return "Outgoing Call"; // Replaced with actual text
                case CometChatUIKitConstants.calls.cancelled:
                    return "Call Cancelled"; // Replaced with actual text
                case CometChatUIKitConstants.calls.rejected:
                    return "Rejected call"; // Replaced with actual text
                case CometChatUIKitConstants.calls.busy:
                    return "Missed Call"; // Replaced with actual text
                case CometChatUIKitConstants.calls.ended:
                    return "Call Ended"; // Replaced with actual text
                case CometChatUIKitConstants.calls.ongoing:
                    return "Call Answered"; // Replaced with actual text
                case CometChatUIKitConstants.calls.unanswered:
                    return "Call Unanswered"; // Replaced with actual text
                default:
                    return "Outgoing Call"; // Replaced with actual text
            }
        } else {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return "Incoming Call"; // Replaced with actual text
                case CometChatUIKitConstants.calls.ongoing:
                    return "Call Answered"; // Replaced with actual text
                case CometChatUIKitConstants.calls.ended:
                    return "Call Ended"; // Replaced with actual text
                case CometChatUIKitConstants.calls.unanswered:
                case CometChatUIKitConstants.calls.cancelled:
                    return "Missed Call"; // Replaced with actual text
                case CometChatUIKitConstants.calls.busy:
                    return "Call Busy"; // Replaced with actual text
                case CometChatUIKitConstants.calls.rejected:
                    return "Rejected call"; // Replaced with actual text
                default:
                    return "Outgoing Call"; // Replaced with actual text
            }
        }

    }

    function getAvatarUrlForCall(call: CometChat.Call) {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.initiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        const callStatus = getCallStatus(call, loggedInUser!);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case "Outgoing Call": // Replaced with actual text
                    return outgoingCallSuccess;
                case "Incoming Call": // Replaced with actual text
                    return outgoingCallSuccess;
                case "Call Cancelled": // Replaced with actual text
                    return outgoingCallSuccess;
                case "Rejected call": // Replaced with actual text
                    return callRejectedIcon;
                case "Call Busy": // Replaced with actual text
                    return missedCallIcon;
                case "Call Ended": // Replaced with actual text
                    return outgoingCallSuccess;
                case "Call Answered": // Replaced with actual text
                    return outgoingCallSuccess;
                case "Call Unanswered": // Replaced with actual text
                    return missedCallIcon;
                case "Missed Call": // Replaced with actual text
                    return missedCallIcon;
                default:
                    return "";
            }
        } else {
            switch (callStatus) {
                case "Outgoing Call": // Replaced with actual text
                    return incomingCallSuccessIcon;
                case "Incoming Call": // Replaced with actual text
                    return incomingCallSuccessIcon;
                case "Call Cancelled": // Replaced with actual text
                    return incomingCallIcon;
                case "Rejected call": // Replaced with actual text
                    return callRejectedIcon;
                case "Call Busy": // Replaced with actual text
                    return missedCallIcon;
                case "Call Ended": // Replaced with actual text
                    return incomingCallSuccessIcon;
                case "Call Answered": // Replaced with actual text
                    return incomingCallSuccessIcon;
                case "Call Unanswered": // Replaced with actual text
                    return missedCallIcon;
                case "Missed Call": // Replaced with actual text
                    return missedCallIcon;
                default:
                    return "";
            }
        }

    }

    return (
        <div className="cometchat-call-log-info">
            <CometChatListItem
                title={getCallStatus(call, loggedInUser!)}
                avatarURL={getAvatarUrlForCall(call)}
                subtitleView={getListItemSubtitleView(call)}
                trailingView={getListItemTailView(call)}
            />
        </div>
    )
}