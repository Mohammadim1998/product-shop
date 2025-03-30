"use client";

const Box = ({ data, setMidBanDetCtrl, setRandomNumForBannerClick }) => {
    return (
        <div
            onClick={() => {
                setMidBanDetCtrl(data._id);
                setRandomNumForBannerClick(Math.ceil(Math.random() * 20))
            }}
            className="relative flex justify-start items-center gap-8 cursor-pointer p-6 w-full rounded-lg bg-zinc-100 border-2 border-zinc-200 transition-all duration-500 hover:border-orange-500">

            <div className="flex flex-col gap-4">
                <div>نام کاربری: {data.username}</div>
                <div>نام نمایشی: {data.displayname}</div>
                <div>ایمیل: {data.email}</div>
                <div className="text-xs absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded">
                    {data.createdAt}
                </div>

                <div className="absolute top-3 left-32 text-sm text-white">
                    {
                        data.userIsAcive == true
                            ? <div className="bg-green-600 px-3 py-1 rounded">فعال</div>
                            : <div className="bg-rose-600 px-3 py-1 rounded">غیرفعال</div>
                    }
                </div>
                <div className="absolute bottom-3 left-3 flex justify-end items-center gap-2">
                    {
                        data.viewed == true
                            ? <div></div>
                            : <div className="bg-blue-600 text-xs text-white px-3 py-1 rounded">جدید</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Box;