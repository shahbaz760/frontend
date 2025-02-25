import { Button } from "@mui/base";
import { TextField, Typography } from "@mui/material";
import { ChatEditIcon } from "public/assets/icons/clienIcon";
import { NoDataFound, Send } from "public/assets/icons/common";
import { AttachmentDeleteIcon } from "public/assets/icons/supportIcons";
import { useState, useRef, useEffect } from "react";
import DeleteClient from "../DeleteClient";
import { useAppDispatch } from "app/store/store";
import { AddNote, deleteNote, EditNote, getNotesList } from "app/store/Agent";
import { useParams } from "react-router";
import { AgentRootState } from "app/store/Agent/Interafce";
import { useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import EditNoteModal from "./EditNote";
import ListLoading from "@fuse/core/ListLoading";

function RecentData() {
  const [newMessage, setNewMessage] = useState("");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [editId, setEditId] = useState(null); // Tracks the id of the message being edited
  const messageRefs = useRef({}); // Ref for each message container
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const [limit] = useState(20);
  const [isEditModal, setIsOpenEditdModal] = useState(false);
  const { agent_id } = useParams();
  const [name, setName] = useState("");
  const { fetchnote, noteList } = useSelector(
    (store: AgentRootState) => store?.agent
  );
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState<any[]>(noteList || []);

  const GetList = async (page = 0, loader = true) => {
    try {
      const payload = {
        agent_id: agent_id,
        start: page,
        limit: limit,
      };
      // Dispatch the action and fetch the data
      const response = await dispatch(getNotesList({ payload, loader }));
      // Ensure data structure is correct before accessing nested properties
      const filterNote = response?.payload?.data?.data?.list || [];
      // Update the state while avoiding duplicates
      setMessages((prev) => {
        const newAgents = page ? [...prev, ...filterNote] : [...filterNote];
        return newAgents.filter(
          (agent, index, self) =>
            index === self.findIndex((a) => a.id === agent?.id)
        );
      });
    } catch (error) {
      console.error("Error fetching notes list:", error);
    }
  };

  const handleSend = async (value = "") => {
    if (newMessage.trim() || value.trim()) {
      setLoading(true);
      if (editId !== null) {
        // Update the existing message by id
        const updatedMessages = messages.map((msg) =>
          msg.id === editId ? { ...msg, note: value } : msg
        );
        const payloadres = {
          id: editId,
          note: value,
        };
        const { payload } = await dispatch(EditNote(payloadres));
        if (payload?.data?.status == 1) {
          toast.success(payload?.data?.message);
        } else {
          toast.error(payload?.data?.message);
        }
        setMessages(updatedMessages);
        setLoading(false);
        // Scroll to the edited message

        setEditId(null); // Reset edit mode
      } else {
        const payload = {
          agent_id: agent_id,
          note: newMessage,
        };

        const res = await dispatch(AddNote(payload));
        if (res?.payload?.data?.status == 1) {
          toast.success(res?.payload?.data?.message);
        }
        const newMsg = res?.payload?.data?.data;
        setLoading(false);

        setMessages([...messages, newMsg]);
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
              top: scrollRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      }
      setNewMessage("");
    }
  };

  const handleDeleteAttachment = async (id: number) => {
    setDeleteLoading(true);
    const { payload } = await dispatch(deleteNote({ id: id }));
    if (payload?.data?.status) {
      toast.success(payload?.data?.message);
      setDeleteLoading(false);
    }
    const filteredData = messages.filter((item) => item.id != id);
    setMessages(filteredData);
    setIsOpenDeletedModal(false);
  };

  useEffect(() => {
    GetList();
  }, []);

  const handleScrollAgent = debounce(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMoreData = messages.length >= limit; // Check if there are more items to fetch
      const totalRecordsFetched = messages.length;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // Near bottom
        if (!isFetching && hasMoreData && messages?.length % limit === 0) {
          setIsFetching(true);
          GetList(page + 1, false).finally(() => {
            setPage((page) => page + 1);
            setIsFetching(false);
          });
        }
      }
    }
  }, 300);

  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScrollAgent);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScrollAgent);
      }
    };
  }, [handleScrollAgent]);

  return (
    <>
      {/* <div className="shadow-md bg-white rounded-lg overflow-hidden h-full max-h-[1242px] flex flex-col justify-between mt-[20px] md:mt-0 mr-14"> */}
      <div className="flex flex-col sm:h-full h-auto  px-[20px] lg:pl-0  lg:w-[25%] w-[100%] ">
        <>
          <div className="bg-[#2C334C] px-[20px] py-[20px] rounded-t-lg">
            <Typography className="text-xl font-600 text-white">
              Notes
            </Typography>
          </div>
          <div className=" shadow-md bg-white flex flex-col justify-between sm:h-[100%] rounded-b-lg ">
            <div
              className="px-[20px] py-4  flex-grow overflow-y-auto sm:h-[768px]  "
              onScroll={() => handleScrollAgent}
              ref={scrollRef}
            >
              {fetchnote == "loading" && <ListLoading />}
              {messages?.length == 0 && fetchnote != "loading" ? (
                <div className="flex flex-col justify-center items-center gap-20 bg-[#F7F9FB] py-20 h-[calc(100vh-172px)]">
                  <NoDataFound />
                  <Typography className="text-[24px] text-center font-600 leading-normal">
                    No Notes Yet!
                  </Typography>
                </div>
              ) : null}
              {messages?.length > 0 &&
                fetchnote != "loading" &&
                messages?.map((item) => (
                  <div
                    className="gap-10 my-[10px] flex"
                    key={item?.id}
                    ref={(el) => (messageRefs.current[item?.id] = el)} // Assign ref to each message container
                  >
                    <div className="bg-[#F6F6F6] rounded-[10px] p-[16px] w-[90%]">
                      <div>
                        <Typography className="text-[#111827] text-sm break-words">
                          {item?.note}
                        </Typography>
                        <div className="mb-2">
                          <Typography className="text-[#111827] text-xs text-right">
                            {/* Feb 12, 2024 */}
                            {moment.utc(item?.createdAt).format("ll")}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-10 pt-2">
                      <ChatEditIcon
                        onClick={() => {
                          setIsOpenEditdModal(true);
                          setEditId(item.id);
                          setName(item?.note);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <AttachmentDeleteIcon
                        onClick={() => {
                          setIsOpenDeletedModal(true);
                          setIsDeleteId(item?.id);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-white p-4 border-t border-t-[#EDF2F6] m-[10px] rounded-b-lg">
              <div className="flex gap-1" style={{ alignItems: "center" }}>
                <textarea
                  placeholder="Write a note...."
                  className={`text-[14px] font-500 p-8 text-[#111827] border-1 !border-[#F6F6F6] bg-[#F6F6F6]  outline-none w-full break-words placeholder-[#757982] focus:!border-secondary `}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewMessage(value.trimStart()); // Prevent initial spaces
                  }}
                  style={{
                    cursor: "text",
                    resize: "none",
                    height: 40,
                    borderRadius: 8,
                  }}
                  value={newMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent adding a new line
                      e.stopPropagation();
                      if (newMessage) {
                        handleSend();
                      }
                    }
                  }}
                />

                <Button
                  color="primary"
                  disabled={loading}
                  onClick={() => handleSend(newMessage)}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </>
      </div>
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        isLoading={deleteloading}
        heading="Delete Note"
        description="Are you sure you want to delete this note? "
      />
      <EditNoteModal
        isOpen={isEditModal}
        setIsOpen={setIsOpenEditdModal}
        handleSave={handleSend}
        loading={loading}
        name={name}
      />
    </>
  );
}

export default RecentData;
