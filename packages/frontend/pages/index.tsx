import React, { useEffect, useContext } from "react"
import { Connection, Exchange, Tokens } from "../redux"
import { useDispatch, useSelector } from "react-redux"
import { RootState, IProviderSlice, AppDispatch } from "../redux"
import Addresses from "@blockchain/deployed/data.json"
import { Balance, Navbar, TraidingPairSelector } from "../components"
import { Order } from "../components/order"
export function Index() {
    const dispatch = useDispatch<AppDispatch>()
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
                <div className="w-3/4 h-full flex-col bg-slate-500"></div>
            </div>
        </div>
    )
}

export default Index
