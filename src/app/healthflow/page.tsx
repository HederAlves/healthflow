'use client'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Bed, fetchBeds } from "@/reducer/bedReducer";
import { Doctor, fetchDoctors } from "@/reducer/doctorReducer";
import { Nurse, fetchNurses } from "@/reducer/nurseReducer";
import { Patient, fetchPatients } from "@/reducer/patientReducer";
import { FaEdit, FaTrash } from "react-icons/fa";
import { createHealthFlow, deleteHealthFlowFirebase, fetchHealthFlows, HealthFlow, updateHealthFlowFirebase } from "@/reducer/healthflowReducer";

const HealthFlowForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const reduxHealthFlows = useSelector((state: RootState) => state.healthflow.healthFlows);

    // Buscando dados do Redux
    const beds = useSelector((state: any) => state.bed.beds);
    const doctors = useSelector((state: any) => state.doctor.doctors);
    const nurses = useSelector((state: any) => state.nurse.nurses);
    const patients = useSelector((state: any) => state.patient.patients);

    // Estado do formulário de cadastro
    const [formData, setFormData] = useState({
        patientId: "",
        bedId: "",
        doctorId: "",
        nurseId: "",
        vitalData: {
            temperature: 0,
            heartRate: 0,
            bloodPressure: "0/0",
            respiratoryRate: 0,
        },
    });

    // Estados para edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<HealthFlow | null>(null);

    // Estados para exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [healthFlowToDelete, setHealthFlowToDelete] = useState<string | null>(null);

    // Carrega os dados quando o componente é montado
    useEffect(() => {
        dispatch(fetchBeds());
        dispatch(fetchDoctors());
        dispatch(fetchNurses());
        dispatch(fetchPatients());
        dispatch(fetchHealthFlows());
    }, [dispatch]);

    // Atualiza os dados do formulário de cadastro
    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        // Se for um campo numérico, converte para número
        setFormData(prev => ({
            ...prev,
            [name]: name.startsWith("vitalData.")
                ? { ...prev.vitalData, [name.split(".")[1]]: Number(value) }
                : value
        }));
    };

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('vitalData.')) {
            const field = name.split('.')[1];

            // Tratamento específico para pressão arterial, pois é uma string
            if (field === 'bloodPressure') {
                setFormData((prevState) => ({
                    ...prevState,
                    vitalData: {
                        ...prevState.vitalData,
                        [field]: value, // Valor direto para bloodPressure
                    }
                }));
            } else {
                // Para os campos numéricos, converte para número
                setFormData((prevState) => ({
                    ...prevState,
                    vitalData: {
                        ...prevState.vitalData,
                        [field]: Number(value),
                    }
                }));
            }
        }
    };

    // Salva um novo fluxo de saúde na lista
    const handleSave = () => {
        // Verifica se todos os campos foram preenchidos
        if (
            !formData.patientId ||
            !formData.bedId ||
            !formData.doctorId ||
            !formData.nurseId
        ) {
            alert("Preencha todos os campos.");
            return;
        }

        const newHealthFlowData = {
            ...formData,
            createdAt: new Date().toISOString(),
            vitalData: [
                {
                    temperature: formData.vitalData.temperature,
                    heartRate: formData.vitalData.heartRate,
                    respiratoryRate: formData.vitalData.respiratoryRate,
                    bloodPressure: formData.vitalData.bloodPressure,
                }
            ]
        };

        dispatch(createHealthFlow(newHealthFlowData));

        // Limpa o formulário
        setFormData({
            patientId: "",
            bedId: "",
            doctorId: "",
            nurseId: "",
            vitalData: {
                heartRate: 0,
                bloodPressure: "0/0",
                respiratoryRate: 0,
                temperature: 0
            },
        });
    };

    // Abre o modal de edição com os dados do fluxo selecionado
    const handleEdit = (id: string) => {
        const healthFlow = reduxHealthFlows.find((hf) => hf.id === id);
        console.log('Fluxo selecionado para edição:', healthFlow);
        if (healthFlow) {
            setEditFormData(healthFlow);
            setIsEditModalOpen(true);
        }
    };

    // Atualiza os dados do formulário de edição
    const handleEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (editFormData) {
            setEditFormData({
                ...editFormData,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Atualiza o registro editado na lista
    const handleUpdate = () => {
        if (editFormData) {
            dispatch(updateHealthFlowFirebase(editFormData));
            setIsEditModalOpen(false);
        }
    };

    // Abre o modal de exclusão
    const handleDelete = (id: string) => {
        setHealthFlowToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Confirma a exclusão do registro
    const confirmDelete = () => {
        if (healthFlowToDelete) {
            dispatch(deleteHealthFlowFirebase(healthFlowToDelete));
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setHealthFlowToDelete(null);
    };

    // Funções auxiliares para exibir as informações com base no id
    const getPatientName = (id: string) => {
        const patient = patients.find((p: Patient) => p.id === id);
        return patient ? patient.name : "";
    };

    const getBedInfo = (id: string) => {
        const bed = beds.find((b: Bed) => b.id === id);
        return bed ? `${bed.number} - ${bed.ward}` : "";
    };

    const getDoctorInfo = (id: string) => {
        const doctor = doctors.find((d: Doctor) => d.id === id);
        return doctor ? `${doctor.name} - ${doctor.specialty}` : "";
    };

    const getNurseInfo = (id: string) => {
        const nurse = nurses.find((n: Nurse) => n.id === id);
        return nurse ? `${nurse.name} - ${nurse.specialty}` : "";
    };

    // Opções para os selects (utilizando os dados do Redux)
    const patientOptions = patients.map((patient: Patient) => (
        <option key={patient.id} value={patient.id}>
            {patient.name}
        </option>
    ));

    const bedOptions = beds.map((bed: Bed) => (
        <option key={bed.id} value={bed.id}>
            {bed.number} - {bed.ward}
        </option>
    ));

    const doctorOptions = doctors.map((doctor: Doctor) => (
        <option key={doctor.id} value={doctor.id}>
            {doctor.name} - {doctor.specialty}
        </option>
    ));

    const nurseOptions = nurses.map((nurse: Nurse) => (
        <option key={nurse.id} value={nurse.id}>
            {nurse.name} - {nurse.specialty}
        </option>
    ));

    return (
        <div className="w-full p-4">
            <div className="flex justify-stretch">
                <h1 className="text-xl font-bold mb-4 ml-40">Cadastro de Fluxo de Saúde</h1>
                <h1 className="text-xl font-bold mb-4">Dados Vitais</h1>
            </div>

            {/* Formulário de Cadastro */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <form className="space-y-4">
                    <div className="flex justify-around">
                        <div>
                            <div className="mb-4">
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                                    Paciente
                                </label>
                                <select
                                    id="patientId"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChangeSelect}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Selecione um paciente</option>
                                    {patientOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bedId" className="block text-sm font-medium text-gray-700">
                                    Leito
                                </label>
                                <select
                                    id="bedId"
                                    name="bedId"
                                    value={formData.bedId}
                                    onChange={handleChangeSelect}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Selecione um leito</option>
                                    {bedOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                                    Médico
                                </label>
                                <select
                                    id="doctorId"
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChangeSelect}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Selecione um médico</option>
                                    {doctorOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">
                                    Enfermeiro
                                </label>
                                <select
                                    id="nurseId"
                                    name="nurseId"
                                    value={formData.nurseId}
                                    onChange={handleChangeSelect}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">Selecione um enfermeiro</option>
                                    {nurseOptions}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                                    Temperatura
                                </label>
                                <input
                                    id="temperature"
                                    name="vitalData.temperature"
                                    type="number"
                                    value={formData.vitalData.temperature}
                                    onChange={handleChangeInput}
                                    className="w-full px-3 py-[6px] border rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                                    Frequência Cardíaca
                                </label>
                                <input
                                    id="heartRate"
                                    name="vitalData.heartRate"
                                    type="number"
                                    value={formData.vitalData.heartRate}
                                    onChange={handleChangeInput}
                                    className="w-full px-3 py-[6px] border rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
                                    Frequência Respiratória
                                </label>
                                <input
                                    id="respiratoryRate"
                                    name="vitalData.respiratoryRate"
                                    type="number"
                                    value={formData.vitalData.respiratoryRate}
                                    onChange={handleChangeInput}
                                    className="w-full px-3 py-[6px] border rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
                                    Pressão Arterial
                                </label>
                                <input
                                    id="bloodPressure"
                                    name="vitalData.bloodPressure"
                                    type="text"
                                    value={formData.vitalData.bloodPressure}
                                    onChange={handleChangeInput}
                                    className="w-full px-3 py-[6px] border rounded-lg"
                                />
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-[72%] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Adicionar Fluxo de Saúde
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabela de Fluxos de Saúde */}
            <div className="border border-gray-300 rounded-lg px-3 py-4 w-full mt-4">
                <h3 className='font-semibold px-3 mb-2'>Fluxos de Saúde Cadastrados</h3>
                <div className="overflow-x-scroll sm:overflow-hidden min-w-full">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="text-sm px-4 py-2 border-b text-start">Paciente</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Leito</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Médico</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Enfermeiro</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reduxHealthFlows.map((healthFlow) => (
                                <tr key={healthFlow.id}>
                                    <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{getPatientName(healthFlow.patientId)}</td>
                                    <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{getBedInfo(healthFlow.bedId)}</td>
                                    <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{getDoctorInfo(healthFlow.doctorId)}</td>
                                    <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{getNurseInfo(healthFlow.nurseId)}</td>
                                    <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">
                                        <button
                                            onClick={() => handleEdit(healthFlow.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(healthFlow.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edição */}
            {isEditModalOpen && editFormData && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Editar Fluxo de Saúde</h2>
                        <form className="space-y-4">
                            <div className="mb-4">
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                                    Paciente
                                </label>
                                <select
                                    id="patientId"
                                    name="patientId"
                                    value={editFormData.patientId}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Selecione um paciente</option>
                                    {patientOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bedId" className="block text-sm font-medium text-gray-700">
                                    Leito
                                </label>
                                <select
                                    id="bedId"
                                    name="bedId"
                                    value={editFormData.bedId}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Selecione um leito</option>
                                    {bedOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                                    Médico
                                </label>
                                <select
                                    id="doctorId"
                                    name="doctorId"
                                    value={editFormData.doctorId}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Selecione um médico</option>
                                    {doctorOptions}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">
                                    Enfermeiro
                                </label>
                                <select
                                    id="nurseId"
                                    name="nurseId"
                                    value={editFormData.nurseId}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">Selecione um enfermeiro</option>
                                    {nurseOptions}
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Atualizar Fluxo de Saúde
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Exclusão */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                        <p className="mb-4">Tem certeza que deseja excluir este fluxo de saúde?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Excluir
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthFlowForm;
