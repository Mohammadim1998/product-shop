"use client";

const Box = ({ data, setMidBanDetCtrl, setRandomNumForBannerClick }) => {
    
    //PRICE BEAUTIFUL
  function priceChanger(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    return (
        <div
            onClick={() => {
                setMidBanDetCtrl(data._id);
                setRandomNumForBannerClick(Math.ceil(Math.random() * 20))
            }}
            className="relative flex justify-start items-center gap-8 cursor-pointer p-6 w-full rounded-lg bg-zinc-100 border-2 border-zinc-200 transition-all duration-500 hover:border-orange-500">

            <div className="flex flex-col gap-4">
                <div>مبلغ : {priceChanger(data.amount / 10)} تومان</div>
                <div>ایمیل: {data.email}</div>
                <div className="text-xs absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded">
                    {data.updatedAt}
                </div>

                <div className="absolute top-3 left-32 text-sm text-white">
                    {
                        data.payed == true
                            ? <div className="bg-green-600 px-3 py-1 rounded">پرداخت شده</div>
                            : <div className="bg-rose-600 px-3 py-1 rounded">پرداخت نشده</div>
                    }
                </div>
                <div className="absolute bottom-3 left-3 flex justify-end items-center gap-2">
                    {
                        data.viewed == true
                            ? <div></div>
                            : <div className="bg-green-600 text-xs text-white px-3 py-1 rounded">جدید</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Box;