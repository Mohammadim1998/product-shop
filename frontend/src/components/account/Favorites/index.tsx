"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";
//USING CONTEXT
import { useAppContext } from "../../../../context/appContext";
import { CookiesPropsTypes } from "../Info";
import Cookies from "js-cookie";

type FavoriteProductType = {
    _id: string;
    image: string;
    slug: string;
    title: string;
    shortDesc: string;
    typeOfProduct: "gr" | "app" | "book";
    buyNumber: number;
    price: number;
    features: string[];
};

const Favorites: React.FC<CookiesPropsTypes> = ({ cookie }) => {
    const [data, setData] = useState<FavoriteProductType[] | null>(null);
    const [needRefresh, setNeedRefresh] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);

    //CONTEXT OF CART NUMBER
    const { cartNumber, setCartNumber } = useAppContext();

    const spliterForFeatures = (value: string) => {
        return value.split(":");
    }

    useEffect(() => {
        if (cookie && cookie.length > 0) {
            const fetchData = async () => {
                try {
                    await axios.get("https://file-server.liara.run/api/get-part-of-user-data/favorite", { headers: { auth_cookie: cookie } })
                        .then(d => {
                            setData(d.data);
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
                        })
                        .finally(() => {
                            setLoading(false);
                        })
                    setNeedRefresh(0);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
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
        <div className="w-full relative flex flex-col gap-8 py-20 px-6 md:p-20">
            <>
                <meta charSet="utf-8" />
                <title>محصولات مورد علاقه من</title>
                <meta name="description" content="محصولات مورد علاقه من" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/favicon2.ico" type="image/x-icon" />
                <link rel="canonical" href="https://localhost:3000/account/favorite" />
            </>
            <h3 className="absolute top-1 right-1 text-lg rounded-md p-1 bg-purple-400">محصولات مورد علاقه من</h3>

            <div onClick={() => {
                setNeedRefresh(1);
                setData(null);
            }} className="absolute top-1 left-1 cursor-pointer text-white bg-indigo-500 rounded flex text-sm justify-center items-center gap-1 w-24 h-10">
                <FiRefreshCw />به روزرسانی
            </div>
            <div className="w-full">
                {loading
                    ? (<div className="flex justify-center items-center p-12">
                        <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                    </div>)
                    : (
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-end items-center w-full">
                                <div className="rounded-md flex justify-center items-center bg-orange-600 w-20 h-10 text-white">{data?.length} محصول</div>
                            </div>

                            <div className="w-full">
                                <div className="w-full">
                                    {data !== null && data?.length < 1
                                        ? <div className="w-full flex justify-center items-center p-8">محصولی موجود نیست...</div>
                                        : (<div className="w-full flex flex-col gap-8">
                                            {data && data?.map((da, i) => (
                                                <div key={i} className="w-full flex flex-col gap-4 bg-zinc-200 text-sm rounded-md py-8 md:p-4 relative">
                                                    <div className="flex justify-between items-start md:pt-8 gap-4 flex-col lg:flex-row">
                                                        <div className="shrink-0 flex justify-center items-center mx-auto pt-2">
                                                            <Image
                                                                width={270}
                                                                height={150}
                                                                className="rounded-md"
                                                                src={da?.image}
                                                                alt={"محصول مورد علاقه"}
                                                            />
                                                        </div>

                                                        <div className="w-full flex flex-col gap-4">
                                                            <Link
                                                                href={`/shop/${da?.slug}`}
                                                                target={"_blank"}
                                                                className="absolute top-1 left-1 rounded-sm flex justify-center items-center text-xs w-20 h-6 bg-green-600 text-white transition-all duration-300 hover:bg-green-600"
                                                            >
                                                                لینک محصول
                                                            </Link>

                                                            <div className="hidden cursor-pointer absolute top-1 left-24 bg-indigo-500 text-white rounded-sm text-xs md:flex justify-center items-center w-20 h-6">
                                                                {da?.typeOfProduct == "gr" ? (
                                                                    <div>فایل گرافیکی</div>
                                                                ) : da?.typeOfProduct == "app" ? (
                                                                    <div>اپلیکیشن</div>
                                                                ) : (
                                                                    <div>کتاب</div>
                                                                )}
                                                            </div>

                                                            <div onClick={() => cartAdder(da?._id)} className="cursor-pointer absolute top-1 left-24 md:left-47 bg-blue-500 text-white transition-all duration-300 hover:bg-blue-600 rounded-sm text-xs flex justify-center items-center w-24 h-6">
                                                                افزودن به سبد
                                                            </div>

                                                            <div className="px-4 pb-2 md:px-0 md:pb-0">
                                                                <h3 className="mt-10 lg:mt-0">{da?.title}</h3>
                                                                <p className="my-4">{da?.shortDesc}</p>
                                                                <div className="flex justify-start items-center gap-4">
                                                                    <div>{da?.buyNumber} فروش</div>
                                                                    <div>{Number(da?.price).toLocaleString()} تومان</div>
                                                                </div>

                                                                <div className="w-[95%] h-[0.16rem] my-4 mx-auto bg-zinc-400 rounded-md"></div>

                                                                <div className="">{
                                                                    da?.features.length < 1
                                                                        ? (
                                                                            <div className="flex justify-center items-center w-full p-4">بدون ویژگی</div>
                                                                        ) : (
                                                                            da?.features.map((fe, i) => (
                                                                                <div key={i} className="flex justify-start items-center  gap-6">
                                                                                    <div className="w-40 flex justify-start items-center gap-1">
                                                                                        {spliterForFeatures(fe)[0]}
                                                                                    </div>
                                                                                    <div>
                                                                                        {spliterForFeatures(fe)[1]}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        )}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div onClick={() => productRemover(da._id)} className="absolute bottom-2 left-2 w-16 h-6 cursor-pointer flex justify-center items-center gap-2 rounded bg-rose-600 text-white hover:bg-rose-700 transition-all duration-300">حذف <RiDeleteBin6Line /></div>
                                                </div>
                                            ))}
                                        </div>)
                                    }
                                </div>
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