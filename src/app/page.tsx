'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthFlows, HealthFlow, updateHealthFlowFirebase } from '@/reducer/healthflowReducer';
import { AppDispatch, RootState } from '@/store/store';
import { GiBubbles, GiHealthPotion, GiNurseMale } from 'react-icons/gi';
import { FaThermometerHalf, FaHeartbeat, FaLungs, FaUserNurse, FaRegCalendarAlt } from 'react-icons/fa';
import { FaRegClock, FaUserDoctor } from 'react-icons/fa6';
import { countAbnormalVitalSigns } from '@/utils/vitalSigns';
import { RiPulseLine } from 'react-icons/ri';
import { format } from 'date-fns/format';

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
        respiratoryRate: '',
        saturation: ''
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
            respiratoryRate: '',
            saturation: ''
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
                        saturation: parseInt(newVitalData.saturation),
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
        <div className="flex flex-col sm:flex-row flex-wrap p-4 mt-12 sm:mt-0">
            {healthFlows.map((flow: HealthFlow) => {
                // Chama a função para contar os sinais vitais anormais
                const abnormalCount = countAbnormalVitalSigns(flow);

                // Define a cor do bloco com base no abnormalCount
                let bgColor = 'bg-green-300';
                let textColor = 'text-green-800';
                let animate = '';
                let animateBorder = '';

                if (abnormalCount === 1) {
                    bgColor = 'bg-yellow-300';
                    textColor = 'text-yellow-800';
                    animate = 'animate-blink';
                } else if (abnormalCount >= 2) {
                    bgColor = 'bg-red-300';
                    textColor = 'text-red-800';
                    animateBorder = 'animate-border-blink';
                }

                return (
                    <div
                        key={`${flow.id}-${flow.doctorId}`}
                        className={`bg-white rounded-2xl shadow-md m-2 border-[1px] sm:w-[248px] ${animateBorder}`}
                        onClick={() => handleModalOpen(flow)} // Abrir o modal ao clicar no card
                    >
                        <div className="px-2 pt-2 rounded-t-2xl w-full sm:w-min-[250px]">
                            <div className="flex justify-between px-1 pt-1 border-b-2 border-black cursor-pointer">
                                <h3 className="text-xs font-semibold text-gray-500">Sinais Vitais</h3>
                                <h3 className="text-base font-semibold">{flow.patientName}</h3>
                            </div>
                            {flow.vitalData && (
                                // Exibir os dados vitais mais recentes
                                <div>
                                    <div className="flex justify-between text-sm px-1 py-2">
                                        <div className="flex flex-col gap-[2px]">
                                            <span><FaHeartbeat className="text-red-500 inline mr-1" /><strong>{flow.vitalData[flow.vitalData.length - 1].heartRate} bpm</strong></span>
                                            <span><FaLungs className="text-blue-500 inline mr-1" /><strong>{flow.vitalData[flow.vitalData.length - 1].respiratoryRate} mm</strong></span>
                                            <span><GiHealthPotion className="text-purple-500 inline mr-1" /><strong>{flow.vitalData[flow.vitalData.length - 1].bloodPressure} mmHg</strong></span>
                                        </div>
                                        <div className="flex flex-col gap-[2px]">
                                            <span><FaThermometerHalf className="text-yellow-500 inline mr-1" /><strong>{flow.vitalData[flow.vitalData.length - 1].temperature}°C</strong></span>
                                            <span><GiBubbles className="text-blue-600 inline mr-1" /><strong>{flow.vitalData[flow.vitalData.length - 1].saturation} %</strong></span>
                                            <span><RiPulseLine className="text-green-500 inline mr-1" /><strong>4 EN</strong></span>
                                        </div>
                                    </div>
                                    <div className="flex justify-around text-xs text-gray-500">
                                        <span>Última verificação:</span>
                                        <span className='flex items-center'>
                                            <FaRegCalendarAlt className="w-3 h-3 mx-1 text-gray-500" />
                                            {format(new Date(flow.vitalData[flow.vitalData.length - 1].timestamp), "dd/MM/yyyy")}
                                        </span>
                                        <span className='flex items-center'>
                                            <FaRegClock className="w-3 h-3 mx-1 text-gray-500" />
                                            {format(new Date(flow.vitalData[flow.vitalData.length - 1].timestamp), "HH:mm")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Mudar de cor este bloco conforme o resultado do abnormalCount */}
                        <div className={`${bgColor} ${animate}`}>
                            <div className={`flex justify-between items-center gap-8 ${bgColor} px-4 py-2`}>
                                <div>
                                    <span className={`text-xs text-green-800 ${textColor}`}>Ala</span>
                                    <h2 className={`text-lg text-center font-semibold ${textColor}`}>{flow.bedWard}</h2>
                                </div>
                                <div>
                                    <span className={`text-xs text-green-800 ${textColor}`}>Quarto</span>
                                    <h2 className={`text-lg text-center font-semibold ${textColor}`}>{flow.bedRoom}</h2>
                                </div>
                                <div>
                                    <span className={`text-xs text-green-800 ${textColor}`}>Leito</span>
                                    <h2 className={`text-lg text-center font-semibold ${textColor}`}>{flow.bedNumber}</h2>
                                </div>
                            </div>

                            <div className={`flex justify-between px-4 ${textColor}`}>
                                <span className="text-xs mb-1">{flow.patientAgeGroup}</span>
                                <span className="text-xs mb-1">{flow.patientDisease}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-gray-700 px-4 py-2">
                            <div className="flex gap-2 text-sm font-semibold">
                                <FaUserDoctor className="text-blue-500 w-5 h-5" />
                                <span className="truncate w-[15vw] sm:w-10">{flow.doctorName}</span>
                            </div>
                            <div className="flex gap-2 text-sm font-semibold">
                                <GiNurseMale className="text-green-600 w-5 h-5" />
                                <span className="truncate w-[15vw] sm:w-10">{flow.nurseName}</span>
                            </div>
                            <div className="flex gap-2 text-sm font-semibold">
                                <FaUserNurse className="text-emerald-400 w-5 h-5" />
                                <span className="truncate w-[15vw] sm:w-10">{flow.nurseName}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

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
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                                <input
                                    type="number"
                                    value={newVitalData.saturation}
                                    onChange={(e) => setNewVitalData({ ...newVitalData, saturation: e.target.value })}
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
