'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchBeds } from '@/reducer/bedReducer';
import { FaBed } from 'react-icons/fa6';

const BedsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const beds = useSelector((state: RootState) => state.bed.beds);
    const loading = useSelector((state: RootState) => state.bed.loading);
    const error = useSelector((state: RootState) => state.bed.error);

    useEffect(() => {
        dispatch(fetchBeds());
    }, [dispatch]);

    return (
        <div className="mt-12 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Leitos</h1>

            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {beds.map((bed) => (
                    <div key={bed.id} className="bg-white shadow-md rounded-lg p-4">
                        <div className='flex justify-start gap-4'>
                            <div>
                                <FaBed size={50} color="#70748D" className='mt-4 ' />
                                <p className={`mt-2 font-semibold ${bed.status ? 'text-red-500' : 'text-green-500'}`}>
                                    {bed.status ? 'Ocupado' : 'Disponível'}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2 min-w- max-w-[16ch] truncate">{bed.number}</h2>
                                <p className="text-gray-500 min-w- max-w-[18ch] truncate">Ala: {bed.ward}</p>
                                <p className="text-gray-500 min-w- max-w-[18ch] truncate">Quarto: {bed.room}</p>
                                <p className="text-gray-500 min-w- max-w-[18ch] truncate">Corredor: {bed.corridor}</p>
                                <p className="text-gray-500 min-w- max-w-[18ch] truncate">Andar: {bed.floor}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BedsPage;
