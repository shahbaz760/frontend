import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  FormControlLabel,
  Radio,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { getAccManagerList } from "app/store/AccountManager";
import { setBreadcrumbFor, setBreadcrumbs } from "app/store/breadCrumb";
import {
  defaultAccManagerList,
  deleteAccManagerList,
  getAssignAccMangerInfo,
  getClientInfo,
  sortColumn,
} from "app/store/Client";
import { ClientRootState } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import { NoDataFound } from "public/assets/icons/common";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import AddAgentModel from "src/app/components/agents/AddAgentModel";
import CommonTable from "src/app/components/commonTable";
import CommonPagination from "src/app/components/pagination";
import { getUserDetail, sortAgentList } from "src/utils";
import UnassignedAgent from "../AssignedAgents/UnassignedAgent";

export default function AssignedAccountManager({
  setManagerFilterMenu,
  managerfilterMenu,
  clientDetail,
}) {
  const {
    assignAccManagerDetail,
    managertotal_records,
    actionStatus,
    total_itemsAcc,
  } = useSelector((store: ClientRootState) => store?.client);
  const [isOpenUnssignedModal, setIsOpenUnassignedModal] = useState(false);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const { client_id } = useParams();
  const dispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [defaultAccManagerId, setDefaultAccManagerId] = useState(null);
  const currentUrl = window.location.href;
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [limit, setLimit] = useState(20);

  const unassignAccManager = async (id: any) => {
    try {
      const { payload } = await dispatch(
        deleteAccManagerList({ client_id: client_id, account_manager_id: id })
      );

      if (payload?.data?.status) {
        setManagerFilterMenu((prevFilters) => ({
          ...prevFilters,
          start: assignAccManagerDetail.length - 1 == 0 ? 0 : prevFilters.start,
        }));

        dispatch(
          getAssignAccMangerInfo({
            ...managerfilterMenu,
            client_id,
          })
        );

        setIsOpenUnassignedModal(false);
      }
    } catch (error) {
      console.error("Failed to delete agent group:", error);
    }
  };
  const handleDefaultAccManagerChange = (id) => {
    // Update the state with the ID of the selected default account manager
    setDefaultAccManagerId(id);

    // Dispatch your action here if needed
    dispatch(
      defaultAccManagerList({
        client_id: client_id,
        account_manager_id: id,
      })
    );
  };

  function getUrlParameter(url, param) {
    let params = new URL(url).searchParams;
    return params.get(param);
  }

  let type = getUrlParameter(currentUrl, "type");

  useEffect(() => {
    if (assignAccManagerDetail.length > 0) {
      // Find the element with is_default = 1
      const defaultManager = assignAccManagerDetail.find(
        (manager) => manager.is_default == 1
      );
      //
      if (defaultManager) {
        // Set the account_manager_id of the found element as the default checked
        setDefaultAccManagerId(defaultManager.account_manager_id);
      }
    }
  }, [assignAccManagerDetail]);

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
          label: `Assigned-Admin-User`,
        },
      ])
    );
    dispatch(setBreadcrumbFor("/client/detail"));
  }, [clientDetail]);

  const checkPageNum = (e: any, pageNumber: number) => {
    setManagerFilterMenu((prevFilters) => {
      if (pageNumber !== prevFilters.start + 1) {
        return {
          ...prevFilters,
          start: pageNumber - 1,
        };
      }
      return prevFilters; // Return the unchanged filters if the condition is not met
    });
  };

  const columnKey = {
    "Admin User": "first_name",
    "Admin User ID": "account_manager_id",
    "Assigned ate": "assigned_date_time",
  };
  // const columnKey = {
  //   "Account Manager": "first_name",
  //   "Account Manager Id": "account_manager_id",
  //   "Assigned date": "assigned_date_time",
  // };
  const sortData = (column: string) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);

    setSortOrder(isAsc ? "desc" : "asc");
    dispatch(
      sortColumn(
        sortAgentList(column, isAsc, assignAccManagerDetail, columnKey)
      )
    );
  };

  useEffect(() => {
    setManagerFilterMenu((prevFilters) => {
      return {
        ...prevFilters,
        start: 0,
        limit,
      };
    });
  }, [limit]);

  return (
    <>
      <div className="mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm">
          <CommonTable
            headings={["Admin User", "Admin User ID", "Assigned Date", "", ""]}
            sortColumn={sortBy}
            isSorting={true}
            sortOrder={sortOrder}
            onSort={sortData}
            check={false}
            indexlength="2"
          >
            {assignAccManagerDetail?.length === 0 && actionStatus == false ? (
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
            ) : actionStatus === true ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <ListLoading /> {/* Render your loader component here */}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {assignAccManagerDetail.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "& td": {
                          borderBottom: "1px solid #EDF2F6",
                          paddingTop: "26px",
                          paddingBottom: "12px",
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <TableCell
                        scope="row"
                        className="flex items-center gap-8 font-500 whitespace-nowrap"
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
                          to={`/admin/acc-manager/detail/${row.account_manager_id}`}
                          className="ml-5 cursor-pointer  font-500 "
                        >
                          {row.first_name + " " + row.last_name}
                        </Link>
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap font-500 "
                      >
                        #{row.account_manager_id}
                      </TableCell>

                      <TableCell
                        align="center"
                        className="whitespace-nowrap font-500 custom"
                      >
                        {row.assigned_date_time}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap font-500"
                      >
                        <FormControlLabel
                          onClick={() =>
                            handleDefaultAccManagerChange(
                              row.account_manager_id
                            )
                          }
                          value="Mark as default"
                          control={
                            <Radio
                              checked={
                                defaultAccManagerId == row.account_manager_id
                              }
                              // checked={
                              //   index === 0 ||
                              //   defaultAccManagerId === row.account_manager_id
                              // }
                              className="hover:!bg-transparent"
                            />
                          }
                          label="Mark as default"
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        className="whitespace-nowrap cursor-pointer"
                      >
                        <Button
                          className="inline-flex items-center justify-center rounded-full w-[95px] min-h-[25px] h-[10px] text-sm font-500  text-secondary bg-secondary_bg cursor-pointer"
                          // ${
                          //   row.status === "Unassign"
                          //     ? "text-secondary bg-secondary_bg"
                          //     : row.status === "Unassigned"
                          //       ? "text-[#F44336] bg-[#F443362E]"
                          //       : "text-[#4F46E5] bg-[#EDEDFC]"
                          // }`}
                          onClick={() => {
                            setIsOpenUnassignedModal(true);
                            setIsDeleteId(row.account_manager_id);
                          }}
                        >
                          Unassign
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </CommonTable>

          <div className="flex justify-between py-14 px-[3rem] overflow-x-auto whitespace-nowrap gap-20">
            <>
              <Typography className="bg-[#EDEDFC] p-14 text-[#4F46E5] font-600">{`Total Assigned  Admin Users: ${total_itemsAcc}`}</Typography>
              {actionStatus === false && (
                <CommonPagination
                  total={total_itemsAcc}
                  limit={limit}
                  setLimit={setLimit}
                  // responsive={true}
                  count={managertotal_records}
                  onChange={(e, PageNumber: number) =>
                    checkPageNum(e, PageNumber)
                  }
                  page={managerfilterMenu.start + 1}
                />
              )}
            </>
          </div>
        </div>
      </div>
      {isOpenAddModal && (
        <AddAgentModel isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} />
      )}
      <UnassignedAgent
        isOpen={isOpenUnssignedModal}
        setIsOpen={setIsOpenUnassignedModal}
        onDelete={() => unassignAccManager(deleteId)}
        description={"Are you sure you want to unassign this admin user?"}
      />
    </>
  );
}
