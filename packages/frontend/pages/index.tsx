import React, { useEffect, useContext, useRef } from "react"
import { Connection, Exchange, ITokens, Tokens } from "../redux"
import { useDispatch, useSelector } from "react-redux"
import { RootState, IProviderSlice, AppDispatch } from "../redux"
import Addresses from "@blockchain/deployed/data.json"
import {
    Balance,
    Navbar,
    TraidingPairSelector,
    Order,
    OrderBook,
} from "../components"
export function Index() {
    const exchangeLoaded = useRef(false)
    const dispatch = useDispatch<AppDispatch>()
    const { exchange } = useSelector<RootState, { exchange: any }>(
        (state) => state.exchange
    )
    useEffect(() => {
        dispatch(Connection.setProvider())
        dispatch(Connection.setNetwork())
        dispatch(Connection.setAccounts())
        dispatch(Tokens.setToken(Addresses[31337].gcc))
        dispatch(Tokens.setToken(Addresses[31337].gwc))
        dispatch(Exchange.setExchange(Addresses[31337].exchange))
        window.ethereum.on("accountsChanged", () => {
            dispatch(Connection.setProvider())
            dispatch(Connection.setNetwork())
            dispatch(Connection.setAccounts())
        })

        window.ethereum.on("chainChanged", () => {
            window.location.reload()
        })
    }, [])
    useEffect(() => {
        if ("on" in exchange && !exchangeLoaded.current) {
            exchangeLoaded.current = true
            exchange.on(
                "NewOrder",
                (
                    _id,
                    _creator,
                    _tokenReceive,
                    _tokenSend,
                    _amountReceive,
                    _amountSend,
                    _ts,
                    event
                ) => {
                    console.log(event)
                    dispatch(
                        Exchange.appendOrder({
                            id: _id,
                            creator: _creator,
                            tokenReceive: _tokenReceive,
                            tokenSend: _tokenSend,
                            amountReceive: _amountReceive,
                            amountSend: _amountSend,
                            ts: _ts,
                        })
                    )
                }
            )
        }
    }, [exchange])
    const { provider, account, network } = useSelector<
        RootState,
        IProviderSlice
    >((store) => store.connection)

    return (
        <div className="flex flex-col">
            <Navbar onTabChange={(e) => null} />
            <div className="w-full flex flex-row">
                <div className="w-1/4 h-full flex-col bg-slate-700 drop-shadow-lg">
                    <TraidingPairSelector />
                    <Balance />
                    <Order />
                </div>
                <div className="w-3/4 h-full flex-col bg-slate-500 p-10">
                    <OrderBook />
                </div>
            </div>
        </div>
    )
}

export default Index
