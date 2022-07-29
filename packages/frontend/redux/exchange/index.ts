import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { IProviderSlice } from "../connection"
import { ethers } from "ethers"
import EXCHANGE from "@blockchain/artifacts/contracts/Exchange.sol/Exchange.json"

const setExchange = createAsyncThunk(
    "payload/setExchange",
    async (address: string, thunkAPI) => {
        const state = thunkAPI.getState() as { connection: IProviderSlice }
        const exchange = new ethers.Contract(
            address,
            EXCHANGE.abi,
            state.connection.provider
        )
        return exchange
    }
)
const getOrders = createAsyncThunk(
    "payload/setExchange",
    async (address: string, thunkAPI) => {
        const state = thunkAPI.getState() as { connection: IProviderSlice }
        const exchange = new ethers.Contract(
            address,
            EXCHANGE.abi,
            state.connection.provider
        )
        return exchange
    }
)
const initialState = {
    loaded: false,
    exchange: {},
    orders: [],
}
const exchangeSlice = createSlice({
    name: "exchange",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setExchange.fulfilled, (state, action) => {
            state.loaded = true
            state.exchange = action.payload
        })
    },
})
export const Exchange = { setExchange }
export default exchangeSlice.reducer
