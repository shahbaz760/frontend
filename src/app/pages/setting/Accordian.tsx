/* eslint-disable */
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Android12Switch } from "src/app/components/ToggleButton";
import styled from "styled-components";
import AccessSelector from "./AccessSelector";

const CustomAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "none", // Prevents rotation
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "none", // Ensures no rotation on expand
  },
});

function Accordian({
  title,
  AccessClient,
  titleLabel,
  titleValue,
  onChange,
  show,
  setFormValues,
  setDetails,
  details,
}) {
  const [openAccordian, setOpenAccordian] = useState(
    titleValue == 1 ? true : false || false
  );
  const [checked, setChecked] = useState<boolean>(
    titleValue == 1 ? true : false || false
  );

  const handleChange = (event) => {
    setChecked(event.target.checked);
    // handleTwoFactor(event.target.checked);
    // setIsOpenAuthModal(true);
  };
  useEffect(() => {
    setOpenAccordian(titleValue == 1);
    setChecked(titleValue == 1);
  }, [titleValue]);
  // AccessClient;
  return (
    <Accordion
      className="bg-[#f6f6f6] py-10 custom-accordion"
      expanded={openAccordian}
      sx={{
        "&.Mui-expanded": {
          margin: "0px 0", // override margin for expanded accordion
        },
      }}
    >
      <CustomAccordionSummary
        expandIcon={
          <Android12Switch
            colored
            content
            checked={checked}
            onChange={(e) => {
              handleChange(e);
              setOpenAccordian(AccessClient?.length > 0 && !openAccordian);
              onChange(titleLabel, e.target.checked);
            }}
          />
        }
        aria-controls="panel1-content"
        id="panel1-header"
        className="text-[#111827] text-[16px] font-600 custom-accordion-header"
      >
        {title}
      </CustomAccordionSummary>
      {AccessClient?.length > 0 && (
        <AccordionDetails
          className={`custom-accordion-detail bg-white w-[98%] rounded-10 mx-auto py-10 ${show ? "border-1 border-red" : ""}`}
        >
          {AccessClient?.map((setting, index) => {
            if (setting?.isSubItem) {
              return (
                <div className="sub-item-permission">
                  <Accordian
                    title={setting.label}
                    AccessClient={setting.list}
                    titleLabel={setting.label1}
                    titleValue={setting.value}
                    show={setting.isShow}
                    details={details}
                    setDetails={setDetails}
                    setFormValues={setFormValues}
                    onChange={(accessType, value) => {
                      // Check if the value is boolean, and convert it to 0 or 1
                      const processedValue =
                        typeof value === "boolean" ? (value ? 1 : 0) : value;

                      if (setting?.list && setting?.list?.length > 0) {
                        setFormValues((prev) => {
                          const newFormValues = {
                            ...prev,
                            [setting.label1 == accessType
                              ? setting.label2
                              : setting.label1]:
                              setting.label1 == accessType
                                ? processedValue
                                : {
                                    ...prev[setting.label1],
                                    [accessType]: processedValue, // Update nested access type with processedValue
                                  },
                          };

                          // Initialize check1 and check2
                          let check1 = false;
                          let check2 = false;

                          // Check admin_access based on updated formValues
                          if (newFormValues.admin_access) {
                            check1 = Object.values(
                              newFormValues.admin_access
                            ).some((val) => val === 1);
                          }

                          // Check report_access based on updated formValues
                          if (newFormValues.report_access) {
                            check2 = Object.values(
                              newFormValues.report_access
                            ).some((val) => val === 1);
                          }

                          // Update details based on check1 and check2
                          const newDetails = [...details];

                          if (check1) {
                            const adminAccessIndex = newDetails.findIndex(
                              (data) => data.label1 === "admin_access"
                            );
                            newDetails[adminAccessIndex] = {
                              ...newDetails[adminAccessIndex],
                              isShow: false, // Or whatever logic you want for isShow
                            };
                          }

                          if (check2) {
                            const reportAccessIndex = newDetails.findIndex(
                              (data) => data.label1 === "report_access"
                            );
                            newDetails[reportAccessIndex] = {
                              ...newDetails[reportAccessIndex],
                              isShow: false, // Or whatever logic you want for isShow
                            };
                          }
                          if (accessType == "support_access") {
                            // Find the support_access_allow in formValues to check its value
                            const supportAccessAllow =
                              newFormValues.is_supports;

                            // If support_access_allow is not 1 (true), reset support_department to 0
                            if (supportAccessAllow !== 1) {
                              newFormValues.support_access.support_department = 0;
                            } else {
                              // Set support_department to the processed value if support_access_allow is true
                              newFormValues.support_access.support_department =
                                processedValue;
                            }
                          }

                          // Set the new details state only if there were changes
                          if (check1 || check2) {
                            setDetails(newDetails);
                          }

                          return newFormValues; // Return the updated formValues
                        });
                      } else {
                        setFormValues((prev) => ({
                          ...prev,
                          [setting.label1]: processedValue, // Update top-level value with processedValue
                        }));
                      }
                    }}
                  />
                </div>
              );
            }
            return (
              <AccessSelector
                key={index}
                label={setting.label}
                options={setting.options} // Pass the dynamic options
                initialValue={setting.value}
                onChange={(value) => onChange(setting.label1, value)}
              />
            );
          })}
        </AccordionDetails>
      )}
    </Accordion>
  );
}

export default Accordian;
