"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Info from "../Info";
import Favorites from "../Favorites";
import Files from "../Files";
import Comments from "../Comments";
import Payments from "../Payments";
import axios from "axios";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useAppContext } from "../../../../context/appContext";

const goTopCtrl = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

type ItemsPropsTypes = {
    items: {
        slug: string[]
    }
}

// export type CookiesPropsTypes = {
//     cookie: string
// }

const AccountMain = ({ items }: ItemsPropsTypes) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const [auth_cookie2, setAuth_cookie2] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const router = useRouter();

    useEffect(() => {
        if (auth_cookie != auth_cookie2) {
            router.push("/login");
        } else if (!auth_cookie || auth_cookie2 == "") {
            router.push("/login");
        } else {
            const fetchData = async () => {
                try {
                    await axios.get("https://file-server.liara.run/api/get-user-data", { headers: { auth_cookie: auth_cookie } })
                        .then(d => {
                            if (!d.data._id) {
                                router.push("/login")
                            }
                        })
                        .catch(e => { router.push("/login") })
                } catch (error) {
                    console.log(error);
                }
            }

            fetchData();
        }
    }, [Cookies.get("auth_cookie")]);

    useEffect(() => {
        setAuth_cookie2(Cookies.get("auth_cookie"));
    }, [items.slug[0]]);

    const [menuIsOpen, setMenutIsOpen] = useState(-1);

    //TAB
    const [details, setDetails] = useState(<Info cookie={auth_cookie} />);
    useEffect(() => {
        if (items.slug[0] == "info") {
            setDetails(<Info cookie={auth_cookie} />)
        } else if (items.slug[0] == "favorites") {
            setDetails(<Favorites cookie={auth_cookie} />)
        } else if (items.slug[0] == "files") {
            setDetails(<Files cookie={auth_cookie} />)
        } else if (items.slug[0] == "comments") {
            setDetails(<Comments cookie={auth_cookie} />)
        } else if (items.slug[0] == "payments") {
            setDetails(<Payments cookie={auth_cookie} />)
        }
    }, [items.slug[0]]);

    useEffect(() => {
        if (menuIsOpen == -1) {
            document.body.style.overflow = 'auto';
        } else if (menuIsOpen == 1) {
            document.body.style.overflow = 'hidden';
        }
    }, [menuIsOpen]);

    //IF USER COME IN ACCOUNT PAGE, HIS CARTNUMBER SHOULD BE RESET
    const { setCartNumber } = useAppContext();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "https://file-server.liara.run/api/cart-number";
                await axios.get(url, { headers: { auth_cookie: auth_cookie } })
                    .then(d => setCartNumber(d.data.number))
                    .catch(d => setCartNumber(0))
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="w-full flex justify-between gap-2">
                <div>
                    <div
                        className={
                            menuIsOpen == -1
                                ? "z-40 w-72 min-w-72 md:bg-zinc-100 bg-[#000000cc] rounded-none md:rounded-md fixed md:sticky md:top-8 md:bottom-8 px-2 py-24 md:py-0 h-auto bottom-0 top-0 left-[100%] -right-[100%] md:left-0 md:right-0 transition-all duration-500"
                                : "z-50 w-full md:w-72 min-w-72 flex flex-col gap-4 backdrop-blur-md bg-[#000000cc] md:bg-transparent px-2 py-24 md:py-0 h-[100vh] overflow-auto md:h-auto fixed top-0 bottom-0 left-0 right-0 md:static transition-all duration-500"
                        }>

                        <nav className="w-full flex justify-center items-center">
                            <ul className="w-full flex flex-col gap-4">
                                <li>
                                    <Link onClick={() => {
                                        goTopCtrl();
                                        setMenutIsOpen(-1);
                                    }} href={"/account/info"}

                                        className={items.slug[0] == "info"
                                            ? "rounded-md text-white bg-indigo-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                            : "rounded-md text-white bg-orange-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                        }
                                    >اطلاعات</Link>
                                </li>
                                <li>
                                    <Link onClick={() => {
                                        goTopCtrl();
                                        setMenutIsOpen(-1);
                                    }} href={"/account/favorites"}

                                        className={items.slug[0] == "favorites"
                                            ? "rounded-md text-white bg-indigo-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                            : "rounded-md text-white bg-orange-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                        }
                                    >مورد علاقه ها</Link>
                                </li>
                                <li>
                                    <Link onClick={() => {
                                        goTopCtrl();
                                        setMenutIsOpen(-1);
                                    }} href={"/account/files"}

                                        className={items.slug[0] == "files"
                                            ? "rounded-md text-white bg-indigo-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                            : "rounded-md text-white bg-orange-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                        }
                                    >فایل ها</Link>
                                </li>
                                <li>
                                    <Link onClick={() => {
                                        goTopCtrl();
                                        setMenutIsOpen(-1);
                                    }} href={"/account/comments"}

                                        className={items.slug[0] == "comments"
                                            ? "rounded-md text-white bg-indigo-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                            : "rounded-md text-white bg-orange-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                        }
                                    >دیدگاه ها</Link>
                                </li>
                                <li>
                                    <Link onClick={() => {
                                        goTopCtrl();
                                        setMenutIsOpen(-1);
                                    }} href={"/account/payments"}

                                        className={items.slug[0] == "payments"
                                            ? "rounded-md text-white bg-indigo-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                            : "rounded-md text-white bg-orange-500 transition-all duration-500 hover:bg-indigo-600 flex justify-center items-center w-full h-12"
                                        }
                                    >سفارش ها</Link>
                                </li>
                            </ul>
                        </nav >
                    </div >
                </div >

                <div className="w-full p-2 md:p-4 bg-zinc-100 rounded-md mt-12 md:mt-0">{details}</div>
            </div >
            <div className="z-50 flex md:hidden fixed top-2 left-5">
                <BiMenu
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == -1
                            ? "w-10 h-10 text-black flex"
                            : "w-10 h-10 text-black hidden"
                    } />

                <IoMdClose
                    onClick={() => setMenutIsOpen(menuIsOpen * -1)}
                    className={
                        menuIsOpen == 1
                            ? "w-10 h-10 text-white flex"
                            : "w-10 h-10 text-white hidden"
                    } />
            </div>
        </div>
    );
}

export default AccountMain;