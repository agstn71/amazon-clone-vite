import React from "react";
import { formatCurrency } from "../../Data/money";
import dayjs from "dayjs";
import useDeliveryOption from "../../Data/useDeliveryOption";
import { useDispatch } from "react-redux";
import { deliveryOptionChange } from "../../Redux/CartSlice";


function DeliveryDate({ item}) {
  const [deliveryOptions, setDeliveryOptions] = useDeliveryOption();
 const dispatch = useDispatch()
  return (
    <>
      {deliveryOptions.map((option, index) => {
        const today = dayjs();
        const deliveryDate = today.add(option.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");
        const priceCent =
          option.priceCents === 0 ? "FREE" : formatCurrency(option.priceCents);

        return (
          <div className="delivery-option" key={index}>
            <input
              checked={option.id === item.deliveryOptionId}
              type="radio"
              onChange={() => dispatch(deliveryOptionChange({productId:item.id, optionId:option.id}))}
              name={`delivary-option-${item.id}`}
            />
            <div>
              <div className="delivery-date">{dateString}</div>
              <div className="delivery-price">{priceCent} Shipping</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DeliveryDate;
