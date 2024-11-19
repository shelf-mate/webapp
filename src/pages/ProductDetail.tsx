import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct, getUnits, getCategories, getStorages, Product as ApiProduct, Unit, Category, Storage } from '@shelf-mate/api-client-ts';
import Modal from '../components/Modal';
import { FiArrowLeft } from "react-icons/fi";

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [storages, setStorages] = useState<Storage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isUnitModalOpen, setUnitModalOpen] = useState(false);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);

    const [editedName, setEditedName] = useState<string | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<number | undefined>(undefined);
    const [editedExpirationDate, setEditedExpirationDate] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);

    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Product ID is missing');
                return;
            }
            setIsLoading(true);
            try {
                const [productResponse, unitsResponse, categoriesResponse, storagesResponse] = await Promise.all([
                    getProduct(id),
                    getUnits(),
                    getCategories(),
                    getStorages(),
                ]);

                if ('data' in productResponse && 'data' in unitsResponse && 'data' in categoriesResponse && 'data' in storagesResponse) {
                    const productData = productResponse.data as ApiProduct;
                    setProduct(productData);
                    setUnits(unitsResponse.data as Unit[]);
                    setCategories(categoriesResponse.data as Category[]);
                    setStorages(storagesResponse.data as Storage[]);

                    setEditedName(productData.name);
                    setEditedQuantity(productData.quantity);
                    setEditedExpirationDate(new Date(productData.expirationDate).toISOString().split('T')[0]);
                    setSelectedCategory(productData.category || null);
                    setSelectedUnit(productData.unit || null);
                    setSelectedStorage(productData.storage || null);
                } else {
                    setError('Failed to retrieve product data');
                }
            } catch {
                setError('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSave = async () => {
        if (!editedName || !selectedCategory || !editedQuantity || !selectedUnit || !selectedStorage || !editedExpirationDate) {
            setFormError('Please fill out all fields.');
            return;
        }
        setFormError(null);

        try {
            await updateProduct(id!, {
                name: editedName,
                quantity: editedQuantity,
                expirationDate: new Date(`${editedExpirationDate}T12:00:00Z`),
                categoryId: selectedCategory.id,
                unitId: selectedUnit.id,
                storageId: selectedStorage.id,
            });
            navigate('/');
        } catch {
            setError('Failed to update product');
        }
    };


    const handleDelete = async () => {
        if (id) {
            try {
                await deleteProduct(id);
                navigate('/');
            } catch {
                setError('Failed to delete product');
            }
        }
    };

    if (isLoading) return <div>Loading product details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>No product found.</div>;

    return (
        <div className="container mx-auto p-4">
            {isCategoryModalOpen && (
                <Modal title="Select Category" isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
                    <h2>Select Category</h2>
                    <ul className="max-h-60 overflow-y-auto">
                        {categories.map(category => (
                            <li key={category.id} onClick={() => { setSelectedCategory(category); setCategoryModalOpen(false); }} className="cursor-pointer p-2 border-b">
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}

            {isUnitModalOpen && (
                <Modal title="Select Unit" isOpen={isUnitModalOpen} onClose={() => setUnitModalOpen(false)}>
                    <h2>Select Unit</h2>
                    <ul className="max-h-60 overflow-y-auto">
                        {units.map(unit => (
                            <li key={unit.id} onClick={() => { setSelectedUnit(unit); setUnitModalOpen(false); }} className="cursor-pointer p-2 border-b">
                                {unit.name}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}

            {isStorageModalOpen && (
                <Modal title="Select Storage" isOpen={isStorageModalOpen} onClose={() => setStorageModalOpen(false)}>
                    <h2>Select Storage</h2>
                    <ul className="max-h-60 overflow-y-auto">
                        {storages.map(storage => (
                            <li key={storage.id} onClick={() => { setSelectedStorage(storage); setStorageModalOpen(false); }} className="cursor-pointer p-2 border-b">
                                {storage.name}
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}

            <div className="flex items-center mb-4">
                <div className="w-1/3 flex justify-start">
                    <button onClick={() => navigate(-1)} className="text-2xl">
                        <FiArrowLeft />
                    </button>
                </div>
                <h1 className="w-1/3 text-xl font-semibold text-center uppercase">Details</h1>
                <div className="w-1/3"></div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Name</label>
                <input
                    type="text"
                    value={editedName || ''}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Category</label>
                <button onClick={() => setCategoryModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {selectedCategory?.name || 'Select Category'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Quantity</label>
                <input
                    type="number"
                    value={editedQuantity || ''}
                    onChange={(e) => setEditedQuantity(parseInt(e.target.value, 10))}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Unit</label>
                <button onClick={() => setUnitModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {selectedUnit?.name || 'Select Unit'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Storage</label>
                <button onClick={() => setStorageModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {selectedStorage?.name || 'Select Storage'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Expiration Date</label>
                <input
                    type="date"
                    value={editedExpirationDate || ''}
                    onChange={(e) => setEditedExpirationDate(e.target.value)}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    className={`w-full p-3 rounded-md ${editedName && editedQuantity && selectedCategory && selectedUnit && selectedStorage && editedExpirationDate ? 'bg-primaryColor text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={!editedName || !editedQuantity || !selectedCategory || !selectedUnit || !selectedStorage || !editedExpirationDate}
                >
                    Save
                </button>
                <button onClick={handleDelete} className="w-full bg-red-500 text-white p-3 rounded-md">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
