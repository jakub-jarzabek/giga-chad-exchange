import React, { useState, useEffect } from "react"
import { TabList, Tab, Button, Input } from "@web3uikit/core"
import { useSelector } from "react-redux"
import {
    AppDispatch,
    IOrder,
    IProviderSlice,
    ITokens,
    RootState,
} from "packages/frontend/redux"
import { useDispatch } from "react-redux"
import { Tokens } from "packages/frontend/redux"
import { ethers } from "ethers"

export const Balance = () => {
    const { symbols, tokens, balance, exchangeBalance, loaded } = useSelector<
        RootState,
        ITokens
    >((state) => state.token)
    const { account } = useSelector<RootState, IProviderSlice>(
        (state) => state.connection
    )
    const { orders } = useSelector<RootState, { orders: IOrder[] }>(
        (state) => state.exchange
    )

    const [firstAmount, setFirstAmount] = useState("")
    const [secondAmount, setSecondAmount] = useState("")
    const handleDepositFirstToken = async () => {
        if (tab == 1) {
            dispatch(
                Tokens.transferTokens({
                    amount: Number(firstAmount),
                    token: tokens[0],
                })
            )
        } else {
            dispatch(
                Tokens.withdrawTokens({
                    amount: Number(firstAmount),
                    token: tokens[0],
                })
            )
        }
    }
    const handleDepositSecondToken = async () => {
        if (tab == 1) {
            dispatch(
                Tokens.transferTokens({
                    amount: Number(secondAmount),
                    token: tokens[1],
                })
            )
        } else {
            dispatch(
                Tokens.withdrawTokens({
                    amount: Number(firstAmount),
                    token: tokens[1],
                })
            )
        }
    }

    const [tab, setTab] = useState(1)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(Tokens.loadBalances())
        dispatch(Tokens.loadExchangeBalances())
    }, [tokens, account, loaded, orders])
    return (
        <div className="flex flex-col p-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-2xl text-white font-semibold leading-relaxed">
                    Balance
                </h1>
                <div className="flex justify-center items-center">
                    <TabList
                        defaultActiveKey={1}
                        onChange={(e) => setTab(e)}
                        tabStyle="bulbUnion"
                    >
                        <Tab tabName="Deposit" tabKey={1}></Tab>
                        <Tab tabName="Withdraw" tabKey={2}></Tab>
                    </TabList>
                </div>
            </div>

            <div className="flex flex-col border-b border-b-blue-300 py-2">
                <div className="flex flex-row">
                    <span className="text-white">Token:</span>
                    <span className="text-blue-200 ml-2">
                        {symbols && symbols[0]}
                    </span>
                    <span className="text-white ml-8">Wallet:</span>
                    <span className="text-blue-200 ml-2">
                        {balance && balance[0]}
                    </span>
                    <span className="text-white ml-8">Exchange:</span>
                    <span className="text-blue-200 ml-2">
                        {exchangeBalance && exchangeBalance[0]}
                    </span>
                </div>
                <div className="py-4">
                    <Input
                        width="100%"
                        onChange={(e) => setFirstAmount(e.target.value)}
                    />
                </div>
                <div className="py-4 mb-2">
                    <Button
                        text={tab == 1 ? "Deposit" : "Withdraw"}
                        isFullWidth
                        customize={{ backgroundColor: "white" }}
                        onClick={handleDepositFirstToken}
                        isLoading={loaded === false}
                    />
                </div>
            </div>
            <div className="flex flex-col border-b border-b-blue-300 py-2">
                <div className="flex flex-row">
                    <span className="text-white">Token:</span>
                    <span className="text-blue-200 ml-2">
                        {symbols && symbols[1]}
                    </span>
                    <span className="text-white ml-8">Wallet:</span>
                    <span className="text-blue-200 ml-2">
                        {balance && balance[1]}
                    </span>
                    <span className="text-white ml-8">Exchange:</span>
                    <span className="text-blue-200 ml-2">
                        {exchangeBalance && exchangeBalance[1]}
                    </span>
                </div>
                <div className="py-4">
                    <Input
                        width="100%"
                        onChange={(e) => setSecondAmount(e.target.value)}
                    />
                </div>
                <div className="py-4 mb-2">
                    <Button
                        onClick={handleDepositSecondToken}
                        text={tab == 1 ? "Deposit" : "Withdraw"}
                        isFullWidth
                        customize={{ backgroundColor: "white" }}
                        isLoading={loaded === false}
                    />
                </div>
            </div>
        </div>
    )
}
