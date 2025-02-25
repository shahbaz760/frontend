import { boolean } from "yup";

export interface ClientType {
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
  agent_id?: number[];
  message?: string;
}
export interface taskDetailType {
  id?: number;
  user_id?: number;
  task_selected_labels?: [];
  project_id?: number;
  project_column_id?: number;
  title?: string;
  description?: string;
  voice_record_file?: string;
  screen_record_file?: string;
  priority?: string;
  labels?: string;
  status?: string;
  sort_order?: null;
  due_date_time?: null;
  business_due_date?: null;
  reminders?: null;
  deleted_at?: null;
  createdAt?: string;
  updatedAt?: string;
  project_name?: string;
  column_name?: string;
  task_files?: any;
  assigned_task_users?: any;
  task_labels?: any;
  total_message_count?: number;
}

export interface filterType {
  start: number;
  limit: number;
  search: string;
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
  isSubtask?: boolean;
  Accesslist?: any;
  fetchTask: string;
  ProjectTask: any[];
  AccessStatus: string;
  status: string;
  whiteBoardStatus?: string;
  whiteBoardList: [];
  DocStatus: string;
  saveFilterListStatus?: string;
  saveFilterList?: any[];
  DocList: [];
  successMsg: string;
  filtered: number;
  projectColumnId: string;
  MainOp: string;
  conditions: any;
  errorMsg: string;
  fetchStatus?: string;
  sorting?: [];
  filterdata?: {
    key: number;
    order: number;
  };
  layoutBasedGroup?: string;
  calenderData?: [];
  fetchMenuTask?: string;
  fetchMenuTab?: string;
  fetchStatusNew?: string;
  tasktablestatus?: string;
  tasktableStatus?: string;
  searchStatus?: string;
  fetchStatusTask?: string;
  clientDetail?: object;
  list: ClientType[];
  total_records: number;
  selectedColumn: string[];
  actionStatus: boolean;
  isloading?: boolean;
  assignedAgentDetail: ClientType[];
  agentTotal_records?: number;
  taskDetailInfo?: taskDetailType;
  projectInfo?: any;
  actionDisable?: boolean;
  fetchSatus?: string;
  fetchSubTask?: string;
  projectDataInfo?: any[];
  clientDashBoaredTask?: boolean;
  fetchStatusNews?: boolean;
  agentActivity?: ClientType[];
  projectList: any[];
  projectBoardList: any[];
  projectBoardMainList: any[];
  projectBoardAddMoreList: any[];
  isBoardListLoading: boolean;
  projectColumnData: any[];
  totalChatPages: any;
  notificationStatus: string;
  notificationList: any[]
};
// export interface ClientRootState {
//   client: initialStateProps; // Add other slices if needed
// }
export interface ProjectRootState {
  project: initialStateProps; // Add other slices if needed
}

export interface clientIDType {
  client_id?: string;
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
}

export interface SubscriptionList {
  start: number;
  limit: number;
  search: string;
}

export interface NotificaitonList {
  start: number;
  limit: number;
  search: string;
}

export interface ProjectAdd {
  name: string;
}

export interface WhiteBoardData {
  project_id: string;
  xml_data: string;
  xml_img: string;
  name?: string;
  project_menu_id?: number;
}

export interface Taskadd {
  project_id: number;
  project_column_id: number;
  title: string;
  description: string;
  priority: string;
  labels: string;
  status: string;
  agent_ids: any[];
  voice_record_file: any;
  files: any;
  screen_record_file: any;
  due_date_time: string | number;
  reminders: string | number;
}
export interface ProjectAddDoc {
  name: string;
  token: any;
}
export interface ProjectUpdate {
  project_id: number | string;
  data: { name: string };
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
  };
}
export interface ApiResponse {
  status: number;
  message: string;
  code: number;
  data: any | null; // or more specific type if known
  meta: any | null;
}
