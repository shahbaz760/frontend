import ListLoading from "@fuse/core/ListLoading";
import { Button, TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  changeFetchStatus,
  deleteAgentMemberGroup,
  getAgentGroupInfo,
  getGroupMemberDetail,
  sortColumn,
  updateGroupName,
} from "app/store/Agent group";
import {
  AgentGroupRootState,
  AgentGroupType,
  UpdateAgentGroupPayload,
} from "app/store/Agent group/Interface";
import { AgentRootState } from "app/store/Agent/Interafce";
import { filterType } from "app/store/Client/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { DeleteIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import TitleBar from "src/app/components/TitleBar";
import AddGroupModel from "src/app/components/agents/AddGroupModel";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { AgentGroupSchema } from "src/formSchema";
import { getUserDetail, sortNestedAgentList } from "src/utils";
import InputField from "../InputField";
import DeleteClient from "../client/DeleteClient";
import DeleteAgent from "../client/DeleteAgent";

export default function GroupAgentsList() {
  const [deleteId, setIsDeleteId] = useState<number>(null);

  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const { group_id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [currentRows, setCurrentRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const [limit, setLimit] = useState(20);
  const [filterPagination, setFilterPagination] = useState<filterType>({
    start: 0,
    limit,
    search: "",
  });

  const itemsPerPage = 10;

  const dispatch = useAppDispatch();
  const {
    agentGroupDetail,
    actionStatus,
    actionStatusEdit,
    agentGroupListMember,
    total_groupDetail,
    total_item,
  } = useSelector((store: AgentGroupRootState) => store?.agentGroup);
  const list = useSelector((store: AgentRootState) => store.agent);
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const onSubmit = async (values: AgentGroupType, { resetForm }) => {
    const newData: UpdateAgentGroupPayload = {
      ...values,
      group_id,
      agent_ids: [],
      delete_agent_ids: [],
    };

    const { payload } = await dispatch(updateGroupName(newData));

    if (payload?.data?.message) {
      navigate("/admin/agents/groups");
      // resetForm();
    }
  };

  const theme: Theme = useTheme();
  const deleteGroup = async (id: any) => {
    if (!!actionStatus || !id) return;
    setDeleteLoading(true);
    try {
      const { payload } = await dispatch(
        deleteAgentMemberGroup({ member_id: id })
      );
      if (payload?.data?.status) {
        setFilterPagination((prevFilters) => ({
          ...prevFilters,
          start:
            agentGroupListMember?.list?.length - 1 == 0 ? 0 : prevFilters.start,
        }));
        setIsOpenDeletedModal(false);
        dispatch(getGroupMemberDetail({ ...filterPagination, group_id }));
        setIsDeleteId(null);
        setDeleteLoading(false);
      }
    } catch (error) {
      console.error("Failed to delete agent group:", error);
      setDeleteLoading(false);
    }
  };
  const userDetail = getUserDetail();


  const formik = useFormik({
    initialValues: {
      group_name: "",
    },
    validationSchema: AgentGroupSchema,
    onSubmit,
  });

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  useEffect(() => {
    if (!group_id) return null;
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getGroupMemberDetail({ ...filterPagination, group_id }));
      setLoading(false);
    };
    fetchData();
    return () => {
      dispatch(changeFetchStatus());
    };
  }, [filterPagination.limit, filterPagination.search, filterPagination.start]);

  useEffect(() => {
    if (agentGroupListMember) {
      formik.setValues({
        group_name: agentGroupListMember?.group_name,
      });
    }
  }, [agentGroupListMember]);

  useEffect(() => {
    if (
      window.location.pathname.includes("agents") &&
      userDetail?.role_id == 4 &&
      Accesslist?.is_agent_group_access == 0
    ) {
      navigate(`/401`);
    }
  }, [Accesslist]);

  useEffect(() => {
    setFilterPagination((prev) => {
      return {
        ...prev,
        start: 0,
        limit,
      };
    });
  }, [limit]);

  const checkPageNum = (e: any, pageNumber: number) => {
    setFilterPagination((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  if (loading == true) {
    return <ListLoading />;
  }
  const columnKey = {
    "Agent ID": "member_details.id",
    "Agent First Name": "member_details.first_name",
    "Last Name": "member_details.last_name",
  };
  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);

    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(
        sortNestedAgentList(
          column,
          isAsc,
          agentGroupListMember?.list,
          columnKey
        )
      )
    );
  };


  return (
    <>
      <TitleBar title="Agents Groups">
        <Button
          variant="outlined"
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 font-[600] leading-none"
          aria-label="Add New Agent"
          size="large"
          onClick={() => setIsOpenAddModal(true)}
          startIcon={
            <PlusIcon
              fill={
                userDetail?.role_id === 4 &&
                  agentGroupListMember?.is_edit_access === 0
                  ? "#9da0a6" // Disabled color
                  : theme.palette.secondary.main // Enabled color
              }
            />
          }
          disabled={
            userDetail?.role_id === 4 &&
            agentGroupListMember?.is_edit_access === 0
          }
        >
          {/* <PlusIcon color={theme.palette.secondary.main} /> */}
          Add New Agent
        </Button>
        {/* ))} */}
      </TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={formik.handleSubmit}>
            <div className="p-[2rem] flex sm:items-end gap-20 flex-col sm:flex-row w-full">
              {/* Use formik.handleSubmit as the onSubmit handler */}
              <div className="relative">
                <InputField
                  formik={formik}
                  name="group_name"
                  id="group_name"
                  label="Group Name"
                  placeholder="Enter Group Name"
                />
                <div className="absolute left-0 top-[97%]">
                  <span className=" text-red pt-[9px]  block ">
                    {formik?.errors.group_name &&
                      formik?.touched.group_name &&
                      formik?.errors.group_name}
                  </span>
                </div>
              </div>
              <Button
                type="submit" // Use type="submit" to submit the form
                variant="contained"
                color="secondary"
                className="w-[169px] text-[16px] font-400 mt-[20px] sm:mt-0 "
                disabled={
                  actionStatusEdit ||
                  (userDetail?.role_id === 4 &&
                    agentGroupListMember?.is_edit_access === 0)
                }
              >
                Save
              </Button>
            </div>
          </form>
          <>
            <div className="px-20 text-[20px] font-600 text-[#0A0F18] pb-10 pt-20 mb-20">
              All agents list assigned to this group
            </div>
            <CommonTable
              headings={["Agent ID", "Agent First Name", "Last Name", "Action"]}
              sortColumn={sortBy}
              isSorting={true}
              sortOrder={sortOrder}
              onSort={sortData}
              check={false}
            >
              {" "}
              {agentGroupListMember?.list?.length == 0 && !loading ? (
                <TableRow
                  sx={{
                    "& td": {
                      borderBottom: "1px solid #EDF2F6",
                      paddingTop: "12px",
                      paddingBottom: "12px",
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
              ) : (
                <>
                  {agentGroupListMember?.list?.map((row: any, index) => {
                    return (
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
                        <TableCell scope="row" className="px-20">
                          #{row.member_details.id}
                        </TableCell>
                        <TableCell align="center" className="whitespace-nowrap">
                          {row.member_details.first_name}
                        </TableCell>

                        <TableCell align="center" className="whitespace-nowrap">
                          {row.member_details.last_name}
                        </TableCell>

                        <TableCell align="left" className="  px-[7px]">
                          <div className="flex gap-20 pe-20 items-center justify-center">
                            <span className="p-2 cursor-pointer">
                              {userDetail?.role_id === 4 &&
                                agentGroupListMember?.is_edit_access === 0 ? (
                                <>
                                  <DeleteIcon fill="#9da0a6" />
                                </>
                              ) : (
                                <DeleteIcon
                                  onClick={() => {
                                    setIsOpenDeletedModal(true);
                                    setIsDeleteId(row.id);
                                  }}
                                />
                              )}
                            </span>
                            {(userDetail?.role_id == 1 ||
                              (userDetail?.role_id == 4 &&
                                Accesslist.is_agent_access == 1)) && (
                                <span className="p-2 cursor-pointer ">
                                  <Link
                                    to={`/admin/agents/agent-detail/${row?.member_details?.id}`}
                                  >
                                    Go to Agent Page
                                  </Link>
                                </span>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </CommonTable>
          </>
          <div className="flex justify-between py-14 sm:px-[3rem] px-[1rem]">
            <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Agents: ${total_item}`}</Typography>
            <CommonPagination
              limit={limit}
              setLimit={setLimit}
              count={total_groupDetail}
              total={total_item}
              onChange={(e, PageNumber: number) => checkPageNum(e, PageNumber)}
              page={filterPagination.start + 1}
            />
          </div>
        </div>
      </div>
      <AddGroupModel
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        isNewAgent={true}
        filterPagination={filterPagination}
      />
      <DeleteAgent
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => deleteGroup(deleteId)}
        heading={"Delete Agent"}
        description={"Are you sure you want to delete this Agent? "}
        isLoading={deleteLoading}
      />
    </>
  );
}
