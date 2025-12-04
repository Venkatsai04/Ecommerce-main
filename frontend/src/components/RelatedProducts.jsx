import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ currentProductId }) => {
  const { products } = useContext(ShopContext);

  // Pick 4 random products except the current one
  const related = useMemo(() => {
    const filtered = products.filter(p => p._id !== currentProductId);

    // Shuffle
    const shuffled = filtered.sort(() => 0.5 - Math.random());

    // Return 4 random
    return shuffled.slice(0, 4);
  }, [products, currentProductId]);

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold mb-6">You may also like</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
