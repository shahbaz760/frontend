import { Box, Button, Typography } from "@mui/material";
import { GetIntegrationDetail, removeIntegration } from "app/store/integration";
import { useAppDispatch } from "app/store/store";
import {
  DeleteIntegration,
  SlckListSetting,
} from "public/assets/icons/billingIcons";
import {
  IntegrationDownArrow,
  IntegrationUpArrow,
} from "public/assets/icons/topBarIcons";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DeleteAgent from "src/app/components/client/DeleteAgent";
import SlackModal from "src/app/components/integration/SlackModel";

const IntegratedProjectList = () => {
  const dispatch = useAppDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSlackModel, setIsSlackModel] = useState<boolean>(false);
  const [isSlackId, setIsSlackId] = useState<number>();
  const { list, status } = useSelector((store: any) => store.integration);
  const slackProjectList = list?.slackSyncedProjects;
  const [isOpenDeletedSlackModal, setIsOpenDeletedSlackModal] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
    // setShowProject(false);
  };
  const fetchIntegrationDetails = async () => {
    await dispatch(GetIntegrationDetail({}));
  };
  const handleSlackOpen = (id) => {
    setIsSlackModel(true);
    setIsSlackId(id);
  };
  const handleRemveIntegration = async () => {
    setDeleteLoading(true);

    try {
      const payload = { type: 3, project_id: isSlackId }; // Properly defining payload
      const result = await dispatch(removeIntegration(payload));

      if (result?.payload?.data?.status) {
        toast.success(result?.payload?.data?.message);
        setIsOpenDeletedSlackModal(false);
        fetchIntegrationDetails();
      } else {
        toast.error(result?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Failed to remove integration:", error);
      toast.error("Failed to remove integration. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        display={"flex"}
        gap={2}
        sx={{
          width: "100%",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
        onClick={anchorEl ? handleClose : handleButtonClick}
      >
        <Button
          color="secondary"
          className=" font-600 text-[16px]  text-[#111827] flex gap-8 sm:mb-[1rem] leading-none justify-between w-full hover:bg-transparent px-0 py-10"
          aria-label="Manage Sections"
          size="large"
          endIcon={
            anchorEl ? (
              <div onClick={handleClose}>
                <IntegrationUpArrow />
              </div>
            ) : (
              <div onClick={handleButtonClick}>
                <IntegrationDownArrow className="cursor-pointer" />
              </div>
            )
          }
        >
          Integrated Projects Listing
        </Button>
      </Box>
      {anchorEl && (
        <>
          {slackProjectList
            ?.filter((item) => item?.is_slack_sync == 1)
            .map((data, index) => {
              return (
                <Box
                  className="flex items-center justify-between border-b-1 py-10 border-b-[#EDF2F6] "
                  key={data?.id}
                >
                  <Typography> {data?.name}</Typography>
                  <Box className="flex items-center gap-10 cursor-pointer">
                    <div
                      onClick={() => {
                        setIsOpenDeletedSlackModal(true),
                          setIsSlackId(data?.id);
                      }}
                    >
                      <DeleteIntegration />
                      {/* </DeleteIntegration> */}
                    </div>
                    <div onClick={() => handleSlackOpen(data?.id)}>
                      <SlckListSetting />
                    </div>
                  </Box>
                </Box>
              );
            })}
        </>
      )}
      <SlackModal
        isOpen={isSlackModel}
        setIsOpen={setIsSlackModel}
        integratedList={slackProjectList}
        slackId={isSlackId}
        fetchIntegrationDetails={fetchIntegrationDetails}
      />
      <DeleteAgent
        isOpen={isOpenDeletedSlackModal}
        setIsOpen={setIsOpenDeletedSlackModal}
        onDelete={() => handleRemveIntegration()}
        heading={"Remove Slack Integration"}
        description={"Are you sure you want to remove this Integration? "}
        isLoading={deleteLoading}
      />
    </>
  );
};

export default IntegratedProjectList;
