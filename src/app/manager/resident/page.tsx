'use client'


import { AppDispatch } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa'; // Ícones para editar e excluir
import { createResident, deleteResident, fetchResidents, Resident, updateResident } from '@/reducer/residentReducer';

const ResidentForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Estado para dados do formulário de criação
    const [createFormData, setCreateFormData] = useState({
        name: '',
        specialty: '',
        email: '',
        phone: ''
    });

    // Estado para dados do formulário de edição
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        specialty: '',
        email: '',
        phone: ''
    });

    // Estado para controlar a visibilidade do modal de edição
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para controlar a visibilidade do modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState<string | null>(null);

    // Estado para breadcrumb de sucesso de criação e atualização
    const [createSuccess, setCreateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Usando useSelector para acessar a lista de residentes do estado global
    const residents = useSelector((state: any) => state.resident.residents); // Supondo que o estado de residentes esteja em state.resident

    useEffect(() => {
        dispatch(fetchResidents()); // Carregar os residentes ao montar o componente
    }, [dispatch]);

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCreateFormData({ name: '', specialty: '', email: '', phone: '' });
        dispatch(createResident(createFormData));

        // Mostrar o breadcrumb de sucesso e ocultar após 3 segundos
        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 3000);
    };

    const handleEdit = (id: string) => {
        const residentToEdit = residents.find((resident: any) => resident.id === id);
        if (residentToEdit) {
            setEditFormData({
                ...residentToEdit,
                id: residentToEdit.id // Adiciona a id ao formData
            });
            setIsModalOpen(true); // Abre o modal de edição
        }
    };

    const handleDelete = (id: string) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true); // Abre o modal de confirmação de exclusão
    };

    const confirmDelete = () => {
        if (residentToDelete) {
            dispatch(deleteResident(residentToDelete)); // Chama a ação para excluir do Firestore e atualizar o estado global
            setIsDeleteModalOpen(false);
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000); // Fecha o modal de confirmação
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Fecha o modal sem excluir
        setResidentToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Fecha o modal
    };

    const handleUpdate = () => {
        dispatch(updateResident(editFormData));  // Envia o editFormData com o id
        setIsModalOpen(false); // Fecha o modal

        // Mostrar o breadcrumb de sucesso e ocultar após 3 segundos
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    return (
        <div className="w-[92vw] sm:w-full mt-2 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Residentes</h1>

            {/* Formulário de Cadastro */}
            <div className="px-6 pb-6 pt-2 bg-white shadow-md rounded-lg">
                <div className="border border-gray-300 rounded-lg p-4 sm:w-full sm:mr-4">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <h3 className='font-semibold'>Cadastrar</h3>
                        <div className='flex flex-col sm:flex-row sm:justify-start gap-2 sm:gap-6 mb-2 sm:mb-0'>
                            {/* Ícone do Residente */}
                            <div className='flex justify-center my-4 sm:flex-none sm:my-0'>
                                <FaUser size={50} color="#70748D" className='ml-5 mr-8 mt-2' />
                            </div>

                            {/* Campo de Nome */}
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

                            {/* Campo de Especialidade */}
                            {/* Campo de Especialidade */}
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Especialidade:</label>
                                <select
                                    name="specialty"
                                    value={createFormData.specialty}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="" disabled>Selecione uma especialidade</option>
                                    <option value="Residente I">Residente I</option>
                                    <option value="Residente II">Residente II</option>
                                    <option value="Residente III">Residente III</option>
                                </select>
                            </div>
                        </div>

                        {/* Campo de Email e Telefone */}
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={createFormData.email}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mt-2">Telefone:</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={createFormData.phone}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Botão de Submissão */}
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
            </div>

            {/* Tabela de Residentes */}
            <div className="border border-gray-300 rounded-lg px-3 py-4 w-full mt-4">
                <h3 className='font-semibold px-3 mb-2'>Cadastrados</h3>
                <div className="overflow-x-scroll sm:overflow-hidden min-w-full">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="text-sm px-4 py-2 border-b text-start">Nome</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Especialidade</th>
                                <th className="text-sm px-4 py-2 border-b text-start">Telefone</th>
                                <th className="text-sm px-4 py-2 border-b text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((resident: Resident) => (
                                <tr key={resident.id}>
                                    <td className="text-sm px-4 py-2 border-b">{resident.name}</td>
                                    <td className="text-sm px-4 py-2 border-b">{resident.specialty}</td>
                                    <td className="text-sm px-4 py-2 border-b">{resident.phone}</td>
                                    <td className="text-sm px-4 py-2 border-b text-center">
                                        <button
                                            onClick={() => handleEdit(resident.id)}
                                            className="text-blue-500 mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(resident.id)}
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

            {/* Modal para Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[80vw] sm:w-[50vw]">
                        <h3 className="text-xl font-semibold">Editar Residente</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="my-4">
                                <label className="block text-sm font-medium text-gray-700">Nome:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="my-4">
                                <label className="block text-sm font-medium text-gray-700">Especialidade:</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={editFormData.specialty}
                                    onChange={handleEditChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="my-4">
                                <label className="block text-sm font-medium text-gray-700">Telefone:</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleEditChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
                                >
                                    Atualizar
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
                                >
                                    Fechar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Exclusão */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[80vw] sm:w-[50vw]">
                        <h3 className="text-xl font-semibold">Confirmar Exclusão</h3>
                        <p>Tem certeza de que deseja excluir este residente?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none"
                            >
                                Excluir
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumbs de Sucesso */}
            {createSuccess && <div className="absolute top-0 right-0 p-4 text-green-500">Residente Cadastrado com Sucesso!</div>}
            {deleteSuccess && <div className="absolute top-0 right-0 p-4 text-red-500">Residente Excluído com Sucesso!</div>}
            {updateSuccess && <div className="absolute top-0 right-0 p-4 text-yellow-500">Residente Atualizado com Sucesso!</div>}
        </div>
    );
};

export default ResidentForm;
