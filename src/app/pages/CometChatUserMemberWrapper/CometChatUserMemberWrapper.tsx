import { CSSProperties, useContext, useEffect, useState } from 'react';
import { UserMemberListType } from '../Enums/Enums';
import { CometChatUsers } from '../CometChatUsers/CometChatUsers';
import { CometChatGroupMembers } from '../CometChatGroupMembers/CometChatGroupMembers';
import { getUserIdInfo } from 'app/store/Common';
import { useAppDispatch } from 'app/store/store';
import { getUserDetail } from 'src/utils';
import { useLocation, useParams } from 'react-router';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { getChatBoardData } from 'app/store/Projects';


export interface MentionsProps {
  userMemberListType?: UserMemberListType;
  onItemClick?: (user: CometChat.User | CometChat.GroupMember) => void;
  listItemView?: (item?: CometChat.User | CometChat.GroupMember) => JSX.Element
  statusIndicatorStyle?: CSSProperties;
  searchKeyword?: string;
  group?: CometChat.Group;
  subtitleView?: (item?: CometChat.User | CometChat.GroupMember) => JSX.Element;
  usersRequestBuilder?: CometChat.UsersRequestBuilder;
  disableUsersPresence?: boolean;
  hideSeparator?: boolean;
  loadingStateView?: JSX.Element;
  onEmpty?: () => void;
  groupMemberRequestBuilder?: CometChat.GroupMembersRequestBuilder;
  loadingIconUrl?: string;
  disableLoadingState?: boolean,
  onError?: () => void;
}

export function CometChatUserMemberWrapper(props: MentionsProps) {
  const {
    userMemberListType = UserMemberListType.users,
    onItemClick,
    listItemView,
    statusIndicatorStyle,
    searchKeyword,
    group,
    subtitleView,
    usersRequestBuilder,
    loadingStateView,
    onEmpty,
    groupMemberRequestBuilder,
    loadingIconUrl,
    disableLoadingState = false,
    hideSeparator = false,
    onError,
    disableUsersPresence
  } = props;


  const [users, setUsersList] = useState([]);
  const dispatch = useAppDispatch()
  const client_id = getUserDetail();
  const { id } = useParams<{ id: string }>();
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
          }
        });
    }
  }, [client_id?.id]);


  return (
    <>
      {userMemberListType === UserMemberListType.users && (
        <CometChatUsers
          hideSearch={true}
          showSectionHeader={false}
          onItemClick={onItemClick}
          searchKeyword={searchKeyword}
          itemView={listItemView}
          usersRequestBuilder={new CometChat.UsersRequestBuilder().setLimit(30).setUIDs([...users])}
          subtitleView={subtitleView}
          onEmpty={onEmpty}
          onError={onError}
          disableLoadingState={true}
        />
      )}

      {userMemberListType === UserMemberListType.groupmembers && group && (
        <CometChatGroupMembers
          group={group}
          hideSearch={true}
          groupMemberRequestBuilder={groupMemberRequestBuilder}
          onItemClick={onItemClick}
          searchKeyword={searchKeyword}
          itemView={listItemView}
          subtitleView={subtitleView}
          onEmpty={onEmpty}
          trailingView={(entity: CometChat.GroupMember) => { return <></> }}
          onError={onError}
          disableLoadingState={true}
        />
      )}
    </>
  );
}
