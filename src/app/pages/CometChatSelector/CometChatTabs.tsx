
import "../styles/CometChatSelector/CometChatTabs.css";
import { useState } from "react";

export const CometChatTabs = (props: {
    onTabClicked?: (tabItem: { name: string; icon: string; }) => void;
    activeTab?: string;
}) => {
    const {
        onTabClicked = () => { },
        activeTab
    } = props;
    const [hoverTab, setHoverTab] = useState("");

    const tabItems = [{
        "name": "Chats",
        "icon": "/assets/icons/chat.svg",
        "active": "/assets/icons/chatAactive.svg"
    }, {
        //     "name": "CALLS",
        //     "icon": "Call",
        //     "active": "/assets/icons/chatActive.svg"
        // }, {
        "name": "Users",
        "icon": "/assets/icons/user.svg",
        "active": "/assets/icons/userActive.svg"
    }, {
        "name": "Groups",
        "icon": "/assets/icons/groupIcon.svg",
        "active": "/assets/icons/groupIconActive.svg"
    }]

    return (
        <div className="cometchat-tab-component">
            {tabItems.map((tabItem) => (
                <div
                    key={tabItem.name}
                    className={(activeTab === tabItem?.name?.toLowerCase() ? 'cometchat-tab-component__tab_active' : "cometchat-tab-component__tab")}
                    onClick={() => onTabClicked(tabItem)}
                >

                    <div
                        className={activeTab === tabItem?.name?.toLowerCase() ? "cometchat-tab-component__tab-icon cometchat-tab-component__tab-icon-active" : "cometchat-tab-component__tab-icon"}
                        // style={tabItem.icon ? { WebkitMask: `url(${tabItem.icon}), center, center, no-repeat` } : undefined}

                        onMouseEnter={() => setHoverTab(tabItem?.name?.toLowerCase())}
                        onMouseLeave={() => setHoverTab("")}
                    >
                        {activeTab === tabItem?.name?.toLowerCase() ? <img src={tabItem.active} style={{ width: '32px' }} /> : <img src={tabItem.icon} style={{ width: '32px' }} />}

                    </div>
                    <div
                        className={activeTab === tabItem?.name?.toLowerCase() ? "cometchat-tab-component__tab-text cometchat-tab-component__tab-text-active" : "cometchat-tab-component__tab-text"}
                        onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
                        onMouseLeave={() => setHoverTab("")}
                    >
                        {tabItem.name}
                    </div>
                </div>
            ))}
        </div>
    )
}