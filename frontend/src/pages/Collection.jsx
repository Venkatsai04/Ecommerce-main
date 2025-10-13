import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // ✅ Toggle category filters
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // ✅ Apply filters based on search + category
  const applyFilter = () => {
    let productsCopy = products.slice();

    // Search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter (Designer, Elegant, Hanging, Minimalist)
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    setFilterProducts(productsCopy);
  };

  // ✅ Sorting logic
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  // ✅ Clear filters
  const clearFilters = () => {
    setCategory([]);
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10 bg-white min-h-screen">
      {/* FILTER PANEL */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 my-2 text-xl font-semibold cursor-pointer text-gray-700"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="Dropdown"
          />
        </p>

        {/* Category Filters */}
        <div
          className={`border border-gray-200 rounded-xl shadow-sm pl-5 py-3 mt-6 transition-all ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium text-gray-800">DIYAS CATEGORY</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            {["Designer Diyas", "Elegant Diyas", "Hanging Diyas", "Minimalist Diyas"].map(
              (cat) => (
                <label key={cat} className="flex gap-2 cursor-pointer">
                  <input
                    className="w-3 accent-yellow-500"
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                  />
                  {cat}
                </label>
              )
            )}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          className={`px-4 py-2 mt-3 text-sm font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-orange-400 to-yellow-400 hover:opacity-90 transition-all ${
            showFilter ? "block" : "hidden"
          } sm:block`}
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="flex-1 px-4">
        <div className="flex justify-between mb-4 text-base sm:text-2xl items-center">
          <Title text1={"DIWALI"} text2={"COLLECTIONS"} />
          {/* Sort Dropdown */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))
          ) : (
            <p className="col-span-full mt-10 text-center text-gray-500">
              No diyas found in this category 🎇
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
