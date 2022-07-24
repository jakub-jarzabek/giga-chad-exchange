import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ContractReceipt, ContractTransaction } from "ethers"
import { Result } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { describe } from "mocha"
import { EXCHANGE, GCC_TOKEN, GWC_TOKEN } from "../constants"
import { Exchange, Token } from "../typechain-types/"
import { parseToken } from "../utils"

describe("Exchange", () => {
    let deployer: SignerWithAddress
    let exchangeAccount: SignerWithAddress
    let user_1: SignerWithAddress
    let user_2: SignerWithAddress
    let exchange: Exchange
    let token_1: Token
    let token_2: Token
    const { FEE } = EXCHANGE
    const { NAME, SYMBOL, TOTAL_SUPPLY, DECIMALS } = GCC_TOKEN

    beforeEach(async () => {
        const accountsArray = await ethers.getSigners()
        deployer = accountsArray[0]
        exchangeAccount = accountsArray[1]
        const Exchange = await ethers.getContractFactory("Exchange")
        const Token = await ethers.getContractFactory("Token")
        token_1 = await Token.deploy(NAME, SYMBOL, DECIMALS, TOTAL_SUPPLY)
        token_2 = await Token.deploy(
            GWC_TOKEN.NAME,
            GWC_TOKEN.SYMBOL,
            GWC_TOKEN.DECIMALS,
            GWC_TOKEN.TOTAL_SUPPLY
        )
        exchange = await Exchange.deploy(exchangeAccount.address, FEE)
        user_1 = accountsArray[2]
        user_2 = accountsArray[3]
        const transaction = await token_1
            .connect(deployer)
            .transfer(user_1.address, parseToken(10, DECIMALS))
        await transaction.wait()
    })
    describe("Testing Deployment", () => {
        it("Should deploy with exchange account set up", async () => {
            expect(await exchange.exchangeAccount()).to.equal(
                exchangeAccount.address
            )
        })
        it(`Fee should equal to ${FEE}`, async () => {
            expect(await exchange.fee()).to.equal(FEE)
        })
    })
    describe("Testing Deposit", () => {
        let depositResult: ContractReceipt
        let approveResult: ContractReceipt
        const amount = parseToken(1, DECIMALS)

        describe("Successful Deposit", () => {
            beforeEach(async () => {
                const approveTransaction = await token_1
                    .connect(user_1)
                    .approve(exchange.address, amount)
                approveResult = await approveTransaction.wait()
                const depositTransaction = await exchange
                    .connect(user_1)
                    .deposit(token_1.address, amount)
                depositResult = await depositTransaction.wait()
            })
            it("Should successful token deposit", async () => {
                expect(await token_1.balanceOf(exchange.address)).to.equal(
                    amount
                )

                expect(
                    await exchange.balanceOf(token_1.address, user_1.address)
                ).to.equal(amount)
            })
            it(`Should emit event`, async () => {
                const event = depositResult!.events![1]
                expect(event.event)?.to.equal("Deposit")
                expect(event.args!._token).to.equal(token_1.address)
                expect(event.args!._user).to.equal(user_1.address)
                expect(event.args!._amount).to.equal(amount)
                expect(event.args!._balance).to.equal(amount)
            })
        })
        describe("Fail Deposit", () => {
            it(`Should fail with unauthorized error`, async () => {
                expect(
                    exchange.connect(user_1).deposit(token_1.address, amount)
                ).to.be.revertedWithCustomError(
                    token_1,
                    "Token__Unauthorized_Transfer"
                )
            })
        })
        describe("Successful Withdrawal", () => {
            let result: ContractReceipt
            beforeEach(async () => {
                const approveTransaction = await token_1
                    .connect(user_1)
                    .approve(exchange.address, amount)
                approveResult = await approveTransaction.wait()
                const depositTransaction = await exchange
                    .connect(user_1)
                    .deposit(token_1.address, amount)
                depositResult = await depositTransaction.wait()
                const withdrawTransaction = await exchange
                    .connect(user_1)
                    .withdraw(token_1.address, amount)
                result = await withdrawTransaction.wait()
            })
            it("Should successfuly transfer fund", async () => {
                expect(await token_1.balanceOf(user_1.address)).to.eq(
                    parseToken(10, DECIMALS)
                )
            })
            it("Should decrese funds from exchange balance", async () => {
                expect(
                    await exchange.balanceOf(token_1.address, user_1.address)
                ).to.eq(0)
            })
            it("Emit Event", async () => {
                const event = result!.events![1]
                expect(event.event)?.to.equal("Withdraw")
                expect(event.args!._token).to.equal(token_1.address)
                expect(event.args!._user).to.equal(user_1.address)
                expect(event.args!._amount).to.equal(amount)
                expect(event.args!._balance).to.equal(0)
            })
        })

        describe("Fail Withdrawal", () => {
            beforeEach(async () => {
                const approveTransaction = await token_1
                    .connect(user_1)
                    .approve(exchange.address, amount)
                approveResult = await approveTransaction.wait()
                const depositTransaction = await exchange
                    .connect(user_1)
                    .deposit(token_1.address, amount)
                depositResult = await depositTransaction.wait()
            })
        })

        it("Should fail when insufficient funds ", async () => {
            expect(
                exchange
                    .connect(user_1)
                    .withdraw(token_1.address, parseToken(100, DECIMALS))
            ).to.be.revertedWithCustomError(
                exchange,
                "Exchange__Insufficient_Tokens"
            )
        })
    })

    describe("Placing Orders", () => {
        let transaction
        let result: ContractReceipt
        const amount = parseToken(1, DECIMALS)
        beforeEach(async () => {
            transaction = await token_1
                .connect(user_1)
                .approve(exchange.address, amount)
            await transaction.wait()
            transaction = await exchange
                .connect(user_1)
                .deposit(token_1.address, amount)
            await transaction.wait()
            console.log(
                await exchange.balanceOf(token_1.address, user_1.address)
            )

            transaction = await exchange
                .connect(user_1)
                .placeOrder(token_2.address, amount, token_1.address, amount)
            result = await transaction.wait()
        })

        describe("Successful Orders", () => {
            // beforeEach(async () => {})
            it("Tracks created order", async () => {
                expect(await exchange.orderCount()).equal(1)
            })
            it(`Should emit event`, async () => {
                const event = result!.events![0]
                expect(event.event)?.to.equal("NewOrder")
                expect(event.args!._id).to.equal(1)
                expect(event.args!._creator).to.equal(user_1.address)
                expect(event.args!._tokenReceive).to.equal(token_2.address)
                expect(event.args!._tokenSend).to.equal(token_1.address)
                expect(event.args!._amountSend).to.equal(amount)
                expect(event.args!._amountReceive).to.equal(amount)
            })
        })

        describe("Failed Orders", () => {
            it("Should reject with insufficient funds", async () => {
                expect(
                    await exchange
                        .connect(user_1)
                        .placeOrder(
                            token_2.address,
                            parseToken(1, DECIMALS),
                            token_1.address,
                            parseToken(1, DECIMALS)
                        )
                ).to.be.revertedWithCustomError(
                    exchange,
                    "Exchange__Insufficient_Tokens"
                )
            })
        })
    })
    describe("Order actions", async () => {
        let result: ContractReceipt
        let transaction: ContractTransaction
        const amount = parseToken(1, DECIMALS)

        beforeEach(async () => {
            transaction = await token_1
                .connect(user_1)
                .approve(exchange.address, amount)
            result = await transaction.wait()

            transaction = await exchange
                .connect(user_1)
                .deposit(token_1.address, amount)
            result = await transaction.wait()

            transaction = await token_2
                .connect(deployer)
                .transfer(user_2.address, parseToken(5, DECIMALS))
            result = await transaction.wait()

            transaction = await token_2
                .connect(user_2)
                .approve(exchange.address, parseToken(2, DECIMALS))
            result = await transaction.wait()

            transaction = await exchange
                .connect(user_2)
                .deposit(token_2.address, parseToken(2, DECIMALS))
            result = await transaction.wait()

            transaction = await exchange
                .connect(user_1)
                .placeOrder(token_2.address, amount, token_1.address, amount)
            result = await transaction.wait()
        })

        describe("Cancelling orders", async () => {
            describe("Success", async () => {
                beforeEach(async () => {
                    transaction = await exchange.connect(user_1).cancelOrder(1)
                    result = await transaction.wait()
                })

                it("update cannceled orders mapping", async () => {
                    expect(await exchange.idToCancelledStatus(1)).to.equal(true)
                })

                it("emits event", async () => {
                    const event = result!.events![0]
                    expect(event.event).to.equal("Cancel")

                    const args = event.args
                    expect(args!._id).to.equal(1)
                    expect(args!._creator).to.equal(user_1.address)
                    expect(args!._tokenReceive).to.equal(token_2.address)
                    expect(args!._amountReceive).to.equal(amount)
                    expect(args!._tokenSend).to.equal(token_1.address)
                    expect(args!._amountSend).to.equal(amount)
                })
            })

            describe("Failure", async () => {
                beforeEach(async () => {
                    transaction = await token_1
                        .connect(user_1)
                        .approve(exchange.address, amount)
                    result = await transaction.wait()
                    transaction = await exchange
                        .connect(user_1)
                        .deposit(token_1.address, amount)
                    result = await transaction.wait()
                    transaction = await exchange
                        .connect(user_1)
                        .placeOrder(
                            token_2.address,
                            amount,
                            token_1.address,
                            amount
                        )
                    result = await transaction.wait()
                })

                it("rejects invalid order ids", async () => {
                    await expect(
                        exchange.connect(user_1).cancelOrder(21323)
                    ).to.be.revertedWithCustomError(
                        exchange,
                        "Exchange__Order_Doesnt_Exist"
                    )
                })

                it("Reject unauthorized cancel with UnathorizedCancel error", async () => {
                    await expect(
                        exchange.connect(user_2).cancelOrder(1)
                    ).to.be.revertedWithCustomError(
                        exchange,
                        "Exchange__Unauthorized_Cancel"
                    )
                })
            })
        })
        describe("Filling Order", async () => {
            let result: ContractReceipt
            beforeEach(async () => {
                const transaction = await exchange.connect(user_2).fillOrder(1)
                result = await transaction.wait()
            })
            describe("Success", async () => {
                beforeEach(async () => {
                    null
                })

                it("Should Transfer fund and take fee", async () => {
                    expect(
                        await exchange.balanceOf(
                            token_1.address,
                            user_1.address
                        )
                    ).to.equal(parseToken(0, DECIMALS))
                    expect(
                        await exchange.balanceOf(
                            token_1.address,
                            user_2.address
                        )
                    ).to.equal(parseToken(1, DECIMALS))
                    expect(
                        await exchange.balanceOf(
                            token_1.address,
                            exchangeAccount.address
                        )
                    ).to.equal(parseToken(0, DECIMALS))
                    expect(
                        await exchange.balanceOf(
                            token_2.address,
                            user_1.address
                        )
                    ).to.equal(parseToken(1, DECIMALS))
                    expect(
                        await exchange.balanceOf(
                            token_2.address,
                            user_2.address
                        )
                    ).to.equal(parseToken(0.9, DECIMALS))
                    expect(
                        await exchange.balanceOf(
                            token_2.address,
                            exchangeAccount.address
                        )
                    ).to.equal(parseToken(0.1, DECIMALS))
                })
                it("emits an  event", async () => {
                    const event = result!.events![0]

                    expect(event.event).to.equal("NewTrade")

                    const args = event!.args as Result
                    expect(args._id).to.equal(1)
                    expect(args._initiator).to.equal(user_2.address)
                    expect(args._tokenReceive).to.equal(token_2.address)
                    expect(args._amountReceive).to.equal(amount)
                    expect(args._tokenSend).to.equal(token_1.address)
                    expect(args._amountSend).to.equal(amount)
                    expect(args._creator).to.equal(user_1.address)
                })
            })

            describe("Failure", async () => {
                it("rejects orders with invalid id", async () => {
                    await expect(
                        exchange.connect(user_2).fillOrder(11111)
                    ).to.be.revertedWithCustomError(
                        exchange,
                        "Exchange__Order_Doesnt_Exist"
                    )
                })

                it("rejects already filled orders", async () => {
                    await expect(
                        exchange.connect(user_2).fillOrder(1)
                    ).to.be.revertedWithCustomError(
                        exchange,
                        "Exchange__Order_Cant_Be_Completed"
                    )
                })
            })
        })
    })
})
