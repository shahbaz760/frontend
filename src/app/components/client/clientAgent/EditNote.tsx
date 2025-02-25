import {
  DepartmentAdd,
  UpdateDepartment,
  getEditDepartmentDetail,
} from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import CommonModal from "../../CommonModal";
import InputField from "../../InputField";
import { getUserDetail } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchDepartmentList?: any;
  id?: any;
  setId?: any;
  handleSave?: any;
  loading?: boolean;
  setNewMessage?: any
  name?: any
}

function EditNoteModal({
  isOpen,
  setIsOpen,
  name,
  handleSave,
  loading,
}: IProps) {



  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Note is required.")
      .min(1, "Note is required."),
  });

  const formik = useFormik({
    initialValues: {
      name: name,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {

      handleEditSave(values.name);
      setIsOpen(false);
      formik.resetForm();

    },
  });
  const handleEditSave = (value) => {
    handleSave(value)
  }






  const handleToggle = (e) => {
    setIsOpen(false);
    formik.resetForm();
  };


  useEffect(() => {
    formik.resetForm();
  }, [isOpen]);
  return (
    <CommonModal
      open={isOpen}
      handleToggle={(e) => handleToggle(e)}
      modalTitle="Edit Note"
      maxWidth="314"
      btnTitle={`Save Edit`}
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={loading}
    >
      <InputField
        formik={formik}
        name="name"
        label="Note"
        value={formik.values.name}
        placeholder="Enter Note"
        className="input-color"
        onClick={(e) => e.stopPropagation()}
      />
    </CommonModal>
  );
}

export default EditNoteModal;
