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
export interface ITrade {
    id: string
    initiator: string
    tokenReceive: string
    tokenSend: string
    amountReceive: BigNumber
    amountSend: BigNumber
    ts: string
    creator: string
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
const cancelOrder = createAsyncThunk(
    "payload/cancelOrder",
    async (order: IOrder, thunkAPI) => {
        console.log("dxxxx")
        const state = thunkAPI.getState() as IReduxState

        const signer = state.connection.provider.getSigner()

        let transaction
        try {
            transaction = await state.exchange.exchange
                .connect(signer)
                .cancelOrder(order.id)
            await transaction.wait()
        } catch (err) {
            console.log(err)
        }

        return { order }
    }
)
const initialState = {
    loaded: false,
    exchange: {},
    orders: [] as IOrder[],
    trades: [] as ITrade[],
}
const exchangeSlice = createSlice({
    name: "exchange",
    initialState,
    reducers: {
        appendOrder: (state, action: PayloadAction<IOrder>) => {
            state.orders = [...state.orders, action.payload]
        },
        appendTrade: (state, action: PayloadAction<ITrade>) => {
            state.trades = [...state.trades, action.payload]
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
const { appendOrder, appendTrade } = exchangeSlice.actions
export const Exchange = {
    setExchange,
    appendOrder,
    fillOrder,
    cancelOrder,
    appendTrade,
}
export default exchangeSlice.reducer
