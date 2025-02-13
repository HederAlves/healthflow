'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setDoctors } from '@/reducer/doctorReducer';
import { db } from '@/lib/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { Doctor } from '@/reducer/doctorReducer';
import { FaUserDoctor } from 'react-icons/fa6';
import { Mail, Phone } from 'lucide-react';

const DoctorsPage = () => {
    const dispatch = useDispatch();
    const doctors = useSelector((state: RootState) => state.doctor.doctors);
    const loading = useSelector((state: RootState) => state.doctor.loading);
    const error = useSelector((state: RootState) => state.doctor.error);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'doctors'));
                const doctorsList: Doctor[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Doctor[];
                dispatch(setDoctors(doctorsList));
            } catch (error) {
                console.error('Error fetching doctors: ', error);
            }
        };

        fetchDoctors();
    }, [dispatch]);

    return (
        <div className="mt-12 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Médicos</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white shadow-md rounded-lg p-4">
                        <div className='flex justify-start gap-4'>
                            <FaUserDoctor size={50} color="#70748D" className='mt-6' />
                            <div>
                                <h2 className="text-xl font-semibold min-w- max-w-[14ch] truncate mb-2">{doctor.name}</h2>
                                <div className='flex justify-start gap-2'>
                                    <Mail size={20} color="gray" />
                                    <p className="text-gray-500 min-w- max-w-[12ch] truncate">{doctor.email}</p>
                                </div>
                                <div className='flex justify-start gap-2'>
                                    <Phone size={20} color="gray" />
                                    <p className="text-gray-500 min-w- max-w-[14ch] truncate"> {doctor.phone}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 min-w- max-w-[120ch] truncate mt-2">Especialidade: {doctor.specialty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorsPage;
