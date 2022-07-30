import { Button, Tab, TabList } from "@web3uikit/core"
import {
    AppDispatch,
    Exchange,
    IOrder,
    IProviderSlice,
    ITokens,
    ITrade,
    RootState,
} from "packages/frontend/redux"
import { parseBigInt } from "packages/frontend/utils"
import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { format } from "date-fns"

export const Transaction = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { symbols } = useSelector<RootState, ITokens>((state) => state.token)
    const { orders, trades } = useSelector<
        RootState,
        { orders: IOrder[]; trades: ITrade[] }
    >((state) => state.exchange)
    const { tokens } = useSelector<RootState, ITokens>((state) => state.token)
    const { account } = useSelector<RootState, IProviderSlice>(
        (state) => state.connection
    )
    const myOrders = orders
        .filter((_) => _.creator === account)
        .filter(
            (_) =>
                _.tokenReceive === tokens[1].address ||
                _.tokenSend === tokens[1].address
        )
    const myTrades = trades
        .filter((_) => _.creator === account)
        .filter(
            (_) =>
                _.tokenReceive === tokens[1].address ||
                _.tokenSend === tokens[1].address
        )
    const [tab, setTab] = useState(1)
    const handleCancel = (order: IOrder) => {
        dispatch(Exchange.cancelOrder(order))
    }

    return (
        <div className="flex flex-col w-100 mt-10 border-blue-300 border rounded p-4 shadow bg-slate-700">
            <div className="flex flex-row justify-between">
                <h1 className="text text-2xl text-white">
                    {tab === 1 ? "My orders" : "My trades"}
                </h1>
                <div className="flex justify-center items-center">
                    <TabList
                        defaultActiveKey={1}
                        onChange={(e) => setTab(e)}
                        tabStyle="bulbUnion"
                    >
                        <Tab tabName="Orders" tabKey={1}></Tab>
                        <Tab tabName="Trades" tabKey={2}></Tab>
                    </TabList>
                </div>
            </div>
            {tab === 1 ? (
                <>
                    <div className="flex flex-row justify-between mb-2">
                        <span className="text-blue-300">
                            {symbols && symbols[0]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && `${symbols[0]} / ${symbols[1]}`}
                        </span>
                        <span></span>
                    </div>
                    {myOrders?.map((_) => {
                        return (
                            <div className="flex flex-row justify-between">
                                <span className="text-white w-10">
                                    {_.tokenReceive === tokens[0].address
                                        ? parseBigInt(
                                              _.amountReceive.toBigInt()
                                          ).toString()
                                        : parseBigInt(
                                              _.amountSend.toBigInt()
                                          ).toString()}
                                </span>
                                <span className=" text-white text-right w-10">
                                    {_.tokenReceive === tokens[0].address
                                        ? (
                                              _.amountReceive.toBigInt() /
                                              _.amountSend.toBigInt()
                                          ).toString()
                                        : (
                                              _.amountSend.toBigInt() /
                                              _.amountReceive.toBigInt()
                                          ).toString()}
                                </span>
                                <Button
                                    text="Cancel"
                                    onClick={() => handleCancel(_)}
                                />
                            </div>
                        )
                    })}
                </>
            ) : (
                <>
                    <div className="flex flex-row justify-between mb-2">
                        <span className="text-blue-300">
                            {symbols && symbols[0]}
                        </span>
                        <span className="text-blue-300">
                            {symbols && `${symbols[0]} / ${symbols[1]}`}
                        </span>
                        <span className="text-blue-300">Date</span>
                    </div>
                    {myTrades?.map((_) => {
                        console.log({ ts: _.ts.toString() })
                        return (
                            <div className="flex flex-row justify-between">
                                <span className="text-white w-10">
                                    {_.tokenReceive === tokens[0].address
                                        ? parseBigInt(
                                              _.amountReceive.toBigInt()
                                          ).toString()
                                        : parseBigInt(
                                              _.amountSend.toBigInt()
                                          ).toString()}
                                </span>
                                <span className=" text-white text-right w-10">
                                    {_.tokenReceive === tokens[0].address
                                        ? (
                                              _.amountReceive.toBigInt() /
                                              _.amountSend.toBigInt()
                                          ).toString()
                                        : (
                                              _.amountSend.toBigInt() /
                                              _.amountReceive.toBigInt()
                                          ).toString()}
                                </span>
                                <span className="text-white">
                                    {format(
                                        Number(_.ts.toString() + "000"),
                                        "dd-M-yyyy"
                                    )}
                                </span>
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}
