import Typography from "@mui/material/Typography";

type FormType = {
  cnfPassword: string;
  password: string;
};

export default function SuccessScreen() {
  // State to track loading

  return (
    <>
      <div className="flex justify-center items-center flex-col min-h-screen gap-60 px-14 sm:px-28 pt-60 pb-60">
        {/* <CircleRightIcon className="hidden sm:block absolute top-0 sm:right-0 z-[-1]" />
        <CircleLeft1Icon className=" hidden sm:block absolute bottom-0 left-0 z-[-1]" />
        <CircleLeft2Icon className="hidden sm:block absolute bottom-[28px] left-0 z-[-1]" /> */}

        <img src="assets/icons/remote-icon.svg" alt="" />

        <div className="bg-[#fff]  w-full sm:w-3/5 h-auto sm:py-[8rem] py-60 px-20 sm:px-20 flex justify-center rounded-lg shadow-md ">
          <div
            className="flex flex-col justify-center  gap-40"
            style={{ alignItems: "center" }}
          >
            <img src="assets/images/paymentsuccess.svg" alt="aa" />
            {/* <SucessSubscription /> */}
            <div>
            <Typography className="text-[24px] text-center font-600 leading-normal">
              Thank You for Purchasing Our Subscription! </Typography>

              <div className="flex justify-center align-middle ">

             
              <div className="text-[16px] font-300 text-[#757982] leading-[20px] pt-10  text-center w-[61%]">
                Your subscription purchase was successful! Please check 
                your email for instructions on accessing the system.{" "}
                {/* <p className="text-[16px] font-300 text-[#757982] leading-4 pt-10"> */}
              </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
