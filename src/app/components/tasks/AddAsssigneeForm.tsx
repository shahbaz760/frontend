import { Checkbox } from "@mui/material";
import React, { useState } from "react";
import CommonChip from "../chip";
import DropdownMenu from "../Dropdown";
import { AssignIconNew } from "public/assets/icons/task-icons";
import InputField from "../InputField";
import { Role } from "src/utils";

const AddAsssigneeForm = () => {
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;
  const [agentMenuData, setAgentMenuData] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState<any[]>([]);
  const [AgentMenu, setAgentMenu] = useState<HTMLElement | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(" ");
  return (
    <div>
      <DropdownMenu
        anchorEl={AgentMenu}
        handleClose={() => {
          //   setFilterMenu((prevFilters) => ({
          //     ...prevFilters,
          //     search: "",
          //   }));
          setAgentMenu(null);
        }}
        button={
          <CommonChip
            onClick={(event) => setAgentMenu(event.currentTarget)}
            className=" w-full flex !flex-row !justify-start !text-14 !items-center gap-4 !pl-1  !pr-5 !bg-transparent
             hover:!bg-[#E0E0E0]  overflow-hidden max-w-[238px]"
            sx={{
              "& .MuiButtonBase-root-MuiChip-root": {
                background: "transparent",
              },
              "& .MuiChip-label": {
                display: "inline-block",
                maxWidth: 180,
                overflowX: "hidden",
                paddingLeft: "4px",
                paddingRight: "4px",
              },
              "&:active": {
                background: "transparent",
                boxShadow: "none !important",
              },
              "&:hover": {
                background: "transparent",
                border: "none",
              },
              "&:focus": {
                background: "transparent",
                outline: "none",
              },
            }}
            icon={<AssignIconNew height={16} width={16} />}
            label={
              selectedAgents?.length > 0
                ? selectedAgents
                    ?.map(
                      (agentId) =>
                        agentMenuData?.find((item) => item.agent_id === agentId)
                          ?.first_name
                    )
                    .join(",  ")
                : selectedAgent
            }
          />
        }
        popoverProps={{
          open: !!AgentMenu,
          classes: {
            paper: "pt-10 pb-20",
          },
        }}
      >
        <div className="sm:w-[375px] p-10">
          <p className="text-title font-600 text-[1.6rem]">Assignee Name</p>
          <div className="relative w-full mt-10 mb-3 sm:mb-0">
            <InputField
              name={"agent"}
              placeholder={"Search Assignee"}
              className="common-inputField "
              inputProps={{
                className: "w-full sm:w-full",
              }}
              // onChange={handleSearchChange}
            />
            <div className="max-h-[150px] w-full overflow-y-auto shadow-sm cursor-pointer">
              {agentMenuData?.map((item: any) => (
                <div
                  className="flex items-center gap-10 px-20 w-full"
                  key={item.id}
                  // onChange={() => handleAgentSelect(item.agent_id)}
                >
                  <label className="flex items-center gap-10 w-full cursor-pointer">
                    <Checkbox
                      className="d-none   hover:!bg-transparent"
                      // checked={selectedAgents?.includes(item.agent_id)}
                      // onChange={() => handleAgentSelect(item.agent_id)}
                    />
                    <div className="h-[35px] w-[35px] rounded-full">
                      {item.user_image ? (
                        <img
                          src={urlForImage + item.user_image}
                          alt=""
                          className="h-[35px] w-[35px] rounded-full"
                        />
                      ) : (
                        <img src="../assets/images/logo/images.jpeg" alt="" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span>{item?.userName}</span>
                      <span className="text-[#757982] text-12">
                        {Role(item?.role_id)}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenu>
    </div>
  );
};

export default AddAsssigneeForm;
