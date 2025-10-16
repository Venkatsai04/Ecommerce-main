import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const backendUrl = "http://localhost:4000/api";

const PlaceOrder = () => {
  const {
    cartItems,
    products,
    currency,
    updateCartItem,
    removeCartItem,
    getCartCount,
    getCartAmount,
    navigate,
  } = useContext(ShopContext);

  const [method, setMethod] = useState('cod');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    mobile: ''
  });

  const token = localStorage.getItem("token");

  const validateForm = () => {
    for (const key in form) {
      if (!form[key]) {
        alert(`Please fill ${key}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!token) return alert("Login to place an order");
    if (!validateForm()) return;

    const items = [];
    Object.entries(cartItems).forEach(([pid, sizes]) => {
      const product = products.find(p => p._id === pid);
      if (!product) return;
      Object.entries(sizes).forEach(([size, qty]) => {
        items.push({
          productId: pid,
          name: product.name,
          size,
          quantity: qty,
          price: product.price,
        });
      });
    });

    if (items.length === 0) return toast.error("Cart is empty");

    const totalAmount = getCartAmount();

    if (method === "cod") {
      await axios.post(`${backendUrl}/order/place`,
        { items, address: form, paymentMethod: "cod", totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully");
      navigate("/orders");
    } else if (method === "razorpay") {
      const { data } = await axios.post(`${backendUrl}/payment/razorpay/order`, { amount: totalAmount });
      const options = {
        key: "rzp_test_RU9gYhxqiyBnDV",
        amount: data.order.amount,
        currency: "INR",
        name: "Sahara Traders",
        description: "Payment for your order",
        order_id: data.order.id,
        image: assets.logoMini,
        handler: async function (response) {
          const verifyRes = await axios.post(`${backendUrl}/payment/razorpay/verify`, response);
          if (verifyRes.data.success) {
            await axios.post(`${backendUrl}/order/place`,
              { items, address: form, paymentMethod: "razorpay", totalAmount },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful and order placed!");
            navigate("/orders");
          } else toast.error("Payment verification failed");
        },
        prefill: {
          name: form.firstName + " " + form.lastName,
          email: form.email,
          contact: form.mobile,
        },
        theme: { color: "#3399cc" },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        {/* Form Inputs */}
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="firstName" value={form.firstName} onChange={handleInputChange} placeholder='First Name' required/>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="lastName" value={form.lastName} onChange={handleInputChange} placeholder='Last Name' required/>
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="email" name="email" value={form.email} onChange={handleInputChange} placeholder='Email Address' required/>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="street" value={form.street} onChange={handleInputChange} placeholder='Street' required/>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="city" value={form.city} onChange={handleInputChange} placeholder='City' required/>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="state" value={form.state} onChange={handleInputChange} placeholder='State' required/>
        </div>
        <div className='flex gap-3'>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" name="zip" value={form.zip} onChange={handleInputChange} placeholder='Zip Code' required/>
          <input className='w-full px-4 py-2 border border-gray-300 rounded' type="text" name="country" value={form.country} onChange={handleInputChange} placeholder='Country' required/>
        </div>
        <input className='w-full px-4 py-2 border border-gray-300 rounded' type="number" name="mobile" value={form.mobile} onChange={handleInputChange} placeholder='Mobile' required/>
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal
            cart={cartItems}
            products={products}
            currency={currency}
            updateCartItem={updateCartItem}
            removeItem={removeCartItem}
          />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            {['stripe', 'razorpay', 'cod'].map((m) => (
              <div key={m} onClick={() => setMethod(m)} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === m ? 'bg-green-600' : ''}`}></p>
                {m === 'stripe' && <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />}
                {m === 'razorpay' && <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />}
                {m === 'cod' && <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>}
              </div>
            ))}
          </div>
          <div className='w-full mt-8 text-end'>
            <button onClick={handlePlaceOrder} className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
