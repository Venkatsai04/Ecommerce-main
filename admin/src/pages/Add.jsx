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
  const [category, setCategory] = useState("");      // MUST NOT be empty on submit
  const [subCategory, setSubCategory] = useState(""); // MUST NOT be empty
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  // All product types your store supports
  const PRODUCT_TYPES = [
    "Hoodie",
    "Zipper",
    "Jacket",
    "Wind Jacket",
    "Vintage",
  ];

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
    setMrp("");
    setSizes([]);
    setBestSeller(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // FRONTEND SAFETY CHECKS (prevents blank submission)
    if (!category) return toast.error("Please select category");
    if (!subCategory) return toast.error("Please select product type");

    try {
      const formData = new FormData();
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("mrp", mrp);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product Added Successfully");
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("ERROR ADDING PRODUCT:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
        Add New Product
      </h2>

      {/* IMAGE UPLOADS */}
      <div>
        <p className="text-gray-700 mb-2 font-medium">
          Upload Product Images (max 4)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img
                className="w-full aspect-square border border-gray-300 rounded-md object-cover cursor-pointer"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt="upload"
              />
              <input
                type="file"
                hidden
                id={`image${i + 1}`}
                accept="image/*"
                onChange={(e) =>
                  [setImage1, setImage2, setImage3, setImage4][i](
                    e.target.files[0]
                  )
                }
              />
            </label>
          ))}
        </div>
      </div>

      {/* NAME + PRICE */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-700 mb-1 block">Product Name</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-gray-700 mb-1 block">Price (₹)</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
          <label className="text-gray-700 mb-1 block">Mrp (₹)</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            required
          />
        </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-gray-700 mb-1 block">Description</label>
        <textarea
          className="w-full border rounded-md px-3 py-2 h-24 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* CATEGORY + TYPE */}
      <div className="grid sm:grid-cols-2 gap-4">
        
        {/* CATEGORY */}
        <div>
          <label className="text-gray-700 mb-1 block">Category</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(""); // reset product type
            }}
            required
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>

        {/* PRODUCT TYPE */}
        <div>
          <label className="text-gray-700 mb-1 block">Product Type</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select Type</option>

            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SIZES */}
      <div>
        <p className="text-gray-700 mb-2 font-medium">Available Sizes</p>

        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(s)
                    ? prev.filter((x) => x !== s)
                    : [...prev, s]
                )
              }
              className={`px-4 py-1 border ${
                sizes.includes(s)
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* BEST SELLER */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          onChange={() => setBestSeller(!bestSeller)}
        />
        <label htmlFor="bestSeller" className="text-gray-700">
          Add to Best Seller
        </label>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-md"
        >
          Add Product
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 border border-gray-400 rounded-md"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default Add;
