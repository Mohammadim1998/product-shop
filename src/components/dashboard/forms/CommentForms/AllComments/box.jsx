"use client";

const Box = ({ data, setMidBanDetCtrl, setRandomNumForBannerClick }) => {

    return (
        <div
            onClick={() => {
                setMidBanDetCtrl(data._id);
                setRandomNumForBannerClick(Math.ceil(Math.random() * 20))
            }}
            className="relative flex justify-start items-center gap-8 cursor-pointer p-6 w-full h-24 rounded-lg bg-zinc-100 border-2 border-zinc-200 transition-all duration-500 hover:border-orange-500">

            <div className="flex flex-col gap-4">
                <div>ایمیل: {data.email}</div>
                <div className="text-xs absolute top-3 left-3 bg-orange-500 flex justify-center items-center h-6 w-28 text-white px-3 py-1 rounded">
                    {data.createdAt}
                </div>

                <div className="absolute top-3 left-32 flex justify-end items-center gap-2">
                    {
                        data.parenId == "nothing"
                            ? <div className="bg-sky-600 px-3 py-1 rounded">اصلی</div>
                            : <div className="bg-sky-600 px-3 py-1 rounded">پاسخ</div>
                    }
                </div>
                <div className="absolute bottom-3 left-32 text-xs text-white">
                    {
                        data.viewed == true
                            ? <div></div>
                            : <div className="bg-blue-600 text-xs text-white px-3 py-1 rounded">جدید</div>
                    }
                </div>
                <div className="absolute bottom-3 left-3 flex justify-end items-center gap-2">
                    {
                        data.published == true
                            ? <div className="bg-indigo-600 text-xs text-white px-3 py-1 rounded">منتشر شده</div>
                            : <div className="bg-rose-600 text-xs text-white px-3 py-1 rounded">منتشر نشده</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Box;