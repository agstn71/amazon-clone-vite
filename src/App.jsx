

import Main from "./Components/MainPage/Main";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import CheckOut from "./Components/CheckOut/CheckOut";
import {  useState } from "react";
import { MyContext as MainContext } from "./Context/MyContext";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import Orders from "./Components/Order/Orders";
import Tracking from "./Components/Tracking/Tracking";
import "./App.css";
import SignUpPage from "./Components/SignUp/SignUpPage";
import Login from "./Components/Login/Login";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import AdminPanel from "./Admin/AdminPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewUserOrder from "./Admin/ViewUserOrder";


function App() {
    const [product, setProduct] = useState([]);
 
    const [quantity, setQuantity] = useState();
    
  
  return (
    <div className="App">
    <MainContext.Provider value={{product,setProduct,quantity,setQuantity}}>
      <Provider store={store}>
      <Router>
        <ToastContainer
        position="top-center"       // 🔼 Position: top-center, bottom-right, etc.
        autoClose={3000}            // ⏱ Auto close after 2 seconds
        hideProgressBar={true}     // Show or hide progress bar
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"             // or "dark" / "light"
      />
   
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/checkout" element={<CheckOut/>}/>
          <Route path="/orders" element={<PrivateRoute><Orders/></PrivateRoute>}/>
          <Route path="/tracking" element={<PrivateRoute><Tracking/></PrivateRoute>}/>
          <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />

          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<SignUpPage/>}/>
          <Route path="/admin/viewuserorder" element={<ViewUserOrder/>} />
        </Routes>
      </Router>
      </Provider>
      </MainContext.Provider>
     
    </div>
  );
}

export default App;
