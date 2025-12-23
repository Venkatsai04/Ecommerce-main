import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useLocation, useNavigate } from "react-router-dom";

const Collection = () => {
  const { products } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [filtered, setFiltered] = useState([]);

  // FILTER STATES (ORIGINAL)
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // ✅ NEW: STOCK FILTER
  const [stockFilter, setStockFilter] = useState("all"); // all | in | out

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  /* ================= LOAD FILTERS FROM URL ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const gender = params.get("gender");
    const types = params.get("types");
    const sizes = params.get("sizes");
    const sort = params.get("sort");
    const stock = params.get("stock"); // ✅ NEW

    if (gender) setSelectedGender(gender.split(","));
    if (types) setSelectedTypes(types.split(","));
    if (sizes) setSelectedSizes(sizes.split(","));
    if (sort) setSortType(sort);
    if (stock) setStockFilter(stock); // ✅ NEW
  }, []);
  /* ========================================================= */

  /* ================= UPDATE URL WHEN FILTERS CHANGE ================= */
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedGender.length) params.set("gender", selectedGender.join(","));
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));
    if (selectedSizes.length) params.set("sizes", selectedSizes.join(","));
    if (sortType !== "relevant") params.set("sort", sortType);
    if (stockFilter !== "all") params.set("stock", stockFilter); // ✅ NEW

    navigate({ search: params.toString() }, { replace: true });
  }, [
    selectedGender,
    selectedTypes,
    selectedSizes,
    sortType,
    stockFilter,
  ]);
  /* ================================================================== */

  const toggle = (value, setter, list) => {
    setter(
      list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value]
    );
  };

  /* ================= FILTERING ================= */
  useEffect(() => {
    let copy = [...products];

    if (selectedGender.length) {
      copy = copy.filter((item) =>
        selectedGender.includes(item.category)
      );
    }

    if (selectedTypes.length) {
      copy = copy.filter((item) =>
        selectedTypes.includes(item.subCategory)
      );
    }

    if (selectedSizes.length) {
      copy = copy.filter((item) =>
        item.sizes?.some((s) => selectedSizes.includes(s))
      );
    }

    // ✅ NEW: STOCK FILTER LOGIC
    if (stockFilter === "in") {
      copy = copy.filter((item) => !item.soldOut);
    }
    if (stockFilter === "out") {
      copy = copy.filter((item) => item.soldOut);
    }

    // SORTING (ORIGINAL)
    if (sortType === "latest") {
      copy.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b._id.localeCompare(a._id);
      });
    } else if (sortType === "low-high") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      copy.sort((a, b) => b.price - a.price);
    }

    setFiltered(copy);
  }, [
    products,
    selectedGender,
    selectedTypes,
    selectedSizes,
    sortType,
    stockFilter, // ✅ NEW
  ]);
  /* ======================================================== */

  const clearFilters = () => {
    setSelectedGender([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSortType("relevant");
    setStockFilter("all"); // ✅ NEW
    navigate("/collection", { replace: true });
  };

  return (
    <div className="px-4 py-6 bg-white min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <Title text1="OUR" text2="COLLECTION" />
        <button
          onClick={() => setFilterOpen(true)}
          className="px-3 py-2 rounded-md bg-gray-100 text-sm"
        >
          Filters
        </button>
      </div>

      {/* SORT (UNCHANGED) */}
      <div className="relative">
        <div
          onClick={() => setSortOpen(!sortOpen)}
          className="p-3 bg-gray-100 rounded-md flex justify-between cursor-pointer"
        >
          <span>
            {sortType === "relevant"
              ? "Sort: Relevant"
              : sortType === "latest"
              ? "Sort: Latest"
              : sortType === "low-high"
              ? "Sort: Low → High"
              : "Sort: High → Low"}
          </span>
          <span>▾</span>
        </div>

        {sortOpen && (
          <div className="absolute w-full bg-white border rounded-md z-20">
            {[
              { k: "relevant", t: "Relevant" },
              { k: "latest", t: "Latest" },
              { k: "low-high", t: "Low → High" },
              { k: "high-low", t: "High → Low" },
            ].map((o) => (
              <button
                key={o.k}
                onClick={() => {
                  setSortType(o.k);
                  setSortOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {o.t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {filtered.length ? (
          filtered.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              mrp={item.mrp}
              soldOut={item.soldOut} // ✅ REQUIRED
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No products found
          </p>
        )}
      </div>

      {/* FILTER MODAL */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-end sm:items-center z-40">
          <div className="bg-white w-full sm:w-[420px] p-6 rounded-t-xl sm:rounded-xl">

            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>

            {/* Gender (UNCHANGED) */}
            <p className="font-medium">Gender</p>
            <div className="flex gap-2 mt-2">
              {["Men", "Women"].map((g) => (
                <button
                  key={g}
                  onClick={() => toggle(g, setSelectedGender, selectedGender)}
                  className={`px-3 py-1 border rounded ${
                    selectedGender.includes(g)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Product Type (UNCHANGED) */}
            <p className="font-medium mt-5">Product Type</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Hoodie", "Zipper", "Jacket", "Wind Jacket", "Vintage"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t, setSelectedTypes, selectedTypes)}
                  className={`px-3 py-1 border rounded ${
                    selectedTypes.includes(t)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Sizes (UNCHANGED) */}
            <p className="font-medium mt-5">Sizes</p>
            <div className="flex gap-2 mt-2">
              {["S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s, setSelectedSizes, selectedSizes)}
                  className={`px-3 py-1 border rounded ${
                    selectedSizes.includes(s)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ✅ NEW: AVAILABILITY */}
            <p className="font-medium mt-5">Availability</p>
            <div className="flex gap-2 mt-2">
              {[
                { k: "all", t: "All" },
                { k: "in", t: "In Stock" },
                { k: "out", t: "Out of Stock" },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => setStockFilter(o.k)}
                  className={`px-3 py-1 border rounded ${
                    stockFilter === o.k
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={clearFilters} className="px-4 py-2 bg-gray-100">
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="px-6 py-2 bg-black text-white"
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
