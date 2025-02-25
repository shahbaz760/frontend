import { Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useFormik } from "formik";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { Theme, Typography } from "@mui/material";
// import { KanbanIcon } from "public/assets/icons/projectsIcon.tsx";
import { useEffect, useState } from "react";

import { useParams } from "react-router";
import TitleBar from "src/app/components/TitleBar";
import AddTaskModal from "src/app/components/tasks/AddTask";
import ProjectTabPanel from "../../components/projects/ProjectTapPanel";
import { useNotificationContext } from "src/app/notificationContext/NotificationProvider";

export default function Projects() {
  const theme: Theme = useTheme();
  const [addCard, setAddCard] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { name } = useParams();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const { getUnreadCount } = useNotificationContext();

  useEffect(() => {
    getUnreadCount();
  }, []);

  //* initialise useformik hook
  const formik = useFormik({
    initialValues: {
      column_name: "",
    },
    // validationSchema: validationSchemaProperty,
    onSubmit: (values) => {},
  });

  return (
    <>
      <TitleBar title={name} capitalize={true}>
        <div className="flex items-start gap-10 sm:items-center flex-row min-h-[40px]">
          <Button
            variant="outlined"
            color="secondary"
            className="h-[40px] text-[16px] flex gap-8"
            aria-label="Add Tasks"
            size="large"
            onClick={() => setIsOpenAddModal(true)}
            startIcon={<PlusIcon color={theme.palette.secondary.main} />}
          >
            Add Task
          </Button>
        </div>
      </TitleBar>
      <div>
        <ProjectTabPanel />
      </div>
      <AddTaskModal
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        project_id={id}
        upperButton={true}
      />
    </>
  );
}
