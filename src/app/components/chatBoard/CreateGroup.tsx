// import { CometChat } from "@cometchat/chat-sdk-javascript";
// import { CometChatThemeContext } from "@cometchat/chat-uikit-react";
// import { useContext, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// import { getUserDetail } from "src/utils";
// import { createGroupStyle, createGroupWrapperStyle } from "./style";

// type CreateGroupWrapperProps = {
//   isMobileView: boolean;
//   onClose: () => void;
// };

// export function CreateGroupWrapper({
//   isMobileView,
//   onClose,
// }: CreateGroupWrapperProps) {
//   const createGroupRef = useRef<
//     JSX.IntrinsicElements["cometchat-create-group"] | null
//   >(null);
//   const navigate = useNavigate();
//   const client_id = getUserDetail();

//   const { theme } = useContext(CometChatThemeContext);

//   theme.palette.setPrimary({ light: "#4f46e5", dark: "#4f46e5" });

//   useEffect(() => {
//     const createGroupElement = createGroupRef.current;
//     if (!createGroupElement) {
//       return;
//     }

//     const closeClickedEventName = "cc-creategroup-close-clicked";
//     const handleCreateGroup = (e: any) => {
//       const createGroup = {
//         name: e.name,
//         type: e.type,
//         guid: e.guid,
//         tags: [client_id.id.toString()],
//       };
//       if (e.password) {
//         createGroup["password"] = e.password;
//       }
//       CometChat?.createGroup(createGroup).then((res) => {
//         onClose();
//       });
//     };
//     const handleCloseClicked = () => onClose();
//     createGroupElement.createClick = handleCreateGroup;
//     createGroupElement.addEventListener(
//       closeClickedEventName,
//       handleCloseClicked
//     );
//     return () => {
//       createGroupElement.createClick = null;
//       createGroupElement.removeEventListener(
//         closeClickedEventName,
//         handleCloseClicked
//       );
//     };
//   }, [navigate]);

//   return (
//     <div style={createGroupWrapperStyle(theme)}>
//       <cometchat-create-group
//         ref={createGroupRef}
//         type={["PRIVATE"]}
//         createGroupStyle={JSON.stringify({
//           ...createGroupStyle(isMobileView, theme),
//           height: "300px",
//         })}
//       />
//     </div>
//   );
// }
import React from 'react'

const CreateGroup = () => {
  return (
    <div>CreateGroup</div>
  )
}

export default CreateGroup