// import { CometChat } from "@cometchat/chat-sdk-javascript";
// import {
//   CometChatConversations,
//   CometChatGroups,
//   CometChatMessages,
//   CometChatTabs,
//   CometChatUsersWithMessages,
//   TabsStyle,
// } from "@cometchat/chat-uikit-react";
// // import {
// //   CometChatConversationEvents,
// //   CometChatGroupEvents,
// //   CometChatTabItem,
// //   TabAlignment,
// // } from "@cometchat/uikit-resources";
// // import {
// //   AddMembersConfiguration,
// //   DetailsConfiguration,
// //   MessageComposerConfiguration,
// //   MessagesConfiguration,
// //   TabItemStyle,
// //   UsersConfiguration,
// // } from "@cometchat/uikit-shared";
// import { getChatBoardData } from "app/store/Projects";
// import chatsTabIcon from "public/assets/icons/chat.svg";
// import groupsTabIcon from "public/assets/icons/groupIcon.svg";
// import { ProjectPlusIcon } from "public/assets/icons/projectsIcon";
// import usersTabIcon from "public/assets/icons/user.svg";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useParams } from "react-router";
// import { CreateGroupWrapper } from "src/app/components/chatBoard/CreateGroup";
// import { getUserDetail } from "src/utils";
// import EmptyChat from "../../chatBoard/EmptyChat";

// function ChatBoard() {
//   const [users, setUsersList] = useState([]);
//   const [convUsersList, setConvUsersList] = useState([]);
//   const [addGroup, setAddGroup] = useState(false);
//   const [groupDetails, setGroupDetails] = useState<any>({});
//   const [conversationDetails, setConversationDetails] = useState<any>({});
//   const [chatDetails, setChatDetails] = useState<any>({});
//   const client_id = getUserDetail();
//   const { id } = useParams<{ id: string }>();

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const newGroupDetails = groupDetails;
//     const newChatDetails = chatDetails;
//     const ccConvDelete =
//       CometChatConversationEvents?.ccConversationDeleted?.subscribe(
//         (conversation) => {
//           if (
//             conversation.getConversationId() === newChatDetails.conversationId
//           ) {
//             setChatDetails({});
//           }

//           if (
//             conversation.getConversationId() ===
//             conversationDetails.conversationId
//           ) {
//             setConversationDetails({});
//           }
//         }
//       );

//     const ccGroupDelete = CometChatGroupEvents?.ccGroupDeleted?.subscribe(
//       (group) => {
//         if (group.getGuid() === newGroupDetails.guid) {
//           setGroupDetails({});
//         }

//         if (group.getGuid() === newChatDetails.conversationWith.guid) {
//           setChatDetails({});
//         }
//       }
//     );

//     return () => {
//       ccConvDelete?.unsubscribe();
//       ccGroupDelete?.unsubscribe();
//     };
//   }, [groupDetails, chatDetails]);

//   useEffect(() => {
//     if (id && client_id?.id) {
//       dispatch(getChatBoardData(id))
//         .unwrap()
//         .then((res) => {
//           if (res?.data && res?.data?.data) {
//             setUsersList([...res?.data?.data.map((d) => d.toString())]);

//             const list = res?.data?.data.map(
//               (data) => client_id.id + "_user_" + data.toString()
//             );
//             const newList = res?.data?.data.map(
//               (data) => data.toString() + "_user_" + client_id.id
//             );
//             setConvUsersList([...list, ...newList]);
//           }
//         });
//     }
//   }, [id]);

//   const checkElements = () => {
//     const elements = document.getElementsByTagName("cometchat-list-item");
//     for (const iterator of elements) {
//       if (iterator.id.includes("_user_")) {
//         if (!convUsersList.includes(iterator.id)) {

//           iterator.parentElement.style.display = "none";
//         } else {
//           iterator.parentElement.style.display = "";
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     if (users && users.length > 0) {
//       checkElements();
//     }
//   }, [users]);

//   const [isMobileView, setIsMobileView] = useState(false);
//   const tabItemStyle = new TabItemStyle({
//     iconTint: "#4F46E5",
//     width: "60px",
//     height: "60px",
//     activeBackground: "#4F46E5",
//     activeIconTint: "white",
//     activeTitleTextColor: "white",
//   });

//   const tStyle = new TabsStyle({
//     background: "#fff",
//     tabPaneHeight: "100%",
//     tabPaneWidth: "100%",
//   });

//   useEffect(() => {
//     window.addEventListener("click", (e) => {
//       if (
//         e &&
//         e.target &&
//         //@ts-ignore
//         e.target?.tagName &&
//         //@ts-ignore
//         e.target?.tagName === "COMETCHAT-ICON-BUTTON"
//       ) {
//         setTimeout(() => {
//           checkElements();
//         }, 500);
//       }
//     });
//     return () => {
//       window.removeEventListener("click", () => { });
//     };
//   }, []);

//   const chatsTab = new CometChatTabItem({
//     id: "chats",
//     title: "Chats",
//     iconURL: chatsTabIcon,
//     style: tabItemStyle,
//     isActive: true,
//     childView: (
//       <div className="flex h-[calc(100vh-230px)] viewChatBoard">
//         <button className="hidden h-1" onClick={checkElements}></button>
//         <div className="w-[279px]">
//           <CometChatConversations
//             onItemClick={(group) => setChatDetails(group)}
//             avatarStyle={{ borderRadius: "50%" }}
//             listItemStyle={{ height: '60px' }}
//           />
//         </div>

//         {chatDetails && chatDetails.conversationId ? (
//           <div className="w-[calc(100%-279px)]">
//             {chatDetails.conversationType === "user" ? (
//               <CometChatMessages
//                 user={chatDetails?.conversationWith}
//                 messageComposerConfiguration={
//                   new MessageComposerConfiguration({
//                     disableMentions: true,
//                   })
//                 }
//               />
//             ) : (
//               <CometChatMessages
//                 group={chatDetails?.conversationWith}
//                 detailsConfiguration={
//                   new DetailsConfiguration({
//                     addMembersConfiguration: new AddMembersConfiguration({
//                       usersRequestBuilder: new CometChat.UsersRequestBuilder()
//                         .setLimit(100)
//                         .setUIDs([...users]),
//                     }),
//                   })
//                 }
//               />
//             )}
//           </div>
//         ) : (
//           <EmptyChat />
//         )}
//       </div>
//     ),
//   });

//   const usersTab = new CometChatTabItem({
//     id: "users",
//     title: "Users",
//     iconURL: usersTabIcon,
//     style: tabItemStyle,
//     childView: (
//       <div className="flex h-[calc(100vh-230px)] viewChatBoard">
//         <div className="w-[279px]">
//           <CometChatUsersWithMessages
//             isMobileView={isMobileView}
//             usersConfiguration={
//               new UsersConfiguration({
//                 usersRequestBuilder: new CometChat.UsersRequestBuilder()
//                   .setLimit(100)
//                   .setUIDs([...users]),
//                 onItemClick: (conversation) =>
//                   setConversationDetails(conversation),
//                 avatarStyle: { borderRadius: "50%" },

//               })
//             }
//             messagesConfiguration={
//               new MessagesConfiguration({
//                 messageComposerConfiguration: new MessageComposerConfiguration({
//                   disableMentions: true,
//                 }),
//               })
//             }
//           />
//         </div>

//         {conversationDetails && conversationDetails.uid ? (
//           <div className="w-[calc(100%-279px)]">
//             <CometChatMessages
//               user={conversationDetails}
//               messageComposerConfiguration={
//                 new MessageComposerConfiguration({
//                   disableMentions: true,
//                 })
//               }
//             />
//           </div>
//         ) : (
//           <EmptyChat />
//         )}
//       </div>
//     ),
//   });

//   const groupsTab = new CometChatTabItem({
//     id: "groups",
//     title: "Groups",
//     iconURL: groupsTabIcon,
//     style: tabItemStyle,
//     childView: (
//       <div className="flex h-[calc(100vh-230px)] viewChatBoard">
//         {addGroup && (
//           <div className="absolute h-full w-full bg-black bg-opacity-75 z-99">
//             <CreateGroupWrapper
//               isMobileView={isMobileView}
//               onClose={() => setAddGroup(false)}
//             />
//           </div>
//         )}
//         <div className="w-[279px] relative">
//           <button
//             className="btn absolute top-[22px] right-[16px] z-9"
//             onClick={() => setAddGroup(true)}
//           >
//             <ProjectPlusIcon className="text-lg" />
//           </button>

//           <CometChatGroups
//             groupsRequestBuilder={new CometChat.GroupsRequestBuilder()
//               .joinedOnly(true)
//               .setLimit(100)}
//             onItemClick={(group) => setGroupDetails(group)}
//             avatarStyle={{ borderRadius: "50%" }}
//             listItemStyle={{ height: '60px' }}
//           />
//         </div>

//         {groupDetails && groupDetails.guid ? (
//           <div className="w-[calc(100%-279px)]">
//             <CometChatMessages
//               group={groupDetails}
//               detailsConfiguration={
//                 new DetailsConfiguration({
//                   addMembersConfiguration: new AddMembersConfiguration({
//                     usersRequestBuilder: new CometChat.UsersRequestBuilder()
//                       .setLimit(100)
//                       .setUIDs([...users]),
//                   }),
//                 })
//               }
//             />
//           </div>
//         ) : (
//           <EmptyChat />
//         )}
//       </div>
//     ),
//   });

//   const tabs = [chatsTab, usersTab, groupsTab];

//   const resizeWindow = () => {
//     innerWidth = window.innerWidth;
//     if (innerWidth >= 320 && innerWidth <= 767) {
//       setIsMobileView(true);
//     } else {
//       setIsMobileView(false);
//     }
//   };

//   useEffect(() => {
//     resizeWindow();
//     window.addEventListener("resize", resizeWindow);
//     return () => window.removeEventListener("resize", resizeWindow);
//   }, []);

//   return (
//     <div className=" flex gap-20 flex-wrap lg:flex-nowrap h-[calc(100vh-230px)] chatboard viewChatBoard ">
//       <CometChatTabs
//         tabAlignment={TabAlignment.bottom}
//         tabs={tabs}
//         tabsStyle={tStyle}
//       />
//     </div>
//   );
// }

// export default ChatBoard;

import React from 'react'
import { CometChatHome } from 'src/app/pages/chatBoard/ChatBoard'

const ChatBoard = () => {
  return (
    <CometChatHome />
  )
}

export default ChatBoard
