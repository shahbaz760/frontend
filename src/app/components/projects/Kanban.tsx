import ListLoading from "@fuse/core/ListLoading";
import { Button, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
  projectColumnAdd,
  projectColumnList,
  projectColumnMove,
  updateProjectBoardListMove,
  updateProjectColumnList,
} from "app/store/Projects";
import { ProjectRootState } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getUserDetail } from "src/utils";
import * as Yup from "yup";
import DragLayout from "../dashboard/DragLayout";
import InputField from "../InputField";
import FilterPage from "./FilterPage";

interface IProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  fetchList?: () => void;
  fetchUpdateData?: (any) => void;
  setId?: Dispatch<SetStateAction<number | null>>;
  isEditing?: boolean;
  id?: number | null;
  isCombineEnabled?: false;
}

const Kanban = (props: IProps): JSX.Element => {
  const {
    isOpen,
    setIsOpen,
    fetchList,
    isEditing,
    setIsEditing,
    fetchUpdateData,
    setId,
    isCombineEnabled,
  } = props;
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const theme: Theme = useTheme();
  const [addCard, setAddCard] = useState(false);
  const [tableSelectedItemDesign, setTableSelectedItemDesign] =
    useState("Priority");
  const [error, setError] = useState("");
  const [previous, setPrevious] = useState("");
  const [columnIds, setColumnIds] = useState<any>();
  const [disabled, setDisable] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required.")
      .min(1, "Name is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setPrevious(values?.name);
      fetchData(values);
    },
  });

  const fetchData = async (payload: any) => {
    setDisable(true);
    const data: any = {
      project_id: id as string,
      name: payload.name,
    };
    try {
      const res = await dispatch(projectColumnAdd(data));
      if (res?.payload?.data?.status == 1) {
        toast.success(res?.payload?.data?.message);
        formik.setFieldValue("name", "");
        formik.resetForm();
        listData({});

        if (setIsOpen) setIsOpen((prev) => !prev);
        if (setIsEditing) setIsEditing(false);
        if (setId) setId(null);
        setDisable(false);
        setAddCard(!addCard);
      } else {
        setDisable(false);
        setError(res?.payload?.data?.message);
      }
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  const {
    fetchStatusNew,
    searchStatus,
    filterdata,
    filtered,
    conditions,
    MainOp,
    sorting,
    projectColumnData,
    layoutBasedGroup,
  } = useSelector((store: ProjectRootState) => store?.project);

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
        key: groupkey || filterdata.key,
        order: order || filterdata.order,
      },
      sort: sort.length > 0 ? sort : sorting.length > 0 ? sorting : [],
      filter: condition.length > 0 ? transformArray(condition) : conditions,
      is_view: 0,
      is_filter_save: 0,
    };
    try {
      const res = await dispatch(projectColumnList({ payload, loader, drag }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveColumns = async (payload: {
    project_id: string;
    column_ids: any[];
  }) => {
    try {
      const res = await dispatch(projectColumnMove(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSave = () => {
    formik.handleSubmit();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedColumns = Array.from(projectColumnData);
    const [removed] = reorderedColumns?.splice(result.source.index, 1);
    reorderedColumns.splice(result?.destination?.index, 0, removed);

    // Directly create the payload here with the new column order
    const payload = {
      project_id: id,
      column_ids: reorderedColumns?.map((column) => column.id),
    };

    try {
      dispatch(updateProjectBoardListMove(reorderedColumns));
      await moveColumns(payload);
    } catch (error) {
      console.error("Error moving column:", error);
    }
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem(`columnOrder-${id}`);
    if (savedOrder) {
      dispatch(updateProjectBoardListMove(JSON.parse(savedOrder)));
    } else {
      listData({});
    }
  }, [id]);

  if (fetchStatusNew == "loading") {
    return <ListLoading />;
  }

  return (
    <div>
      <div className="shadow-md bg-white rounded-lg mx-[15px] mb-20 ">
        <FilterPage tab={0} />
      </div>
      {layoutBasedGroup == "loading" ? (
        <ListLoading />
      ) : (
        <div
          className={`flex ${
            projectColumnData?.length > 0 ? "gap-20" : ""
          } overflow-x-auto px-[15px] items-start h-[calc(100vh-314px)]`}
        >
          <DragLayout id={id} DraglistData={listData} />

          {/* {userDetails?.role_id != 3 && */}
          {filterdata?.key > 0
            ? null
            : searchStatus !== "loading" && (
                <div className="min-w-[322px] bg-white p-14 py-[20px] rounded-lg shadow-md">
                  {!addCard && (
                    <div
                      className="flex gap-10 items-center cursor-pointer w-fit"
                      onClick={() => setAddCard(!addCard)}
                    >
                      <PlusIcon color={theme.palette.secondary.main} />
                      <Typography
                        className="text-[16px] font-semibold"
                        color="secondary.main"
                      >
                        Create New Column
                      </Typography>
                    </div>
                  )}
                  {addCard && (
                    <div>
                      <InputField
                        formik={formik}
                        name="name"
                        label="Column Name"
                        placeholder="Enter Column Name"
                        onChange={(e) => {
                          formik.setFieldValue("name", e.target.value);
                          setError("");
                        }}
                        autoFocus
                      />
                      <div className=" text-red block ">{error}</div>
                      <div className="mt-20  ">
                        <Button
                          variant="contained"
                          color="secondary"
                          className="w-[110px] h-[48px] text-[16px] font-400"
                          onClick={handleSave}
                          disabled={disabled}
                          style={{ height: "20px" }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          className="w-[110px] text-[16px] font-400 ml-12"
                          onClick={() => {
                            setAddCard(!addCard);
                            formik.setFieldValue("name", "");
                            formik.resetForm();
                          }}
                          disabled={disabled}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>
      )}
    </div>
  );
};

export default Kanban;
