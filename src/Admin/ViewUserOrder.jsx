import React, { useContext, useEffect, useState } from 'react'
import useDeliveryOption from '../Data/useDeliveryOption';
import { useSelector } from 'react-redux';
import dayjs from "dayjs";
import { Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';

function ViewUserOrder() {
     const orders = useSelector((state) => state.orders.orderItems);
  const [deliveryOptions] = useDeliveryOption();
  const [product,setProduct] = useState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  const username = searchParams.get('username')
  console.log("orders ",orders);
  
  
 useEffect(() => {
  

   const fetchProducts = async () => {
    try {
      
     const response = await axios.get("https://fakestoreapi.com/products");
     setProduct(response.data);
    }catch(error) {
      toast.error(`error fetching products:${error.message||error}`)
    } 
   }

   fetchProducts();
  }, []);


  return (
    <>
    { orders.length > 0?
    <div className="orders-main">
          <div className="page-title">UserName: {username}</div>
          <div className="orders-grid">
            {orders.map((order, index) => {
              const orderTime = order.orderTime;
              const date = new Date(orderTime);
           
              const monthName = date.toLocaleString("default", {
                month: "long",
              });

              const day = date.getDate();

              const formattedDate = `${monthName} ${day}`;

              return (
                <div className="orders-container" key={index}>
                  <div className="order-header">
                    <div className="order-header-left-section">
                      <div className="order-date">
                        <div className="order-header-label">Order Placed</div>
                        <div>{formattedDate}</div>
                      </div>
                      <div className="order-total">
                        <div className="order-header-label">Total</div>
                        <div>${order.totalCost}</div>
                      </div>
                    </div>
                    <div className="order-header-right-section">
                      <div className="order-header-label">Order ID</div>
                      <div>{order._id}</div>
                    </div>
                  </div>
                  <div className="order-detail-grid">
                    {order.products.map((orderItem, index) => {
                       
                      const matchingItem = product?.find((productItem) => {
                       
                        return productItem.id === orderItem.productId;
                      });
                      if (matchingItem) {
                        
                        const matchOption = deliveryOptions.find((option) => {
                          return orderItem.deliveryOptionId === option.id;
                        });

                        const today = dayjs();
                        const deliveryDate = today.add(
                          matchOption.deliveryDays,
                          "days"
                        );
                        const dateString = deliveryDate.format("  MMMM D");
                        console.log(dateString);

                        return (
                          <React.Fragment key={index}>
                            <div className="product-image-container">
                              <img
                                src={matchingItem.image}
                                alt="product-image"
                              />
                            </div>
                            <div className="product-detail">
                              <div className="product-name">
                                {matchingItem.title}
                              </div>
                              <div className="product-delivery-date">
                                Arriving on:{dateString}
                              </div>
                              <div className="product-quantity">
                                Quantity:{orderItem.quantity}
                              </div>
                            </div>
                            <div className="product-action">
                              <Link
                                to={`/tracking?orderId=${order._id}&productId=${matchingItem.id}`}
                                className="link-primary"
                              >
                               
                              </Link>
                            </div>
                          </React.Fragment>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>:<div className='w-full flex justify-center'>
            <div className='mt-5 text-2xl'>No Orders</div>
        </div>
}
    </>
  )
}

export default ViewUserOrder
