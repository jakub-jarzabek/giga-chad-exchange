import { ethers } from "ethers"
import {
    AppDispatch,
    Exchange,
    IOrder,
    ITokens,
    RootState,
} from "packages/frontend/redux"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { parseBigInt } from "packages/frontend/utils"

export const OrderBook = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { symbols, tokens } = useSelector<RootState, ITokens>(
        (state) => state.token
    )
    const { exchange, orders } = useSelector<
        RootState,
        { exchange: any; orders: IOrder[] }
    >((state) => state.exchange)
    console.log(orders)
    const buyOrders = orders.filter(
        (order) => order.tokenReceive === tokens[1].address
    )
    const sellOrders = orders.filter(
        (order) => order.tokenSend === tokens[1].address
    )
    const handleOrder = async (order: IOrder) => {
        dispatch(Exchange.fillOrder(order))
    }
    return (
        <div className="flex flex-col w-100 bg-slate-700 shadow-lg border-blue-300 border rounded p-4">
            <h1 className="text-white text-3xl font-semibold mb-8">
                Order Book
            </h1>
            <div className="flex flex-row justify-around gap-8">
                <div className="flex flex-col w-1/2 ">
                    <h2 className="text-white text-2xl font-semibold mb-2 ">
                        Selling
                    </h2>
                    <div className="flex flex-row justify-between">
                        <span className="text-blue-300">
                            {symbols && symbols[1]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[1] + "/" + symbols[0]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && symbols[0]}
                        </span>
                    </div>
                    {sellOrders.map((_) => (
                        <div
                            onClick={() => handleOrder(_)}
                            className="flex flex-row justify-between px-2 rounded cursor-pointer hover:bg-blue-700 hover:bg-opacity-50"
                        >
                            <span className="text-white">
                                {parseBigInt(
                                    _.amountSend.toBigInt()
                                ).toString()}
                            </span>
                            <span className="text-red-600">
                                {(
                                    _.amountSend.toBigInt() /
                                    _.amountReceive.toBigInt()
                                ).toString()}
                            </span>
                            <span className="text-white">
                                {parseBigInt(
                                    _.amountReceive.toBigInt()
                                ).toString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className=" border-r border-r-blue-300"></div>
                <div className="flex flex-col  w-1/2">
                    <h2 className="text-white text-2xl font-semibold mb-2">
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
                    {buyOrders.map((_) => (
                        <div
                            onClick={() => handleOrder(_)}
                            className="flex flex-row justify-between px-2 rounded cursor-pointer hover:bg-blue-700 hover:bg-opacity-50  "
                        >
                            <span className="text-white">
                                {parseBigInt(
                                    _.amountReceive.toBigInt()
                                ).toString()}
                            </span>
                            <span className="text-green-600">
                                {(
                                    _.amountReceive.toBigInt() /
                                    _.amountSend.toBigInt()
                                ).toString()}
                            </span>
                            <span className="text-white">
                                {parseBigInt(
                                    _.amountSend.toBigInt()
                                ).toString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
