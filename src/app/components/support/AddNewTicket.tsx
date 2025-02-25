import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import InputField from "../InputField";
import SelectField from "../selectField";
import CommonChip from "../chip";
import {
  PriorityIcon,
  StatusIcon,
  UploadIcon,
} from "public/assets/icons/task-icons";
import DropdownMenu from "../Dropdown";
import { Dropdown } from "@mui/base";
import { AddNewTicketSchema } from "src/formSchema";
import toast from "react-hot-toast";
import { RootState, useAppDispatch } from "app/store/store";
import {
  GetDepartmentList,
  addSupportList,
  getEditSupporttDetail,
  updateSupportList,
} from "app/store/Password";
import { filterType } from "app/store/Client/Interface";
import { CrossGreyIcon, PreviewIcon } from "public/assets/icons/common";
import {
  AttachmentDeleteIcon,
  AttachmentIcon,
} from "public/assets/icons/supportIcons";
import DeleteClient from "../client/DeleteClient";
import { useParams, useSearchParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import { useSelector } from "react-redux";
import { getUserDetail, removeDash } from "src/utils";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id?: any;
  fetchSupportList?: any;
  setId?: any;
}

function AddNewTicket({
  isOpen,
  setIsOpen,
  id,
  fetchSupportList,
  setId,
}: IProps) {
  const [priorityMenu, setPriorityMenu] = useState<HTMLElement | null>(null);
  const [statusMenu, setStatusMenu] = useState<HTMLElement | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const theme = useTheme();
  const [disable, setDisable] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [departmentMenu, setDepartmentMenu] = useState([]);
  const [touched, setTouched] = useState(false);
  const [uploadedFilesNew, setUploadedFilesNew] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [deleteId, setIsDeleteId] = useState<number>(null);
  const [deleteid, setDeleteId] = useState([]);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const PasswordState = useSelector((state: RootState) => state.password);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const userDetails = getUserDetail();
  // const { SupportId } = useParams()
  // const id = SupportId  || paramid
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const [filterMenu, setFilterMenu] = useState<filterType>({
    start: 0,
    limit: -1,
    search: "",
  });
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      department: "",
      subject: "",
      message: "",
    },
    validationSchema: AddNewTicketSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (selectedStatus != "") {
        if (id) {
          handleEditSave(values);
          handleCancel();
        } else {
          handleSave(values);
          handleCancel();
        }
      }
    },
  });

  const priorityMenuData = [
    { label: "Medium" },
    { label: "High" },
    { label: "Low" },
  ];

  const StatusMenuData =
    userDetails?.role_id == 1
      ? [{ label: "In Review" }, { label: "Completed" }]
      : id
        ? [
          // { label: "Pending" },
          // { label: "In Progress" },
          // { label: "In Review" },
          // { label: "Completed" },
          { label: "Re-opened" },
          { label: "Closed" },
        ]
        : [
          { label: "Pending" },
          { label: "In Progress" },
          // { label: "In Review" },
          // { label: "Completed" },
          // { label: "Re-opened" },
          // { label: "Closed" },
        ];
  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: "8px 20px",
    minWidth: "250px",
  }));

  const handleSave = async (data) => {
    setDisable(true);
    const formData = new FormData();
    formData.append("department_id", data.department);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append(
      "status",
      selectedPriority != "" ? selectedPriority : "In Progress"
    );
    formData.append("priority", selectedStatus);

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

  const handleEditSave = async (data) => {
    setDisable(true);
    const formData = new FormData();
    formData.append("support_id", id);
    formData.append("department_id", data.department);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append(
      "status",
      selectedPriority != "" ? selectedPriority : "In Progress"
    );
    formData.append("delete_file_ids", deleteid as any);

    formData.append("priority", selectedStatus);
    uploadedFiles.forEach((file) => {
      formData.append("files", file); // Note the use of "files[]" to indicate an array of files
    });
    const res = await dispatch(updateSupportList(formData));
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);
      setIsOpen(false);
      fetchSupportList();
      setDisable(false);
      setId(null);
    } else {
      setDisable(false);
      setIsOpen(false);
      setId(null);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setUploadedFiles([]);
    setSelectedPriority("");
    setSelectedStatus("");
    setUploadedFilesNew([]);
    setTouched(false);
    setId(null);
  };

  const handleUploadFile = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    //@ts-ignore
    document.getElementById("fileattachment").value = "";
  };

  const handleRemoveFile = (file: File) => {
    const filteredFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(filteredFiles);
  };

  const handlePriorityMenuClick = (data) => {
    setSelectedPriority(data);
    setPriorityMenu(null); // Close the dropdown priority menu after selection
  };
  const handleStatusMenuClick = (data) => {
    setSelectedStatus(data);
    setStatusMenu(null); // Close the dropdown priority menu after selection
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

  const fetchDetails = async (id) => {
    const res = await dispatch(getEditSupporttDetail(id));
    const data = res?.payload?.data?.data;
    formik.setFieldValue("department", data?.department_id);
    formik.setFieldValue("subject", data?.subject);
    formik.setFieldValue("message", data?.message);
    setSelectedPriority(data?.status);
    setSelectedStatus(data?.priority);
    setUploadedFilesNew(data?.Support_Attachments_details);
  };
  const handleImageClick = (imageUrl) => {
    if (expandedImage === imageUrl) {
      setExpandedImage(null); // If already expanded, close it
    } else {
      setExpandedImage(imageUrl); // If not expanded, expand it
    }
  };

  useEffect(() => {
    if (userDetails?.role_id == 2 || userDetails?.role_id == 5) {
      fetchDepartmentList();
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [isOpen]);

  const handleDeleteAttachment = async (id: number) => {
    const filteredFiles = uploadedFilesNew.filter((f) => f.id != id);
    setUploadedFilesNew(filteredFiles);
    setIsOpenDeletedModal(false);
    setDeleteId([...deleteid, id]);
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev);
        handleCancel();
      }}
      modalTitle={`${id ? "Edit" : "Add New"}  Ticket`}
      maxWidth="733"
      btnTitle={`${id ? "Save Edit" : "Save"} `}
      closeTitle={"Close"}
      disabled={disable}
      onSubmit={() => {
        formik.handleSubmit();
        setTouched(true);
      }}
    >
      {PasswordState.supportDetailsStatus == "loading" && id ? (
        <div className="h-[510px]">
          <FuseLoading />
        </div>
      ) : (
        <div className="flex flex-col gap-20 mb-20">
          <SelectField
            formik={formik}
            name="department"
            label="Department"
            placeholder="Select Department"
            sx={{
              "& .radioIcon": { display: "none" },
              "& .MuiInputBase-root .MuiSelect-select": {
                lineHeight: 1.4,
              },
            }}
          >
            {departmentMenu?.length > 0 ? (
              departmentMenu?.map((item) => (
                <StyledMenuItem key={item.id} value={item.id}>
                  {item.name}
                </StyledMenuItem>
              ))
            ) : (
              <StyledMenuItem>No Data</StyledMenuItem>
            )}
          </SelectField>
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

          <FormLabel className="block text-[16px] font-medium text-[#111827]  border-solid border-[#4F46E5] ">
            Attachment
            <label
              htmlFor="fileattachment"
              className="bg-[#EDEDFC] px-20  border-[0.5px] border-solid border-[#4F46E5] rounded-6 min-h-[48px] 
              flex items-center gap-20 mt-5
             justify-between cursor-pointer  hover:bg-[#0000001f]"
            // onClick={() => handleUploadFile()}
            >
              <label className="text-[16px] text-[#4F46E5] flex items-center cursor-pointer sm:w-1/2 ">
                Upload Attachments
                <input
                  type="file"
                  style={{ display: "none" }}
                  multiple={true}
                  id="fileattachment"
                  accept=".pdf,.png,.jpg,.jpeg,video/*"
                  // accept=".pdf,.png,.jpg,.jpeg,.mp4,.mov,.avi,.webm"
                  onChange={handleUploadFile}
                />
              </label>
              <span>
                <img src={"../assets/images/logo/upload.png"} />
              </span>
            </label>
          </FormLabel>
          <div className="flex flex-wrap gap-4 items-center justify-start">
            {uploadedFiles?.map((file, index) => (
              <div
                key={index}
                className="bg-[#F6F6F6] mb-10 px-10 rounded-6 min-h-[48px] gap-3 flex items-center justify-between cursor-pointer w-[300px]"
              >
                <div className="bg-F6F6F6 mb-10  rounded-6 min-h-48 flex items-center justify-between cursor-pointer w-full">
                  <div className="flex items-center  w-[80%] gap-10 break-">
                    <span>
                      <PreviewIcon />
                    </span>
                    <span className="text-[16px] text-[#4F46E5] py-5 mr-8 break-all">
                      {file.name}
                    </span>
                  </div>
                  <div onClick={() => handleRemoveFile(file)}>
                    <CrossGreyIcon />
                  </div>
                </div>
              </div>
            ))}

            {uploadedFilesNew?.map((item: any) => {
              return (
                <div className="relative cursor-pointer ">
                  {item.file.includes(".png") ||
                    item.file.includes(".jpg") ||
                    item.file.includes(".webp") ||
                    item.file.includes(".jfif") ||
                    item.file.includes(".jpeg") ||
                    item.file.startsWith("image/") ? (
                    <>
                      <img
                        src={urlForImage + item.file}
                        alt="Black Attachment"
                        className="w-[100px] rounded-md "
                      />
                      <div
                        className="absolute top-7 left-7"
                        onClick={() =>
                          handleImageClick(urlForImage + item.file)
                        }
                      >
                        <AttachmentIcon />
                      </div>
                      <div
                        className="absolute top-7 right-7"
                      // onClick={() => handleDeleteAttachment(item.id)}
                      >
                        {" "}
                        <AttachmentDeleteIcon
                          onClick={() => {
                            setIsOpenDeletedModal(true);
                            setIsDeleteId(item.id);

                            setDeleteId([...deleteid, item.id]);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="w-[100px] rounded-md sm:h-[60px] flex items-center justify-center border-1 border-[#4F46E5]">
                      <a
                        href={urlForImage + item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="../assets/images/logo/pdfIcon.png"
                          alt="Black Attachment"
                          className="h-[50px] w-[50px]"
                        />
                      </a>

                      {/* <a href="/">check</a> */}
                      <div
                        className="absolute top-7 left-7"
                      // onClick={() => handleImageClick(urlForImage + item.file)}
                      >
                        <AttachmentIcon />
                      </div>
                      <div
                        className="absolute top-7 right-7"
                      // onClick={() => handleDeleteAttachment(item.id)}
                      >
                        <AttachmentDeleteIcon
                        // onClick={() => {
                        //   setIsOpenDeletedModal(true);
                        //   setIsDeleteId(item.id);
                        //   // setDeleteId([...deleteid, item.id]);
                        // }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {expandedImage && (
              <>
                <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
                  <div
                    className="absolute z-10 right-[25px] top-[100px] cursor-pointer"
                    onClick={() => setExpandedImage(null)}
                  >
                    <CrossGreyIcon />
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   ">
                    <img
                      src={expandedImage}
                      alt="Expanded Image"
                      className="w-[800px] h-[500px] object-contain"
                    />
                  </div>
                </div>
              </>
            )}
          </div>


          <div className="flex gap-4 flex-col">
            <DropdownMenu
              anchorEl={statusMenu}
              name="status"
              handleClose={() => setStatusMenu(null)}
              button={
                <CommonChip
                  onClick={(event) => setStatusMenu(event.currentTarget)}
                  label={selectedStatus || "Priority"}
                  icon={<PriorityIcon />}
                  className="max-w-fit"
                // icon={<StatusIcon />}
                />
              }
              popoverProps={{
                open: !!statusMenu,
                classes: {
                  paper: "pt-10 pb-5",
                },
              }}
            >
              {priorityMenuData.map((item) => (
                <StyledMenuItem
                  onClick={() => handleStatusMenuClick(item.label)}
                >
                  {item.label}
                </StyledMenuItem>
              ))}
            </DropdownMenu>
            <span className=" text-red  block ">
              {touched && selectedStatus == "" ? "Priority is required" : ""}
            </span>
          </div>
        </div>
        // </div>
      )}
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDeleteAttachment(deleteId)}
        heading={`Delete Attachment`}
        description={`Are you sure you want to delete this Attachment?`}
      />
    </CommonModal>
  );
}

export default AddNewTicket;
