"use client";
import { FaReply } from "react-icons/fa";
import NewComment from "../NewComment";
import { useState } from "react";
import CommentReplyesList from "../CommentReplyesList";

const CommentBox = ({ data, commentProps }) => {
    const [replyDisplayer, setReplyDisplayer] = useState(1);
    const [childrenDisplayer, setChildrenDisplayer] = useState(1);

    return (
        <div className="relative bg-zinc-100 border-2 border-zinc-400 p-2 rounded-md flex flex-col gap-2">
            <div className="flex justify-between items-center flex-wrap">
                <div className="px-2 py-1 rounded bg-zinc-200">{data.displayname}</div>
                <div className="px-2 py-1 rounded bg-orange-500 text-white">{data.createdAt}</div>
            </div>

            <p className="text-black leading-9 text-justify p-2">{data.message}</p>

            <div className="flex justify-end items-center gap-4">
                <div onClick={() => setChildrenDisplayer(childrenDisplayer * -1)} className="cursor-pointer text-base sm:text-sm px-2 h-8 rounded bg-blue-600 text-white flex justify-center items-center">نمایش پاسخ ها</div>
                <FaReply onClick={() => setReplyDisplayer(replyDisplayer * -1)} className="cursor-pointer w-8 h-8 bg-blue-600 text-white p-2 rounded rotate-180" />
            </div>

            <div className="">
                {
                    replyDisplayer == 1
                        ? <div className="absolute bottom-0 left-0 h-0 w-0"></div>
                        : <NewComment commentProps={commentProps} text={"ثبت پاسخ"} itemParentId={data._id} />
                }
            </div>

            <div className="">
                {
                    childrenDisplayer == 1
                        ? <div className="absolute bottom-0 left-0 h-0 w-0"></div>
                        : <CommentReplyesList goalId={data._id} commentProps={commentProps} />
                }
            </div>
        </div>
    );
}

export default CommentBox;