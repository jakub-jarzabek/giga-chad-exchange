import React, { useEffect } from "react"
import { Connection, RootState } from "../redux"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../redux"
import { useRouter } from "next/router"
import { Button } from "@web3uikit/core"
export function Index() {
    const { account } = useSelector<RootState, { account }>(
        (state) => state.connection
    )
    const router = useRouter()
    useEffect(() => {
        if (account) {
            router.push("/home")
        }
    }, [account])
    const dispatch = useDispatch<AppDispatch>()
    const logIn = () => {
        dispatch(Connection.setProvider())
        dispatch(Connection.setAccounts())
        dispatch(Connection.setNetwork())
    }
    return (
        <div className="flex flex-col">
            <div className="flex flex-col w-1/2 ml-auto mr-auto mt-10 shadow rounded border border-blue-300 items-center gap-6 bg-slate-700 p-10">
                <Button text="Connect" onClick={logIn} />
            </div>
        </div>
    )
}

export default Index
