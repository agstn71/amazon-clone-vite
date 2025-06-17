import React, { useState } from "react";
import styled from "styled-components";
import { loginUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartOnSync } from "../../Redux/CartSlice";
import { toast } from "react-toastify";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  const rawCart = JSON.parse(localStorage.getItem("cart"));

  const formattedCart = rawCart?.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
    deleveryOptionId: item.deliveryOptionId || "1", // typo preserved
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
   let result;
   try {
       result = await loginUser({ email, password });
   }catch(error) {
    // Check if there's no internet
  if (!navigator.onLine) {
    toast.error("No internet connection. Please check your network.");
  } 
  // If server is unreachable (refused to connect, CORS, DNS, etc.)
  else if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
    toast.error("Server is down or unreachable.");
  }
  // Other known errors
  else {
    toast.error(error.message || "Unexpected error occurred");
  }
   }
    

    if (result?.token) {
      toast.success("Login Successfully", {
        position: "top-center",
        autoClose: 1000,
        theme: "light",
      });
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      const userId = result.user.id;

      if (formattedCart) {
        try {
          await dispatch(
            addToCartOnSync({ userId, localCart: formattedCart })
          ).unwrap();
        } catch (err) {
          console.error("Cart sync failed:", err);
        }
      }
      result?.user?.role === "admin"? navigate('/admin'):navigate("/")
      
    } else {
      if (result?.message === "Your password is incorrect") {
        setPasswordError("Your password is incorrect");
      } else if (result?.message === "Email not registered") {
        toast.error("We cannot find an account with that email address", {
          position: "top-center",
        });
      } else {
        toast.error(result?.message || "Login failed", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <Container>
      <ImgSection>
        <ImgContainer>
          <Link to="/">
            <img src="/images/Amazon_logo - 1.svg" alt="logo" />
          </Link>
        </ImgContainer>
      </ImgSection>

      <MainForm>
        <FormDiv>
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <FormControl>
              <label>Email</label>
              <br />
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>

            <FormControl>
              <label>Password</label>
              <br />
              <input
                type="password"
                name="password"
                required
                onChange={(e) => {setPassword(e.target.value); setPasswordError("");}}
              />
             {passwordError && (
  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
    {passwordError}
  </p>
)}
            </FormControl>

            <SubmitButton type="submit">Sign In</SubmitButton>
          </form>
         <Divider>New to Amazon?</Divider>
         <NewAccount><Link to="/register">Create your Amazon account </Link></NewAccount>

        </FormDiv>
      </MainForm>
    </Container>
  );
}


const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const ImgSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const ImgContainer = styled.div`
  width: 103px;

  img {
    width: 100%;
  }
`;

const MainForm = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormDiv = styled.div`
  width: 348px;
  border: 1px solid rgb(231, 231, 231);
  padding: 15px;
  border-radius: 8px;

  h3 {
    font-size: 28px;
    margin-bottom: 15px;
  }

  p {
    color: #565959;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const FormControl = styled.div`
  display: block;
  padding-left: 2px;
  padding-bottom: 2px;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;

  input {
    width: 100%;
    padding: 3px 7px;
    border-radius: 4px;
    border: solid 1px #888c8c;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: rgb(255, 216, 20);
  border: none;
  padding: 10px 0;
  border-radius: 20px;
  font-size: 13px;
  margin-top: 20px;
  margin-bottom:10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(240, 200, 10);
  }
`;

const Divider = styled.h2`
  display: flex;
  align-items: center;
  color: rgb(134, 134, 134);
  font-weight: normal;
  font-size: 11.5px;
  letter-spacing: 1px;
  width: 315px;
  text-align: center;
  border: none;
  margin-top:10px;
  margin-bottom: 20px;


  &::before,
  &::after {
    content: "";
    flex: 1;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin: 0 10px;
  }
`;

const NewAccount = styled.button`
   background: linear-gradient(#f6f7f9,#e7e9ec); 
   margin-top:10px;
   margin-bottom: 20px;
   width: 315px;
   max-width: 315px;
   height: 33px;
   border:0.5px solid #aaaaaa;
  border-radius:3px;
  &:hover {
    background:linear-gradient(#f5f6f8,#d9dce1)
  }

`

export default Login;
