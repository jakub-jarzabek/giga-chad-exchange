import React from "react"
import { Dropdown } from "@web3uikit/core"
import addresses from "@blockchain/deployed/data.json"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, IProviderSlice, RootState } from "packages/frontend/redux"
import { Tokens } from "../../redux"
export const TraidingPairSelector = () => {
    const { network } = useSelector<RootState, IProviderSlice>(
        (state) => state.connection
    )
    const dispatch = useDispatch<AppDispatch>()

    const handleTraidingPairChange = ({
        id,
        label,
    }: {
        id: string
        label: string
    }) => {
        const tokens = id.split(",")
        console.log(tokens)
        dispatch(Tokens.removeTokens())
        dispatch(Tokens.setToken(tokens[0]))
        dispatch(Tokens.setToken(tokens[1]))
    }
    return (
        <div className="flex flex-col border-b border-b-blue-400 p-4 items-center">
            <h1 className="text-2xl text-white font-mono mb-4">
                Traiding Pair
            </h1>
            <div className="mb-4 text-white">
                {network && addresses[network] && (
                    <Dropdown
                        defaultOptionIndex={0}
                        onChange={handleTraidingPairChange}
                        options={[
                            {
                                id: `${addresses[network].gcc},${addresses[network].gcc}`,
                                label: "GCC/GWC",
                            },
                            {
                                id: `${addresses[network].gcc},${addresses[network].gnc}`,
                                label: "GCC/GNC",
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    )
}
