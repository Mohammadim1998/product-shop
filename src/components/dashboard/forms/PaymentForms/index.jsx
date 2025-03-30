"use client";
import { useEffect, useState } from "react";
import AllPayments from "./AllPayments";
import PaymentDetails from "./PaymentDetails";
import AllNewPayments from "./AllPayments/allNewPayments";

const PaymentsMain = () => {
    const [midBanDetCtrl, setMidBanDetCtrl] = useState("");
    const [RandomNumForBannerClick, setRandomNumForBannerClick] = useState("");
    const [det, setDet] = useState(<AllPayments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />);

    useEffect(() => {
        if (midBanDetCtrl != "") {
            setDet(<PaymentDetails goalId={midBanDetCtrl} />)
        }
        console.log("midBanDetCtrl ==>>>",midBanDetCtrl);
        
    }, [RandomNumForBannerClick]);

    return (
        <div className="flex flex-col gap-8">
            <section className="flex justify-between items-center gap-2">
                <h1 className="text-blue-500 text-lg">سفارش ها</h1>
                <div className="flex justify-end items-center gap-2">
                    <button onClick={() => setDet(<AllPayments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />)}
                        className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500 hover:bg-orange-500">
                        همه
                    </button>
                    <button onClick={() => setDet(<AllNewPayments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />)}
                        className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500 hover:bg-orange-500">
                        جدید
                    </button>
                </div>
            </section>

            <section className="">{det}</section>
        </div>
    );
}

export default PaymentsMain;