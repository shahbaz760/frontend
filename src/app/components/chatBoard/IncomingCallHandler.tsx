// import { CometChat } from "@cometchat/chat-sdk-javascript";
// import { CometChatCallEvents, CometChatIncomingCall, CometChatSoundManager } from "@cometchat/chat-uikit-react";
// import { useEffect, useState } from "react";

// const IncomingCallHandler = ({ userId }: { userId?: string }) => {
//   const [call, setCall] = useState(null);
//   const [listenerId, setListenerId] = useState("");

//   useEffect(() => {
//     const listenerId = new Date().toUTCString();
//     setListenerId(listenerId);

//     CometChat?.addCallListener(
//       listenerId,
//       new CometChat.CallListener({
//         onIncomingCallReceived: (call) => {
//           if (call && call.callInitiator && call.callInitiator.uid != userId) {
//             setCall(call);
//           }
//         },
//         onIncomingCallRejected: (call) => {
//           setCall(null);
//         },

//         onIncomingCallCancelled: (call) => {
//           setCall(null);
//         },
//       })
//     );

//     return () => {
//       CometChat?.removeCallListener(listenerId);
//     };
//   }, []);

//   useEffect(() => {
//     const soundAccept = CometChatCallEvents?.ccCallAccepted?.subscribe(() => {
//       CometChatSoundManager?.pause()
//     })
//     const soundRejected = CometChatCallEvents?.ccCallRejected?.subscribe(() => {
//       CometChatSoundManager?.pause()
//     })
//     return () => {
//       soundAccept?.unsubscribe()
//       soundRejected?.unsubscribe()
//     }
//   }, []);

//   useEffect(() => {
//     if (!call) {
//       CometChat?.removeCallListener(listenerId);
//     }
//   }, [call]);

//   if (call) {
//     return <CometChatIncomingCall call={call} disableSoundForCalls={false} onError={(e) => console.log("sss", e)} />;
//   }
//   return null;
// };

// export default IncomingCallHandler;

import React from 'react'

const IncomingCallHandler = () => {
  return (
    <div>IncomingCallHandler</div>
  )
}

export default IncomingCallHandler
