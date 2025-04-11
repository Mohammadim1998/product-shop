import { redirect } from "next/navigation";

const page = async () => {
    redirect("/account/info")
}

export default page;