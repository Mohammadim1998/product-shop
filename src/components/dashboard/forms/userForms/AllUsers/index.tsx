"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Box from "./box";
import Image from "next/image";
import Cookies from "js-cookie";

type AllUsersPropsTypes = {
    setMidBanDetCtrl: (value: string) => void;
    setRandomNumForBannerClick: (value: number) => void;
}

export type UsersDataPropsTypes = {
    _id: string;
    createdAt: string;
    displayname: string;
    email: string;
    userIsAcive: boolean;
    username: string;
    viewed: boolean;
}

const AllUsers: React.FC<AllUsersPropsTypes> = ({ setMidBanDetCtrl, setRandomNumForBannerClick }) => {
    const goTopCtrl = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const [users, setusers] = useState<UsersDataPropsTypes[] | null>(null);
    const [numbersOfBtns, setNumbersOfBtns] = useState<number[]>([-1]);
    const [filteredBtns, setfilteredBtns] = useState<number[]>([-1]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [allusersNumber, setAllusersNumber] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const paginate = 2;

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`https://file-server.liara.run/api/users?pn=${pageNumber}&&pgn=${paginate}`, { headers: { auth_cookie: auth_cookie } })
                .then(d => {
                    setusers(d.data.GoalUsers);
                    setNumbersOfBtns(Array.from(Array(Math.ceil(d.data.AllUsersNum / paginate)).keys()));
                    setAllusersNumber(d.data.AllUsersNum);
                })
                .catch(e => {
                    setLoading(false);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchData();
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
                <div className="w-32 h-10 rounded bg-indigo-500 text-white flex justify-center items-center">{allusersNumber} کاربر</div>
            </div>
            <div className="flex flex-col gap-6">
                {loading
                    ? (
                        <div className="flex justify-center items-center p-12">
                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                        </div>
                    ) : users && users?.length < 1
                        ? (<div className="flex justify-center items-center w-full p-8">کاربری موجود نیست ...</div>)
                        : (users && users?.map((da, i) => (
                            <Box key={i} data={da} setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />
                        )))
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
                                : setusers(null);
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

export default AllUsers;