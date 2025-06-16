import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import "./Order.css";
import { useDispatch, useSelector } from "react-redux";
import { MyContext as MainContext } from "../../Context/MyContext";
import useDeliveryOption from "../../Data/useDeliveryOption";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import EmptyOrder from "./EmptyOrder";
import { getOrdersFromDB } from "../../Redux/orderSlice";
function Orders() {
  const orders = useSelector((state) => state.orders.orderItems);
   const { product} = useContext(MainContext);
  const [deliveryOptions] = useDeliveryOption();
  const dispatch = useDispatch()
  
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (userId) {
    dispatch(getOrdersFromDB(userId));
  }
}, [dispatch]);

  return (
    <>
      <Header />
      {orders.length === 0 ? (
        <EmptyOrder />
      ) : (
        <div className="orders-main">
          <div className="page-title">Your Orders</div>
          <div className="orders-grid">
            {orders.map((order, index) => {
              const orderTime = order.orderTime;
              const date = new Date(orderTime);
           console.log("indisdfsafdsf asldkf");
           
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
                       console.log("inside matching item")
                       console.log("product ",product)
                      const matchingItem = product.find((productItem) => {
                       
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
                                <button>Track Package</button>
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
        </div>
      )}
    </>
  );
}

export default Orders;
