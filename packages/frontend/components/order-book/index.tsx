import { ethers } from "ethers"
import { ITokens, RootState } from "packages/frontend/redux"
import React from "react"
import { useSelector } from "react-redux"

export const OrderBook = () => {
    const { symbols } = useSelector<RootState, ITokens>((state) => state.token)
    const { exchange } = useSelector<RootState, { exchange: any }>(
        (state) => state.exchange
    )
    const placeholder = [1, 2]
    return (
        <div className="flex flex-col w-full bg-pink-300 shadow-lg">
            <h1 className="text-white text-3xl font-semibold">Order Book</h1>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h2 className="text-white text-2xl font-semibold">
                        Selling
                    </h2>
                    <div className="flex flex-row justify-between">
                        <span className="text-blue-300">
                            {symbols && symbols[0]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[0] + "/" + symbols[1]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[1]}
                        </span>
                    </div>
                    {placeholder.map((_) => (
                        <div className="flex flex-row justify-between">
                            <span className="text-white">100</span>
                            <span className="text-red-600">100</span>
                            <span className="text-white">100</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-white text-2xl font-semibold">
                        Buying
                    </h2>
                    <div className="flex flex-row justify-between">
                        <span className="text-blue-300">
                            {symbols && symbols[0]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[0] + "/" + symbols[1]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[1]}
                        </span>
                    </div>
                    {placeholder.map((_) => (
                        <div className="flex flex-row justify-between">
                            <span className="text-white">100</span>
                            <span className="text-green-600">100</span>
                            <span className="text-white">100</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
