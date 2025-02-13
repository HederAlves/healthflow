'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { FaUserCircle } from 'react-icons/fa';
import { fetchPatients } from '@/reducer/patientReducer';

const PatientsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const patients = useSelector((state: RootState) => state.patient.patients);
    const loading = useSelector((state: RootState) => state.patient.loading);
    const error = useSelector((state: RootState) => state.patient.error);

    useEffect(() => {
        dispatch(fetchPatients());
    }, [dispatch]);

    return (
        <div className="mt-12 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Pacientes</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                    <div key={patient.id} className="flex justify-around bg-white shadow-md rounded-lg p-4">
                        <FaUserCircle size={50} color="#70748D" className='mt-3' />
                        <div>
                            <h2 className="text-xl font-semibold min-w- max-w-[12ch] truncate">{patient.name}</h2>
                            <p className="text-gray-500 min-w- max-w-[12ch] truncate">Doença: {patient.disease}</p>
                            <p className="text-gray-500">Faixa Etária: {patient.ageGroup}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientsPage;
