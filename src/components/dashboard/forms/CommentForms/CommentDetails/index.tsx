"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

interface Comment {
    _id: string;
    parenId: string;
    email: string;
    displayname: string;
    message: string;
    viewed: boolean;
    published: boolean;
    createdAt: string;
    typeOfProduct: "post" | "product";
    src_id: string;
    src: {
        _id: string;
        slug: string;
        title: string;
    };
    parent?: {
        displayname: string;
        email: string;
        createdAt: string;
        message: string;
    };
}

type CommentsDetailPropsTypes = {
    goalId: string;
}

const CommentDetails: React.FC<CommentsDetailPropsTypes> = ({ goalId }) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const [needToRefresh, setNeedToRefresh] = useState<number>(1);
    const viewedRef = useRef<HTMLSelectElement>(null);
    const publishedRef = useRef<HTMLSelectElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const displaynameRef = useRef<HTMLInputElement>(null);

    const formKeyNotSuber = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    };

    const [fullData, setFullData] = useState<Comment | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`https://file-server.liara.run/api/get-comment/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        setFullData(d.data);
                    })
                    .catch(e => {
                        console.log(e);
                        setLoading(false);
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [goalId, needToRefresh]);

    const updater = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !viewedRef.current ||
            !publishedRef.current ||
            !emailRef.current ||
            !emailRef.current ||
            !messageRef.current ||
            !displaynameRef.current
        ) {
            toast.success("لطفا تمام فیلدها را پر کنید", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return;
        }
        const formData = {
            viewed: viewedRef.current.value === "true",
            published: publishedRef.current.value === "true",
            message: messageRef.current.value,
            email: emailRef.current.value,
            displayname: displaynameRef.current.value,
        };
        // const formData = {
        //     viewed: viewedRef.current.value,
        //     published: publishedRef.current.value,
        //     message: messageRef.resnumber,
        //     email: emailRef.current.value,
        //     displayname: displaynameRef.products,
        // }

        try {
            const url = `https://file-server.liara.run/api/update-comment/${goalId}`;
            axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
                .then((d) => {
                    toast.success("یدگاه با موفقیت بروزرسانی شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
                .catch((e) => {
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
        } catch (error) {
            console.log(error);
        }
    };

    const remover = () => {
        try {
            axios.post(`https://file-server.liara.run/api/delete-comment/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                .then(d => {
                    toast.success("دیدگاه با موفقیت حذف شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
                .catch((e) => {
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
        } catch (error) {
            console.log(error);
        }
    };

    const publisher = () => {
        const sendingData = {
            goalId: fullData?._id,
            parenId: fullData?.parenId,
            email: fullData?.email,
        };
        try {
            axios.post(`https://file-server.liara.run/api/publish-comment`, sendingData, { headers: { auth_cookie: auth_cookie } })
                .then(d => {
                    toast.success("انتشار دیدگاه و ارسال ایمیل با موفقیت انجام شد", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    setFullData(null);
                    setNeedToRefresh(needToRefresh * -1);
                })
                .catch((e) => {
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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h2 className="text-orange-500">جزئیات دیدگاه</h2>
                <div className="flex justify-end items-center gap-4">
                    <button onClick={() => publisher()} className="bg-sky-600 cursor-pointer text-white px-4 py-1 rounded-sm text-xs transition-all duration-500 hover:bg-sky-700">انتشار + ایمیل در صورت پاسخ بودن</button>
                    <button onClick={() => remover()} className="bg-rose-600 cursor-pointer text-white px-4 py-1 rounded-sm text-xs transition-all duration-500 hover:bg-rose-700">حذف</button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <Link target="_blank" href={fullData?.typeOfProduct == "post" ? `/blog/${fullData?.src?.slug}` : `/shop/${fullData?.src?.slug}`} className="bg-green-600 text-white rounded px-3 py-1 text-sm flex justify-between items-center">
                    {fullData?.src?.title}
                </Link>

                <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                    <div>دیدگاهی برای یک</div>
                    <div>{fullData?.typeOfProduct == "post" ? "مقاله" : "محصول"}</div>
                </div>
                <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                    <div>تاریخ ایجاد</div>
                    <div>{fullData?.createdAt ? fullData?.createdAt : ""}</div>
                </div>
            </div>

            <form onKeyDown={formKeyNotSuber} onSubmit={updater} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <div>دیده شد</div>
                    <select ref={viewedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400">
                        {fullData?.viewed && fullData?.viewed == true ? (
                            <>
                                <option value={"true"}>دیده شده</option>
                                <option value={"false"}>دیده نشده</option>
                            </>
                        ) : (
                            <>
                                <option value={"false"}>دیده نشده</option>
                                <option value={"true"}>دیده شده</option>
                            </>
                        )}
                    </select>
                </div>

                <div className="flex flex-col gap-6">
                    <div>منتشر شود</div>
                    <select ref={publishedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400">
                        {fullData?.published && fullData?.published == true ? (
                            <>
                                <option value={"true"}>بله</option>
                                <option value={"false"}>خیر</option>
                            </>
                        ) : (
                            <>
                                <option value={"false"}>خیر</option>
                                <option value={"true"}>بله</option>
                            </>
                        )}
                    </select>
                </div>

                <div className="flex flex-col gap-6">
                    <div>ایمیل کاربر</div>
                    <input defaultValue={fullData?.email ? fullData?.email : ""} required={true} ref={emailRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                <div className="flex flex-col gap-6">
                    <div>نام نمایشی (displayname)</div>
                    <input defaultValue={fullData?.displayname ? fullData?.displayname : ""} required={true} ref={displaynameRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                </div>

                {fullData?.parenId == "nothing"
                    ? <div></div>
                    : (
                        <div className="flex flex-col gap-6">
                            <div>دیدگاه پدر</div>
                            <div className="bg-zinc-100 border-2 border-zinc-300 p-1 rounded-md flex flex-col gap-2">
                                <div className="flex justify-between items-center flex-wrap">
                                    <div className="px-2 py-1 rounded bg-zinc-200">{fullData?.parent?.displayname}</div>
                                    <div className="px-2 py-1 rounded bg-zinc-200">{fullData?.parent?.email}</div>
                                    <div className="px-2 py-1 rounded bg-orange-500 text-white">{fullData?.parent?.createdAt}</div>
                                </div>

                                <p className="text-black leading-9 text-justify p-2">{fullData?.parent?.message}</p>
                            </div>
                        </div>)}


                <div className="flex flex-col gap-2">
                    <div>متن دیدگاه</div>
                    <textarea
                        defaultValue={fullData?.message ? fullData?.message : ""}
                        required={true}
                        ref={messageRef}
                        // rows="5"
                        className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400"
                    />
                </div>

                <button type="submit" className="bg-indigo-600 cursor-pointer text-white w-full py-2 rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>
            </form >
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
        </div >
    );
}

export default CommentDetails;