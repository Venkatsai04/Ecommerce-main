import React, { useEffect } from 'react' // ✅ Added useEffect
import { Route, Routes } from 'react-router-dom'
import axios from 'axios' // ✅ Added axios for tracking
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
import WinterChills from './components/WinterChills'
import ReturnsPolicy from './pages/ReturnsPolicy'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'

const App = () => {

  // ✅ TRACK VISIT: Sends a signal to backend when app loads
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post(import.meta.env.VITE_PORT + '/analytics/track-visit');
      } catch (error) {
        console.error("Analytics Error:", error);
      }
    };
    trackVisit();
  }, []);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* <DiwaliFirework /> */}
      <WinterChills />
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/try-on" element={<TryOn />} />
        <Route path="/returns" element={<ReturnsPolicy />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

      </Routes>
      <Footer />
    </div>
  )
}

export default App