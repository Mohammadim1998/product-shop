"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Box from "./box";
import Image from "next/image";
import Cookies from "js-cookie";

type BannersPropsTypes = {
    setMidBanDetCtrl: (value: string) => void;
    setRandomNumForBannerClick: (value: number) => void;
}

export type ItemsBannerPropsTypes = {
    _id: string;
    date: string;
    image: string;
    imageAlt: string;
    situation: boolean;
}

const allMidBanners: React.FC<BannersPropsTypes> = ({ setMidBanDetCtrl, setRandomNumForBannerClick }) => {
    const goTopCtrl = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const [auth_cookie, setAuth_cookie] = useState(Cookies.get("auth_cookie"));
    const [banners, setBanners] = useState<ItemsBannerPropsTypes[] | null>(null);
    const [numbersOfBtns, setNumbersOfBtns] = useState([-1]);
    const [filteredBtns, setfilteredBtns] = useState([-1]);
    const [pageNumber, setPageNumber] = useState(1);
    const [allMidBanNumber, setAllMidBanNumber] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const paginate = 2;

    useEffect(() => {
        axios.get(`https://file-server.liara.run/api/middle-banners?pn=${pageNumber}&&pgn=${paginate}`, { headers: { auth_cookie: auth_cookie } })
            .then(d => {
                setBanners(d.data.GoalMidBans);
                setNumbersOfBtns(Array.from(Array(Math.ceil(d.data.AllMidBansNum / paginate)).keys()));
                setAllMidBanNumber(d.data.AllMidBansNum);
            })
            .catch(e => {
                console.log("error");
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [pageNumber]);

    useEffect(() => {
        if (numbersOfBtns[0] != -1 && numbersOfBtns.length > 0) {
            const arr: number[] = [];
            numbersOfBtns.map((n) => {
                if (
                    n == 0 ||
                    (n < pageNumber + 1 && n > pageNumber - 3) ||
                    n == numbersOfBtns.length - 1
                ) {
                    arr.push(n);
                }
            });
            setfilteredBtns(arr);
        }
        else if (numbersOfBtns.length == 0) {
            setfilteredBtns([]);
        }
    }, [numbersOfBtns]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-end">
                <div className="w-32 h-10 rounded bg-indigo-500 text-white flex justify-center items-center">{allMidBanNumber} بنر</div>
            </div>
            <div className="flex flex-col gap-6">
                {loading
                    ? (
                        <div className="flex justify-center items-center p-12">
                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                        </div>
                    ) : banners !== null && banners.length < 1
                        ? (<div className="flex justify-center items-center w-full p-8">بنری موجود نیست ...</div>)
                        : (banners && banners?.map((da, i) => (
                            <Box key={i} data={da} setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />))
                        )
                }
            </div>

            <div className=" flex justify-center gap-4 items-center">
                {filteredBtns[0] == -1 ? (
                    <div className=" flex justify-center items-center p-12">
                        <Image
                            alt="loading"
                            width={40}
                            height={40}
                            src={"/loading.svg"}
                        />
                    </div>
                ) : (
                    filteredBtns.map((da, i) => (
                        <button className={
                            da + 1 == pageNumber
                                ? " bg-orange-400 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                                : " bg-indigo-500 text-white w-8 h-8 flex justify-center items-center rounded transition-all duration-500 hover:bg-orange-500"
                        } onClick={() => {
                            da + 1 == pageNumber
                                ? console.log("")
                                : setBanners(null);
                            setPageNumber(da + 1);
                            goTopCtrl();
                        }}
                            key={i}
                        >
                            {da + 1}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default allMidBanners;