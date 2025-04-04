"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { ItemsBannerPropsTypes } from "../allMidBanners";
import Image from "next/image";

type BannerDetailsPropsTypes = {
    midBanId: string;
}

const MidBannersDetails: React.FC<BannerDetailsPropsTypes> = ({ midBanId }) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const imageUrlRef = useRef<HTMLInputElement>(null);
    const imageAltRef = useRef<HTMLInputElement>(null);
    const imageLinkRef = useRef<HTMLInputElement>(null);
    const imageSituationRef = useRef<HTMLSelectElement>(null);

    const formKeyNotSuber = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    };

    const updater = (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageUrlRef.current || !imageAltRef.current
            || !imageLinkRef.current || !imageSituationRef.current) {
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
            goalId: midBanId,
            image: imageUrlRef.current.value,
            imageAlt: imageAltRef.current.value,
            link: imageLinkRef.current.value,
            situation: imageSituationRef.current.value,
            date: new Date().toLocaleDateString('fa-IR', { hour: "2-digit", minute: "2-digit" })
        }

        const url = `https://file-server.liara.run/api/update-middle-banner/${midBanId}`;
        axios.post(url, formData, { headers: { auth_cookie: auth_cookie } })
            .then(d => {
                formData.situation == "true"
                    ? toast.success("بنر با موفقیت بروزرسانی شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    : toast.success("بنر به صورت پیشنویس ذخیره شد.", {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
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
    };

    const [imageUrlS, setImageUrlS] = useState("");
    const [imageAltS, setImageAltS] = useState("");
    const [imageLinkS, setImageLinkS] = useState("");
    const [imageSituationS, setImageSituationS] = useState("");
    const [fullData, setFullData] = useState<ItemsBannerPropsTypes | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetData = async () => {
            try {
                await axios.get(`https://file-server.liara.run/api/get-mid-ban/${midBanId}`, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        setImageUrlS(d.data.image)
                        setImageAltS(d.data.imageAlt)
                        setImageLinkS(d.data.link)
                        setImageSituationS(d.data.situation)
                        setFullData(d.data)
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

        fetData();
    }, [midBanId]);

    const remover = () => {
        axios.post(`https://file-server.liara.run/api/delete-middle-banner/${midBanId}`, { headers: { auth_cookie: auth_cookie } })
            .then(d => {
                toast.success("بنر با موفقیت حذف شد.", {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
            .catch(e => {
            })
    };

    return (
        <>
            {loading
                ? (<div className="flex justify-center items-center p-12">
                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                </div>)
                : (<div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-orange-500">جزئیات بنر</h2>
                        <button onClick={() => remover()} className="bg-rose-600 cursor-pointer text-white px-4 py-1 rounded-sm text-xs">حذف</button>
                    </div >

                    <div className="flex justify-between items-center">
                        <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?._id ? fullData?._id : ""}</div>
                        <div className="bg-zinc-100 rounded px-3 py-1 text-sm">{fullData?.date ? fullData?.date : ""}</div>
                    </div>

                    <form onKeyDown={formKeyNotSuber} onSubmit={updater} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-6">
                            <div>آدرس جدید عکس</div>
                            <input required={true} defaultValue={imageUrlS} ref={imageUrlRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>آلت جدید عکس</div>
                            <input required={true} defaultValue={imageAltS} ref={imageAltRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>لینک جدید عکس</div>
                            <input required={true} defaultValue={imageLinkS} ref={imageLinkRef} type="text" className="inputLtr p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400" />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>روشن و خاموش</div>
                            <select defaultValue={imageSituationS} ref={imageSituationRef} className="p-2 rounded-md w-full outline-none border-2 border-zinc-300 focus:border-orange-400ب">
                                {imageSituationS == "true" ?
                                    (<>
                                        <option value="true">روشن</option>
                                        <option value="false">خاموش</option>
                                    </>
                                    ) : (<>
                                        <option value="false">خاموش</option>
                                        <option value="true">روشن</option>
                                    </>
                                    )
                                }
                            </select>
                        </div>

                        <button type="submit" className="bg-indigo-600 cursor-pointer py-2 text-white w-full rounded-md transition-all duration-500 hover:bg-orange-500">به روز رسانی</button>
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
        </>
    );
}

export default MidBannersDetails;