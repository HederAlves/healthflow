'use client'

import { createPatient, deletePatient, fetchPatients, Patient, updatePatient } from '@/reducer/patientReducer';
import { AppDispatch } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';

const PatientForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Estado para dados do formulário de criação
    const [createFormData, setCreateFormData] = useState({
        name: '',
        disease: '',
        ageGroup: '',
        patientGender: ''
    });

    // Estado para dados do formulário de edição
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        disease: '',
        ageGroup: '',
        patientGender: ''
    });

    // Estado para controlar a visibilidade do modal de edição
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para controlar a visibilidade do modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

    // Estado para breadcrumb de sucesso de criação e atualização
    const [createSuccess, setCreateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [ageRange, setAgeRange] = useState('');
    const [genderRange, setGenderRange] = useState('');
    // Usando useSelector para acessar a lista de pacientes do estado global
    const patients = useSelector((state: any) => state.patient.patients);

    useEffect(() => {
        dispatch(fetchPatients()); // Carregar os pacientes ao montar o componente
    }, [dispatch]);

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleAgeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAgeRange(e.target.value);  // Agora você lida com o evento de um <select>
    };

    const handleGenderRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGenderRange(e.target.value);  // Agora você lida com o evento de um <select>
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Verifique se todos os campos obrigatórios estão preenchidos
        if (!createFormData.name || !createFormData.disease || !ageRange || !genderRange) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setCreateFormData({ name: '', disease: '', ageGroup: '', patientGender: '' });
        dispatch(createPatient({ ...createFormData, ageGroup: ageRange, patientGender: genderRange }));

        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 3000);
    };


    const handleEdit = (id: string) => {
        const patientToEdit = patients.find((patient: any) => patient.id === id);
        if (patientToEdit) {
            setEditFormData({
                ...patientToEdit,
                id: patientToEdit.id
            });
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id: string) => {
        setPatientToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (patientToDelete) {
            dispatch(deletePatient(patientToDelete));
            setIsDeleteModalOpen(false);
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setPatientToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = () => {
        dispatch(updatePatient(editFormData));
        setIsModalOpen(false);

        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    return (
        <div className="w-[92vw] sm:w-full mt-2 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Pacientes</h1>
            <div className="px-6 pb-6 pt-2 bg-white shadow-md rounded-lg">
                {/* Formulário de Cadastro */}
                <div className="border border-gray-300 rounded-lg p-4 sm:w-full sm:mr-4">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <h3 className='font-semibold'>Cadastrar</h3>
                        <div className='flex flex-col sm:flex-row sm:justify-start gap-2 sm:gap-6 mb-2 sm:mb-0'>
                            <div className='flex justify-center my-4 sm:flex-none sm:my-0'>
                                <FaUserCircle size={50} color="#70748D" className='ml-5 mr-8 mt-2' />
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Nome:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={createFormData.name}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Doença:</label>
                                <input
                                    type="text"
                                    name="disease"
                                    value={createFormData.disease}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">Faixa Etária</label>
                            <select
                                id="ageRange"
                                value={ageRange}
                                onChange={handleAgeRangeChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="bebê">Bebê</option>
                                <option value="criança">Criança</option>
                                <option value="adulto">Adulto</option>
                                <option value="idoso">Idoso</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">Faixa Etária</label>
                            <select
                                id="ageRange"
                                value={genderRange}
                                onChange={handleGenderRangeChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="homem">Homem</option>
                                <option value="mulher">Mulher</option>
                            </select>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                type="submit"
                                className="w-full sm:w-[25%] mt-4 sm:mt-0 items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabela de Pacientes */}
                <div className="border border-gray-300 rounded-lg px-3 py-4 w-full mt-4">
                    <h3 className='font-semibold px-3 mb-2'>Cadastrados</h3>
                    <div className="overflow-x-scroll sm:overflow-hidden min-w-full">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-sm px-4 py-2 border-b text-start">Nome</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Doença</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Faixa Etária</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient: Patient) => (
                                    <tr key={patient.id}>
                                        <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{patient.name}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{patient.disease}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{patient.ageGroup}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">
                                            <button
                                                onClick={() => handleEdit(patient.id)}
                                                className="text-blue-500 mr-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(patient.id)}
                                                className="text-red-500"
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
            </div>

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg md:w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Editar Paciente</h3>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Doença</label>
                                <input
                                    type="text"
                                    name="disease"
                                    value={editFormData.disease}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Faixa Etária</label>
                                <input
                                    type="text"
                                    name="ageGroup"
                                    value={editFormData.ageGroup}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex justify-center md:justify-end gap-4 mt-4">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                >
                                    Atualizar
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg sm:w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
                        <p className="text-sm mb-4">Você tem certeza que deseja excluir este paciente?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumbs de sucesso */}
            {createSuccess && (
                <div className="z-50 fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    <p>Paciente cadastrado com sucesso!</p>
                </div>
            )}
            {deleteSuccess && (
                <div className="z-50 fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    <p>Paciente excluído com sucesso!</p>
                </div>
            )}
            {updateSuccess && (
                <div className="z-50 fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    <p>Paciente atualizado com sucesso!</p>
                </div>
            )}
        </div>
    );
};

export default PatientForm;
