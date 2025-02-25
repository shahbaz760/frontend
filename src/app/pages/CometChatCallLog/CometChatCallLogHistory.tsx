import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import outgoingCallSuccess from "/assets/icons/outgoingCallSuccess.svg";
import callRejectedIcon from "/assets/icons/callRejectedIcon.svg";
import incomingCallIcon from "/assets/icons/incomingCallIcon.svg";
import incomingCallSuccessIcon from "/assets/icons/incomingCallSuccess.svg";
import missedCallIcon from "/assets/icons/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogHistory.css";
import { CometChatDate, CometChatList, CometChatListItem, CometChatUIKit, CometChatUIKitCalls, CometChatUIKitConstants, DatePatterns, States, convertMinutesToHoursMinutesSeconds, localize } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsHistory = (props: { call: any }) => {
    const { call } = props;
    const [callList, setCallList] = useState<any[]>([]);
    const [callListState, setCallListState] = useState(States.loading);
    const requestBuilder = useRef<any>(null);
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

    useEffect(() => {
        if (loggedInUser) {
            requestBuilder.current = setRequestBuilder();
            getCallList?.();
        }
    }, [loggedInUser]);

    const setRequestBuilder = useCallback((): any => {
        try {
            let builder;
            let callUserId;
            if (call.getInitiator().getUid() === loggedInUser!.getUid()) {
                callUserId = call.getReceiver().getUid();
            } else {
                callUserId = call.getInitiator().getUid();
            }
            const authToken = loggedInUser!.getAuthToken() || "";
            builder = new CometChatUIKitCalls.CallLogRequestBuilder()
                .setLimit(30)
                .setCallCategory("call")
                .setAuthToken(authToken);

            if (callUserId) {
                builder = builder.setUid(callUserId);
            }

            return builder.build();
        } catch (e) {
            console.log(e);
        }
    }, [loggedInUser]);


    const fetchNextCallList = useCallback(async (): Promise<any[]> => {
        try {
            const calls = await requestBuilder?.current?.fetchNext();
            return calls;
        } catch (e) {
            throw new Error("Error while fetching call list");
        }
    }, [requestBuilder]);

    const getCallList = useCallback(async () => {
        try {
            const calls = await fetchNextCallList();
            if (calls && calls.length > 0) {
                setCallList((prevCallList) => {
                    return [...prevCallList, ...calls]
                })
                setCallListState(States.loaded);
            } else if (callList.length === 0) {
                setCallListState(States.empty);
            }
        } catch (e) {
            if (callList.length === 0) {
                setCallListState(States.error);
            }
        }
    }, [fetchNextCallList, setCallList, setCallListState, callList])

    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <div className="cometchat-call-log-history__subtitle">
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
            <div className={getCallDuration(item) ? "cometchat-call-log-history__trailing-view" : "cometchat-call-log-history__trailing-view-disabled"}>
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
                    return "Outgoing Call";
                case CometChatUIKitConstants.calls.cancelled:
                    return "Call Cancelled";
                case CometChatUIKitConstants.calls.rejected:
                    return "Rejected Call";
                case CometChatUIKitConstants.calls.busy:
                    return "Missed Call";
                case CometChatUIKitConstants.calls.ended:
                    return "Call Ended";
                case CometChatUIKitConstants.calls.ongoing:
                    return "Call Answered";
                case CometChatUIKitConstants.calls.unanswered:
                    return "Call Unanswered";
                default:
                    return "Outgoing Call";
            }
        } else {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return "Incoming Call";
                case CometChatUIKitConstants.calls.ongoing:
                    return "Call Answered";
                case CometChatUIKitConstants.calls.ended:
                    return "Call Ended";
                case CometChatUIKitConstants.calls.unanswered:
                case CometChatUIKitConstants.calls.cancelled:
                    return "Missed Call";
                case CometChatUIKitConstants.calls.busy:
                    return "Call Busy";
                case CometChatUIKitConstants.calls.rejected:
                    return "Rejected Call";
                default:
                    return "Outgoing Call";
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
                case "Outgoing Call":
                    return outgoingCallSuccess;
                case "Incoming Call":
                    return outgoingCallSuccess;
                case "Call Cancelled":
                    return outgoingCallSuccess;
                case "Rejected Call":
                    return callRejectedIcon;
                case "Call Busy":
                    return missedCallIcon;
                case "Call Ended":
                    return outgoingCallSuccess;
                case "Call Answered":
                    return outgoingCallSuccess;
                case "Call Unanswered":
                    return missedCallIcon;
                case "Missed Call":
                    return missedCallIcon;
                default:
                    return "";
            }
        } else {
            switch (callStatus) {
                case "Outgoing Call":
                    return incomingCallSuccessIcon;
                case "Incoming Call":
                    return incomingCallSuccessIcon;
                case "Call Cancelled":
                    return incomingCallIcon;
                case "Rejected Call":
                    return callRejectedIcon;
                case "Call Busy":
                    return missedCallIcon;
                case "Call Ended":
                    return incomingCallSuccessIcon;
                case "Call Answered":
                    return incomingCallSuccessIcon;
                case "Call Unanswered":
                    return missedCallIcon;
                case "Missed Call":
                    return missedCallIcon;
                default:
                    return "";
            }
        }

    }

    const getListItem = useMemo(() => {
        return function (item: any, index: number): any {
            return (
                <>
                    <CometChatListItem
                        title={getCallStatus(item, loggedInUser!)}
                        avatarURL={getAvatarUrlForCall(item)}
                        subtitleView={getListItemSubtitleView(item)}
                        trailingView={getListItemTailView(item)}
                    />
                </>
            )
        };
    }, [getAvatarUrlForCall, getListItemSubtitleView, getListItemTailView, loggedInUser]);

    return (
        <div className="cometchat-call-log-history">
            <CometChatList
                hideSearch={true}
                list={callList}
                onScrolledToBottom={getCallList}
                listItemKey="getSessionID"
                itemView={getListItem}
                state={callListState}
                showSectionHeader={false}
            />
        </div>
    )
}