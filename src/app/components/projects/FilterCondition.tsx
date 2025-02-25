import { Button, MenuItem } from "@mui/material";
import { GetFilterDropDetails } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { DeleteIcon } from "public/assets/icons/navabarIcon";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import SelectField from "../selectField";
import NestedFilterDesign from "./NestedFilterDesign";

const FilterCondition = ({
  length,
  index,
  selectFilterItems,
  setSelectFilterItems,
  updateFilterCondition,
  deleteFilterCondition,
  item,
}) => {
  const [applyOp, setApplyOp] = useState(selectFilterItems || "AND");
  const [selectMenuItems, setSelectMenuItems] = useState(
    item?.key == null ? "" : item?.key
  );
  const [op, setOp] = useState(item?.op == null ? 0 : item?.op);
  const [value, setValue] = useState(item?.value || []);
  const { id } = useParams<{ id: string }>();
  const [filterState, setFilterState] = useState([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    updateFilterCondition(index, { applyOp, key: selectMenuItems, op, value });
  }, [applyOp, selectMenuItems, op, value]);

  useEffect(() => {
    if (item?.key && item?.key !== selectMenuItems) {
      setSelectMenuItems(item?.key);
    }

    if (item?.op && item?.op !== op) {
      setOp(item?.op);
    }
    if (item?.value && JSON.stringify(item?.value) !== JSON.stringify(value)) {
      setValue([...item?.value]);
    }
  }, [item?.key, item?.op, item?.value]);

  const showMenuItems = (e) => {
    const { value } = e.target;
    setSelectMenuItems(Number(value));
    setValue([]);
  };

  const handleApplyOpChange = (e) => {
    setApplyOp(e.target.value);
  };

  const handleOpChange = (value) => {
    if (value == "") {
      setOp(0);
    } else {
      setOp(value);
    }
  };

  const handleValueChange = (value) => {
    updateFilterCondition(index, { applyOp, key: selectMenuItems, op, value });
  };

  const formik = useFormik({
    initialValues: {
      role: "",
      verification: "",
    },
    onSubmit: (values) => { },
  });

  const fetchDepartmentList = async () => {
    const payload = {
      project_id: id,
      key: selectMenuItems || 0,
    };
    try {
      const res = await dispatch(GetFilterDropDetails(payload));
      setFilterState(res?.payload?.data?.data?.list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectMenuItems != null) {
      fetchDepartmentList();
    }
  }, [selectMenuItems]);

  return (
    <div className="flex items-center justify-between w-full gap-10">
      <div className="flex  gap-10 sm:mr-[10px]">
        {length > 1 && (
          <>
            {/* // < className="sw-[15%] "> */}
            {index == 1 && (
              <SelectField
                name="role"
                value={applyOp}
                placeholder={applyOp ? "" : "Select Filter"}
                onChange={handleApplyOpChange}
                sx={{
                  "&.MuiInputBase-root": {
                    width: "80px",
                  },
                  "& .MuiSelect-select": {
                    minHeight: "40px",
                  },
                }}
              >
                <MenuItem value="AND" className="">
                  And
                </MenuItem>
                <MenuItem value="OR">Or</MenuItem>
              </SelectField>
            )}
            {index != 1 && index != 0 && (
              <p className="text-center text-[#757982] mt-10 w-[80px] capitalize">
                {selectFilterItems == "AND"
                  ? "And"
                  : selectFilterItems == "OR"
                    ? "Or"
                    : selectFilterItems}
              </p>
            )}
            {index == 0 && (
              <p className="text-center text-[#757982] mt-10 w-[80px] ">
                Where
              </p>
            )}
          </>
        )}
        <div className={`${length > 0 ? "w-[85%]" : "w-full"}  flex  gap-10`}>
          {/* <div className="md:max-w-[35%]"> */}
          <SelectField
            labelId="select-filter-label"
            name="filter"
            value={selectMenuItems}
            placeholder={selectMenuItems !== "" ? "" : "Select Filter"}
            onChange={showMenuItems}
            sx={{
              "&.MuiInputBase-root": {
                "& .MuiSelect-select": {
                  minHeight: "40px",
                  minWidth: "150px",
                },
              },
            }}
          >
            <MenuItem value="0">Status</MenuItem>
            <MenuItem value="1">Assignee</MenuItem>
            <MenuItem value="2">Priority</MenuItem>
            <MenuItem value="3">Label</MenuItem>
            <MenuItem value="4">Due Date</MenuItem>
            <MenuItem value="5">Created By</MenuItem>
          </SelectField>
          {/* </div> */}
          {selectMenuItems.length !== 0 && (
            <div className="flex-1">
              <NestedFilterDesign
                op={op}
                onChange={handleOpChange}
                setValue={handleValueChange}
                value={value}
                filterState={filterState}
                selectMenuItems={selectMenuItems}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        className="text-para_light mb-[24px] hover:bg-transparent"
        onClick={() => deleteFilterCondition(index)}
      >
        {/* <div className="ml-2 h-[40px] hover:bg-[#f6f6f700]  p-4" onClick={() => deleteFilterCondition(index)}> */}
        <DeleteIcon />
        {/* </div> */}
      </Button>
    </div>
  );
};

export default FilterCondition;
