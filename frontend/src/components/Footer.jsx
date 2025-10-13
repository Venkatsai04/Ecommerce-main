import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Footer = () => {
  const { contactInfo } = useContext(ShopContext) // dynamic phone & email if available

  return (
    <div className="bg-white">
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <Link to='/'>
                    <img src={assets.logo} className='w-32 mb-5 cursor-pointer' alt="Sahara" />
                </Link>
                <p className='w-full text-gray-600 md:w-2/3'>
                  Thank you for shopping with Sahara! We're dedicated to bringing you high-quality products across seasons and trends. Follow us on social media for updates on new arrivals, exclusive offers, and more. For any queries or support, our friendly team is here to help. Subscribe to our newsletter for special discounts and be the first to know about our latest collections.
                </p>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <Link to='/'><li>Home</li></Link>
                    <Link to='/about'><li>About Us</li></Link>
                    <Link to='/delivery'><li>Delivery</li></Link>
                    <Link to='/privacy-policy'><li>Privacy & Policy</li></Link>
                </ul>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>{contactInfo?.phone || "+91-9347175125"}</li>
                    <li>{contactInfo?.email || "sahara.store.online@gmail.com"}</li>
                </ul>
            </div>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 Sahara. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer
