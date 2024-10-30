import React, { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { FiEdit, FiDelete, FiPlus } from 'react-icons/fi';
import {
    getUnits,
    getCategories,
    getStorages,
    createUnit,
    createCategory,
    createStorage,
    updateUnit,
    updateCategory,
    updateStorage,
    deleteUnit,
    deleteCategory,
    deleteStorage,
    Unit,
    Category,
    Storage,
    deleteProduct, getProductsByStorage, getProductsByCategory, Product
} from '@shelf-mate/api-client-ts';
import Modal from '../components/Modal';
import { AxiosError } from 'axios';

const Resources: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [storages, setStorages] = useState<Storage[]>([]);
    const [selectedType, setSelectedType] = useState<'unit' | 'category' | 'storage'>('unit');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
    const [currentName, setCurrentName] = useState('');
    const [currentId, setCurrentId] = useState<string | null>(null);

    const [deleteType, setDeleteType] = useState<'unit' | 'category' | 'storage' | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [unitsResponse, categoriesResponse, storagesResponse] = await Promise.all([
                getUnits(),
                getCategories(),
                getStorages(),
            ]);
            if ('data' in unitsResponse) setUnits(unitsResponse.data as Unit[]);
            if ('data' in categoriesResponse) setCategories(categoriesResponse.data as Category[]);
            if ('data' in storagesResponse) setStorages(storagesResponse.data as Storage[]);
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                setError(`Failed to load resources: ${error.response.statusText}`);
            } else {
                setError('Failed to load resources');
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        try {
            let response;
            if (editMode === 'add') {
                if (selectedType === 'unit') response = await createUnit({ name: currentName });
                if (selectedType === 'category') response = await createCategory({ name: currentName });
                if (selectedType === 'storage') response = await createStorage({ name: currentName });
            } else if (editMode === 'edit' && currentId) {
                if (selectedType === 'unit') response = await updateUnit(currentId, { name: currentName });
                if (selectedType === 'category') response = await updateCategory(currentId, { name: currentName });
                if (selectedType === 'storage') response = await updateStorage(currentId, { name: currentName });
            }

            if (response && 'data' in response) {
                const updatedData = response.data;
                if (selectedType === 'unit') setUnits([...units.filter(u => u.id !== currentId), updatedData]);
                if (selectedType === 'category') setCategories([...categories.filter(c => c.id !== currentId), updatedData]);
                if (selectedType === 'storage') setStorages([...storages.filter(s => s.id !== currentId), updatedData]);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save resource:', error);
        }
    };

    const getProductsByUnit = async (unitId: string) => {
        return {
            message: "Dummy data",
            data: []
        };
    };

    const handleDelete = async () => {
        if (deleteId && deleteType) {
            try {
                let associatedProducts: Product[] | undefined;
                if (deleteType === 'unit') {
                    const response = await getProductsByUnit(deleteId);
                    associatedProducts = 'data' in response ? response.data : undefined;
                } else if (deleteType === 'category') {
                    const response = await getProductsByCategory(deleteId);
                    associatedProducts = 'data' in response ? response.data : undefined;
                } else if (deleteType === 'storage') {
                    const response = await getProductsByStorage(deleteId);
                    associatedProducts = 'data' in response ? response.data : undefined;
                }
                if (associatedProducts && associatedProducts.length > 0) {
                    await Promise.all(
                        associatedProducts.map((product: Product) => deleteProduct(product.id))
                    );
                }
                if (deleteType === 'unit') await deleteUnit(deleteId);
                if (deleteType === 'category') await deleteCategory(deleteId);
                if (deleteType === 'storage') await deleteStorage(deleteId);

                fetchData();
            } catch (error) {
                console.error('Failed to delete resource or associated products:', error);
            } finally {
                setConfirmDeleteOpen(false);
            }
        }
    };

    const openModal = (mode: 'add' | 'edit', name = '', id: string | null = null) => {
        setEditMode(mode);
        setCurrentName(name);
        setCurrentId(id);
        setModalOpen(true);
    };

    const openDeleteConfirmation = (id: string, type: 'unit' | 'category' | 'storage') => {
        setDeleteId(id);
        setDeleteType(type);
        setConfirmDeleteOpen(true);
    };

    const getFilteredData = () => {
        const data = selectedType === 'unit' ? units : selectedType === 'category' ? categories : storages;
        return data
            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-semibold text-center uppercase">Resources</h1>

            <div className="my-3"></div>

            <div className="flex justify-center items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSelectedType('storage')}
                        className={`p-2 ${selectedType === 'storage' ? 'font-bold text-primaryColor' : 'text-gray-600'}`}
                    >
                        Storages
                    </button>
                    <button
                        onClick={() => setSelectedType('category')}
                        className={`p-2 ${selectedType === 'category' ? 'font-bold text-primaryColor' : 'text-gray-600'}`}
                    >
                        Categories
                    </button>
                    <button
                        onClick={() => setSelectedType('unit')}
                        className={`p-2 ${selectedType === 'unit' ? 'font-bold text-primaryColor' : 'text-gray-600'}`}
                    >
                        Units
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center mb-4">
                <div className="flex items-center border rounded-lg p-2 w-full">
                    <CiSearch className="mr-2 text-gray-600"/>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        className="focus:outline-none text-sm w-full"
                    />
                </div>
            </div>

            <div>
                {error && <div className="text-red-500">{error}</div>}
                {isLoading ? (
                    <div>Loading resources...</div>
                ) : (
                    <ul className="divide-y">
                        {getFilteredData().map(resource => (
                            <li key={resource.id} className="flex justify-between items-center p-2">
                                {resource.name}
                                <div className="flex space-x-2">
                                    <button onClick={() => openModal('edit', resource.name, resource.id)}>
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => openDeleteConfirmation(resource.id, selectedType)}>
                                        <FiDelete />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => openModal('add')}
                    className="bg-primaryColor text-white p-3 rounded-full shadow-lg hover:bg-primaryColor-dark mb-16"
                >
                    <FiPlus />
                </button>
            </div>
            <Modal
                title={editMode === 'add' ? `Add ${selectedType}` : `Edit ${selectedType}`}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleSave}
                confirmButtonLabel={editMode === 'add' ? 'Add' : 'Save'}
            >
                <input
                    type="text"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder={`Enter ${selectedType} name`}
                    className="w-full border-b-2 p-2 mt-4 focus:outline-none"
                />
            </Modal>

            <Modal
                title="Confirm Deletion"
                isOpen={isConfirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                confirmButtonLabel="Confirm Delete"
                confirmButtonColor="bg-red-500"
            >
                <p className="text-center mb-4">
                    Are you sure you want to delete this {deleteType}? This will also delete all associated products.
                </p>
            </Modal>
        </div>
    );

};

export default Resources;
