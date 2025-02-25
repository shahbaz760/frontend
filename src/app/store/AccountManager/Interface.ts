export interface AccManagerType {
  client_ids?: [];
  first_name?: string;
  last_name?: string;
  email?: string;
  social_id?: any;
  id?: number;
  role_id?: number;
  country_code?: number;
  phone_number?: number | string;
  address?: string;
  user_image?: any;
  company_name?: string;
  status?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  userName?: string;
  assigned_clients_count?: number;
  assigned_clients?: [];
  account_manager_id?: number;
  formData?: FormData;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string | number;
  country?: string;
  two_factor_authentication?: number | string;
  assigned_account_manager_client?: any[];
  is_welcome_email?: number;
  role_permission_id?: any;
}

export interface filterType {
  start: number;
  limit: number;
  search: string;
  client_id?: any;
}

/**
 * The type definition for the initial state of the auth slice.
 */
export type initialStateProps = {
  status: string;
  successMsg: string;
  clientlist?: any[];
  errorMsg: string;
  fetchStatus?: string;
  total_items: number;
  accManagerDetail?: AccManagerType;
  accClientList?: [];
  accAgentList?: [];
  list: AccManagerType[];
  selectedColumn: string[];
  actionStatus: boolean;
  total_records: number;
  fetchList?: boolean;
  is_welcome_email?: number;
  accountstatus?: string;
};

export interface AccManagerRootState {
  accManagerSlice: initialStateProps; // Add other slices if needed
}

export interface accManagerIDType {
  account_manager_id: string;
}
export interface deleteAccManagerType {
  accountManger_id: string | number;
  type?: number;
  search?: string;
  limit?: number | string;
  start?: number | string;
}

export interface assignedClientInfoType {
  first_name?: string;
  last_name?: string;
  phone_number?: number | string;
  address?: string;
  account_manager_id: string | number;
  client_ids?: any;
  unassign_client_ids?: any;
  files?: any;
  formData?: FormData;
}
