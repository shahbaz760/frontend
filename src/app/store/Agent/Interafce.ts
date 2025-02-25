export interface AgentType {
  first_name?: string;
  last_name?: string;
  email?: string;
  id?: number;
  role_id?: number;
  country_code?: number;
  phone_number?: number;
  is_delete_access?: any;
  address?: string;
  user_image?: any;
  company_name?: string;
  status?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  userName?: string;
  agent_id?: any;
  formData?: FormData;
  attachments?: any[];
  two_factor_authentication?: number | string;
  assigned_agent_client?: any[];
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: number | string;
  country?: string;
  last_login?: string;
  is_edit_access?: any;
  start_date?: string;
  kyc_front_pic?: string;
  kyc_back_pic?: string;
  is_complete_profile?: number;
  captured_pic?: string;
}

export interface filterAgentType {
  start?: number;
  limit?: any;
  search?: string;
  group_id?: any;
  agent_id?: number | string;
}

/**
 * The type definition for the initial state of the auth slice.
 */
export type initialStateProps = {
  actionStatusAttachment?: boolean;
  status: string;
  successMsg: string;
  errorMsg: string;
  fetchStatus?: string;
  agentDetail?: AgentType;
  list: AgentType[];
  total_items: number;
  selectedColumn: string[];
  actionStatus: boolean;
  total_records: number;
  resetFormData?: any;
  taskLabelList: any[];
  fetchnote?: string;
  noteList?: any[];
};

export interface AgentRootState {
  agent: initialStateProps; // Add other slices if needed
}

export interface agentIDType {
  agent_id: string;
  data?: any;
}
export interface kycRequestType {
  agent_id: number;
  status: number;
  reject_reason: string;
}

export interface uploadData {
  agent_id: string;
  formData: FormData;
}

export interface deleteDocument {
  attachment_id: number;
}
