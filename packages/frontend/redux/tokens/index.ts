import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { IProviderSlice } from "../connection"
import { ethers } from "ethers"
import TOKEN from "@blockchain/artifacts/contracts/Token.sol/Token.json"
import { TransactionDescription } from "@ethersproject/abi"

interface IReduxState {
    connection: IProviderSlice
    token: ITokens
    exchange: { exchange: ethers.Contract }
}

const setToken = createAsyncThunk(
    "payload/setToken",
    async (address: string, thunkAPI) => {
        const state = thunkAPI.getState() as { connection: IProviderSlice }
        const token = new ethers.Contract(
            address,
            TOKEN.abi,
            state.connection.provider
        )
        const symbol = await token.symbol()
        return { token, symbol }
    }
)
const loadBalances = createAsyncThunk(
    "payload/loadBalances",
    async (args, thunkAPI) => {
        const state = thunkAPI.getState() as {
            connection: IProviderSlice
            token: ITokens
        }
        const balance = [
            ethers.utils.formatUnits(
                await state.token.tokens[0].balanceOf(state.connection.account),
                18
            ),
            ethers.utils.formatUnits(
                await state.token.tokens[1].balanceOf(state.connection.account),
                18
            ),
        ]

        return { balance }
    }
)
interface ITransfer {
    amount: number
    token: ethers.Contract
}
const transferTokens = createAsyncThunk(
    "payload/transferTokens",
    async ({ amount, token }: ITransfer, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        state.token.loaded = false
        const signer = state.connection.provider.getSigner()
        const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18)

        let transaction
        transaction = await token
            .connect(signer)
            .approve(state.exchange.exchange.address, parsedAmount)

        await transaction.wait()
        transaction = await state.exchange.exchange
            .connect(signer)
            .deposit(token.address, parsedAmount)
        await transaction.wait()

        state.token.loaded = true
        return {}
    }
)
const withdrawTokens = createAsyncThunk(
    "payload/withdraw",
    async ({ amount, token }: ITransfer, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        state.token.loaded = false
        const signer = state.connection.provider.getSigner()
        const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18)

        let transaction
        transaction = await state.exchange.exchange
            .connect(signer)
            .withdraw(token.address, parsedAmount)
        await transaction.wait()

        state.token.loaded = true
        return {}
    }
)
const transferSuccess = createAsyncThunk(
    "payload/transferTokens",
    async (event, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        return {}
    }
)
const loadExchangeBalances = createAsyncThunk(
    "payload/loadExchangeBalances",
    async (args, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState
        const balance = [
            ethers.utils.formatUnits(
                await state.exchange.exchange.balanceOf(
                    state.token.tokens[0].address,
                    state.connection.account
                ),
                18
            ),
            ethers.utils.formatUnits(
                await state.exchange.exchange.balanceOf(
                    state.token.tokens[1].address,
                    state.connection.account
                ),
                18
            ),
        ]

        return { balance }
    }
)
export interface ITokens {
    loaded: boolean
    tokens: any[]
    symbols: string[]
    balance: string[]
    exchangeBalance: string[]
}
const initialState: ITokens = {
    loaded: false,
    tokens: [],
    symbols: [],
    balance: [],
    exchangeBalance: [],
}
const tokenSlice = createSlice({
    name: "tokens",
    initialState,
    reducers: {
        removeTokens(state) {
            if (typeof window !== "undefined") {
                state.tokens = []
            }
            state.symbols = []
            state.loaded = false
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setToken.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loaded = true
            state.tokens = [...state.tokens, action.payload.token]
            state.symbols = [...state.symbols, action.payload.symbol]
        }),
            builder.addCase(loadBalances.fulfilled, (state, action) => {
                state.balance = action.payload.balance
            })
        builder.addCase(loadExchangeBalances.fulfilled, (state, action) => {
            state.exchangeBalance = action.payload.balance
        })
    },
})
const { removeTokens } = tokenSlice.actions
export const Tokens = {
    setToken,
    removeTokens,
    loadBalances,
    loadExchangeBalances,
    transferTokens,
    withdrawTokens,
}
export default tokenSlice.reducer
