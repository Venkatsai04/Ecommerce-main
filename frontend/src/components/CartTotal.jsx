import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({delivery_fee}) => {
  const { currency,  cartItems, products, updateCartItem, removeCartItem } = useContext(ShopContext);

  console.log(delivery_fee);
  

  const subtotal = Object.entries(cartItems).reduce((acc, [pid, sizes]) => {
    const product = products.find(p => p._id === pid);
    if (!product) return acc;
    return acc + Object.values(sizes).reduce((sum, qty) => sum + qty * product.price, 0);
  }, 0);

  const total = subtotal + delivery_fee;

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
                <p className='text-sm text-gray-500'>{currency}{product.price.toLocaleString()}</p>
              </div>
              <div className='flex items-center gap-2'>
                <button onClick={() => updateCartItem(pid, size, qty - 1)} className='px-2 border rounded'>-</button>
                <span>{qty}</span>
                <button onClick={() => updateCartItem(pid, size, qty + 1)} className='px-2 border rounded'>+</button>
                <button onClick={() => removeCartItem(pid, size)} className='ml-2 text-red-500'>Remove</button>
              </div>
            </div>
          ));
        })}
      </div>

      <div className='flex flex-col gap-2 mt-6 text-sm'>
        <div className='flex justify-between'>
          <p className='text-lg font-medium'>Sub Total</p>
          <p className='text-lg font-medium'>
            {currency}&nbsp;{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p className='text-lg font-medium'>Shipping Fee</p>
          <p className='text-lg font-medium'>
            {currency}&nbsp;{delivery_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p className='text-2xl font-semibold'>Total Amount</p>
          <p className='text-2xl font-semibold'>
            {currency}&nbsp;{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
