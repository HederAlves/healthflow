'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SideBar";
import { store } from "@/store/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Envolvendo a aplicação com o Provider do Redux */}
        <Provider store={store}>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="w-screen">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
