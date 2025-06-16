import React, { useContext } from 'react'
import Header from '../Header/Header'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MyContext as MainContext } from '../../Context/MyContext';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import useDeliveryOption from '../../Data/useDeliveryOption';
import './Tracking.css'




function Tracking() {
  const location = useLocation();
  const [deliveryOptions] = useDeliveryOption();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const productId = queryParams.get('productId');
  console.log(productId)
  const { product } = useContext(MainContext)
  const orders = useSelector((state) => state.orders.orderItems);
  console.log(orders);

  const matchOrder = orders.find((order) => order._id === orderId);

  console.log(matchOrder)

  const matchOrderProduct = matchOrder?.products.find((product) => product?.productId === Number(productId))
  console.log(matchOrderProduct)
  const matchOption = deliveryOptions.find((option) => {
    return matchOrderProduct?.deliveryOptionId === option?.id
  })

  const today = dayjs();
  const deliveryDate = today.add(matchOption?.deliveryDays, "days");
  const dateString = deliveryDate.format("  MMMM D");
  

  const matchProduct = product.find((item) => item.id === matchOrderProduct.productId)

 console.log("matchproduct ",matchProduct)


  return (
    <>
      <Header />
      <div className="order-main">


        <div className="order-tracking">
          <Link to="/orders" className="back-to-orders-link link-primary" href="orders.html">
            View all orders
          </Link>

          <div className="delivery-date">
            Arriving on {dateString}
          </div>

          <div className="product-info">
            {matchProduct?.title}
          </div>

          <div className="product-info">
            Quantity: {matchOrderProduct?.quantity}
          </div>

          <img className="product-image" src={matchProduct?.image} alt='product' />

          <div className="progress-labels-container">
            <div className="progress-label">
              Preparing
            </div>
            <div className="progress-label current-status">
              Shipped
            </div>
            <div className="progress-label">
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>
        </div>


      </div>
    </>
  )
}

export default Tracking
