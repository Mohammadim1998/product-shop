// "use client";
// import { useContext, createContext } from "react";

// export const AppContext = createContext();
// export const useAppContext = () => useContext(AppContext);

"use client";
import { ReactNode, useContext, createContext, Dispatch, SetStateAction } from "react";

// تعیین نوع برای مقادیر موجود در Context
interface AppContextType {
    cartNumber: number;
    setCartNumber: Dispatch<SetStateAction<number>>;
}

// ایجاد Context با نوع مشخص
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook برای استفاده آسان از Context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};