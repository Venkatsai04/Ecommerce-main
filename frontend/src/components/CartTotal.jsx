import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({ delivery_fee = 0 }) => {
  const { currency, cartItems, products, updateCartItem, removeCartItem } = useContext(ShopContext);

  // ✅ Calculate subtotal
  const subtotal = Object.entries(cartItems).reduce((acc, [pid, sizes]) => {
    const product = products.find(p => p._id === pid);
    if (!product) return acc;
    return acc + Object.values(sizes).reduce((sum, qty) => sum + qty * product.price, 0);
  }, 0);

  // ✅ Ensure delivery_fee is numeric
  const numericDeliveryFee = Number(delivery_fee) || 0;

  // ✅ Total
  const total = subtotal + numericDeliveryFee;

  // ✅ Currency formatter (Indian format)
  const formatCurrency = (amount) =>
    amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ✅ Fixed: Handle decrement properly
  const handleDecrement = (pid, size, qty) => {
    const newQty = qty - 1;
    if (newQty >= 1) {
      updateCartItem(pid, size, newQty);
    } else {
      removeCartItem(pid, size);
    }
  };

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTAL'} />
      </div>

      <div className='mt-4 flex flex-col gap-3'>
        {/* Cart Items */}
        {Object.entries(cartItems).map(([pid, sizes]) => {
          const product = products.find(p => p._id === pid);
          if (!product) return null;
          return Object.entries(sizes).map(([size, qty]) => (
            <div key={`${pid}-${size}`} className='flex items-center justify-between border p-2 rounded'>
              <div>
                <p className='font-medium'>{product.name} ({size})</p>
                <p className='text-sm text-gray-500'>{currency}{formatCurrency(product.price)}</p>
              </div>
              <div className='flex items-center gap-2'>
                <button 
                  onClick={() => handleDecrement(pid, size, qty)} 
                  className='px-2 border rounded hover:bg-gray-100'
                >
                  −
                </button>
                <span className='w-6 text-center'>{qty}</span>
                <button 
                  onClick={() => updateCartItem(pid, size, qty + 1)} 
                  className='px-2 border rounded hover:bg-gray-100'
                >
                  +
                </button>
                <button 
                  onClick={() => removeCartItem(pid, size)} 
                  className='ml-2 text-red-500 hover:text-red-700'
                >
                  Remove
                </button>
              </div>
            </div>
          ));
        })}
      </div>

      {/* Totals Section */}
      <div className='flex flex-col gap-2 mt-6 text-sm'>
        <div className='flex justify-between'>
          <p className='text-lg font-medium'>Sub Total</p>
          <p className='text-lg font-medium'>
            {currency}&nbsp;{formatCurrency(subtotal)}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p className='text-lg font-medium'>Shipping Fee</p>
          <p className='text-lg font-medium'>
            {currency}&nbsp;{formatCurrency(numericDeliveryFee)}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p className='text-2xl font-semibold'>Total Amount</p>
          <p className='text-2xl font-semibold'>
            {currency}&nbsp;{formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;