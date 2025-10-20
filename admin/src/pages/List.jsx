import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);

  // Fetch products
  const fetchListProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product list.");
    }
  };

  // Remove product
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.info(response.data.message);
        fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product.");
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      {/* Table container with horizontal scroll on mobile */}
      <div className="min-w-[800px] flex flex-col gap-2">
        {/* Table Header */}
        <div className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.7fr_0.5fr_0.3fr] items-center py-2 px-3 border bg-gray-200 text-base md:text-lg font-semibold text-center">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Category</span>
          <span>Subcategory</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        {/* Product Rows */}
        {listProducts.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.7fr_0.5fr_0.3fr] items-center gap-2 py-2 px-3 border-b text-sm md:text-base text-center hover:bg-gray-50 transition"
          >
            <img
              className="w-12 h-12 object-cover rounded mx-auto"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="text-left font-semibold truncate">{item.name}</p>
            <p className="text-left text-gray-700 truncate">{item.description}</p>
            <p>{item.category}</p>
            <p>{item.subCategory}</p>
            <p className="font-semibold">{currency(item.price)}</p>
            <button
              onClick={() => removeProduct(item._id)}
              className="bg-red-500 text-white rounded-full px-2 py-1 text-sm hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
