- [Giga Chad Exchange](#giga-chad-exchange)
  - [Getting started](#getting-started)
  - [Available Tokens](#available-tokens)
    - [Extending available coins](#extending-available-coins)
  - [Contracts](#contracts)
  - [Project structure](#project-structure)

# Giga Chad Exchange

Project that showcase implementation of exchange for ERC-20 Tokens.

## Getting started

1. Clone repo
    ```
    https://github.com/jakub-jarzabek/giga-chad-exchange
    ```
2. Install dependencies
    ```
    cd giga-chad-exchange && yarn
    ```
3. Run local node

    ```
    npx nx run blockchain:start-node
    ```

4. Deploy contracts to local node

    ```
    npx nx run blockchain:deploy
    ```

5. (Optional) Populate example data (e.g. to make available orders visible)

    ```
    npx nx run blockchain:populate-data
    ```

6. Start frontend

    ```
    npx nx run frontend:serve
    ```

## Available Tokens

Out of box there are 3 available coins to trande

1. Giga Chad Coin (GCC) - main token that serves as main cryptocurrencty wrapper for deployed blockchain (e.g. wrapped ETH for ethereum)
2. Giga Weeb Coin (GWC) - side token, GCC can be traded to acquire
3. Giga Normic Coin (GNC) -side token, GCC can be traded to acquire

### Extending available coins

To extend available coins with custom one follow steps:

1. In `blockchain/constants/Token.ts` add configuration for new token that maches interface:

    ```typescript
    interface IToken {
        NAME: string
        SYMBOL: string
        DECIMALS: number
        TOTAL_SUPPLY: number
    }
    ```

2. In `blockchain/scripts/1_deploy.ts` add deployment script for new token

    ```typescript
    const <TOKEN> = await Token.deploy(
        GCC_TOKEN.NAME,
        GCC_TOKEN.SYMBOL,
        GCC_TOKEN.DECIMALS,
        GCC_TOKEN.TOTAL_SUPPLY
    )
    await <TOKEN>.deployed()
    obj[chainId].<TOKEN> = <TOKEN>.address
    ```

3. Run deploy script again your token address will be saved in `blockchain/deployed/data.json` file and can be accessed in frontend by:

    ```typescript
    import data from '@blockchain/deployed/data.json`
    ```

4. Adjust frontend to allow operations on new token

## Contracts

1. Token.sol - Basic token cotract from scratch that mimic ERC-20 standard implementation
2. Exchange.sol - Contract for allowing users to store tokens in exchange and trade them

## Project structure

    ```
    giga-chad-exchange/
    ├─ tools/
    │  ├─ <tools and executors for nx monorepo>
    ├─ packages/
    │  ├─ blockchain/
    │  │  ├─ <hardhat project>
    │  ├─ frontend/
    │  │  ├─ <next js frontend>
    ```
