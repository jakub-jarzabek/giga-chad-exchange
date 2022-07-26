import { Web3Provider } from "@ethersproject/providers"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { ethers } from "ethers"

export interface IProviderSlice {
    provider: null | Web3Provider
    network: null | number
    account: null | string
    balance: null | string
}
// Async Thunks
const setNetwork = createAsyncThunk(
    "payload/setNetwork",
    async (arg, thunkAPI) => {
        const state = thunkAPI.getState() as { connection: IProviderSlice }
        console.log(state)
        const { chainId } = await state.connection.provider.getNetwork()
        console.log(chainId)
        return chainId
    }
)
const setAccounts = createAsyncThunk(
    "payload/setAccounts",
    async (arg, thunkAPI) => {
        const state = thunkAPI.getState() as { connection: IProviderSlice }
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const account = ethers.utils.getAddress(accounts[0])
        const balance = ethers.utils.formatEther(
            await state.connection.provider.getBalance(account)
        )
        return { account, balance }
    }
)

//Slice
const initialState = {
    provider: null,
    network: null,
    account: null,
    balance: null,
}
const providerSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {
        setProvider(state) {
            if (typeof window !== "undefined") {
                state.provider = new ethers.providers.Web3Provider(
                    window?.ethereum
                )
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(setNetwork.fulfilled, (state, action) => {
            state.network = action.payload
        })
        builder.addCase(setAccounts.fulfilled, (state, action) => {
            state.account = action.payload.account
            state.balance = action.payload.balance
        })
    },
})

const { setProvider } = providerSlice.actions
export const Connection = { setProvider, setAccounts, setNetwork }
export default providerSlice.reducer
