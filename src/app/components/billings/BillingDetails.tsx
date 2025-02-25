import React from 'react'
import TitleBar from '../TitleBar'
import DetailsModal from './DetailsModal'
import PaymentMethods from './paymentMethods'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store/store'

const BillingDetails = () => {
    const cardstatus = useSelector((state: RootState) => state.billing);
    return (
        <>
            <TitleBar title="Subscription Details"></TitleBar>
            <div className="px-[15px] mb-[3rem]">
                <div className="bg-white rounded-lg shadow-sm py-[2rem]">
                    <DetailsModal />

                    <div className="my-24">
                        <PaymentMethods />
                    </div>


                </div>
            </div >
        </>
    )
}

export default BillingDetails