import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ContractReceipt } from "ethers"
import { ethers } from "hardhat"
import { describe } from "mocha"
import { GCC_TOKEN } from "../constants"
import { Token__factory, Token } from "../typechain-types"
import { parseToken } from "../utils"

describe("Giga Chad Coin", () => {
    let token: Token
    let accountsArray: SignerWithAddress[]
    let deployerAccount: SignerWithAddress

    beforeEach(async () => {
        const Token: Token__factory = await ethers.getContractFactory("Token")
        token = await Token.deploy(
            GCC_TOKEN.NAME,
            GCC_TOKEN.SYMBOL,
            GCC_TOKEN.DECIMALS,
            GCC_TOKEN.TOTAL_SUPPLY
        )
        accountsArray = await ethers.getSigners()
        deployerAccount = accountsArray[0]
    })

    const { NAME, SYMBOL, DECIMALS, TOTAL_SUPPLY } = GCC_TOKEN
    describe("Testing GCC Deployment:", () => {
        it(`Should have name ${NAME}`, async () => {
            expect(await token.name()).equal(NAME)
        })
        it(`Should have symbol ${SYMBOL}`, async () => {
            expect(await token.symbol()).equal(SYMBOL)
        })
        it(`Should have decimals equal to ${NAME}`, async () => {
            expect(await token.decimals()).equal(DECIMALS)
        })
        it(`Should have total suply equal to ${TOTAL_SUPPLY}*10^${DECIMALS}`, async () => {
            expect(await token.totalSupply()).equal(
                parseToken(TOTAL_SUPPLY, DECIMALS)
            )
        })
        it(`Should assign ${TOTAL_SUPPLY} tokens to Sender`, async () => {
            expect(await token.balanceOf(deployerAccount.address)).equal(
                parseToken(TOTAL_SUPPLY, DECIMALS)
            )
        })
    })
    describe("Testing GCC Succesful Transfers", () => {
        const amount = parseToken(10, DECIMALS)
        let result: ContractReceipt
        beforeEach(async () => {
            token.connect(deployerAccount)
            const transfer = await token.transfer(
                accountsArray[1].address,
                amount
            )
            result = await transfer.wait()
        })
        it(`Should take 10 tokens from deployer`, async () => {
            expect(await token.balanceOf(deployerAccount.address)).to.equal(
                parseToken(TOTAL_SUPPLY, DECIMALS) - amount
            )
        })
        it(`Should give 10 tokens to account 1`, async () => {
            expect(await token.balanceOf(accountsArray[1].address)).to.equal(
                amount
            )
        })
        it(`Should emit event`, async () => {
            const event = result.events![0]
            expect(event.event)?.to.equal("Transfer")
            expect(event.args!._from).to.equal(deployerAccount.address)
            expect(event.args!._to).to.equal(accountsArray[1].address)
            expect(event.args!._value).to.equal(parseToken(10, DECIMALS))
        })
    })
    describe(`Testing failing GCC Transfers`, () => {
        beforeEach(() => {
            token.connect(accountsArray[2].address)
        })
        it("Should reject with Not_Enough_Funds", async () => {
            expect(
                token.transfer(
                    deployerAccount.address,
                    parseToken(10, DECIMALS)
                )
            ).to.be.revertedWithCustomError(token, "Token__Not_Enough_Funds")
        })
    })
    describe(`Testing succesful GCC Approval`, () => {
        const amount = parseToken(10, DECIMALS)

        let result: ContractReceipt
        beforeEach(async () => {
            token.connect(deployerAccount)
            const transfer = await token.approve(
                accountsArray[3].address,
                amount
            )
            result = await transfer.wait()
        })
        it("Should succesfuly allocate allowance", async () => {
            expect(
                await token.allowance(
                    deployerAccount.address,
                    accountsArray[3].address
                )
            ).to.equal(amount)
        })
        it(`Should emit approval event`, async () => {
            const event = result.events![0]
            expect(event.event)?.to.equal("Approval")
            expect(event.args!._owner).to.equal(deployerAccount.address)
            expect(event.args!._spender).to.equal(accountsArray[3].address)
            expect(event.args!._value).to.equal(parseToken(10, DECIMALS))
        })
    })
    describe(`Testing delegted transfer`, () => {
        const amount = parseToken(10, DECIMALS)

        let result: ContractReceipt
        beforeEach(async () => {
            token.connect(accountsArray[3])
            const transfer = await token.approve(
                deployerAccount.address,
                amount
            )
            result = await transfer.wait()
        })
        describe("Successful transfer", () => {
            beforeEach(async () => {
                await token.connect(accountsArray[3].address)
                const transfer = await token.transferFrom(
                    deployerAccount.address,
                    accountsArray[3].address,
                    amount
                )
                result = await transfer.wait()
            })
            it(`Should tranfer tokens to accountArray[3]`, async () => {
                expect(await token.balanceOf(deployerAccount.address)).to.equal(
                    parseToken(TOTAL_SUPPLY - 10, DECIMALS)
                )
                expect(
                    await token.balanceOf(accountsArray[3].address)
                ).to.equal(parseToken(10, DECIMALS))
            })

            it(`Should decrease allowance value`, async () => {
                expect(
                    await token.allowance(
                        deployerAccount.address,
                        accountsArray[3].address
                    )
                ).to.equal(0)
            })
        })
        describe("Fail transfer", () => {
            beforeEach(async () => {
                token.connect(accountsArray[3].address)
            })
            it(`Should fail with unauthorized error`, async () => {
                expect(
                    token.transferFrom(
                        accountsArray[2].address,
                        accountsArray[3].address,
                        amount
                    )
                ).to.be.revertedWithCustomError(
                    token,
                    "Token__Unauthorized_Transfer"
                )
            })
        })
    })
})
