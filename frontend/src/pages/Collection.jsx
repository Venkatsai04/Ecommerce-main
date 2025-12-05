import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products } = useContext(ShopContext);

  const [filtered, setFiltered] = useState([]);

  // filters
  const [selectedTypes, setSelectedTypes] = useState([]); // Hoodie, Jacket etc.
  const [selectedSizes, setSelectedSizes] = useState([]); // ["S","M"]
  const [sortType, setSortType] = useState("relevant");

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // toggle helper
  const toggle = (value, setter, list) => {
    setter(
      list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value]
    );
  };

  // filtering logic
  const applyFilter = () => {
    let copy = [...products];

    // filter by product type (subCategory)
    if (selectedTypes.length > 0) {
      copy = copy.filter((item) =>
        selectedTypes.includes(item.subCategory)
      );
    }

    // filter by sizes
    if (selectedSizes.length > 0) {
      copy = copy.filter((item) =>
        item.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    setFiltered(copy);
  };

  const applySort = () => {
    if (sortType === "low-high") {
      setFiltered((prev) => [...prev].sort((a, b) => a.price - b.price));
    } else if (sortType === "high-low") {
      setFiltered((prev) => [...prev].sort((a, b) => b.price - a.price));
    } else {
      applyFilter();
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedSizes([]);
  };

  useEffect(() => applyFilter(), [products, selectedTypes, selectedSizes]);
  useEffect(() => applySort(), [sortType]);

  return (
    <div className="px-4 py-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <Title text1="MEN'S" text2="COLLECTION" />

        {/* Clean outer button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-700"
        >
          Filters
        </button>
      </div>

      {/* SORT BOX (outer clean, inner thin borders) */}
      <div className="relative w-full">
        <div
          onClick={() => setSortOpen(!sortOpen)}
          className="w-full p-3 rounded-md bg-gray-100 
                     text-gray-900 text-sm cursor-pointer flex justify-between items-center"
        >
          <span>
            {sortType === "relevant"
              ? "Sort by: Relevant"
              : sortType === "low-high"
              ? "Sort by: Low → High"
              : "Sort by: High → Low"}
          </span>
          <span className="text-lg">▾</span>
        </div>

        {sortOpen && (
          <div className="absolute left-0 w-full bg-white border border-gray-300 
                          rounded-md mt-1 z-20">

            <button
              onClick={() => {
                setSortType("relevant");
                setSortOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200"
            >
              Relevant
            </button>

            <button
              onClick={() => {
                setSortType("low-high");
                setSortOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200"
            >
              Price: Low → High
            </button>

            <button
              onClick={() => {
                setSortType("high-low");
                setSortOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Price: High → Low
            </button>
          </div>
        )}
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No products found.
          </p>
        )}
      </div>

      {/* FILTER MODAL */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-end sm:items-center z-40">

          <div className="bg-white w-full sm:w-[420px] rounded-t-xl sm:rounded-xl p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>

            {/* TYPE FILTER */}
            <p className="text-sm font-medium text-gray-700">Product Type</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Hoodie", "Zipper", "Jacket", "Wind Jacket", "Vintage"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t, setSelectedTypes, selectedTypes)}
                  className={`
                    px-3 py-1 text-sm 
                    border border-gray-400 
                    ${
                      selectedTypes.includes(t)
                        ? "bg-black text-white"
                        : "bg-white text-gray-800"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* SIZE FILTER */}
            <p className="text-sm font-medium text-gray-700 mt-5">Sizes</p>

            <div className="flex gap-2 mt-2">
              {["S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s, setSelectedSizes, selectedSizes)}
                  className={`
                    px-3 py-1 text-sm 
                    border border-gray-400 
                    ${
                      selectedSizes.includes(s)
                        ? "bg-black text-white"
                        : "bg-white text-gray-800"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-8">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-sm"
              >
                Reset
              </button>

              <button
                onClick={() => setFilterOpen(false)}
                className="px-6 py-2 bg-black text-white text-sm"
              >
                Apply
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Collection;
