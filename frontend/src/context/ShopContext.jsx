import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:4000/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);

  // IMPORTANT: token must be state
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const currency = "₹";

  // Sync token on page reload
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored !== token) setToken(stored);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/product/list`);
        if (res.data.success) setProducts(res.data.products);
      } catch (err) {
        toast.error("Error fetching products");
      }
    };
    fetchProducts();
  }, []);

  // ✅ FIXED CART LOAD (NO MORE NULL ERRORS, NO EMPTY CART)
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${backendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const backendCart = {};

          res.data.cart.items.forEach((item) => {
            // SAFE CHECKS
            if (!item.productId || !item.productId._id) {
              console.warn("Skipping invalid cart item:", item);
              return;
            }

            const pid = item.productId._id;
            const size = item.size;
            const qty = item.quantity;

            if (!backendCart[pid]) backendCart[pid] = {};
            backendCart[pid][size] = qty;
          });

          setCartItems(backendCart);
        }
      } catch (err) {
        console.error("Cart load error:", err);
      }
    };

    fetchCart();
  }, [token]);

  // -------------------------------
  // Add to Cart
  // -------------------------------
  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) {
      navigate("/login");
      toast.error("Login to add items");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/cart/add`,
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) => {
        const newCart = { ...prev };
        if (!newCart[productId]) newCart[productId] = {};
        newCart[productId][size] = (newCart[productId][size] || 0) + quantity;
        return newCart;
      });

      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // -------------------------------
  // Update cart item quantity
  // -------------------------------
  const updateCartItem = async (productId, size, newQty) => {
    if (!token) return toast.error("Login required");

    try {
      const currentQty = cartItems[productId]?.[size] || 0;

      if (newQty === 0) {
        await axios.post(
          `${backendUrl}/cart/remove`,
          { productId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (newQty > currentQty) {
        await axios.post(
          `${backendUrl}/cart/add`,
          { productId, size, quantity: newQty - currentQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (newQty < currentQty) {
        await axios.post(
          `${backendUrl}/cart/remove`,
          { productId, size, quantity: currentQty - newQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Update frontend state
      setCartItems((prev) => {
        const cart = { ...prev };

        if (newQty === 0) {
          delete cart[productId][size];
          if (Object.keys(cart[productId]).length === 0)
            delete cart[productId];
        } else {
          if (!cart[productId]) cart[productId] = {};
          cart[productId][size] = newQty;
        }

        return cart;
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update cart");
    }
  };

  // Remove item
  const removeCartItem = (productId, size) =>
    updateCartItem(productId, size, 0);

  // Cart totals
  const getCartCount = () => {
    let total = 0;
    Object.values(cartItems).forEach((sizes) =>
      Object.values(sizes).forEach((qty) => (total += qty))
    );
    return total;
  };

  const getCartAmount = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([pid, sizes]) => {
      const p = products.find((pr) => pr._id === pid);
      if (!p) return;
      Object.values(sizes).forEach((qty) => (total += p.price * qty));
    });
    return total;
  };

  const value = {
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartCount,
    getCartAmount,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
