import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import DiwaliFirework from './components/DiwaliFirework'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivacyPolicy from './pages/Policy'
import ScrollToTop from './components/ScrollToTop'
import Profile from './pages/Profile'
import PaymentSuccess from './pages/PaymentSucces'
import TryOn from './pages/TryOn'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <DiwaliFirework />
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/Profile' element={<Profile/>} />
         <Route path="/payment-success" element={<PaymentSuccess />} />
         <Route path="/try" element={<TryOn/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
