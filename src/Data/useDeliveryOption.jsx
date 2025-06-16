
import { useState } from 'react';

export default function useDeliveryOption() {
  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      id: '1',
      deliveryDays: 7,
      priceCents: 0,
    },
    {
      id: '2',
      deliveryDays: 3,
      priceCents: 499,
    },
    {
      id: '3',
      deliveryDays: 1,
      priceCents: 999,
    },
  ]);

  return [deliveryOptions, setDeliveryOptions]; 
}


