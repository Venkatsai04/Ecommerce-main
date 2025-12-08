// src/context/ShopContext.jsx
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_PORT || "http://localhost:4000/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const currency = "₹";

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && stored !== token) setToken(stored);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/product/list`);
        if (res.data?.success) setProducts(res.data.products || []);
      } catch (err) {
        console.error("fetchProducts err:", err);
        toast.error("Error fetching products");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${backendUrl}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && Array.isArray(res.data.cart?.items)) {
          const backendCart = {};
          res.data.cart.items.forEach((item) => {
            if (!item.productId || !item.productId._id) return;
            const pid = item.productId._id;
            const size = item.size;
            const qty = item.quantity;
            if (!backendCart[pid]) backendCart[pid] = {};
            backendCart[pid][size] = qty;
          });
          setCartItems(backendCart);
        }
      } catch (err) {
        console.error("fetchCart err:", err);
      }
    };
    fetchCart();
  }, [token]);

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
        const updated = { ...prev };
        if (!updated[productId]) updated[productId] = {};
        updated[productId][size] = (updated[productId][size] || 0) + quantity;
        return updated;
      });
      toast.success("Added to cart");
    } catch (err) {
      console.error("addToCart err:", err);
      toast.error("Failed to add to cart");
    }
  };

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

      setCartItems((prev) => {
        const updated = { ...prev };
        if (newQty === 0) {
          if (updated[productId]) {
            delete updated[productId][size];
            if (Object.keys(updated[productId]).length === 0) delete updated[productId];
          }
        } else {
          if (!updated[productId]) updated[productId] = {};
          updated[productId][size] = newQty;
        }
        return updated;
      });
    } catch (err) {
      console.error("updateCartItem err:", err);
      toast.error("Failed to update cart");
    }
  };

  const removeCartItem = (productId, size) => updateCartItem(productId, size, 0);

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
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
