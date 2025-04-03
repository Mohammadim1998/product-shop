import RegisterForm from "@/components/auth/registerForm"
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type AuthDataPropsTypes = {
    _id: string;
}

const getAuthData = async (cookieValue: string | undefined): Promise<AuthDataPropsTypes> => {
    if (!cookieValue) {
        redirect('/login')
    }

    const goalData = await fetch("https://file-server.liara.run/api/get-user-data", { cache: "no-store", headers: { auth_cookie: cookieValue } });
    const data = await goalData.json();
    if (data._id) {
        redirect("/account")
    } else {
        return data;
    }
}

const page = async () => {
    const cookieStore = await cookies();
    const auth_cookie = cookieStore.get("auth_cookie");
    const cookieValue = (auth_cookie && auth_cookie.value) ? auth_cookie.value : undefined;
    const data = await getAuthData(cookieValue);

    return (
        <div>
            <>
                <title>ثبت نام در سایت</title>
                <meta name="description" content={"ثبت نام در سایت"} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={"http://localhost:3000/register"} />
            </>

            <RegisterForm />
        </div>
    )
}

export default page;