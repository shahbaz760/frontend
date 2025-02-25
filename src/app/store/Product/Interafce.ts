/**
 * The type definition for the initial state of the auth slice.
 */
export type initialStateProps = {
  actionStatusAttachment?: boolean;
  status?: string;
  successMsg?: string;
  errorMsg?: string;
  fetchStatus?: string;
  productList?: any[];
  total_items?: number;
  selectedColumn?: string[];
  actionStatus?: boolean;
  total_records?: number;
  resetFormData?: any;
  fetchnote?: string;
  noteList?: any[];
  total?:any
  subscriptionData?:any[]
};
