"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

type AddToFavPropsTypes = {
    data: string;
}

const AddToFav: React.FC<AddToFavPropsTypes> = ({ data }) => {
    const [auth_cookie, setauth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));

    //User Favorite Products
    const favAdder = () => {
        const productData = {
            method: "push",
            newFavProduct: data,
        };
        const backendUrl = `https://file-server.liara.run/api/favorite-product`;
        axios.post(backendUrl, productData, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
                Cookies.set('auth_cookie', d.data.auth, { expires: 60 });
                const message = d.data.msg ? d.data.msg : "با موفقیت به محصولات مورد علاقه افزوده شد"
                toast.success(message, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
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
            <button onClick={favAdder} className=" flex justify-center items-center text-center rounded-md p-2 w-full bg-blue-500 transition-all duration-300 hover:bg-blue-600 text-white">افزودن به علاقه مندی ها</button>
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

export default AddToFav;