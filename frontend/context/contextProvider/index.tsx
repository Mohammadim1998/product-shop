"use client";
import { AppContext } from "../appContext";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [auth_cookie, setAuth_cookie] = useState<string | undefined>(Cookies.get("auth_cookie"));
    const [cartNumber, setCartNumber] = useState<number>(-1);

    useEffect(() => {
        const url = "https://file-server.liara.run/api/cart-number";
        axios.get(url, { headers: { auth_cookie: auth_cookie } })
            .then(d => setCartNumber(d.data.number))
            .catch(d => setCartNumber(0))
    }, []);

    return (
        <AppContext.Provider value={{ cartNumber, setCartNumber }}>
            {children}
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
        </AppContext.Provider>
    )
}

export default ContextProvider;