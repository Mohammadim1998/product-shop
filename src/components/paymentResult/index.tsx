"use client";
import axios from "axios";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
//USING CONTEXT
import { useAppContext } from "../../../context/appContext";
import { useRouter } from "next/navigation";

type PaymentResultProps = {
        Status?: string;
        Authority?: string;
    cookie?: string;
}

const PaymentResultcom: React.FC<PaymentResultProps> = ({ Status, Authority, cookie }) => {
    const router = useRouter();
    const { setCartNumber } = useAppContext();
    let testing = 0;

    useEffect(() => {
        if (Status !== "OK") {
            toast.error("پرداخت انجام نشد", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push("/cart");
        } else if (Status == "OK" && testing == 0) {
            testing = 1;
            toast.info("لطفا صبر کنید...", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            const formData = {
                resnumber: Authority,
            };

            axios.post("https://file-server.liara.run/api/new-payment/", formData,
                { headers: { auth_cookie: cookie } })
                .then((d) => {
                    const message = (d.data && d.data.msg) ? d.data.msg : "پرداخت انجام شد"
                    toast.success(message, {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setCartNumber(0);
                    router.push("/account/files")
                })
                .catch((e) => {
                    const message = (e.response && e.response.data && e.response.data.msg) ? e.response.data.msg : "خطا در پرداخت"
                    toast.error(message, {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
        }
    }, [Status, Authority]);

    return (
        <div>
            لطفا صبر کنید...
        </div>
    );
}

export default PaymentResultcom;