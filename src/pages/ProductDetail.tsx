import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, deleteProduct, getUnits, getCategories, getStorages, createCategory, createUnit, createStorage, deleteCategory, deleteUnit, deleteStorage, Product as ApiProduct, Unit, Category, Storage } from '@shelf-mate/api-client-ts';
import { AxiosError } from "axios";
import Modal from '../components/Modal';
import {FiArrowLeft, FiDelete} from "react-icons/fi";

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [initialProduct, setInitialProduct] = useState<ApiProduct | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [storages, setStorages] = useState<Storage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isUnitModalOpen, setUnitModalOpen] = useState(false);
    const [isStorageModalOpen, setStorageModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [newStorage, setNewStorage] = useState('');

    const [expirationDate, setExpirationDate] = useState<string | undefined>(
        product?.expirationDate ? new Date(product.expirationDate).toISOString().split('T')[0] : undefined
    );

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
                    setProduct(productResponse.data);
                    setInitialProduct(productResponse.data);
                    setUnits(unitsResponse.data as Unit[]);
                    setCategories(categoriesResponse.data as Category[]);
                    setStorages(storagesResponse.data as Storage[]);
                    setExpirationDate(new Date(productResponse.data.expirationDate).toISOString().split('T')[0]);
                } else {
                    setError('Failed to retrieve product data');
                }
            } catch (error) {
                setError('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async () => {
        if (product && initialProduct && id) {
            setIsUpdating(true);
            try {
                const updatedFields = {
                    name: product.name !== initialProduct.name ? product.name : undefined,
                    quantity: product.quantity !== initialProduct.quantity ? product.quantity : undefined,
                    categoryId: product.category?.id !== initialProduct.category?.id ? product.category?.id : undefined,
                    unitId: product.unit?.id !== initialProduct.unit?.id ? product.unit?.id : undefined,
                    storageId: product.storage?.id !== initialProduct.storage?.id ? product.storage?.id : undefined,
                    expirationDate: expirationDate && expirationDate !== new Date(initialProduct.expirationDate).toISOString().split('T')[0] ? new Date(`${expirationDate}T12:00:00Z`) : undefined,
                };

                const response = await updateProduct(id, updatedFields);
                alert('Product updated successfully!');
                navigate('/');
            } catch (error: unknown) {
                if (error instanceof AxiosError && error.response) {
                    setError(`Failed to update product: ${error.response.statusText}`);
                } else {
                    setError('Failed to update product: Request error');
                }
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleDelete = async () => {
        if (id) {
            setIsDeleting(true);
            try {
                await deleteProduct(id);
                alert('Product deleted successfully!');
                navigate('/');
            } catch (error) {
                setError('Failed to delete product');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const addNewCategory = async () => {
        try {
            const response = await createCategory({ name: newCategory });
            if ('data' in response) {
                setCategories([...categories, response.data]);
                setNewCategory('');
            } else {
                console.error("Response did not contain data", response);
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const addNewUnit = async () => {
        try {
            const response = await createUnit({ name: newUnit });
            if ('data' in response) {
                setUnits([...units, response.data]);
                setNewUnit('');
            } else {
                console.error("Response did not contain data", response);
            }
        } catch (error) {
            console.error('Failed to add unit:', error);
        }
    };

    const addNewStorage = async () => {
        try {
            const response = await createStorage({ name: newStorage });
            if ('data' in response) {
                setStorages([...storages, response.data]);
                setNewStorage('');
            } else {
                console.error("Response did not contain data", response);
            }
        } catch (error) {
            console.error('Failed to add storage:', error);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            setCategories(categories.filter(category => category.id !== categoryId));
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleDeleteUnit = async (unitId: string) => {
        try {
            await deleteUnit(unitId);
            setUnits(units.filter(unit => unit.id !== unitId));
        } catch (error) {
            console.error('Failed to delete unit:', error);
        }
    };

    const handleDeleteStorage = async (storageId: string) => {
        try {
            await deleteStorage(storageId);
            setStorages(storages.filter(storage => storage.id !== storageId));
        } catch (error) {
            console.error('Failed to delete storage:', error);
        }
    };

    if (isLoading) return <div>Loading product details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>No product found.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-4">
                <div className="w-1/3 flex justify-start">
                    <button onClick={() => navigate(-1)} className="text-2xl">
                        <FiArrowLeft/>
                    </button>
                </div>
                <h1 className="w-1/3 text-xl font-semibold text-center uppercase">Details</h1>
                <div className="w-1/3"></div>
            </div>


            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Name</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Category</label>
                <button onClick={() => setCategoryModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {product.category?.name || 'Select Category'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Quantity</label>
                <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => setProduct({...product, quantity: parseInt(e.target.value, 10)})}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Unit</label>
                <button onClick={() => setUnitModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {product.unit?.name || 'Select Unit'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Storage</label>
                <button onClick={() => setStorageModalOpen(true)} className="w-full text-left border-b-2 p-2 pl-0">
                    {product.storage?.name || 'Select Storage'}
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">Expiration Date</label>
                <input
                    type="date"
                    value={expirationDate || ''}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full border-b-2 p-2 pl-0 focus:outline-none"
                />
            </div>

            <button onClick={handleUpdate} className="w-full bg-primaryColor text-white p-3 mt-4 rounded-md">
                Update
            </button>

            <button onClick={handleDelete} className="w-full bg-red-500 text-white p-3 mt-2 rounded-md">
                Delete
            </button>
            <Modal title="Select or Add Category" isOpen={isCategoryModalOpen}
                   onClose={() => setCategoryModalOpen(false)}>
                <ul className="divide-y">
                    {categories.map((category) => (
                        <li key={category.id} className="flex justify-between items-center p-4">
                            <span onClick={() => {
                                setProduct({...product, category: category});
                                setCategoryModalOpen(false);
                            }}>
                                {category.name}
                            </span>
                            <button onClick={() => handleDeleteCategory(category.id)}><FiDelete/></button>
                        </li>
                    ))}
                </ul>
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                       placeholder="New Category" className="w-full border-b-2 p-2 mt-4 focus:outline-none"/>
                <button onClick={addNewCategory}
                        className="w-full text-center bg-primaryColor text-white p-2 mt-2 rounded-md">
                    Add Category
                </button>
            </Modal>

            <Modal title="Select or Add Unit" isOpen={isUnitModalOpen} onClose={() => setUnitModalOpen(false)}>
                <ul className="divide-y">
                    {units.map((unit) => (
                        <li key={unit.id} className="flex justify-between items-center p-4">
                            <span onClick={() => {
                                setProduct({...product, unit: unit});
                                setUnitModalOpen(false);
                            }}>
                                {unit.name}
                            </span>
                            <button onClick={() => handleDeleteUnit(unit.id)}><FiDelete/></button>
                        </li>
                    ))}
                </ul>
                <input type="text" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="New Unit"
                       className="w-full border-b-2 p-2 mt-4 focus:outline-none"/>
                <button onClick={addNewUnit} className="w-full text-center bg-primaryColor text-white p-2 mt-2 rounded-md">
                    Add Unit
                </button>
            </Modal>

            <Modal title="Select or Add Storage" isOpen={isStorageModalOpen} onClose={() => setStorageModalOpen(false)}>
                <ul className="divide-y">
                    {storages.map((storage) => (
                        <li key={storage.id} className="flex justify-between items-center p-4">
                            <span onClick={() => {
                                setProduct({...product, storage: storage});
                                setStorageModalOpen(false);
                            }}>
                                {storage.name}
                            </span>
                            <button onClick={() => handleDeleteStorage(storage.id)}><FiDelete/></button>
                        </li>
                    ))}
                </ul>
                <input type="text" value={newStorage} onChange={(e) => setNewStorage(e.target.value)}
                       placeholder="New Storage" className="w-full border-b-2 p-2 mt-4 focus:outline-none"/>
                <button onClick={addNewStorage}
                        className="w-full text-center bg-primaryColor text-white p-2 mt-2 rounded-md">
                    Add Storage
                </button>
            </Modal>
        </div>
    );
};


export default ProductDetail;