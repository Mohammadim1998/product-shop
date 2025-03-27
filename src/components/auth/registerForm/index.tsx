"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "../../../../context/appContext";

interface FormData {
    username: string;
    displayname: string;
    email: string;
    password: string;
    rePassword: string;
}

interface ApiResponse {
    auth?: string;
    msg?: string;
}

const RegisterForm = () => {
    const router = useRouter();
    const { setCartNumber } = useAppContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>();

    // Redirect if user is already logged in
    useEffect(() => {
        const authCookie = Cookies.get("auth_cookie");
        if (authCookie) {
            router.push("/account/info");
        }
    }, [router]);

    // Reset cart number on register page
    useEffect(() => {
        setCartNumber(0);
    }, [setCartNumber]);

    const formSubmiter = async (data: FormData) => {
        try {
            const formData = {
                username: data.username,
                displayname: data.displayname,
                email: data.email,
                password: data.password,
                rePassword: data.rePassword,
                favoriteProducts: [],
                userProducts: [],
                comments: [],
                payments: [],
                cart: [],
                viewed: false,
                userIsActive: false,
                emailSend: true,
            };

            const backendUrl = "https://file-server.liara.run/api/new-user";
            const response = await axios.post<ApiResponse>(backendUrl, formData);

            if (response.data.auth) {
                Cookies.set("auth_cookie", response.data.auth, { expires: 60 });
            }

            toast.success(
                response.data.msg || "ثبت نام شما با موفقیت انجام شد.",
                {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );

            router.push("/account/info");
        } catch (error) {
            const axiosError = error as AxiosError<{ msg?: string }>;
            const errorMsg =
                axiosError.response?.data?.msg || "خطا در ارتباط با سرور";

            toast.error(errorMsg, {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <section className="container mx-auto flex justify-center items-center">
            <form
                onSubmit={handleSubmit(formSubmiter)}
                className="flex flex-col gap-8 my-8 mx-4 md:m-12 w-full md:w-[30rem] bg-zinc-100 p-2 md:p-12 rounded-md"
            >
                <div className="flex justify-center items-center gap-6 flex-wrap">
                    <h1 className="text-balance md:text-lg text-center text-blue-400">
                        ثبت نام در سایت
                    </h1>
                    <Link
                        href={"/login"}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    >
                        ورود به حساب
                    </Link>
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                        placeholder="نام کاربری"
                        autoComplete="off"
                        {...register("username", {
                            required: true,
                            maxLength: 20,
                            minLength: 6,
                        })}
                    />
                    {errors.username && errors.username.type === "required" && (
                        <div className="text-rose-500 text-sm">نام کاربری وارد نشده است</div>
                    )}
                    {errors.username && errors.username.type === "maxLength" && (
                        <div className="text-rose-500">
                            نام کاربری باید کمتر از 20 کاراکتر باشد
                        </div>
                    )}
                    {errors.username && errors.username.type === "minLength" && (
                        <div className="text-rose-500">
                            نام کاربری باید بیشتر از 6 کاراکتر باشد
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                        placeholder="نام نمایشی"
                        autoComplete="off"
                        {...register("displayname", {
                            required: true,
                            maxLength: 20,
                            minLength: 6,
                        })}
                    />
                    {errors.displayname && errors.displayname.type === "required" && (
                        <div className="text-rose-500 text-sm">نام نمایشی وارد نشده است</div>
                    )}
                    {errors.displayname && errors.displayname.type === "maxLength" && (
                        <div className="text-rose-500">
                            نام نمایشی باید کمتر از 20 کاراکتر باشد
                        </div>
                    )}
                    {errors.displayname && errors.displayname.type === "minLength" && (
                        <div className="text-rose-500">
                            نام نمایشی باید بیشتر از 6 کاراکتر باشد
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="email"
                        className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                        placeholder="ایمیل"
                        autoComplete="off"
                        {...register("email", {
                            required: true,
                            minLength: 11,
                            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        })}
                    />
                    {errors.email && errors.email.type === "required" && (
                        <div className="text-rose-500 text-sm">ایمیل را وارد کنید</div>
                    )}
                    {errors.email && errors.email.type === "pattern" && (
                        <div className="text-rose-500">فرمت ایمیل صحیح نیست</div>
                    )}
                    {errors.email && errors.email.type === "minLength" && (
                        <div className="text-rose-500">
                            تعداد کاراکتر های ایمیل کم است
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="password"
                        className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                        placeholder="رمز عبور"
                        autoComplete="off"
                        {...register("password", {
                            required: true,
                            maxLength: 20,
                            minLength: 8,
                        })}
                    />
                    {errors.password && errors.password.type === "required" && (
                        <div className="text-rose-500 text-sm">رمز عبور وارد نشده است</div>
                    )}
                    {errors.password && errors.password.type === "maxLength" && (
                        <div className="text-rose-500">
                            رمز عبور باید کمتر از 20 کاراکتر باشد
                        </div>
                    )}
                    {errors.password && errors.password.type === "minLength" && (
                        <div className="text-rose-500">
                            رمز عبور باید بیشتر از 8 کاراکتر باشد
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        type="password"
                        className="p-2 rounded-md w-full outline-none border-zinc-400 border-2 focus:border-orange-400"
                        placeholder="تکرار رمز عبور"
                        autoComplete="off"
                        {...register("rePassword", {
                            required: true,
                            validate: (val) => val === watch("password"),
                        })}
                    />
                    {errors.rePassword && errors.rePassword.type === "required" && (
                        <div className="text-rose-500 text-sm">رمز عبور وارد نشده است</div>
                    )}
                    {errors.rePassword && errors.rePassword.type === "validate" && (
                        <div className="text-rose-500">تکرار رمز عبور مطابقت ندارد</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white w-full rounded-md p-2 transition-all duration-500 hover:bg-blue-600"
                >
                    ثبت نام در سایت
                </button>
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
        </section>
    );
};

export default RegisterForm;