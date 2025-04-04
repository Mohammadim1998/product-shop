"use client";
import { BsTelegram, BsTelephoneFill } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import { AiOutlineYoutube } from "react-icons/ai";
import { GoMail, GoPerson } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { BiMenu, BiSearchAlt } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAppContext } from "../../../context/appContext";
import Cookies from "js-cookie";
import { TbLogin } from "react-icons/tb";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import axios from "axios";

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

const Header = () => {
    const [token, setToken] = useState(Cookies.get('auth_cookie'));
    const [logoHover, setLogoHover] = useState(0);
    // const [cartNumber, setcartNumber] = useState(-1);
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    //CONTEXT OF CART NUMBER
    const { cartNumber } = useAppContext();

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setMenutIsOpen(-1);

        if (!searchRef.current) {
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

        if (searchRef.current.value.length > 0) {
            const url = `/shop?&keyword=${searchRef.current.value.replace(/\s+/g, '_')}`;
            router.push(url);
        } else {
            toast.error("فرم جستجو خالی است", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            })
        }
    }

    //FOR RESPONSIVE
    const [menuIsOpen, setMenutIsOpen] = useState<number>(-1);

    useEffect(() => {
        if (menuIsOpen === -1) {
            document.body.style.overflow = 'auto';
        } else if (menuIsOpen === 1) {
            document.body.style.overflow = 'hidden';
        }
    }, [menuIsOpen]);

    const [favorite, setFavorite] = useState<FavoriteProductType[]>();

    useEffect(() => {
        const fetchData = async () => {
            await axios.get("https://file-server.liara.run/api/get-part-of-user-data/favorite", { headers: { auth_cookie: token } })
                .then((d) => setFavorite(d.data))
                .catch(() => { })
        }

        fetchData();
    })

    return (
        <header className="z-50 w-full container mx-auto py-2 relative ">
            <div className={
                menuIsOpen == -1
                    ? "flex bg-[#000000cc] md:bg-white py-4 md:py-0 h-[100vh] w-full md:h-52 fixed top-0 bottom-0 max-md:-left-[100%] max-md:right-[100%]  md:relative transition-all duration-500"
                    : "flex bg-[#000000cc] backdrop-blur-md md:bg-white py-4 md:py-0 h-[100vh] w-full md:h-52 fixed top-0 bottom-0 max-md:left-6 max-md:right-6 md:relative transition-all duration-500"
            }>
                <div className="w-full flex-col md:flex-row flex justify-start md:justify-between items-center md:items-start gap-6 md:gap-4">
                    <div className="flex flex-col relative h-36 md:h-52 w-48 items-center">
                        <Link href={"/"} className="">
                            <div
                                onMouseEnter={() => setLogoHover(1)}
                                onMouseLeave={() => setLogoHover(0)}
                                className="z-40 bg-white relative logo p-4 rounded-lg
                        shadow-[0px_1px_10px_rgba(0,0,0,0.25)] transition-all duration-500
                        hover:shadow-[0px_1px_10px_rgba(0,0,0,0.5)] text-center flex flex-col justify-center items-center"
                                onClick={() => setMenutIsOpen(-1)}
                            >
                                <Image
                                    src="/images/logo.png"
                                    width={100}
                                    height={100}
                                    alt="mernfa logo"
                                    // priority="true"
                                    className="rounded-lg"
                                />
                                <div className="text-sm xl:text-base">فروشگاه فایل مرنفا</div>
                            </div>
                        </Link>
                        <div
                            onMouseEnter={() => setLogoHover(1)}
                            onMouseLeave={() => setLogoHover(0)}
                            className={logoHover == 0
                                ? "hidden md:flex z-30 absolute bottom-20 right-6 left-6 bg-zinc-100 justify-around items-center p-2 text-indigo-600 rounded-br-md rounded-bl-md transition-all duration-500"
                                : "hidden md:flex z-30 absolute bottom-0 right-0 left-0 bg-zinc-100 justify-around items-center p-2 text-indigo-600 rounded-br-md rounded-bl-md transition-all duration-500"}
                        >
                            <Link href="https://mernfa.ir/nextjs-learning" className="text-[1.5rem] transition-all duration-300 hover:text-orange-500" target={"_blank"}
                                onClick={() => setMenutIsOpen(-1)}><BsTelegram /></Link>
                            <Link href="https://mernfa.ir/nextjs-learning" className="text-[1.5rem] transition-all duration-300 hover:text-orange-500" target={"_blank"}><AiFillTwitterCircle /></Link>
                            <Link href="https://mernfa.ir/nextjs-learning" className="text-[1.5rem] transition-all duration-300 hover:text-orange-500" target={"_blank"}><AiOutlineYoutube /></Link>
                        </div>
                    </div>
                    {/*End LOGO Header */}
                    <div className="w-full flex flex-col gap-4 py-4 h-40 justify-between">
                        <div className="flex flex-col md:flex-row justify-between items-center w-full">
                            <nav className="">
                                <ul className="flex flex-col md:flex-row items-center justify-center gap-2">
                                    <li>
                                        <Link
                                            href="/"
                                            className="w-32 h-10 rounded-md bg-zinc-200 flex justify-center items-center transition-all duration-300 hover:bg-orange-400 hover:text-white"
                                            target={"_blank"}
                                            onClick={() => setMenutIsOpen(-1)}
                                        >
                                            خانه</Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/shop?&maxP=1000000000&minP=0&pgn=12&pn=1"
                                            className="w-32 h-10 rounded-md bg-zinc-200 flex justify-center items-center transition-all duration-300 hover:bg-orange-400 hover:text-white"
                                            target={"_blank"}
                                            onClick={() => setMenutIsOpen(-1)}
                                        >
                                            فروشگاه</Link>
                                    </li>
                                    <li>
                                        <Link onClick={() => setMenutIsOpen(-1)} href="/blog" className="w-32 h-10 rounded-md bg-zinc-200 flex justify-center items-center transition-all duration-300 hover:bg-orange-400 hover:text-white">وبلاگ</Link>
                                    </li>
                                    <li>
                                        <Link onClick={() => setMenutIsOpen(-1)} href="/dashboard" className="w-32 h-10 rounded-md bg-zinc-200 flex justify-center items-center transition-all duration-300 hover:bg-orange-400 hover:text-white">داشبورد</Link>
                                    </li>
                                </ul>
                            </nav>
                            {/*END NAV BAR */}
                            <div className="hidden md:flex flex-col justify-center items-end gap-3">
                                <div className="flex items-center gap-2">
                                    <div>09920320845</div>
                                    <div className="rotate-12 rounded bg-zinc-200 p-2">
                                        <BsTelephoneFill className="w-4 h-4 -rotate-12" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div>m.pourhosein7777@gmail.com</div>
                                    <div className="rotate-12 rounded bg-zinc-200 p-2">
                                        <GoMail className="w-4 h-4 -rotate-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center">
                            <form onSubmit={submitHandler} className="relative flex justify-start items-center w-2/3 xl:w-full md:ml-8">
                                <input
                                    ref={searchRef}
                                    className="outline-none w-full p-3 rounded-lg transition-all duration-500 shadow-[0px_0px_5px_rgba(0,0,0,0.15)] focus:shadow-[0px_3px_5px_rgba(0,0,0,0.35)]"
                                    name="productsSearch"
                                    id="productsSearch"
                                    type="text"
                                    placeholder="جستجو بین محصولات..."
                                />

                                <button type="submit"
                                    className="w-10 absolute left-0 cursor-pointer">
                                    <BiSearchAlt className="w-8 h-8" />
                                </button>
                            </form>

                            <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-[26rem] justify-end">
                                <div className="flex justify-between items-center gap-2">
                                    <Link onClick={() => setMenutIsOpen(-1)} href={"/account/favorite"}>
                                        {!favorite?.length
                                            ? (<MdFavoriteBorder className="bg-zinc-400 text-white rounded p-2 w-12 h-12 " />)
                                            : (<MdOutlineFavorite className="bg-zinc-400 text-red-600 rounded p-2 w-12 h-12 " />)}

                                    </Link>

                                    <Link onClick={() => setMenutIsOpen(-1)} href={"/account/info"}>
                                        {!token
                                            ? (<TbLogin className="bg-zinc-400 text-white rounded p-2 w-12 h-12 " />)
                                            : (<IoPersonCircle className="bg-zinc-400 text-white rounded p-2 w-12 h-12 " />)}
                                    </Link>
                                </div>

                                <Link onClick={() => setMenutIsOpen(-1)} href={"/cart"} className="flex gap-2 justify-center items-center transition-all duration-500 hover:bg-orange-500 bg-orange-400 p-2 rounded-md">
                                    <div className="text-orange-500 bg-white rounded-full w-8 h-8 flex justify-center items-center">
                                        {cartNumber == -1
                                            ? <div className="flex justify-center items-center p-1">
                                                <Image alt="loading" width={20} height={20} src={"/loading.svg"} />
                                            </div>
                                            : cartNumber}
                                    </div>
                                    <div className="text-white">سبد خرید</div>
                                    <div className="text-orange-500 bg-white rounded-lg w-8 h-8 flex justify-center items-center">
                                        <AiOutlineShoppingCart className="w-6 h-6" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="z-50 flex md:hidden fixed top-2 right-5">
                <BiMenu
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == -1
                            ? "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 flex"
                            : "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 hidden"
                    } />

                <IoMdClose
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == 1
                            ? "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 flex"
                            : "w-10 h-10 text-white bg-orange-500 p-1 rounded hover:bg-orange-600 transition-all duration-300 hidden"
                    } />
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
        </header>
    );
}

export default Header;