import { AppProps } from "next/app"
import Head from "next/head"
import { store } from "../redux/store"
import { Provider as ReduxProvider } from "react-redux"
import React from "react"
import "./styles.css"
import { MoralisProvider } from "react-moralis"

export const Web3Context = React.createContext({ provider: null })

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Welcome to frontend!</title>
            </Head>
            <main className="app">
                <ReduxProvider store={store}>
                    <MoralisProvider initializeOnMount={false}>
                        <Component {...pageProps} />
                    </MoralisProvider>
                </ReduxProvider>
            </main>
        </>
    )
}

export default CustomApp
