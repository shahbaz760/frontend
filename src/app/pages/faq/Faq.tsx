import { Button, TableCell, TableRow, Theme, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useFormik } from "formik";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useRef, useState } from "react";
import TitleBar from "src/app/components/TitleBar";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";

import ListLoading from "@fuse/core/ListLoading";
import { filterType } from "app/store/Client/Interface";
import { GetDepartmentList, deleteDepartment } from "app/store/Password";
import { RootState, useAppDispatch } from "app/store/store";
import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ActionModal from "src/app/components/ActionModal";
import AddfaqModal from "./AddfaqModal";


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

export default function Faq() {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);
  const [isOpenSupportDetail, setIsOpenDetailPage] = useState<boolean>(false);
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState(null);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const PasswordState = useSelector((state: RootState) => state.password);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [limit, setLimit] = useState(20);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(PasswordState?.total_items);
  }, [PasswordState?.list]);

  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetDepartmentList(filters));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      const payload = {
        password_manager_id: deleteId,
      };
      //@ts-ignore
      const res = await dispatch(deleteDepartment(payload));
      if (res?.payload?.data?.status) {
        setfilters((prevFilters) => ({
          ...prevFilters,
          start: PasswordState.list.length - 1 == 0 ? 0 : prevFilters.start,
        }));
      }

      fetchDepartmentList();
      setOpenDeleteModal(false);
      toast.success(res?.payload?.data?.message);

      // toast.dismiss();
      setIsDeleteId(null);
      setTimeout(() => {
        setDisable(false);
      }, 500);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const checkPageNum = (e: any, pageNumber: number) => {
    setfilters((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  useEffect(() => {

    fetchDepartmentList();

  }, [filters.start, filters?.limit, filters.search]);


  useEffect(() => {
    if (limit !== filters.limit) {
      setfilters((prevFilters) => ({
        ...prevFilters,
        start: 0,
        limit,
      }));
    }
  }, [limit]);

  return (
    <>
      <div>
        <TitleBar title="Frequently Asked Questions">
          <Button
            variant="outlined"
            color="secondary"
            className="h-[40px] sm:text-[16px] text-[14px] flex gap-8 leading-3 sm:leading-0"
            aria-label="Add Tasks"
            size="large"
            onClick={(e) => {
              setIsOpenAddModal(true);
              e.stopPropagation();
              setId(null);
              setIsDeleteId(null);
            }}
            startIcon={<PlusIcon color={theme.palette.secondary.main} />}
          >
            Add FAQ
          </Button>
        </TitleBar>
        <div className="sm:px-[28px] px-10 mb-[3rem]">
          <div className="shadow-sm rounded-lg">
            {PasswordState?.list?.length == 0 &&
              PasswordState?.Departmentstatus !== "loading" ? (
              <div
                className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                style={{ alignItems: "center" }}
              >
                <NoDataFound />
                <Typography className="text-[24px] text-center font-600 leading-normal">
                  No data found!
                </Typography>
              </div>
            ) : PasswordState.Departmentstatus === "loading" ? (
              <ListLoading />
            ) : (
              PasswordState?.list?.map((row, index) => (
                <div key={index} className="bg-white p-10 my-10 rounded-md shadow-sm flex">
                  <div className="w-[90%]">
                    <h3 className="font-semibold mb-8">{`Q${index + 1}. ${row.name}`}</h3>
                    <p className="text-gray-600">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis venenatis tristique nisl, ut dapibus.",
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis venenatis tristique nisl, ut dapibus.",
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis venenatis tristique nisl, ut dapibus.",
                    </p>
                  </div>
                  <div className="w-[10%] flex  justify-end">
                    <div className="flex gap-20  justify-center">
                      <span
                        className="p-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDeleteModal(true);
                          setIsDeleteId(row.id);
                        }}
                      >
                        <DeleteIcon />
                      </span>
                      <span
                        className="p-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenAddModal(true);
                          setId(row.id);
                        }}
                      >
                        <EditIcon />
                      </span>
                    </div>
                  </div>
                </div>

              ))
            )}
            <div className="flex justify-between py-14  overflow-x-auto whitespace-nowrap gap-20">
              {/* {PasswordState.status !== "loading" && ( */}
              <>
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total FAQ: ${total}`}</Typography>
                <CommonPagination
                  limit={limit}
                  total={PasswordState?.total_items}
                  setLimit={setLimit}
                  count={PasswordState?.total_records}
                  page={filters.start + 1}
                  onChange={(event, pageNumber) =>
                    checkPageNum(event, pageNumber)
                  }
                />
              </>
            </div>
          </div>
        </div>
      </div>
      <AddfaqModal
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        fetchDepartmentList={fetchDepartmentList}
        id={id}
        setId={setId}
      />
      <ActionModal
        modalTitle="Delete Question!"
        modalSubTitle="Are you sure you want to delete this Question?"
        open={openDeleteModal}
        handleToggle={() => {
          setOpenDeleteModal(false);
        }}
        type="delete"
        onDelete={onDelete}
        disabled={disable}
      />
    </>
  );
}
