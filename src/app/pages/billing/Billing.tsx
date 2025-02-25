import { RefreshToken } from "app/store/Auth";
import { useEffect } from "react";
import TitleBar from "src/app/components/TitleBar";
import BillingHistory from "src/app/components/billings/billingHistory";
import BillingSubscriptionHistory from "src/app/components/billings/billingSubscriptionHistory";
import PaymentMethods from "src/app/components/billings/paymentMethods";
import { getClientId, getToken } from "src/utils";

export default function Billing() {
  const clientId = getClientId();
  useEffect(() => {
    if (clientId) {
      const localStorageKeys = Object.keys(localStorage);
      const clientIdInStorage = localStorageKeys.some((key) =>
        key.includes(clientId)
      );

      if (!clientIdInStorage) {
        window.close();
      }
    }
  }, [clientId]);
  return (
    <div>
      <TitleBar title="Billing" />
      <div className="px-[15px] mb-[3rem]">
        {/* ----------------------------- Payment Methods ------------------------ */}
        <div className="mb-24 mt-1">
          <BillingSubscriptionHistory />
        </div>

        {/* <div className="my-24">
          <PaymentMethods />
        </div> */}

        <div className="my-24">
          <BillingHistory />
        </div>
      </div>
    </div>
  );
}
