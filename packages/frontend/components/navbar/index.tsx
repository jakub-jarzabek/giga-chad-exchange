import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IProviderSlice, RootState } from "packages/frontend/redux"
import { TabList, Tab, Dropdown } from "@web3uikit/core"

interface INavbar {
    onTabChange: (_: number) => void
}
export const Navbar: React.FC<INavbar> = ({ onTabChange }) => {
    const { account, balance } = useSelector<RootState, IProviderSlice>(
        (state) => state.connection
    )
    const [tab, setTab] = useState(1)
    useEffect(() => {
        onTabChange(tab)
    }, [tab])

    const handleNetworkChange = async (e: { id: string; label: string }) => {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: e.id }],
        })
    }

    return (
        <div className="flex flex-row bg-slate-900 rounded w-full h-20 items-center justify-between px-4">
            <div className="text-3xl text-white font-semibold whitespace-nowrap">
                Giga Chad Exchange
            </div>
            <div className="flex flex-row items-center justify-between gap-6">
                <div>
                    <Dropdown
                        label="Chain: "
                        defaultOptionIndex={0}
                        onChange={handleNetworkChange}
                        options={[
                            {
                                id: "0x7A69",
                                label: "Localhost",
                            },
                            {
                                id: "0x2a",
                                label: "Kovan",
                            },
                        ]}
                    />
                </div>
                <div className="flex justify-center items-center pt-6">
                    <TabList
                        defaultActiveKey={1}
                        onChange={(e) => setTab(e)}
                        tabStyle="bulbUnion"
                    >
                        <Tab tabName="Dashboard" tabKey={1}></Tab>
                        <Tab tabName="Profile" tabKey={2}></Tab>
                    </TabList>
                </div>
            </div>
            <div className="flex flex-row w-60 h-10">
                <div className="bg-slate-400 text-black rounded w-1/2 text-center flex justify-center items-center">
                    <span>{balance && Number(balance).toFixed(2)} ETH</span>
                </div>
                <div className="bg-slate-600 text-white rounded-tr rounded-br w-1/2 text-center flex justify-center items-center">
                    <span>
                        {account &&
                            account.slice(0, 5) + "..." + account.slice(37, 42)}
                    </span>
                </div>
            </div>
        </div>
    )
}
