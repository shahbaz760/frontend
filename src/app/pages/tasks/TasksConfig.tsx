import i18next from "i18next";
import SubTaskDetails from "src/app/components/tasks/SubTaskDetails ";
import TaskDetails from "src/app/components/tasks/TaskDetails";
import ar from "./i18n/ar";
import en from "./i18n/en";
import tr from "./i18n/tr";
import Tasks from "./Tasks";

i18next.addResourceBundle("en", "tasksPage", en);
i18next.addResourceBundle("tr", "tasksPage", tr);
i18next.addResourceBundle("ar", "tasksPage", ar);

// const Tasks = lazy(() => import("./Tasks"));
// const TaskDetails = lazy(() => import("../../components/tasks/TaskDetails"));
// const SubTaskDetails = lazy(() =>
//   import("../../components/tasks/SubTaskDetails ")
// );
 
/**
 * The Tasks page config.
 */
const TasksConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/tasks",
      element: <Tasks />,
    },
    {
      path: "/:projectId/tasks/detail/:taskId",
      element: <TaskDetails />,
    },
    {
      path: "/:projectId/:parentTaskId/subTask/detail/:taskId",
      element: <SubTaskDetails />,
    },
  ],
};

export default TasksConfig;
