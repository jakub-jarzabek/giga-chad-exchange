import { ethers, network } from "hardhat"
import fs from "fs"
import path from "path"
import util from "util"
import { GCC_TOKEN, GNC_TOKEN, GWC_TOKEN, EXCHANGE } from "../constants/"

const readFile = util.promisify(fs.readFile)
interface IConfig {
    31337: { gcc: string; gwc: string; gnc: string; exchange: string }
    69: { gcc: string; gwc: string; gnc: string; exchange: string }
}
async function main() {
    const obj: IConfig = JSON.parse(
        await readFile(path.resolve("./deployed/data.json"), "utf8")
    )
    const Token = await ethers.getContractFactory("Token")
    const Exchange = await ethers.getContractFactory("Exchange")
    const accounts = await ethers.getSigners()
    const chainId = (network.config.chainId as 31337 | 69) ?? 31337
    console.log(chainId)

    // Deploy contracts
    const gcc = await Token.deploy(
        GCC_TOKEN.NAME,
        GCC_TOKEN.SYMBOL,
        GCC_TOKEN.DECIMALS,
        GCC_TOKEN.TOTAL_SUPPLY
    )
    await gcc.deployed()
    obj[chainId].gcc = gcc.address
    console.log(`GCC Deployed to: ${gcc.address}`)

    const gnc = await Token.deploy(
        GNC_TOKEN.NAME,
        GNC_TOKEN.SYMBOL,
        GNC_TOKEN.DECIMALS,
        GNC_TOKEN.TOTAL_SUPPLY
    )
    await gnc.deployed()

    obj[chainId].gnc = gnc.address
    console.log(`GNC Deployed to: ${gnc.address}`)

    const gwc = await Token.deploy(
        GWC_TOKEN.NAME,
        GWC_TOKEN.SYMBOL,
        GWC_TOKEN.DECIMALS,
        GWC_TOKEN.TOTAL_SUPPLY
    )
    await gwc.deployed()

    obj[chainId].gwc = gwc.address
    console.log(`GWC Deployed to: ${gwc.address}`)

    const exchange = await Exchange.deploy(accounts[1].address, EXCHANGE.FEE)
    await exchange.deployed()

    obj[chainId].exchange = exchange.address
    console.log(`Exchange Deployed to: ${exchange.address}`)
    fs.writeFileSync(path.resolve("./deployed/data.json"), JSON.stringify(obj))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
