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

    const vitalSignsReference: {
        [key in AgeGroup]: {
            heartRate: number[];
            respiratoryRate: number[];
            bloodPressure: number[] | null;
            temperature: number[];
        };
    } = {
        bebê: { heartRate: [100, 160], respiratoryRate: [30, 60], bloodPressure: [110, 75], temperature: [36.1, 37.2] },
        criança: { heartRate: [80, 120], respiratoryRate: [20, 30], bloodPressure: [120, 80], temperature: [36.1, 37.2] },
        adulto: { heartRate: [60, 100], respiratoryRate: [12, 20], bloodPressure: [139, 89], temperature: [36.1, 37.2] },
        idoso: { heartRate: [45, 90], respiratoryRate: [16, 25], bloodPressure: null, temperature: [36.1, 37.2] },
    };

    function countAbnormalVitalSigns(flow: HealthFlow) {
        const patientAgeGroup = flow.patientAgeGroup;
        const patientGender = flow.patientGender;

        if (!patientAgeGroup || !vitalSignsReference.hasOwnProperty(patientAgeGroup)) {
            console.error(`Idade do paciente '${patientAgeGroup}' não é válida ou não encontrada.`);
            return 0;
        }

        // Obtendo os sinais vitais de referência
        const vitalSigns = vitalSignsReference[patientAgeGroup];
        console.log(`Sinais vitais de referência para ${patientAgeGroup}:`, vitalSigns);

        // Ajustar pressão arterial para idosos
        let bloodPressureReference = vitalSigns.bloodPressure;
        if (patientAgeGroup === "idoso") {
            const originalBloodPressure = bloodPressureReference;
            bloodPressureReference = patientGender === "mulher" ? [134, 84] : [135, 88];
            console.log(`Pressão arterial ajustada para idoso (${patientGender}): de ${originalBloodPressure} para ${bloodPressureReference}`);
        }

        if (!flow.vitalData || flow.vitalData.length === 0) {
            console.log("Nenhum dado vital encontrado para este paciente.");
            return 0;
        }

        // Pega os últimos dados vitais
        const lastVitalData = flow.vitalData[flow.vitalData.length - 1];
        console.log(`Últimos dados vitais para ${patientAgeGroup}:`, lastVitalData);

        // Convertendo a pressão arterial (caso venha no formato "120/80")
        let bloodPressureArray: number[] = [];
        if (typeof lastVitalData.bloodPressure === "string") {
            const splitBP = lastVitalData.bloodPressure.split("/").map(bp => parseInt(bp.trim(), 10));
            if (splitBP.length === 2 && !isNaN(splitBP[0]) && !isNaN(splitBP[1])) {
                bloodPressureArray = splitBP;
                console.log(`Pressão arterial convertida: ${bloodPressureArray}`);
            }
        }

        let abnormalCount = 0;

        // Verifica frequência cardíaca (agora dentro do intervalo permitido)
        if (lastVitalData.heartRate < vitalSigns.heartRate[0] || lastVitalData.heartRate > vitalSigns.heartRate[1]) {
            console.log(`Frequência cardíaca alterada: ${lastVitalData.heartRate} (esperado: ${vitalSigns.heartRate[0]}-${vitalSigns.heartRate[1]})`);
            abnormalCount++;
        }

        // Verifica frequência respiratória (agora dentro do intervalo permitido)
        if (lastVitalData.respiratoryRate < vitalSigns.respiratoryRate[0] || lastVitalData.respiratoryRate > vitalSigns.respiratoryRate[1]) {
            console.log(`Frequência respiratória alterada: ${lastVitalData.respiratoryRate} (esperado: ${vitalSigns.respiratoryRate[0]}-${vitalSigns.respiratoryRate[1]})`);
            abnormalCount++;
        }

        // Verifica temperatura (agora dentro do intervalo permitido)
        if (lastVitalData.temperature < vitalSigns.temperature[0] || lastVitalData.temperature > vitalSigns.temperature[1]) {
            console.log(`Temperatura alterada: ${lastVitalData.temperature} (esperado: ${vitalSigns.temperature[0]}-${vitalSigns.temperature[1]})`);
            abnormalCount++;
        }

        // Verifica pressão arterial (agora verifica individualmente sistólica e diastólica)
        if (bloodPressureArray.length === 2 && bloodPressureReference) {
            const [systolic, diastolic] = bloodPressureArray;
            const [systolicRef, diastolicRef] = bloodPressureReference;

            let message = "Pressão alterada:";
            let isAbnormal = false;

            if (systolic > systolicRef) {
                message += ` Sistólica ${systolic} (esperado: ${systolicRef})`;
                isAbnormal = true;
            }

            if (diastolic > diastolicRef) {
                message += ` Diastólica ${diastolic} (esperado: ${diastolicRef})`;
                isAbnormal = true;
            }

            if (isAbnormal) {
                console.log(message);
                abnormalCount++;
            }
        }


        return abnormalCount;
    }

    // Teste para cada paciente
    healthFlows.forEach(flow => {
        console.log(`Paciente: ${flow.patientAgeGroup} - Alterações encontradas: ${countAbnormalVitalSigns(flow)}`);
    });

    return (
        <div className="p-4 mt-12">
            {healthFlows.map((flow: HealthFlow) => (

                <div
                    key={`${flow.id}-${flow.doctorId}`}
                    className="bg-white rounded-2xl shadow-md m-2 w-[250px]"
                    onClick={() => handleModalOpen(flow)}
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
