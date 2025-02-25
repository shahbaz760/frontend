import { truncate } from "lodash";
import { MenuItem, styled } from "@mui/material";
import { addMonths, addWeeks, addYears } from "date-fns";
import CryptoJS from "crypto-js";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { projectColumnList } from "app/store/Projects";
type SelectProp = {
  value: string;
  label: string;
};

/**
 * Get access token from local storage
 */
export const getLocalStorage = (item: string) => {
  let data = localStorage.getItem(item);
  return data !== null && data !== undefined ? JSON.parse(data) : "{}";
};

/**
 * function to get token from local storage
 * @returns
 */
export const getToken = () => {
  // Get the value of the 'clientId' parameter
  const clientId = getClientId();
  let newDataKey = "";
  if (clientId) {
    newDataKey = clientId + "jwt_access_token";
  } else {
    newDataKey = "jwt_access_token";
  }
  let localData = localStorage.getItem(newDataKey);
  return localData;
};

// Utility function to get data from local storage
export const getLocalStorageToken = () => {
  const clientId = getClientId();
  if (clientId) {
    const data = localStorage.getItem("userTokens");
    const parseData = data ? JSON.parse(data) : "";
    const token = parseData[clientId] ? parseData[clientId] : "";
    return token;
  } else {
    const data = localStorage.getItem("jwt_access_token");
    return data ? data : "";
  }
};

// Utility function to set data in local storage
export const setLocalStorageToken = (
  key: string,
  userId: string | number,
  userToken: string
) => {
  // Retrieve existing data
  const existingData = getLocalStorageToken();

  // Add or update the new userId and userToken
  const updatedData = {
    ...existingData,
    [userId]: userToken,
  };

  // Store updated data back to local storage
  localStorage.setItem(key, JSON.stringify(updatedData));
};

// Utility function to remove data from local storage
export const removeLocalStorageToken = (key: string, userId: string) => {
  const existingData = getLocalStorageToken();

  if (existingData[userId]) {
    delete existingData[userId];
    localStorage.setItem(key, JSON.stringify(existingData));
  }
};

/**
 *
 * function to get user Detail from local storage
 * @returns
 */
export const getUserDetail = () => {
  const clientId = getClientId();
  let newDataKey = "";
  if (clientId) {
    newDataKey = clientId + "userDetail";
  } else {
    newDataKey = "userDetail";
  }
  let localData = localStorage.getItem(newDataKey);
  return localData !== null && localData !== undefined
    ? JSON.parse(localData)
    : "{}";
};

export const getPermission = (data) => {
  let userDetails = getUserDetail();
  if (userDetails && userDetails.is_signed == 0) {
    return "verification";
  } else if (
    userDetails &&
    (userDetails.projects == false || userDetails?.projects?.length == 0)
  ) {
    return "project";
  } else {
    return "dashboard";
  }
};

/**
 * function to set user Detail to local storage
 * @param clientId
 * @returns
 */
export const setUserDetail = (data: string) => {
  // Get the value of the 'clientId' parameter
  const clientId = getClientId();
  let newDataKey = "";
  if (clientId) {
    newDataKey = clientId + "userDetail";
  } else {
    newDataKey = "userDetail";
  }
  localStorage.setItem(newDataKey, data);
};

/**
 *
 * function to get checkBox Detail from local storage
 * @returns
 */
export const getCheckBoxDetails = () => {
  // Get the value of the 'clientId' parameter
  const clientId = getClientId();
  const userId = getUserDetail();
  const activeUserId = clientId ? clientId : userId?.uuid;
  let localData = localStorage.getItem("checkboxState");
  const activeUserData = localData ? JSON.parse(localData) : null;

  return activeUserData?.hasOwnProperty(activeUserId)
    ? activeUserData[activeUserId]
    : null;
};

/**
 *
 * function to get columnList Detail from local storage
 * @returns
 */
export const getcolumnListDetails = () => {
  // Get the value of the 'clientId' parameter
  const clientId = getClientId();
  const userId = getUserDetail();
  const activeUserId = clientId ? clientId : userId?.uuid;
  let localData = localStorage.getItem("columnList");

  const activeUserData = localData ? JSON.parse(localData) : null;

  return activeUserData?.hasOwnProperty(activeUserId)
    ? activeUserData[activeUserId]
    : null;
};

export const StyledMenuItem: any = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: "250px",
  gap: "16px",

  "& .radioIcon": {
    color: "#9DA0A6",
    border: "2px solid currentColor",
    height: "16px",
    aspectRatio: 1,
    borderRadius: "50%",
    fontWeight: 500,
    lineHeight: "20px",
    position: "relative",
    marginLeft: "2px",
  },
  "& .Mui-selected": {
    backgroundColor: "transparent",
    width: "200px",

    "& .radioIcon": {
      color: theme.palette.secondary.main,

      "&::after": {
        content: '""',
        display: "block",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "7px",
        aspectRatio: 1,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    },
  },
}));

export const MonthlyOptions: SelectProp[] = [
  { value: "1", label: "One time" },
  { value: "2", label: "Monthly" },
  { value: "3", label: "Quarterly" },
  { value: "4", label: "Semi annually" },
  { value: "5", label: "Annually" },
  { value: "6", label: "Every 1 week" },
  { value: "7", label: "Every 4 weeks" },
  // { value: "Add weekly and bi-weekly", label: "Add weekly and bi-weekly" },
];

export const MonthlyEditOptions: SelectProp[] = [
  { value: "2", label: "Monthly" },
  { value: "3", label: "Quarterly" },
  { value: "4", label: "Semi annually" },
  { value: "5", label: "Annually" },
  { value: "6", label: "Every 1 week" },
  { value: "7", label: "Every 4 weeks" },
  // { value: "Add weekly and bi-weekly", label: "Add weekly and bi-weekly" },
];

export function getLabelByValue(value: string): string {
  const option = MonthlyOptions.find((option) => option.value == value);
  return option ? option.label : "--";
}

export function getAdjustedDate(date: Date, value: any): Date {
  switch (value) {
    case 1:
      return null;
    case 2:
      return addMonths(date, 1);
    case 3:
      return addMonths(date, 3);
    case 4:
      return addMonths(date, 6);
    case 5:
      return addYears(date, 1);
    case 6:
      return addWeeks(date, 1);
    case 7:
      return addWeeks(date, 4);
    default:
  }
}

export function getAdjustedTime(value: any): string {
  switch (value) {
    case 1:
      return "";
    case 2:
      return "1 month";
    case 3:
      return "3 months";
    case 4:
      return "6 months";
    case 5:
      return "1 year";
    case 6:
      return "1 week";
    case 7:
      return "4 weeks";
    default:
  }
}

export function getAdjusted(value: any): string {
  switch (value) {
    case 1:
      return "One time";
    case 2:
      return "Month";
    case 3:
      return "Quarterly";
    case 4:
      return "Semi annually";
    case 5:
      return "Annually";
    case 6:
      return "Every 1 week";
    case 7:
      return "Every 4 weeks";
    default:
  }
}

export const EmployOptions: SelectProp[] = [
  { value: "1", label: "One time" },
  { value: "2", label: "Monthly" },
  { value: "3", label: "Quarterly" },
  { value: "4", label: "Semi annually" },
  { value: "5", label: "Annually" },
  { value: "6", label: "Every 1 week" },
  { value: "7", label: "Every 4 weeks" },
  // { value: "Add weekly and bi-weekly", label: "Add weekly and bi-weekly" },
];

export const EmployOptions1: SelectProp[] = [
  // { value: "1", label: "One time" },
  { value: "2", label: "Monthly" },
  { value: "3", label: "Quarterly" },
  { value: "4", label: "Semi annually" },
  { value: "5", label: "Annually" },
  { value: "6", label: "Every 1 week" },
  { value: "7", label: "Every 4 weeks" },
  // { value: "Add weekly and bi-weekly", label: "Add weekly and bi-weekly" },
];
export const UnitDiscount: SelectProp[] = [
  { value: "1", label: "%" },
  { value: "2", label: "USD" },
];

export const Action: SelectProp[] = [
  { value: "Edit", label: "Edit" },
  { value: "Doller", label: "Doller" },
];

export const BillingTermsOptions: SelectProp[] = [
  { value: "2", label: "Automatically renew until cancelled" },
  { value: "1", label: "Fixed number of payments" },
];

const columnKey = {
  ID: "id",
  Name: "first_name",
  ["Company Name"]: "company_name",
  ["Joining Date"]: "created_at",
  ["Subscription Status"]: "subscription_status",
  ["Account Status"]: "status",
};

export const sortList = (column: string, isAsc: boolean, list: any) => {
  const sortedRows = [...list].sort((a, b) => {
    const aValue = a[columnKey[column]]
      ? a[columnKey[column]].toString().toLowerCase()
      : "";
    const bValue = b[columnKey[column]]
      ? b[columnKey[column]].toString().toLowerCase()
      : "";

    if (aValue < bValue) return isAsc ? -1 : 1;
    if (aValue > bValue) return isAsc ? 1 : -1;
    return 0;
  });
  return sortedRows;
};

export const sortAgentList = (
  column: string,
  isAsc: boolean,
  list: any,
  columnKey: any
) => {
  const sortedRows = [...list].sort((a, b) => {
    const aValue = a[columnKey[column]]
      ? a[columnKey[column]].toString().toLowerCase()
      : "";
    const bValue = b[columnKey[column]]
      ? b[columnKey[column]].toString().toLowerCase()
      : "";

    if (aValue < bValue) return isAsc ? -1 : 1;
    if (aValue > bValue) return isAsc ? 1 : -1;
    return 0;
  });
  return sortedRows;
};

export const sortAgentListing = (
  column: string,
  isAsc: boolean,
  list: any,
  columnKey: any
) => {
  const sortedRows = [...list].sort((a, b) => {
    const aValue =
      a[columnKey[column]] !== undefined && a[columnKey[column]] !== null
        ? a[columnKey[column]]
        : "";
    const bValue =
      b[columnKey[column]] !== undefined && b[columnKey[column]] !== null
        ? b[columnKey[column]]
        : "";

    if (typeof aValue === "number" && typeof bValue === "number") {
      return isAsc ? aValue - bValue : bValue - aValue;
    } else {
      const aStr = aValue.toString().toLowerCase();
      const bStr = bValue.toString().toLowerCase();

      if (aStr < bStr) return isAsc ? -1 : 1;
      if (aStr > bStr) return isAsc ? 1 : -1;
      return 0;
    }
  });
  return sortedRows;
};

export const sortNestedAgentList = (
  column: string,
  isAsc: boolean,
  list: any,
  columnKey: any
) => {
  // Utility function to get the nested value
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const sortedRows = [...list].sort((a, b) => {
    const aValue = getNestedValue(a, columnKey[column])
      ? getNestedValue(a, columnKey[column]).toString().toLowerCase()
      : "";
    const bValue = getNestedValue(b, columnKey[column])
      ? getNestedValue(b, columnKey[column]).toString().toLowerCase()
      : "";

    if (aValue < bValue) return isAsc ? -1 : 1;
    if (aValue > bValue) return isAsc ? 1 : -1;
    return 0;
  });
  return sortedRows;
};
/**
 * Calculates the page number for a given item indexs.
 * @param itemIndex - The zero-based index of the item.
 * @param itemsPerPage - The number of items displayed on each page.
 * @returns The one-based page number where the item resides.
 */
export function calculatePageNumber(
  itemIndex: number,
  itemsPerPage: number
): number {
  if (itemsPerPage <= 0) {
    return 1;
  }
  // This is a one-based page number, so add 1 to the result.
  return Math.ceil(itemIndex / itemsPerPage);
}

export const getParamFromPathname = (pathName: string) => {
  const arrayOfPath = pathName.split("/");
  const removeEmptyString = arrayOfPath.filter((path: string) => {
    return path !== "";
  });

  return !isNaN(+removeEmptyString[0]) && +removeEmptyString[0] !== 404
    ? removeEmptyString[0]
    : null;
};

export const getClientId = () => {
  const queryString = window.location.search;
  // Create a URLSearchParams object to work with the query string
  const urlParams = new URLSearchParams(queryString);
  // Get the value of the 'clientId' parameter
  const clientId = urlParams.get("ci");
  // const decodeId = decodeData(clientId);
  // return decodeId;
  return clientId;
};

export interface keywordDataType {
  id: number;
  key_name: string;
}

export const checkMatchingKeyWords = (
  keywordsData: keywordDataType[],
  message: string
) => {
  const words = message.split(" ");
  // Create a set of key_names for faster lookup (convert to lowercase)
  const keyNameSet = new Set();
  keywordsData.forEach((item) => {
    item.key_name
      .split(" ")
      .forEach((word) => keyNameSet.add(word.toLowerCase()));
  });
  // Filter words that match any key_name (convert to lowercase for comparison)
  const matchingWords = words.filter((word) =>
    keyNameSet.has(word.toLowerCase())
  );

  return matchingWords;
};

export const decodeData = (encryptedData: string) => {
  if (encryptedData) {
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
};
export const decodeJWT = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const payload = parts[1]; // The payload part of the token
  const decodedPayload = atob(payload); // Decode Base64

  return JSON.parse(decodedPayload); // Parse JSON string
};

export const encodeData = (data: string) => {
  if (data) {
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;
    const encryptedData = CryptoJS.AES.encrypt(`${data}`, secretKey).toString();
    return encryptedData;
  }
};

export const createEncryptedSearchQuery = () => {
  const clientId = getClientId();
  const encryptId = encodeData(clientId);
  return clientId ? `?ci=${encryptId}` : "";
};

export const removeInitialSpace = (value: string) => value.replace(/^\s+/g, "");

// export const

export const getBgColorOfChip = (status: string) => {
  if (status === "Pending") {
    return "#ffeb3b";
  } else if (status === "In Progress") {
    return "#fddfdf";
  } else if (status === "In Review") {
    return "#fcf3cf";
  } else if (status === "Completed") {
    return "#d3f9d8";
  } else if (status === "Re Opened") {
    return "#F8D7DA";
  } else if (status === "Closed") {
    return "#f5f5dc";
  }
};

export const getTextColorOfChip = (status: string) => {
  if (status === "Pending") {
    return "#856404";
  } else if (status === "In Progress") {
    return "#c82333";
  } else if (status === "In Review") {
    return "#856404";
  } else if (status === "Completed") {
    return "#155724";
  } else if (status === "Re Opened") {
    return "#721C24";
  } else if (status === "Closed") {
    return "#6c757d";
  }
};

export const removeDash = (text: string) => {
  const result = text?.split("-");
  return result?.join(" ");
};

export const Role = (id) => {
  switch (id) {
    case 1:
      return "Admin";
    case 2:
      return "Client";
    case 3:
      return "Agent";
    case 4:
      return "Admin User";
    case 5:
      return "User";
    default:
      return "Unknown Role";
  }
};
export const convertToSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Function to convert data to CSV format and download it
export const downloadCSV = (
  headings: string[],
  csvRows: string[][],
  csvName: string
) => {
  let csvContent =
    headings.join(",") + "\n" + csvRows.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${csvName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (value: any) => {
  if (value == null) {
    return "N/A"; // Handle null or undefined cases
  }
  // Convert the value to an absolute number to handle negatives
  const absValue = Math.abs(value);
  let formattedValue = "";
  // Determine the format based on the value size
  if (absValue >= 1e9) {
    formattedValue = (absValue / 1e9).toFixed(2) + "B"; // Convert to billions
  } else if (absValue >= 1e6) {
    formattedValue = (absValue / 1e6).toFixed(2) + "M"; // Convert to millions
  }
  // else if (absValue >= 1e5) {
  //   formattedValue = (absValue / 1e5).toFixed(2) + "L"; // Convert to lakhs
  // }
  else {
    formattedValue = absValue.toFixed(2); // Show the value as is
  }
  // Add the currency symbol and handle negative values
  return value < 0 ? `- $${formattedValue}` : `$${formattedValue}`;
};

export const formatCurrencyChart = (value: any) => {
  if (value == null) {
    return "N/A"; // Handle null or undefined cases
  }

  // Check if value is negative or positive
  return value < 0
    ? `- $${Math.abs(value)}` // For negative values
    : `$${value}`; // For positive or zero values
};

export const getOnlyYear = (date: string) => {
  if (date == "") {
    return "";
  }
  const newDate = new Date(date);

  const onlyYear = newDate.getFullYear();

  return onlyYear;
};

// Get the current month and year
export const getCurrentMonth = (month?: boolean) =>
  month ? moment().format("MMM") : moment().format("MMM YYYY");

// Get the past month and year
export const getPastMonth = (month?: boolean) =>
  month
    ? moment().subtract(1, "months").format("MMM")
    : moment().subtract(1, "months").format("MMM YYYY");

// Get the past month and year
export const getPastMonth2 = (month?: boolean) =>
  moment().subtract(2, "months").format("MMM");

export const listData = async ({
  task_start = 0,
  columnid = 0,
  loader = true,
  drag = true,
  search = null,
  applyopMain = "",
  filter = null,
  groupkey = null,
  order = 0,
  sort = [],
  condition = [],
  project_id = 0,
  dispatch,
  is_view = 0,
}) => {
  const transformArray = (inputArray) => {
    return inputArray.map((item) => ({
      applyOp: applyopMain,
      condition: item.filterConditions.map((cond) => ({
        applyOp:
          item.filterConditions.length > 1
            ? cond.applyOp == "AND"
              ? "AND"
              : "OR"
            : "", // Adjust according to your requirements
        key: cond.key, // Assuming you want to keep the key as is
        op: cond.op, // Assuming you want to keep the op as is
        value: cond.op == 2 || cond.op == 3 ? [] : cond.value,
      })),
    }));
  };
  const payload: any = {
    start: 0,
    limit: -1,
    search: search,
    project_id: project_id,
    task_start: task_start,
    task_limit: 20,
    project_column_id: columnid,
    is_filter: filter,
    group: {
      key: groupkey,
      order: order,
    },
    sort: sort,
    filter: transformArray(condition),
    is_view: is_view,
    is_filter_save: 0,
  };
  try {
    const res = await dispatch(projectColumnList({ payload, loader, drag }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export function formatDateBasedOnDifference(inputDate) {
  const givenDate = moment(inputDate);
  const currentDate = moment();

  // Calculate the difference in hours between the current date and the given date
  const diffInHours = currentDate.diff(givenDate, "hours");

  if (diffInHours > 24) {
    // If more than 24 hours ago, return the date in a readable format
    return givenDate.format("MMMM D, YYYY");
  } else {
    // If within the last 24 hours, return the time difference
    return givenDate.fromNow();
  }
}
