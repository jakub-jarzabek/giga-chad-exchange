import { Button, Input, Tab, TabList } from "@web3uikit/core"
import {
    AppDispatch,
    ITokens,
    RootState,
    Tokens,
} from "packages/frontend/redux"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const Order = () => {
    const dispatch = useDispatch<AppDispatch>()
    const state = useSelector<RootState, ITokens>((state) => state.token)
    const [tab, setTab] = useState(1)
    const [sendAmount, setSendAmount] = useState("")
    const [receivePrice, setReceivePrice] = useState("")
    const placeOrder = async () => {
        if (tab === 1) {
            dispatch(
                Tokens.placeOrder({
                    amount: Number(sendAmount),
                    price: Number(receivePrice),
                    tokens: [...state.tokens],
                    type: "B",
                })
            )
        } else {
            dispatch(
                Tokens.placeOrder({
                    amount: Number(sendAmount),
                    price: Number(receivePrice),
                    tokens: [...state.tokens],
                    type: "S",
                })
            )
        }

        setSendAmount("")
        setReceivePrice("")
    }
    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl text-white font-semibold leading-relaxed">
                    New Order
                </h1>
                <div className="flex justify-center items-center">
                    <TabList
                        defaultActiveKey={1}
                        onChange={(e) => setTab(e)}
                        tabStyle="bulbUnion"
                    >
                        <Tab tabName="Buy" tabKey={1}></Tab>
                        <Tab tabName="Sell" tabKey={2}></Tab>
                    </TabList>
                </div>
            </div>

            <div className="flex flex-col border-b border-b-blue-300 py-2">
                <span className="text-white">
                    {tab == 1 ? "Buy Amount" : "Sell Amount"}
                </span>
                <div className="flex flex-row my-4">
                    <Input
                        width="100%"
                        onChange={(e) => setSendAmount(e.target.value)}
                        value={sendAmount}
                    />
                </div>

                <span className="text-white">
                    {tab == 1 ? "Buy Price" : "Sell Price"}
                </span>

                <div className="flex flex-row my-4">
                    <Input
                        width="100%"
                        value={receivePrice}
                        onChange={(e) => setReceivePrice(e.target.value)}
                    />
                </div>

                <div className="py-4 mb-2">
                    <Button
                        onClick={placeOrder}
                        text={tab == 1 ? "Buy" : "Sell"}
                        isFullWidth
                        customize={{ backgroundColor: "white" }}
                    />
                </div>
            </div>
        </div>
    )
}
