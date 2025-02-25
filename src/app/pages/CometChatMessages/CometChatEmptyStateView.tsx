import { localize } from "@cometchat/chat-uikit-react";
import "../styles/CometChatMessages/CometChatEmptyStateView.css";

export const CometChatEmptyStateView = (props: { activeTab?: string }) => {
    const { activeTab } = props;

    return (
        <div className="cometchat-empty-state-view">
            <div className={activeTab !== "calls" ? "cometchat-empty-state-view__icon" : "cometchat-empty-state-view__icon-call"} />
            <div className="cometchat-empty-state-view__text">
                <div className="cometchat-empty-state-view__text-title">
                    {activeTab !== "calls" ?
                        "Welcome to Your Conversations"
                        : "It's nice to talk with someone"
                    }
                </div>
                {activeTab !== "calls" ?
                    "Select a chat from the list to start exploring your messages or begin a new conversation."
                    : "Pick a user or group from the left sidebar call list, and start your conversation."}
            </div>
        </div>
    )
}