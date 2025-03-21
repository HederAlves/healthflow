'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiChatAlt2 } from 'react-icons/hi';
import { IoMdArrowBack } from 'react-icons/io';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDoctors } from '@/reducer/doctorReducer';
import { fetchNurses } from '@/reducer/nurseReducer';

export default function Layout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const doctors = useSelector((state: RootState) => state.doctor.doctors);
    const nurses = useSelector((state: RootState) => state.nurse.nurses);
    const [selectedPerson, setSelectedPerson] = useState<{ id: string; name: string } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    React.useEffect(() => {
        dispatch(fetchDoctors());
        dispatch(fetchNurses());
    }, [dispatch]);

    const handleSendMessage = () => {
        setSuccessMessage(`Mensagem enviada para 
            ${selectedPerson?.name?.slice(0, 12) ?? ""}`);
        setSelectedPerson(null);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    return (
        <div className="flex h-full relative overflow-hidden">
            {successMessage && (
                <div className="fixed bottom-2 w-screen bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50 transition-opacity duration-300 truncate">
                    {successMessage}
                </div>
            )}

            <button
                className="lg:hidden fixed bottom-3 right-3 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50"
                onClick={() => setSuccessMessage('Mensagem enviada')}
            >
                <HiChatAlt2 size={24} />
            </button>

            <div className="flex-1 p-1 w-70">{children}</div>

            {/* Sidebar */}
            <aside className="lg:relative hidden lg:block fixed top-0 right-0 h-full w-[220px] sm:w-[200px] bg-white shadow-lg border-l border-gray-200 p-4 flex-col z-40 sm:z-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Mensageiro</h2>
                    <button
                        className="lg:hidden p-2 rounded-full hover:bg-gray-200"
                        onClick={() => setSuccessMessage('Fechando sidebar')}
                    >
                        <IoMdArrowBack size={20} />
                    </button>
                </div>

                <div>
                    <h3 className="text-md font-semibold mb-2 text-gray-700">Médicos</h3>
                    <ul className="space-y-3 mb-4">
                        {doctors.map((person) => (
                            <li
                                key={person.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                onClick={() => setSelectedPerson(person)}
                            >
                                <div className="min-w-3 h-3 rounded-full bg-green-500" />
                                <p className="text-sm font-medium max-w-[16ch] truncate">Dr. {person.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-md font-semibold mb-2 text-gray-700">Enfermeiros</h3>
                    <ul className="space-y-3">
                        {nurses.map((person) => (
                            <li
                                key={person.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                onClick={() => setSelectedPerson(person)}
                            >
                                <div className="min-w-3 h-3 rounded-full bg-green-500" />
                                <p className="text-sm font-medium max-w-[16ch] truncate">Enf. {person.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {selectedPerson && (
                <div className="p-2 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-base mb-1">Enviar mensagem para:</h2>
                        <h2 className="text-lg font-semibold mb-4 max-w-[20ch] truncate text-green-500">{selectedPerson.name}</h2>
                        <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Digite sua mensagem..."></textarea>
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setSelectedPerson(null)}>Cancelar</button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSendMessage}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
