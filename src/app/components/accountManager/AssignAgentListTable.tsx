import { Button, Checkbox, Grid, TableCell, Typography } from "@mui/material";
import { RootState, useAppDispatch } from "app/store/store";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetail } from "src/utils";
import DropdownMenu from "../Dropdown";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownArrowIconWhite } from "public/assets/icons/dashboardIcons";
import InputField from "../InputField";
import ListLoading from "@fuse/core/ListLoading";
import CommonTable from "../commonTable";
import { debounce } from "lodash";
import { accManagerAgentList } from "app/store/AccountManager";
import { useParams } from "react-router";
import { NoDataFound } from "public/assets/icons/common";
import { addAssignClient } from "app/store/Client";
import { ClientRootState } from "app/store/Client/Interface";
import { AccManagerRootState } from "app/store/AccountManager/Interface";

const AssignAgentListTable = ({ }) => {
  const { accAgentList, fetchStatus } = useSelector(
    (store: AccManagerRootState) => store?.accManagerSlice
  );
  const [filteredAccMaangerList, setFilteredAccMaangerList] =
    useState(accAgentList);
  const [anchorEl4, setAnchorEl4] = useState<HTMLElement | null>(null);
  const { accountManager_id } = useParams();
  let userDetail = getUserDetail();
  const [initialRender, setInitialRender] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const { Accesslist } = useSelector((state: RootState) => state.project);
  // const { accAgentList } = useSelector((state: RootState) => state.client);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl4(event.currentTarget);
  };
  const debouncedSearch = useCallback(debounce((searchValue) => {
    const res = dispatch(
      accManagerAgentList({
        accountManger_id: accountManager_id,
        type: 1,
        search: searchValue,
      })
    );
    setInitialRender(true);
  }, 800), []);

  const handleCloseDrop = () => {
    setAnchorEl4(null);
    setCheckedItems([]);
    debouncedSearch("");
    setInitialRender(false);
    setSearch("");
  };

  const handleSearchChangeAgent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSearch(value);
    debouncedSearch(value);
  };
  const handleAddnewAccManager = () => {
    dispatch(
      addAssignClient({
        account_manager_id: accountManager_id,
        client_ids: checkedItems,
      })
    );

    handleCloseDrop();
    // setIsOpenEditModal(false);
    // dispatch(getAccManagerInfo({ account_manager_id: accountManager_id, loader: false }));
    // Filter out the selected items
    setFilteredAccMaangerList((prevList: any) =>
      prevList.filter((item) => !checkedItems.includes(item.id))
    );
    setCheckedItems([]); // Clear the checked items
    setInitialRender(false);
    setSearch("");
  };

  return (
    <div>
      {(userDetail?.role_id == 1 ||
        (userDetail?.role_id == 4 && Accesslist?.is_client_access == 1)) && (
          <Grid
            item
            lg={12}
            className="basis-full mt-[30px]   gap-28 flex-col sm:flex-row w-full  bg-[#ffffff] rounded-[8px]"
          >
            <div className="flex justify-between align-middle my-5 pl-20 pr-10">
              <Typography className="text-[#0A0F18] font-600 text-[20px]  py-10">
                Assigned Agents
              </Typography>
              <DropdownMenu
                marginTop={"mt-20"}
                button={
                  <div
                    className="relative flex items-center"
                    onClick={(e) => handleButtonClick(e)}
                  >
                    <Button
                      variant="outlined"
                      className="h-[40px] sm:text-[16px] mt-2 flex gap-8 whitespace-nowrap  text-white leading-none bg-secondary hover:bg-secondary"
                      aria-label="Manage Sections"
                      size="large"
                      endIcon={
                        <>
                          {anchorEl4 ? (
                            <UpArrowBlank fill="white" />
                          ) : (
                            <DownArrowIconWhite className="cursor-pointer" />
                          )}
                        </>
                      }
                    >
                      Assign New Agent
                    </Button>
                  </div>
                }
                anchorEl={anchorEl4}
                handleClose={handleCloseDrop}
              >
                <div className="w-[375px] p-20">
                  <p className="text-title font-600 text-[1.6rem]">Agent Name</p>

                  <div className="relative w-full mt-10 mb-3 sm:mb-0 ">
                    <InputField
                      name={"agent"}
                      placeholder={"Enter Agent Name"}
                      className="common-inputField "
                      inputProps={{
                        className: "ps-[2rem] w-full sm:w-full",
                      }}
                      onChange={handleSearchChangeAgent}
                    />
                    <div className=" max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
                      {/* {status == "loading" ? (
                      <ListLoading />
                    ) : ( */}
                      <>
                        {/* {initialRender && search != "" && ( */}
                        <>
                          {filteredAccMaangerList?.map((item: any) => {

                            return (
                              <div
                                className="flex items-center gap-10 px-20 w-full hover:bg-[#f6f6f6]"
                                key={item.id}
                              >
                                <label className="flex items-center gap-10 w-full cursor-pointer">
                                  <Checkbox
                                    // checked={checkedItems.includes(item.id)}
                                    // onChange={() =>
                                    // //   handleCheckboxChange(item.id)
                                    // }
                                    className="hover:!bg-transparent"
                                  />
                                  <span>
                                    {item.first_name + " " + item.last_name}
                                  </span>
                                </label>
                              </div>
                            );
                          })}
                        </>
                        {/* )} */}
                      </>
                      {/* )} */}
                    </div>
                  </div>
                  <div className="flex pt-10">
                    <Button
                      variant="contained"
                      color="secondary"
                      className="w-[156px] h-[48px] text-[16px] font-400"
                    // onClick={handleAddnewAccManager}
                    // disabled={checkedItems.length === 0}
                    >
                      Assign
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className="w-[156px] h-[48px] text-[16px] font-400 ml-14"
                      onClick={handleCloseDrop}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DropdownMenu>
            </div>
            <CommonTable
              headings={[
                "ID",
                "Name",
                "Company Name",
                "Subscription Status",
                "Account Status",
                "",
              ]}
            >
              <TableCell></TableCell>

            </CommonTable>
          </Grid>
        )}
    </div>
  );
};

export default AssignAgentListTable;
