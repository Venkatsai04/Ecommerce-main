import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_PORT;

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ⭐ GET TOKEN LIVE FROM AUTH CONTEXT (the BIG FIX)
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const currency = "₹";

  // FETCH PRODUCTS
  useEffect(() => {
    axios.get(`${backendUrl}/product/list`)
      .then((res) => {
        if (res.data.success) setProducts(res.data.products);
      })
      .catch(() => toast.error("Error fetching products"));
  }, []);

  // ⭐ LOAD CART EVERY TIME TOKEN CHANGES (Automatically fix login bug)
  useEffect(() => {
    if (!token) return;

    axios.get(`${backendUrl}/cart`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      if (!res.data.success) return;

      const backendCart = {};
      res.data.cart.items.forEach((item) => {
        const pid = item.productId?._id;
        if (!pid) return;

        const size = item.size;
        const qty = item.quantity;

        if (!backendCart[pid]) backendCart[pid] = {};
        backendCart[pid][size] = qty;
      });

      setCartItems(backendCart);
    })
    .catch(() => {});
  }, [token]); // ⭐ When token updates → cart loads correctly!

  const forceLogin = () => {
    toast.error("Please login first");
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) return forceLogin();

    await axios.post(`${backendUrl}/cart/add`,
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
  };

  const updateCartItem = async (productId, size, newQty) => {
    if (!token) return forceLogin();

    const currentQty = cartItems[productId]?.[size] || 0;

    if (newQty === 0) {
      await axios.post(`${backendUrl}/cart/remove`,
        { productId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else if (newQty > currentQty) {
      await axios.post(`${backendUrl}/cart/add`,
        { productId, size, quantity: newQty - currentQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(`${backendUrl}/cart/remove`,
        { productId, size, quantity: currentQty - newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setCartItems((prev) => {
      const updated = { ...prev };

      if (newQty === 0) {
        delete updated[productId][size];
        if (Object.keys(updated[productId]).length === 0)
          delete updated[productId];
      } else {
        if (!updated[productId]) updated[productId] = {};
        updated[productId][size] = newQty;
      }

      return updated;
    });
  };

  const removeCartItem = (productId, size) =>
    updateCartItem(productId, size, 0);

  const getCartCount = () => {
    let total = 0;
    Object.values(cartItems).forEach((sizes) =>
      Object.values(sizes).forEach((qty) => (total += qty))
    );
    return total;
  };

  const getCartAmount = () => {
    let total = 0;

    for (const pid in cartItems) {
      const product = products.find((p) => p._id === pid);
      if (!product) continue;

      for (const qty of Object.values(cartItems[pid])) {
        total += product.price * qty;
      }
    }
    return total;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        currency,
        cartItems,
        addToCart,
        updateCartItem,
        removeCartItem,
        getCartCount,
        getCartAmount,
        navigate,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
