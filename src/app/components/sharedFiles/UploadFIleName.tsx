import { filterType } from "app/store/Client/Interface";
import { addFileList } from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileValidation } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  uploadedFile: any;
  fetchFileList?: any;
  disableouterClick?: boolean;
}

function UploadFileName({
  isOpen,
  setIsOpen,
  uploadedFile,
  fetchFileList,
  disableouterClick,
}: IProps) {
  const [disable, setDisable] = useState(false);
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });

  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: FileValidation,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const handleSave = async (data) => {
    setDisable(true);

    const formData = new FormData();
    formData.append("file_name", data.name);
    formData.append("file", uploadedFile);

    const res = await dispatch(addFileList(formData));
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      fetchFileList();
      setDisable(false);
      setIsOpen(false);
    } else {
      setDisable(false);
      setIsOpen(false);
    }
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen((prev) => !prev)}
      modalTitle="Upload Name"
      maxWidth="390"
      btnTitle="Save"
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={disable}
      disableouterClick={true}
    >
      <div className="flex flex-col gap-20 mb-20">
        <InputField
          formik={formik}
          name="name"
          label="Give Your Upload Name"
          placeholder="Enter Upload Name"
          focused={true}
        />
      </div>
    </CommonModal>
  );
}

export default UploadFileName;
