"use client";
import { useEffect, useState } from "react";

const CommentReplyesList = ({commentProps, goalId }) => {
    const [commentReplyes, setCommentReplyes] = useState(1);

    useEffect(() => {
        const backendUrl = `https://file-server.liara.run/api/get-comment-children/${goalId}`;
        axios.get(backendUrl)
            .then((d) => {
                setCommentReplyes(d.data);
            })
            .catch((err) => {
                const errorMsg = (err.response && err.response.data && err.response.data.msg) ? err.response.data.msg : "خطا در لود دیدگاه"
               console.log(err);
            })
    }, [goalId]);

    return (
        <div>
            {commentReplyes[0] == -1
                ? <div className="flex justify-center items-center p-12">
                    <Image alt="loading" width={120} height={120} src={"/loading.svg"} />
                </div>
                : commentReplyes.length < 1
                    ? <div>اولین نفری باشید که برای این دیدگاه، پاسخ ثبت می کنید...</div>
                    : <div className="flex flex-col gap-6">
                        {commentReplyes.map((da, i) => <CommentBox commentProps={commentProps} key={i} data={da} />)}
                    </div>
            }
        </div>
    );
}

export default CommentReplyesList;