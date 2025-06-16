import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import Product from '../ProductContainer/Product'
import { MyContext as MainContext } from '../../Context/MyContext';
import { fetchCartFromDB, addToCartOnSync } from '../../Redux/CartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import axios from 'axios';

function Main() {

  const { product, setProduct, quantity, setQuantity } = useContext(MainContext)
  const cart = useSelector((state) => state.cart.cartItem);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error)
  const user = JSON.parse(localStorage.getItem('user'))
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

 
  // fetch products using api
  useEffect(() => {
  

   const fetchProducts = async () => {
    try {
      setLoading(true);
     const response = await axios.get("https://fakestoreapi.com/products");
     setProduct(response.data);
    }catch(error) {
      toast.error(`error fetching products:${error.message||error}`)
    } finally {
      setLoading(false)
    }
   }

   fetchProducts();
  }, []);
  // fetch cart form DB
  useEffect(() => {
    const userId = user?.id;
   
    if (userId) {
         (async () => {
      try {
        await dispatch(fetchCartFromDB(userId)).unwrap();
      } catch (err) {
        console.error("Cart fetch failed:", err);
      }
    })();
    }

  }, [dispatch])


  useEffect(() => {
    if(status === 'failed' && error) {
      toast.error(`cart fetch failed: ${error}`);
    }
    console.log("error value: ",error)

  },[status,error])

  
  // calculate quantity
  useEffect(() => {
    setQuantity(() => {
      return cart.reduce((sum, item) => {
        return (sum = sum + item.quantity);
      }, 0);
    });
  
  }, [cart]);

if (loading) {
  return (
    <>
      <Header />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
      }}>
        <ClipLoader size={50} color="#111" />
        <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>Loading products...</p>
      </div>
    </>
  );
}


  return (
    <>
      <Header />
      <Product />

    </>
  )
}

export default Main
