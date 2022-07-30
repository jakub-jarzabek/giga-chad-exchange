import React, { useEffect, useContext, useRef, useState } from "react"
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
    Transaction,
    Profile,
} from "../components"
import { Router, useRouter } from "next/router"
export function Index() {
    const router = useRouter()
    const exchangeLoaded = useRef(false)
    const dispatch = useDispatch<AppDispatch>()
    const { exchange } = useSelector<RootState, { exchange: any }>(
        (state) => state.exchange
    )
    const { provider, account, network } = useSelector<
        RootState,
        IProviderSlice
    >((store) => store.connection)

    useEffect(() => {
        if (!account) {
            router.push("/")
        }
        dispatch(Connection.setProvider())
        dispatch(Connection.setAccounts())
        dispatch(Connection.setNetwork())
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
            exchange.on(
                "NewTrade",
                (
                    _id,
                    _initiator,
                    _tokenReceive,
                    _amountReceive,
                    _tokenSend,
                    _amountSend,
                    _creator,
                    _ts,
                    event
                ) => {
                    console.log(event)
                    dispatch(
                        Exchange.appendTrade({
                            id: _id,
                            initiator: _initiator,
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

    const [activeTab, setActiveTab] = useState(1)

    return (
        <div className="flex flex-col">
            {account && <Navbar onTabChange={(e) => setActiveTab(e)} />}
            <div className="w-full flex flex-row">
                {activeTab === 1 ? (
                    <>
                        <div className="w-1/4 h-full flex-col bg-slate-700 drop-shadow-lg">
                            <TraidingPairSelector />
                            <Balance />
                            <Order />
                        </div>
                        <div className="w-3/4 h-full flex-col bg-slate-500 p-10">
                            <OrderBook />
                            <Transaction />
                        </div>
                    </>
                ) : (
                    <Profile />
                )}
            </div>
        </div>
    )
}

export default Index
