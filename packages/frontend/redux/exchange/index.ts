import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { IProviderSlice } from "../connection"
import { BigNumber, ethers } from "ethers"
import EXCHANGE from "@blockchain/artifacts/contracts/Exchange.sol/Exchange.json"
import { IReduxState } from "../tokens"

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
export interface IOrder {
    id: string
    creator: string
    tokenReceive: string
    tokenSend: string
    amountReceive: BigNumber
    amountSend: BigNumber
    ts: string
}

const fillOrder = createAsyncThunk(
    "payload/fillOrder",
    async (order: IOrder, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        const signer = state.connection.provider.getSigner()

        let transaction
        try {
            transaction = await state.exchange.exchange
                .connect(signer)
                .fillOrder(order.id)
            await transaction.wait()
        } catch {}

        return { order }
    }
)
const initialState = {
    loaded: false,
    exchange: {},
    orders: [] as IOrder[],
}
const exchangeSlice = createSlice({
    name: "exchange",
    initialState,
    reducers: {
        appendOrder: (state, action: PayloadAction<IOrder>) => {
            state.orders = [...state.orders, action.payload]
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setExchange.fulfilled, (state, action) => {
            state.loaded = true
            state.exchange = action.payload
        })
        builder.addCase(fillOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(
                (_) => _.id !== action.payload.order.id
            )
        })
    },
})
const { appendOrder } = exchangeSlice.actions
export const Exchange = { setExchange, appendOrder, fillOrder }
export default exchangeSlice.reducer
