/* eslint-disable */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { RootState, useAppDispatch } from "app/store/store";
import { useNavigate, useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import AccessSelector from "./AccessSelector";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Accordian from "./Accordian";
import {
  AddRoleandPermission,
  EditRoleandPermission,
  GetRoleandPermissionDetails,
} from "app/store/Password";
import { useSelector } from "react-redux";
import { AddRoleSchema } from "src/formSchema";
import ListLoading from "@fuse/core/ListLoading";
import InputField from "src/app/components/InputField";
import toast from "react-hot-toast";
import { getUserDetail } from "src/utils";

export default function AddRolePermission() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const { id } = useParams();
  const { data, status } = useSelector((state: RootState) => state.password);
  const { Accesslist, AccessStatus } = useSelector(
    (state: RootState) => state.project
  );
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
      const fetchDetails = async () => {
        const res = await dispatch(GetRoleandPermissionDetails(id));
        if (
          (userDetail.role_id == 4 || userDetail.role_id == 5) &&
          res.payload.data.code == 400
        ) {
          navigate("/401");
        } else {
          setLoadingData(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

  const [details, setDetails] = useState<any>([
    {
      label: "Client access",
      label1: "client_access",
      label2: "is_client_access",
      list: [
        {
          label: "View",
          label1: "client_view",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All", value: 0 },
          ],
        },
        {
          label: "Edit",
          label1: "client_edit",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
            { label: "None", value: 2 },
          ],
        },
        {
          label: "Delete",
          label1: "client_delete",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
            { label: "None", value: 2 },
          ],
        },
        {
          label: "Subscriptions",
          options: [],
          value: 0,
          label1: "client_subscriptions",
        },
        {
          label: "Login as client",
          options: [],
          value: 0,
          label1: "client_as_login",
        },

        {
          label: "Admin user",
          options: [],
          value: 0,
          label1: "client_account_manager",
        },
        {
          label: "Assigned agents",
          options: [],
          value: 0,
          label1: "client_assigned_agent",
        },
        {
          label: "Hide info",
          options: [],
          value: 0,
          label1: "client_hide_info",
        },
      ],
    },
    {
      label: "Agent access",
      label1: "agent_access",
      label2: "is_agent_access",

      list: [
        {
          label: "Agent View",
          label1: "agent_view",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All", value: 0 },
          ],
        },
        {
          label: "Agent Edit",
          label1: "agent_edit",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
            { label: "None", value: 2 },
          ],
        },
        {
          label: "Agent Delete",
          label1: "agent_delete",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
            { label: "None", value: 2 },
          ],
        },
        {
          label: "Agent Hide info",
          options: [],
          value: 0,
          label1: "agent_hide_info",
        },
        {
          isSubItem: true,
          label: "Agent group access",
          label1: "agent_group_access",
          label2: "is_agent_group_access",

          list: [
            // {
            //   label: "View",
            //   label1: "agent_group_view",
            //   value: 1,
            //   options: [
            //     { label: "Assigned Only", value: 1 },
            //     { label: "All", value: 0 },
            //   ],
            // },
            {
              label: "Agent Group Edit",
              label1: "agent_group_edit",
              value: 1,
              options: [
                { label: "Assigned Only", value: 1 },
                { label: "All ", value: 0 },
                { label: "None", value: 2 },
              ],
            },
            {
              label: "Agent Group Delete",
              label1: "agent_group_delete",
              value: 1,
              options: [
                { label: "Assigned Only", value: 1 },
                { label: "All ", value: 0 },
                { label: "None", value: 2 },
              ],
            },
            // {
            //   label: "Hide info",
            //   options: [],
            //   value: 0,
            //   label1: "agent_group_hide_info",
            // },
          ],
        },
      ],
    },

    {
      label: "Reports access",
      label1: "report_access",
      label2: "is_report_access",
      isShow: false,
      list: [
        {
          label: "Financial Report",
          options: [],
          value: 0,
          label1: "report_financial",
        },
        {
          label: "Churn Overview",
          options: [],
          value: 0,
          label1: "report_churn",
        },
        {
          label: "Retention Rate",
          options: [],
          value: 0,
          label1: "report_retantion",
        },
        {
          label: "Customer Overview",
          options: [],
          value: 0,
          label1: "report_customer",
        },
        {
          label: "Growth Rate",
          options: [],
          value: 0,
          label1: "report_growth",
        },
        { label: "MRR Overview", options: [], value: 0, label1: "report_mmr" },
      ],
    },
    {
      label: "Manage Products",
      label1: "is_manage_products",
      label2: "is_manage_products",
      list: [],
      value: 0,
    },
    {
      label: "Chat",
      label1: "chat_access",
      label2: "is_chat",
      list: [
        {
          label: "Chat",
          label1: "chat",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
          ],
        },
      ],
    },
    {
      label: "Keywords",
      label1: "is_keywords",
      label2: "is_keywords",
      list: [],
      value: 0,
    },
    {
      label: "Settings",
      label1: "is_settings",
      label2: "is_settings",
      list: [],
      value: 0,
    },
    {
      label: "Support",
      label1: "support_access",
      label2: "is_supports",
      list: [
        {
          label: "Access",
          label1: "support_access_allow",
          value: 1,
          options: [
            { label: "Assigned Only", value: 1 },
            { label: "All ", value: 0 },
          ],
        },
        {
          label: "Departments",
          label1: "support_department",
          options: [],
          value: 0,
        },
      ],
    },
    {
      label: "Admin users",
      label1: "admin_access",
      label2: "is_admin_users",
      isShow: false,
      value: 0,
      list: [
        { label: "View", options: [], value: 1, label1: "admin_view" },
        { label: "Edit", options: [], value: 0, label1: "admin_edit" },
        { label: "Delete", options: [], value: 0, label1: "admin_delete" },
        {
          label: "Hide info",
          options: [],
          value: 0,
          label1: "admin_hide_info",
        },
      ],
    },
  ]);

  const mapDataToFormValues = (data) => ({
    name: "",
    description: "",
    is_client_access: data.is_client_access,
    client_access: {
      client_view: data.client_view,
      client_edit: data.client_edit,
      client_delete: data.client_delete,
      client_subscriptions: data.client_subscriptions,
      client_as_login: data.client_as_login,
      client_account_manager: data.client_account_manager,
      client_assigned_agent: data.client_assigned_agent,
      client_hide_info: data.client_hide_info,
    },
    is_agent_access: data.is_agent_access,
    agent_access: {
      agent_view: data.agent_view,
      agent_edit: data.agent_edit,
      agent_delete: data.agent_delete,
      agent_hide_info: data.agent_hide_info,
    },
    is_agent_group_access: data.is_agent_group_access,
    agent_group_access: {
      // agent_group_view: data.agent_group_view,
      agent_group_edit: data.agent_group_edit,
      agent_group_delete: data.agent_group_delete,
      // agent_group_hide_info: data.agent_group_hide_info,
    },
    is_report_access: data.is_report_access,
    report_access: {
      report_financial: data.report_financial,
      report_churn: data.report_churn,
      report_retantion: data.report_retantion,
      report_customer: data.report_customer,
      report_growth: data.report_growth,
      report_mmr: data.report_mmr,
    },
    is_keywords: data.is_keywords,
    is_settings: data.is_settings,
    is_manage_products: data.is_manage_products,
    is_chat: data.is_chat,
    chat_access: {
      chat: data.chat,
    },
    is_supports: data.is_supports,
    support_access: {
      support_access_allow: data.support_access_allow,
      support_department: data.support_department,
    },
    is_admin_users: data.is_admin_users,
    admin_access: {
      admin_view: data.admin_view,
      admin_edit: data.admin_edit,
      admin_delete: data.admin_delete,
      admin_hide_info: data.admin_hide_info,
    },
  });

  const mapDataToDetails = (data) => {
    return details.map((section) => {
      if (section.list && section.list.length > 0) {
        if (section.label1 === "agent_access") {
          const updatedList = section.list.map((item) => {
            if (item?.isSubItem) {
              const updatedItemList = item.list.map((innerItem) => ({
                ...innerItem,
                value:
                  data[innerItem.label1] != undefined
                    ? data[innerItem.label1]
                    : innerItem.value,
              }));
              return {
                ...item,
                list: updatedItemList,
                value:
                  data[item.label2] != undefined
                    ? data[item.label2]
                    : item.value,
              };
            } else {
              return {
                ...item,
                value:
                  data[item.label1] != undefined
                    ? data[item.label1]
                    : item.value,
              };
            }
          });
          return {
            ...section,
            list: updatedList,
            value:
              data[section.label2] != undefined
                ? data[section.label2]
                : section.value,
          };
        } else {
          const updatedList = section.list.map((item) => ({
            ...item,
            value:
              data[item.label1] != undefined ? data[item.label1] : item.value,
          }));

          return {
            ...section,
            list: updatedList,
            value:
              data[section.label2] != undefined
                ? data[section.label2]
                : section.value,
          };
        }
      } else {
        return {
          ...section,
          value:
            data[section.label2] != undefined
              ? data[section.label2]
              : section.value,
        };
      }
    });
  };

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    is_client_access: 0,
    client_access: {
      client_view: 1,
      client_edit: 1,
      client_delete: 1,
      client_subscriptions: 1,
      client_as_login: 0,
      client_account_manager: 0,
      client_assigned_agent: 0,
      client_hide_info: 0,
    },
    is_agent_access: 0,
    agent_access: {
      agent_view: 1,
      agent_edit: 1,
      agent_delete: 1,
      agent_hide_info: 0,
    },

    is_agent_group_access: 0,
    agent_group_access: {
      // agent_group_view: 1,
      agent_group_edit: 1,
      agent_group_delete: 1,
      // agent_group_hide_info: 0,
    },

    is_report_access: 0,
    report_access: {
      report_financial: 0,
      report_churn: 0,
      report_retantion: 0,
      report_customer: 0,
      report_growth: 0,
      report_mmr: 0,
    },
    is_keywords: 0,
    is_settings: 0,
    is_manage_products: 0,
    is_chat: 0,
    chat_access: { chat: 1 },
    is_supports: 0,
    support_access: { support_access_allow: 1, support_department: 0 },
    is_admin_users: 0,
    admin_access: {
      admin_view: 1,
      admin_edit: 0,
      admin_delete: 0,
      admin_hide_info: 0,
    },
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
    // Pe   setLoading(true);
    let check1 = false,
      check2 = false,
      check3 = false;

    const { admin_access, report_access, is_admin_users, is_report_access } =
      formValues;
    if (
      is_admin_users == 1 &&
      admin_access.admin_view === 0 &&
      admin_access.admin_edit === 0 &&
      admin_access.admin_delete === 0 &&
      admin_access.admin_hide_info === 0
    ) {
      check1 = true;
    }
    if (
      is_report_access == 1 &&
      report_access.report_financial === 0 &&
      report_access.report_churn === 0 &&
      report_access.report_retantion === 0 &&
      report_access.report_customer === 0 &&
      report_access.report_growth === 0 &&
      report_access.report_mmr === 0
    ) {
      check2 = true;
    }

    if (check1 || check2) {
      const newDetails: any = [...details]; // Create a new copy of details

      // Update admin_access visibility if check1 is true
      if (check1) {
        const adminAccessIndex = details.findIndex(
          (data) => data.label1 === "admin_access"
        );
        newDetails[adminAccessIndex] = {
          ...details[adminAccessIndex],
          isShow: check1,
        };
      }

      // Update report_access visibility if check2 is true
      if (check2) {
        const reportAccessIndex = details.findIndex(
          (data) => data.label1 === "report_access"
        );
        newDetails[reportAccessIndex] = {
          ...details[reportAccessIndex],
          isShow: check2,
        };
      }

      // Update the state with the new details
      setDetails(newDetails);
      toast.error("Please select at least one option.");
      return;
    }
    if (is_admin_users == 1 && admin_access.admin_view === 0) {
      check3 = true;
    }
    if (check3) {
      const newDetails: any = [...details];
      const adminAccessIndex = details.findIndex(
        (data) => data.label1 === "admin_access"
      );
      newDetails[adminAccessIndex] = {
        ...details[adminAccessIndex],
        isShow: check3,
      };
      setDetails(newDetails);
      toast.error("View option is mendatory for Admin user");
      return;
    }
    setLoading(true);
    try {
      const res = await dispatch(
        AddRoleandPermission({ ...formValues, name, description })
      );
      if (res?.payload?.data?.status == 1) {
        toast.success(res?.payload?.data?.message);
        navigate("/admin/setting");
      } else {
        toast.error(res?.payload?.data?.message);
      }
      // toast.success(res?.payload?.data?.message);
      setLoading(false);
      // navigate("/admin/setting");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleEditSave = async (name, description) => {
    let check1 = false,
      check2 = false,
      check3 = false;
    const { admin_access, report_access, is_admin_users, is_report_access } =
      formValues;
    if (
      is_admin_users == 1 &&
      admin_access.admin_view === 0 &&
      admin_access.admin_edit === 0 &&
      admin_access.admin_delete === 0 &&
      admin_access.admin_hide_info === 0
    ) {
      check1 = true;
    }
    if (
      is_report_access == 1 &&
      report_access.report_financial === 0 &&
      report_access.report_churn === 0 &&
      report_access.report_retantion === 0 &&
      report_access.report_customer === 0 &&
      report_access.report_growth === 0 &&
      report_access.report_mmr === 0
    ) {
      check2 = true;
    }

    if (check1 || check2) {
      const newDetails: any = [...details]; // Create a new copy of details

      // Update admin_access visibility if check1 is true
      if (check1) {
        const adminAccessIndex = details.findIndex(
          (data) => data.label1 === "admin_access"
        );
        newDetails[adminAccessIndex] = {
          ...details[adminAccessIndex],
          isShow: check1,
        };
      }

      // Update report_access visibility if check2 is true
      if (check2) {
        const reportAccessIndex = details.findIndex(
          (data) => data.label1 === "report_access"
        );
        newDetails[reportAccessIndex] = {
          ...details[reportAccessIndex],
          isShow: check2,
        };
      }

      // Update the state with the new details
      setDetails(newDetails);
      toast.error("Please select at least one option.");
      return;
    }
    if (is_admin_users == 1 && admin_access.admin_view === 0) {
      check3 = true;
    }
    if (check3) {
      const newDetails: any = [...details];
      const adminAccessIndex = details.findIndex(
        (data) => data.label1 === "admin_access"
      );
      newDetails[adminAccessIndex] = {
        ...details[adminAccessIndex],
        isShow: check3,
      };
      setDetails(newDetails);
      toast.error("View option is mendatory for Admin user");
      return;
    }
    setLoading(true);
    // Pe   setLoading(true);
    try {
      const res = await dispatch(
        EditRoleandPermission({
          formvalue: { ...formValues, name, description },
          id,
        })
      );
      if (res?.payload?.data?.status == 1) {
        toast.success(res?.payload?.data?.message);
        navigate("/admin/setting");
      } else {
        toast.error(res?.payload?.data?.message);
      }
      // toast.success(res?.payload?.data?.message);
      setLoading(false);
      // navigate("/admin/setting");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (
      window.location.pathname.includes("setting") &&
      userDetail?.role_id == 4 &&
      Accesslist.is_settings == 0
    ) {
      navigate(`/accountManager/dashboard`);
    }
    // client_id
  }, [Accesslist]);

  if (id && (status == "loading" || loadingData)) {
    return <ListLoading />;
  }

  return (
    <>
      <TitleBar title={`${id ? "Edit" : "Add"} Role and Permissions`} />
      <div className="sm:px-[15px] px-[1rem]">
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
            <div className="">
              {details?.map((title, index) => {
                return (
                  <Accordian
                    title={title.label}
                    AccessClient={title.list}
                    titleLabel={title.label1}
                    titleValue={title.value}
                    show={title.isShow}
                    details={details}
                    setFormValues={setFormValues}
                    setDetails={setDetails}
                    onChange={(accessType, value) => {
                      // Check if the value is boolean, and convert it to 0 or 1
                      const processedValue =
                        typeof value === "boolean" ? (value ? 1 : 0) : value;

                      if (title?.list && title?.list?.length > 0) {
                        setFormValues((prev) => {
                          const newFormValues = {
                            ...prev,
                            [title.label1 == accessType
                              ? title.label2
                              : title.label1]:
                              title.label1 == accessType
                                ? processedValue
                                : {
                                  ...prev[title.label1],
                                  [accessType]: processedValue, // Update nested access type with processedValue
                                },
                          };

                          // Initialize check1 and check2
                          let check1 = false,
                            check2 = false;

                          // Check admin_access based on updated formValues
                          if (newFormValues.admin_access) {
                            check1 = Object.values(
                              newFormValues.admin_access
                            ).some((val) => val === 1);
                          }

                          // Check report_access based on updated formValues
                          if (newFormValues.report_access) {
                            check2 = Object.values(
                              newFormValues.report_access
                            ).some((val) => val === 1);
                          }

                          // Update details based on check1 and check2
                          const newDetails = [...details];

                          if (check1) {
                            const adminAccessIndex = newDetails.findIndex(
                              (data) => data.label1 === "admin_access"
                            );
                            newDetails[adminAccessIndex] = {
                              ...newDetails[adminAccessIndex],
                              isShow: false, // Or whatever logic you want for isShow
                            };
                          }

                          if (check2) {
                            const reportAccessIndex = newDetails.findIndex(
                              (data) => data.label1 === "report_access"
                            );
                            newDetails[reportAccessIndex] = {
                              ...newDetails[reportAccessIndex],
                              isShow: false, // Or whatever logic you want for isShow
                            };
                          }
                          if (accessType == "support_access") {
                            // Find the support_access_allow in formValues to check its value
                            const supportAccessAllow =
                              newFormValues.is_supports;

                            // If support_access_allow is not 1 (true), reset support_department to 0
                            if (supportAccessAllow !== 1) {
                              newFormValues.support_access.support_department = 0;
                            } else {
                              // Set support_department to the processed value if support_access_allow is true
                              newFormValues.support_access.support_department =
                                processedValue;
                            }
                          }

                          // Set the new details state only if there were changes
                          if (check1 || check2) {
                            setDetails(newDetails);
                          }

                          return newFormValues; // Return the updated formValues
                        });
                      } else {
                        setFormValues((prev) => ({
                          ...prev,
                          [title.label1]: processedValue, // Update top-level value with processedValue
                        }));
                      }
                      if (accessType === "agent_access" && !value) {
                        const newDetails = [...details];

                        // Find the index of 'agent_access'
                        const agentAccessIndex = newDetails.findIndex(
                          (data) => data.label1 === "agent_access"
                        );

                        if (agentAccessIndex !== -1) {
                          const innerList =
                            newDetails[agentAccessIndex]?.list || [];

                          // Find the index of the sub-item
                          const agentGroupAccessIndex = innerList.findIndex(
                            (data) => data.isSubItem
                          );

                          if (agentGroupAccessIndex !== -1) {
                            // Update the value of the sub-item
                            innerList[agentGroupAccessIndex] = {
                              ...innerList[agentGroupAccessIndex],
                              value: 0,
                            };

                            // Update the list in the details object
                            newDetails[agentAccessIndex] = {
                              ...newDetails[agentAccessIndex],
                              list: innerList,
                            };
                          }
                        }
                        setDetails([...newDetails]);
                        setFormValues((prev) => ({
                          ...prev,
                          is_agent_group_access: processedValue, // Update top-level value with processedValue
                        }));
                      }
                    }}
                  />
                );
              })}
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
                navigate("/admin/setting");
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
