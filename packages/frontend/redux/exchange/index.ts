import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

const initialState = {}
const exchangeSlice = createSlice({
    name: "exchange",
    initialState,
    reducers: {},
})

// const {} = exchangeSlice.actions
export const Exchange = {}
export default exchangeSlice.reducer
