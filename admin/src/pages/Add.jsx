import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        Add New Product
      </h2>

      {/* Upload Section */}
      <div>
        <p className="text-gray-700 mb-3 font-medium">
          Upload Product Images (up to 4)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img
                className="w-[full] aspect-square border-2 border-dashed border-gray-300 rounded-xl object-cover cursor-pointer hover:border-gray-500 transition"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt="Upload"
              />
              <input
                onChange={(e) =>
                  [setImage1, setImage2, setImage3, setImage4][i](
                    e.target.files[0]
                  )
                }
                type="file"
                id={`image${i + 1}`}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 outline-none"
            type="text"
            placeholder="Enter Product Name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Product Price (₹)
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 outline-none"
            type="number"
            placeholder="Enter Price"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1 font-medium">
          Product Description
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-slate-400 outline-none"
          placeholder="Write a short description..."
          required
        />
      </div>

      {/* Category & Subcategory */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Category
          </label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 outline-none"
            required
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Sub Category
          </label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 outline-none"
            required
          >
            <option value="">Select Sub Category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-gray-700 mb-2 font-medium">Available Sizes</p>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-1 border rounded-md ${
                sizes.includes(size)
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-gray-700 border-gray-300"
              } transition`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Best Seller Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
          className="h-4 w-4 text-slate-700 accent-slate-700"
        />
        <label htmlFor="bestSeller" className="text-gray-700 cursor-pointer">
          Add to Best Seller
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-3">
        <button
          type="submit"
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Add Product
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 border border-slate-400 text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default Add;
