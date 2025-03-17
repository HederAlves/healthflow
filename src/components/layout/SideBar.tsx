'use client'

import { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div>
            {/* Sidebar Desktop */}
            <div className="min-h-full w-[260px] h-screen hidden md:block  bg-gray-800 text-white">
                <div className="p-5">
                    <nav className="mt-5">
                        <ul>
                            <li>
                                <Link href="/" className="block py-2 px-4 hover:bg-gray-600 rounded">Home</Link>
                            </li>
                            <li>
                                <Link href="/healthflow" className="block py-2 px-4 hover:bg-gray-600 rounded">Healthflow</Link>
                            </li>
                            <li>
                                <Link href="/patients" className="block py-2 px-4 hover:bg-gray-600 rounded">Pacientes</Link>
                            </li>
                            <li>
                                <Link href="/doctors" className="block py-2 px-4 hover:bg-gray-600 rounded">Médicos</Link>
                            </li>
                            <li>
                                <Link href="/nurses" className="block py-2 px-4 hover:bg-gray-600 rounded">Enfermeiros</Link>
                            </li>
                            <li>
                                <Link href="/beds" className="block py-2 px-4 hover:bg-gray-600 rounded">Leitos</Link>
                            </li>
                            {/* Dropdown para Cadastro */}
                            <li>
                                <button
                                    onClick={toggleDropdown}
                                    className="block py-2 px-4 hover:bg-gray-600 rounded w-full text-left"
                                >
                                    Gerenciar
                                </button>
                                {isDropdownOpen && (
                                    <ul className="ml-4 mt-2 bg-gray-700 rounded">
                                        <li>
                                            <Link href="/manager/doctor" className="block py-2 px-4 hover:bg-gray-600 rounded">Médico</Link>
                                        </li>
                                        <li>
                                            <Link href="/manager/nurse" className="block py-2 px-4 hover:bg-gray-600 rounded">Enfermeiro</Link>
                                        </li>
                                        <li>
                                            <Link href="/manager/patient" className="block py-2 px-4 hover:bg-gray-600 rounded">Paciente</Link>
                                        </li>
                                        <li>
                                            <Link href="/manager/bed" className="block py-2 px-4 hover:bg-gray-600 rounded">Leito</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Menu Hambúrguer (Mobile & Tablet) */}
            <div className="md:hidden absolute w-full lg:w-[350px] z-30">
                <button
                    onClick={toggleSidebar}
                    className="p-4 text-white bg-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {isOpen && (

                    <div className="absolute left-0 top-0 bg-gray-800 text-white flex flex-col p-5 w-1/2">
                        <button
                            onClick={toggleSidebar}
                            className="p-4 text-white bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <nav className="mt-5">
                            <ul>
                                <li>
                                    <Link href="/" className="block py-2 px-4 hover:bg-gray-600 rounded">Home</Link>
                                </li>
                                <li>
                                    <Link href="/healthflow" className="block py-2 px-4 hover:bg-gray-600 rounded">Healthflow</Link>
                                </li>
                                <li>
                                    <Link href="/patients" onClick={closeSidebar} className="block py-2 px-4 hover:bg-gray-600 rounded">Patients</Link>
                                </li>
                                <li>
                                    <Link href="/doctors" onClick={closeSidebar} className="block py-2 px-4 hover:bg-gray-600 rounded">Doctor</Link>
                                </li>
                                <li>
                                    <Link href="/nurses" onClick={closeSidebar} className="block py-2 px-4 hover:bg-gray-600 rounded">Nurse</Link>
                                </li>
                                <li>
                                    <Link href="/beds" onClick={closeSidebar} className="block py-2 px-4 hover:bg-gray-600 rounded">Bed</Link>
                                </li>
                                {/* Dropdown para Cadastro */}
                                <li>
                                    <button
                                        onClick={toggleDropdown}
                                        className="block py-2 px-4 hover:bg-gray-600 rounded w-full text-left"
                                    >
                                        Gerenciar
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="ml-4 mt-2 bg-gray-700 rounded">
                                            <li>
                                                <Link href="/manager/doctor" onClick={closeSidebar} className="block py-2 px-[10px] hover:bg-gray-600 rounded">Médico</Link>
                                            </li>
                                            <li>
                                                <Link href="/manager/nurse" onClick={closeSidebar} className="block py-2 px-[10px] hover:bg-gray-600 rounded">Enfermeiro</Link>
                                            </li>
                                            <li>
                                                <Link href="/manager/patient" onClick={closeSidebar} className="block py-2 px-[10px] hover:bg-gray-600 rounded">Paciente</Link>
                                            </li>
                                            <li>
                                                <Link href="/manager/bed" onClick={closeSidebar} className="block py-2 px-[10px] hover:bg-gray-600 rounded">Leito</Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
