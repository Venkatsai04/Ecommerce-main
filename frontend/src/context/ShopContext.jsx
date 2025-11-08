import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:4000/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const currency = "₹";
  const token = localStorage.getItem("token");

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

  // Fetch user cart
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
            if (!backendCart[item.productId._id]) backendCart[item.productId._id] = {};
            backendCart[item.productId._id][item.size] = item.quantity;
          });
          setCartItems(backendCart);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [token]);

  // Add to cart
  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) {
      navigate('/login');
      toast.error("Login to add items to cart");
      return;
    } 

    try {
      await axios.post(
        `${backendUrl}/cart/add`,
        { productId, quantity, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) => {
        const newCart = { ...prev };
        if (!newCart[productId]) newCart[productId] = {};
        newCart[productId][size] = (newCart[productId][size] || 0) + quantity;
        return newCart;
      });

      toast.success("Item added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item to cart");
    }
  };


// Update cart item to exact quantity
const updateCartItem = async (productId, size, newQty) => {
  if (!token) return toast.error("Login to manage cart");

  try {
    const currentQty = cartItems[productId]?.[size] || 0;

    if (newQty === 0) {
      // DELETE route - remove entire item
      await axios.post(
        `${backendUrl}/cart/remove`,
        { productId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else if (newQty > currentQty) {
      // ADD route - increasing quantity
      const quantityDiff = newQty - currentQty;
      await axios.post(
        `${backendUrl}/cart/add`,
        { productId, quantity: quantityDiff, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else if (newQty < currentQty) {
      // REMOVE route - decreasing quantity
      const quantityDiff = currentQty - newQty;
      await axios.post(
        `${backendUrl}/cart/remove`,
        { productId, size, quantity: quantityDiff },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // Update frontend state
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[productId][size];
        if (Object.keys(newCart[productId]).length === 0) delete newCart[productId];
      } else {
        if (!newCart[productId]) newCart[productId] = {};
        newCart[productId][size] = newQty;
      }
      return newCart;
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to update cart");
  }
};


  // Remove cart item
  const removeCartItem = (productId, size) => updateCartItem(productId, size, 0);

  // Get total count
  const getCartCount = () => {
    let total = 0;
    Object.values(cartItems).forEach((sizes) =>
      Object.values(sizes).forEach((qty) => (total += qty))
    );
    return total;
  };

  // Get total amount
  const getCartAmount = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([pid, sizes]) => {
      const product = products.find((p) => p._id === pid);
      if (!product) return;
      Object.values(sizes).forEach((qty) => (total += product.price * qty));
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

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
