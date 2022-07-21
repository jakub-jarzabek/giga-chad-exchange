/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Exchange, ExchangeInterface } from "../Exchange";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_exchangeAccount",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Exchange__Insufficient_Tokens",
    type: "error",
  },
  {
    inputs: [],
    name: "Exchange__Order_Doesnt_Exist",
    type: "error",
  },
  {
    inputs: [],
    name: "Exchange__Unauthorized_Cancel",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenReceive",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenSend",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountReceive",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountSend",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ts",
        type: "uint256",
      },
    ],
    name: "Cancel",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenReceive",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenSend",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountReceive",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountSend",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_ts",
        type: "uint256",
      },
    ],
    name: "NewOrder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "cancelOrder",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeAccount",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "idToCancelledStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "orderCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenReceive",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountReceive",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_tokenSend",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountSend",
        type: "uint256",
      },
    ],
    name: "placeOrder",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620011dc380380620011dc83398181016040528101906200003791906200012b565b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600181905550505062000172565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620000b8826200008b565b9050919050565b620000ca81620000ab565b8114620000d657600080fd5b50565b600081519050620000ea81620000bf565b92915050565b6000819050919050565b6200010581620000f0565b81146200011157600080fd5b50565b6000815190506200012581620000fa565b92915050565b6000806040838503121562000145576200014462000086565b5b60006200015585828601620000d9565b9250506020620001688582860162000114565b9150509250929050565b61105a80620001826000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063afe1841311610066578063afe1841314610146578063c130296314610176578063ddca3f4314610194578063f3fef3a3146101b2578063f7888aec146101e257610093565b80632453ffa81461009857806347e7ef24146100b6578063514fcac7146100e657806352a6856914610116575b600080fd5b6100a0610212565b6040516100ad9190610b97565b60405180910390f35b6100d060048036038101906100cb9190610c41565b610218565b6040516100dd9190610c9c565b60405180910390f35b61010060048036038101906100fb9190610cb7565b610408565b60405161010d9190610c9c565b60405180910390f35b610130600480360381019061012b9190610cb7565b6105d7565b60405161013d9190610c9c565b60405180910390f35b610160600480360381019061015b9190610ce4565b6105f7565b60405161016d9190610c9c565b60405180910390f35b61017e610831565b60405161018b9190610d5a565b60405180910390f35b61019c610855565b6040516101a99190610b97565b60405180910390f35b6101cc60048036038101906101c79190610c41565b61085b565b6040516101d99190610c9c565b60405180910390f35b6101fc60048036038101906101f79190610d75565b610af7565b6040516102099190610b97565b60405180910390f35b60025481565b60008273ffffffffffffffffffffffffffffffffffffffff166323b872dd3330856040518463ffffffff1660e01b815260040161025793929190610db5565b602060405180830381600087803b15801561027157600080fd5b505af1158015610285573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102a99190610e18565b6102b257600080fd5b81600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461033e9190610e74565b925050819055507fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7833384600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040516103f69493929190610eca565b60405180910390a16001905092915050565b6000806004600084815260200190815260200160002090508281600001541461045d576040517f2ffe0f1600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146104e6576040517fa05714bc00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016005600085815260200190815260200160002060006101000a81548160ff0219169083151502179055507fe8d25d2f6eceef558e98ad616c916a121977dfabe738706f33c90243aec05a90838260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168360020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168460030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168560040154866005015487600601546040516105c59796959493929190610f0f565b60405180910390a16001915050919050565b60056020528060005260406000206000915054906101000a900460ff1681565b6000816106048433610af7565b101561063c576040517fb6d0447b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600081548092919061064f90610f7e565b91905055506040518060e0016040528060025481526020013373ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff168152602001858152602001838152602001428152506004600060025481526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060608201518160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080820151816004015560a0820151816005015560c082015181600601559050507f3525b12f407abc5d108472230e7f7e80e506a1e21ab020160d1197fb02da370960025433878688874260405161081d9796959493929190610f0f565b60405180910390a160019050949350505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b600081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015610913576040517fb6d0447b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b81600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461099f9190610fc7565b925050819055508273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33846040518363ffffffff1660e01b81526004016109e1929190610ffb565b602060405180830381600087803b1580156109fb57600080fd5b505af1158015610a0f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a339190610e18565b507ff341246adaac6f497bc2a656f546ab9e182111d630394f0c57c710a59a2cb567833384600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051610ae59493929190610eca565b60405180910390a16001905092915050565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000819050919050565b610b9181610b7e565b82525050565b6000602082019050610bac6000830184610b88565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610be282610bb7565b9050919050565b610bf281610bd7565b8114610bfd57600080fd5b50565b600081359050610c0f81610be9565b92915050565b610c1e81610b7e565b8114610c2957600080fd5b50565b600081359050610c3b81610c15565b92915050565b60008060408385031215610c5857610c57610bb2565b5b6000610c6685828601610c00565b9250506020610c7785828601610c2c565b9150509250929050565b60008115159050919050565b610c9681610c81565b82525050565b6000602082019050610cb16000830184610c8d565b92915050565b600060208284031215610ccd57610ccc610bb2565b5b6000610cdb84828501610c2c565b91505092915050565b60008060008060808587031215610cfe57610cfd610bb2565b5b6000610d0c87828801610c00565b9450506020610d1d87828801610c2c565b9350506040610d2e87828801610c00565b9250506060610d3f87828801610c2c565b91505092959194509250565b610d5481610bd7565b82525050565b6000602082019050610d6f6000830184610d4b565b92915050565b60008060408385031215610d8c57610d8b610bb2565b5b6000610d9a85828601610c00565b9250506020610dab85828601610c00565b9150509250929050565b6000606082019050610dca6000830186610d4b565b610dd76020830185610d4b565b610de46040830184610b88565b949350505050565b610df581610c81565b8114610e0057600080fd5b50565b600081519050610e1281610dec565b92915050565b600060208284031215610e2e57610e2d610bb2565b5b6000610e3c84828501610e03565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e7f82610b7e565b9150610e8a83610b7e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ebf57610ebe610e45565b5b828201905092915050565b6000608082019050610edf6000830187610d4b565b610eec6020830186610d4b565b610ef96040830185610b88565b610f066060830184610b88565b95945050505050565b600060e082019050610f24600083018a610b88565b610f316020830189610d4b565b610f3e6040830188610d4b565b610f4b6060830187610d4b565b610f586080830186610b88565b610f6560a0830185610b88565b610f7260c0830184610b88565b98975050505050505050565b6000610f8982610b7e565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610fbc57610fbb610e45565b5b600182019050919050565b6000610fd282610b7e565b9150610fdd83610b7e565b925082821015610ff057610fef610e45565b5b828203905092915050565b60006040820190506110106000830185610d4b565b61101d6020830184610b88565b939250505056fea2646970667358221220f2422441b596ac74aa8232c2bed6d80ac3c79f3f3cf37076aa290a19133f76b664736f6c63430008090033";

type ExchangeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExchangeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Exchange__factory extends ContractFactory {
  constructor(...args: ExchangeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _exchangeAccount: PromiseOrValue<string>,
    _fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Exchange> {
    return super.deploy(
      _exchangeAccount,
      _fee,
      overrides || {}
    ) as Promise<Exchange>;
  }
  override getDeployTransaction(
    _exchangeAccount: PromiseOrValue<string>,
    _fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_exchangeAccount, _fee, overrides || {});
  }
  override attach(address: string): Exchange {
    return super.attach(address) as Exchange;
  }
  override connect(signer: Signer): Exchange__factory {
    return super.connect(signer) as Exchange__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExchangeInterface {
    return new utils.Interface(_abi) as ExchangeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Exchange {
    return new Contract(address, _abi, signerOrProvider) as Exchange;
  }
}