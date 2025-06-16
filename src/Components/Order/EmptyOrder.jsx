import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function EmptyOrder() {
  return (
       <OrderMessage>
      <h2>No orders placed yet</h2>
      <p>It looks like you haven't placed any orders yet</p>
      <Link to="/">Start Shopping</Link>
    </OrderMessage>
  )
}

const OrderMessage = styled.div`

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

export default EmptyOrder
