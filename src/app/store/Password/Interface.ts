export interface ClientType {
  subscription_status?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  files?: File;
  company_name?: string;
  id?: number;
  client_id?: number | string;
  role_id?: number;
  role?: string;
  country_code?: number | string;
  phone_number?: number | string;
  address?: string;
  user_image?: string;
  status?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
  userName?: string;
  agent_ids?: number[];
  address2?: string;
  city?: string;
  country?: string;
  zipcode?: number | string;
  state?: string;
  is_welcome_email?: number;
  last_subscription_detail?: any;
  next_subscription_detail?: any;
}

export interface filterType {
  start: number;
  limit: number;
  search: string;
  client_id?: number[] | string[];
  date?: any;
  currentDate?: any;
}

export interface deleteClientType {
  client_ids: number[];
}

export interface ProductDelete {
  product_id: number | string;
}

/**
 * The type definition for the initial state of the auth slice.
 */
export type initialStateProps = {
  status: string;
  supportStatus?: string;
  statusList?: string;
  supportDetailsStatus?: string;
  details: any;
  fetchStatus?: string;
  list: ClientType[];
  data?: any;
  accManagerdata?: any;
  total_records: number;
  total_items: number;
  assignedAgentDetail: any[];
  assignAccManagerDetail?: any[];
  supportlist?: any[];
  Support_total_records?: number;
  Support_total_items?: number;
  Departmentstatus?: string;
  managerStatus?: string;
};
export interface ClientRootState {
  client: initialStateProps; // Add other slices if needed
}

export interface clientIDType {
  client_id?: string | number;
  agent_id?: Number | string;
  account_manager_id?: number[];
  account_manager_ids?: number[];
  task_id?: number;
}

// Type for the payload that updateProfile expects
export interface UpdateProfilePayload {
  formData: FormData; // The form data object
}

export interface ChangePassword {
  type: number;
  client_id?: number | string;
  old_password?: string;
  new_password: string;
  email?: string;
  password?: string;
}

export interface SubscriptionList {
  start: number;
  limit: number;
  search: string;
}

export interface ProductAdd {
  name: string;
  description: string;
  unit_price: number;
}

export interface ProductUpdate {
  product_id: number | string;
  name: string;
  description: string;
  unit_price: number;
}
export interface SubscriptionListItem {
  client_id?: number | string;
  start: number;
  limit: number;
  search: string;
}
export interface AddLineItem {
  name: string;
  description: string;
  unit_price: number;
  quantity: number;
  billing_frequency: number;
  billing_terms: number;
  no_of_payments: number;
  is_delay_in_billing: number;
  billing_start_date: string;
}

export interface AddSubscriptionList {
  client_id: string;
  title: string;
  one_time_discount_name: string;
  one_time_discount_type: string;
  one_time_discount: number;
  subtotal: number;
  total_price: number;
  subscription_data: {
    id: number;
    user_id: number;
    name: string;
    description: string;
    unit_price: number;
    type: number;
    quantity: number | null;
    billing_frequency: number;
    billing_terms: number;
    no_of_payments: number | null;
    is_delay_in_billing: number;
    billing_start_date: Date | null;
    stripe_price_id: string | null;
    deleted_at: Date | null;
    createdAt: Date;
    updatedAt: Date;
    unit_discount_type: number;
    unit_discount: number;
    net_price: number;
  }[];
}

export interface ClientInfo {
  client_id: number | string;
  start?: number;
  limit?: number;
  search?: string;
  agentfilterMenu?: object;
  setAgentfilterMenu?: object;
  managerfilterMenu?: object;
  setManagerfilterMenu?: object;
  previousPage?: number;
}
