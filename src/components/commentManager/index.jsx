import CommentList from "./CommentList";
import NewComment from "./NewComment";

const CommentManager = ({ commentProps }) => {
    console.log("commentProps ==>>>", commentProps);

    return (
        <section className="flex flex-col gap-6">
            <h2 className="text-xl">دیدگاه ها</h2>
            <NewComment commentProps ={commentProps} text={"ثبت دیدگاه"} />
            <CommentList commentProps ={commentProps} />
        </section>
    );
}

export default CommentManager;