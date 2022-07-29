import { Tab, TabList } from "@web3uikit/core"
import { ITokens, RootState } from "packages/frontend/redux"
import React, { useState } from "react"
import { useSelector } from "react-redux"

export const Transaction = () => {
    const { symbols } = useSelector<RootState, ITokens>((state) => state.token)
    const [tab, setTab] = useState(1)
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <h1 className="text text-2xl">My orders</h1>
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
            <div className="flex flex-row"></div>
        </div>
    )
}
