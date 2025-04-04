import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type AdminPropsTypes = {
    newUsersNum: number;
    newPaymentsNum: number;
    newCommentsNum: number;
}

const AdminPannel = () => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const [newItemsData, setNewItemsData] = useState<AdminPropsTypes>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://file-server.liara.run/api/get-new-items`;
                await axios.get(url, { headers: { auth_cookie: auth_cookie } })
                    .then((d) => {
                        toast.success("اطلاعات لود شد...", {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setNewItemsData(d.data);
                        console.log("Data: ", d);
                    })
                    .catch((e) => {
                        toast.error("خطای اینترنت", {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setLoading(false);
                    })
                    .finally(() => {
                        setLoading(false);
                    })
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="p-8 flex flex-col gap-8">
            <div>پیشخوان مدیریتی وبسایت</div>
            <div>
                {
                    loading
                        ? (<div className="flex justify-center items-center p-12">
                            <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                        </div>)
                        : (!newItemsData)
                            ? (<div>خطا در لود اطلاعات</div>)
                            : (<div className="flex flex-col gap-6">
                                <div>{newItemsData.newUsersNum} کاربر جدید</div>
                                <div>{newItemsData.newPaymentsNum} سفارش جدید</div>
                                <div>{newItemsData.newCommentsNum} دیدگاه جدید</div>
                            </div>)
                }
            </div>
        </div>
    );
}

export default AdminPannel;