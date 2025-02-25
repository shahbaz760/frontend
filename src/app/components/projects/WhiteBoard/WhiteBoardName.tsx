import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import CommonModal from "src/app/components/CommonModal";
import InputField from "src/app/components/InputField";
import * as Yup from "yup";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  saveData?: any;
}

function WhiteBoardName({ isOpen, setIsOpen, saveData }: IProps) {
  const [disable, setDisabled] = useState(false);

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
      saveData(formik.values.name);
      setIsOpen(false);
    },
  });

  const handleSave = () => {
    formik.handleSubmit();
  };

  const handleToggle = () => {

    setIsOpen(false);

    formik.resetForm(); // Reset form values when closing the modal
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={handleToggle}
      modalTitle="Add WhiteBoard"
      maxWidth="314"
      btnTitle="Save"
      closeTitle="Cancel"
      headerBgColor="white"
      bgColor="white"
      titleColor="black"
      onSubmit={handleSave}
      disabled={disable}
    >
      <InputField
        formik={formik}
        name="name"
        label="WhiteBoard Name"
        value={formik.values.name}
        placeholder="Enter WhiteBoard Name"
        className="input-color"
        onClick={(e) => e.stopPropagation()}
      />
    </CommonModal>
  );
}

export default WhiteBoardName;
