import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/styles";
import {
  TaskListColumn,
  projectColumnList,
  setCondition,
  setFilter,
  setFilterData,
  setIsSubTask,
  setMainOp,
  setSortFilter,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import {
  CrossAssignee,
  CrossGreyIcon,
  CrossIcon,
} from "public/assets/icons/common";
import { SubTaskIcon } from "public/assets/icons/projectsIcon";
import { SearchFilterIcon } from "public/assets/icons/topBarIcons";
import { FilterIcon } from "public/assets/icons/user-icon";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import DropdownMenu from "../Dropdown";
import SelectField from "../selectField";
import FilterCondition from "./FilterCondition";
import GroupModal from "./GroupModal";
import ProjectMenuItems from "./ProjectMenuItems";
import SortByDropdown from "./SortingFilter";
import SaveFilter from "./ProjectTaskList/SaveFilter";
import ListLoading from "@fuse/core/ListLoading";

interface FilterDesign {
  filterDesign?: boolean;
  apicall?: boolean;
  group?: boolean;
  sort?: boolean;
  showSubtask?: boolean;
  tableTask?: boolean;
  tab?: number;
}
const FilterPage = (props: FilterDesign) => {
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    borderRadius: "6px",
    color: "#757982",
    font: "12px",
    backgroundColor: "#f6f6f6",
    "&:hover": {
      backgroundColor: "#e0e0e0", // Change this to your desired hover color
    },
  }));

  const { id, uuid, name, subuuid } = useParams<{
    id: string;
    uuid?: string;
    name: string;
    subuuid?: string;
  }>();
  const {
    filterDesign,
    // listData,
    group = true,
    sort = true,
    showSubtask,
    tableTask = false,
    tab = 0,
    apicall = false,
  } = props;

  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => { },
  });
  const {
    fetchStatusNew,
    searchStatus,
    filterdata,
    filtered,
    conditions,
    MainOp,
    sorting,
    isSubtask,
    saveFilterList,
  } = useSelector((store: ProjectRootState) => store?.project);
  const [filterMenu, setFilterMenu] = useState<HTMLElement | null>(null);
  const [searchList, setSearchList] = useState("");
  const [initialRender, setInitialRender] = useState(false);
  const [mainFilterItems, setMainFilterItems] = useState<any[]>([]);
  const [applyOp, setApplyOp] = useState<any>("AND");
  const [showTask, setShowTask] = useState(true);
  const [isSaveFilter, setIsSaveFilter] = useState(false);
  const [isSaveFilterid, setIsSaveFilterId] = useState(null);
  const [isSaveFiltername, setIsSaveFilterName] = useState(null);
  const [filters, setfilters] = useState<any>({
    start: 0,
    limit: 10,
    search: "",
  });
  const changeSelectFilterItems = (index, filterIndex, value) => {
    mainFilterItems[index].filterCondition[filterIndex] = value;
    setMainFilterItems([...mainFilterItems]);
  };

  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = true,
    drag = true,
    search = null,
    applyopMain = "",
    filter = null,
    is_filter_save = 0,
    groupkey = null,
    order = 0,
    sort = [],
    condition = [],
    group = false,
    filter_name = "",
    filter_id = 0,
    save = false,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item.filterConditions.length > 1
              ? cond.applyOp == "AND"
                ? "AND"
                : "OR"
              : "", // Adjust according to your requirements
          key: cond.key || 0, // Assuming you want to keep the key as is
          op: cond.op, // Assuming you want to keep the op as is
          value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
        })),
      }));
    };
    const payload: any = {
      start: 0,
      limit: -1,
      search: search,
      project_id: id as string,
      task_start: task_start,
      task_limit: 20,
      project_column_id: columnid,
      is_filter: filter != null ? filter : filtered,
      group: {
        key: groupkey,
        order: order || filterdata?.order,
      },
      sort: sort.length > 0 ? sort : sorting.length > 0 ? sorting : [],
      filter:
        condition.length > 0
          ? transformArray(condition)
          : save
            ? []
            : conditions.length > 0
              ? conditions
              : [],
      is_filter_save: !filter_id ? is_filter_save : 0,
      filter_name: filter_name,
      is_view: tab,
      filter_id: filter_id,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      const updatedList = res?.payload?.data?.data?.list;
      setIsSaveFilterId(null);
      setIsSaveFilterName("");
      setIsSaveFilter(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsSaveFilterId(null);
      setIsSaveFilterName("");
      setIsSaveFilter(false);
    }
  };

  const taskLIstData = async ({
    search = null,
    applyopMain = "",
    filter = null,
    sort = [],
    start = 0,
    condition = [],
    is_filter_save = 0,
    loading = true,
    filter_name = "",
    filter_id = 0,
    groupkey = null,
    order = 0,
    type = 0,
    save = false,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions.map((cond) => ({
          applyOp:
            item.filterConditions.length > 1
              ? cond.applyOp == "AND"
                ? "AND"
                : "OR"
              : "",
          key: cond.key, // Assuming you want to keep the key as is
          op: cond.op, // Assuming you want to keep the op as is
          value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
        })),
      }));
    };
    const payload = {
      project_id: id,
      start: start,
      limit: -1,
      search: search,
      type: tab == 3 ? 1 : type,
      is_filter_save: !filter_id ? is_filter_save : 0,
      is_view: tab,
      filter_name: filter_name,
      filter_id: filter_id,
      group: {
        key: groupkey || filterdata?.key,
        order: order || filterdata?.order,
      },
      // is_filter: filter != null ? filter : filtered,
      sort: sort.length > 0 ? sort : sorting?.length > 0 ? sorting : [],
      filter:
        condition.length > 0
          ? transformArray(condition)
          : save
            ? []
            : conditions.length > 0
              ? conditions
              : [],
    };
    const taskLists = await dispatch(TaskListColumn({ payload, loading }));
    const task = taskLists?.payload?.data?.data?.list;
    setIsSaveFilterId(null);
    setIsSaveFilterName("");
    setIsSaveFilter(false);
  };

  const debouncedSearch = debounce((searchValue) => {
    // Update the search filter here

    setfilters((prevFilters) => ({
      ...prevFilters,
      search: searchValue,
    }));
    setInitialRender(true);
  }, 800); // Adjust the delay as needed (300ms in this example)

  const dispatch = useAppDispatch();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchList(value);
    debouncedSearch(value);
  };

  const handleInputClear = () => {
    setSearchList("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
    if (tableTask && apicall) {
      taskLIstData({ loading: false, search: "", type: 1 });
    } else if (tableTask && !apicall) {
      taskLIstData({ loading: false, search: "" });
    } else {
      listData({ loader: false, search: "" });
    }
  };

  const addFilterCondition = (index) => {
    setMainFilterItems((prevMainFilterItems) => {
      const newMainFilterItems = [...prevMainFilterItems];
      newMainFilterItems[index].filterConditions.push({
        applyOp: "",
        key: "",
        op: 0,
        value: [],
      });
      return newMainFilterItems;
    });
  };

  const addMainFilter = () => {
    setMainFilterItems([
      ...mainFilterItems,
      {
        selectMenuItems: "",
        filterConditions: [{}],
        selectsetOp: {
          applyOp: "",
          key: 0,
          op: 0,
          value: [],
        },
      },
    ]);
  };

  useEffect(() => {
    if (conditions && conditions?.length > 0 && filterMenu) {
      setApplyOp(conditions[0].applyOp != "" ? conditions[0].applyOp : "AND");
      const updateFilter = conditions.map((conditionItem) => {
        // Creating new objects to avoid mutating existing state
        return {
          selectMenuItems: "",
          filterConditions: conditionItem?.condition
            ? [...conditionItem.condition]
            : conditionItem?.filterConditions
              ? [...conditionItem.filterConditions]
              : [],
          // filterConditions: [...(conditionItem?.filterConditions || [])],
          selectsetOp: {
            applyOp: "",
            key: 0,
            op: 0,
            value: [],
          },
        };
      });

      // Updating state with the new array
      setMainFilterItems(updateFilter);
      setTimeout(() => {
        setMainFilterItems(updateFilter);
      }, 5);
    }
  }, [filterMenu, conditions, filters.search]);

  const updateFilterCondition = (mainIndex, conditionIndex, condition) => {
    setMainFilterItems((prevMainFilterItems) => {
      // Create a new copy of the previous main filter items
      const newMainFilterItems = [...prevMainFilterItems];

      // Create a new copy of the filterConditions array
      const newFilterConditions = [
        ...newMainFilterItems[mainIndex].filterConditions,
      ];

      // Update the specific condition in the new array
      newFilterConditions[conditionIndex] = condition;

      // Update the specific item with the new filterConditions
      newMainFilterItems[mainIndex] = {
        ...newMainFilterItems[mainIndex],
        filterConditions: newFilterConditions,
      };

      return newMainFilterItems;
    });
  };

  const handleApply = ({
    save = false,
    name = "",
    ids = 0,
    searchList = "",
  }) => {
    if (ids) {
      setIsSaveFilterId(ids);
    }
    const updatedMainFilterItems = mainFilterItems.map((item) => {
      if (item?.filterConditions?.length > 0) {
        const firstApplyOp = item?.filterConditions[1]?.applyOp || "";
        // Create a new filterConditions array with updated applyOp
        const updatedFilterConditions = item.filterConditions.map(
          (condition) => ({
            ...condition,
            applyOp: firstApplyOp,
          })
        );
        return {
          ...item,
          filterConditions: updatedFilterConditions,
        };
      }
      return item; // Return item unchanged if no filterConditions
    });
    if (tableTask) {
      taskLIstData({
        loading: false,
        search: searchList,
        filter: 1,
        filter_name: name,
        condition: updatedMainFilterItems,
        applyopMain: updatedMainFilterItems.length > 1 ? applyOp : "",
        is_filter_save: save ? 1 : 0,
        filter_id: ids,
      });
    } else {
      listData({
        loader: false,
        search: searchList,
        filter: 1,
        filter_name: name,
        condition: updatedMainFilterItems,
        applyopMain: updatedMainFilterItems.length > 1 ? applyOp : "",
        is_filter_save: save ? 1 : 0,
        filter_id: ids,
        groupkey: filterdata.key,
      });
    }
    dispatch(setFilter(1));
    dispatch(setCondition(mainFilterItems));
    dispatch(setMainOp(mainFilterItems.length > 1 ? applyOp : ""));
    if (!ids) {
      setFilterMenu(null);
    }
  };

  useEffect(() => {
    // if (searchList !== "") {
    // if (tableTask) {
    //   taskLIstData({
    //     loading: false,
    //     search: searchList,
    //   });
    // } else {
    //   listData({ loader: false, search: searchList, });
    handleApply({ searchList: searchList });
  }, [filters.limit, filters.search, filters.start]);

  const deleteFilterCondition = (mainIndex, nestedIndex) => {
    const newFilterItems = mainFilterItems[mainIndex].filterConditions.filter(
      (data, filterIn) => filterIn !== nestedIndex
    );

    if (newFilterItems.length == 0) {
      // Remove the whole object if filterConditions is empty
      setMainFilterItems(
        mainFilterItems.filter((item, index) => index != mainIndex)
      );
    } else {
      // Otherwise, just update the filterConditions
      const updatedFilterItems = [...mainFilterItems];
      updatedFilterItems[mainIndex].filterConditions = newFilterItems;
      setMainFilterItems(updatedFilterItems);
    }
  };

  const handleClose = ({ save = false }) => {
    if (tableTask) {
      taskLIstData({
        loading: false,
        search: "",
        filter: sorting.length > 0 ? 1 : 0,
        condition: [],
        applyopMain: "",
        is_filter_save: save ? 1 : 0,
        sort: sorting.length > 0 ? sorting : [],
        save: save,
      });
    } else {
      listData({
        search: "",
        loader: false,
        filter: filterdata.key ? 1 : sorting.length > 0 ? 1 : 0,
        groupkey: filterdata.key || null,
        order: filterdata.order,
        condition: [],
        applyopMain: "",
        is_filter_save: save ? 1 : 0,
        sort: sorting.length > 0 ? sorting : [],
        save: save,
      });
    }
    if (!isSaveFilterid) {
      setFilterMenu(null);
    }

    setMainFilterItems([]);
    if (conditions.length > 0) {
      if (sorting.length > 0) {
        dispatch(setFilter(1));
      } else {
        dispatch(setFilter(0));
      }
      if (save) {
        dispatch(setCondition([]));
        dispatch(setMainOp(""));
      }
    }
  };

  const allConditionsHaveValuesForAllItems = (items) => {
    return items?.every(
      (item) =>
        item.filterConditions &&
        item.filterConditions?.every((condition) => {
          return Object.keys(condition)?.every((key) => {
            const value = condition[key];
            // Special handling for 'op' key
            if (key == "op") {
              // If 'op' is 2 or 3 (numeric), allow empty 'value'
              if (value == 2 || value == 3) {
                return true;
              }
            }

            // Check 'value' specifically
            if (key == "value") {
              if (condition.op == 2 || condition.op == 3) {
                return true; // Allow empty value for op 2 and 3
              }
              // For other 'op' values, ensure value is not empty
              return value != null && value != undefined && value.length > 0;
            }

            // General validation for other keys
            return value != null && value !== undefined;
          });
        })
    );
  };

  const handleHideSubTask = async () => {
    setShowTask(!showTask);
    await dispatch(setIsSubTask(!showTask));
  };
  return (
    <div className="px-4 ">
      <div
        className="relative bg-[#ffff] py-5 
      sm:py-10 px-5 sm:px-10 flex flex-col sm:flex-row  sm:items-center justify-between gap-10 rounded-xl overflow-hidden leading-[14px]
       text-[14px] flex-wrap"
      >
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          defaultValue=""
          value={searchList}
          variant="standard"
          placeholder="Search Task"
          onChange={handleSearchChange}
          className="flex justify-center text-[12px]"
          sx={{
            height: "45px",
            pl: "5px", // Adjusted padding to accommodate the icon
            // width: {
            //   xs: "100%", // Full width on extra-small screens
            //   sm: "100%", // Full width on small screens
            //   md: "286px", // 286px on medium and larger screens
            // },
            maxWidth: "286px",
            pr: 2,
            backgroundColor: "#F6F6F6",
            borderRadius: "8px",
            border: "1px solid transparent",
            "&:focus-within": {
              border: "1px solid blue",
            },
            "& .MuiInputBase-input": {
              textDecoration: "none",
              border: "none",
              fontSize: "12px",
            },
            "& .MuiInput-underline:before": {
              border: "none !important",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none !important",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#757982",
              opacity: 1,
            },
            "& .MuiInputAdornment-positionStart": {
              // marginLeft: "8px", // Adjusted margin to position the icon
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchFilterIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchList !== "" ? (
                  <CrossGreyIcon
                    className="cursor-pointer fill-[#c2cad2] h-[14px]"
                    onClick={handleInputClear}
                  />
                ) : (
                  // Render an empty icon to occupy space when inputValue is empty
                  <div style={{ width: "24px" }} />
                )}
                {/* You can add more icons conditionally here */}
              </InputAdornment>
            ),
          }}
        />

        <div className="w-full sm:w-auto flex flex-row sm:items-center justify-between gap-2 sm:gap-20 cursor-pointer flex-wrap sm:flex-nowrap">
          {/* <div className="w-full sm:w-auto flex sm:flex-row flex-col sm:items-center justify-between gap-10  sm:gap-40 cursor-pointer"> */}

          {group && <GroupModal listData={listData} />}
          {showSubtask && !tableTask && (
            <StyledMenuItem
              onClick={handleHideSubTask}
              className="w-auto justify-between text-[12px]"
            >
              <SubTaskIcon /> Subtasks: {isSubtask ? "Shown" : "Hidden"}
            </StyledMenuItem>
          )}

          {!filterDesign ? (
            <DropdownMenu
              handleClose={() => {
                if (!isSaveFilterid) {
                  setFilterMenu(null);
                }
                setMainFilterItems(conditions);
              }}
              anchorEl={filterMenu}
              button={
                <Button
                  variant="text"
                  className={`${conditions.length > 0 ? "bg-[#EDEDFC] text-[#4F46E5]" : "bg-[#F6F6F6] text-[#757982]"}
                  h-[40px] text-[12px] flex gap-8 whitespace-nowrap hover:bg-[#E0E0E0] `} // Add hover effect
                  aria-label="Add User"
                  onClick={(event) => setFilterMenu(event.currentTarget)}
                  endIcon={
                    conditions.length > 0 ? (
                      <div className="bg-inherit   flex items-center justify-center rounded-full pr-10">
                        <CrossIcon
                          className="p-2 "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose({ save: true });
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )
                  }
                >
                  <FilterIcon
                    className="shrink-0"
                    fill={conditions.length > 0 ? "#4F46E5" : "#757982"}
                  />
                  Filter
                </Button>
              }
              popoverProps={{
                open: !!filterMenu,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "right",
                },
                classes: {
                  paper: "pt-0 pb-0",
                },
              }}
            >
              <div className="md:w-[890px] max-h-[342px] sm:w-[700px]">
                <div className="text-black text-[16px] font-semibold px-20 py-16 border-b border-b-[#EDF2F6] flex items-center sm:justify-between gap-28">
                  <div>Filter Option</div>
                  <div className="flex items-center gap-10">
                    {mainFilterItems.length != 0 && (
                      <Button
                        className="text-para_light text-[14px]"
                        onClick={() => {
                          handleClose({ save: true });
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="text"
                      className="h-[40px] text-[14px] flex gap-12 text-secondary whitespace-nowrap"
                      onClick={() => handleApply({})}
                      disabled={
                        mainFilterItems.length === 0 ||
                        !allConditionsHaveValuesForAllItems(mainFilterItems)
                      }
                    >
                      Apply
                    </Button>

                    {/* <Button
                      className="h-[30px] text-[12px] text-secondary bg-[#EDEDFC] rounded-4 py-0 whitespace-nowrap"
                      onClick={() => {
                        handleApply({ save: true }), setIsSaveFilter(true);
                      }}
                    >
                      Save Filter
                    </Button> */}
                    <SaveFilter
                      handleApply={handleApply}
                      setIsSaveFilter={setIsSaveFilter}
                      tab={tab}
                      projectId={id}
                    />
                  </div>
                </div>

                {isSaveFilter ? (
                  <div className="h-30">
                    <ListLoading />
                  </div>
                ) : (
                  mainFilterItems.map((mainFilterItem, index) => (
                    <div className="flex" style={{ alignItems: "center" }}>
                      {mainFilterItems.length > 1 && (
                        <div className="sm:w-[10%] ml-20 my-20">
                          {index == 1 && (
                            <SelectField
                              formik={formik}
                              name="role"
                              value={applyOp || "AND"}
                              // placeholder={applyOp  ? "" : "Select Filter"}
                              onChange={(e) => setApplyOp(e.target.value)}
                              sx={{
                                "&.MuiInputBase-root": {
                                  width: "100px",
                                },
                                "& .MuiSelect-select": {
                                  minHeight: "40px",
                                },
                              }}
                            >
                              <MenuItem value="AND">And</MenuItem>
                              <MenuItem value="OR">Or</MenuItem>
                            </SelectField>
                          )}
                          {index != 1 && index != 0 && (
                            <p className="text-center text-[#757982]">
                              {applyOp}
                            </p>
                          )}
                          {index == 0 && (
                            <p className="text-center text-[#757982]">Where</p>
                          )}
                        </div>
                      )}
                      <div
                        className={`px-20 flex py-10 ${mainFilterItems.length > 1 ? "w-[90%]" : "w-full"
                          } flex-col border border-gray-300 m-20 max-w-[300px] sm:max-w-full md:overflow-x-hidden overflow-x-auto`}
                        key={index}
                      >
                        {/* <div className="w-full"> */}
                        {mainFilterItem?.filterConditions?.map(
                          (filterCondition, nestedIndex) => (
                            <FilterCondition
                              key={nestedIndex}
                              length={mainFilterItem?.filterConditions.length}
                              index={nestedIndex}
                              item={filterCondition}
                              selectFilterItems={
                                mainFilterItem?.filterConditions[1]?.applyOp
                              }
                              setSelectFilterItems={(value) =>
                                updateFilterCondition(index, nestedIndex, {
                                  ...filterCondition,
                                  selectFilterItems: value,
                                })
                              }
                              updateFilterCondition={(nestedIndex, condition) =>
                                updateFilterCondition(
                                  index,
                                  nestedIndex,
                                  condition
                                )
                              }
                              deleteFilterCondition={() =>
                                deleteFilterCondition(index, nestedIndex)
                              }
                            />
                          )
                        )}
                        {/* </div> */}

                        <div>
                          {mainFilterItems.length > 0 && (
                            <Button
                              variant="text"
                              className="h-[40px] text-[12px] flex gap-8 font-500 text-[#111827]"
                              aria-label="Add Tasks"
                              size="large"
                              onClick={() => addFilterCondition(index)}
                            >
                              + Add Nested Filter
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="pb-10 ">
                  <Button
                    variant="contained"
                    className="h-[40px] text-[12px] flex gap-8 mx-20 font-600 text-[#4F46E5] bg-[#EDEDFC] mt-20"
                    aria-label="Add Tasks"
                    size="large"
                    onClick={addMainFilter}
                  >
                    + Add Filter
                  </Button>
                </div>
              </div>
            </DropdownMenu>
          ) : (
            <div className="sm:px-20 pr-10 flex gap-32 text-para_light">
              <ProjectMenuItems
                label={"Filter"}
                icon={<FilterIcon />}
                className="bg-[#F6F6F6] rounded-md px-10 py-20 text-[#757982] font-400
                cursor-pointer text-[12px]"
              />
            </div>
          )}
          {sort && <SortByDropdown tableTask={tableTask} tab={tab} />}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default FilterPage;
