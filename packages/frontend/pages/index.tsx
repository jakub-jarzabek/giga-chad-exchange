import styles from "./index.module.css"
import React, { useEffect, useContext } from "react"
import { ethers } from "ethers"
import { Web3Context } from "./_app"
import Token from "@blockchain/artifacts/contracts/Token.sol/Token.json"
import { Provider } from "../redux"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux"
import { Web3Provider } from "@ethersproject/providers"

const loadBlockChain = async () => {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    })
}

export function Index() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(Provider.setProvider())
        dispatch(Provider.setNetwork("aaa"))
    }, [])
    const { provider } = useSelector<RootState, { provider: Web3Provider }>(
        (store) => store.provider
    )
    useEffect(() => {
        loadBlockChain()
        const token = new ethers.Contract(
            "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            Token.abi,
            provider
        )
        console.log(token.address)
    }, [provider])
    return <div className="text-green-300">app</div>
}

export default Index
