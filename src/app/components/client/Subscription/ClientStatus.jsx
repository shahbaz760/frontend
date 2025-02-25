import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { UpdateStatus } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import { ActiveIcon, UpArrowBlank } from "public/assets/icons/clienIcon";
import {
  CrossGreyIcon,
  CrossIcon,
  DownGreenIcon,
} from "public/assets/icons/common";
import {
  DownArrowBlank,
  DownArrowGreen,
} from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToSentenceCase } from "src/utils";

export const ClientStatus = ({ rowstatus, id, title }) => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage anchor element for menu
  const [selectedItem, setSelectedItem] = useState("Active");
  const [disable, setIsDisable] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to manage confirmation dialog visibility
  const [pendingStatus, setPendingStatus] = useState(null); // State to manage the status to be updated
  const dispatch = useAppDispatch();

  // Open menu handler
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to the clicked button
  };

  // Close menu handler
  const handleClose = () => {
    setAnchorEl(null); // Reset anchor element to hide the menu
  };

  // Open confirmation dialog handler
  const handleMenuItemClick = async (status) => {
    setPendingStatus(status);
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  // Confirm status update handler
  const handleConfirm = async (confirmed) => {
    if (confirmed && pendingStatus) {
      setIsDisable(true);

      const res = await dispatch(
        UpdateStatus({
          user_id: id,
          status: pendingStatus === "Inactive" ? 2 : 1,
        })
      );
      setSelectedItem(pendingStatus);
      setIsDisable(false);
      toast.success(res?.payload?.data?.message);
    }
    setIsConfirmOpen(false);
    setPendingStatus(null);
    handleClose(); // Close the menu after handling the click
  };

  useEffect(() => {
    setSelectedItem(rowstatus);
  }, [rowstatus]);
  // const SentenceCaseTitle = ({ title }) => {
  // const convertToSentenceCase = (str) => {
  //   if (!str) return "";
  //   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  // };
  return (
    <>
      <Button
        variant="outlined"
        className={`h-20 rounded-3xl border-none min-h-24 leading-none  ${
          selectedItem === "Active"
            ? "text-[#4CAF50] bg-[#4CAF502E]" // Green for 'Active'
            : "text-[#F44336] bg-[#F443362E]"
        }`}
        style={{ width: "100px", Height: "25px" }}
        endIcon={
          <>
            {anchorEl ? (
              <UpArrowBlank
                fill={selectedItem === "Active" ? "#4CAF50" : "#F44336"}
              />
            ) : (
              <DownArrowGreen
                color={selectedItem === "Active" ? "#4CAF50" : "#F44336"}
              />
            )}
          </>
        }
        onClick={handleClick}
      >
        {selectedItem}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose} // Close the menu when clicking outside or selecting an item
      >
        <MenuItem
          onClick={() => handleMenuItemClick("Active")}
          disabled={selectedItem == "Active"}
        >
          Active
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Inactive")}
          disabled={selectedItem == "Inactive"}
        >
          Inactive
        </MenuItem>
      </Menu>
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="p-10"
      >
        {/* <DialogTitle>Confirm Status Change</DialogTitle> */}
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2, // Optional: margin-bottom to add some space below the icons
            }}
          >
            <CrossGreyIcon
              className="cursor-pointer"
              onClick={() => setIsConfirmOpen(false)}
              sx={{ marginRight: 2 }} // Add some space between the icons
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2, // Optional: margin-bottom to add some space below the icons
            }}
          >
            <ActiveIcon
              sx={{ marginRight: 2 }} // Add some space between the icons
            />
          </Box>
          <DialogContentText className="text-[#000]">
            <Typography className="text-[20px] font-600 text-center pb-10">
              {pendingStatus} {convertToSentenceCase(title)}
            </Typography>
            <Typography className="text-[14px] font-400 text-[#757982] px-20 text-center">
              Are you sure you want to {pendingStatus} <br /> this {title}?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className=" justify-center pb-20 px-20">
          <Button
            variant="outlined"
            color="secondary"
            disabled={disable}
            className={`${disable ? "btn-disable-light" : ""}
       
            w-[131px] h-[48px] text-[16px] font-400`}
            onClick={(e) => {
              handleConfirm(false);
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={disable}
            className={`${disable ? "btn-disable" : ""}
                      
                         w-[131px] h-[48px] text-[16px] font-400 `}
            onClick={(e) => {
              handleConfirm(true);
            }}
          >
            {disable ? (
              <Box
                marginTop={0}
                id="spinner"
                sx={{
                  "& > div": {
                    backgroundColor: "palette.secondary.main",
                  },
                }}
              >
                <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
              </Box>
            ) : (
              "Yes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientStatus;
