import React, { useState } from 'react';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const SignUpContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const ImgSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ImgContainer = styled.div`
  width: 103px;
`;

const LogoImage = styled.img`
  width: 100%;
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
`;

const Heading = styled.h3`
  font-size: 28px;
  margin-bottom: 15px;
`;

const SubText = styled.p`
  color: #565959;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 15px;
`;

const FormControl = styled.div`
  display: block;
  padding-left: 2px;
  padding-bottom: 2px;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 3px 7px;
  border-radius: 4px;
  border: solid 1px #888c8c;

  &.input-error {
    border-color: red;
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
  cursor: pointer;
`;


const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

function SignUpPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) validateField(name, value);
  };

  const validateField = (name, value) => {
    let message = '';
    if (name === 'name' && !value.trim()) message = 'Name is required';
    if (name === 'email') {
      if (!value.trim()) message = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(value)) message = 'Invalid email format';
    }
    if (name === 'password') {
      if (!value) message = 'Password is required';
      else if (value.length < 6) message = 'Password must be at least 6 characters';
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateForm = () => {
    let newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (!value.trim()) newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    });
    return Object.values(newErrors).every((msg) => msg === undefined || msg === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const isValid = validateForm();
    if (isValid) {
      try {
       const result = await registerUser(formData);
       toast.success(`${result.message}`)
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
      
      navigate('/login');
    }
  };

  return (
    <SignUpContainer>
      <ImgSection>
        <ImgContainer>
          <LogoImage src="/images/Amazon_logo - 1.svg" alt="logo" />
        </ImgContainer>
      </ImgSection>
      <MainForm>
        <FormDiv>
          <Heading>Create Account</Heading>
          <SubText>All fields are required</SubText>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <label>Your Name</label><br />
              <Input
                type="text"
                name="name"
                className={errors.name ? 'input-error' : ''}
                placeholder="First and last name"
                value={formData.name}
                onChange={onHandleChange}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormControl>

            <FormControl>
              <label>Email</label><br />
              <Input
                type="email"
                name="email"
                className={errors.email ? 'input-error' : ''}
                value={formData.email}
                onChange={onHandleChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormControl>

            <FormControl>
              <label>Password (at least 6 characters)</label><br />
              <Input
                type="password"
                name="password"
                className={errors.password ? 'input-error' : ''}
                value={formData.password}
                onChange={onHandleChange}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormControl>

            <SubmitButton type="submit">Register</SubmitButton>
          </form>
        </FormDiv>
      </MainForm>
    </SignUpContainer>
  );
}

export default SignUpPage;
