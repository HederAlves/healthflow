'use client'

import { createBed, deleteBed, fetchBeds, updateBed, Bed } from '@/reducer/bedReducer';
import { AppDispatch } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaBed } from 'react-icons/fa';

const BedForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Estado para dados do formulário de criação
    const [createFormData, setCreateFormData] = useState({
        number: '',
        ward: '',
        room: '',
        corridor: '',
        floor: '',
        status: false
    });

    // Estado para dados do formulário de edição
    const [editFormData, setEditFormData] = useState({
        id: '',
        number: '',
        ward: '',
        room: '',
        corridor: '',
        floor: '',
        status: false
    });

    // Estado para controlar a visibilidade do modal de edição
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para controlar a visibilidade do modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bedToDelete, setBedToDelete] = useState<string | null>(null);

    // Estado para breadcrumb de sucesso de criação e atualização
    const [createSuccess, setCreateSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Usando useSelector para acessar a lista de leitos do estado global
    const beds = useSelector((state: any) => state.bed.beds);

    useEffect(() => {
        dispatch(fetchBeds()); // Carregar os leitos ao montar o componente
    }, [dispatch]);

    const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCreateFormData({ number: '', ward: '', room: '', corridor: '', floor: '', status: false });
        dispatch(createBed(createFormData));

        setCreateSuccess(true);
        setTimeout(() => setCreateSuccess(false), 3000);
    };

    const handleEdit = (id: string) => {
        const bedToEdit = beds.find((bed: any) => bed.id === id);
        if (bedToEdit) {
            setEditFormData({
                ...bedToEdit,
                id: bedToEdit.id // Adiciona a id ao formData
            });
            setIsModalOpen(true); // Abre o modal de edição
        }
    };

    const handleDelete = (id: string) => {
        setBedToDelete(id);
        setIsDeleteModalOpen(true); // Abre o modal de confirmação de exclusão
    };

    const confirmDelete = () => {
        if (bedToDelete) {
            dispatch(deleteBed(bedToDelete)); // Chama a ação para excluir e atualizar o estado global
            setIsDeleteModalOpen(false);
            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setBedToDelete(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Fecha o modal
    };

    const handleUpdate = () => {
        dispatch(updateBed(editFormData));  // Envia o editFormData com o id
        setIsModalOpen(false); // Fecha o modal

        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    return (
        <div className="w-[92vw] md:w-full mt-2 md:mt-0 p-4">
            <h1 className="text-xl text-center md:text-start font-bold pb-2">Leitos</h1>
            <div className="px-6 pb-6 pt-2 bg-white shadow-md rounded-lg">
                {/* Formulário de Cadastro */}
                <div className="border border-gray-300 rounded-lg p-4 sm:w-full sm:mr-4">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <h3 className='font-semibold'>Cadastrar</h3>
                        <div className='flex flex-col sm:flex-row sm:justify-start gap-2 sm:gap-6 mb-2 sm:mb-0'>
                            <div className='flex justify-center my-4 sm:flex-none sm:my-0'>
                                <FaBed size={50} color="#70748D" className='ml-5 mr-8 mt-2' />
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Número do Leito:</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={createFormData.number}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className='w-full'>
                                <label className="block text-sm font-medium text-gray-700">Ala:</label>
                                <input
                                    type="text"
                                    name="ward"
                                    value={createFormData.ward}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quarto:</label>
                                <input
                                    type="text"
                                    name="room"
                                    value={createFormData.room}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Corredor:</label>
                                <input
                                    type="text"
                                    name="corridor"
                                    value={createFormData.corridor}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Andar:</label>
                                <input
                                    type="text"
                                    name="floor"
                                    value={createFormData.floor}
                                    onChange={handleCreateChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mt-2">Status:</label>
                                <select
                                    name="status"
                                    value={createFormData.status ? "ocupado" : "disponível"}
                                    onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value === "ocupado" })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="disponível">Disponível</option>
                                    <option value="ocupado">Ocupado</option>
                                </select>
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

                {/* Tabela de Leitos */}
                <div className="border border-gray-300 rounded-lg px-2 py-4 w-full mt-4">
                    <h3 className='font-semibold px-3 mb-2'>Cadastrados</h3>
                    <div className="overflow-x-scroll sm:overflow-hidden min-w-full">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-sm px-4 py-2 border-b text-start">Leito</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Ala</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Quarto</th>
                                    <th className="text-sm px-4 py-2 border-b sm:text-center">Status</th>
                                    <th className="text-sm px-4 py-2 border-b text-start">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beds && beds.length > 0 ? (
                                    beds.map((bed: Bed) => (
                                        <tr key={bed.id}>
                                            <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{bed.number}</td>
                                            <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{bed.ward}</td>
                                            <td className="text-sm px-4 py-2 border-b min-w- max-w-[18ch] truncate">{bed.room}</td>
                                            <td className="text-sm px-4 border-b min-w- max-w-[18ch] truncate">
                                                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${bed.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                    {bed.status ? 'Disponível' : 'Ocupado'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 border-b flex justify-start gap-3">
                                                <button
                                                    onClick={() => handleEdit(bed.id)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bed.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center px-4 py-2 border-b">Nenhum leito cadastrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[600px]">
                        <h2 className="text-xl font-semibold mb-4">Editar Leito</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Número do Leito:</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={editFormData.number}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ala:</label>
                                <input
                                    type="text"
                                    name="ward"
                                    value={editFormData.ward}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quarto:</label>
                                    <input
                                        type="text"
                                        name="room"
                                        value={editFormData.room}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Corredor:</label>
                                    <input
                                        type="text"
                                        name="corridor"
                                        value={editFormData.corridor}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Andar:</label>
                                    <input
                                        type="text"
                                        name="floor"
                                        value={editFormData.floor}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status:</label>
                                    <select
                                        name="status"
                                        value={editFormData.status ? "ocupado" : "disponível"}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value === "ocupado" })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="disponível">Disponível</option>
                                        <option value="ocupado">Ocupado</option>
                                    </select>
                                </div>
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

            {/* Modal de Exclusão */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
                        <p className="text-sm mb-4">Você tem certeza que deseja excluir este leito?</p>

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

            {/* Mensagens de Sucesso */}
            {createSuccess && (
                <div className="fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Leito cadastrado com sucesso!
                </div>
            )}
            {deleteSuccess && (
                <div className="fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Leito excluído com sucesso!
                </div>
            )}
            {updateSuccess && (
                <div className="fixed bottom-20 right-[6.6px] sm:bottom-4 sm:right-2 mt-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
                    Leito atualizado com sucesso!
                </div>
            )}
        </div>
    );
};

export default BedForm;
