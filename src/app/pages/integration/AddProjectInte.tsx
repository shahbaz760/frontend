import ListLoading from "@fuse/core/ListLoading";
import {
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { GetSlackLink } from "app/store/integration";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { UpArrowBlank } from "public/assets/icons/clienIcon";
import { DownArrowBlank } from "public/assets/icons/dashboardIcons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import CommonModal from "src/app/components/CommonModal";
import InputField from "src/app/components/InputField";
import { AddFilterSchema, AddSlackSchema } from "src/formSchema";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isNewAgent?: boolean;
  handleSubmit?: any;
  filterPagination?: any;
  isSaveFilter?: boolean;
}

function AddProjectInte({
  isOpen,
  setIsOpen,
  isNewAgent,
  filterPagination,
  isSaveFilter,
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string>("");
  const { list, status } = useSelector((store: any) => store.integration);
  const slackSyncNotList = list?.slackSyncedProjects;
  const urlparam = new URLSearchParams(window.location.search);
  const hasCi = urlparam.has("ci");
  const dispatch = useAppDispatch();
  const [id, setId] = useState(null);
  const [isslackloading, setIsSlackLoading] = useState<boolean>(false);

  const handleClose = () => {
    setAnchorEl(null);
    // setIsOpen(false);
  };
  const handleSubmit = async () => {
    setIsSlackLoading(true); // Start loader before API call

    try {
      const type: number = hasCi ? 1 : 0;
      const payload = {
        type: type,
        project_id: id,
      };
      const result = await dispatch(GetSlackLink(payload));

      const slackUrl = result?.payload?.data?.data?.url;
      if (slackUrl) {
        window.location.href = slackUrl; // Redirect in the same tab
        setId(null);
      } else {
        alert("Failed to get Slack integration link.");
      }
    } catch (error) {
      console.error("Error fetching Slack link:", error);
      alert("An error occurred while fetching the Slack integration link.");
    } finally {
      setIsSlackLoading(false);
    }
  };
  console.log(slackSyncNotList, "slackSyncNotList");
  const formik = useFormik({
    initialValues: {
      project_names: "",
    },
    validationSchema: AddSlackSchema,
    onSubmit: async (values) => {
      await handleSubmit(); // ✅ Now it will execute properly
    },
  });
  const handleSelect = (name: string, id: string) => {
    setSelected(name);
    formik.setFieldValue("project_names", name);
    setId(id);
    setAnchorEl(null);
  };
  const handleToggle = () => {
    setIsOpen(false);
    setSelected("");
    formik.resetForm();
  };

  return (
    <CommonModal
      open={isOpen}
      handleToggle={handleToggle}
      modalTitle="Add Project"
      maxWidth="555"
      btnTitle={"Integrate"}
      onSubmit={formik.handleSubmit}
      disabled={isslackloading}
      isValid={true}
      isIntegrate={true}
    >
      <Typography className="text-[16px] font-600 text-[#111827] pt-10 pb-5">
        Project
      </Typography>
      <>
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          variant="contained"
          className={`bg-[#F6F6F6]  w-full min-h-[45px] rounded-[8px] flex items-center justify-between  font-400 text-[#757982] ${!formik.errors.project_names ? "mb-32" : "mb-10"}`}
          sx={{ border: anchorEl ? "1px solid #4F46E5" : "none" }}
        >
          {selected ? selected : "Select Project Name"}
          <span>{!anchorEl ? <DownArrowBlank /> : <UpArrowBlank />}</span>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className="w-full"
          MenuListProps={{
            sx: {
              Height: 450,
              minWidth: "500px",
              "& ul": {
                padding: 1,
                listStyle: "none",
                overflowY: "auto",
              },
            },
          }}
        >
          {slackSyncNotList
            ?.filter((item) => item?.is_slack_sync == 0)
            ?.map((data: any, index) => (
              <MenuItem
                key={data?.id}
                onClick={() => handleSelect(data?.name, data?.id)}
              >
                <ListItemText primary={data?.name} />
              </MenuItem>
            ))}
        </Menu>

        {formik.errors.project_names && formik?.touched.project_names && (
          <Typography className="text-red-600">
            {formik.errors.project_names}
          </Typography>
        )}
      </>
    </CommonModal>
  );
}

export default AddProjectInte;
