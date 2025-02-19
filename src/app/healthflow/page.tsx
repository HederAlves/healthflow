'use client'

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Bed, fetchBeds } from "@/reducer/bedReducer";
import { Doctor, fetchDoctors } from "@/reducer/doctorReducer";
import { Nurse, fetchNurses } from "@/reducer/nurseReducer";
import { Patient, fetchPatients } from "@/reducer/patientReducer";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchHealthFlows, HealthFlow } from "@/reducer/healthflowReducer";

const HealFlowForm = () => {
    const dispatch = useDispatch<AppDispatch>();

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
    });

    // Lista local de fluxos cadastrados
    const [HealthFlow, setHealFlows] = useState<HealthFlow[]>([]);

    // Estados para edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<HealthFlow | null>(null);

    // Estados para exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [healFlowToDelete, setHealFlowToDelete] = useState<string | null>(null);

    // Carrega os dados quando o componente é montado
    useEffect(() => {
        dispatch(fetchBeds());
        dispatch(fetchDoctors());
        dispatch(fetchNurses());
        dispatch(fetchPatients());
        dispatch(fetchHealthFlows());
    }, [dispatch]);

    // Atualiza os dados do formulário de cadastro
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

        const newHealFlow: HealthFlow = {
            id: String(Date.now()),
            ...formData,
            createdAt: ""
        };

        setHealFlows([...HealthFlow, newHealFlow]);

        // Limpa o formulário
        setFormData({
            patientId: "",
            bedId: "",
            doctorId: "",
            nurseId: "",
        });
    };

    // Abre o modal de edição com os dados do fluxo selecionado
    const handleEdit = (id: string) => {
        const healFlow = HealthFlow.find((hf) => hf.id === id);
        if (healFlow) {
            setEditFormData(healFlow);
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
            setHealFlows(
                HealthFlow.map((hf) =>
                    hf.id === editFormData.id ? editFormData : hf
                )
            );
            setIsEditModalOpen(false);
        }
    };

    // Abre o modal de exclusão
    const handleDelete = (id: string) => {
        setHealFlowToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Confirma a exclusão do registro
    const confirmDelete = () => {
        if (healFlowToDelete) {
            setHealFlows(HealthFlow.filter((hf) => hf.id !== healFlowToDelete));
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setHealFlowToDelete(null);
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
            <h1 className="text-xl font-bold mb-4">Cadastro de Fluxo de Saúde</h1>

            {/* Formulário de Cadastro */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <form className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                            Paciente
                        </label>
                        <select
                            id="patientId"
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Selecione um enfermeiro</option>
                            {nurseOptions}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Adicionar Fluxo de Saúde
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabela de Fluxos de Saúde */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">Fluxos de Saúde Cadastrados</h2>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Paciente</th>
                            <th className="px-4 py-2">Leito</th>
                            <th className="px-4 py-2">Médico</th>
                            <th className="px-4 py-2">Enfermeiro</th>
                            <th className="px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {HealthFlow.map((healFlow) => (
                            <tr key={healFlow.id}>
                                <td className="px-4 py-2">{getPatientName(healFlow.patientId)}</td>
                                <td className="px-4 py-2">{getBedInfo(healFlow.bedId)}</td>
                                <td className="px-4 py-2">{getDoctorInfo(healFlow.doctorId)}</td>
                                <td className="px-4 py-2">{getNurseInfo(healFlow.nurseId)}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(healFlow.id)}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(healFlow.id)}
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

export default HealFlowForm;
