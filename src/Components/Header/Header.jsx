import React, { useContext } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { MyContext as MainContext } from "../../Context/MyContext";
import { useDispatch } from "react-redux";
import { clearCart } from "../../Redux/CartSlice";

function Header() {
 const {product,cart,setCart,quantity,setQuantity,selectQuantity} =  useContext(MainContext);
 const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearCart())
    navigate("/");
  };
  return (
    <div>
      <header className="amazon-header">
        <div  className="logo-div">
          <Link to="/">
          <img
            src="/images/Amazon_logo.svg"
            alt="Amazon Logo"
            className="amazon-header__logo-img"
          />
          </Link>
        </div>
        <form action="/search" method="GET" className="amazon-header__search">
          <input type="text" name="q" placeholder="Search" class="header-search-input" />
          <button type="submit" className="header-search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>
        { user?
           <>
           
    <p style={{color:'white',fontSize:'13px',marginRight:'14px',cursor:'pointer'}} onClick={logout}>Hello, {user.name}</p>
           </>:
        <div className="authent">
         <Link to="/login"><span style={{color:'white',fontSize:'13px',marginRight:'14px'}}>Hello,sign in</span></Link> 
        </div>
      }
        <div className="amazon-cart">
          <Link to="/orders">
          <div className="rtn-ord">
            <span className="returns-text">Return</span>
            <span className="orders-text">&Orders</span>
          </div>
          </Link>
          <div>
            <Link to="/checkout" className="cart-icon">
            <i className="fas fa-shopping-cart icon"></i>
            <div className="cart-quantity">{quantity}</div>
            <div className="cart-text">Cart</div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
