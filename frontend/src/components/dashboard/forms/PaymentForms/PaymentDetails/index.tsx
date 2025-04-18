"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Image from "next/image";

type PaymentDetailsPropsTypes = {
    goalId: string;
}


interface Product {
    _id: string;
    title: string;
    slug: string;
}

interface PaymentData {
    _id: string;
    email: string;
    username: string;
    viewed: boolean;
    amount: number;
    payed: boolean;
    resnumber: string;
    products: Product[];
    createdAt: string;
    updatedAt: string;
}


const PaymentDetails: React.FC<PaymentDetailsPropsTypes> = ({ goalId }) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const viewedRef = useRef<HTMLSelectElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const payedRef = useRef<HTMLSelectElement>(null);

    const formKeyNotSuber = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    };

    //Loading default values
    const [fullData, setFullData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`https://file-server.liara.run/api/get-payment/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        setFullData(d.data);
                    })
                    .catch(e => {
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
    }, [goalId]);

    const updater = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !emailRef.current ||
            !usernameRef.current ||
            !viewedRef.current ||
            !amountRef.current ||
            !payedRef.current
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
            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            email: emailRef.current.value,
            username: usernameRef.current.value,
            viewed: viewedRef.current.value,
            amount: Number(amountRef.current.value) * 10,
            payed: payedRef.current.value,
            resnumber: fullData?.resnumber,
            products: fullData?.products,
        }
        try {
            const url = `https://file-server.liara.run/api/update-payment/${goalId}`;
            axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
                .then((d) => {
                    toast.success("سفارش با موفقیت بروزرسانی شد.", {
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
            axios.post(`https://file-server.liara.run/api/delete-payment/${goalId}`, { headers: { auth_cookie: auth_cookie } })
                .then(d => {
                    toast.success("سفارش با موفقیت حذف شد.", {
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

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h2 className="text-orange-500">جزئیات سفارش</h2>
                <div className="flex justify-end items-center gap-4">
                    <button onClick={() => remover()} className="bg-rose-600 cursor-pointer text-white px-4 py-1 rounded-sm text-xs">حذف</button>
                </div>
            </div>
            {loading
                ? (
                    <div className="flex justify-center items-center p-12">
                        <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            {/* <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                    <div>نام کاربری</div>
                    {fullData.username ? fullData.username : ""}
                </div>

                <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                    <div>ایمیل</div>
                    <div>{fullData.email ? fullData.email : ""}</div>
                </div> */}

                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                                <div>کد پرداختی</div>
                                <div>{fullData?.resnumber ? fullData?.resnumber : ""}</div>
                            </div>

                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                                <div>به روز رسانی</div>
                                <div>{fullData?.updatedAt ? fullData?.updatedAt : ""}</div>
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
                                <div>ایمیل کاربر</div>
                                <input defaultValue={fullData?.email ? fullData?.email : ""} required={true} ref={emailRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>نام کاربری</div>
                                <input defaultValue={fullData?.username ? fullData?.username : ""} required={true} ref={usernameRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>مقدار تومان</div>
                                <input defaultValue={fullData?.amount ? fullData?.amount / 10 : ""} required={true} ref={amountRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div>محصولات</div>
                                {fullData && fullData.products?.length < 1
                                    ? (
                                        <div>بدون محصول</div>
                                    ) : (
                                        <div className="flex justify-start items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData && fullData?.products?.map((da, i) => (
                                                    <div key={i} className="bg-zinc-200 rounded-md p-4 flex flex-col gap-4">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>آیدی: </div>
                                                            <div>{da._id}</div>
                                                        </div>

                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>عنوان: </div>
                                                            <div>{da.title}</div>
                                                        </div>
                                                        <div className="flex justify-end"><Link target={"_blank"} href={`/shop/${da.slug}`} className="rounded flex justify-center items-center w-12 h-6 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"></Link></div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>پرداخت شده یا نه</div>
                                <select ref={payedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400">
                                    {fullData?.payed && fullData?.payed == true ? (
                                        <>
                                            <option value="true">پرداخت شده</option>
                                            <option value="false">پرداخت نشده</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="false">پرداخت نشده</option>
                                            <option value="true">پرداخت شده</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <button type="submit" className="bg-indigo-600 cursor-pointer text-white w-full py-2 rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>
                        </form>
                    </>
                )}
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

export default PaymentDetails;