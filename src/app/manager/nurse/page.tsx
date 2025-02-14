'use client'
import { createNurse, deleteNurse, fetchNurses, Nurse, updateNurse } from '@/reducer/nurseReducer';
import { AppDispatch } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Adicione o useSelector para acessar o estado global
import { FaEdit, FaTrash, FaUserNurse } from 'react-icons/fa'; // Ícones para editar e excluir

const NurseForm = () => {
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
    const [nurseToDelete, setNurseToDelete] = useState<string | null>(null);

    // Estado para breadcrumb de sucesso de criação e atualização
    const [createSuccess, setCreateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Usando useSelector para acessar a lista de enfermeiros do estado global
    const nurses = useSelector((state: any) => state.nurse.nurses); // Supondo que o estado de enfermeiros esteja em state.nurse

    useEffect(() => {
        dispatch(fetchNurses()); // Carregar os enfermeiros ao montar o componente
    }, [dispatch]);

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCreateFormData({ name: '', specialty: '', email: '', phone: '' });
        dispatch(createNurse(createFormData));

        // Mostrar o breadcrumb de sucesso e ocultar após 3 segundos
        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 3000);
    };

    const handleEdit = (id: string) => {
        const nurseToEdit = nurses.find((nurse: any) => nurse.id === id);
        if (nurseToEdit) {
            setEditFormData({
                ...nurseToEdit,
                id: nurseToEdit.id // Adiciona a id ao formData
            });
            setIsModalOpen(true); // Abre o modal de edição
        }
    };

    const handleDelete = (id: string) => {
        setNurseToDelete(id);
        setIsDeleteModalOpen(true); // Abre o modal de confirmação de exclusão
    };

    const confirmDelete = () => {
        if (nurseToDelete) {
            dispatch(deleteNurse(nurseToDelete)); // Chama a ação para excluir do Firestore e atualizar o estado global
            setIsDeleteModalOpen(false);
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);// Fecha o modal de confirmação
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Fecha o modal sem excluir
        setNurseToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Fecha o modal
    };

    const handleUpdate = () => {
        dispatch(updateNurse(editFormData));  // Envia o editFormData com o id
        setIsModalOpen(false); // Fecha o modal

        // Mostrar o breadcrumb de sucesso e ocultar após 3 segundos
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    return (
        <div className="w-[92vw] md:w-[77vw] lg:w-[60vw] mt-2 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Enfermeiros</h1>
            <div className="px-6 pb-6 pt-2 bg-white shadow-md rounded-lg">
                {/* Formulário de Cadastro */}
                <div className="border border-gray-300 rounded-lg p-4 sm:w-full sm:mr-4">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <h3 className='font-semibold'>Cadastrar</h3>
                        <div className='flex flex-col sm:flex-row sm:justify-start gap-2 sm:gap-6 mb-2 sm:mb-0'>
                            <div className='flex justify-center my-4 sm:flex-none sm:my-0'>
                                <FaUserNurse size={50} color="#70748D" className='ml-5 mr-8 mt-2' />
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
                                <label className="block text-sm font-medium text-gray-700">Especialidade:</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={createFormData.specialty}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
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

                {/* Tabela de Enfermeiros */}
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
                                {nurses.map((nurse: Nurse) => (
                                    <tr key={nurse.id}>
                                        <td className="text-sm px-4 py-2 border-b min-w-[150px] max-w-[18ch] truncate">{nurse.name}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w-[150px] max-w-[18ch] truncate">{nurse.specialty}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w-[150px] max-w-[18ch] truncate">{nurse.phone}</td>
                                        <td className="text-sm px-4 py-2 border-b min-w-[150px] max-w-[18ch] truncate text-center">
                                            <button
                                                onClick={() => handleEdit(nurse.id)}
                                                className="text-blue-500 mr-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(nurse.id)}
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
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Editar Enfermeiro</h3>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-4"
                        >
                            <div>
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
                            <div>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
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
                            <div className="flex justify-end gap-4 mt-4">
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
                        <p className="text-sm mb-4">Você tem certeza que deseja excluir este enfermeiro?</p>
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
            {/* Breadcrumb de Sucesso - Criação */}
            {createSuccess && (
                <div className="fixed bottom-20 right-[5.0px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Enfermeiro cadastrado com sucesso!
                </div>
            )}
            {/* Breadcrumb de Sucesso - Exclusão */}
            {deleteSuccess && (
                <div className="fixed bottom-20 right-[5.0px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Enfermeiro excluído com sucesso!
                </div>
            )}

            {/* Breadcrumb de Sucesso - Atualização */}
            {updateSuccess && (
                <div className="fixed bottom-20 right-[5.0px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Enfermeiro atualizado com sucesso!
                </div>
            )}
        </div>
    );
};

export default NurseForm;
