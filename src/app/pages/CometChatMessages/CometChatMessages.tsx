import { CometChatMessageComposer, CometChatMessageHeader, CometChatMessageList, localize } from "@cometchat/chat-uikit-react";
import "../styles/CometChatMessages/CometChatMessages.css";
import { useEffect, useState } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUserEvents } from "@cometchat/chat-uikit-react";
interface MessagesViewProps {
    user?: CometChat.User;
    group?: CometChat.Group;
    headerMenu: () => JSX.Element;
    onThreadRepliesClick: (message: CometChat.BaseMessage) => void;
    showComposer?: boolean;
    onBack?: () => void;
}

export const CometChatMessages = (props: MessagesViewProps) => {
    const {
        user,
        group,
        headerMenu,
        onThreadRepliesClick,
        showComposer,
        onBack = () => { }
    } = props;

    const [showComposerState, setShowComposerState] = useState<boolean | undefined>(showComposer);

    useEffect(() => {
        setShowComposerState(showComposer);
        if (user?.getHasBlockedMe?.() || user?.getBlockedByMe?.()) {
            setShowComposerState(false);
        }
    }, [user, showComposer]);

    return (
        <div className="cometchat-messages-wrapper">
            <div className="cometchat-header-wrapper">
                <CometChatMessageHeader
                    user={user}
                    group={group}
                    auxiliaryButtonView={headerMenu()}
                    onBack={onBack}
                />
            </div>
            <div className="cometchat-message-list-wrapper">
                <CometChatMessageList
                    user={user}
                    group={group}
                    onThreadRepliesClick={(message: CometChat.BaseMessage) => onThreadRepliesClick(message)}
                />
            </div>
            {showComposerState ? <div className="cometchat-composer-wrapper">
                <CometChatMessageComposer
                    user={user}
                    group={group}
                />
            </div> : <div className="message-composer-blocked" onClick={() => {
                if (user) {
                    CometChat.unblockUsers([user?.getUid()]).then(() => {
                        user.setBlockedByMe(false);
                        CometChatUserEvents.ccUserUnblocked.next(user);
                    })
                }
            }}>
                <div className="message-composer-blocked__text">
                    {"Can’t send a message to blocked user."} <a>   {"Click to unblock."}</a>
                </div>
            </div>}
        </div>
    )
}