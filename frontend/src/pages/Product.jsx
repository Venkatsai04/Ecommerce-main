import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const { user } = useContext(AuthContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  // Fetch product data
  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/reviews/${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [productId]);

  // Add a review
  const handleAddReview = async () => {
    if (!user) return alert('Please login to add a review.');
    if (!newReview) return alert('Please write a review.');

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // if backend uses auth
        },
        body: JSON.stringify({
          userId: user._id,           // dynamically set userId from AuthContext
          description: newReview,     // backend expects 'description'
          rating,                     // rating
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => [...prev, data.review]);
        setNewReview('');
        setRating(5);
      } else {
        alert(data.message || 'Failed to add review.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add review. See console for details.');
    }
  };


  if (!productData) return <div className='opacity-0'></div>;

  return (
    <div className='pt-10 transition-opacity duration-500 ease-in border-t-2 opacity-100'>
      {/* Product Data */}
      <div className='flex flex-col gap-12 sm:gap-12 sm:flex-row'>
        {/* Product Images */}
        <div className='flex flex-col-reverse flex-1 gap-3 sm:flex-row'>
          <div className='flex justify-between overflow-x-auto sm:flex-col sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer ${image === item ? 'border-2 border-gray-600 py-2 px-2' : ''
                  }`}
                alt="Photo"
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="Photo" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='mt-2 text-2xl font-medium'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.round(productData.avgRating || 4) ? assets.star_icon : assets.star_dull_icon}
                alt="Ratings"
                className="w-3.5"
              />
            ))}
            <p className='pl-2'>({reviews.length})</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>
            Made from 100% clay and environmentally friendly materials, this premium product combines durability with a modern aesthetic. Perfect for gifting or adding a touch of elegance to your home, every detail is crafted to perfection for a luxurious yet eco-conscious experience.
          </p>

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 rounded-md ${item === size ? 'border-orange-500' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className='px-8 py-3 text-sm text-white bg-black active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='flex flex-col gap-1 mt-5 text-sm text-gray-500'>
            <p>Guaranteed 100% Authentic – Shop with Confidence!</p>
            <p>Enjoy Cash on Delivery – Pay at Your Doorstep!</p>
            <p>Hassle-Free Returns & Exchanges – 10 Days, No Questions Asked!</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='px-5 py-3 text-sm border'>Description</b>
          <b className='px-5 py-3 text-sm border'>Reviews ({reviews.length})</b>
        </div>

        <div className='flex flex-col sm:flex-row gap-6 px-6 py-6 text-sm text-gray-500 border'>
          {/* Extra Product Info */}
          <div className='sm:w-1/3 border-r pr-4'>
            <p>
              Made from 100% clay and environmentally friendly materials, this premium product combines durability with a modern aesthetic. Perfect for gifting or adding a touch of elegance to your home, every detail is crafted to perfection for a luxurious yet eco-conscious experience.
            </p>
          </div>

          {/* Reviews List */}
          <div className='flex-1 flex flex-col gap-4'>
            {reviews.length > 0 ? (
              reviews.map((rev, i) => (
                <div key={i} className='border-b pb-2'>
                  <div className='flex items-center gap-2'>
                    {[...Array(5)].map((_, j) => (
                      <img
                        key={j}
                        src={j < rev.rating ? assets.star_icon : assets.star_dull_icon}
                        alt="Rating"
                        className="w-3.5"
                      />
                    ))}
                    <p className='font-medium'>{rev.userName}</p>
                  </div>
                  <p className='mt-1 text-gray-600'>{rev.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            {/* Add Review */}
            {user && (
              <div className='mt-4'>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className='w-full border rounded-md p-2'
                  placeholder='Write your review here...'
                />
                <div className='flex items-center gap-2 mt-2'>
                  <span>Rating:</span>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className='border rounded-md p-1'>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleAddReview}
                  className='mt-2 px-4 py-2 text-white bg-black rounded-md'
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
