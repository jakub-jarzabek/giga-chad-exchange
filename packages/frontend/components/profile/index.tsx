import { IReduxState, RootState } from "packages/frontend/redux"
import React, { useEffect, useState } from "react"
import Blockies from "react-blockies"
import { useSelector } from "react-redux"
import TOKEN from "@blockchain/artifacts/contracts/Token.sol/Token.json"
import ADDRESSES from "@blockchain/deployed/data.json"
import { ethers } from "ethers"
import { parseBigInt } from "packages/frontend/utils"

interface IBalance {
    wallet: {
        gwc: string
        gnc: string
        gcc: string
    }
    exchange: {
        gwc: string
        gnc: string
        gcc: string
    }
}
export const Profile = () => {
    const { account, provider } = useSelector<RootState, { account; provider }>(
        (state) => state.connection
    )
    const { exchange } = useSelector<RootState, { exchange: any }>(
        (state) => state.exchange
    )
    const [balance, setBalance] = useState<IBalance>(null)
    useEffect(() => {
        const GCC = new ethers.Contract(
            ADDRESSES[31337].gcc,
            TOKEN.abi,
            provider
        )

        const GWC = new ethers.Contract(
            ADDRESSES[31337].gwc,
            TOKEN.abi,
            provider
        )
        const GNC = new ethers.Contract(
            ADDRESSES[31337].gnc,
            TOKEN.abi,
            provider
        )
        ;(async function getBalance() {
            const waGCC = await GCC.balanceOf(account)
            const waGWC = await GWC.balanceOf(account)
            const waGNC = await GNC.balanceOf(account)
            const exGCC = await exchange.balanceOf(
                ADDRESSES[31337].gcc,
                account
            )
            const exGWC = await exchange.balanceOf(
                ADDRESSES[31337].gwc,
                account
            )
            const exGNC = await exchange.balanceOf(
                ADDRESSES[31337].gnc,
                account
            )
            setBalance({
                wallet: {
                    gcc: parseBigInt(BigInt(waGCC)).toString(),
                    gwc: parseBigInt(BigInt(waGWC)).toString(),
                    gnc: parseBigInt(BigInt(waGNC)).toString(),
                },
                exchange: {
                    gcc: parseBigInt(BigInt(exGCC)).toString(),
                    gwc: parseBigInt(BigInt(exGWC)).toString(),
                    gnc: parseBigInt(BigInt(exGNC)).toString(),
                },
            })
        })()
    }, [])
    return (
        <div className="flex flex-col w-1/2 ml-auto mr-auto mt-10 shadow rounded border border-blue-300 items-center gap-6 bg-slate-700 p-10">
            <Blockies seed={account} size={50} />
            <h1 className="text-white text-blue-300">
                Address: <span className="text-white">{account}</span>
            </h1>
            <h1 className="text-white text-2xl font-semibold">Balance</h1>
            <h1 className="text-white text-blue-300">
                Giga Chad Coin (Wallet):
                <span className="text-white">
                    {balance && balance.wallet.gcc}
                </span>
            </h1>
            <h1 className="text-white text-blue-300">
                Giga Chad Coin (Exchange):
                <span className="text-white">
                    {balance && balance.exchange.gcc}
                </span>
            </h1>
            <h1 className="text-white text-blue-300">
                Giga Weeb Coin (Wallet):
                <span className="text-white">
                    {balance && balance.wallet.gwc}
                </span>
            </h1>
            <h1 className="text-white text-blue-300">
                Giga Weeb Coin (Exchange):
                <span className="text-white">
                    {balance && balance.exchange.gwc}
                </span>
            </h1>
            <h1 className="text-white text-blue-300">
                Giga Normic Coin (Wallet):
                <span className="text-white">
                    {balance && balance.wallet.gnc}
                </span>
            </h1>
            <h1 className="text-white text-blue-300">
                Giga Normic Coin (Exchange):
                <span className="text-white">
                    {balance && balance.exchange.gnc}
                </span>
            </h1>
        </div>
    )
}
