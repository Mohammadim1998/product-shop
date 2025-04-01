"use client";
import { useEffect, useState } from "react";
import CommentBox from "../CommentBox";
import Image from "next/image";
import axios from "axios";


const CommentList = ({ commentProps }) => {
    const [modelAllComments, setModelAllComments] = useState([-1]);

    useEffect(() => {
        const backendUrl = "https://file-server.liara.run/api/get-model-comments";
        const formData = {
            _id: commentProps.src_id
        }
        axios.post(backendUrl, formData)
            .then((d) => {
                setModelAllComments(d.data);
            })
            .catch((err) => {
                const errorMsg = (err.response && err.response.data && err.response.data.msg) ? err.response.data.msg : "خطا در لود دیدگاه"
                toast.error(errorMsg, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }, [commentProps.src_id]);

    return (
        <div>
            {modelAllComments[0] == -1
                ? <div className="flex justify-center items-center p-12">
                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                </div>
                : modelAllComments.length < 1
                    ? <div>اولین نفری باشید که برای این مطلب، دیدگاهتان را ثبت می کنید...</div>
                    : <div className="flex flex-col gap-6">
                        {modelAllComments.map((da, i) => <CommentBox commentProps={commentProps} key={i} data={da} />)}
                    </div>
            }
        </div>
    );
}

export default CommentList;