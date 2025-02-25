import {
  TableCell,
  Theme,
  Tooltip,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { deleteTask } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import moment from "moment";
import {
  ArrowRightCircleIcon,
  DeleteIcon,
  EditIcon
} from "public/assets/icons/common";
import { MouseEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getClientId, getUserDetail } from "src/utils";
import ActionModal from "../../ActionModal";
import AddTaskModal from "../../tasks/AddTask";
// import { CalendarIcon } from "public/assets/icons/dashboardIcons";
type CardType = {
  title: string;
  priority: string;
  taskName: string;
  isChecked: boolean;
  date: string;
  images: string[];
  id?: number;
  callListApi?: any;
  index?: any;
  project_id?: any;
  agent?: [];
  total_sub_tasks?: any;
};
export const TruncateText = ({ text, maxWidth }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth;
      setIsTruncated(textWidth > maxWidth);
    }
  }, [text, maxWidth]);
  return (
    <Tooltip title={text} enterDelay={500} disableHoverListener={!isTruncated}>
      <Typography
        ref={textRef}
        noWrap
        style={{
          maxWidth: `${maxWidth}px`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          // display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};
export default function Item({
  title,
  priority,
  taskName,
  isChecked,
  date,
  id,
  callListApi,
  images,
  index,
  project_id,
  agent,
  total_sub_tasks,
}: CardType) {
  const maxVisibleImages = 3;
  const visibleAgents = agent.slice(0, maxVisibleImages);
  const extraAgentsCount = agent.length - maxVisibleImages;
  const theme: Theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const projectid = useParams<{ id: string }>();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [disable, setDisabled] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [originalTitle, setOriginalTitle] = useState(title);
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);

  const toggleEditModal = () => {
    setIsOpenAddModal(true);
    if (openEditModal) {
      // formik.setFieldValue("name", originalTitle);
    } else {
      // setOriginalTitle(formik.values.name);
    }
    // setOpenEditModal(!openEditModal);
  };
  const dispatch = useAppDispatch();
  const handleDelete = () => {
    if (id) {
      setDisabled(true);
      dispatch(deleteTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setOpenDeleteModal(false);
            callListApi(0);
            toast.success(res?.data?.message, {
              duration: 4000,
            });
            setDisabled(false);
          }
        });
    }
  };

  const userDetails = getUserDetail();
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const isDateBeforeToday = date
    ? moment(date).isBefore(moment(), "day")
    : false;

  return (
    <>
      <div style={{ position: "relative" }}>
        <ActionModal
          modalTitle="Delete Task"
          modalSubTitle="Are you sure you want to delete this task?"
          open={openDeleteModal}
          handleToggle={toggleDeleteModal}
          type="delete"
          onDelete={handleDelete}
          disabled={disable}
        />
        {isOpenAddModal && (
          <AddTaskModal
            isOpen={isOpenAddModal}
            project_id={id}
            setIsOpen={setIsOpenAddModal}
            ColumnId={id}
            // callListApi={callListApi}
            Edit
          />
        )}

        <TableCell scope="row" className="font-500 pl-[20px]">
          <TruncateText text={title} maxWidth={123} />
        </TableCell>
        <TableCell align="center" className="whitespace-nowrap font-500">
          <div className="flex ">
            {agent.length ? (
              <>
                {visibleAgents?.map((item, idx) => (
                  <img
                    className={`h-[34px] w-[34px] rounded-full border-2 border-white ${agent.length > 1 ? "ml-[-10px]" : ""
                      } z-0`}
                    key={idx}
                    src={
                      //@ts-ignore
                      !item?.user_image
                        ? "../assets/images/logo/images.jpeg"
                        : `${urlForImage}${
                        //@ts-ignore
                        item?.user_image
                        }`
                    }
                    alt={item}
                    loading="lazy"
                  />
                ))}
                {extraAgentsCount > 0 && (
                  <span className="ml-[-10px] z-0 h-[34px] w-[34px] rounded-full border-2 border-[#4f46e5] bg-[#4f46e5] flex items-center justify-center text-xs text-white">
                    +{extraAgentsCount}
                  </span>
                )}
              </>
            ) : (
              "N/A"
            )}
          </div>
        </TableCell>

        <TableCell align="center" className="whitespace-nowrap font-500">
          {total_sub_tasks
            ? total_sub_tasks.toString().padStart(2, "0")
            : "N/A"}
        </TableCell>
        <TableCell align="center" className="whitespace-nowrap font-500">
          {isDateBeforeToday ? (
            <Tooltip
              title={"This task is overdue "}
              enterDelay={500}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "common.white",
                    color: "common.black",
                    padding: 1,
                    borderRadius: 10,
                    boxShadow: 3,

                    "& .MuiTooltip-arrow": {
                      color: "common.white",
                    },
                  },
                },
              }}
            >
              <Typography color="#F44336" className="text-[12px] ml-10 ">
                {!date ? "N/A" : moment(date).format("ll")}
              </Typography>
            </Tooltip>
          ) : (
            <Typography className="text-[12px] ml-10 ">
              {!date ? "N/A" : moment(date).format("ll")}
            </Typography>
          )}
        </TableCell>

        <TableCell align="center" className="whitespace-nowrap font-500">
          {(priority === null || priority === 'null') ? 'N/A' :
            <> <span
              style={{ width: "fit-content" }}
              className={`${priority === "Medium"
                ? "bg-priorityMedium/[.18]"
                : priority === "High"
                  ? "bg-red/[.18]"
                  : "bg-green/[.18]"
                } py-5 px-10 rounded-[27px] min-w-[69px] text-[12px] flex justify-center items-center  font-medium ${priority === "Medium"
                  ? "text-priorityMedium"
                  : priority === "High"
                    ? "text-red"
                    : "text-green"
                }`}
            >
              {priority || "N/A"}
            </span>
            </>}
        </TableCell>
        <TableCell align="left" className="w-[1%] font-500">
          <div className="flex gap-20 px-10">
            {userDetails?.role_id != 3 && (
              <span
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  handleClose();
                  toggleDeleteModal();
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </span>
            )}
            {userDetails?.role_id != 3 && (
              <span
                className="p-2 cursor-pointer"
                onClick={(e) => {
                  handleClose();
                  toggleEditModal();
                  e.stopPropagation();
                }}
              >
                <EditIcon />
              </span>
            )}

            <span
              className="p-2 cursor-pointer"
              onClick={(e) => {
                const clientId = getClientId();
                event.preventDefault();
                e.stopPropagation();
                navigate(
                  `/${project_id}/tasks/detail/${id}${clientId ? `?ci=${clientId}` : ""}`
                );
              }}
            >
              <ArrowRightCircleIcon />
            </span>
          </div>
        </TableCell>
      </div>
    </>
  );
}
