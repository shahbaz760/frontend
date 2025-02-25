/* eslint-disable */
import { Box, Button, Typography } from "@mui/material";
import { RootState, useAppDispatch } from "app/store/store";
import { useNavigate, useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import { useEffect, useState } from "react";
import {
  AddClientRoleandPermission,
  EditClientRoleandPermission,
  GetRoleandPermissionDetails,
} from "app/store/Password";
import { useSelector } from "react-redux";
import ListLoading from "@fuse/core/ListLoading";
import InputField from "src/app/components/InputField";
import toast from "react-hot-toast";
import { getClientId, getUserDetail } from "src/utils";
import AccessSelector from "./AccessSelector";
import { Android12Switch } from "src/app/components/ToggleButton";

export default function AddClientRolePermission() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const { id } = useParams();
  const [data, setData] = useState({
    name: "",
    description: "",
    is_project_access: "",
    is_agent_access: "",
    is_users_access: "",
    is_billing_access: "",
    is_shared_files: "",
    is_chat: "",
    is_password_manager: "",
    is_settings: "",
    is_supports: "",
  });
  const { status } = useSelector((state: RootState) => state.password);
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const [loadingData, setLoadingData] = useState(false);

  const userDetail = getUserDetail();

  const handleSubmit = (formValues) => {
    const { name, description } = formValues;
    if (name.trim() === "") {
      setErrorName("Name is required.");
    } else if (name.trim().length === 0) {
      setErrorName("No spaces allowed.");
    } else if (name.length > 50) {
      setErrorName("Name cannot exceed 50 characters.");
    }
    if (description.length > 200) {
      setErrorDescription("Description cannot exceed 200 characters.");
    }
    if (name.trim() == "" || name.length > 50 || description.length > 200) {
      return;
    }
    if (id) {
      handleEditSave(name, description);
    } else {
      handleSave(name, description);
    }
  };

  useEffect(() => {
    if (id) {
      setLoadingData(true);
      getDetails(id);
    }
  }, [id]);

  const getDetails = async (id) => {
    const res = await dispatch(GetRoleandPermissionDetails(id));
    if (
      (userDetail.role_id == 4 || userDetail.role_id == 5) &&
      res.payload.data.code == 400
    ) {
      navigate("/401");
    } else {
      setData(res?.payload?.data?.data);
      setLoadingData(false);
    }
  };

  const [details, setDetails] = useState<any>([
    {
      label: "Project access",
      label1: "is_project_access",
      value: 0,
      options: [
        { label: "All ", value: 0 },
        { label: "Assigned Only", value: 1 },
      ],
    },
    {
      label: "Chat",
      label1: "is_chat",
      value: 0,
    },
    {
      label: "Shared files",
      label1: "is_shared_files",
      value: 0,
    },
    {
      label: "Password manager",
      label1: "is_password_manager",
      value: 0,
    },
    {
      label: "My agents",
      label1: "is_agent_access",
      value: 0,
    },
    {
      label: "Users management access",
      label1: "is_users_access",
      value: 0,
    },
    {
      label: "Settings access",
      label1: "is_settings",
      value: 0,
    },
    {
      label: "Billing access",
      label1: "is_billing_access",
      value: 0,
    },
    {
      label: "Support access",
      label1: "is_supports",
      value: 0,
    },
  ]);

  const mapDataToFormValues = (data) => ({
    name: "",
    description: "",
    is_project_access: data.is_project_access,
    is_agent_access: data.is_agent_access,
    is_users_access: data.is_users_access,
    is_billing_access: data.is_billing_access,
    is_shared_files: data.is_shared_files,
    is_chat: data.is_chat,
    is_password_manager: data.is_password_manager,
    is_settings: data.is_settings,
    is_supports: data.is_supports,
  });

  const mapDataToDetails = (data) => {
    return details.map((section) => {
      return {
        ...section,
        value: data[section.label1] || section.value,
      };
    });
  };

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    is_project_access: 0,
    is_agent_access: 0,
    is_users_access: 0,
    is_billing_access: 0,
    is_shared_files: 0,
    is_chat: 0,
    is_password_manager: 0,
    is_settings: 0,
    is_supports: 0,
  });

  useEffect(() => {
    if (id && data) {
      const updatedDetails = mapDataToDetails(data);

      setDetails(updatedDetails);

      const updatedFormValues = mapDataToFormValues(data);
      setFormValues(updatedFormValues);

      setFormValues({
        ...updatedFormValues,
        name: data.name,
        description: data.description,
      });
    }
  }, [data, id]);

  const handleSave = async (name, description) => {
    setLoading(true);
    try {
      const res = await dispatch(
        AddClientRoleandPermission({ ...formValues, name, description })
      );
      if (res?.payload?.data?.status == 1) {
        navigate(`/settings${clientId ? `?ci=${clientId}` : ""}`);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleEditSave = async (name, description) => {
    setLoading(true);
    try {
      const res = await dispatch(
        EditClientRoleandPermission({
          formvalue: { ...formValues, name, description },
          id,
        })
      );
      if (res?.payload?.data?.status == 1) {
        navigate(`/settings${clientId ? `?ci=${clientId}` : ""}`);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const clientId = getClientId();
  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);

  useEffect(() => {
    setLoadingData(true);
    if (
      window.location.pathname.includes("setting") &&
      (userDetail?.role_id == 4 || userDetail?.role_id == 5) &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/401`);
    } else {
      setLoadingData(false);
    }
  }, [Accesslist]);

  if (id && (status == "loading" || loadingData)) {
    return <ListLoading />;
  }

  const onDataChange = (index, value) => {
    setFormValues((prev) => ({
      ...prev,
      [details[index].label1]: value,
    }));
    details[index] = {
      ...details[index],
      value,
    };
    setDetails([...details]);
  };

  return (
    <>
      <TitleBar title={`${id ? "Edit" : "Add"} Role and Permissions`} />
      <div className="sm:px-[3rem] px-[1rem]">
        <div className="bg-white rounded-lg shadow-sm py-20 sm:px-20 px-5 mb-20">
          {" "}
          <div className="flex gap-20 pb-20 flex-col sm:w-3/4">
            <div>
              <InputField
                name="name"
                value={formValues?.name}
                label="Role Name"
                placeholder="Enter Role Name"
                onChange={(e) => {
                  setErrorName("");
                  setFormValues({ ...formValues, name: e.target.value });
                }}
              />
              <span className=" text-red  block -mt-9">{errorName}</span>
            </div>
            <div>
              <InputField
                name="description"
                value={formValues?.description}
                label="Description"
                placeholder="Enter Description"
                multiline
                rows={4}
                onChange={(e) => {
                  setErrorDescription("");
                  setFormValues({ ...formValues, description: e.target.value });
                }}
              />
              <span className="text-red  block -mt-9">{errorDescription}</span>
            </div>
            <Typography className="text-[#111827] text-[20px] font-600">
              Permissions
            </Typography>
            <div className="bg-[#F6F6F6] p-[20px] rounded-[10px]">
              <div className="bg-white flex flex-col gap-[20px] rounded-[10px] p-[10px]">
                {details?.map((title, index) => {
                  if (title.options) {
                    return (
                      <AccessSelector
                        key={index}
                        label={title.label}
                        options={title.options} // Pass the dynamic options
                        initialValue={title.value}
                        onChange={(value) => {
                          onDataChange(index, value);
                        }}
                      />
                    );
                  }
                  const checked = title.value ? true : false;
                  return (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      p={1}
                      bgcolor="#fff"
                      key={index}
                    >
                      {/* Left Label */}
                      <Typography
                        variant="body1"
                        color="#111827"
                        className="text-16"
                      >
                        {title.label}
                      </Typography>
                      <Android12Switch
                        colored
                        content
                        checked={checked}
                        onChange={(e) => {
                          onDataChange(index, e.target.checked ? 1 : 0);
                        }}
                      />
                    </Box>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex my-[3rem]">
            <Button
              variant="contained"
              color="secondary"
              className="w-[156px] h-[48px] text-[16px] font-400 leading-5"
              onClick={() => handleSubmit(formValues)}
              disabled={loading}
            >
              {" "}
              {loading ? (
                <Box
                  marginTop={0}
                  id="spinner"
                  sx={{
                    "& > div": {
                      backgroundColor: "palette.secondary.main",
                    },
                  }}
                >
                  <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
                </Box>
              ) : (
                `Save ${id ? "Edit" : ""} `
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="w-[156px] h-[48px] text-[16px] font-400 ml-14  leading-5"
              onClick={() => {
                navigate(`/settings${clientId ? `?ci=${clientId}` : ""}`);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
