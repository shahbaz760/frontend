import ListLoading from "@fuse/core/ListLoading";
import { Checkbox, InputAdornment } from "@mui/material";
import {
  addAgentGroup,
  addAgentInagentGroup,
  getGroupMemberDetail,
  searchAgentGroup,
} from "app/store/Agent group";
import {
  AgentGroupRootState,
  AgentGroupType,
} from "app/store/Agent group/Interface";
import { restAll } from "app/store/Client";
import { filterType } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { AddAgentGroupSchema, AddFilterSchema } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isNewAgent?: boolean;
  fetchAgentGroupList?: () => void;
  filterPagination?: any;
  isSaveFilter?: boolean;
}

function AddGroupModel({
  isOpen,
  setIsOpen,
  isNewAgent,
  filterPagination,
  isSaveFilter,
  fetchAgentGroupList,
}: IProps) {
  const agentGroupState = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );
  const { searchAgentList, status, addagentList } = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );
  // (addagentList, "pp");
  const [checked, setChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isValid, setisValid] = useState<boolean>(false);
  const [searchList, setSearchList] = useState("");
  const [initialRender, setInitialRender] = useState(false);
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const { group_id } = useParams();

  const dispatch = useAppDispatch();

  const onSubmit = async (values: AgentGroupType, { resetForm }) => {
    setLoading(true);
    const { payload } = await dispatch(
      addAgentGroup({ group_name: values?.group_names })
    );

    if (payload?.data?.status == 1) {
      setLoading(false);
      fetchAgentGroupList();
      resetForm();
    }
  };

  const handleAddmember = async () => {
    await dispatch(
      searchAgentGroup({
        group_id: group_id,
        agent_ids: checkedItems,
        delete_agent_ids: [],
      })
    );
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: "",
    }));
    if (checkedItems.length! == 0) {
      setisValid(true);
    }
    dispatch(addAgentInagentGroup({ ...filterMenu, group_id: group_id }));
    dispatch(getGroupMemberDetail({ ...filterPagination, group_id }));
    setIsOpen(false);
    setInitialRender(false);
    setSearchList("");
    setCheckedItems([]);

    // Handle the case when there is an id (e.g., updating an existing group)
  };

  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prevState) =>
      prevState.includes(id)
        ? prevState?.filter((item) => item !== id)
        : [...prevState, id]
    );
  };

  const { start, limit, search } = filterMenu;
  const formik = useFormik({
    initialValues: {
      group_names: "",
    },
    validationSchema: isSaveFilter ? AddFilterSchema : AddAgentGroupSchema,
    onSubmit,
  });
  const debouncedSearch = useCallback(debounce((searchValue) => {

    dispatch(addAgentInagentGroup({ ...filterMenu, search: searchValue, group_id: group_id }));
    setInitialRender(true)
  }, 800), []); // Adjust the delay as needed (300ms in this example)
  useEffect(() => {
    if (searchList == "") {
      setInitialRender(false)
    }
  }, [searchList])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchList(value);
    setFilterMenu((prevFilters) => ({
      ...prevFilters,
      search: value,
    }));
    debouncedSearch(value);
  };

  useEffect(() => {
    if (isNewAgent && isOpen && initialRender) {
      dispatch(addAgentInagentGroup({ ...filterMenu, group_id: group_id }));
    }
  }, [start, limit]);

  useEffect(() => {
    if (!!agentGroupState?.successMsg) {
      dispatch(restAll());
      if (!isNewAgent) {
        setIsOpen(false);
      }
      formik.resetForm();
    } else if (!!agentGroupState?.errorMsg) {

      setIsOpen(true);
    }
  }, [agentGroupState]);

  const handleToggle = (e: React.MouseEvent) => {

    setInitialRender(false);
    setSearchList("");
    // debouncedSearch("");
    setCheckedItems([]);
    setIsOpen(false);
    formik.resetForm(); // Reset form values when closing the modal
  };
  useEffect(() => {
    if (checkedItems.length > 0) {
      setisValid(true);
    } else {
      setisValid(false);
    }
  }, [checkedItems]);


  return (
    <CommonModal
      open={isOpen}
      handleToggle={handleToggle}
      modalTitle={
        isNewAgent
          ? "Add Agent"
          : isSaveFilter
            ? "Save Personal Filter"
            : "Add Group"
      }
      maxWidth={isSaveFilter ? "387" : "733"}
      btnTitle={loading ? <ListLoading /> : "Save"}
      closeTitle="Cancel"
      onSubmit={isNewAgent ? handleAddmember : formik.handleSubmit}
      disabled={(isNewAgent && agentGroupState.actionStatus && searchList != "") || loading && searchList != ""}
      isValid={!!isNewAgent ? isValid : true}
    >
      <div className="flex flex-col   ">
        {isNewAgent ? (
          <>
            <InputField
              formik={formik}
              name="groupName"
              label="Agent"
              onChange={handleSearchChange}
              placeholder="Search Agent with Name"
              sx={{ backgroundColor: "#F6F6F6", borderRadius: "8px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="text-[16px] font-600 text-[#111827] bg-[#F6F6F6] pl-10">
                      <SearchIcon />
                    </span>
                  </InputAdornment>
                ),
              }}
            />
            <div className=" max-h-[200px] w-full overflow-y-auto shadow-sm cursor-pointer">
              {status == "loading" && searchList != "" ? (
                <ListLoading />
              ) : (
                <>
                  {initialRender && searchList != "" && status != "loading" && (
                    <>
                      {searchAgentList.map((item: any) => (
                        <label
                          className="flex items-center gap-10 px-20 cursor-pointer w-full"
                          key={item.id}
                        // onClick={() => handleCheckboxChange(item.id)}
                        >
                          <Checkbox
                            checked={checkedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "transparent", // No hover background globally
                              },
                            }}
                          />
                          <span
                            className=""
                          // onClick={() => handleCheckboxChange(item.id)}
                          >
                            {item.first_name + " " + item.last_name}
                          </span>
                        </label>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <InputField
            formik={formik}
            name="group_names"
            id="group_names"
            label={isSaveFilter ? "Name Your Filter" : "Group Name"}
            placeholder={isSaveFilter ? "Enter Name" : "Enter Group Name"}
          />
        )}
      </div>
    </CommonModal>
  );
}

export default AddGroupModel;
