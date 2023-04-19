// import react dependencies
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import apollo dependency
import { useQuery } from '@apollo/client';

// import utils dependencies
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';

// import component
import Cart from '../components/Cart';

// import assset
import spinner from '../assets/spinner.gif';

function Detail() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const { id } = useParams();
  const [currentProduct, setCurrentProduct] = useState({});
  const { products, cart } = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // if data, loading, or dispatch is updated, update products
  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts,
        });
      });
    }
  }, [products, data, loading, dispatch, id]);

  // update cart quantity if itemInCart exists; otherwise add to cart 
  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 },
      });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  // remove item with currentProduct._id from cart
  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id,
    });
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  // return (
  //   <>
  //     {currentProduct && cart ? (
  //       <div className="container my-1" style={{ marginTop: '100px', paddingLeft: '20px' }}>
  //         <button
  //           type="button"
  //           class="inline-block rounded-full bg-[#F865B0] bg-opacity-10 border-2 border-info text-info hover:bg-opacity-20 transition duration-150 ease-in-out hover:text-info-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info"
  //           onclick="window.location.href='/'">
  //           ← Back to Products
  //         </button>

  //         <h2 class="text-3xl font-bold mb-4">{currentProduct.name}</h2>
  //         <p class="text-gray-700 leading-loose">{currentProduct.description}</p>
  //         <p>
  //           <strong>Price:</strong>${currentProduct.price}{' '}
  //           <button
  //             type="button"
  //             className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
  //             onClick={addToCart}
  //           >
  //             Add to cart
  //             <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  //               <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717L5.07 1.243zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3z" />
  //             </svg>
  //           </button>
  //           <button
  //             disabled={!cart.find((p) => p._id === currentProduct._id)}
  //             onClick={removeFromCart}
  //             className="inline-flex items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-300"
  //           >
  //             <span>Remove from Cart</span>
  //           </button>


  //         </p>
  //         <img
  //           src={`/images/${currentProduct.image}`}
  //           alt={currentProduct.name}
  //         />
  //       </div>
  //     ) : null}
  //     {loading ? <img src={spinner} alt="loading" /> : null}
  //     <Cart />
  //   </>
  // );
  return (
    <>
      {currentProduct && cart ? (
    <div className="bg-gray-100 py-8" style={{ marginTop: '100px' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            {currentProduct && (
              <div className="h-[460px] rounded-lg bg-gray-300 mb-4">
                <img className="w-full h-full object-cover" src={`/images/${currentProduct.image}`} alt={currentProduct.name} />
              </div>
            )}
            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
              <button
               type="button"
               className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
               onClick={addToCart}
             >
              Add to cart
               <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.071 1.243a.5.5 0 0 1 .858.514L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 6h1.717L5.07 1.243zM3.5 10.5a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3zm2.5 0a.5.5 0 1 0-1 0v3a.5.5 0 0 0 1 0v-3z" />
              </svg>
             </button>

              </div>
              <div className="w-1/2 px-2">
              <button
             disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
             className="inline-flex items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-300"
            >
              <span>Remove from Cart</span>
             </button>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4">
            {currentProduct && (
              <>
                <h2 className="text-2xl font-bold mb-2">{currentProduct.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{currentProduct.description}</p>
                <div className="flex mb-4">
                  <div className="mr-4">
                    <span className="font-bold text-gray-700">Price:</span>
                    <span className="text-gray-600">${currentProduct.price}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">Availability:</span>
                    <span className="text-gray-600">In Stock</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-gray-700">Product Description:</span>
                  <p className="text-gray-600 text-sm mt-2">{currentProduct.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
     ) : null}
     {loading ? <img src={spinner} alt="loading" /> : null}
     <Cart />
   </>
 );
  

}

export default Detail;

