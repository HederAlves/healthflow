'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { FaUserNurse } from 'react-icons/fa';
import { fetchNurses } from '@/reducer/nurseReducer';
import { Mail, Phone } from 'lucide-react';

const NursesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const nurses = useSelector((state: RootState) => state.nurse.nurses);
    const loading = useSelector((state: RootState) => state.nurse.loading);
    const error = useSelector((state: RootState) => state.nurse.error);

    useEffect(() => {
        dispatch(fetchNurses());
    }, [dispatch]);

    return (
        <div className="mt-12 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Enfermeiros</h1>

            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nurses.map((nurse) => (
                    <div key={nurse.id} className="bg-white shadow-md rounded-lg p-4">
                        <div className='flex justify-start gap-4'>
                            <FaUserNurse size={50} color="#70748D" className='mt-6' />
                            <div>
                                <h2 className="text-xl font-semibold min-w- max-w-[14ch] truncate mb-2">{nurse.name}</h2>
                                <div className='flex justify-start gap-2'>
                                    <Mail size={20} color="gray" />
                                    <p className="text-gray-500 min-w- max-w-[12ch] truncate">{nurse.email}</p>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <Phone size={20} color="gray" />
                                    <p className="text-gray-500 min-w- max-w-[18ch] truncate"> {nurse.phone}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 min-w- max-w-[120ch] truncate mt-2">Especialidade: {nurse.specialty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NursesPage;
