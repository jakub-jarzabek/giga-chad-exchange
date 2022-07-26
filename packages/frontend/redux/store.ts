import { configureStore } from "@reduxjs/toolkit"
import connectionReducer from "./connection"
import tokenReducer from "./tokens"
import exchangeReducer from "./exchange"
import thunkMiddleware from "redux-thunk"

export const store = configureStore({
    reducer: {
        connection: connectionReducer,
        exchange: exchangeReducer,
        token: tokenReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            thunkMiddleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
