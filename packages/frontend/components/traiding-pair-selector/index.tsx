import React from "react"
import { Dropdown } from "@web3uikit/core"
import Config from "@blockchain/deployed/data.json"

export const TraidingPairSelector = () => {
    const handleTraidingPairChange = () => {}
    return (
        <div className="flex flex-col border-b border-b-blue-400 p-4 items-center">
            <h1 className="text-2xl text-white font-mono mb-4">
                Traiding Pair
            </h1>
            <div className="mb-4">
                <Dropdown
                    defaultOptionIndex={0}
                    onChange={handleTraidingPairChange}
                    options={[
                        {
                            id: "0x7A69",
                            label: "GCC/GWC",
                        },
                        {
                            id: "0x2a",
                            label: "GCC/GNC",
                        },
                    ]}
                />
            </div>
        </div>
    )
}
