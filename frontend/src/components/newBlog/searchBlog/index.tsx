"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const SearchBlog = () => {
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const shopSubmiter = (e:React.FormEvent) => {
        e.preventDefault();

        if(!searchRef.current){
            toast.success("لطفا تمام فیلدها را پر کنید", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return;
        }

        if (searchRef.current.value.length < 1) {
            toast.error("فرم جستجو خالی است", {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            })
        } else {
            router.push(`/blog?keyword=${searchRef.current.value.replace(/\s+/g, '_')}`)
        }
    }

    return (
        <div>
            <form onSubmit={shopSubmiter} className="relative border-zinc-700 border-2 w-full px-2 rounded-md flex justify-between items-center">
                <input ref={searchRef} type="text" className="bg-transparent p-2 outline-none text-sm" placeholder="جستجو در وبلاگ..." />
                <button type="submit" className="absolute left-0 cursor-pointer w-10">
                    <BiSearchAlt className="w-6 h-6" />
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
        </div>
    );
}

export default SearchBlog;