import MainDashboard from "@/components/dashboard/mainDashboard";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import NotFound from "../not-found";

type AuthDataPropsTypes = {
    _id: string;
}

const getAuthData = async (cookieValue: string | undefined): Promise<AuthDataPropsTypes> => {
    if (!cookieValue) {
        redirect('/login');
    }

    try {
        const response = await fetch("https://file-server.liara.run/api/get-user-admin-data", {
            cache: "no-store",
            headers: { auth_cookie: cookieValue }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        if (!data?._id) {
            redirect('/not-found');
        }

        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        redirect('/not-found');
    }
}

const page = async () => {
    const cookieStore = await cookies();
    const auth_cookie = cookieStore.get("auth_cookie");

    if (!auth_cookie?.value) {
        return <NotFound />;
    }

    const data = await getAuthData(auth_cookie.value);
    return (
        <div>
            <>
                <title>داشبورد مدیریتی</title>
                <meta name="description" content={"داشبورد مدیریتی"} />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href={"http://localhost:3000/dashboard"} />
            </>

            <MainDashboard />
        </div>
    )
}

export default page;