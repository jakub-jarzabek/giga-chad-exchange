import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

const initialState = {}
const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {},
})

// const {} = tokenSlice.actions
export const Token = {}
export default tokenSlice.reducer
