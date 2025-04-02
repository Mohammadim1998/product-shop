import PaymentResultcom from "@/components/paymentResult";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AuthPropsTypes = {
    _id: string;
}

export interface PaymentResultPageProps {
    searchParams: Promise<{
        Status?: string;
        Authority?: string;
        // [key: string]: string | undefined;
    }>
}

const getAuthData = async (cookieValue: string | undefined): Promise<AuthPropsTypes> => {
    if (!cookieValue) {
        redirect('/login')
    }
    const goalData = await fetch("https://file-server.liara.run/api/get-user-data", { cache: "no-store", headers: { auth_cookie: cookieValue } });
    const data = await goalData.json();
    if (!data._id) {
        redirect("/login")
    } else {
        return data;
    }
}

const page: React.FC<PaymentResultPageProps> = async ({ searchParams }) => {
    const { Status, Authority } = await searchParams;
    const cookieStore = await cookies();
    const auth_cookie = cookieStore.get("auth_cookie");
    const cookieValue = auth_cookie?.value;
    const data = await getAuthData(cookieValue);

    return (
        <section className="container mx-auto p-12 flex justify-center items-center">
            <>
                <title>لطفا صبر کنید</title>
                <meta name="description" content={"لطفا صبر کنید"} />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href={"http://localhost:3000/payment-result"} />
            </>

            <PaymentResultcom Status={Status} Authority={Authority} cookie={cookieValue} />
        </section>
    );
}

export default page;