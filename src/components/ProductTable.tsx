import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import {
  getProductsByStorage,
  getStorages,
  getProducts,
  Product as ApiProduct,
  Storage as ApiStorage,
} from "@shelf-mate/api-client-ts";
import { init } from "@shelf-mate/api-client-ts";
import Modal from "./Modal";

init({ baseURL: process.env.REACT_APP_API_BASE_URL });

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface Product extends ApiProduct {
  daysLeft: number;
  categoryName: string;
  unitName: string;
  isExpired: boolean;
}

interface Storage extends ApiStorage {}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  type SimpleStorage = { id: string; name: string };
  const [storages, setStorages] = useState<(SimpleStorage | Storage)[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<string[]>(["all"]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isShelfModalOpen, setShelfModalOpen] = useState<boolean>(false);
  const [isSortModalOpen, setSortModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("Expiration");
  const [isAscending, setIsAscending] = useState<boolean>(true);

  useEffect(() => {
    const fetchStoragesAndProducts = async () => {
      setIsLoading(true);
      try {
        const storagesResponse = await getStorages();
        const storagesApiResponse = storagesResponse as ApiResponse<Storage[]>;
        setStorages([
          { id: "all", name: "All Storages" },
          ...storagesApiResponse.data,
        ]);
        await fetchProducts(["all"]);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load storages and products");
        setIsLoading(false);
      }
    };
    fetchStoragesAndProducts();
  }, []);

  const fetchProducts = async (storageIds: string[]) => {
    setIsLoading(true);
    try {
      let allProducts: Product[] = [];

      if (storageIds.includes("all")) {
        const productsResponse = await getProducts();
        allProducts = (productsResponse as ApiResponse<Product[]>).data;
      } else {
        for (const storageId of storageIds) {
          const productsResponse = await getProductsByStorage(storageId);
          allProducts = allProducts.concat(
              (productsResponse as ApiResponse<Product[]>).data
          );
        }
      }

      const updatedProducts = allProducts.map((product) => {
        const today = new Date();
        const expirationDate = new Date(product.expirationDate);
        const daysLeft = Math.floor(
            (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        const categoryName = product.category?.name || "Unknown Category";
        const unitName = product.unit?.name || "Unknown Unit";

        return {
          ...product,
          daysLeft: Math.abs(daysLeft),
          isExpired: daysLeft < 0,
          categoryName,
          unitName,
        };
      });

      setProducts(updatedProducts);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setIsLoading(false);
    }
  };

  const handleStorageToggle = (storageId: string) => {
    setSelectedStorages((prevSelectedStorages) => {
      if (storageId === "all") {
        return ["all"];
      }

      const newSelected = prevSelectedStorages.includes(storageId)
          ? prevSelectedStorages.filter((id) => id !== storageId)
          : [...prevSelectedStorages, storageId];

      return newSelected.filter((id) => id !== "all");
    });
  };

  useEffect(() => {
    fetchProducts(selectedStorages);
  }, [selectedStorages]);

  const handleSortChange = (sortOption: string) => {
    if (sortOption === sortBy) {
      setIsAscending(!isAscending);
    } else {
      setSortBy(sortOption);
      setIsAscending(true);
    }
    setSortModalOpen(false);
  };

  const filteredProducts = products
      .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "Expiration") {
          if (a.isExpired && b.isExpired) {
            return isAscending ? b.daysLeft - a.daysLeft : a.daysLeft - b.daysLeft;
          } else if (a.isExpired) {
            return -1;
          } else if (b.isExpired) {
            return 1;
          }
          return isAscending ? a.daysLeft - b.daysLeft : b.daysLeft - a.daysLeft;
        } else if (sortBy === "Name") {
          return isAscending
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
        } else if (sortBy === "Category") {
          return isAscending
              ? a.categoryName.localeCompare(b.categoryName)
              : b.categoryName.localeCompare(a.categoryName);
        } else if (sortBy === "Quantity") {
          return isAscending ? a.quantity - b.quantity : b.quantity - a.quantity;
        } else {
          return isAscending
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

  return (
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-xl font-semibold text-center uppercase mb-4">
          Products
        </h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <button
              className="p-2 text-sm text-gray-600 focus:outline-none border rounded-lg sm:border-none"
              onClick={() => setShelfModalOpen(true)}
          >
            {selectedStorages.length === 0
                ? "Select Storages"
                : selectedStorages.length === storages.length - 1
                    ? "All Storages"
                    : `${selectedStorages.length} Selected`}
          </button>

          <button
              className="p-2 text-sm text-gray-600 focus:outline-none border rounded-lg sm:border-none"
              onClick={() => setSortModalOpen(true)}
          >
            Sort by: {sortBy} {isAscending ? <span>↑</span> : <span>↓</span>}
          </button>
        </div>

        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center border rounded-lg p-2 w-full sm:w-2/3">
            <CiSearch className="mr-2 text-gray-600" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="focus:outline-none text-sm w-full"
            />
          </div>
        </div>

        {isLoading ? (
            <div>Loading products and storages...</div>
        ) : error ? (
            <div className="text-red-500">{error}</div>
        ) : (
            <div className="flex flex-col space-y-4">
              {filteredProducts.map((product) => (
                  <div
                      key={product.id}
                      className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div>
                      <h3 className="font-semibold">
                        {product.name.length > 25
                            ? `${product.name.slice(0, 25)}...`
                            : product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.categoryName} | {product.quantity} {product.unitName}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">
                        {product.isExpired
                            ? `${product.daysLeft} Days Expired`
                            : `${product.daysLeft} Days Left`}
                      </p>
                      <div
                          className={`ml-2 w-3 h-3 rounded-full ${
                              product.isExpired
                                  ? "bg-red-500"
                                  : product.daysLeft <= 2
                                      ? "bg-red-500"
                                      : "bg-green-500"
                          }`}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        <Modal
            title="Select Storages"
            isOpen={isShelfModalOpen}
            onClose={() => setShelfModalOpen(false)}
        >
          <ul>
            {storages.map((storage) => (
                <li
                    key={storage.id}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleStorageToggle(storage.id)}
                >
                  <input
                      type="checkbox"
                      checked={selectedStorages.includes(storage.id)}
                      onChange={() => handleStorageToggle(storage.id)}
                      className={`mr-2 h-3 w-3  border-primaryColor appearance-none checked:bg-primaryColor checked:border-primaryColor focus:outline-none`}
                  />
                  {storage.name}
                </li>
            ))}
          </ul>

        </Modal>

        <Modal
            title="Sort by"
            isOpen={isSortModalOpen}
            onClose={() => setSortModalOpen(false)}
        >
          <ul>
            <li
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSortChange("Expiration")}
            >
              Expiration
            </li>
            <li
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSortChange("Name")}
            >
              Name
            </li>
            <li
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSortChange("Category")}
            >
              Category
            </li>
            <li
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSortChange("Quantity")}
            >
              Quantity
            </li>
          </ul>
        </Modal>
      </div>
  );
};

export default ProductTable;
