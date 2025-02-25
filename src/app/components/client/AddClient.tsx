import { addClient, restAll } from "app/store/Client";
import { ClientRootState, ClientType } from "app/store/Client/Interface";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addClientSchema } from "src/formSchema";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import toast from "react-hot-toast";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchList: () => void;
}

function AddClient({ isOpen, setIsOpen, fetchList }: IProps) {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const clientState = useSelector((store: ClientRootState) => store.client);

  const onSubmit = async (values: ClientType, { resetForm }) => {
    const { payload } = await dispatch(
      addClient({ ...values, is_welcome_email: isChecked ? 1 : 0 })
    );
    if (payload?.data?.status) {
      resetForm();
    }
    if (payload?.data?.status == 0) {
      toast.error(payload?.data?.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsChecked(true); // Reset the checkbox state to checked when modal opens
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      company_name: "",
    },
    validationSchema: addClientSchema,
    onSubmit,
  });
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    if (!!clientState?.successMsg) {
      dispatch(restAll());
      fetchList();
      setIsOpen(false);

      formik.resetForm();
    } else if (!!clientState?.errorMsg) {
      dispatch(restAll());
    }
  }, [clientState, isOpen]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev);
        formik.resetForm();
        setIsChecked(true);
      }}
      modalTitle="Add Client"
      maxWidth="910"
      btnTitle="Save"
      onSubmit={formik.handleSubmit}
      disabled={clientState.actionStatus}
      closeTitle="Cancel"
    >
      <div className="flex flex-col gap-20">
        <InputField
          formik={formik}
          name="first_name"
          label="First Name"
          placeholder="Enter First Name"
        />
        <InputField
          formik={formik}
          name="last_name"
          label="Last Name"
          placeholder="Enter Last Name"
        />
        <InputField
          formik={formik}
          name="email"
          label="Email Address"
          placeholder="Enter Email Address"
        />
        <InputField
          formik={formik}
          name="company_name"
          label="Company Name"
          placeholder="Enter Company Name"
        />
        <div className="flex  items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="h-16 w-16 cursor-pointer"
          />
          <span className="ml-10 text-[16px] font-500 text-[#111827]">
            Do you want to send the welcome email
          </span>
        </div>
      </div>
    </CommonModal>
  );
}

export default AddClient;
