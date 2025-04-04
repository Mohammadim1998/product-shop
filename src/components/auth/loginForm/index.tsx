"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../context/appContext";

interface FormData {
  email: string;
  password: string;
}

interface ApiResponse {
  auth?: string;
  msg?: string;
}

const LoginForm = () => {
  const [auth_cookie, setAuth_cookie] = useState<string | undefined>(
    Cookies.get("auth_cookie")
  );
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const [routerState, setRouterState] = useState<number>(0);
  useEffect(() => {
    if (routerState === 1) {
      router.push("/account/info");
      setRouterState(0);
    }
  }, [routerState]);

  // IF USER HAVE TOKEN SHOULD BE REDIRECTED TO ACCOUNT PAGE
  useEffect(() => {
    setAuth_cookie(Cookies.get("auth_cookie"));
  }, [Cookies.get("auth_cookie")]);

  // CONTEXT OF CART NUMBER
  // IF USER COME IN REGISTER OR LOGIN PAGE, HE HAVEN'T TOKEN. SO HIS CART NUMBER SHOULD BE ZERO
  const { setCartNumber } = useAppContext();
  useEffect(() => {
    setCartNumber(0);
  }, [setCartNumber]);

  const formSubmiter = () => {
    const formData: FormData = {
      email: watch("email"),
      password: watch("password"),
    };
    const backendUrl = "https://file-server.liara.run/api/login-user";
    axios
      .post<ApiResponse>(backendUrl, formData)
      .then((d) => {
        if (d.data.auth) {
          Cookies.set("auth_cookie", d.data.auth, { expires: 60 });
        }
        const message = d.data.msg
          ? d.data.msg
          : "با موفقیت وارد حساب کاربری شدید";
        toast.success(message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRouterState(1);
      })
      .catch((err) => {
        const errorMsg =
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : "خطا";
        toast.error(errorMsg, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <section className="container mx-auto flex justify-center items-center">
      <form
        onSubmit={handleSubmit(formSubmiter)}
        className="flex flex-col gap-8 my-8 mx-4 md:m-12 w-full md:w-[30rem] bg-zinc-100 p-2 md:p-12 rounded-md"
      >
        <div className="flex justify-center items-center gap-x-6">
          <h1 className="text-base md:text-lg text-center text-blue-400">
            ورود به حساب
          </h1>

          <Link
            href={"/register"}
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
          >
            ثبت نام در سایت
          </Link>
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
            <div className="text-rose-500">تعداد کاراکتر های ایمیل کم است</div>
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
              minLength: 6,
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
              رمز عبور باید بیشتر از 6 کاراکتر باشد
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full rounded-md p-2 transition-all duration-500 hover:bg-blue-600"
        >
          ورود به حساب کاربری
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

export default LoginForm;