"use client";

import React, { useState } from "react";
import { Bell, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { countAbnormalVitalSigns } from "@/utils/vitalSigns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { HealthFlow } from "@/reducer/healthflowReducer";
import { FaFaceDizzy, FaFaceFrownOpen, FaUserDoctor, FaUserNurse } from "react-icons/fa6";
import { BsClockHistory } from "react-icons/bs";
import { AiFillAlert } from "react-icons/ai";

const Header: React.FC = () => {
    const router = useRouter();
    const { healthFlows } = useSelector((state: RootState) => state.healthflow);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{ red: boolean, yellow: boolean }>({
        red: true,
        yellow: true,
    });

    // Contadores de alertas
    let yellowCount = 0;
    let redCount = 0;

    // Listas dos pacientes com alterações
    const redAlerts: HealthFlow[] = [];
    const yellowAlerts: HealthFlow[] = [];

    healthFlows.forEach(flow => {
        const abnormalCount = countAbnormalVitalSigns(flow);
        if (abnormalCount >= 2) {
            redAlerts.push(flow); // Adiciona à lista de alertas vermelhos
            redCount += 1;
        } else if (abnormalCount === 1) {
            yellowAlerts.push(flow); // Adiciona à lista de alertas amarelos
            yellowCount += 1;
        }
    });

    // Função para abrir/fechar o dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Função para alternar o filtro
    const toggleFilter = (color: 'red' | 'yellow') => {
        setActiveFilters(prev => ({
            ...prev,
            [color]: !prev[color], // Altera o estado do filtro (ativo ou inativo)
        }));
    };

    const formatTimestamp = (timestamp: string) => {
        if (!timestamp) return "Tempo desconhecido";

        // Converte a string do timestamp para objeto Date
        const alertTime = new Date(timestamp);
        const currentTime = new Date();

        // Calcula a diferença em milissegundos
        const diffMs = currentTime.getTime() - alertTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);

        if (diffMinutes < 1) {
            return "Agora mesmo";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} min atrás`;
        } else {
            return `${diffHours} h atrás`;
        }
    };

    return (
        <header className="flex items-center justify-between p-4 shadow-md bg-emerald-200">
            <div className="flex items-center space-x-2">
                <p className="text-[#00bfae] text-4xl">+</p>
                <span className="text-xl font-bold text-gray-800">HealthFlow</span>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    title="Registrar Notificações"
                    className="relative rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    onClick={toggleDropdown} // Alterna o estado do dropdown
                >
                    <Bell className="h-6 w-6 text-gray-700" />
                    <div className="absolute -top-2 -right-2">
                        {redCount > 0 && activeFilters.red && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {redCount}
                            </span>
                        )}
                        {yellowCount > 0 && activeFilters.yellow && (
                            <span className="flex ml-2 h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                                {yellowCount}
                            </span>
                        )}
                    </div>
                </button>

                <button
                    onClick={() => router.push("/")}
                    title="Ir para Home"
                    className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                >
                    <Home className="h-6 w-6 text-gray-700" />
                </button>
            </div>

            {/* Dropdown de Notificações */}
            {isDropdownOpen && (
                <div className="absolute right-0 top-[50px] mt-2 w-full sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[550px] overflow-auto">
                    <div className="block px-4 py-2 font-medium text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                        Notificações
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="absolute top-0 ml-[190px] mt-6 flex justify-end gap-4">
                            <FaFaceDizzy
                                className={`w-6 h-6 ${activeFilters.red ? "text-red-600" : "text-gray-400"}`}
                                onClick={() => toggleFilter('red')}
                            />
                            <FaFaceFrownOpen
                                className={`w-6 h-6 ${activeFilters.yellow ? "text-yellow-500" : "text-gray-400"}`}
                                onClick={() => toggleFilter('yellow')}
                            />
                        </div>
                        <ul>
                            {activeFilters.red && redAlerts.map((flow) => (
                                <link href="#" key={flow.id} className="flex px-4 pt-4 border-b-[1px] border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="w-full ps-3">
                                        {flow.vitalData && (
                                            <div>
                                                <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                    <div className="flex justify-between">
                                                        <h2 className="font-bold flex gap-1">
                                                            <AiFillAlert size={16} color="red" style={{ marginTop: "2px" }} />
                                                            {flow.bedWard}
                                                        </h2>
                                                        <div className="flex gap-1">
                                                            <BsClockHistory className="w-[14px] h-[14px] text-blue-600" />
                                                            <strong className="text-xs text-blue-600 dark:text-blue-500">
                                                                {formatTimestamp(flow.vitalData[flow.vitalData.length - 1].timestamp)}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <p>
                                                        Paciente <span className="font-semibold text-gray-900">{flow.patientName}</span> em estado de choque
                                                    </p>
                                                    <div className="flex justify-around py-2">
                                                        <p>Quarto: {flow.bedRoom}</p>
                                                        <p>Leito: {flow.bedNumber}</p>
                                                    </div>
                                                    <div className="text-xs flex gap-2 mt-2">
                                                        <p>Responsáveis:</p>
                                                        <span className="flex gap-1">
                                                            <FaUserDoctor className="text-blue-500 w-3 h-3" />
                                                            {flow.doctorName}
                                                        </span>
                                                        <span className="flex gap-1">
                                                            <FaUserNurse className="text-green-500 w-3 h-3" />
                                                            {flow.nurseName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </link>
                            ))}
                        </ul>

                    </div>

                    <ul>
                        {activeFilters.yellow && yellowAlerts.map((flow) => (
                            <link href="#" key={flow.id} className="flex px-4 pt-4 border-b-[1px] border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="w-full ps-3">
                                    {flow.vitalData && (
                                        <div>
                                            <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                <div className="flex justify-between">
                                                    <h2 className="font-bold flex gap-1">
                                                        <AiFillAlert size={16} color="#f59e0b" style={{ marginTop: "2px" }} />
                                                        {flow.bedWard}
                                                    </h2>
                                                    <div className="flex gap-1">
                                                        <BsClockHistory className="w-[14px] h-[14px] text-blue-600" />
                                                        <strong className="text-xs text-blue-600 dark:text-blue-500">
                                                            {formatTimestamp(flow.vitalData[flow.vitalData.length - 1].timestamp)}
                                                        </strong>
                                                    </div>
                                                </div>
                                                <p>
                                                    Paciente <span className="font-semibold text-gray-900">{flow.patientName}</span> em alerta
                                                </p>
                                                <div className="flex justify-around py-2">
                                                    <p>Quarto: {flow.bedRoom}</p>
                                                    <p>Leito: {flow.bedNumber}</p>
                                                </div>
                                                <div className="text-xs flex gap-2 mt-2">
                                                    <p>Responsáveis:</p>
                                                    <span className="flex gap-1">
                                                        <FaUserDoctor className="text-blue-500 w-3 h-3" />
                                                        {flow.doctorName}
                                                    </span>
                                                    <span className="flex gap-1">
                                                        <FaUserNurse className="text-green-500 w-3 h-3" />
                                                        {flow.nurseName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </link>
                        ))}
                    </ul>

                    <link href="/" className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                        <div className="inline-flex items-center ">
                            <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                            </svg>
                            View all
                        </div>
                    </link>
                </div>
            )}
        </header>
    );
};

export default Header;
