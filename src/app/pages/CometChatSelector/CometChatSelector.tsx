import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { Call, Conversation, Group, User } from "@cometchat/chat-sdk-javascript";
import "../styles/CometChatSelector/CometChatSelector.css";
import { CometChatJoinGroup } from "../CometChatJoinGroup/CometChatJoinGroup";
import CometChatCreateGroup from "../CometChatCreateGroup/CometChatCreateGroup";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatButton, CometChatCallLogs, CometChatConversations, CometChatGroups, CometChatOption, CometChatUIKit, CometChatUIKitLoginListener, CometChatUsers, localize } from "@cometchat/chat-uikit-react";
import { CometChatContextMenu, Placement } from "@cometchat/chat-uikit-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import createGroupIcon from '/assets/icons/create-group.svg';
import { useAppDispatch } from "app/store/store";
import { getChatBoardData } from "app/store/Projects";
import { getUserDetail } from "src/utils";
import { getUserIdInfo } from "app/store/Common";
import Users from "../users/Users";

interface SelectorProps {
    group?: Group;
    showJoinGroup?: boolean;
    activeTab?: string;
    activeItem?: User | Group | Conversation | Call;
    onSelectorItemClicked?: (input: User | Group | Conversation | Call, type: string) => void;
    onProtectedGroupJoin?: (group: Group) => void;
    showCreateGroup?: boolean;
    setShowCreateGroup?: Dispatch<SetStateAction<boolean>>;
    onHide?: () => void;
    onNewChatClicked?: () => void;
    setSelectedItem?: any;
    onGroupCreated?: (group: Group) => void;
}

export const CometChatSelector = (props: SelectorProps) => {
    const {
        group,
        showJoinGroup,
        activeItem,
        activeTab,
        onSelectorItemClicked = () => { },
        onProtectedGroupJoin = () => { },
        showCreateGroup,
        setShowCreateGroup = () => { },
        onHide = () => { },
        onNewChatClicked = () => { },
        onGroupCreated = () => { },
        setSelectedItem,
    } = props;

    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();
    const navigate = useNavigate();
    const { setAppState } = useContext(AppContext);
    const client_id = getUserDetail();
    const { id } = useParams<{ id: string }>();
    const [users, setUsersList] = useState([]);
    const [convUsersList, setConvUsersList] = useState([]);

    useEffect(() => {
        let loggedInUsers = CometChatUIKitLoginListener.getLoggedInUser();
        setLoggedInUser(loggedInUsers)
    }, [CometChatUIKitLoginListener?.getLoggedInUser()])

    const getOptions = (): CometChatOption[] => {
        return [
            new CometChatOption({
                id: "logged-in-user",
                title: loggedInUser && loggedInUser.getName() || "",
                iconURL: "/assets/icons/userActive.svg",
            }),
            new CometChatOption({
                id: "create-conversation",
                title: "Create Conversation",
                iconURL: "/assets/icons/chatAactive.svg",
                onClick: () => {
                    onNewChatClicked()
                },
            }),
            // new CometChatOption({
            //     id: "log-out",
            //     title: "Log Out",
            //     iconURL: "/assets/icons/logout.svg",
            //     onClick: () => {
            //         logOut();
            //     },
            // })
        ]
    };

    const logOut = () => {
        CometChatUIKit.logout().then(() => {
            setLoggedInUser(null)
            navigate('/login', { replace: true });
            setAppState({ type: "resetAppState" });
        }).catch((error) => {
            console.log("error", error)
        })
    }

    const conversationsHeaderView = () => {
        return (
            <div className="cometchat-conversations-header">
                <div className="cometchat-conversations-header__title">
                    {"Chats"}
                </div>
                <div className="chat-menu">
                    <CometChatContextMenu
                        key="delete-button"
                        closeOnOutsideClick={true}
                        placement={Placement.left}
                        data={getOptions() as CometChatOption[]}
                        topMenuSize={1}
                        onOptionClicked={(e: CometChatOption) => {
                            const { id, onClick } = e;
                            if (onClick) {
                                onClick();
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
    const dispatch = useAppDispatch()
    const location = useLocation();
    const onBack = () => {
        setSelectedItem(undefined);
        // setNewChat(undefined);
        setAppState({ type: "updateSelectedItem", payload: undefined });
        setAppState({ type: "updateSelectedItemUser", payload: undefined });
        setAppState({ type: "updateSelectedItemGroup", payload: undefined });
        setAppState({ type: "newChat", payload: undefined });
    }
    useEffect(() => {

        if (location.pathname.includes("/projects") && id && client_id?.id) {
            onBack()
            dispatch(getChatBoardData(id))
                .unwrap()
                .then((res) => {
                    if (res?.data && res?.data?.data) {
                        setUsersList([...res?.data?.data.map((d) => d.toString())]);

                        const list = res?.data?.data.map(
                            (data) => client_id.id + "_user_" + data.toString()
                        );
                        const newList = res?.data?.data.map(
                            (data) => data.toString() + "_user_" + client_id.id
                        );
                        setConvUsersList([...list, ...newList]);
                    }
                });
        }
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes("/projects") && client_id?.id && client_id?.id != 1) {
            onBack()
            dispatch(getUserIdInfo())
                .unwrap()
                .then((res) => {
                    if (res?.data && res?.data?.data) {
                        if (res?.data?.data.length > 0) {
                            setUsersList([...res?.data?.data.map((d) => d.toString())]);
                        } else { setUsersList([-1]) }
                        const list = res?.data?.data.map(
                            (data) => client_id.id + "_user_" + data.toString()
                        );
                        const newList = res?.data?.data.map(
                            (data) => data.toString() + "_user_" + client_id.id
                        );
                        setConvUsersList([...list, ...newList]);
                    }
                });
        }
    }, [client_id?.id]);

    const groupsHeaderView = () => {
        return (
            <div className="cometchat-groups-header" >
                <div className="cometchat-groups-header__title" >
                    {"Groups"}
                </div>
                < CometChatButton onClick={() => {
                    setShowCreateGroup(true)
                }}
                    iconURL={createGroupIcon} />
            </div>
        )
    }
    const [conversationsRequest, setConversationsRequest] = useState<CometChat.ConversationsRequest | null>(null);

    const conversationsRequestBuilder = useMemo(() => {
        return new CometChat.ConversationsRequestBuilder().setLimit(30);
    }, []);


    const UserRequestBuilder = useMemo(() => {
        return new CometChat.UsersRequestBuilder().setLimit(30).setUIDs([...users])
    }, [users]);

    const GroupRequestBuilder = useMemo(() => {
        return new CometChat.GroupsRequestBuilder().setLimit(30).joinedOnly(true)
    }, []);

    return (
        <>
            {loggedInUser && <>
                {showJoinGroup && group && (
                    <CometChatJoinGroup
                        group={group}
                        onHide={onHide}
                        onProtectedGroupJoin={(group) => onProtectedGroupJoin(group)}
                    />
                )}
                {activeTab == "chats" ? (
                    <CometChatConversations
                        activeConversation={activeItem as Conversation}
                        headerView={conversationsHeaderView()}
                        conversationsRequestBuilder={conversationsRequestBuilder}
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItem");
                        }}
                    />

                ) : activeTab == "calls" ? (
                    <CometChatCallLogs
                        activeCall={activeItem as Call}
                        onItemClick={(e: Call) => {
                            onSelectorItemClicked(e, "updateSelectedItemCall");
                        }}
                    />
                ) : activeTab == "users" ? (
                    <CometChatUsers
                        activeUser={activeItem as User}
                        usersRequestBuilder={UserRequestBuilder}
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItemUser");
                        }}
                    />
                ) : activeTab == "groups" ? (
                    <CometChatGroups
                        activeGroup={activeItem as Group}
                        headerView={groupsHeaderView()}

                        groupsRequestBuilder={GroupRequestBuilder}
                        onItemClick={(e) => {
                            onSelectorItemClicked(e, "updateSelectedItemGroup");
                        }}
                    />
                ) : null}
                {showCreateGroup && (
                    <>
                        <CometChatCreateGroup
                            setShowCreateGroup={setShowCreateGroup}
                            onGroupCreated={(group) => onGroupCreated(group)}
                        />
                    </>
                )}
            </>}
        </>
    );
}