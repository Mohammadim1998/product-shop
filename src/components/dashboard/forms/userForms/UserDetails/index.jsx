"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Cookies from "js-cookie";

const UserDetails = ({ goalId }) => {
    const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
    const viewedRef = useRef();
    const emailRef = useRef();
    const usernameRef = useRef();
    const displaynameRef = useRef();
    const userIsAciveRef = useRef();
    const emailSendRef = useRef();
    const activateCodeRef = useRef();
    const activateCodeSendingNumberRef = useRef();

    const formKeyNotSuber = (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    };

    //PRICE BEAUTIFUL
    function priceChanger(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // RELATED
    const [posts, setPosts] = useState([-1]);
    useEffect(() => {
        const postsUrl = "https://file-server.liara.run/api/posts-rel";
        axios
            .get(postsUrl,{ headers: { auth_cookie: auth_cookie }})
            .then((d) => {
                setPosts(d.data);
            })
            .catch((e) => console.log("error in loading posts"));
    }, []);

    //Loading default values
    const [fullData, setFullData] = useState("");
    useEffect(() => {
        axios.get(`https://file-server.liara.run/api/get-user/${goalId}`,{ headers: { auth_cookie: auth_cookie }})
            .then((d) => {
                setFullData(d.data);
            })
            .catch(e => console.log("error"))
    }, [goalId]);

    const updater = (e) => {
        e.preventDefault();
        const formData = {
            updatedAt: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            email: emailRef.current.value,
            username: usernameRef.current.value,
            viewed: viewedRef.current.value,
            displayname: displaynameRef.current.value,
            userIsAcive: userIsAciveRef.current.value,
            activateCode: activateCodeRef.current.value,
            emailSend: emailSendRef.current.value,
            activateCodeSendingNumber: activateCodeSendingNumberRef.current.value,
        }

        const url = `https://file-server.liara.run/api/update-user/${goalId}`;
        axios.post(url, formData,{ headers: { auth_cookie: auth_cookie }})
            .then((d) => {
                toast.success("کاربر با موفقیت بروزرسانی شد.", {
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
    };

    const remover = () => {
        axios.post(`https://file-server.liara.run/api/delete-user/${goalId}`,{ headers: { auth_cookie: auth_cookie }})
            .then(d => {
                toast.success("کاربر با موفقیت حذف شد.", {
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
    };

    const paymentUnchecker = (goalId) => {
        axios.get(`https://file-server.liara.run/api/uncheck-payment/${goalId}`,{ headers: { auth_cookie: auth_cookie }})
            .then(d => {
                toast.success("به بخش سفارش های افزوده شد", {
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
    };

    const commentUnchecker = (goalId) => {
        axios.get(`https://file-server.liara.run/api/uncheck-comment/${goalId}`,{ headers: { auth_cookie: auth_cookie }})
            .then(d => {
                toast.success("به بخش سفارش های افزوده شد", {
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
    };

    return (
        <div className="flex flex-col gap-8">
            {fullData[0] == -1
                ? (<div className="flex justify-center items-center p-12">
                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                </div>)
                : (
                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-orange-500">جزئیات کاربر</h2>
                            <div className="flex justify-end items-center gap-4">
                                <button onClick={() => remover()} className="bg-rose-600 text-white px-4 py-1 rounded-sm text-xs">حذف</button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                                {fullData._id ? fullData._id : ""}
                            </div>

                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                                <div>تاریخ ایجاد</div><div>{fullData.createdAt ? fullData.createdAt : ""}</div>
                            </div>

                            <div className="bg-zinc-100 rounded px-3 py-1 text-sm flex justify-between items-center gap-2">
                                <div>به روز رسانی</div><div>{fullData.updatedAt ? fullData.updatedAt : ""}</div>
                            </div>
                        </div>

                        <form onKeyDown={formKeyNotSuber} onSubmit={updater} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6">
                                <div>دیده شد</div>
                                <select ref={viewedRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400">
                                    {fullData.viewed && fullData.viewed == true ? (
                                        <>
                                            <option value={true}>دیده شده</option>
                                            <option value={false}>دیده نشده</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value={false}>دیده نشده</option>
                                            <option value={true}>دیده شده</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>ایمیل کاربر</div>
                                <input defaultValue={fullData.email ? fullData.email : ""} required={true} ref={emailRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>نام کاربری</div>
                                <input defaultValue={fullData.username ? fullData.username : ""} required={true} ref={usernameRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>نام نمایشی</div>
                                <input defaultValue={fullData.displayname ? fullData.displayname : ""} required={true} ref={displaynameRef} type="text" className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>کد فعال سازی</div>
                                <input defaultValue={fullData.activateCode ? fullData.activateCode : ""} required={true} ref={activateCodeRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>تعداد باقی مانده ارسال کد فعال سازی به کاربر</div>
                                <input defaultValue={fullData.activateCodeSendingNumber ? fullData.activateCodeSendingNumber : 0} required={true} ref={activateCodeSendingNumberRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div>محصولات مورد علاقه</div>
                                {fullData.favoriteProducts?.length < 1
                                    ? (
                                        <div>بدون محصول مورد علاقه</div>
                                    ) : (
                                        <div className="flex justify-start items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData.favoriteProducts?.map((da, i) => (
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

                            <div className="flex flex-col gap-2">
                                <div>سبد خرید</div>
                                {fullData.cart?.length < 1
                                    ? (
                                        <div>بدون محصول مورد علاقه</div>
                                    ) : (
                                        <div className="flex justify-start items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData.cart?.map((da, i) => (
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

                            <div className="flex flex-col gap-2">
                                <div>محصولات خریداری شده</div>
                                {fullData.userProducts?.length < 1
                                    ? (
                                        <div>بدون محصول محصول خریداری شده</div>
                                    ) : (
                                        <div className="flex justify-start items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData.userProducts?.map((da, i) => (
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

                            <div className="flex flex-col gap-2">
                                <div>سفارش ها</div>
                                {fullData.payments?.length < 1
                                    ? (
                                        <div>بدون سفارش</div>
                                    ) : (
                                        <div className="flex justify-start items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData.payments?.map((da, i) => (
                                                    <div key={i} className="bg-zinc-200 rounded-md p-4 flex flex-col gap-4">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>مبلغ: </div>
                                                            <div>{priceChanger(da.amount / 10)} تومان</div>
                                                        </div>

                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>وضعیت</div>
                                                            <div>{da.payed == true ? "پرداخت شده" : "پرداخت نشده"}</div>
                                                        </div>

                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>تاریخ</div>
                                                            <div>{da.createdAt}</div>
                                                        </div>

                                                        <div onClick={() => paymentUnchecker(da._id)} className="cursor-pointer bg-blue-600 text-white rounded p-1 text-sm">
                                                            نمایش در بخش سفارش های جدید
                                                        </div>

                                                        {/* <div className="flex justify-end"><Link target={"_blank"} href={`/shop/${da.slug}`} className="rounded flex justify-center items-center w-12 h-6 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"></Link></div> */}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div>دیدگاه ها</div>
                                {fullData.comments?.length < 1
                                    ? (
                                        <div>بدون دیدگاه</div>
                                    ) : (
                                        <div className="flex justify-center items-center gap-4 text-xs flex-wrap">
                                            {
                                                fullData.comments?.map((da, i) => (
                                                    <div key={i} className="w-[48%] min-h-[13rem] bg-zinc-200 rounded-md p-4 flex flex-col justify-between gap-4">
                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>مرجع</div>
                                                            <div>{da.typeOfModel == "post" ? "مقاله" : "محصول"}</div>
                                                        </div>

                                                        <div className="flex justify-between items-center gap-2">
                                                            <div>تاریخ</div>
                                                            <div>{da.createdAt}</div>
                                                        </div>

                                                        <div className="flex justify-start items-start bg-zinc-300 p-1 rounded leading-6 gap-2">
                                                            <div className="min-w-12 w-12">متن: </div>
                                                            <div>{da.message}</div>
                                                        </div>

                                                        <div onClick={() => commentUnchecker(da._id)} className="cursor-pointer text-center bg-blue-600 text-white rounded p-1 text-sm">
                                                            نمایش در بخش دیدگاه های جدید
                                                        </div>

                                                        {/* <div className="flex justify-end"><Link target={"_blank"} href={`/shop/${da.slug}`} className="rounded flex justify-center items-center w-12 h-6 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"></Link></div> */}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>کاربر فعال</div>
                                <select ref={userIsAciveRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                                    {fullData.userIsAcive && fullData.userIsAcive == true ? (
                                        <>
                                            <option value="true">فعال</option>
                                            <option value="false">غیرفعال</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="false">غیرفعال</option>
                                            <option value="true">فعال</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div>وضعیت ارسال ایمیل تبلیغاتی</div>
                                <select ref={emailSendRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                                    {fullData.emailSend && fullData.emailSend == true ? (
                                        <>
                                            <option value="true">ارسال شود</option>
                                            <option value="false">ارسال نشود</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="false">ارسال نشود</option>
                                            <option value="true">ارسال شود</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <button type="submit" className="bg-indigo-600 text-white w-full p-2 rounded-md transition-all duration-500 hover:bg-orange-500">ارسال</button>
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
                )}
        </div>
    );
}

export default UserDetails;