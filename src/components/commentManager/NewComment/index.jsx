"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRef, useEffect, useState } from "react";

const NewComment = ({ commentProps, text, itemParentId }) => {
    const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
    const router = useRouter();
    const messageRef = useRef();

    const formKeyNotSuber = (event) => {
        if (event.key == "enter") {
            event.preventDefault();
        }
    }

    let theParentId = "nothing";
    useEffect(() => {
        if (itemParentId != undefined) {
            theParentId = itemParentId;
        }
    },[]);

    const formSubmiter = (e) => {
        e.preventDefault();
        if (auth_cookie == undefined || auth_cookie.length < 0) {
            Cookies.set("auth_cookie", "", { expires: 0 });
            router.push("/login");
        } else {
            const formData = {
                message: messageRef.current.value,
                src_id: commentProps.src_id,
                parenId: theParentId,
                typeOfModel: commentProps.typeOfModel,
            };
            const backendUrl = "https://file-server.liara.run/api/new-comment";
            axios.post(backendUrl, formData, {
                headers: { auth_cookie: auth_cookie }
            })
                .then((d) => {
                    console.log(d.data);
                    const message = d.data.msg ? d.data.msg : "دیدگاه شما پس از بررسی منتشر خواهد شد"
                    toast.success(message, {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    messageRef.current.value = "";
                })
                .catch((err) => {
                    const errorMsg = (err.response && err.response.data && err.response.data.msg) ? err.response.data.msg : "خطا در ثبت دیدگاه"
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
    }

    return (
        <div>
            <form onKeyDown={formKeyNotSuber} onSubmit={formSubmiter} className="flex flex-col gap-6 bg-zinc-100 p-2 rounded-md">
                <textarea
                    ref={messageRef}
                    rows={5}
                    placeholder="دیدگاهتان را اینجا بنویسید..."
                    className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                />

                <button type="submit" className="bg-blue-500 text-white w-full rounded-md p-2 transition-all duration-500 hover:bg-blue-600">
                    {text}
                </button>
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

export default NewComment;