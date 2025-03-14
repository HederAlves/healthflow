'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthFlows, HealthFlow, updateHealthFlowFirebase } from '@/reducer/healthflowReducer';
import { AppDispatch, RootState } from '@/store/store';
import { GiHealthPotion } from 'react-icons/gi';
import { FaThermometerHalf, FaHeartbeat, FaLungs, FaUserNurse } from 'react-icons/fa';
import { FaUserDoctor } from 'react-icons/fa6';

export type AgeGroup = 'bebê' | 'criança' | 'adulto' | 'idoso';

const HealthFlowList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { healthFlows, loading, error } = useSelector((state: RootState) => state.healthflow);

    // Estado do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlow, setSelectedFlow] = useState<HealthFlow | null>(null);
    const [newVitalData, setNewVitalData] = useState({
        temperature: '',
        heartRate: '',
        bloodPressure: '',
        respiratoryRate: ''
    });

    useEffect(() => {
        dispatch(fetchHealthFlows());
    }, [dispatch]);

    const handleModalOpen = (flow: HealthFlow) => {
        setSelectedFlow(flow);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFlow(null);
        setNewVitalData({
            temperature: '',
            heartRate: '',
            bloodPressure: '',
            respiratoryRate: ''
        });
    };

    const handleSubmit = () => {
        if (selectedFlow) {
            const updatedFlow = {
                ...selectedFlow,
                vitalData: [
                    ...(selectedFlow.vitalData || []), // Adiciona os dados vitais existentes
                    {
                        temperature: parseFloat(newVitalData.temperature),
                        heartRate: parseInt(newVitalData.heartRate),
                        bloodPressure: newVitalData.bloodPressure,
                        respiratoryRate: parseInt(newVitalData.respiratoryRate),
                        timestamp: new Date().toISOString(),
                    }
                ]
            };

            // Enviar os dados para o Firebase (atualizando os dados vitais)
            dispatch(updateHealthFlowFirebase(updatedFlow));
            handleModalClose();
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar os dados: {error}</p>;

    return (
        <div className="flex flex-col xl:flex-row flex-wrap p-4 mt-12 sm:mt-0">
            {healthFlows.map((flow: HealthFlow) => (

                <div
                    key={`${flow.id}-${flow.doctorId}`}
                    className="bg-white rounded-2xl shadow-md m-2 w-[244px]"
                    onClick={() => handleModalOpen(flow)} // Abrir o modal ao clicar no card
                >
                    <div className="p-2 rounded-t-2xl w-min-[250px]">
                        <div className="flex justify-between px-1 pt-1 border-b-2 border-black cursor-pointer">
                            <h3 className="text-xs font-semibold text-gray-500">Sinais Vitais</h3>
                            <h3 className="text-base font-semibold">{flow.patientName}</h3>
                        </div>
                        {flow.vitalData && (
                            // Exibir os dados vitais mais recentes
                            <div className="flex justify-between text-sm px-1 py-2">
                                <div className="flex flex-col">
                                    <span><GiHealthPotion className="text-purple-500 inline mr-2" /><strong>{flow.vitalData[flow.vitalData.length - 1].bloodPressure} mmHg</strong></span>
                                    <span><FaThermometerHalf className="text-yellow-500 inline mr-2" /><strong>{flow.vitalData[flow.vitalData.length - 1].temperature}°C</strong></span>
                                </div>
                                <div className="flex flex-col">
                                    <span><FaHeartbeat className="text-red-500 inline mr-2" /><strong>{flow.vitalData[flow.vitalData.length - 1].heartRate} bpm</strong></span>
                                    <span><FaLungs className="text-blue-500 inline mr-2" /><strong>{flow.vitalData[flow.vitalData.length - 1].respiratoryRate} mm</strong></span>
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

            {/* Modal de Adição de Dados Vitais */}
            {isModalOpen && selectedFlow && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Adicionar Dados Vitais</h3>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Temperatura (°C)</label>
                                <input
                                    type="number"
                                    value={newVitalData.temperature}
                                    onChange={(e) => setNewVitalData({ ...newVitalData, temperature: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Batimento Cardíaco (bpm)</label>
                                <input
                                    type="number"
                                    value={newVitalData.heartRate}
                                    onChange={(e) => setNewVitalData({ ...newVitalData, heartRate: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Pressão Arterial</label>
                                <input
                                    type="text"
                                    value={newVitalData.bloodPressure}
                                    onChange={(e) => setNewVitalData({ ...newVitalData, bloodPressure: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Frequência Respiratória (mm)</label>
                                <input
                                    type="number"
                                    value={newVitalData.respiratoryRate}
                                    onChange={(e) => setNewVitalData({ ...newVitalData, respiratoryRate: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthFlowList;
