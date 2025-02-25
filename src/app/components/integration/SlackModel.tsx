import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import {
  GetIntegrationDetail,
  SlackNoificationUpdate,
} from "app/store/integration";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { SlackSettingIcon } from "public/assets/icons/billingIcons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommonModal from "../CommonModal";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  integratedList?: any;
  fetchIntegrationDetails: () => void;
  slackId?: number | string;
}
const sections = [
  {
    title: "Column",
    options: [
      { label: "Created", checked: false },
      { label: "Edit", checked: false },
      { label: "Delete", checked: false },
    ],
  },
  {
    title: "Tasks",
    options: [
      { label: "Created", checked: false },
      { label: "Delete", checked: false },
      { label: "Move", checked: false },
      { label: "Updated", checked: false },
      { label: "Completed", checked: false },
    ],
  },
];

function SlackModal({
  isOpen,
  setIsOpen,
  integratedList,
  fetchIntegrationDetails,
  slackId,
}: IProps) {
  const [disable, setDisable] = useState(false);
  const matchedItem =
    integratedList?.find((item) => item.id === slackId) || null;

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      types_of_slack_notification: "",
    },

    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setSelectedNotifications(
      matchedItem?.slack_notification_type
        ? matchedItem.slack_notification_type.map(Number)
        : []
    );
  };

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const mapping = {
    Column: { Created: 1, Edit: 2, Delete: 3 },
    Tasks: { Created: 4, Delete: 5, Move: 6, Updated: 7, Completed: 8 },
  };
  const handleCheckboxChange = (title, label, checked) => {
    setSelectedNotifications((prev) =>
      checked
        ? [...prev, mapping[title]?.[label]].filter(Boolean)
        : prev.filter((val) => val !== mapping[title]?.[label])
    );
  };

  const handleSave = async (data) => {
    setDisable(true);

    const payload: any = {
      types_of_slack_notification: selectedNotifications.toString(),
      project_id: slackId.toString(),
    };
    const res = await dispatch(SlackNoificationUpdate(payload));
    console.log(res, "ress");
    if (res?.payload?.data?.status) {
      toast.success(res?.payload?.data?.message);

      setIsOpen(false);
      fetchIntegrationDetails();
    } else {
      toast.error(res?.payload?.data?.message);
    }

    setDisable(false);
  };

  const settingSlack = () => {
    if (matchedItem?.slackConfigUri) {
      window.open(matchedItem?.slackConfigUri, "_blank");
    } else {
      alert("No Slack configuration URL available.");
    }
  };
  useEffect(() => {
    if (matchedItem?.types_of_slack_notification) {
      setSelectedNotifications(
        matchedItem?.types_of_slack_notification.map(Number) // Convert strings to numbers
      );
    }
  }, [isOpen]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen((prev) => !prev);
        handleCancel();
      }}
      modalTitle="Slack Integration"
      maxWidth="733"
      btnTitle="Save"
      closeTitle="Cancel"
      onSubmit={formik.handleSubmit}
      disabled={disable}
    >
      <Box className="bg-[#EDEDFC] rounded-[8px] p-20 mt-[2rem]  flex items-center justify-between  ">
        <Box>
          <Typography className="text-[16px] font-400 text-[#111827]">
            {matchedItem?.slack_channel_name}
          </Typography>
          <Typography className="text-[16px] font-500 text-[#4F46E5]">
            Softradixteck slack.com
          </Typography>
        </Box>
        <div className="cursor-pointer" onClick={settingSlack}>
          <SlackSettingIcon />
        </div>
      </Box>
      <Box>
        <Typography className="text-[16px] font-400 text-[#111827] pt-20">
          The following notification will sent to the slack channel.
        </Typography>
        {sections.map((section, index) => (
          <div key={index}>
            <Typography className="text-[18px] font-600 text-[#111827] pt-10">
              {section.title}
            </Typography>
            <FormGroup>
              {section.options.map((option, idx) => (
                <FormControlLabel
                  className="w-fit"
                  key={idx}
                  control={
                    <Checkbox
                      checked={selectedNotifications.includes(
                        mapping[section.title]?.[option.label]
                      )}
                      onChange={(e) =>
                        handleCheckboxChange(
                          section.title,
                          option.label,
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </div>
        ))}
      </Box>
    </CommonModal>
  );
}

export default SlackModal;
