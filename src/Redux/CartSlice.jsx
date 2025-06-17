import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

//fetch cart from db
export const fetchCartFromDB = createAsyncThunk('cart/fetchCartFromDB', async (userId, thunkApi) => {
    try {
        const response = await axios.get(`${API_URL}/api/cart/${userId}`)
        return response.data.items
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch cart")

    }
});

//add item to db
export const addCartItemToDB = createAsyncThunk('cart/addCartItemToDB', async ({ userId, productId, quantity }, thunkApi) => {
    try {
        const response = await axios.post(`${API_URL}/api/cart/add`, {
            userId, productId, quantity
        })
        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to add item to DB")
    }
})

//update item on db
export const updateCartItemInDB = createAsyncThunk('cart/updateCartItemOnDB', async ({ userId, productId, quantity }, thunkApi) => {
    try {
        const response = await axios.patch(`${API_URL}/api/cart/update`, { userId, productId, quantity })
        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed update cart on db")
    }
})


//add cart to db on sync
export const addToCartOnSync = createAsyncThunk('cart/addToCartOnSync', async ({ userId, localCart }, thunkApi) => {
    try {
        const response = await axios.post(`${API_URL}/api/cart/sync`, {
            userId, items: localCart
        })
        localStorage.removeItem("cart")

        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to add item to DB")
    }
})
//delet cart item in db 
export const deleteCartItemInDB = createAsyncThunk("cart/deleteCartItemInDB", async ({ userId, productId }, thunkApi) => {
    try {
        const response = await axios.delete(`${API_URL}/api/cart/delete`, { data: { userId, productId } })
        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to delete item")
    }
})

//clear cart item in db 

export const clearCartItemInDB = createAsyncThunk("cart/clearCartItemInDB", async (userId, thunkApi) => {
    try {
        const response = await axios.delete(`${API_URL}/api/cart/clear/${userId}`)
        return response.data
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to delete cart Item")
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItem: [],
        status: "idle",
        error: null,
    },
    reducers: {
        addToCart: function (state, action) {
            const { productId, quantity } = action.payload;
            const existingItem = state.cartItem.find((item) => {
                return item.id === productId;
            })

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItem.push({
                    id: productId,
                    quantity: quantity,
                    deliveryOptionId: '1'
                })
            }
            localStorage.setItem('cart', JSON.stringify(state.cartItem))

        },

        updateCart: function (state, action) {
            const { productId, quantity } = action.payload;

            const matchingItem = state.cartItem.find((item) => {
                return item.id === productId;
            })

            if (matchingItem) {
                matchingItem.quantity = quantity;
            }
            localStorage.setItem('cart', JSON.stringify(state.cartItem))
        },

        cartItemDelete: function (state, action) {
            const { productId } = action.payload;

            state.cartItem = state.cartItem.filter((item) => {
                return productId !== item.id;
            })
            localStorage.setItem('cart', JSON.stringify(state.cartItem))
        },

        deliveryOptionChange: function (state, action) {
            const { productId, optionId } = action.payload;
            const matchingItem = state.cartItem.find((item) => {
                return item.id === productId;
            })
            if (matchingItem) {
                matchingItem.deliveryOptionId = optionId
            }
        },

        clearCart: (state) => {
            state.cartItem = [];
            localStorage.removeItem("cart")
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCartFromDB.pending, (state) => {
            state.status = "loading"
        })
            .addCase(fetchCartFromDB.fulfilled, (state, action) => {
                state.status = "success";
                const items = action.payload || [];
                state.cartItem = items.map(item => ({
                    id: item.productId,
                    quantity: item.quantity,
                    deliveryOptionId: item.deliveryOptionId || "1"
                }));
            })
            .addCase(fetchCartFromDB.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;

            })
            .addCase(addCartItemToDB.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
})

export const { addToCart, updateCart, cartItemDelete, deliveryOptionChange, clearCart } = cartSlice.actions;
export default cartSlice.reducer;