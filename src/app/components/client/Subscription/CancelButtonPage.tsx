import { Box, Button, MenuItem, Theme, styled } from "@mui/material";
import { useTheme } from "@mui/styles";
import { CancelSubscription } from "app/store/Billing";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import moment from "moment";
import { DownArrowwhite, UpArrowWhite } from "public/assets/icons/subscription";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import DropdownMenu from "../../Dropdown";
import InputField from "../../InputField";
import SelectField from "../../selectField";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  "& .radioIcon": {
    color: "#9DA0A6",
    border: "2px solid currentColor",
    height: "16px",
    aspectRatio: 1,
    borderRadius: "50%",
    position: "relative",
  },
  "&.Mui-selected": {
    backgroundColor: "transparent",
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
const validationSchema = yup.object({
  state: yup.string().required("State is required."),

  date: yup.string().when("state", {
    is: (value) => {
      return value == 3;
    },
    then: (Schema) => Schema.required("Date is required."),
    otherwise: (Schema) => Schema.notRequired().nullable(),
  }),
});

const CancelButtonPage = ({ client_id, Sub_id, fetchDepartmentList }) => {
  const theme: Theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState(false);

  const [anchorEl1, setAnchorEl1] = useState<HTMLElement | null>(null);
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const formik = useFormik({
    initialValues: {
      state: "",
      date: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleDelete(values);
    },
  });

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl1(null);
    formik.resetForm();
    setDisable(false);
  };
  const handleDelete = async (values) => {
    setDisable(true);
    const payload = {
      client_id: client_id,
      subscription_id: Number(Sub_id),
      cancel_type: values.state - 1,
      cancel_date:
        values.state == 3 ? moment(values?.date).format("DD/MMMM/yyyy") : "",
    };
    try {
      const res = await dispatch(CancelSubscription(payload));
      toast.success(res?.payload?.data?.message);
      handleClose();
      fetchDepartmentList();
    } catch (error) {
      console.error("Error fetching data:", error);
      handleClose();
    }
  };

  const Data = [
    { value: 1, name: "Cancel Immediately" },
    { value: 2, name: "Cancel at end of billing cycle" },
    { value: 3, name: "Cancel at custom date" },
  ];

  return (
    <div>
      <DropdownMenu
        marginTop={"mt-20"}
        button={
          <div
            className="relative flex items-center"
            onClick={handleButtonClick}
          >
            <Button
              variant="contained"
              color="secondary"
              className="h-[40px] sm:text-[16px] flex gap-8 leading-none"
              aria-label="Manage Sections"
              size="large"
              endIcon={
                anchorEl ? (
                  <UpArrowWhite />
                ) : (
                  <DownArrowwhite className="cursor-pointer" />
                )
              }
            >
              Cancel
            </Button>
          </div>
        }
        anchorEl={anchorEl}
        handleClose={handleClose}
      >
        <div className="sm:min-w-[400px] p-20">
          <>
            <p className="text-title font-600 text-[1.6rem]">
              Cancel Subscription!
            </p>

            <div className="relative w-full mt-10 mb-3 sm:mb-0 flex">
              <SelectField
                formik={formik}
                name="state"
                label=""
                placeholder="Select Cancel Options"
                sx={{
                  "& .radioIcon": { display: "none" },

                  "& .MuiInputBase-root .MuiSelect-select": {
                    lineHeight: 1.4,
                  },
                }}
              >
                {Data?.length > 0 ? (
                  Data?.map((item) => (
                    <StyledMenuItem key={item.value} value={item.value}>
                      {item.name}
                    </StyledMenuItem>
                  ))
                ) : (
                  <StyledMenuItem>No Data</StyledMenuItem>
                )}
              </SelectField>
            </div>
            {formik.values?.state == "3" && (
              <>
                <div>
                  <p className="text-title font-600 text-[1.6rem] pb-20">
                    Custom Date
                  </p>
                  <InputField
                    type="date"
                    name="date"
                    placeholder="22/5/2024"
                    formik={formik}
                    tommorow={true}
                  />
                </div>
              </>
            )}
          </>
          {/* )} */}

          <div className="flex pt-10">
            <Button
              variant="contained"
              color="secondary"
              className="w-[156px] h-[48px] text-[16px] font-400"
              onClick={(e) => {
                e.stopPropagation();
                // onDelete();
                formik.handleSubmit();
              }}
              disabled={disable || !formik.values?.state}
            >
              {/* Yes */}
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
                "Save"
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="w-[156px] h-[48px]  text-[16px] font-400 ml-10"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              // disabled={disable || !formik.values?.state}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DropdownMenu>
    </div>
  );
};

export default CancelButtonPage;
