"use client";
import { useEffect, useState } from "react";
import AllComments from "./AllComments";
import CommentDetails from "./CommentDetails";
import AllNewComments from "./AllComments/AllNewComments";

const CommentMain = () => {
    const [midBanDetCtrl, setMidBanDetCtrl] = useState<string>("");
    const [RandomNumForBannerClick, setRandomNumForBannerClick] = useState<number | null>(null);
    const [det, setDet] = useState(<AllComments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />);

    useEffect(() => {
        if (midBanDetCtrl != "") {
            setDet(<CommentDetails goalId={midBanDetCtrl} />)
        }
    }, [RandomNumForBannerClick]);

    return (
        <div className="flex flex-col gap-8">
            <section className="flex justify-between items-center gap-2">
                <h1 className="text-blue-500 text-lg">دیدگاه ها</h1>
                <div className="flex justify-end items-center gap-2">
                    <button onClick={() => setDet(<AllComments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />)}
                        className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500 hover:bg-orange-500">
                        همه
                    </button>

                    <button onClick={() => setDet(<AllNewComments setMidBanDetCtrl={setMidBanDetCtrl} setRandomNumForBannerClick={setRandomNumForBannerClick} />)}
                        className="flex justify-center items-center w-32 h-10 rounded-md bg-indigo-600 text-white transition-all duration-500 hover:bg-orange-500">
                        جدید
                    </button>
                </div>
            </section>

            <section className="">{det}</section>
        </div>
    );
}

export default CommentMain;