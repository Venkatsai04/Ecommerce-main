import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);
  const [womenExclusive, setWomenExclusive] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 4));

      const women = products.filter(
        (item) => item.category === "Women"
      );
      setWomenExclusive(women.slice(0, 4));
    }
  }, [products]);

  return (
    <div className="my-10">

      {/* ================= LATEST COLLECTION ================= */}
      <div className="py-8 text-3xl text-center">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
         Step into a world of style with our newest collections — curated to bring you the finest in fashion for Finest Men. 
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            mrp={item.mrp}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-12">
        <Link to="/collection?gender=Men">
          <button className="bg-black text-white px-8 py-3 text-sm font-semibold">
            Explore Men's Collection
          </button>
        </Link>
      </div>

      {/* ================= WOMEN EXCLUSIVE ================= */}
      {womenExclusive.length > 0 && (
        <>
          <div className="py-12 text-3xl text-center mt-16">
            <Title text1="WOMEN" text2="EXCLUSIVE" />
            <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
              Curated styles exclusively for women.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {womenExclusive.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                mrp={item.mrp}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link to="/collection?gender=Women">
              <button className="bg-black text-white px-8 py-3 text-sm font-semibold">
                Explore Women's Collection
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LatestCollection;
