import React, { useState } from 'react';
import { CiFilter, CiTimer, CiSearch } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa';
import Modal from './Modal';

interface Product {
    id: number;
    name: string;
    daysOld: number;
    location: string;
    daysLeft: number;
    image: string;
}

interface Shelf {
    name: string;
    products: Product[];
}

const shelfData: Record<number, Shelf> = {
    1: {
        name: 'Fridge',
        products: [
            { id: 1, name: 'Baby spinach', daysOld: 3, location: 'Fridge', daysLeft: 1, image: '🥬' },
            { id: 2, name: 'Passion fruit', daysOld: 3, location: 'Fridge', daysLeft: 2, image: '🥭' },
        ],
    },
    2: {
        name: 'Pantry',
        products: [
            { id: 3, name: 'Rice', daysOld: 3, location: 'Pantry', daysLeft: 25, image: '🍚' },
            { id: 4, name: 'Pasta', daysOld: 3, location: 'Pantry', daysLeft: 10, image: '🍝' },
        ],
    },
};

const ProductTable: React.FC = () => {
    const [selectedShelf, setSelectedShelf] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>('Expiration');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isShelfModalOpen, setShelfModalOpen] = useState<boolean>(false);
    const [isFilterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [isSortModalOpen, setSortModalOpen] = useState<boolean>(false);

    const currentShelf = shelfData[selectedShelf];

    const handleShelfChange = (shelfId: number) => {
        setSelectedShelf(shelfId);
        setShelfModalOpen(false);
    };

    const handleSortChange = (sortOption: string) => {
        setSortBy(sortOption);
        setSortModalOpen(false);
    };

    const filteredProducts = currentShelf.products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            {/* Header with Dropdown for Shelves, Search, Sort/Filter */}
            <div className="flex justify-between items-center mb-4">
                {/* View Inside with Dropdown */}
                <div className="flex items-center">
                    <button
                        className="p-2 bg-transparent text-sm text-gray-600 focus:outline-none"
                        onClick={() => setShelfModalOpen(true)}
                    >
                        {shelfData[selectedShelf].name}
                    </button>
                </div>

                {/* Search, Sort and Filter */}
                <div className="flex items-center space-x-4">
                    {/* Search input field */}
                    <div className="flex items-center">
                        <CiSearch className="mr-2 text-gray-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="focus:outline-none text-sm w-full"
                        />
                    </div>

                    {/* Sort by Button */}
                    <button className="flex items-center text-sm p-2" onClick={() => setSortModalOpen(true)}>
                        Sort by: {sortBy} <CiTimer className="ml-1" />
                    </button>

                    {/* Filter Button */}
                    <button className="flex items-center text-sm p-2" onClick={() => setFilterModalOpen(true)}>
                        Filter <CiFilter className="ml-1" />
                    </button>
                </div>
            </div>
            <div className="border-b mb-4"></div>

            {/* Food list */}
            <div className="flex flex-col space-y-4">
                {filteredProducts.map((food) => (
                    <div key={food.id} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                        {/* Food info */}
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                {food.image}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold">{food.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {food.daysOld} Days Old | {food.location}
                                </p>
                            </div>
                        </div>

                        {/* Days left */}
                        <div className="flex items-center">
                            <p className="text-sm text-gray-500">{food.daysLeft} Days Left</p>
                            <div
                                className={`ml-2 w-3 h-3 rounded-full ${
                                    food.daysLeft <= 2 ? 'bg-red-500' : 'bg-green-500'
                                }`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="fixed bottom-10 right-10 bg-orange-500 text-white py-4 px-4 rounded-full shadow-lg">
                <FaPlus />
            </button>

            {/* Modal for Shelf selection */}
            <Modal title="Select a Shelf" isOpen={isShelfModalOpen} onClose={() => setShelfModalOpen(false)}>
                <ul>
                    <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleShelfChange(1)}>
                        Fridge
                    </li>
                    <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleShelfChange(2)}>
                        Pantry
                    </li>
                </ul>
            </Modal>

            {/* Modal for Sorting */}
            <Modal title="Sort by" isOpen={isSortModalOpen} onClose={() => setSortModalOpen(false)}>
                <ul>
                    <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleSortChange('Expiration')}>
                        Expiration
                    </li>
                    <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => handleSortChange('Name')}>
                        Name
                    </li>
                </ul>
            </Modal>

            {/* Modal for Filtering */}
            <Modal title="Filter" isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)}>
                <ul>
                    <li className="cursor-pointer p-2 hover:bg-gray-100">📅 Date</li>
                    <li className="cursor-pointer p-2 hover:bg-gray-100">🏷 Category</li>
                    <li className="cursor-pointer p-2 hover:bg-gray-100">📊 Quantity</li>
                    <li className="cursor-pointer p-2 hover:bg-gray-100">Expiration</li>
                </ul>
            </Modal>
        </div>
    );
};

export default ProductTable;
