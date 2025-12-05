import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [sortType, setSortType] = useState("relevant");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggle = (value, setter, list) => {
    setter(
      list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value]
    );
  };

  const applyFilter = () => {
    let copy = [...products];

    if (showSearch && search) {
      copy = copy.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      copy = copy.filter((i) => category.includes(i.category));
    }

    if (sizes.length > 0) {
      copy = copy.filter((i) => sizes.includes(i.size));
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
    setCategory([]);
    setSizes([]);
  };

  useEffect(() => applyFilter(), [category, sizes, search, showSearch, products]);
  useEffect(() => applySort(), [sortType]);

  return (
    <div className="px-4 py-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <Title text1="MEN'S" text2="COLLECTION" />

        {/* Filter button stays clean — no borders */}
        <button
          onClick={() => setFilterOpen(true)}
          className="px-3 py-2 rounded-lg bg-gray-100 text-sm text-gray-800"
        >
          Filters
        </button>
      </div>

      {/* SORT DROPDOWN — outer button clean */}
      <div className="relative w-full">
        <div
          onClick={() => setSortOpen(!sortOpen)}
          className="
            w-full p-3 rounded-lg 
            bg-gray-100 text-gray-800 text-sm 
            flex justify-between items-center cursor-pointer
          "
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

        {/* Dropdown menu — inside items get square borders */}
        {sortOpen && (
          <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-20">

            <button
              onClick={() => { setSortType("relevant"); setSortOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200"
            >
              Relevant
            </button>

            <button
              onClick={() => { setSortType("low-high"); setSortOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200"
            >
              Price: Low → High
            </button>

            <button
              onClick={() => { setSortType("high-low"); setSortOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Price: High → Low
            </button>

          </div>
        )}
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        ) : (
          <p className="col-span-full text-center mt-10 text-gray-500">
            No products found.
          </p>
        )}
      </div>

      {/* FILTER MODAL */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-end sm:items-center z-40">
          <div className="bg-white w-full sm:w-[420px] rounded-t-xl sm:rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>

            {/* CATEGORY — minimal square borders */}
            <p className="text-sm font-medium text-gray-700">Category</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Hoodies", "Zippers", "Jackets", "Wind Jackets", "Vintage & Rare"].map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(c, setCategory, category)}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    border border-gray-300
                    ${category.includes(c) ? "bg-black text-white" : "bg-white text-gray-800"}
                  `}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* SIZE — same minimal style */}
            <p className="text-sm font-medium text-gray-700 mt-5">Sizes</p>
            <div className="flex gap-2 mt-2">
              {["S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s, setSizes, sizes)}
                  className={`
                    px-3 py-1 rounded-md text-sm
                    border border-gray-300
                    ${sizes.includes(s) ? "bg-black text-white" : "bg-white text-gray-800"}
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
                className="px-4 py-2 rounded-md bg-gray-100 text-sm"
              >
                Reset
              </button>

              <button
                onClick={() => setFilterOpen(false)}
                className="px-6 py-2 rounded-md bg-black text-white text-sm"
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
