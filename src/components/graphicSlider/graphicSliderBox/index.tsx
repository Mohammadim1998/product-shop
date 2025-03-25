"use client"
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

//USING CONTEXT
import { useAppContext } from "../../../../context/appContext";
import { ProductsPropsTypes } from "@/app/page";

type GraphicSliderPropsTypes = {
    itemData: ProductsPropsTypes
}

const GraphicSliderBox: React.FC<GraphicSliderPropsTypes> = ({ itemData }) => {
    const [auth_cookie, setauth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));

    //CONTEXT OF CART NUMBER
    const { cartNumber, setCartNumber } = useAppContext();

    const spliterForFeatures = (value:string) => {
        return value.split(":");
    }

    const favAdder = () => {
        const productData = {
            method: "push",
            newFavProduct: itemData._id,
        };
        const backendUrl = `https://file-server.liara.run/api/favorite-product`;
        axios.post(backendUrl, productData, { headers: { auth_cookie: auth_cookie } })
            .then((d) => {
                console.log(d.data);
                Cookies.set('auth_cookie', d.data.auth, { expires: 60 });
                const message = d.data.msg ? d.data.msg : "تغییر اطلاعات شما با موفقیت انجام شد."
                toast.success(message, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                // setBulkEmailSituation(input)
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
    const cartAdder = () => {
        const productData = {
            method: "push",
            newCartProduct: itemData._id,
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
    };

    return (
        <article className="sliderItem p-2 hover:-translate-y-2 transition-all duration-300">
            <div className="relative bg-white h-[29rem] w-64 md:w-72 rounded-lg shadow-[0px_1px_10px_rgba(0,0,0,0.25)] hover:shadow-[0px_1px_8px_rgba(0,0,0,0.5)] ">
                <Link href={`/shop/${itemData.slug}`} target={"_blank"}
                    className="flex justify-center items-center pt-2"
                >
                    <Image
                        width={260}
                        height={150}
                        className="rounded-md"
                        src={itemData.image}
                        alt={itemData.imageAlt}
                        title={itemData.imageAlt}
                    />
                </Link>
                <div>
                    <div className="flex flex-col gap-6 p-2">
                        <Link href={`/shop/${itemData.slug}`} target="_blank">
                            <h3 className="m-2 text-justify text-base line-clamp-3">
                                {itemData.title}
                            </h3>
                        </Link>

                        <div className="flex flex-col gap-1 text-zinc-500 text-base sm:text-sm right-1 left-2 absolute top-60">
                            <div className="flex flex-col gap-2">
                                {itemData.features.length < 1 ? (
                                    <div></div>
                                ) : itemData.features.map((da, i) => (
                                    i < 3
                                        ? <div key={i} className="flex justify-between items-center">
                                            <div className="w-40 flex justify-start items-center gap-1">{spliterForFeatures(da)[0]}</div>
                                            <div>{spliterForFeatures(da)[1]}</div>
                                        </div>
                                        : <div key={i}></div>
                                ))}

                            </div>
                        </div>

                        <div className="categories flex justify-start items-center flex-wrap gap-1 right-1 left-2 absolute top-[21rem]">
                            {
                                itemData.categories.length < 1
                                    ? <div></div>
                                    : itemData.categories.map((da, i) => (
                                        i < 3
                                            ? <Link
                                                key={i}
                                                href={`/shop?&maxP=1000000000&minP=0&categories=${da.slug}&pgn=12&pn=1`}
                                                target={"_blank"}
                                                className="py-1 px-2 rounded bg-zinc-200 transition-all duration-300 hover:bg-zinc-300">
                                                {da.title}
                                            </Link>
                                            : <div key={i}></div>
                                    ))
                            }
                        </div>

                    </div>
                    <div className="absolute bottom-2 w-full flex justify-between items-center">
                        <div className="flex gap-2 justify-start items-center mr-1">
                            <div onClick={() => favAdder()} className="bg-zinc-200 cursor-pointer flex justify-center items-center w-9 h-9 rounded-lg transition-all duration-500">
                                <BsBookmark className="w-5 h-5 font-bold" />
                            </div>
                            <div className="bg-zinc-200 flex justify-center items-center w-9 h-9 rounded-lg transition-all duration-500">
                                <Link
                                    href={`/shop/${itemData.slug}`}
                                    target={"_blank"}
                                > <AiOutlineSearch className="w-5 h-5 font-bold" /></Link>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end items-center">
                            <HiOutlineShoppingCart onClick={() => cartAdder()} className="mr-1 w-9 h-9 p-2 rounded bg-zinc-200 text-indigo-600 cursor-pointer transition-all duration-300 hover:bg-orange-400 hover:text-white" />
                            <div className="bg-zinc-500 ml-2 text-white h-9 px-1 flex justify-center items-center rounded-tr-md rounded-br-md">{Number(itemData.price).toLocaleString()}</div>
                        </div>
                    </div>

                </div>
            </div>
        </article>
    )
}

export default GraphicSliderBox;