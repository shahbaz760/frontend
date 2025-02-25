import { Button, IconButton, useTheme } from "@mui/material";
import {
  AddressIcon,
  BillingAddressIcon
} from "public/assets/icons/billingIcons";
import { DeleteIcon, EditIcon } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useState } from "react";
import AddAddress from "./AddAddress";

const addressData = [
  {
    address: "Ap #285-7193 Ullamcorper Avenue Amesbury HI 93373 US",
  },
  {
    address: "Ap #285-7193 Ullamcorper Avenue Amesbury HI 93373 US",
  },
];

function BillingAddresses() {
  const theme = useTheme();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  return (
    <div className="shadow-sm bg-white rounded-lg p-24">
      <div className="flex items-center justify-between mb-20">
        <h5 className="text-title text-xl font-600 flex items-center gap-12">
          <BillingAddressIcon className="text-secondary" /> Billing Address
        </h5>
        <Button
          variant="outlined"
          color="secondary"
          className="h-[40px] text-[16px] flex gap-8 whitespace-nowrap"
          aria-label="Add User"
          size="large"
          onClick={() => setIsOpenAddModal(true)}
        >
          <PlusIcon color={theme.palette.secondary.main} className="shrink-0" />
          Add Address
        </Button>
      </div>
      <div className="flex justify-between flex-wrap gap-y-[32px]">
        {addressData.map((card, index) => (
          <div
            className="p-16 pe-20 rounded-[10px] bg-bgGrey basis-full lg:basis-[calc(50%_-_16px)]"
            key={index}
          >
            <div className="flex items-center gap-[1.8rem]">
              <div className="w-[55px] aspect-square rounded-full bg-white flex items-center justify-center shrink-0">
                <AddressIcon />
              </div>
              <div className="flex items-start justify-between gap-[3rem] grow">
                <div>
                  <h4 className="text-title text-xl font-600 mb-8">
                    Address {index + 1}
                  </h4>
                  <p className="text-lg text-title_light">{card.address}</p>
                </div>
                <div className="flex items-center gap-10 pe-20">
                  <IconButton className="shrink-0">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton className="shrink-0">
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddAddress isOpen={isOpenAddModal} setIsOpen={setIsOpenAddModal} />
    </div>
  );
}

export default BillingAddresses;
