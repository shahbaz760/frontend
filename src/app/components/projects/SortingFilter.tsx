import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Button,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  TaskListColumn,
  projectColumnList,
  setCondition,
  setFilter,
  setFilterData,
  setMainOp,
  setSortFilter,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { ProjectNavIconArrow } from "public/assets/icons/projectsIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
const options = [
  { label: "Task Title", value: 1 },
  { label: "Status", value: 2 },
  { label: "Assignee", value: 3 },
  { label: "Priority", value: 4 },
  { label: "Label", value: 5 },
  { label: "Due Date", value: 6 },
];
const SortByDropdown = ({ tableTask = false, tab }) => {
  const location = useLocation();
  const { id, uuid, name, subuuid } = useParams();
  const {
    fetchStatusNew,
    searchStatus,
    filterdata,
    filtered,
    conditions,
    MainOp,
    sorting,
  } = useSelector((store: ProjectRootState) => store?.project);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [prevSelectedOptions, setPrevSelectedOptions] = useState([]);
  const [buttonDisable, setButtonDisabled] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    if (selectedOptions.length == 0 || sorting.length == 0) {
      setSelectedOptions([]);
    }
  };

  const listData = async ({
    task_start = 0,
    columnid = 0,
    loader = true,
    drag = true,
    search = null,
    applyopMain = "",
    filter = null,
    groupkey = null,
    order = 0,
    sort = [],
    condition = [],
    is_filter_save = 0,
  }) => {
    const transformArray = (inputArray) => {
      return inputArray.map((item) => ({
        applyOp: applyopMain != "" ? applyopMain : MainOp,
        condition: item.filterConditions?.map((cond) => ({
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
        key: groupkey != null ? groupkey : filterdata?.key,
        order: order || filterdata?.order,
      },
      sort: sort.length > 0 ? sort : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
      is_view: tab,
      is_filter_save: is_filter_save,
    };

    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
      const updatedList = res?.payload?.data?.data?.list;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const taskLIstData = async ({
    search = null,
    applyopMain = "",
    filter = null,
    sort = [],
    start = 0,
    is_filter_save = 0,
    condition = [],
    loading = true,
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
      type: 0,
      // is_filter: filter != null ? filter : filtered,
      sort: sort.length > 0 ? sort : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
      is_view: tab,
      is_filter_save: is_filter_save,
    };
    const taskLists = await dispatch(TaskListColumn({ payload, loading }));
    const task = taskLists?.payload?.data?.data?.list;
  };

  // const handleToggle = (value) => {
  //   const currentOption = selectedOptions.find((item) => item.key === value);
  //   let newSelectedOptions = [];
  //   if (!currentOption) {
  //     // If the option is not selected, add it with ascending order
  //     newSelectedOptions = [...selectedOptions, { key: value, order: 0 }];
  //   } else {
  //     // If the option is already selected, remove it from the selected options
  //     newSelectedOptions = selectedOptions.filter((item) => item.key !== value);
  //   }
  //   setSelectedOptions(newSelectedOptions);
  // };

  // const handleOrderChange = (value, order) => {
  //   setSelectedOptions((prevOptions) =>
  //     prevOptions.map((item) =>
  //       item.key === value ? { ...item, order } : item
  //     )
  //   );
  // };

  // ---------below for single select above for multiple select------

  const handleToggle = (value) => {
    const currentOption = selectedOptions.find((item) => item.key === value);
    let newSelectedOptions = [];

    if (!currentOption && value > 0) {
      // If no option is selected, select the new option with ascending order

      newSelectedOptions = [{ key: value, order: 0 }];
    } else {
      // If the same option is selected, deselect it
      newSelectedOptions = [];
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleOrderChange = (value, order) => {
    if (value > 0) {
      setSelectedOptions([{ key: value, order }]); // Since only one option can be selected
    }
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
    handleClose();
    // if (sorting.length > 0) {
    tableTask
      ? taskLIstData({
          search: "",
          loading: false,
          filter: 0,
          sort: [],
          is_filter_save: 1,
        })
      : listData({
          search: "",
          loader: false,
          filter: filterdata.key != null ? 1 : conditions.length > 0 ? 1 : 0,
          order: null,
          sort: [],
          is_filter_save: 1,
          groupkey: filterdata.key,
        });
    dispatch(setFilter(0));
    setPrevSelectedOptions([]);
    dispatch(setSortFilter([]));
    // }
  };
  const getOptionOrder = (value) => {
    const foundOption = selectedOptions.find((item) => item.key === value);
    return foundOption ? foundOption.order : null;
  };

  useEffect(() => {
    // Compare arrays and enable/disable the button accordingly
    if (arraysAreDifferent(sorting, selectedOptions)) {
      setButtonDisabled(false); // Enable button
    } else {
      setButtonDisabled(true); // Disable button
    }
  }, [selectedOptions, prevSelectedOptions]);

  const arraysAreDifferent = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return true;
    // Compare each element of the arrays
    return arr1.some((item, index) => item !== arr2[index]);
  };

  const handleApply = ({ save = false }) => {
    tableTask
      ? taskLIstData({
          search: "",
          loading: false,
          filter: 1,
          sort: selectedOptions.length > 0 ? selectedOptions : [],
          is_filter_save: save ? 1 : 0,
        })
      : listData({
          search: "",
          loader: false,
          filter: 1,
          order: null,
          sort: selectedOptions.length > 0 ? selectedOptions : [],
          is_filter_save: save ? 1 : 0,
        });
    dispatch(setFilter(1));
    setPrevSelectedOptions(selectedOptions);
    handleClose();
    dispatch(setSortFilter(selectedOptions));
  };

  useEffect(() => {
    if (sorting.length > 0) {
      setSelectedOptions([...sorting]);
    } else if (selectedOptions.length > 0) {
      setSelectedOptions([...selectedOptions]);
    } else {
      setSelectedOptions([...prevSelectedOptions]);
    }
  }, [anchorEl]);
  return (
    <>
      <div
        className={`${selectedOptions.length > 0 ? "bg-[#EDEDFC] text-[#4F46E5] " : "bg-[#F6F6F6] text-[#757982]"}
         flex items-center  justify-between px-5 sm:px-20 py-10 sm:py-10 rounded-md min-w-[200px]  hover:bg-[#0000001f] `}
        onClick={handleClick}
      >
        <Typography
          className={` text-[12px] sm:text-[12px] whitespace-nowrap  `}
        >
          {selectedOptions.length > 1
            ? `${selectedOptions.length} Sorts`
            : selectedOptions.length == 1
              ? `Sort By: ${options.find((item) => item.value == selectedOptions[0].key)?.label}`
              : "Sort By"}
        </Typography>
        {anchorEl == null ? (
          <ProjectNavIconArrow
            className="arrow-icon"
            color=""
            fill={selectedOptions.length > 0 ? "#4F46E5" : "#757982"}
          ></ProjectNavIconArrow>
        ) : (
          <UpArrowBlank
            className="cursor-pointer"
            fill={selectedOptions.length > 0 ? "#4F46E5" : "#757982"}
          />
        )}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleClose();
        }}
      >
        <div
          className="flex gap-[8px] justify-end px-20"
          style={{ width: "265px" }}
        >
          <Button
            className="text-para_light text-[12px]"
            onClick={() => handleClearAll()}
          >
            Clear All
          </Button>
          <Button
            className="h-[20px] text-[12px] flex gap-12 text-secondary whitespace-nowrap"
            onClick={() => handleApply({})}
            disabled={buttonDisable}
          >
            Apply
          </Button>
          <Button
            className="h-[30px] text-[12px] text-secondary bg-[#EDEDFC] rounded-4 py-0 whitespace-nowrap"
            onClick={() => handleApply({ save: true })}
            // disabled={buttonDisable}
          >
            Save Filter
          </Button>
        </div>
        <p className="text-[12px] font-600 text-[#87909E] px-20 pt-10 pb-10">
          Sort By
        </p>
        {options.map(({ label, value }) => (
          <MenuItem key={value}>
            <div
              className="flex items-center  w-[165px]"
              onClick={() => handleToggle(value)}
            >
              <Checkbox
                checked={!!getOptionOrder(value) || getOptionOrder(value) === 0}
                onClick={() => handleToggle(value)}
                className="hover:!bg-transparent"
              />
              <ListItemText primary={label} />
            </div>
            <ListItemIcon>
              {getOptionOrder(value) === 0 && (
                <ArrowUpwardIcon
                  fontSize="small"
                  onClick={() => handleOrderChange(value, 1)}
                />
              )}
              {getOptionOrder(value) === 1 && (
                <ArrowDownwardIcon
                  fontSize="small"
                  onClick={() => handleOrderChange(value, 0)}
                />
              )}
              {getOptionOrder(value) === null && (
                <IconButton size="small">
                  <ArrowUpwardIcon fontSize="small" style={{ opacity: 0.5 }} />
                  <ArrowDownwardIcon
                    fontSize="small"
                    style={{ opacity: 0.5 }}
                  />
                </IconButton>
              )}
            </ListItemIcon>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default SortByDropdown;
