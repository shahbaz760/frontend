import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Call, CometChat, Conversation, Group, GroupType, MessagesRequestBuilder, User } from "@cometchat/chat-sdk-javascript";
import { CometChatJoinGroup } from "../CometChatJoinGroup/CometChatJoinGroup";
// import addMembersIcon from "/assets/icons/addMembers.svg";
// import leaveGroupIcon from "/assets/icons/leaveGroup.svg";
import "../styles/CometChatSelector/CometChatTabs.css";
import "../styles/CometChatSelector/CometChatSelector.css";
import '../styles/CometChatNewChat/CometChatNewChatView.css';
import "../styles/CometChatMessages/CometChatMessages.css";
import "../styles/CometChatDetails/CometChatDetails.css";
import { CometChatEmptyStateView } from "../CometChatMessages/CometChatEmptyStateView";
import { CometChatBannedMembers } from "../CometChatBannedMembers/CometChatBannedMembers";
import { CometChatTransferOwnership } from "../CometChatTransferOwnership/CometChatTransferOwnership";
import { CometChatMessages } from "../CometChatMessages/CometChatMessages";
import { CometChatTabs } from "../CometChatSelector/CometChatTabs";
import { CometChatSelector } from "../CometChatSelector/CometChatSelector";
import { CometChatUserDetails } from "../CometChatDetails/CometChatUserDetails";
import { CometChatThreadedMessages } from "../CometChatDetails/CometChatThreadedMessages";
// import { CometChatCallDetails } from "../CometChatCallLog/CometChatCallLogDetails";
import { CometChatAlertPopup } from "../CometChatAlertPopup/CometChatAlertPopup";
import { CometChatAvatar, CometChatButton, CometChatConfirmDialog, CometChatConversationEvents, CometChatGroupEvents, CometChatGroupMembers, CometChatGroups, CometChatIncomingCall, CometChatMessageEvents, CometChatToast, CometChatUIKit, CometChatUIKitConstants, CometChatUIKitLoginListener, CometChatUIKitUtility, CometChatUserEvents, CometChatUsers, IMessages, localize, CometChatUIEvents, IMouseEvent } from "@cometchat/chat-uikit-react";
import { CallLog } from "@cometchat/calls-sdk-javascript";
import { CometChatAddMembers } from "../CometChatAddMembers/CometChatAddMembers";
import { AppContext } from "../context/AppContext";
import { getChatBoardData } from "app/store/Projects";
import { RootState, useAppDispatch } from "app/store/store";
import { checkMatchingKeyWords, getUserDetail } from "src/utils";
import { getUserIdInfo, postKeywordMail } from "app/store/Common";
import { useSelector } from "react-redux";
import ListLoading from "@fuse/core/ListLoading";
import { getKeywordList } from "app/store/keyword";

interface TabContentProps {
  selectedTab: string;
}

interface ThreadProps {
  message: CometChat.BaseMessage;
}

function CometChatHome(props) {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const appID: string = localStorage.getItem('appId') || "259609cb3421e0d7"; // Use the latest appId if available
  const region: string = localStorage.getItem('region') || "in"; // Default to 'us' if region is not found
  const authKey: string = localStorage.getItem('authKey') || "9f737cdb0b6b7c9a060608747b5f7b7aa7ef0ec6"; // Default authKey if not found
  const [group, setGroup] = useState<Group>();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chats");
  const [selectedItem, setSelectedItem] = useState<Conversation | User | Group | Call>();
  const [showNewChat, setShowNewChat] = useState<boolean>(false);
  const showJoinGroupRef = useRef(false);
  const [newChat, setNewChat] = useState<{
    user?: CometChat.User,
    group?: CometChat.Group
  } | undefined>();
  const [showAlertPopup, setShowAlertPopup] = useState({ visible: false, description: "" });
  const [showToast, setShowToast] = useState(false);
  const toastTextRef = useRef<string>("");
  const client_id = getUserDetail();
  const { id } = useParams<{ id: string }>();
  const [users, setUsersList] = useState([]);
  const [convUsersList, setConvUsersList] = useState([]);
  const { appState, setAppState } = useContext(AppContext);

  function hasCredentials() {
    if (appID === '' || region === '' || authKey === '') return false;
    return true;
  }
  useEffect((() => {
    let ccOwnershipChanged = CometChatGroupEvents.ccOwnershipChanged.subscribe(() => {
      toastTextRef.current = "Group ownership transferred successfully.";
      setShowToast(true)
    })
    let ccGroupMemberScopeChanged = CometChatGroupEvents.ccGroupMemberScopeChanged.subscribe(() => {
      toastTextRef.current = "Permissions updated successfully.";
      setShowToast(true)
    })
    let ccGroupMemberAdded = CometChatGroupEvents.ccGroupMemberAdded.subscribe(() => {
      toastTextRef.current = "Member added to the group.";
      setShowToast(true)
    })
    let ccGroupMemberBanned = CometChatGroupEvents.ccGroupMemberBanned.subscribe(() => {
      toastTextRef.current = "Member has been banned from the group.";
      setShowToast(true)
    })
    let ccGroupMemberKicked = CometChatGroupEvents.ccGroupMemberKicked.subscribe(() => {
      toastTextRef.current = "Member has been removed from the group.";
      setShowToast(true)
    })
    return () => {
      ccOwnershipChanged?.unsubscribe();
      ccGroupMemberScopeChanged?.unsubscribe();
      ccGroupMemberAdded?.unsubscribe();
      ccGroupMemberBanned?.unsubscribe();
      ccGroupMemberKicked?.unsubscribe();
    }

  }), [])


  useEffect(() => {
    const user = CometChatUIKitLoginListener.getLoggedInUser();
    setLoggedInUser(user);
  }, []);
  useEffect(() => {
    const isMessageListOpen =
      selectedItem &&
      (selectedItem instanceof CometChat.User ||
        selectedItem instanceof CometChat.Group ||
        selectedItem instanceof CometChat.Conversation);

    if (activeTab === "chats" || isMessageListOpen) return;
    const messageListenerId = `misc-message_${Date.now()}`;
    attachMessageReceivedListener(messageListenerId);

    return () => {
      CometChat.removeMessageListener(messageListenerId);
    };
  }, [activeTab, selectedItem]);
  const dispatch = useAppDispatch()

  /**
 * Handles new received messages
 */
  const onMessageReceived = useCallback(
    async (message: CometChat.BaseMessage): Promise<void> => {
      if (
        message.getSender().getUid() !== CometChatUIKitLoginListener.getLoggedInUser()?.getUid() &&
        !message.getDeliveredAt()
      ) {
        try {
          CometChat.markAsDelivered(message);
        } catch (error) {
          console.error(error)
        }
      }
    },
    []
  );

  const attachMessageReceivedListener = useCallback((messageListenerId: string) => {
    CometChat.addMessageListener(messageListenerId, new CometChat.MessageListener({
      onTextMessageReceived: (textMessage: CometChat.TextMessage) => {
        onMessageReceived(textMessage)
      },
      onMediaMessageReceived: (mediaMessage: CometChat.MediaMessage) => {
        onMessageReceived(mediaMessage);
      },
      onCustomMessageReceived: (customMessage: CometChat.CustomMessage) => {
        onMessageReceived(customMessage);
      }
    }))
  }, [onMessageReceived])
  const updateUserAfterBlockUnblock = (user: User) => {
    if (appState.selectedItemUser?.getUid() === user.getUid()) {
      setAppState({ type: "updateSelectedItemUser", payload: user });
    }
    if ((appState.selectedItem?.getConversationWith() as User)?.getUid?.() === user.getUid()) {
      appState.selectedItem?.setConversationWith(user);
      setAppState({ type: "updateSelectedItem", payload: appState.selectedItem });
    }
  }


  const TabComponent = () => {
    const onTabClicked = (tabItem: { name: string; icon: string }) => {
      setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
      setNewChat(undefined);
      setActiveTab(tabItem.name.toLowerCase());
    }

    return (
      <CometChatTabs onTabClicked={onTabClicked} activeTab={activeTab} />
    )
  }

  useEffect(() => {
    if (activeTab === "chats" && appState.selectedItem) {
      setSelectedItem(appState.selectedItem);
    } else if (activeTab === "users" && appState.selectedItemUser) {
      setSelectedItem(appState.selectedItemUser);
    } else if (activeTab === "groups" && appState.selectedItemGroup) {
      setSelectedItem(appState.selectedItemGroup);
    } else if (activeTab === "calls" && appState.selectedItemCall) {
      setSelectedItem(appState.selectedItemCall);
    } else {
      setSelectedItem(undefined);
    }
  }, [activeTab]);


  const InformationComponent = useCallback(() => {
    return (
      <>
        {showNewChat ? <CometChatNewChatView />
          :
          (selectedItem || newChat?.user || newChat?.group) ? (<CometChatMessagesViewComponent />)
            :
            (<CometChatEmptyStateView activeTab={activeTab} />)
        }
      </>
    )
  }, [activeTab, showNewChat, selectedItem, newChat]);

  const CometChatMessagesViewComponent = () => {
    const [showComposer, setShowComposer] = useState(true);
    const [messageUser, setMessageUser] = useState<User>();
    const [messageGroup, setMessageGroup] = useState<Group>();
    const [threadedMessage, setThreadedMsg] = useState<CometChat.BaseMessage | undefined>();

    useEffect(() => {
      if (newChat?.user) {
        setMessageUser(newChat.user);
        setMessageGroup(undefined);
      } else if (newChat?.group) {
        setMessageUser(undefined);
        setMessageGroup(newChat.group);
      } else {
        if (activeTab === "chats") {
          if ((selectedItem as Conversation)?.getConversationType?.() === CometChatUIKitConstants.MessageReceiverType.user) {
            setMessageUser((selectedItem as Conversation)?.getConversationWith() as User);
            setMessageGroup(undefined);
          } else if ((selectedItem as Conversation)?.getConversationType?.() === CometChatUIKitConstants.MessageReceiverType.group) {
            setMessageUser(undefined);
            setMessageGroup((selectedItem as Conversation)?.getConversationWith() as Group);
          }
        } else if (activeTab === "users") {
          setMessageUser(selectedItem as User);
          setMessageGroup(undefined);
        } else if (activeTab === "groups") {
          setMessageUser(undefined);
          setMessageGroup(selectedItem as Group);
        } else {
          setMessageUser(undefined);
          setMessageGroup(undefined);
        }
      }
    }, [activeTab, selectedItem]);

    const subscribeToEvents = () => {
      const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe(user => {
        if (user.getBlockedByMe()) {
          setShowComposer(false);
        }
        updateUserAfterBlockUnblock(user);
      });
      const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe(user => {
        if (!user.getBlockedByMe()) {
          setShowComposer(true);
        }
        updateUserAfterBlockUnblock(user);
      });
      const ccMessageDeleted = CometChatMessageEvents.ccMessageDeleted.subscribe(message => {
        if (message.getId() === threadedMessage?.getId()) {
          setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } })
        }
      })

      return () => {
        ccUserBlocked?.unsubscribe();
        ccUserUnblocked?.unsubscribe();
        ccMessageDeleted?.unsubscribe();
      };
    };

    useEffect(() => {
      if (messageUser?.getBlockedByMe()) {
        setShowComposer(false);
      }
      const unsubscribeFromEvents = subscribeToEvents();
      return () => {
        unsubscribeFromEvents();
      };
    }, [subscribeToEvents, selectedItem]);

    const showSideComponent = () => {
      let type = "";
      if (activeTab === "chats") {
        if ((selectedItem as Conversation)?.getConversationType() === "group") {
          type = "group";
        } else {
          type = "user";
        }
      } else if (activeTab === "users") {
        type = "user";
      } else if (activeTab === "groups") {
        type = "group";
      }

      if (newChat?.user) {
        type = "user";
      } else if (newChat?.group) {
        type = "group";
      }
      setAppState({ type: "updateSideComponent", payload: { visible: true, type } })
    }

    const headerMenu = () => {
      return (
        <div
          className="cometchat-header__info"
          onClick={showSideComponent}
        />
      )
    }

    const updateThreadedMessage = (message: CometChat.BaseMessage) => {
      setThreadedMsg(message);
      setAppState({ type: "updateSideComponent", payload: { visible: true, type: "threadedMessage" } });
      setAppState({ type: "updateThreadedMessage", payload: message });
    }

    const onBack = () => {
      setSelectedItem(undefined);
      setNewChat(undefined);
      setAppState({ type: "updateSelectedItem", payload: undefined });
      setAppState({ type: "updateSelectedItemUser", payload: undefined });
      setAppState({ type: "updateSelectedItemGroup", payload: undefined });
      setAppState({ type: "newChat", payload: undefined });
    }


    return (
      <>
        {/* {(selectedItem as any)?.mode === "call" ?
          <CometChatCallDetails selectedItem={selectedItem as Call} onBack={() => {
            setSelectedItem(undefined);
            setAppState({ type: "updateSelectedItemCall", payload: undefined });
          }} />
          : */}
        <CometChatMessages
          user={messageUser}
          group={messageGroup}
          onBack={onBack}
          headerMenu={headerMenu}
          onThreadRepliesClick={(message) => updateThreadedMessage(message)}
          showComposer={showComposer}
        />
        {/* } */}
      </>
    )
  }

  const CometChatNewChatView: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string>('user');
    const [group, setGroup] = useState<Group>();
    const loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();

    const handleTabClick = (tab: string) => {
      setSelectedTab(tab);

    };

    const joinGroup = (e: Group) => {
      if (!e.getHasJoined()) {
        if (e.getType() === CometChatUIKitConstants.GroupTypes.public) {
          CometChat.joinGroup(e.getGuid(), e.getType() as GroupType)
            .then((response: any) => {
              setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
              response.setHasJoined?.(true);
              response.setScope?.(CometChatUIKitConstants.groupMemberScope.participant);
              setNewChat({ group: response, user: undefined });
              setShowNewChat(false);
              setTimeout(() => {
                CometChatGroupEvents.ccGroupMemberJoined.next({
                  joinedGroup: response,
                  joinedUser: loggedInUser!
                })
              }, 100)
            })
            .catch((error: unknown) => {
              console.log(error);
            });
        } else {
          setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
          setGroup(e);
          showJoinGroupRef.current = true
        }
      } else {
        setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
        setNewChat({ group: e, user: undefined });
        setShowNewChat(false);
      }
    }

    const [users, setUsersList] = useState([]);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const location = useLocation();


    useEffect(() => {

      if (location.pathname.includes("/projects") && id && client_id?.id) {


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
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const TabContent: React.FC<TabContentProps> = ({ selectedTab }) => {
      return selectedTab === 'user' ?
        loading ? <ListLoading /> : <CometChatUsers
          usersRequestBuilder={new CometChat.UsersRequestBuilder().setLimit(30).setUIDs([...users])}
          onItemClick={(user: CometChat.User) => {
            setNewChat({ user, group: undefined });
            setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
            setShowNewChat(false);
          }}

        />
        : <CometChatGroups
          groupsRequestBuilder={new CometChat.GroupsRequestBuilder().joinedOnly(true).setLimit(30)}
          onItemClick={(e: CometChat.Group) => joinGroup(e)} />;
    };

    return (
      <div className='cometchat-new-chat-view'>
        {showJoinGroupRef.current && group && <CometChatJoinGroup
          group={group}
          onHide={() => showJoinGroupRef.current = false}
          onProtectedGroupJoin={(group) => {
            if (activeTab === "chats") {
              setShowNewChat(false);
              const convId = group?.getGuid();
              const convType = CometChatUIKitConstants.MessageReceiverType.group;
              CometChat.getConversation(convId!, convType).then(
                (conversation) => {
                  setSelectedItem(conversation);
                },
                (error) => {
                  setSelectedItem(undefined);
                }
              );
            } else {
              setSelectedItem(group);
            }
          }}
        />}
        {/* Header with back icon and title */}
        <div className='cometchat-new-chat-view__header'>
          <CometChatButton iconURL="/assets/icons/backbutton.svg" onClick={() => {
            setShowNewChat(false);

          }} />
          <div className='cometchat-new-chat-view__header-title'>New Chat</div>
        </div>

        {/* Tabs for User and Group */}
        <div className='cometchat-new-chat-view__tabs'>
          <div className={`cometchat-new-chat-view__tabs-tab ${selectedTab == 'user' ? "cometchat-new-chat-view__tabs-tab-active" : ""}`} onClick={() => handleTabClick('user')}> {"Users"}</div>
          <div className={`cometchat-new-chat-view__tabs-tab ${selectedTab == 'group' ? "cometchat-new-chat-view__tabs-tab-active" : ""}`} onClick={() => handleTabClick('group')}> {"Groups"}</div>
        </div>

        {/* Dynamic content based on selected tab */}
        <div style={{ overflow: "hidden" }}>
          <TabContent selectedTab={selectedTab} />
        </div>
      </div>
    );
  };

  const SideComponent = () => {
    const [group, setGroup] = useState<CometChat.Group>();
    const [user, setUser] = useState<CometChat.User>();

    useEffect(() => {
      if (activeTab == "chats") {
        if ((selectedItem as Conversation)?.getConversationType?.() === "user") {
          setUser((selectedItem as Conversation)?.getConversationWith() as CometChat.User);
        } else if ((selectedItem as Conversation)?.getConversationType?.() === "group") {
          setGroup((selectedItem as Conversation).getConversationWith() as CometChat.Group);
        }
      } else if (activeTab === "users") {
        setUser(selectedItem as CometChat.User);
      } else if (activeTab === "groups") {
        setGroup(selectedItem as CometChat.Group);
      }
    }, [selectedItem, activeTab]);

    useEffect(() => {
      if (newChat?.user) {
        setUser(newChat.user);
      } else if (newChat?.group) {
        setGroup(newChat.group);
      }
    }, [newChat]);

    return (
      <>
        {appState.sideComponent.visible && (
          <div className="side-component-wrapper">
            {appState.sideComponent.type == "user" && user && <SideComponentUser user={user} />}
            {appState.sideComponent.type == "group" && group && <SideComponentGroup group={group} />}
            {appState.sideComponent.type == "threadedMessage" && appState.threadedMessage && <SideComponentThread message={appState.threadedMessage} />}
          </div>
        )}
      </>
    )
  }

  const SideComponentUser = (props: { user: CometChat.User }) => {
    const { user } = props;

    const actionItemsArray = [{
      "name": user.getBlockedByMe() ? "Unblock" : "Block",
      "icon": "/assets/icons/block.svg"
    }, {
      "name": "Delete Chat",
      "icon": "/assets/icons/deleteicon.svg"
    }]
    const [actionItems, setActionItems] = useState(actionItemsArray);
    const [showStatus, setShowStatus] = useState(true);
    const [showBlockUserDialog, setShowBlockUserDialog] = useState(false);
    const [showDeleteConversationDialog, setShowDeleteConversationDialog] = useState(false);

    const onBlockUserClicked: () => Promise<void> = () => {
      let UID = user.getUid();
      return new Promise(async (resolve, reject) => {
        CometChat.blockUsers([UID]).then(
          list => {
            user.setBlockedByMe(true);
            CometChatUserEvents.ccUserBlocked.next(user);
            toastTextRef.current = "User has been blocked.";
            setShowToast(true);
            return resolve();
          }, error => {
            console.log("Blocking user fails with error", error);
            return reject();
          }
        )
      })
    }

    const onUnblockUserClicked = () => {
      let UID = user.getUid();
      CometChat.unblockUsers([UID]).then(
        list => {
          setActionItems([{
            "name": "block",
            "icon": "/assets/icons/block.svg"
          }, {
            "name": "Delete Chat",
            "icon": "/assets/icons/deleteicon.svg"
          }]);
          user.setBlockedByMe(false);
          CometChatUserEvents.ccUserUnblocked.next(user);
        }, error => {
          console.log("Blocking user fails with error", error);
        }
      );
    }

    const onDeleteConversationClicked: () => Promise<void> = () => {
      let UID = user.getUid();
      return new Promise(async (resolve, reject) => {
        CometChat.deleteConversation(UID, "user").then(
          deletedConversation => {
            setSelectedItem(undefined);
            setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
            CometChatConversationEvents.ccConversationDeleted.next((selectedItem as Conversation)!);
            toastTextRef.current = "Chat deleted successfully.";
            setShowToast(true);
            return resolve();
          }, error => {
            console.log('error while deleting a conversation', error);
            setSelectedItem(undefined);
            setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
            CometChatConversationEvents.ccConversationDeleted.next((selectedItem as Conversation)!);
            toastTextRef.current = "Chat deleted successfully.";
            setShowToast(true);
            return reject();
          }
        );
      })
    }

    const onUserActionClick = (item: {
      name: string;
      icon: string;
    }) => {
      if (item.name == "Block") {
        setShowBlockUserDialog(true);
      } else if (item.name == "Unblock") {
        onUnblockUserClicked();
      } else if (item.name == "Delete Chat") {
        setShowDeleteConversationDialog(true);
      }
    }

    const subscribeToEvents = () => {
      const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe(user => {
        if (user.getBlockedByMe()) {
          setShowStatus(false);
          setActionItems([{
            "name": "Unblock",
            "icon": "/assets/icons/block.svg"
          }, {
            "name": "Delete",
            "icon": "/assets/icons/deleteicon.svg"
          }]);
        }
        updateUserAfterBlockUnblock(user);
      });
      const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe(user => {
        if (!user.getBlockedByMe()) {
          setShowStatus(true);
          setActionItems([{
            "name": "Block",
            "icon": "/assets/icons/block.svg"
          }, {
            "name": "Delete Chat",
            "icon": "/assets/icons/deleteicon.svg"
          }]);
        }
        updateUserAfterBlockUnblock(user);
      });

      return () => {
        ccUserBlocked?.unsubscribe();
        ccUserUnblocked?.unsubscribe();
      };
    };

    useEffect(() => {
      if (user.getHasBlockedMe() || user.getBlockedByMe()) {
        setShowStatus(false);
      }
      const unsubscribeFromEvents = subscribeToEvents();
      return () => {
        unsubscribeFromEvents();
      };
    }, [subscribeToEvents, selectedItem]);

    const onHide = () => setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });

    const getDeleteConversationConfirmationView = () => {
      return <>
        <div className="cometchat-delete-chat-dialog__backdrop">
          <CometChatConfirmDialog
            title={"Delete Chat"}
            messageText={"Are you sure you want to delete this chat? This action cannot be undone."}
            confirmButtonText={"Delete"}
            onCancelClick={() => {
              setShowDeleteConversationDialog(!showDeleteConversationDialog)
            }}
            onSubmitClick={onDeleteConversationClicked} />
        </div>
      </>
    }

    const getBlockUserConfirmationDialogView = () => {
      return <>
        <div className="cometchat-block-user-dialog__backdrop">
          <CometChatConfirmDialog
            title={"Block this contact?"}
            messageText={"Are you sure you want to block this contact? You won't receive messages from them anymore."}
            confirmButtonText={"Block"}
            onCancelClick={() => {
              setShowBlockUserDialog(!showBlockUserDialog);
            }}
            onSubmitClick={onBlockUserClicked} />
        </div>
      </>
    }

    return (
      <>
        {showDeleteConversationDialog && getDeleteConversationConfirmationView()}
        {showBlockUserDialog && getBlockUserConfirmationDialogView()}
        <CometChatUserDetails
          user={user}
          actionItems={actionItems}
          onHide={onHide}
          showStatus={showStatus}
          onUserActionClick={onUserActionClick}
        />
      </>
    )
  }
  interface ActionItem {
    name: string;
    icon: string;  // assuming the icon is a string, you can adjust based on the actual type (e.g., JSX.Element)
    type: 'scope' | 'alert'; // You can list the valid types here
    onClick: () => void;  // Function that triggers the action
    isAllowed: () => boolean; // Function that checks if the action is allowed
  }

  const SideComponentGroup = (props: { group: CometChat.Group }) => {
    const [groupTab, setGroupTab] = useState("view");
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [showLeaveGroup, setShowLeaveGroup] = useState(false);
    const [showTransferownershipDialog, setShowTransferownershipDialog] = useState(false);
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);
    const [showTransferOwnership, setShowTransferOwnership] = useState(false);
    const [showDeleteGroupChatDialog, setShowDeleteGroupChatDialog] = useState(false);
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [scopeChanged, setScopeChanged] = useState(false);
    const { group } = props;
    const groupListener = "groupinfo_GroupListener_" + String(Date.now())
    useEffect(() => {
      CometChat.addGroupListener(groupListener, new CometChat.GroupListener({
        onGroupMemberScopeChanged: (
          message: CometChat.Action,
          changedUser: CometChat.GroupMember,
          newScope: CometChat.GroupMemberScope,
          oldScope: CometChat.GroupMemberScope,
          changedGroup: CometChat.Group
        ) => {
          if (changedGroup.getGuid() !== group?.getGuid()) {
            return;
          }
          if (changedUser.getUid() == loggedInUser?.getUid()) {
            setGroup(changedGroup)
            setScopeChanged(true);
          }
        },
      }))
    }, [group])
    useEffect(() => {
      setActionItems([
        {
          "name": "Add Members",
          "icon": "/assets/icons/addMembers.svg",
          "type": "scope",
          onClick: () => {
            setShowAddMembers(!showAddMembers)
          },
          isAllowed: () => {
            return isAdminOrOwner();
          }
        }, {
          "name": "Delete Chat",
          "icon": "/assets/icons/deleteicon.svg",
          "type": "alert",
          onClick: () => {
            setShowDeleteGroupChatDialog(true);
          },
          isAllowed: () => {
            return true;
          }
        }, {
          "name": "Leave",
          "icon": "/assets/icons/leaveGroup.svg",
          "type": "alert",
          onClick: () => {
            if (group.getOwner() == CometChatUIKitLoginListener.getLoggedInUser()?.getUid()) {
              setShowTransferownershipDialog(!showTransferownershipDialog)
            }
            else {
              setShowLeaveGroup(!showLeaveGroup)
            }
          },
          isAllowed: () => {
            return group.getMembersCount() > 1 || (group.getMembersCount() == 1 && loggedInUser?.getUid() !== group.getOwner())
          }
        }, {
          "name": "Delete and Exit",
          "icon": "/assets/icons/delete.svg",
          "type": "alert",
          onClick: () => {
            setShowDeleteGroup(!showDeleteGroup)
          },
          isAllowed: () => {
            return isAdminOrOwner();
          }
        }
      ])
    }, [scopeChanged, group])


    const isAdminOrOwner = () => {
      return group.getScope() == CometChatUIKitConstants.groupMemberScope.admin || group.getScope() == CometChatUIKitConstants.groupMemberScope.owner;
    }

    function transferOwnershipDialogView() {
      return <>
        <div className="cometchat-transfer-ownership-dialog__backdrop">
          <CometChatConfirmDialog title={"Ownership Transfer"} messageText={"Are you sure you want to transfer ownership? This can't be undone, and the new owner will take full control."} confirmButtonText={"Continue"} onCancelClick={() => {
            setShowTransferownershipDialog(!showTransferownershipDialog)
          }} onSubmitClick={
            () => {
              return new Promise((resolve, reject) => {
                setShowTransferownershipDialog(!showTransferownershipDialog)
                setShowTransferOwnership(!showTransferOwnership)
                return resolve()
              })
            }
          } />
        </div>
      </>
    }
    function transferOwnershipView() {
      return <>
        <div className="cometchat-transfer-ownership__backdrop">
          <CometChatTransferOwnership group={group} onClose={() => {
            setShowTransferOwnership(!showTransferOwnership)
          }} />
        </div>
      </>
    }
    function addMembersView() {
      return <>
        <div style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0
        }}>
          <CometChatAddMembers showBackButton={true} onBack={() => {
            setShowAddMembers(!showAddMembers)
          }} group={group} />

        </div>
      </>
    }
    function deleteGroupView() {
      return <>
        <div className="cometchat-delete-group__backdrop">
          <CometChatConfirmDialog title={"Delete and Exit"} messageText={"Are you sure you want to delete this chat and exit the group? This action cannot be undone."} confirmButtonText="Delete & Exit" onCancelClick={() => {
            setShowDeleteGroup(!showDeleteGroup)
          }} onSubmitClick={
            () => {
              return new Promise((resolve, reject) => {
                CometChat.deleteGroup(group.getGuid()).then(() => {
                  setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } })
                  setSelectedItem(undefined);
                  CometChatGroupEvents.ccGroupDeleted.next(CometChatUIKitUtility.clone(group));
                  setShowDeleteGroup(!showDeleteGroup)
                  CometChatConversationEvents.ccConversationDeleted.next((selectedItem as Conversation)!)
                  toastTextRef.current = "You have left the group and chat has been deleted.";
                  setShowToast(true);
                  return resolve()
                }).catch(() => {
                  return reject()
                })
              }
              )
            }
          } />
        </div>
      </>
    }
    const createGroupMemberLeftActionMessage = useCallback((group: CometChat.Group, loggedInUser: CometChat.User): CometChat.Action => {
      const action = CometChatUIKitConstants.groupMemberAction.LEFT;
      const actionMessage = new CometChat.Action(
        group.getGuid(),
        CometChatUIKitConstants.MessageTypes.groupMember,
        CometChatUIKitConstants.MessageReceiverType.group,
        CometChatUIKitConstants.MessageCategory.action as CometChat.MessageCategory
      );
      actionMessage.setAction(action);
      actionMessage.setActionBy(CometChatUIKitUtility.clone(loggedInUser));
      actionMessage.setActionFor(CometChatUIKitUtility.clone(group));
      actionMessage.setActionOn(CometChatUIKitUtility.clone(loggedInUser));
      actionMessage.setReceiver(CometChatUIKitUtility.clone(group));
      actionMessage.setSender(CometChatUIKitUtility.clone(loggedInUser));
      actionMessage.setConversationId("group_" + group.getGuid());
      actionMessage.setMuid(CometChatUIKitUtility.ID());
      actionMessage.setMessage(`${loggedInUser.getName()} ${action} ${loggedInUser.getUid()}`);
      actionMessage.setSentAt(CometChatUIKitUtility.getUnixTimestamp());
      return actionMessage;
    }, []);
    function leaveGroupView() {
      return <>
        <div className="cometchat-leave-group__backdrop">
          <CometChatConfirmDialog title={"Leave this group?"} messageText={"Are you sure you want to leave this group? You won't receive any more messages from this chat."} confirmButtonText={"Leave"} onCancelClick={() => {
            setShowLeaveGroup(!showLeaveGroup)
          }} onSubmitClick={
            () => {
              return new Promise((resolve, reject) => {
                CometChat.leaveGroup(group.getGuid()).then(() => {
                  let loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
                  if (loggedInUser) {
                    const groupClone = CometChatUIKitUtility.clone(group);
                    groupClone.setHasJoined(false);
                    CometChatGroupEvents.ccGroupLeft.next({
                      userLeft: CometChatUIKitUtility.clone(loggedInUser),
                      leftGroup: groupClone,
                      message: createGroupMemberLeftActionMessage(groupClone, loggedInUser)
                    });
                  }
                  setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } })
                  setSelectedItem(undefined);
                  setShowLeaveGroup(!showLeaveGroup);
                  toastTextRef.current = "You have left the group.";
                  setShowToast(true);
                  return resolve()
                }).catch(() => {
                  return reject();
                })
              })

            }
          } />
        </div>
      </>
    }

    const onDeleteGroupConversationClicked: () => Promise<void> = () => {
      const GUID = group.getGuid();
      return new Promise(async (resolve, reject) => {
        CometChat.deleteConversation(GUID, CometChatUIKitConstants.MessageReceiverType.group).then(
          deletedConversation => {
            setSelectedItem(undefined);
            setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
            CometChatConversationEvents.ccConversationDeleted.next((selectedItem as Conversation)!);
            return resolve();
          }, error => {
            console.log('error while deleting a conversation', error);
            return reject();
          }
        );
      });
    }

    const getDeleteConversationConfirmationView = () => {
      return <>
        <div className="cometchat-delete-chat-dialog__backdrop">
          <CometChatConfirmDialog
            title={"Delete Chat"}
            messageText={"Are you sure you want to delete this chat? This action cannot be undone."}
            confirmButtonText={"Delete"}
            onCancelClick={() => {
              setShowDeleteGroupChatDialog(!showDeleteGroupChatDialog)
            }}
            onSubmitClick={onDeleteGroupConversationClicked} />
        </div>
      </>
    }



    return (
      <>
        <div className="side-component-header">
          <div className="side-component-header__text">{"Group Info"}</div>
          <div className="side-component-header__icon" onClick={() => setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } })} />
        </div>
        <div className="side-component-content">
          <div className="side-component-content__group">
            <div className="side-component-content__avatar">
              <CometChatAvatar
                image={group?.getIcon()}
                name={group?.getName()}
              />
            </div>
            <div>
              <div className="side-component-content__title">
                {group?.getName()}
              </div>
              <div className="side-component-content__description">
                {group?.getMembersCount?.() + " " + "Members"}
              </div>
            </div>
          </div>

          <div className="side-component-content__action">
            {actionItems.map((actionItem, index) => (
              actionItem.isAllowed() ? <div key={actionItem.name + index} className="side-component-content__action-item" onClick={() => {
                if (actionItem.onClick) {
                  actionItem.onClick()
                }
              }}>
                <div
                  className={actionItem.type === "alert" ? "side-component-content__action-item-icon" : "side-component-content__action-item-icon-default"}
                  style={actionItem.icon ? { WebkitMask: `url(${actionItem.icon}), center, center, no-repeat` } : undefined}
                />
                <div className={actionItem.type === "alert" ? "side-component-content__action-item-text" : "side-component-content__action-item-text-default"} >
                  {actionItem.name}
                </div>
              </div> : null
            ))}
          </div>
          {group.getScope() != CometChatUIKitConstants.groupMemberScope.participant ? <div className="side-component-group-tabs-wrapper">
            <div className="side-component-group-tabs">
              <div
                className={`side-component-group-tabs__tab ${groupTab === "view" ? "side-component-group-tabs__tab-active" : ""}`}
                onClick={() => setGroupTab("view")}
              >
                <div className={`side-component-group-tabs__tab-text ${groupTab === "view" ? "side-component-group-tabs__tab-text-active" : ""}`}>
                  {"View Members"}
                </div>
              </div>
              <div
                className={`side-component-group-tabs__tab ${groupTab === "banned" ? "side-component-group-tabs__tab-active" : ""}`}
                onClick={() => { setGroupTab("banned") }}
              >
                <div className={`side-component-group-tabs__tab-text ${groupTab === "banned" ? "side-component-group-tabs__tab-text-active" : ""}`}>
                  {"Banned Members"}
                </div>
              </div>
            </div>
          </div> : null}

          <div className={isAdminOrOwner() ? "side-component-group-members-with-tabs" : "side-component-group-members"}>
            {groupTab === "view" ?
              <CometChatGroupMembers group={group} />
              : groupTab === "banned" ?
                <CometChatBannedMembers group={group} />
                : null
            }
          </div>
        </div>
        {showDeleteGroupChatDialog && getDeleteConversationConfirmationView()}
        {showAddMembers && group ? addMembersView() : null}
        {
          showLeaveGroup ? leaveGroupView() : null}
        {
          showDeleteGroup ? deleteGroupView() : null}
        {
          showTransferOwnership ? transferOwnershipView() : null}
        {
          showTransferownershipDialog ? transferOwnershipDialogView() : null}
      </>
    )
  }

  const SideComponentThread = (props: ThreadProps) => {
    const {
      message
    } = props;

    const [requestBuilderState, setRequestBuilderState] = useState<MessagesRequestBuilder>();
    const [showComposer, setShowComposer] = useState(true);

    const requestBuilder = useCallback(() => {
      const threadMessagesBuilder = new CometChat.MessagesRequestBuilder()
        .setCategories(CometChatUIKit.getDataSource().getAllMessageCategories())
        .setTypes(CometChatUIKit.getDataSource().getAllMessageTypes())
        .hideReplies(true)
        .setLimit(20)
        .setParentMessageId(message.getId());
      setRequestBuilderState(threadMessagesBuilder);
    }, [message]);

    useEffect(() => {
      requestBuilder();
      let isUser = selectedItem instanceof CometChat.User;
      if (isUser && (selectedItem as CometChat.User)?.getBlockedByMe()) {
        setShowComposer(false);
      }
      const ccUserBlocked = CometChatUserEvents.ccUserBlocked.subscribe(user => {
        if (user.getBlockedByMe()) {
          setShowComposer(false);
        }
        updateUserAfterBlockUnblock(user);
      });
      const ccUserUnblocked = CometChatUserEvents.ccUserUnblocked.subscribe(user => {
        if (!user.getBlockedByMe()) {
          setShowComposer(true);
        }
        updateUserAfterBlockUnblock(user);
      });

      return () => {
        ccUserBlocked?.unsubscribe();
        ccUserUnblocked?.unsubscribe();
      }
    }, [message]);

    const onClose = () => setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } })

    return (
      <CometChatThreadedMessages
        message={message}
        requestBuilderState={requestBuilderState}
        selectedItem={selectedItem}
        onClose={onClose}
        showComposer={showComposer}

      />
    );
  }

  useEffect(() => {
    if (newChat) {
      const convId = newChat.user?.getUid() || newChat.group?.getGuid();
      const convType = newChat.user ? CometChatUIKitConstants.MessageReceiverType.user : CometChatUIKitConstants.MessageReceiverType.group;
      CometChat.getConversation(convId!, convType).then(
        (conversation) => {
          setSelectedItem(conversation);
        },
        (error) => {
          setSelectedItem(undefined);
        }
      );
    }
  }, [newChat, newChat?.user, newChat?.group]);


  useEffect(() => {
    const res = dispatch(getKeywordList({ start: 0, limit: -1 }));
  }, [])
  const { keywordList } = useSelector((store: RootState) => store?.keyword);

  useEffect(() => {

    const handleMessageEvent = (data: any) => {
      if (data.status === 1) {
        const message = data?.message?.text;
        const is_group = data?.message?.receiverType === "group" ? 1 : 0;
        const received_by = data?.message?.receiverId;
        const date_time = new Date().toString();
        const receiver_name = data?.message?.receiver?.name;
        const getMatchingWord: string[] = checkMatchingKeyWords(
          keywordList,
          message
        );

        const payload = {
          received_by,
          is_group,
          keywords: getMatchingWord.join(","),
          message,
          date_time,
          receiver_name
        };

        if (getMatchingWord?.length > 0) {
          dispatch(postKeywordMail(payload)).then((res) => {
            if (res?.payload?.data?.status !== 1) {
              // toast.error(res?.payload?.data?.message);
            }
          });
        }
      }
    };

    // Subscribe to message sent event
    const ccMessageSentEvent = CometChatMessageEvents.ccMessageSent.subscribe(handleMessageEvent);

    // Subscribe to message edited event
    const ccMessageEditedEvent = CometChatMessageEvents.ccMessageEdited.subscribe(handleMessageEvent);

    return () => {
      ccMessageSentEvent.unsubscribe();
      ccMessageEditedEvent.unsubscribe();
    };
  }, [keywordList]);




  const onSelectorItemClicked = (e: Conversation | User | Group | Call, type: string) => {
    setShowNewChat(false);
    if (type === "updateSelectedItemGroup" && !(e as Group).getHasJoined()) {
      if ((e as Group).getType() === CometChatUIKitConstants.GroupTypes.public) {
        CometChat.joinGroup((e as Group).getGuid(), (e as Group).getType() as GroupType)
          .then((response: any) => {
            setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
            setNewChat(undefined);
            response.setHasJoined?.(true);
            response.setScope?.(CometChatUIKitConstants.groupMemberScope.participant);
            setSelectedItem(response as Group);
            setAppState({ type, payload: response });
            setTimeout(() => {
              CometChatGroupEvents.ccGroupMemberJoined.next({
                joinedGroup: response,
                joinedUser: loggedInUser!
              })
            }, 100)
          })
          .catch((error: unknown) => {
            console.log(error);
          });
      } else {
        setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
        setNewChat(undefined);
        setGroup(e as Group);
        setAppState({ type, payload: e });
        showJoinGroupRef.current = true;
      }
    } else {
      setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
      setNewChat(undefined);
      setAppState({ type, payload: e });
      setSelectedItem(activeTab === "chats" ? e as Conversation : activeTab === "users" ? e as User : activeTab === "groups" ? e as Group : activeTab === "calls" ? e as Call : undefined);
    }
  }

  const subscribeToEvents = useCallback(() => {
    const ccConversationDeleted = CometChatConversationEvents.ccConversationDeleted.subscribe((conversation: Conversation) => {
      if (newChat?.user && conversation.getConversationType() === CometChatUIKitConstants.MessageReceiverType.user) {
        if ((conversation.getConversationWith() as User).getUid() === newChat.user.getUid()) {
          setNewChat(undefined);
          setAppState({ type: "newChat", payload: undefined });
          setSelectedItem(undefined);
          setAppState({ type: "updateSelectedItem", payload: undefined });
        }
      } else if (newChat?.group && conversation.getConversationType() === CometChatUIKitConstants.MessageReceiverType.group) {
        if ((conversation.getConversationWith() as Group).getGuid() === newChat.group.getGuid()) {
          setNewChat(undefined);
          setAppState({ type: "newChat", payload: undefined });
          setSelectedItem(undefined);
          setAppState({ type: "updateSelectedItem", payload: undefined });
        }
      } else {
        if ((selectedItem as CometChat.Conversation)?.getConversationId?.() === conversation?.getConversationId?.()) {
          setSelectedItem(undefined);
          setAppState({ type: "updateSelectedItem", payload: undefined });
        }
      }
    })

    const ccOpenChat = CometChatUIEvents.ccOpenChat.subscribe((item) => {
      openChatForUser(item.user);
    })

    const ccClickEvent = CometChatUIEvents.ccMouseEvent.subscribe((mouseevent: IMouseEvent) => {
      if (mouseevent.event.type === "click" && (mouseevent.body as { CometChatUserGroupMembersObject: User })?.CometChatUserGroupMembersObject) {
        openChatForUser((mouseevent.body as { CometChatUserGroupMembersObject: User })?.CometChatUserGroupMembersObject);
      }
    })

    const openChatForUser = (user?: User) => {
      const uid = user?.getUid();
      if (uid) {
        setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
        if (activeTab === "chats") {
          CometChat.getConversation(uid!, CometChatUIKitConstants.MessageReceiverType.user).then(
            (conversation) => {
              setNewChat(undefined);
              setSelectedItem(conversation);
              setAppState({ type: "updateSelectedItem", payload: conversation });
            },
            (error) => {
              setNewChat({ user, group: undefined });
              setSelectedItem(undefined);
            }
          );
        } else if (activeTab === "users") {
          setNewChat(undefined);
          setSelectedItem(user);
          setAppState({ type: "updateSelectedItemUser", payload: user });
        } else if (activeTab === "groups") {
          setNewChat({ user, group: undefined });
          setSelectedItem(undefined);
        }
      }
    }

    return () => {
      ccConversationDeleted?.unsubscribe();
      ccOpenChat?.unsubscribe();
      ccClickEvent?.unsubscribe();
    };
  }, [newChat, selectedItem]);

  const attachSDKGroupListener = () => {
    const listenerId = "BannedOrKickedMembers_GroupListener_" + String(Date.now());
    CometChat.addGroupListener(
      listenerId,
      new CometChat.GroupListener({
        onGroupMemberBanned: (
          message: CometChat.Action,
          kickedUser: CometChat.User,
          kickedBy: CometChat.User,
          kickedFrom: CometChat.Group
        ) => {
          if (((selectedItem as Group).getGuid?.() === kickedFrom.getGuid() || ((selectedItem as Conversation).getConversationWith?.() as Group)?.getGuid?.() === kickedFrom.getGuid()) && kickedUser.getUid() === loggedInUser?.getUid()) {
            setShowAlertPopup({ visible: true, description: "Banned" });
          }
        },
        onGroupMemberKicked: (
          message: CometChat.Action,
          kickedUser: CometChat.User,
          kickedBy: CometChat.User,
          kickedFrom: CometChat.Group
        ) => {
          if (((selectedItem as Group).getGuid?.() === kickedFrom.getGuid() || ((selectedItem as Conversation).getConversationWith?.() as Group)?.getGuid?.() === kickedFrom.getGuid()) && kickedUser.getUid() === loggedInUser?.getUid()) {
            setShowAlertPopup({ visible: true, description: "kicked" });
          }
        },

      })
    );
    return () => CometChat.removeGroupListener(listenerId);
  }

  useEffect(() => {
    if (loggedInUser) {
      const unsubscribeFromEvents = subscribeToEvents();
      const unsubscribeFromGroupEvents = attachSDKGroupListener();
      return () => {
        unsubscribeFromEvents();
        unsubscribeFromGroupEvents();
      };
    }
  }, [loggedInUser, subscribeToEvents, attachSDKGroupListener]);

  const removedFromGroup = () => {
    setShowAlertPopup({ visible: false, description: "" });
    setSelectedItem(undefined);
    setAppState({ type: "updateSelectedItem", payload: undefined });
    setAppState({ type: "updateSideComponent", payload: { visible: false, type: "" } });
  }
  function closeToast() {
    setShowToast(false);
  }

  const getActiveItem = () => {
    if ((activeTab === "chats" && selectedItem instanceof CometChat.Conversation) ||
      (activeTab === "users" && selectedItem instanceof CometChat.User) ||
      (activeTab === "groups" && selectedItem instanceof CometChat.Group) ||
      (activeTab === 'calls' && selectedItem instanceof CallLog)
    ) {
      return selectedItem;
    } else {
      return undefined;
    }
  }


  useEffect(() => {
    const handleCleanup = async () => {
      const activeCall = await CometChat.getActiveCall();
      if (activeCall) {
        const sessionID = activeCall.getSessionId();
        await CometChat.endCall(sessionID);
        CometChat.clearActiveCall();

      }
    };
    window.addEventListener("beforeunload", handleCleanup);

    return () => {
      handleCleanup();
      window.removeEventListener("beforeunload", handleCleanup);
    };
  }, []);



  return (
    loggedInUser && <div className={`cometchat-root ${location.pathname.includes("/projects") ? "project-page" : ""}`} data-theme="light">
      {showAlertPopup.visible &&
        <CometChatAlertPopup
          onConfirmClick={removedFromGroup}
          title={"You are no longer part of the group"}
          description={`You have been  ${showAlertPopup.description} from this group by the administrator.`}
        />}
      <div className='conversations-wrapper'>
        <div className='selector-wrapper'>
          {<CometChatSelector
            activeItem={getActiveItem()}
            activeTab={activeTab}
            group={group}
            setSelectedItem={setSelectedItem}
            onProtectedGroupJoin={(group) => setSelectedItem(group)}
            onSelectorItemClicked={onSelectorItemClicked}
            setShowCreateGroup={setShowCreateGroup}
            showCreateGroup={showCreateGroup}
            showJoinGroup={showJoinGroupRef.current}
            onHide={() => showJoinGroupRef.current = false}
            onNewChatClicked={() => {
              setShowNewChat(true);
              setAppState({ type: "updateSideComponent", payload: { type: "", visible: false } });
            }}
            onGroupCreated={(group) => setSelectedItem(group)}
          />}
        </div>
        <TabComponent />
      </div>
      <div className='messages-wrapper'>
        <InformationComponent />
      </div>
      <SideComponent />
      <CometChatIncomingCall />
      {showToast ? <CometChatToast text={toastTextRef.current} onClose={closeToast} /> : null}
    </div>
  )
}

export { CometChatHome };