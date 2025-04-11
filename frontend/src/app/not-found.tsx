import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center p-12">
            <>
                <title>صفحه یافت نشد...</title>
                <meta name="description" content={"صفحه یافت نشد..."} />
                <meta name="robots" content="index, follow" />
                خطا
            </>

            <span>صفحه مورد نظر یافت نشد</span>
            <Link href={"/"} className="cursor-pointer">
                <button className="bg-purple-500 px-6 py-2 text-white cursor-pointer rounded-md mt-6">برو به صفحه اصلی سایت</button>
            </Link>
        </div>
    );
}

export default NotFound;