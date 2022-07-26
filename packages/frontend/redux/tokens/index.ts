import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { IProviderSlice } from "../connection"
import { ethers } from "ethers"
import TOKEN from "@blockchain/artifacts/contracts/Token.sol/Token.json"

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
const initialState = {
    loaded: false,
    tokens: [],
    symbols: [],
}
const tokenSlice = createSlice({
    name: "tokens",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setToken.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loaded = true
            state.tokens = [...state.tokens, action.payload.token]
            state.symbols = [...state.symbols, action.payload.symbol]
        })
    },
})
export const Tokens = { setToken }
export default tokenSlice.reducer
