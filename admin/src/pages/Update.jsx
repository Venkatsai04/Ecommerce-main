import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Update = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([null, null, null, null]);

  const PRODUCT_TYPES = ["Hoodie", "Zipper", "Jacket", "Wind Jacket", "Vintage"];

  // Fetch list
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list`);
        if (res.data.success) setProducts(res.data.products);
      } catch (err) {
        toast.error("Error fetching products");
      }
    };
    fetchList();
  }, []);

  const loadProduct = async (id) => {
    try {
      const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
      const p = res.data.product;

      setSelected(id);
      setName(p.name);
      setDescription(p.description);
      setCategory(p.category);
      setSubCategory(p.subCategory);
      setPrice(p.price);
      setSizes(p.sizes);
      setBestSeller(p.bestSeller);
      setSoldOut(p.soldOut || false);
      setExistingImages(p.image);
      setNewImages([null, null, null, null]);
    } catch {
      toast.error("Failed to load product");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", selected);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("price", price);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("bestSeller", bestSeller);
    formData.append("soldOut", soldOut);
    formData.append("existingImages", JSON.stringify(existingImages));

    newImages.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    try {
      const res = await axios.post(`${backendUrl}/api/product/update`, formData, {
        headers: { token },
      });

      if (res.data.success) toast.success("Product Updated Successfully");
      else toast.error("Update failed");
    } catch {
      toast.error("Error updating product");
    }
  };

  return (
    <div className="w-full flex flex-col gap-10">

      {/* PRODUCT GRID */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Select a Product to Update</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => loadProduct(p._id)}
              className={`border rounded-lg p-2 cursor-pointer transition hover:shadow 
              ${selected === p._id ? "border-black shadow-md" : "border-gray-300"}`}
            >
              <img
                src={p.image[0]}
                className="w-full aspect-square object-cover rounded-md"
              />
              <p className="font-medium text-sm mt-2 truncate">{p.name}</p>
              <p className="text-xs text-gray-600">₹{p.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UPDATE FORM */}
      {selected && (
        <form
          onSubmit={updateProduct}
          className="bg-white p-5 sm:p-6 rounded-xl shadow flex flex-col gap-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold border-b pb-2">
            Update Product
          </h2>

          {/* EXISTING IMAGES */}
          <div>
            <p className="font-medium mb-2">Existing Images</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full aspect-square rounded-md border object-cover"
                />
              ))}
            </div>
          </div>

          {/* NEW IMAGE UPLOAD */}
          <div>
            <p className="font-medium mb-2">Upload New Images (Optional)</p>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {newImages.map((img, i) => (
                <label key={i}>
                  <img
                    src={!img ? assets.upload_area : URL.createObjectURL(img)}
                    className="w-full aspect-square border rounded-md object-cover cursor-pointer"
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const arr = [...newImages];
                      arr[i] = e.target.files[0];
                      setNewImages(arr);
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* NAME + PRICE */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm">Product Name</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-medium text-sm">Price (₹)</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium text-sm">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* CATEGORY + TYPE */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm">Category</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-sm">Product Type</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SIZES */}
          <div>
            <p className="font-medium text-sm mb-1">Sizes</p>
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
                  className={`px-4 py-1 border rounded-md text-sm ${
                    sizes.includes(s)
                      ? "bg-black text-white"
                      : "text-gray-700 border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={bestSeller}
                onChange={() => setBestSeller(!bestSeller)}
              />
              Best Seller
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={soldOut}
                onChange={() => setSoldOut(!soldOut)}
              />
              Sold Out
            </label>
          </div>

          <button
            type="submit"
            className="bg-black text-white py-2 rounded-md w-full sm:w-auto px-6 text-sm"
          >
            Update Product
          </button>
        </form>
      )}
    </div>
  );
};

export default Update;
