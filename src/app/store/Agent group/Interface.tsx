export interface AgentGroupType {
  group_id?: number;
  group_name?: string;
  group_names?: string;
  id?: number;
  deleted_at?: string;
  createdAt?: string;
  user_id?: number;
  updatedAt?: string;
  members_count?: number;
  group_members?: any[];
  actionStatus?: boolean;
  fetchStatus?: string;
  list?: [];
  status?: boolean;
  is_delete_access?: any;
  is_edit_access?: any;
}

export interface filterType {
  start: number;
  limit: number;
  search?: string;
  client_id?: any;
  group_id?: string;
}

// export interface deleteAgentGroupType {
//   client_ids: number[];
// }

/**
 * The type definition for the initial state of the auth slice.
 */
export type initialStateProps = {
  status: string;
  successMsg: string;
  errorMsg: string;
  fetchStatus?: string;
  agentGroupDetail?: AgentGroupType;
  list: AgentGroupType[];
  total_records: number;
  total_item: number;
  selectedColumn: string[];
  actionStatus: boolean;
  searchAgentList: [];
  addagentList: [];
  actionStatusDisabled: boolean;
  actionStatusEdit: boolean;
  actionStatusGroupMember: boolean;
  agentGroupListMember: AgentGroupType;
  total_groupDetail: number;
};
export interface AgentGroupRootState {
  agentGroup: initialStateProps; // Add other slices if needed
}

export interface AgentGroupIDType {
  group_id?: string;
}
export interface deleteAgentGroupType {
  group_id?: number;
  member_id?: number;
}

// Type for the payload that updateProfile expects
export interface UpdateAgentGroupPayload {
  group_id?: number | string;
  group_name?: string;
  agent_ids?: [];
  delete_agent_ids?: [];
} // The form data object

// export interface ChangePassword {
//     type: number;
//     client_id?: number | string;
//     old_password?: string;
//     new_password: string;
// }
export interface searchAgentGroupType {
  group_id: number | string;
  agent_ids: number[];
  delete_agent_ids: [];
}
export interface filterGroupType {
  start: number;
  limit: number;
  search?: string;
  client_id?: any;
  group_id?: string;
}
