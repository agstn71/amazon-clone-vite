import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

function EmptyCart() {
  return (
    <CartMessage>
      <h2>Your cart is empty 🛒</h2>
      <p>Looks like you haven’t added anything yet.</p>
      <Link to="/">← Continue Shopping</Link>
    </CartMessage>
  )
}

const CartMessage = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top:10vw;
  h2 {
    font-size: 1.5rem;
    margin-bottom:10px;
  }

  p {
    font-size: 1rem; 
     margin-bottom:10px;
  }

  
  a:hover {
    color:blue;
  }

  @media (min-width: 1024px) {
    h2 {
      font-size: 2rem; 
    }

    p {
      font-size: 1.25rem; 
    }
  }

  a {
    font-size: 1rem;
  }
`;
export default EmptyCart
