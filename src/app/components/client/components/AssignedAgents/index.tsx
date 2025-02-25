import { TableCell, TableRow, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
// import { addAgentInagentGroup } from "app/store/Agent group";
import ListLoading from "@fuse/core/ListLoading";
import { filterType } from "app/store/Agent group/Interface";
import { filterAgentType } from "app/store/Agent/Interafce";
import { setBreadcrumbFor, setBreadcrumbs } from "app/store/breadCrumb";
import { deleteAgentList, getClientInfo, sortColumn } from "app/store/Client";
import { ClientRootState } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { NoDataFound } from "public/assets/icons/common";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import AddAgentModel from "src/app/components/agents/AddAgentModel";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { sortAgentList } from "src/utils";
import UnassignedAgent from "./UnassignedAgent";

export default function AssignedAgents({
  setAgentFilterMenu,
  clientDetail,
  agentfilterMenu,
}) {
  const [limit, setLimit] = useState(20);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const [isOpenUnssignedModal, setIsOpenUnassignedModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [initialRender, setInitialRender] = useState(false);
  const [filters, setfilters] = useState<filterAgentType>({
    start: 0,
    limit: -1,
    search: "",
  });

  const {
    assignedAgentDetail,
    agentTotal_records,
    fetchStatus,
    getStatus,
    total_items,
  } = useSelector((store: ClientRootState) => store.client);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const dispatch = useAppDispatch();
  const { client_id } = useParams();
  const theme: Theme = useTheme();
  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });

  const unassignAgent = async (id: any) => {
    try {
      const { payload } = await dispatch(
        deleteAgentList({ client_id: client_id, agent_id: id })
      );

      if (payload?.data?.status) {
        setAgentFilterMenu((prevFilters) => ({
          ...prevFilters,
          start: assignedAgentDetail.length - 1 == 0 ? 0 : prevFilters.start,
        }));
        // dispatch(addAgentInagentGroup({ ...filterMenu, client_id: client_id }));
        setIsOpenUnassignedModal(false);
      }
    } catch (error) {
      console.error("Failed to delete agent group:", error);
    }
  };


  const checkPageNum = (e: any, pageNumber: number) => {
    setAgentFilterMenu((prevFilters) => {
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
    setAgentFilterMenu((prevFilters) => ({
      ...prevFilters,
      start: 0,
      limit,
    }));
  }, [limit]);

  const columnKey = {
    Agents: "first_name",
    "Agents Id": "agent_id",
    "Assigned Date": "assigned_date_time",
  };
  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);

    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(sortAgentList(column, isAsc, assignedAgentDetail, columnKey))
    );
  };

  // useEffect(() => {
  //   dispatch(getClientInfo({ client_id }));
  // }, []);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        {
          path: `/admin/client/detail/${client_id}?type=profile`,
          label: `${clientDetail?.first_name ?? ""} ${clientDetail?.last_name ?? ""}`,
        },
        {
          path: "",
          label: `Assigned-Agents`,
        },
      ])
    );
    dispatch(setBreadcrumbFor("/client/detail"));
  }, [clientDetail]);

  return (
    <>
      <div className="mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <CommonTable
            headings={["Agents", "Agents ID", "Assigned Date", ""]}
            sortColumn={sortBy}
            isSorting={true}
            sortOrder={sortOrder}
            onSort={sortData}
            check={false}
          >
            {assignedAgentDetail?.length === 0 && getStatus !== "loading" ? (
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
            ) : getStatus === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render your loader component here */}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {assignedAgentDetail?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #EDF2F6",
                        paddingTop: "26px",
                        paddingBottom: "32px",
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <TableCell
                      scope="row"
                      className="flex items-center gap-8 font-500"
                    >
                      <img
                        className="h-40 w-40 rounded-full"
                        src={
                          row.user_image
                            ? urlForImage + row.user_image
                            : "../assets/images/logo/images.jpeg"
                        }
                      ></img>
                      <Link
                        to={`/admin/agents/agent-detail/${row.agent_id}`}
                        className="ml-5 cursor-pointer  font-500 "
                      // style={{ textDecoration: "none", color: "#111827" }}
                      >
                        {row.first_name + " " + row.last_name}
                      </Link>
                    </TableCell>

                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      #{row.agent_id}
                    </TableCell>

                    <TableCell
                      align="center"
                      className="whitespace-nowrap font-500"
                    >
                      {row.assigned_date_time}
                    </TableCell>
                    <TableCell align="center" className="whitespace-nowrap">
                      <span
                        onClick={() => {
                          setIsOpenUnassignedModal(true);
                          setIsDeleteId(row.agent_id);
                        }}
                        className="inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px]
                           text-secondary bg-secondary_bg text-sm font-500 cursor-pointer"
                      //  ${
                      //    row.status === "Unassign"
                      //      ? "text-secondary bg-secondary_bg"
                      //      : row.status === "Unassigned"
                      //        ? "text-[#F44336] bg-[#F443362E]"
                      //        : "text-[#4F46E5] bg-[#EDEDFC]"
                      //  }`}
                      >
                        Unassign
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </CommonTable>

          <div className="flex justify-between py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
            {fetchStatus != "loading" && (
              <>
                <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Assigned Agents: ${total_items}`}</Typography>
                <CommonPagination
                  total={total_items}
                  limit={limit}
                  setLimit={setLimit}
                  count={agentTotal_records}
                  onChange={(e, PageNumber: number) =>
                    checkPageNum(e, PageNumber)
                  }
                  page={agentfilterMenu.start + 1}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {isOpenAddModal && <AddAgentModel
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        isEditing={false}
      />}
      <UnassignedAgent
        isOpen={isOpenUnssignedModal}
        setIsOpen={setIsOpenUnassignedModal}
        onDelete={() => unassignAgent(deleteId)}
        description={"Are you sure you want to unassign this agent?"}
      />
    </>
  );
}
