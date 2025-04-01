"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../context/appContext";

type AddToCartPropsTypes = {
    data: string;
}

const AddToCart: React.FC<AddToCartPropsTypes> = ({ data }) => {
    const [auth_cookie, setauth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));

    //CONTEXT OF CART NUMBER
    const { cartNumber, setCartNumber } = useAppContext();

    //User cart Products
    const cartAdder = () => {
        const productData = {
            method: "push",
            newCartProduct: data,
        };
        const backendUrl = `https://file-server.liara.run/api/cart-managment`;
        axios.post(backendUrl, productData, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
                console.log(d.data);
                Cookies.set('auth_cookie', d.data.auth, { expires: 60 });
                const message = d.data.msg ? d.data.msg : "با موفقیت به سبد خرید افزوده شد"
                toast.success(message, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                // setBulkEmailSituation(input)
                setCartNumber(cartNumber + 1);
            })
            .catch((err) => {
                const errorMsg = (err.response && err.response.data && err.response.data.msg) ? err.response.data.msg : "خطا"
                toast.error(errorMsg, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }

    return (
        <div>
            <button onClick={cartAdder}
                className=" flex justify-center items-center text-center rounded-md p-3 md:p-2 w-full bg-orange-500 transition-all duration-300 hover:bg-orange-500 text-white">افزودن به سبد خرید</button>
            <ToastContainer
                bodyClassName={() => "font-[shabnam] text-sm flex items-center"}
                position="top-right"
                autoClose={3000}
                theme="colored"
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default AddToCart;