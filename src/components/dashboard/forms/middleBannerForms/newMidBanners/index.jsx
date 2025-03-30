"use client";
import axios from "axios";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const newMidBanners = () => {
    const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
    const imageUrlRef = useRef();
    const imageAltRef = useRef();
    const imageLinkRef = useRef();
    const imageSituationRef = useRef();

    const submiter = (e) => {
        e.preventDefault();
        const formData = {
            image: imageUrlRef.current.value,
            imageAlt: imageAltRef.current.value,
            link: imageLinkRef.current.value,
            situation: imageSituationRef.current.value,
            date: new Date().toLocaleDateString('fa-IR', { hour: "2-digit", minute: "2-digit" })
        }

        const url = "https://file-server.liara.run/api/new-middle-banner";
        axios.post(url, formData,{ headers: { auth_cookie: auth_cookie }})
            .then(d => {
                toast.success("بنر با موفقیت ذخیره شد.", {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
            .catch(e => {
                let message = "متاسفانه ناموفق بود";
                if (e.response.data.msg) {
                    message = e.response.data.msg;
                }
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

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-orange-500">بنر جدید</h2>
            <form onSubmit={submiter} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <div>آدرس عکس</div>
                    <input required={true} ref={imageUrlRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>آلت عکس</div>
                    <input required={true} ref={imageAltRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>
                <div className="flex flex-col gap-6">
                    <div>لینک عکس</div>
                    <input required={true} ref={imageLinkRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>
                <div className="flex flex-col gap-6">
                    <div>روشن و خاموش</div>
                    <select ref={imageSituationRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                        <option value="true">روشن</option>
                        <option value="false">خاموش</option>
                    </select>
                </div>

                <button type="submit" className="bg-indigo-600 text-white w-full rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>
            </form>
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

export default newMidBanners;