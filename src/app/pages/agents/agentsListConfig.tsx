import { lazy } from "react";
import AgentDetails from "src/app/components/agents/AgentDetails";
import AgentsGroup from "./AgentsGroup";
import AgentsList from "./AgentsList";
// import GroupAgentList from "../../components/agents/GroupAgentList";
// const AgentsList = lazy(() => import("./AgentsList"));
// const AgentDetails = lazy(() => import("../../components/agents/AgentDetails"));
// const AgentsGroup = lazy(() => import("./AgentsGroup"));
const GroupAgentList = lazy(
  () => import("../../components/agents/GroupAgentList")
);
/**
 * The Tasks page config.
 */
const AdminAgentsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "admin/agents/list",
      element: <AgentsList />,
    },
    {
      path: "admin/agents/agent-detail/:agent_id",
      element: <AgentDetails />,
    },
    {
      path: "admin/agents/groups",
      element: <AgentsGroup />,
    },
    {
      path: "admin/agents/groups/:group_id",
      element: <GroupAgentList />,
    },
  ],
};

export default AdminAgentsConfig;
