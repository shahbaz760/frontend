import ListLoading from "@fuse/core/ListLoading";
import { MenuItem, styled, useTheme } from "@mui/material";
import { filterType } from "app/store/Client/Interface";
import { GetDepartmentList, addSupportList } from "app/store/Password";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { PriorityIcon } from "public/assets/icons/task-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddNewTicketSchema } from "src/formSchema";
import CommonChip from "../chip";
import CommonModal from "../CommonModal";
import DropdownMenu from "../Dropdown";
import InputField from "../InputField";
import SelectField from "../selectField";
import { getUserDetail } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id?: any;
  fetchSupportList?: any;
  setId?: any;
  create?: boolean;
}

function CreateTicket({
  isOpen,
  setIsOpen,
  id,
  fetchSupportList,
  setId,
  create = false,
}: IProps) {
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const theme = useTheme();
  const [disable, setDisable] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departmentMenu, setDepartmentMenu] = useState([]);
  const [touched, setTouched] = useState(false);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const [show, setShow] = useState(false);
  const defaultDepartment =
    (departmentMenu &&
      departmentMenu?.length > 0 &&
      departmentMenu?.find((item) => item.name == "Account Manager")?.id) ||
    (departmentMenu && departmentMenu?.length > 0 && departmentMenu[0]?.id);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      department: defaultDepartment,
      subject: "",
      message: "",
    },
    enableReinitialize: true,
    validationSchema: AddNewTicketSchema,
    onSubmit: (values) => {
      if (selectedPriority != "") {
        handleSave(values);
        handleCancel();
      }
    },
  });

  const priorityMenuData = [
    // { label: "Pending" },
    { label: "Medium" },
    { label: "High" },
    { label: "Low" },
  ];

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    minWidth: "250px",
  }));
  const userDetails = getUserDetail();
  const handleSave = async (data) => {
    setDisable(true);
    const formData = new FormData();
    formData.append("department_id", data.department);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append("priority", selectedPriority);
    uploadedFiles.forEach((file) => {
      formData.append("files", file); // Note the use of "files[]" to indicate an array of files
    });
    const res = await dispatch(addSupportList(formData));
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      setIsOpen(false);
      fetchSupportList();
      setDisable(false);
    } else {
      setDisable(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setId(null);
  };

  const handlePriorityMenuClick = (data) => {
    setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
  };

  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetDepartmentList(filters));
      // toast.success(res?.payload?.data?.message);
      setDepartmentMenu(res?.payload?.data?.data?.list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDepartmentList();
    }
  }, [isOpen]);

  useEffect(() => {
    const data =
      (departmentMenu &&
        departmentMenu?.length > 0 &&
        departmentMenu?.find((item) => item.name == "Account Manager")?.id) ||
      (departmentMenu && departmentMenu?.length > 0 && departmentMenu[0]?.id);
    formik.setFieldValue("department", data);
    if (data) {
      setShow(true);
    }
  }, [departmentMenu]);


  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => setIsOpen((prev) => !prev)}
      modalTitle={`${create ? "Create a" : id ? "Edit New" : "Add New"}  Ticket`}
      maxWidth="733"
      btnTitle={`${id ? "Save Edit" : "Save"} `}
      closeTitle={"Close"}
      disabled={!show ? true : disable}
      onSubmit={() => {
        formik.handleSubmit();
        setTouched(true);
      }}
    >
      {!show ? (
        <div className="h-[410px]">
          <ListLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-20 mb-20">
          {show && (
            <SelectField
              formik={formik}
              name="department"
              label="Department"
              placeholder="Select Department"
              sx={{
                "& .radioIcon": { display: "none" },
                "& .MuiInputBase-root .MuiSelect-select": {
                  lineHeight: 1.4,
                  color: "#000000",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiMenu-list": {
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    },
                  },
                },
              }}
            >
              {departmentMenu?.length > 0 ? (
                departmentMenu?.map((item) => (
                  <StyledMenuItem key={item?.id} value={item?.id}>
                    {item?.name}
                  </StyledMenuItem>
                ))
              ) : (
                <StyledMenuItem>No Data</StyledMenuItem>
              )}
            </SelectField>
          )}
          <InputField
            formik={formik}
            name="subject"
            label="Subject"
            placeholder="Enter Subject"
          />
          <InputField
            formik={formik}
            name="message"
            label="Message"
            placeholder="Enter Message"
            multiline
            rows={4}
          />

          <div className="flex gap-4 flex-col">
            <DropdownMenu
              anchorEl={priorityMenu}
              name="status"
              handleClose={() => setPriorityMenu(null)}
              button={
                <CommonChip
                  onClick={(event) => setPriorityMenu(event.currentTarget)}
                  label={selectedPriority || "Priority"}
                  icon={<PriorityIcon />}
                  className="max-w-fit"
                />
              }
              popoverProps={{
                open: !!priorityMenu,
                classes: {
                  paper: "pt-10 pb-5 bg-[#ffffff]",
                },
              }}
            >
              {priorityMenuData.map((item) => (
                <StyledMenuItem
                  onClick={() => handlePriorityMenuClick(item.label)}
                >
                  {item.label}
                </StyledMenuItem>
              ))}
            </DropdownMenu>
            <span className=" text-red  block ">
              {touched && selectedPriority == "" ? "Priority is required" : ""}
            </span>
          </div>

          {/* <span className=" text-red  block ">
            {touched && selectedPriority == "" ? "Status is required" : ""}
          </span> */}
        </div>
      )}
    </CommonModal>
  );
}

export default CreateTicket;
