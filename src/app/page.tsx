'use client'

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthFlows } from '@/reducer/healthflowReducer';
import { AppDispatch, RootState } from '@/store/store';
import { GiHealthPotion } from 'react-icons/gi';
import { FaThermometerHalf, FaHeartbeat, FaLungs, FaUserNurse } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';

const HealthFlowList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { healthFlows, loading, error } = useSelector((state: RootState) => state.healthflow);

    useEffect(() => {
        dispatch(fetchHealthFlows());
    }, [dispatch]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar os dados: {error}</p>;

    return (
        <div className="p-4 flex">
            {healthFlows.map((flow) => (
                <div key={`${flow.id}-${flow.doctorId}`} className="bg-white rounded-2xl shadow-md m-2 w-[250px]">
                    <div className="p-2 rounded-t-2xl w-min-[250px]">
                        <div className="flex justify-between px-1 pt-1 border-b-2 border-black cursor-pointer">
                            <h3 className="text-xs font-semibold text-gray-500">Sinais Vitais</h3>
                            <h3 className="text-base font-semibold">{flow.patientName}</h3>
                        </div>
                        {flow.vitalData && flow.vitalData.length > 0 && (
                            <div className="flex justify-between text-sm px-1 py-2">
                                <div className="flex flex-col">
                                    <span><GiHealthPotion className="text-purple-500 inline mr-2" /><strong>{flow.vitalData[0].bloodPressure} mmHg</strong></span>
                                    <span><FaThermometerHalf className="text-yellow-500 inline mr-2" /><strong>{flow.vitalData[0].temperature}°C</strong></span>
                                </div>
                                <div className="flex flex-col">
                                    <span><FaHeartbeat className="text-red-500 inline mr-2" /><strong>{flow.vitalData[0].heartRate} bpm</strong></span>
                                    <span><FaLungs className="text-blue-500 inline mr-2" /><strong>{flow.vitalData[0].respiratoryRate} mm</strong></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between px-4">
                        <span className="text-xs mb-1">{flow.patientAgeGroup}</span>
                        <span className="text-xs mb-1">{flow.patientDisease}</span>
                    </div>
                    <div className="flex justify-between items-center gap-8 bg-green-300 px-4 py-2">
                        <div>
                            <span className="text-xs text-green-800">Ala</span>
                            <h2 className="text-lg font-semibold text-green-800">{flow.bedWard}</h2>
                        </div>
                        <div>
                            <span className="text-xs text-green-800">Quarto</span>
                            <h2 className="text-lg font-semibold text-green-800">{flow.bedRoom}</h2>
                        </div>
                        <div>
                            <span className="text-xs text-green-800">Leito</span>
                            <h2 className="text-lg font-semibold text-green-800">{flow.bedNumber}</h2>
                        </div>
                    </div>

                    <div className="flex justify-between text-gray-700 px-4 py-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <FaUserDoctor className="text-blue-500 w-5 h-5" />
                            {flow.doctorName}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <FaUserNurse className="text-green-500 w-5 h-5" />
                            {flow.nurseName}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HealthFlowList;
