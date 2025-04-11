import DCBtn from "@/components/dashboard/dashboard-ctrl/btn";
import { useState } from "react";

const DashboardCtrl = ({ setcontentChanger }) => {
    const [colorChanger, setColorChanger] = useState("counter");

    return (
        <div className="w-60 bg-zinc-200 p-4 flex justify-center items-center rounded-lg">
            <div className="flex flex-col gap-6">
                <DCBtn title={"پیشخوان"} content={"counter"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"بنر های تبلیغاتی"} content={"midBan"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"اسلایدر ها"} content={"sliders"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"پست ها"} content={"posts"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"دسته ها"} content={"categories"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"محصولات"} content={"products"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"کاربرها"} content={"users"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"سفارش ها"} content={"payments"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
                <DCBtn title={"دیدگاه ها"} content={"comments"} setcontentChanger={setcontentChanger} colorChanger={colorChanger} setColorChanger={setColorChanger} />
            </div>
        </div>
    );
}

export default DashboardCtrl;