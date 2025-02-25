import { Button, InputAdornment, TextField, Theme } from "@mui/material";
import { useTheme } from "@mui/styles";
import { deletClient, getClientList } from "app/store/Client";
import {
  ClientRootState,
  ClientType,
  filterType,
} from "app/store/Client/Interface";
import { ProjectRootState } from "app/store/Projects/Interface";
import { RootState, useAppDispatch } from "app/store/store";
import { CrossGreyIcon, DeleteIcon } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { SearchIcon } from "public/assets/icons/topBarIcons";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import AddClient from "src/app/components/client/AddClient";
import ClientTable from "src/app/components/client/ClientTable";
import DeleteClient from "src/app/components/client/DeleteClient";
import ManageButton from "src/app/components/client/ManageButton";
import TitleBar from "src/app/components/TitleBar";
import { getUserDetail } from "src/utils";
import CommonTab from "../../components/CommonTab";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function Clients() {
  const theme: Theme = useTheme();
  const dispatch = useAppDispatch();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false);
  const { fetchMenuTask } = useSelector(
    (store: ProjectRootState) => store?.project
  );
  const { Accesslist } = useSelector((state: RootState) => state.project);
  const userDetails = getUserDetail();
  const [count, setCount] = useState(1);
  const { search } = useLocation();
  const query = search.split("=");
  const [active, setActive] = useState(query[query.length - 1]);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
  });
  const clientState = useSelector((store: ClientRootState) => store.client);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAllSelected, setisAllSelected] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setfilters((prevFilters) => ({
      ...prevFilters,
      start: 0,
    }));
  }, [active]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setfilters((prevFilters) => ({
        ...prevFilters,
        search: inputValue,
        start: 0,
      }));
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 800]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    // debouncedSearch(value);
  };
  const handleCheckboxChange = (rowId: number) => {
    const allRowIds = clientState?.list.map((row: ClientType) => row.id) || [];
    let selectedId = selectedIds.includes(rowId)
      ? [...selectedIds.filter((id) => id !== rowId)]
      : [...selectedIds, rowId];

    if (allRowIds.length == selectedId.length) {
      setSelectedIds(allRowIds);
      setisAllSelected(true);
    } else {
      setSelectedIds(selectedId); // Select all
      setisAllSelected(false);
    }
  };

  const handleSelectAll = () => {
    const allRowIds = clientState?.list.map((row: ClientType) => row.id) || [];
    const allSelected = allRowIds?.every((id: number) =>
      selectedIds.includes(id)
    );
    if (allSelected) {
      setSelectedIds([]); // Deselect all
      setisAllSelected(false);
    } else {
      setisAllSelected(true);
      setSelectedIds(allRowIds); // Select all
    }
  };

  const { actionStatusClient } = useSelector(
    (store: ClientRootState) => store.client
  );

  const deleteClient = async () => {
    if (!!actionStatusClient || selectedIds.length < 1) return;
    const { payload } = await dispatch(
      deletClient({ client_ids: selectedIds })
    );
    if (payload?.data?.status) {
      setfilters((prevFilters) => ({
        ...prevFilters,
        start: clientState?.list.length - 1 == 0 ? 0 : prevFilters.start,
      }));
      setIsOpenDeletedModal(false);
      fetchList();
    }
    setSelectedIds([]);
  };

  const fetchList = useCallback(() => {
    const payload = {
      ...filters,
      type:
        active == "all"
          ? 0
          : active == "active"
            ? 1
            : active == "paused"
              ? 2
              : active == "cancel"
                ? 3
                : active == "pastDue"
                  ? 4
                  : null,
    };
    dispatch(getClientList(payload));
  }, [dispatch, filters, active]);

  useEffect(() => {
    fetchList();
  }, [
    dispatch,
    filters.limit,
    filters.client_id,
    filters.search,
    filters.start,
    active,
  ]);

  useEffect(() => {
    setActive(query[query.length - 1]);
  }, [search]);

  const handleInputClear = () => {
    setInputValue("");
    setfilters((prevFilters) => ({
      ...prevFilters,
      search: "",
      start: 0,
    }));
  };
  const ClientTabButton = () => {
    return (
      <div className="flex flex-col gap-10 sm:flex-row relative">
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          defaultValue=""
          value={inputValue}
          variant="standard"
          placeholder="Search Client"
          onChange={handleSearchChange}
          className="flex items-center justify-center"
          sx={{
            height: "45px",
            pl: "8px", // Adjusted padding to accommodate the icon
            width: {
              xs: "100%", // Full width on extra-small screens
              sm: "100%", // Full width on small screens
              md: "260px", // 286px on medium and larger screens
            },
            pr: 2,
            backgroundColor: "#F6F6F6",
            borderRadius: "8px",
            border: "1px solid transparent",
            "&:focus-within": {
              border: "1px solid blue",
            },
            "& .MuiInputBase-input": {
              textDecoration: "none",
              border: "none",
            },
            "& .MuiInput-underline:before": {
              border: "none !important",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none !important",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#757982",
              opacity: 1,
            },
            "& .MuiInputAdornment-positionStart": {
              // marginLeft: "8px", // Adjusted margin to position the icon
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  width: 15,
                  display: "inline-flex",
                }}
              >
                {inputValue !== "" ? (
                  <CrossGreyIcon
                    className="cursor-pointer fill-[#c2cad2] h-[14px]  "
                    onClick={handleInputClear}
                  />
                ) : (
                  // Render an empty icon to occupy space when inputValue is empty
                  <div style={{ width: "24px" }} />
                )}
                {/* You can add more icons conditionally here */}
              </InputAdornment>
            ),
          }}
        />

        <ManageButton />
      </div>
    );
  };
  const tabs = [
    {
      id: "all",
      label: "All",
      content: (
        <ClientTable
          clientState={clientState}
          handleSelectAll={handleSelectAll}
          selectedIds={selectedIds}
          handleCheckboxChange={handleCheckboxChange}
          setfilters={setfilters}
          filters={filters}
          isAllSelected={isAllSelected}
        />
      ),
      actionBtn: ClientTabButton,
    },
    {
      id: "active",
      label: "Active",
      // content: <AssignedAgents type={1} />,
      content: (
        <ClientTable
          clientState={clientState}
          handleSelectAll={handleSelectAll}
          selectedIds={selectedIds}
          handleCheckboxChange={handleCheckboxChange}
          setfilters={setfilters}
          filters={filters}
          status={false}
        />
      ),
      actionBtn: ClientTabButton,
    },
    {
      id: "paused",
      label: "Paused",
      // content: <AssignedAgents type={2} />,
      content: (
        <ClientTable
          clientState={clientState}
          handleSelectAll={handleSelectAll}
          selectedIds={selectedIds}
          handleCheckboxChange={handleCheckboxChange}
          setfilters={setfilters}
          filters={filters}
          status={false}
        />
      ),
      actionBtn: ClientTabButton,
    },
    {
      id: "cancel",
      label: "Cancelled",
      // content: <AssignedAgents type={3} />,
      content: (
        <ClientTable
          clientState={clientState}
          handleSelectAll={handleSelectAll}
          selectedIds={selectedIds}
          handleCheckboxChange={handleCheckboxChange}
          setfilters={setfilters}
          filters={filters}
          status={false}
        />
      ),
      actionBtn: ClientTabButton,
    },
    {
      id: "pastDue",
      label: "Past Due",
      // content: <AssignedAgents type={4} />,
      content: (
        <ClientTable
          clientState={clientState}
          handleSelectAll={handleSelectAll}
          selectedIds={selectedIds}
          handleCheckboxChange={handleCheckboxChange}
          setfilters={setfilters}
          filters={filters}
          status={false}
        />
      ),
      actionBtn: ClientTabButton,
    },
  ];

  return (
    <>
      <TitleBar title="Clients">
        <div className="flex sm:items-start gap-10 flex-row  sm:h-56">
          {selectedIds?.length > 0 && (
            <>
              <Button
                variant="contained"
                className="h-[40px] hidden  text-[16px] font-600 sm:flex gap-8 text-[#4F46E5] bg-[#EDEDFC] hover:bg-transparent"
                aria-label="delete"
                size="large"
                onClick={() => setIsOpenDeletedModal(true)}
              >
                Delete
              </Button>
              <div className="flex sm:hidden items-center justify-center">
                <DeleteIcon onClick={() => setIsOpenDeletedModal(true)} />
              </div>
            </>
          )}
          {(userDetails?.role_id == 1 ||
            (userDetails?.role_id == 4 && Accesslist.client_view == 0)) && (
            <Button
              variant="outlined"
              color="secondary"
              className="h-[40px] text-[16px] flex gap-8 font-600 leading-3"
              aria-label="Clients"
              size="large"
              onClick={() => setIsOpenAddModal(true)}
            >
              <PlusIcon color={theme.palette.secondary.main} />
              Add Client
            </Button>
          )}
        </div>
      </TitleBar>

      <div className="gap-20 px-[15px] lg:flex-nowrap ">
        <div className="basis-full lg:basis-auto lg:grow">
          <div className="bg-white rounded-lg shadow-sm  mb-20 ">
            <CommonTab tabs={tabs} setActive={setActive} />
            {/* <div className="h-24" /> */}
          </div>
        </div>
      </div>
      <AddClient
        isOpen={isOpenAddModal}
        setIsOpen={setIsOpenAddModal}
        fetchList={fetchList}
      />

      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        loading={clientState?.actionStatus}
        onDelete={deleteClient}
        heading={"Delete Client"}
        description={"Are you sure you want to delete this Client? "}
      />
    </>
  );
}
