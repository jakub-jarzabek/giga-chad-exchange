import { expect } from "chai"
import { ethers } from "hardhat"
import { describe } from "mocha"
import {} from ""

const TOKEN_NAME = "Giga Chad Exchange"
const TOKEN_SYMBOL = "GCC"

describe("Giga Chad Coin", () => {
    let token

    beforeEach(async () => {
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy()
    })
    describe("Testing Deployment:", () => {
        it("Should have name Giga Chad Coin", async () => {
            expect(await token.name()).equal(TOKEN_NAME)
        })
        it("Should have symbol GCC", async () => {
            expect(await token.symbol()).equal(TOKEN_SYMBOL)
        })
    })
})
