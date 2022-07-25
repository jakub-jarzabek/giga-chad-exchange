import styles from "./index.module.css"
import React, { useEffect, useContext } from "react"
import { ethers } from "ethers"
import { Web3Context } from "./_app"
import Token from "@blockchain/artifacts/contracts/Token.sol/Token.json"
import { Connection } from "../redux"
import { useDispatch, useSelector } from "react-redux"
import { RootState, IProviderSlice, AppDispatch } from "../redux"
import { Web3Provider } from "@ethersproject/providers"
export function Index() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(Connection.setProvider())
        dispatch(Connection.setNetwork())
        dispatch(Connection.setAccounts())
    }, [])
    const { provider, account, network } = useSelector<
        RootState,
        IProviderSlice
    >((store) => store.connection)
    useEffect(() => {
        const token = new ethers.Contract(
            "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            Token.abi,
            provider
        )
    }, [provider])
    return <div className="text-green-300">app</div>
}

export default Index
