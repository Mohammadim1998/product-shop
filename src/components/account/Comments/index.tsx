"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import Cookies from "js-cookie";
import Link from "next/link";
import { CookiesPropsTypes } from "../Info";
//USING CONTEXT
import { useAppContext } from "../../../../context/appContext";

type CommentSourceType = {
    slug: string;
    title: string;
};

type CommentType = {
    _id: string;
    typeOfModel: "post" | "product";
    src: CommentSourceType;
    message: string;
    published: boolean;
    createdAt: string;
};

const Favorites: React.FC<CookiesPropsTypes> = ({ cookie }) => {
    const [data, setData] = useState<CommentType[] | null>(null);
    const [needRefresh, setNeedRefresh] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);

    //CONTEXT OF CART NUMBER
    const { cartNumber, setCartNumber } = useAppContext();

    useEffect(() => {
        if (cookie && cookie.length > 0) {
            axios.get("https://file-server.liara.run/api/get-part-of-user-data/comments", { headers: { auth_cookie: cookie } })
                .then(d => {
                    setData(d.data);
                    setNeedRefresh(1);
                })
                .catch(e => {
                    toast.error("خطا در لود اطلاعات", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setLoading(false);
                    setNeedRefresh(0);
                })
                .finally(() => {
                    setLoading(false);
                    setNeedRefresh(0);
                })
        }
    }, [cookie, needRefresh]);

    const productRemover = (input: string) => {
        const formData = {
            method: "remove",
            goalFavProductId: input
        }

        axios.post("https://file-server.liara.run/api/favorite-product/", formData,
            { headers: { auth_cookie: cookie } })
            .then((d) => {
                toast.success(d.data.msg, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setNeedRefresh(1)
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
    };

    //User cart Products
    const cartAdder = (input: string) => {
        const productData = {
            method: "push",
            newCartProduct: input,
        };
        const backendUrl = `https://file-server.liara.run/api/cart-managment`;
        axios.post(backendUrl, productData, { headers: { auth_cookie: cookie } })
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
        <div className="relative flex flex-col gap-8 py-20 px-4 md:p-20">
            <>
                <meta charSet="utf-8" />
                <title>دیدگاه های من</title>
                <meta name="description" content="دیدگاه های من" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/favicon2.ico" type="image/x-icon" />
                <link rel="canonical" href="https://localhost:3000/account/comments" />
            </>
            <h3 className="absolute top-1 right-1 text-lg rounded-md p-1 bg-purple-400">دیدگاه های من</h3>

            <div onClick={() => {
                setNeedRefresh(1);
                setData(null);
            }} className="absolute top-1 left-1 cursor-pointer text-white bg-indigo-500 rounded flex text-sm justify-center items-center gap-1 w-24 h-10">
                <FiRefreshCw />به روزرسانی
            </div>
            <div>
                {loading
                    ? (<div className="flex justify-center items-center p-12">
                        <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                    </div>)
                    : (
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-end items-center w-full">
                                <div className="rounded-md flex justify-center items-center bg-orange-600 w-20 h-10 text-white">{data?.length} دیدگاه</div>
                            </div>

                            <div>
                                {data !== null && data?.length < 1
                                    ? <div className="w-full flex justify-center items-center p-8">دیدگاهی موجود نیست...</div>
                                    : (<div className="w-full flex flex-col gap-8">
                                        {data && data.map((da, i) => (
                                            <div key={i} className="w-full flex flex-col gap-4 bg-zinc-200 text-sm rounded-md relative">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="relative w-full flex flex-col gap-8">
                                                        <div className="flex flex-col md:flex-row justify-between items-center p-1 gap-y-1 md:gap-x-4">
                                                            <Link
                                                                href={da.typeOfModel == "post" ? `/blog/${da.src.slug}` : `/shop/${da.src.slug}`}
                                                                target={"_blank"}
                                                                className="w-full rounded-sm px-3 flex justify-start items-center text-sm h-6 bg-green-600 text-white transition-all duration-300 hover:bg-green-600"
                                                            >
                                                                {da.typeOfModel == "post" ? "مقاله" : "محصول"} : {da.src.title}
                                                            </Link>

                                                            <div className="flex justify-end items-center gap-4">
                                                                <div className="cursor-pointer bg-orange-500 text-white rounded-sm text-xs flex justify-center items-center w-28 h-6">
                                                                    {da.createdAt}
                                                                </div>

                                                                <div className="">
                                                                    {da.published == true
                                                                        ? <div className="bg-green-600 text-white w-28 h-6 px-3 py-1 flex justify-center items-center text-base sm:text-sm rounded">
                                                                            منتشر شده
                                                                        </div>
                                                                        : <div className="bg-rose-600 text-white w-28 h-6 px-3 py-1 flex justify-center items-center text-base sm:text-sm rounded">
                                                                            در انتظار انتشار
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-base leading-9 text-black px-4">{da.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>)
                                }
                            </div>
                        </div>
                    )}
            </div>

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

export default Favorites;