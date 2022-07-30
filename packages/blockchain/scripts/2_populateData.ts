import { ethers } from "hardhat"
import config from "../deployed/data.json"
import { parseToken } from "../utils"

const wait = (seconds: number) => {
    const milliseconds = seconds * 1000
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function main() {
    console.log("running...")
    const accounts = await ethers.getSigners()
    const network = await ethers.provider.getNetwork()
    const chainId = network.chainId as 69 | 31337
    const gcc = await ethers.getContractAt("Token", config[chainId].gcc)
    const gwc = await ethers.getContractAt("Token", config[chainId].gwc)
    const gnc = await ethers.getContractAt("Token", config[chainId].gnc)
    const exchange = await ethers.getContractAt(
        "Exchange",
        config[chainId].exchange
    )
    console.log(`Exchange fetched: ${exchange.address}\n`)

    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = parseToken(10000, 18)

    let transaction, result
    transaction = await gwc.connect(sender).transfer(receiver.address, amount)

    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = parseToken(10000, 18)

    transaction = await gcc.connect(user1).approve(exchange.address, amount)
    await transaction.wait()

    transaction = await exchange.connect(user1).deposit(gcc.address, amount)
    await transaction.wait()

    transaction = await gwc.connect(user2).approve(exchange.address, amount)
    await transaction.wait()

    transaction = await exchange.connect(user2).deposit(gwc.address, amount)
    await transaction.wait()

    let orderId
    transaction = await exchange
        .connect(user1)
        .placeOrder(
            gwc.address,
            parseToken(100, 18),
            gcc.address,
            parseToken(5, 18)
        )
    result = await transaction.wait()

    orderId = result!.events![0]!.args!._id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()

    await wait(1)

    transaction = await exchange
        .connect(user1)
        .placeOrder(
            gwc.address,
            parseToken(100, 18),
            gcc.address,
            parseToken(10, 18)
        )
    result = await transaction.wait()

    orderId = result!.events![0]!.args!._id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()

    await wait(1)

    transaction = await exchange.placeOrder(
        gwc.address,
        parseToken(50, 18),
        gcc.address,
        parseToken(15, 18)
    )
    result = await transaction.wait()

    orderId = result!.events![0]!.args!._id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()

    await wait(1)

    transaction = await exchange
        .connect(user1)
        .placeOrder(
            gwc.address,
            parseToken(200, 18),
            gcc.address,
            parseToken(20, 18)
        )
    result = await transaction.wait()

    orderId = result!.events![0]!.args!._id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()

    await wait(1)

    for (let i = 1; i <= 10; i++) {
        transaction = await exchange
            .connect(user1)
            .placeOrder(
                gwc.address,
                parseToken(10 * i, 18),
                gcc.address,
                parseToken(10, 18)
            )
        result = await transaction.wait()

        await wait(1)
    }

    for (let i = 1; i <= 10; i++) {
        transaction = await exchange
            .connect(user2)
            .placeOrder(
                gcc.address,
                parseToken(10, 18),
                gwc.address,
                parseToken(10 * i, 18)
            )
        result = await transaction.wait()

        await wait(1)
    }
    console.log("done")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
