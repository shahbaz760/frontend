import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { GetCardList, deleteCard } from "app/store/Billing";
import { RootState, useAppDispatch } from "app/store/store";
import { PaymentCardIcon } from "public/assets/icons/billingIcons";
import { DeleteIcon, EditIcon, NoDataFound } from "public/assets/icons/common";
import { PlusIcon } from "public/assets/icons/dashboardIcons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ActionModal from "../ActionModal";
import AddCard from "./AddCard";
import EditCard from "./EditCard";
import { convertToSentenceCase } from "src/utils";
import AddBank from "./AddBank";
import { useParams } from "react-router";
import ListLoading from "@fuse/core/ListLoading";

function PaymentMethods() {
  const theme = useTheme();
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [id, setId] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const dispatch = useAppDispatch();
  const { subscription_id } = useParams()
  const cardstatus = useSelector((state: RootState) => state.billing);
  const { planList } = useSelector((state: RootState) => state.billing);
  const allHaveBillingFrequencyOne = planList?.every(item => item.billing_frequency == 1);
  const fetchDepartmentList = async () => {
    try {
      const res = await dispatch(GetCardList({ id: subscription_id }));
      // toast.success(res?.payload?.data?.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDepartmentList();
  }, []);



  const onDelete = async () => {
    setDisable(true);
    setId(null);
    try {
      const payload = {
        password_manager_id: deleteId,
        subscription_id:subscription_id
      };
      //@ts-ignore
      const res = await dispatch(deleteCard(payload));
      if (res?.payload?.data?.status) {
        fetchDepartmentList(); // Refresh the department list
        setIsDeleteOpen(false); // Close the delete modal
        toast.success(res?.payload?.data?.message); // Show success toast
        setDeleteId(null);
      } else {
        toast.error(res?.payload?.data?.message);
        setIsDeleteOpen(false);
      }
      setTimeout(() => {
        setDisable(false);
      }, 500);
    } catch (error) {
      setDisable(false);
      console.error("Error fetching data:", error);
    }
  };

  // getCardDetail()

  return (
    <>
      <div className="shadow-sm bg-white rounded-lg p-24">
        <h5 className="text-title text-xl font-600 flex items-center gap-12 ">
          <PaymentCardIcon className="text-secondary" /> Payment Methods
        </h5>
        {cardstatus?.cardstatus == "loading" &&
          <ListLoading />
        }
        {cardstatus?.cardList?.cards?.length > 0 && cardstatus.cardstatus != "loading" &&
          <>
            <div className="flex items-center justify-between my-20 flex-wrap gap-20 sm:gap-0 ">
              <h5 className="text-title text-[16px] font-500 flex items-center gap-12 ">
                Card Details
              </h5>
              {!allHaveBillingFrequencyOne &&
                <Button
                  variant="outlined"
                  color="secondary"
                  className="h-[40px] text-[16px] flex gap-8 whitespace-nowrap"
                  aria-label="Add User"
                  size="large"
                  onClick={() => setIsOpenAddModal(true)}
                >
                  <PlusIcon color={theme.palette.secondary.main} className="shrink-0" />
                  Add Card
                </Button>
              }
            </div>
            <div className="flex justify-start flex-wrap gap-y-[32px] gap-x-12 max-h-[208px] overflow-auto">
              {cardstatus?.cardList?.cards?.length === 0 &&
                cardstatus?.cardstatus !== "loading" ? (
                <div
                  className="flex flex-col justify-center w-full align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
                  style={{ alignItems: "center" }}
                >
                  <NoDataFound />
                  <Typography className="text-[24px] text-center font-600 leading-normal">
                    No data found!
                  </Typography>
                </div>
              ) : cardstatus?.cardstatus === "loading" ? (
                <ListLoading />
              ) : (
                cardstatus?.cardList?.cards?.length > 0 &&
                cardstatus?.cardList?.cards?.map((card, index) => {
                  return (
                    <div
                      className="p-16 pe-20 rounded-[10px] bg-bgGrey basis-full lg:basis-[calc(33%_-_16px)]"
                      key={index}
                    >
                      <div className="flex items-center gap-[1.2rem]">
                        <div className="w-[59px] h-[46px] rounded-8 bg-white flex items-center justify-center shrink-0">
                          {card.brand == "visa" ? (
                            <img
                              src="/assets/images/pages/billing/visa.svg"
                              className="max-w-[46px]"
                              alt="visa"
                            />
                          ) : card.brand == "discover" ? (
                            <img
                              src="/assets/images/pages/billing/Discover.png"
                              className="max-w-[46px]"
                              alt="discover"
                            />
                          ) : card.brand == "unionpay" ? (
                            <img
                              src="/assets/images/pages/billing/unionpay.svg"
                              className="max-w-[46px]"
                              alt="unionpay"
                            />
                          ) : card.brand == "amex" ? (
                            <img
                              src="/assets/images/pages/billing/american.svg"
                              className="max-w-[46px]"
                              alt="amex"
                            />
                          ) : card.brand == "mastercard" ? (
                            <img
                              src="/assets/images/pages/billing/mastercard.svg"
                              className="max-w-[46px]"
                              alt="master"
                            />
                          ) : card.brand == "diners" ? (
                            <img
                              src="/assets/images/pages/billing/Dinners.svg"
                              className="max-w-[46px]"
                              alt="diners"
                            />
                          ) : card.brand == "jcb" ? (
                            <img
                              src="/assets/images/pages/billing/jcb.svg"
                              className="max-w-[46px]"
                              alt="jcb"
                            />
                          ) : (
                            <img
                              src="/assets/images/pages/billing/visa.svg"
                              className="max-w-[46px]"
                              alt="master"
                            />
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-5 grow">
                          <div>
                            <h4 className="text-title text-[14px] font-700 mb-8 whitespace-nowrap">
                              **** **** **** {card?.last4}
                            </h4>
                            <div className="flex gap-10">
                              <Typography>
                                {convertToSentenceCase(card.brand)}
                              </Typography>
                              <p className="text-[14px] text-title_light">{`${card?.exp_month.toString().padStart(2, "0")}/${card?.exp_year.toString().slice(-2)}`}</p>
                              {card?.is_default == 1 && (
                                <span
                                  className="inline-flex items-center justify-center rounded-full w-[69px] text-[1.4rem] sm:min-h-[22px] min-h-[22px] font-500
                        text-[#4F46E5] bg-[#EDEDFC]"
                                >
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          {!allHaveBillingFrequencyOne && <div className="flex items-center gap-5 ">
                            <IconButton
                              className="shrink-0"
                              onClick={() => {
                                setIsDeleteOpen(true);
                                setDeleteId(card?.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>

                            <IconButton
                              className="shrink-0"
                              onClick={() => {
                                setIsEditOpen(true);
                                setId(card?.id);
                              }}
                            >
                              <EditIcon />
                            </IconButton>

                          </div>
                          }
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        }
        {isOpenAddModal &&
          <AddCard
            isOpen={isOpenAddModal}
            setIsOpen={setIsOpenAddModal}
            fetchDepartmentList={fetchDepartmentList}
          />
        }
        {isEditOpen && (
          <EditCard
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            id={id}
            fetchDepartmentList={fetchDepartmentList}
          />
        )}

        {isDeleteOpen && (
          <ActionModal
            modalTitle="Delete Card!"
            modalSubTitle="Are you sure you want to delete this card?"
            open={isDeleteOpen}
            handleToggle={() => setIsDeleteOpen((prev) => !prev)}
            type="delete"
            onDelete={onDelete}
            disabled={disable}
          />
        )}
      </div>
      {cardstatus?.cardList?.banks?.length > 0 && cardstatus.cardstatus != "loading" &&
        <AddBank />
      }
      {(cardstatus?.cardList?.banks?.length == 0 && cardstatus?.cardList?.cards?.length == 0 && cardstatus.cardstatus != "loading") &&
        <div
          className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
          style={{ alignItems: "center" }}
        >
          <NoDataFound />
          <Typography className="text-[24px] text-center font-600 leading-normal">
            No data found!
          </Typography>
        </div>
      }
    </>
  );
}

export default PaymentMethods;
