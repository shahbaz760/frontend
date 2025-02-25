import {
  DepartmentAdd,
  UpdateDepartment,
  getEditDepartmentDetail,
} from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommonModal from "src/app/components/CommonModal";
import InputField from "src/app/components/InputField";
import { getUserDetail } from "src/utils";
import * as Yup from "yup";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchDepartmentList?: any;
  id?: any;
  setId?: any;
}

function AddfaqModal({
  isOpen,
  setIsOpen,
  fetchDepartmentList,
  id,
  setId,
}: IProps) {
  const [disable, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const userData = getUserDetail();

  const fetchData = async (payload: any) => {
    setDisabled(true);
    try {
      const res = await dispatch(DepartmentAdd(payload));
      setIsOpen(false);
      setDisabled(false);
      fetchDepartmentList();

      toast.success(res?.payload?.data?.message);
      // handleCancel()
    } catch (error) {
      setDisabled(false);
      console.error("Error fetching data:", error);
      setIsOpen(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Question is required.")
      .min(1, "Question is required."),
    answer: Yup.string()
      .trim()
      .required("Answer is required.").test(
        "max-words",
        "Answer cannot exceed 1000 words.",
        (value) => value && value.split(/\s+/).filter(Boolean).length <= 1000
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      answer: ""
    },
    validationSchema,
    onSubmit: (values) => {

      if (id) {
        handleEditSave(values);
      } else {
        fetchData(values);
      }
    },
  });

  const handleSave = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    formik.resetForm();
  };

  const handleEditSave = async (payload: any) => {
    const data = {
      department_id: id,
      name: payload?.name,
      answer: payload?.answer
    };
    setDisabled(true);
    try {
      const res = await dispatch(UpdateDepartment(data));
      setIsOpen(false);
      setDisabled(false);
      fetchDepartmentList();
      setId(null);
      toast.success(res?.payload?.data?.message);
      // handleCancel()
    } catch (error) {
      setDisabled(false);
      console.error("Error fetching data:", error);
      setIsOpen(false);
    }
  };

  const handleToggle = (e) => {
    // e.stopPropagation();
    setIsOpen(false);
    formik.resetForm(); // Reset form values when closing the modal
  };
  const fetchDetails = async (id) => {
    const res = await dispatch(getEditDepartmentDetail(id));
    const data = res?.payload?.data?.data;
    formik.setFieldValue("name", data?.name);
    formik.setFieldValue("answer", data?.answer);
  };

  useEffect(() => {
    if (id && isOpen) {
      fetchDetails(id);
    }
    if (!id && isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  return (
    <CommonModal
      open={isOpen}
      handleToggle={(e) => handleToggle(e)}
      modalTitle={`${id ? "Edit" : "Add"} FAQ`}
      maxWidth="768"
      btnTitle={`${id ? "Save Edit" : "Save"}`}
      closeTitle="Cancel"
      // headerBgColor="white"
      // bgColor="white"
      // titleColor="black"
      onSubmit={formik.handleSubmit}
      disabled={disable}
    >
      <InputField
        formik={formik}
        name="name"
        label="Question"
        value={formik.values.name}
        placeholder="Enter Your Question"
        className="input-color"
        onClick={(e) => e.stopPropagation()}
      />
      <InputField
        type="textarea"
        formik={formik}
        name="answer"
        label="Answer"
        value={formik.values.answer}
        placeholder="Enter Your Answer"
        className="input-color"
        onClick={(e) => e.stopPropagation()}
      />
    </CommonModal>
  );
}

export default AddfaqModal;
