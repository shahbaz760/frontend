import { EventIcon, ThreeDotHzIcon } from "public/assets/icons/calender";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { getClientId, getUserDetail } from "src/utils";

// Define a type for the event object
interface EventData {
  id: number;
  title: string;
  description: string;
  status?: number;
  // Add more properties if needed
}

// Define the props interface for the EventCustomize component
interface EventCustomizeProps {
  event: EventData; // Use the EventData type for the event prop
  onClickButton: (event: EventData) => void; // Function accepting EventData as parameter
  setIsOpenAddModal: any;
  setSelectedId?: any
}

const EventCustomize: React.FC<EventCustomizeProps> = ({
  event,
  onClickButton,
  setIsOpenAddModal,
  setSelectedId,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    onClickButton(event);
  };
  const userDetails = getUserDetail();
  return (
    <div className="relative w-[100%] ">
      {/* {userDetails?.role_id != 3 && ( */}
      <div className="absolute right-7 z-999 ">
        <button onClick={handleButtonClick} className="pr-2">
          <ThreeDotHzIcon />
        </button>
      </div>
      {/* )} */}
      <div
        className="flex  items-center justify-between border-[0.5px] border-[#9DA0A6] p-5  rounded-sm relative "
        onClick={(e) => {
          const clientId = getClientId();
          // navigate(
          //   `/${id}/tasks/detail/${event?.status}${clientId ? `?clientId=${clientId}` : ""}`
          // );
          e.stopPropagation();
          setSelectedId(event.status)
          setIsOpenAddModal(true);
        }}
      >
        <div className="text-[#757982] text-[10px] font-semibold flex gap-3 items-center  max-w-[20px] md:max-w-[40px] xl:max-w-[50px]">
          <EventIcon />
          <strong className="truncate max-w-full">{event.title}</strong>
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCustomize;
