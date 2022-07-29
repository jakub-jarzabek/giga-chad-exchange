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

        // state.token.loaded = false

        try {
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

            // state.token.loaded = true
        } catch (err) {
            console.log(err)
        }
        return {}
    }
)
const withdrawTokens = createAsyncThunk(
    "payload/withdraw",
    async ({ amount, token }: ITransfer, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        const signer = state.connection.provider.getSigner()
        const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18)

        let transaction
        transaction = await state.exchange.exchange
            .connect(signer)
            .withdraw(token.address, parsedAmount)
        await transaction.wait()

        return {}
    }
)
interface IPlaceOrder {
    amount: number
    price: number
    tokens: ethers.Contract[]
    type: "B" | "S"
}
const placeOrder = createAsyncThunk(
    "payload/placeOrder",
    async ({ amount, price, tokens, type }: IPlaceOrder, thunkAPI) => {
        const state = thunkAPI.getState() as IReduxState

        const signer = state.connection.provider.getSigner()

        if (type === "B") {
            try {
                const parsedReceive = ethers.utils.parseUnits(
                    amount.toString(),
                    18
                )
                const parsedSend = ethers.utils.parseUnits(
                    (amount * price).toString(),
                    18
                )

                let transaction
                transaction = await state.exchange.exchange
                    .connect(signer)
                    .placeOrder(
                        tokens[0].address,
                        parsedReceive,
                        tokens[1].address,
                        parsedSend
                    )
                await transaction.wait()
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                const parsedSend = ethers.utils.parseUnits(
                    amount.toString(),
                    18
                )
                const parsedReceive = ethers.utils.parseUnits(
                    (amount * price).toString(),
                    18
                )

                let transaction
                transaction = await state.exchange.exchange
                    .connect(signer)
                    .placeOrder(
                        tokens[1].address,
                        parsedReceive,
                        tokens[0].address,
                        parsedSend
                    )
                await transaction.wait()
            } catch (err) {
                console.log(err)
            }
        }
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
    orderLoading: boolean
    tokens: ethers.Contract[] | any
    symbols: string[]
    balance: string[]
    exchangeBalance: string[]
}
const initialState: ITokens = {
    loaded: false,
    orderLoading: false,
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
        builder.addCase(transferTokens.pending, (state, action) => {
            state.loaded = false
        })

        builder.addCase(transferTokens.fulfilled, (state, action) => {
            state.loaded = true
        })
        builder.addCase(withdrawTokens.pending, (state, action) => {
            state.loaded = false
        })

        builder.addCase(withdrawTokens.fulfilled, (state, action) => {
            state.loaded = true
        })
        builder.addCase(placeOrder.pending, (state, action) => {
            state.orderLoading = true
        })

        builder.addCase(placeOrder.fulfilled, (state, action) => {
            state.orderLoading = false
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
    placeOrder,
}
export default tokenSlice.reducer
