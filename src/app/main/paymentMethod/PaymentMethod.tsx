import ListLoading from "@fuse/core/ListLoading";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { GetPaymentLink } from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import jwtDecode from "jwt-decode";
import { CircleLeft1Icon, CircleLeft2Icon, CircleRightIcon } from "public/assets/icons/welcome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function PaymentMethod() {
  // State to track loading
  const { token } = useParams();
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true)

  const Link = async () => {
    setLoading(true)
    if (token) {
      const tokenData: any = jwtDecode(token);
      const { payload } = await dispatch(GetPaymentLink({ id: tokenData.subscription_id }))
      
      setData(payload.data.data)
      setLoading(false)

    
    }
  }
  useEffect(() => {
    Link()
  }, [])
   

  return (
    <>
      <div className="flex justify-center items-center flex-col min-h-screen gap-60 px-14 sm:px-28 pt-20 pb-60">
        <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
        <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
        <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" />

        <img src="assets/icons/remote-icon.svg" alt="" />

        <div className="bg-[#fff]  w-full sm:w-3/5 h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
          <div
            className="flex flex-col justify-center  gap-20"
            style={{ alignItems: "center" }}
          >
            <img src="assets/icons/paymentmethod.svg" alt="paymentmethod" />
            {loading ? <ListLoading /> :
              data?.payment_status != "pending" ?
              <Typography className="text-[24px] text-center font-600 leading-normal">
                  Payment has alreaxcdy been paid!

                </Typography> :
              <>
                <Typography className="text-[24px] text-center font-600 leading-normal">
                  Select the Payment Option
                  <p className="text-[16px] font-300 text-[#757982] leading-6 pt-20">
                      Choose your preferred payment option to complete<br></br> the transaction seamlessly.

                  </p>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  className="h-[48px] text-[16px]  md:w-[383px]  w-[260px]  flex gap-8 whitespace-nowrap"
                  aria-label="Add User"
                  size="large"
                    onClick={() => window.location.href = data.card_payment_link}
                >

                  Pay with Credit Card
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className="h-[48px] md:w-[383px]  w-[260px] text-[16px] flex gap-8 whitespace-nowrap"
                  aria-label="Add User"
                  size="large"
                    onClick={() => window.location.href = data.bank_payment_link}
                >

                  Pay with Bank
                </Button>
              </>
            }
          </div>
        </div>
      </div >
    </>
  );
}
