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
      {/* TABLE WRAPPER */}
      <div className="min-w-[900px] flex flex-col gap-2">

        {/* HEADER */}
        <div className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.7fr_0.5fr_0.5fr_0.3fr] 
                        items-center py-2 px-3 border bg-gray-200 
                        text-base md:text-lg font-semibold text-center">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Category</span>
          <span>Subcategory</span>
          <span>Price</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* PRODUCT ROWS */}
        {listProducts.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.7fr_0.5fr_0.5fr_0.3fr]
                       items-center gap-2 py-2 px-3 border-b text-sm md:text-base 
                       text-center hover:bg-gray-50 transition"
          >
            {/* IMAGE */}
            <img
              className="w-12 h-12 object-cover rounded mx-auto"
              src={item?.image?.[0]}
              alt={item?.name}
            />

            {/* NAME */}
            <p className="text-left font-semibold truncate">{item.name}</p>

            {/* DESCRIPTION */}
            <p className="text-left text-gray-700 truncate">{item.description}</p>

            {/* CATEGORY */}
            <p>{item.category}</p>

            {/* SUBCATEGORY */}
            <p>{item.subCategory}</p>

            {/* PRICE */}
            <p className="font-semibold">{currency(item.price)}</p>

            {/* STOCK STATUS */}
            <p
              className={`font-bold ${
                item.soldOut ? "text-red-600" : "text-green-600"
              }`}
            >
              {item.soldOut ? "Sold Out" : "In Stock"}
            </p>

            {/* DELETE BUTTON */}
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
