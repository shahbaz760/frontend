import { CometChat } from "@cometchat/chat-sdk-javascript";
// import { CometChatMessages } from "@cometchat/chat-uikit-react";
// import {
//   AddMembersConfiguration,
//   DetailsConfiguration,
// } from "@cometchat/uikit-shared";
import { getChatBoardData, getChatGroupDetail } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import { useEffect, useState } from "react";
import { getUserDetail } from "src/utils";

function SupportChat({ id }) {
  const [users, setUsersList] = useState([]);
  const [groupDetails, setGroupDetails] = useState<any>({});
  const dispatch = useAppDispatch();
  const client_id = getUserDetail();

  const fetchGroupDetail = async () => {
    const res = await dispatch(getChatGroupDetail(id));
    const groupData = res?.payload?.data?.data;

    if (groupData) {
      const group = new CometChat.Group(
        groupData.guid,
        groupData.name,
        groupData.type
      );
      group?.setMembersCount(groupData.membersCount);
      setGroupDetails(group);
    }
  };
  useEffect(() => {
    fetchGroupDetail();
  }, []);

  useEffect(() => {
    if (id && client_id?.id) {
      dispatch(getChatBoardData(id))
        .unwrap()
        .then((res) => {
          if (res?.data && res?.data?.data) {
            setUsersList([...res?.data?.data.map((d) => d.toString())]);
          }
        });
    }
  }, [id]);
  return (
    <>
      {groupDetails && groupDetails?.guid && (
        <div
          className="w-full h-[calc(100vh-230px)]  "
          style={{ borderRadius: "1.2rem", overflow: "hidden", border: "none" }}
        >
          {/* <CometChatMessages
            group={groupDetails}
            detailsConfiguration={
              new DetailsConfiguration({
                addMembersConfiguration: new AddMembersConfiguration({
                  usersRequestBuilder: new CometChat.UsersRequestBuilder()
                    .setLimit(100)
                    .setUIDs([...users]),
                }),
              })
            }
          /> */}
        </div>
      )}
    </>
  );
}

export default SupportChat;
