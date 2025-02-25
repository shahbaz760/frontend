import ListLoading from "@fuse/core/ListLoading";
import { Button, Grid } from "@mui/material";
import {
  GetGoogleLink,
  GetIntegrationDetail,
  GetOutlookLink,
  GetSlackLink,
  removeIntegration,
} from "app/store/integration";
import { useAppDispatch } from "app/store/store";

import {
  DeleteIntegration,
  GoogleIntegrationIcon,
  OutlookIcon,
  SlackIcon,
} from "public/assets/icons/billingIcons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DeleteAgent from "src/app/components/client/DeleteAgent";
import IntegratedCard from "src/app/components/integration/IntegratedCard";
import IntegrationAuth from "src/app/components/integration/IntegrationAuth";
import SlackModal from "src/app/components/integration/SlackModel";
import TitleBar from "src/app/components/TitleBar";
import { Android12Switch } from "src/app/components/ToggleButton";
import AddProjectInte from "./AddProjectInte";
import { getUserDetail } from "src/utils";
// import TwoFactorAuth from "../profile/TwoFactorAuth";

const Integration = () => {
  const urlparam = new URLSearchParams(window.location.search);
  const hasCi = urlparam.has("ci");

  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<boolean>(false);
  const [outlookChecked, setOutLookChecked] = useState<boolean>(false);
  const { list, status } = useSelector((store: any) => store.integration);
  const getdata = list;
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isslackloading, setIsSlackLoading] = useState<boolean>(false);
  const [isOutlookloading, setIsOutLookLoading] = useState<boolean>(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isOpenAuthOutLookModal, setIsOpenAuthOutLookModal] = useState(false);
  const [isSlackModel, setIsSlackModel] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState<boolean>(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isDeletingGoogle, setIsDeletingGoogle] = useState(false);
  const [isDeletingOutlook, setIsDeletingOutlook] = useState(false);
  const [isDeletingSlack, setIsDeletingSlack] = useState(false);
  const [isOpenDeletedOutlookModal, setIsOpenDeletedOutlookModal] =
    useState<boolean>(false);
  const [isOpenDeletedSlackModal, setIsOpenDeletedSlackModal] =
    useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fetchIntegrationDetails = async () => {
    await dispatch(GetIntegrationDetail({}));
  };
  useEffect(() => {
    fetchIntegrationDetails();
  }, [dispatch]);

  const handleGetGoogleLink = async () => {
    setIsLoading(true);

    try {
      const type: number = hasCi ? 1 : 0;

      const result = await dispatch(GetGoogleLink({ type }));

      const googleUrl = result?.payload?.data?.data?.url;
      if (googleUrl) {
        window.location.href = googleUrl; // Redirect in the same tab
      } else {
        alert("Failed to get Google integration link.");
      }
    } catch (error) {
      console.error("Error fetching Google link:", error);
      alert("An error occurred while fetching the Google integration link.");
    } finally {
      // setIsLoading(false); // Stop loader after API response (success or failure)
    }
  };
  const handleGetOutlookLink = async () => {
    setIsOutLookLoading(true);

    try {
      const type: number = hasCi ? 1 : 0;

      const result = await dispatch(GetOutlookLink({ type }));

      const outlookUrl = result?.payload?.data?.data?.url;
      if (outlookUrl) {
        window.location.href = outlookUrl; // Redirect in the same tab
      } else {
        alert("Failed to get Google integration link.");
      }
    } catch (error) {
      console.error("Error fetching Google link:", error);
      alert("An error occurred while fetching the Google integration link.");
    } finally {
      // setIsOutLookLoading(false); // Stop loader after API response (success or failure)
    }
  };

  const handleRemveIntegration = async (id: number) => {
    setDeleteLoading(true);

    try {
      const payload = { type: id }; // Properly defining payload
      const result = await dispatch(removeIntegration(payload));

      if (result?.payload?.data?.status) {
        toast.success(result?.payload?.data?.message);
        setIsOpenDeletedModal(false);
        setIsOpenDeletedOutlookModal(false);
        setIsOpenDeletedSlackModal(false);
        if (id === 1) setIsDeletingGoogle(true);
        if (id === 2) setIsDeletingOutlook(true);
        if (id === 3) setIsDeletingSlack(true);
        // fetchIntegrationDetails();
      } else {
        toast.error(result?.payload?.data?.message);
      }
    } catch (error) {
      console.error("Failed to remove integration:", error);
      toast.error("Failed to remove integration. Please try again.");
    } finally {
      setDeleteLoading(false);
      // if (id === 1) setIsDeletingGoogle(false);
      // if (id === 2) setIsDeletingOutlook(false);
      // if (id === 3) setIsDeletingSlack(false);
    }
  };

  const handleChange = (event, type) => {
    setSelectedIntegration(type);
    if (type == "google") {
      setIsOpenAuthModal(true);
    } else {
      setIsOpenAuthOutLookModal(true);
    }
  };
  const isGoogleSync = getdata?.is_google_calendar_sync == 1;
  const isOutlookSync = getdata?.is_outlook_calendar_sync === 1;

  useEffect(() => {
    setChecked(getdata?.is_google_calendar_enable === 1);
  }, [getdata?.is_google_calendar_enable]);
  useEffect(() => {
    setOutLookChecked(getdata?.is_outlook_calendar_enable === 1);
  }, [getdata?.is_outlook_calendar_enable]);

  const userdetails = getUserDetail();

  return (
    <>
      <TitleBar title="Integration" />
      <Grid container spacing={2} className="px-[15px] gap-20 mb-[20px]">
        <Grid item xs={12} sm={5} lg={5}>
          <IntegratedCard
            icon={<GoogleIntegrationIcon />}
            title="Google"
            description="Connect Google Calendar to streamline your workflow. Automatically create events for tasks and reminders."
            actionButton={
              status == "loading" ? (
                <div>
                  <ListLoading />
                </div>
              ) : !isDeletingGoogle && isGoogleSync ? (
                <>
                  <div
                    className=" cursor-pointer"
                    onClick={() => setIsOpenDeletedModal(true)}
                  >
                    <DeleteIntegration />
                  </div>
                  <Android12Switch
                    checked={checked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, "google")
                    }
                    content
                  />
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  className="rounded-[100px] text-[16px] min-w-[135px]"
                  onClick={handleGetGoogleLink}
                  disabled={isloading}
                >
                  {isloading ? <ListLoading /> : "Integrate"}
                </Button>
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={5} lg={5}>
          <IntegratedCard
            icon={<OutlookIcon />}
            title="Outlook"
            description="Enhance productivity with Outlook integration. Sync tasks and reminders effortlessly with Outlook calendar."
            actionButton={
              status == "loading" ? (
                <div>
                  <ListLoading />
                </div>
              ) : !isDeletingOutlook && isOutlookSync ? (
                <>
                  <div
                    className=" cursor-pointer"
                    onClick={() => setIsOpenDeletedOutlookModal(true)}
                  >
                    <DeleteIntegration />
                  </div>
                  <Android12Switch
                    checked={outlookChecked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, "outlook")
                    }
                    content
                  />
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  className="rounded-[100px] text-[16px] min-w-[130px]"
                  onClick={handleGetOutlookLink}
                  disabled={isOutlookloading}
                >
                  {isOutlookloading ? <ListLoading /> : "Integrate"}
                </Button>
              )
            }
          />
        </Grid>

        {/* Third Column on a New Row */}
        {userdetails?.role_id == 2 && (
          <Grid item xs={12} sm={5} lg={5}>
            <IntegratedCard
              icon={<SlackIcon />}
              title="Slack"
              projectList={true}
              description="Boost team productivity with our seamless Slack integration. Connect your workflows"
              isSlack={true}
              actionButton={
                status == "loading" ? (
                  <div>
                    <ListLoading />
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    className="rounded-[100px] text-[16px] min-w-[130px]"
                    onClick={() => setIsOpenAddModal(true)}
                  >
                    Integration
                  </Button>
                )
              }
            />
          </Grid>
        )}
      </Grid>
      <IntegrationAuth
        isOpen={isOpenAuthModal}
        setIsOpen={setIsOpenAuthModal}
        isAuthenticated={checked}
        setIsAuthenticate={setChecked}
        integration={selectedIntegration}
      />
      <IntegrationAuth
        isOpen={isOpenAuthOutLookModal}
        setIsOpen={setIsOpenAuthOutLookModal}
        isAuthenticated={outlookChecked}
        setIsAuthenticate={setOutLookChecked}
        integration={selectedIntegration}
      />

      <DeleteAgent
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleRemveIntegration(1)}
        heading={"Remove Google Integration"}
        description={"Are you sure you want to remove this Integration? "}
        isLoading={deleteLoading}
      />
      <DeleteAgent
        isOpen={isOpenDeletedOutlookModal}
        setIsOpen={setIsOpenDeletedOutlookModal}
        onDelete={() => handleRemveIntegration(2)}
        heading={"Remove Outlook Integration"}
        description={"Are you sure you want to remove this Integration? "}
        isLoading={deleteLoading}
      />
      {/* <DeleteAgent
        isOpen={isOpenDeletedSlackModal}
        setIsOpen={setIsOpenDeletedSlackModal}
        onDelete={() => handleRemveIntegration(3)}
        heading={"Remove Slack Integration"}
        description={"Are you sure you want to remove this Integration? "}
        isLoading={deleteLoading}
      /> */}
      <AddProjectInte
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        isSaveFilter={true}
        // handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Integration;
