import { Inter } from "next/font/google";
import "./globals.css";
import ContextProvider from "../../context/contextProvider";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="rtl">
      <>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon2.ico" type="image/x-icon" />
      </>
      <body className="">
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
