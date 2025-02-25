import { Button, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useFormik } from "formik";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
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
import AddDepartmentModal from "./AddDepartmentModal";

export default function Department() {
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
        <TitleBar title="Departments">
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
            New Department
          </Button>
        </TitleBar>
        <div className="px-[15px] mb-[3rem]">
          <div className="shadow-sm bg-white rounded-lg">
            <div className="h-24" />

            <CommonTable
              headings={["ID", "Department", "Created On", "Actions"]}
            >
              <>
                {PasswordState?.list?.length === 0 &&
                  PasswordState?.Departmentstatus !== "loading" ? (
                  <TableRow
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #EDF2F6",
                        // paddingTop: "12px",
                        // paddingBottom: "12px",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <TableCell colSpan={7} align="center">
                      <div
                        className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                        style={{ alignItems: "center" }}
                      >
                        <NoDataFound />
                        <Typography className="text-[24px] text-center font-600 leading-normal">
                          No data found!
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : PasswordState.Departmentstatus === "loading" ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <ListLoading /> {/* Render your loader component here */}
                    </TableCell>
                  </TableRow>
                ) : (
                  PasswordState?.list?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": {
                          borderBottom: "1px solid #EDF2F6",
                          paddingTop: "12px",
                          paddingBottom: "12px",
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <TableCell scope="row">#{row.id}</TableCell>
                      <TableCell align="center" className="whitespace-nowrap">
                        {row.name}
                      </TableCell>

                      <TableCell align="center" className="whitespace-nowrap">
                        {moment(row.createdAt).format("ll")}
                      </TableCell>
                      <TableCell align="left" className="w-[1%]">
                        <div className="flex gap-20 pe-20">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </>
            </CommonTable>
            <div className="flex justify-between py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
              {/* {PasswordState.status !== "loading" && ( */}
              <>
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Departments: ${total}`}</Typography>
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
      <AddDepartmentModal
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        fetchDepartmentList={fetchDepartmentList}
        id={id}
        setId={setId}
      />
      <ActionModal
        modalTitle="Delete Department!"
        modalSubTitle="Are you sure you want to delete this department?"
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
