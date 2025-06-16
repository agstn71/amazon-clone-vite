import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './CartSlice';
import orderReducer from'./orderSlice';

export const store = configureStore({
    reducer:{
        cart:cartReducer,
        orders:orderReducer
    }
})
