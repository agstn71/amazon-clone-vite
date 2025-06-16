import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const placeYourOrderInDB = createAsyncThunk('order/placeYourOrderInDB',async ({userId,totalCost,cart},thunkApi) => {
    try {

   const response = await axios.post("http://localhost:5000/api/orders/place",{
    userId,totalCost,cart
   })
   return response.data;
    }catch(error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed place order")
        
    }
})

export const getOrdersFromDB = createAsyncThunk('order/getOrdersFromDB',async (userId,thunkApi) => {
     try {

   const response = await axios.get(`http://localhost:5000/api/orders/${userId}`)
   return response.data;
    }catch(error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "error fetching orders")
        
    }
})

const orderSlice = createSlice({
    name:'orders',
    initialState:{
        orderItems:[]
    },
    reducers:{
        // placeYourOrder: function (state,action) {
        //      const {totalCost,cart} = action.payload
        //      if(cart.length>0) {
        //       const id = crypto.randomUUID();
        //         const today = dayjs().format();
                  
        //         state.orderItems.unshift({
        //             id: id,
        //             orderTime: today,
        //             totalCost: totalCost,
        //             products: [...cart]
        //         })
               
        //     }
        // }
    },
    extraReducers:(builder) => {
        builder.addCase(getOrdersFromDB.fulfilled,(state,action) => {
            state.orderItems = action.payload
        })
    }
})

export const {placeYourOrder} =  orderSlice.actions;
export default orderSlice.reducer