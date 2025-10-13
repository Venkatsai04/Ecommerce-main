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

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    setFilterProducts(productsCopy);
  };

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

  const clearFilters = () => setCategory([]);

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t bg-white min-h-screen px-4 sm:px-8">
      {/* FILTER PANEL */}
      <div className="sm:min-w-60">
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between sm:justify-start gap-2 my-2 text-lg sm:text-xl font-semibold cursor-pointer text-gray-700"
        >
          <p>FILTERS</p>
          <img
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt="Dropdown"
          />
        </div>

        {/* Category Filters */}
        <div
          className={`border border-gray-200 rounded-xl shadow-sm pl-5 py-3 mt-4 transition-all duration-300 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-semibold text-gray-800">
            DIYAS CATEGORY
          </p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-600">
            {[
              "Designer Diyas",
              "Elegant Diyas",
              "Hanging Diyas",
              "Minimalist Diyas",
            ].map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-3 accent-yellow-500"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className={`px-4 py-2 mt-4 text-sm font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-orange-400 to-yellow-400 hover:opacity-90 transition-all duration-300 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          Clear Filters
        </button>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <Title text1={"DIWALI"} text2={"COLLECTIONS"} />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
            <p className="col-span-full mt-10 text-center text-gray-500 text-sm sm:text-base">
              No diyas found in this category 🎇
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
