import { Divider, Typography } from "@mui/material";
import { getCustomChatMessage } from "app/store/customChatBox";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatInputBox from "./ChatInputBox";
import ChatTextBox from "./ChatTextBox";
import styles from "./customChat.module.scss";
import { NoDataFound } from "public/assets/icons/common";
import ListLoading from "@fuse/core/ListLoading";

const CustomChat = ({ taskId, chatList, setChatList }) => {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null); // Scrollable container (messageContainer)
  const { chats, isAddLoadingChats, total_length, status } = useSelector(
    (store: any) => store.customChat
  );

  const dispatch = useDispatch();

  // Function to fetch chat messages
  const fetchChatMessages = useCallback(async () => {
    if (!taskId) return; // Early return if taskId is not available

    const payload = {
      start: page,
      limit: 10,
      task_id: taskId,
    };

    try {
      const res = await dispatch(getCustomChatMessage(payload));
      const details = res?.payload?.data?.data?.list
      if (res) {
        // Assuming `res` contains the chat messages
        // Uncomment and use the line below to update your chat list if needed
        setChatList(details);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [page, taskId, dispatch]);

  // Fetch initial messages
  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  // Scroll to the bottom whenever chatList is updated
  const scrollToBottom = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  // Update chat list on page or chats change, without duplication
  useEffect(() => {
    if (Array.isArray(chats)) {
      setChatList((prevChats) => {
        const newChats = chats?.filter(
          (chat) => !prevChats?.some((prevChat) => prevChat.id === chat.id)
        );
        return [...newChats, ...prevChats];
      });
      // Scroll to bottom whenever the chat list is updated
    }
  }, [chats, setChatList]);

  // Fetch more messages when the user scrolls to the top
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // Check if the user has scrolled to the top

      if (scrollContainer.scrollTop === 0 && chatList.length < total_length) {
        setPage((prevPage) => prevPage + 1); // Fetch the next page
        setTimeout(() => {
          scrollContainer.scrollTop = 10;
        }, 0);
      }
    }
  }, [chatList.length, total_length]);

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (count < 1) {
      scrollToBottom();
      if (chatList?.length > 0) {
        setCount((prev) => prev + 1);
      }
    }
  }, [chatList]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide the loader after 2 seconds
    }, 500);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  if (loading) {
    return <ListLoading />
  }
  return (
    <div className={styles.chatContainer}>
      <h2>Activity</h2>
      <Divider />
      <div className={styles.messageWithInputBox}>
        <div
          className={styles.messageContainer}
          ref={scrollRef}
          style={{ overflowY: "auto", height: "85%" }}
        >
          {chatList?.length > 0 &&
            chatList.map((chat) => (
              <ChatTextBox
                date={chat?.createdAt}
                imgUrl={chat?.sender_detail?.user_image}
                message={chat?.message}
                name={
                  chat?.sender_detail?.first_name +
                  " " +
                  chat?.sender_detail?.last_name
                }
                key={chat?.id}
                taskChatFiles={chat?.task_chat_files}
                user_id={chat?.user_id || ""}
              />
            ))
          }

          {(chatList?.length == 0) ? (
            <div className="flex flex-col justify-center items-center gap-20 bg-[#F7F9FB] py-20 h-[calc(100vh-172px)]">
              <NoDataFound />
              <Typography className="text-[24px] text-center font-600 leading-normal">
                No Activity Yet!
              </Typography>
            </div>
          ) : null}

          {/* Space for potential new messages at the top */}

        </div>
        <div className={styles.inputBox}>
          <ChatInputBox
            chatList={chatList}
            setChatList={setChatList}
            isAddLoadingChats={isAddLoadingChats}
            taskId={taskId}
            scrollToBottom={scrollToBottom}
            fetchChatMessages={fetchChatMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CustomChat);
