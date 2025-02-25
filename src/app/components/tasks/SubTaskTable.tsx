import { TableCell, TableRow, Theme, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  DeleteIcon,
  EditIcon
} from "public/assets/icons/common";
import CommonTable from "../commonTable";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteTask } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import { debounce } from "lodash";
import moment from "moment";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserDetail } from "src/utils";
import ActionModal from "../ActionModal";
import DueDate from "../projects/DueDate";
import AddSubTaskModal from "./AddSubTaskModal";

const rows = [
  {
    title: "Home page design",
    defaultChecked: true,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
  {
    title: "Mobile screen design",
    defaultChecked: true,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
  {
    title: "Logo design",
    defaultChecked: false,
    assignedImg: ["female-01.jpg", "female-02.jpg", "female-03.jpg"],
    priority: "Medium",
  },
];


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

function SubTaskTable(props) {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { tableSelectedItemDesign, List, fetchSubTaskList, AllList, total_records } = props;
  const [tableList, setTableList] = useState([]);
  const [disable, setDisabled] = useState(false);
  const [page, setPage] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [id, setId] = useState("");
  const [isOpenAddSubTaskModal, setIsOpenAddSubTaskModal] = useState(false);
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
  useEffect(() => {
    setTableList(AllList);
  }, [AllList]);

  const handleDelete = () => {
    if (id) {
      setDisabled(true);
      dispatch(deleteTask(id))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == 1) {
            setOpenDeleteModal(false);
            fetchSubTaskList();
            toast.success(res?.data?.message, {
              duration: 4000,
            });
            setId("");
            setDisabled(false);
          }
        });
    }
  };
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const userDetails = getUserDetail();
  const scrollRef = useRef(null);
  const handleScroll = useCallback(
    debounce(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        const hasMoreData = total_records > 10; // Check if there's more data to fetch
        const totalRecordsFetched = total_records - AllList?.length;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMoreData && totalRecordsFetched > 0) {
          setIsFetching(true);
          fetchSubTaskList(page + 1).finally(() => {
            setPage(page + 1);
            setIsFetching(false);
          });
        }
        setLastScrollTop(scrollTop);
      }
    }, 300),
    [isFetching, List, page]
  );

  // Effect to attach scroll event listener when component mounts
  useEffect(() => {
    const scrolledElement = scrollRef.current;
    if (scrolledElement) {
      scrolledElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrolledElement) {
        scrolledElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <>
      {tableSelectedItemDesign == "Due Date" ? (
        <>
          <CommonTable
            headings={[
              "Title",
              "Assigned",
              "Due Date",
              "Priority",
              // userDetails?.role_id == 2 && "Action",
              "Action"
            ]}
          >
            <div></div>
          </CommonTable>
          <div className="flex flex-col gap-5">
            <DueDate
              rows={rows}
              title={"Overdue (2)"}
              className="text-lg font-medium text-[#F44336]"
            />
            <DueDate
              title={"No Due Date (5)"}
              rows={rows}
              className="text-lg font-medium text-[#757982]"
            />
          </div>
        </>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[210px] overflow-y-auto w-ful pb-[30px]"
        >
          <CommonTable
            headings={[
              "Title",
              "Assigned",
              "Due Date",
              "Priority",
              // userDetails?.role_id == 2 && "Action",
              "Status",
              "Action"
            ]}
          >
            {tableList?.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& td": {
                    borderBottom: "1px solid #EDF2F6",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <TableCell scope="row">
                  {/* <Link
                    to={`/${projectId}/${taskId}/subTask/detail/${row.id}`}
                    className="flex items-center gap-10 cursor-pointer"
            
                  > */}
                  <TruncateText text={row.title} maxWidth={130} />
                  {/* </Link> */}
                </TableCell>
                <TableCell align="center">
                  {/* <ImagesOverlap images={row?.assigned_task_users?.user_image} /> */}
                  <div className="flex justify-center">
                    {row?.assigned_task_users.length > 0 ? (
                      <>
                        {row?.assigned_task_users
                          .slice(0, 3)
                          ?.map((item, idx) => (
                            <img
                              className={`h-[34px] w-[34px] rounded-full border-2 border-white ${row?.assigned_task_users?.length > 1
                                ? "ml-[-10px]"
                                : ""
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

                        {row?.assigned_task_users.length - 3 > 0 && (
                          <span className="ml-[-10px] z-0 h-[34px] w-[34px] rounded-full border-2 border-[#4f46e5] bg-[#4f46e5] flex items-center justify-center text-xs text-white">
                            +{row?.assigned_task_users.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </TableCell>
                <TableCell align="center">
                  {row?.due_date_time
                    ? moment(row.due_date_time).format("ll")
                    : "N/A"}
                </TableCell>
                <TableCell align="center">
                  {!row?.priority ? "N/A" :
                    <span
                      className={`inline-flex items-center justify-center rounded-full w-[70px] min-h-[25px] text-sm font-500
              ${row.priority === "Low"
                          ? "text-[#4CAF50] bg-[#4CAF502E]"
                          : row.priority === "Medium"
                            ? "text-[#FF5F15] bg-[#FF5F152E]"
                            : "text-[#F44336] bg-[#F443362E]"
                        }`}
                    >
                      {row.priority}
                    </span>
                  }
                </TableCell>
                <TableCell align="center">
                  {!row?.column_name ? "N/A" : row?.column_name}</TableCell>
                {/* {userDetails?.role_id == 2 && ( */}
                <TableCell align="left" className="w-[1%]">
                  <div className="flex gap-20 items-center justify-center">
                    <span className="p-2 cursor-pointer">
                      <DeleteIcon
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setId(row.id);
                        }}
                      />
                    </span>
                    <span
                      className="p-2 cursor-pointer"
                      onClick={() => {
                        setIsOpenAddSubTaskModal(true);
                        setId(row.id);
                      }}
                    >
                      <EditIcon />
                    </span>
                  </div>
                </TableCell>
                {/* )} */}
              </TableRow>
            ))}
          </CommonTable>
        </div>
      )}

      {isOpenAddSubTaskModal && (
        <AddSubTaskModal
          isOpen={isOpenAddSubTaskModal}
          setIsOpen={setIsOpenAddSubTaskModal}
          project_id={projectId}
          fetchSubTaskList={fetchSubTaskList}
          Edit={true}
          ColumnId={id}
        />
      )}
      <ActionModal
        modalTitle="Delete Subtask"
        modalSubTitle="Are you sure you want to delete this subtask?"
        open={openDeleteModal}
        handleToggle={toggleDeleteModal}
        type="delete"
        onDelete={handleDelete}
        disabled={disable}
      />
    </>
  );
}

export default SubTaskTable;
