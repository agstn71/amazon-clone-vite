import React, { useContext, useEffect, useRef } from "react";
import "./CheckOut.css";
import { MyContext as MainContext } from "../../Context/MyContext";
import DeliveryDate from "./DeliveryDate";
import useDeliveryOption from "../../Data/useDeliveryOption";
import dayjs from "dayjs";
import OrderSummary from "./OrderSummary";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, cartItemDelete, updateCartItemInDB, fetchCartFromDB, deleteCartItemInDB } from "../../Redux/CartSlice";
import { Link } from "react-router-dom";
import EmptyCart from "./EmptyCart";




function Cart() {


  const quantityElement = useRef({});
  const inputElement = useRef({});
  const { product, quantity, setQuantity } = useContext(MainContext)
  const [deliveryOptions, setDeliveryOptions] = useDeliveryOption()
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItem);
  const user = JSON.parse(localStorage.getItem('user'))
  const userId = user?.id




  const quantityUpdate = (id) => {

    quantityElement.current[id].style.display = "none";
    inputElement.current[id].style.display = "inline";
  };

  useEffect(() => {
    setQuantity(() => {
      return cart.reduce((sum, item) => {
        return (sum = sum + item.quantity);
      }, 0);
    });
    console.log("cart updated")
  }, [cart]);



  //cart item update
  const onCartUpdate = async (event, id) => {
    const quantity = Number(event.target.value);
    const productId = id;
    if(userId) {
     await dispatch(updateCartItemInDB({userId,productId,quantity }))
     await dispatch(fetchCartFromDB(userId))
  
    }else {
    dispatch(updateCart({ productId, quantity }))
    }
  }



  const handleSubmit = (e, id) => {
    e.preventDefault();
    inputElement.current[id].style.display = "none";
    quantityElement.current[id].style.display = "inline";
  }

  //cart item delete
  const onItemDelete = async (id) => {
    const productId = id;
    if(userId) {
      console.log("userId...",userId)
      console.log("productId... ",productId)
       await dispatch(deleteCartItemInDB({userId,productId}));
        await dispatch(fetchCartFromDB(userId))
        await dispatch(fetchCartFromDB(userId))
    }else {
      dispatch(cartItemDelete({ productId }))
    }
    
  }

  return (
    <div className="cart-main">
      <div className="header">
        <div className="logo">
          <Link to="/">

            <img
              src="/images/Amazon_logo - 1.svg"
              alt="Amazon Logo"
              class="amazon-header__logo-img"
            />
          </Link>
        </div>

        <div className="items">Checkout ( {quantity} items )</div>
      </div>
      {

        cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="main">
            <div className="page-title">Review your order</div>
            <div className="checkout-grid">
              <div>
                {cart.map((item) => {
                  const matchingItem = product.find(
                    (product) => product.id === item.id
                  );

                  let deliveryOption;

                  deliveryOptions.forEach((option) => {
                    if (option.id === item.deliveryOptionId) {
                      deliveryOption = option;
                    }
                  });

                  const today = dayjs();
                  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
                  const dateString = deliveryDate.format('dddd, MMMM D');


                  return (
                    <div className="cart-container" key={item.id}>
                      <div className="delivery-date-dis">
                        Delivery date: {dateString}
                      </div>
                      <div className="cart-item-detail">
                        <div className="item-img">
                          <img src={matchingItem?.image} alt=" product" />
                        </div>
                        <div className="item-detail">
                          <div className="item-name">{matchingItem?.title}</div>
                          <div className="item-price">${matchingItem?.price}</div>
                          <div className="item-quantity">
                            <span>
                              Quantity:
                              <span
                                ref={(el) =>
                                  (quantityElement.current[item.id] = el)
                                }
                                className={`quantity-dis js-quantity-${item.id}`}
                              >
                                {item.quantity}
                              </span>{" "}
                              <form onSubmit={(e) => handleSubmit(e, item.id)}>
                                <input
                                  ref={(el) => (inputElement.current[item.id] = el)}
                                  type="text"
                                  className="quantity-input"
                                  onChange={(e) => onCartUpdate(e, item.id)}
                                />
                              </form>
                            </span>
                            <span onClick={() => quantityUpdate(item.id)}>Update</span>
                            <span onClick={() => onItemDelete(item.id)}>Delete</span>
                          </div>
                        </div>
                        <div className="delivery-options">
                          <div className="delivery-option-title">
                            Choose a delivery option:
                          </div>

                          <DeliveryDate item={item} />

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <OrderSummary quantity={quantity} />
            </div>
          </div>
        )
      }

    </div>
  );
}

export default Cart;
