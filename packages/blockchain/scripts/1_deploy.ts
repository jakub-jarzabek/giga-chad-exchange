import { ethers } from "hardhat"
import { GCC_TOKEN, GNC_TOKEN, GWC_TOKEN, EXCHANGE } from "../constants/"
async function main() {
    const Token = await ethers.getContractFactory("Token")
    const Exchange = await ethers.getContractFactory("Exchange")
    const accounts = await ethers.getSigners()

    // Deploy contracts
    const gcc = await Token.deploy(
        GCC_TOKEN.NAME,
        GCC_TOKEN.SYMBOL,
        GCC_TOKEN.DECIMALS,
        GCC_TOKEN.TOTAL_SUPPLY
    )
    await gcc.deployed()
    console.log(`GCC Deployed to: ${gcc.address}`)

    const gnc = await Token.deploy(
        GNC_TOKEN.NAME,
        GNC_TOKEN.SYMBOL,
        GNC_TOKEN.DECIMALS,
        GNC_TOKEN.TOTAL_SUPPLY
    )
    await gnc.deployed()
    console.log(`GNC Deployed to: ${gnc.address}`)

    const gwc = await Token.deploy(
        GWC_TOKEN.NAME,
        GWC_TOKEN.SYMBOL,
        GWC_TOKEN.DECIMALS,
        GWC_TOKEN.TOTAL_SUPPLY
    )
    await gwc.deployed()
    console.log(`GWC Deployed to: ${gwc.address}`)

    const exchange = await Exchange.deploy(accounts[1].address, EXCHANGE.FEE)
    await exchange.deployed()
    console.log(`Exchange Deployed to: ${exchange.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
