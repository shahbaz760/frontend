import ListLoading from "@fuse/core/ListLoading";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import { AddFilterSchema } from "src/formSchema";
import CommonModal from "../../CommonModal";
import InputField from "../../InputField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isNewAgent?: boolean;
  handleSubmit?: any;
  filterPagination?: any;
  isSaveFilter?: boolean;
}

function AddFilterModel({
  isOpen,
  setIsOpen,
  isNewAgent,
  filterPagination,
  isSaveFilter,
  handleSubmit,
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      group_names: "",
    },
    validationSchema: AddFilterSchema, // The Yup validation schema
    onSubmit: (values) => {
      setLoading(true); // Set loading state before submission
      handleSubmit(values.group_names); // Call the handleSubmit function with group_names
      setTimeout(() => {
        setLoading(false);
      }, 500); // Optionally, you can reset loading after handling submission
    },
  });

  const handleToggle = () => {
    setIsOpen(false);
    formik.resetForm(); // Reset form values when closing the modal
  };

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
      maxWidth={"387"}
      btnTitle={loading ? <ListLoading /> : "Save"}
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={loading}
      isValid={true}
    >
      <div className="flex flex-col  mb-20 ">
        <InputField
          formik={formik}
          name="group_names"
          id="group_names"
          label={"Name Your Filter"}
          placeholder={"Enter Name"}
        />
      </div>
    </CommonModal>
  );
}

export default AddFilterModel;
