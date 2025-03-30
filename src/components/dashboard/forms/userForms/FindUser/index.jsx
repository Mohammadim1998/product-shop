"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetails from "../UserDetails";
import Image from "next/image";
import Cookies from "js-cookie";

const FindUser = () => {
    const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
    const emailRef = useRef();
    const [userData, setUserData] = useState(0);

    const submiter = (e) => {
        setUserData(2);
        e.preventDefault();
        const formData = {
            email: emailRef.current.value,
        }

        const url = "https://file-server.liara.run/api/search-user";
        axios.post(url, formData,{ headers: { auth_cookie: auth_cookie }})
            .then((d) => {
                if (d.data.userData == 0) {
                    toast.success("چنین کاربری وجود ندارد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setUserData(1)
                } else {
                    toast.success("اطلاعات کاربر بارگذاری شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setUserData(d.data.userData);
                }

            })
            .catch((e) => {
                let message = "متاسفانه ناموفق بود";
                if (e.response.data.msg) {
                    message = e.response.data.msg;
                }

            })
    };


    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-orange-500">پیدا کردن کاربر با ایمیل</h2>
            <form onKeyDown={formKeyNotSuber} onSubmit={submiter} className="flex flex-col gap-6">

                <div>
                    <div>اطلاعات کاربر:</div>
                    <div>
                        {
                            userData == 0
                                ? <div>ایمیلی وارد نشده است...</div>
                                : (userData == 1)
                                    ? <div>کاربری با این ایمیل ثبت نشده است...</div>
                                    : (userData == 2)
                                        ? <div className="flex justify-center items-center p-12">
                                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                                        </div>
                                        : <UserDetails goalId={userData._id} />
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div>ایمیل کاربر</div>
                    <input required={true} ref={emailRef} type="email" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <button type="submit" className="bg-indigo-600 text-white p-2 w-full rounded-md transition-all duration-500 hover:bg-orange-500">جستجوی کاربر</button>

            </form>
            <ToastContainer
                bodyClassName={() => "font-[shabnam] text-sm"}
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

export default FindUser;