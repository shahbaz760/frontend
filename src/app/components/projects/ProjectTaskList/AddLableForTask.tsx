import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, Checkbox } from "@mui/material";
import { useAppDispatch } from "app/store/store";
import { CrossGreyIcon, LabelIcon } from "public/assets/icons/common";
import { useEffect, useState } from "react";
import DropdownMenu from "../../Dropdown";
import InputField from "../../InputField";
import CommonChip from "../../chip";
import CustomButton from "../../custom_button";
import { useStore } from "react-redux";
import { useSelector } from "react-redux";
import { ProjectRootState } from "app/store/Projects/Interface";
import { AgentRootState } from "app/store/Agent/Interafce";
import {
  AddLabellList,
  DeleteLabel,
  getAgentList,
  getLabelList,
} from "app/store/Agent";
import { useFormik } from "formik";
import ListLoading from "@fuse/core/ListLoading";
import DeleteClient from "../../client/DeleteClient";
import { LabelList } from "recharts";

const AddLableForTask = ({
  project_id,
  setSelectedLabels,
  selectedLabels,
  handleEditTaskTitle,
  onclick,
  size = false,
  showSelectedLabels,
}) => {
  const [labelsMenu, setLabelsMenu] = useState<HTMLElement | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("Labels");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const [isLabelList, setIsLabelList] = useState<number>(null);
  const [isLabelLists, setIsLabelLists] = useState([]);
  const [showLabelForm, setShowLabelForm] = useState<boolean>(false);
  const [isLabelLoading, setIsLabelLoading] = useState<boolean>(false);
  const { taskLabelList } = useSelector((store: AgentRootState) => store.agent);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setIsLabelLists(selectedLabels);
  }, [labelsMenu]);

  const handleLabelSelect = (agentId) => {
    if (isLabelLists.includes(agentId)) {
      setIsLabelLists(isLabelLists.filter((id) => id != agentId));
      setSelectedLabels(isLabelLists.filter((id) => id != agentId));
      if (isLabelLists?.length == 1) {
        setSelectedLabel("Labels");
      }
    } else {
      // If not selected, add to selection
      setIsLabelLists((prevSelectedLabels) => [...prevSelectedLabels, agentId]);
      setSelectedLabels((prevSelectedLabels) => [
        ...prevSelectedLabels,
        agentId,
      ]);
    }
  };

  const handleAddLabel = () => {
    setShowLabelForm(true);
  };

  const formik = useFormik({
    initialValues: {
      newLabel: "",
    },
    onSubmit: (values) => { },
  });
  const fetchLabel = async () => {
    await dispatch(
      getLabelList({ project_id: project_id, start: 0, limit: 10 })
    );
  };

  const handleDelete = (id: number) => {
    dispatch(DeleteLabel(id)).then((res) => {
      setIsLabelLoading(false);
      // setLabelsMenu(null);
      if (isLabelLists.length > 0) {
        setIsLabelLists((prevLabels) =>
          prevLabels.filter((label) => label != id)
        );
      } else {
        setIsLabelLists([]);
      }
      fetchLabel();
      formik.setFieldValue("newLabel", "");
      setShowLabelForm(false);
      setSelectedLabel("Labels");
    });
    setIsLabelLoading(false);
    setIsOpenDeletedModal(false);
  };

  const handleLabelSave = () => {
    if (formik?.values?.newLabel) {
      setLoading(true); // Start loader
      dispatch(
        AddLabellList({
          project_id: project_id,
          label: formik?.values?.newLabel,
        })
      )
        .then((res) => {
          if (isLabelLists.length > 0) {
            setIsLabelLists((prevLabels) =>
              prevLabels.filter((label) => label.id != isLabelLists)
            );
          }
          setLoading(false); // Stop loader
          setLabelsMenu(null);
          formik.setFieldValue("newLabel", "");
          fetchLabel();

          setShowLabelForm(false);
        })
        .catch(() => {
          setLoading(false); // Stop loader on error
        });
    }
  };

  const handleCloseDropdown = () => {
    setLabelsMenu(null);
    // handleEditTaskTitle(true);
    setIsLabelLists([]);
  };
  const handleSave = () => {
    handleEditTaskTitle(true);
    setLabelsMenu(null);
  };
  // useEffect(() => {
  //   if (showSelectedLabels) {
  //     const labelIds = showSelectedLabels.map((item) => item?.label_id);
  //     setSelectedLabel(labelIds);
  //   }
  // }, [showSelectedLabels]);

  return (
    <>
      <DropdownMenu
        anchorEl={labelsMenu}
        handleClose={handleCloseDropdown}
        button={
          <CommonChip
            onClick={(event) => {
              onclick();
              setLabelsMenu(event.currentTarget);
              setSelectedLabels(selectedLabels || []);
              setIsLabelLists(isLabelLists || []);
            }}
            // label={selectedlabel}
            className={` !p-0 !bg-transparent max-h-[22px] max-w-[22px] rounded-6 ${labelsMenu && size ? " " : ""
              }`}
            height={true}
            // label={<TruncateText text={selectedlabel} maxWidth={170} />}
            icon={
              <FuseSvgIcon
                size={size ? 22 : 20}
                // @ts-ignore
                color={"#757982"}
                style={{
                  ...(size
                    ? {
                      boxShadow: "none !important",
                      background: "#fff",
                      borderRadius: "6px",
                      padding: 4,
                    }
                    : {}),
                }}
              >
                heroicons-outline:tag
              </FuseSvgIcon>
            }
          />
        }
        popoverProps={{
          open: !!labelsMenu,
        }}
      >
        {!showLabelForm ? (
          <>
            <div className="max-h-[200px] overflow-y-auto ">
              <div className="flex items-end justify-end px-10 pb-10">
                <Button
                  variant="text"
                  color="secondary"
                  className="w-[30px] h-[10px] text-[18px] rounded-6 flex justify-right it"
                  onClick={handleSave} // Add the appropriate onClick handler
                >
                  Save
                </Button>
              </div>
              {taskLabelList?.map((item, index) => {
                return (
                  <>
                    <div
                      className="flex items-center gap-10 px-20 w-full"
                      key={item.id}
                    >
                      <label className="flex items-center gap-10 w-full cursor-pointer">
                        <Checkbox
                          className="d-none hover:!bg-transparent"
                          checked={// index + 1 > labelCount ||
                            isLabelLists?.includes(item.id)}
                          onChange={() => {
                            handleLabelSelect(item.id);
                          }}
                        />
                        <span>{item?.label}</span>
                      </label>
                      <div>
                        <CrossGreyIcon
                          onClick={() => {
                            setIsOpenDeletedModal(true),
                              setIsLabelList(item.id);
                          }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="px-20 py-20">
              <CustomButton
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={
                  <FuseSvgIcon>material-outline:add_circle_outline</FuseSvgIcon>
                }
                className="min-w-[224px] mt-10 "
                onClick={handleAddLabel}
              >
                Create New Label
              </CustomButton>
            </div>
          </>
        ) : (
          <div className="px-20  py-20">
            <InputField
              formik={formik}
              name="newLabel"
              id="group_names"
              label="New Label"
              placeholder="Enter New Label"
            />
            <div className="mt-20">
              <Button
                variant="contained"
                color="secondary"
                className="sm:w-[156px] h-[48px] text-[16px] font-400"
                disabled={formik?.values?.newLabel.trim() == "" || loading}
                onClick={() => handleLabelSave()}
              >
                {loading ? <ListLoading /> : "Save"}
              </Button>
              <Button
                variant="outlined"
                // disabled={disabled}
                color="secondary"
                className="sm:w-[156px] h-[48px] text-[16px] font-400 ml-14"
                onClick={() => {
                  setLabelsMenu(null);
                  // formik.setFieldValue("newLabel", "");
                  // setShowLabelForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DropdownMenu>

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => {
          handleDelete(isLabelList);
        }}
        heading={`Delete Label`}
        description={`Are you sure you want to delete this Label
  ? `}
        isLoading={isLabelLoading}
      />
    </>
  );
};

export default AddLableForTask;
