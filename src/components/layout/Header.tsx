"use client";

import React from "react";
import { Bell, Home, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
    const router = useRouter();

    return (
        <header className="flex items-center justify-between  p-4 shadow-md bg-emerald-200">
            <div className="flex items-center space-x-2">
                <p className="text-[#00bfae] text-4xl">+</p>
                <span className="text-xl font-bold text-gray-800">HealthFlow</span>
            </div>

            {/* Filtro */}
            {/* <div className="relative">
                <input
                    type="text"
                    placeholder="Filtrar..."
                    className="w-64 rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Filter className="absolute top-2 right-3 text-gray-500" />
            </div> */}

            <div className="flex items-center space-x-4">
                <button
                    title="Registrar Notificações"
                    className="relative rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                >
                    <Bell className="h-6 w-6 text-gray-700" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                    </span>
                </button>

                <button
                    onClick={() => router.push("/")}
                    title="Ir para Home"
                    className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                >
                    <Home className="h-6 w-6 text-gray-700" />
                </button>
            </div>
        </header>
    );
};

export default Header;
