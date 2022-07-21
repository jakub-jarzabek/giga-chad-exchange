import { ethers } from "hardhat"

export const parseToken = (count: number, decimals: number) =>
    BigInt(count * Math.pow(10, decimals))
