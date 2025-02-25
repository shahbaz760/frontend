import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ResendSubscription } from "app/store/Client";
import { useAppDispatch } from "app/store/store";
import * as React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ITEM_HEIGHT = 48;

interface DropdpownProps {
  icon: string;
  status: number;
  link: string;
  id?: any;
  billing_frequency?: any;
}

export default function Dropdpown({
  icon,
  status,
  link,
  id,
  billing_frequency,
}: DropdpownProps) {
  let options;
  if (status === 0) {
    options = ["Edit", "Send on Email", "Copy Link"];
  } else if (status == 1) {
    options = ["Edit"];
  } else if (status == 3) {
    options = ["Send on Email"];
  }

  const Navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const hadleSendEmail = async () => {
    await dispatch(ResendSubscription(id));
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          // Optionally, show a success message
          toast.success("Link copied to clipboard");
        })
        .catch((err) => {
          // Handle error
          console.error("Failed to copy link: ", err);
        });
    }
    handleClose(); // Close the menu after copying
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className="w-[46px] hover:bg-transparent"
      >
        <img src={icon} alt="dots" />
      </IconButton>
      <Menu
        id="long-menu"
        anchorOrigin={{
          vertical: "bottom", // Aligns menu to the bottom
          horizontal: "right", // Aligns menu to the right
        }}
        transformOrigin={{
          vertical: "top", // Aligns menu to the top
          horizontal: "right", // Aligns menu to the right
        }}
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        style={{ marginTop: "-15px" }} // Add margin from top
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "175px",
            borderRadius: "8px",
          },
        }}
      >
        {options?.length > 0 &&
          options?.map((option) => (
            <MenuItem
              key={option}
              onClick={() => {
                if (option === "Copy Link") {
                  handleCopyLink();
                }
                if (option === "Edit") {
                  if (billing_frequency == 1) {
                    // setIsConfirmOpen(true);

                    toast.error(
                      "Editing is restricted for one-time subscriptions!"
                    );
                  } else {
                    Navigate(`/admin/client/edit-subscription/${id}`);
                  }
                }
                if (option === "Send on Email") {
                  hadleSendEmail();
                }
                handleClose();
              }}
              className="text-[14px] font-medium leading-5 py-[9px]"
            >
              {option}
            </MenuItem>
          ))}
      </Menu>

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        className="p-10"
      >
        <DialogContent>
          <DialogContentText className="text-[#000] text-[18px] font-600">
            Editing is restricted for one-time subscriptions!
          </DialogContentText>
        </DialogContent>
        <DialogActions className="pb-10 justify-center">
          <Button
            variant="contained"
            color="secondary"
            className={`text-[18px] text-center`}
            onClick={(e) => {
              setIsConfirmOpen(false);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
