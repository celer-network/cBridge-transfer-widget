/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { SingleBridgeToken, SingleBridgeTokenInterface } from "../SingleBridgeToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "bridge_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
        type: "address",
      },
    ],
    name: "BridgeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "account",
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
    inputs: [],
    name: "bridge",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
    ],
    name: "updateBridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620013a9380380620013a983398101604081905262000034916200027a565b8351849084906200004d90600390602085019062000107565b5080516200006390600490602084019062000107565b505050620000806200007a620000b160201b60201c565b620000b5565b60ff91909116608052600680546001600160a01b0319166001600160a01b03909216919091179055506200035b9050565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b82805462000115906200031e565b90600052602060002090601f01602090048101928262000139576000855562000184565b82601f106200015457805160ff191683800117855562000184565b8280016001018555821562000184579182015b828111156200018457825182559160200191906001019062000167565b506200019292915062000196565b5090565b5b8082111562000192576000815560010162000197565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001d557600080fd5b81516001600160401b0380821115620001f257620001f2620001ad565b604051601f8301601f19908116603f011681019082821181831017156200021d576200021d620001ad565b816040528381526020925086838588010111156200023a57600080fd5b600091505b838210156200025e57858201830151818301840152908201906200023f565b83821115620002705760008385830101525b9695505050505050565b600080600080608085870312156200029157600080fd5b84516001600160401b0380821115620002a957600080fd5b620002b788838901620001c3565b95506020870151915080821115620002ce57600080fd5b50620002dd87828801620001c3565b935050604085015160ff81168114620002f557600080fd5b60608601519092506001600160a01b03811681146200031357600080fd5b939692955090935050565b600181811c908216806200033357607f821691505b602082108114156200035557634e487b7160e01b600052602260045260246000fd5b50919050565b6080516110326200037760003960006101e901526110326000f3fe608060405234801561001057600080fd5b50600436106101775760003560e01c8063715018a6116100d85780639dc29fac1161008c578063dd62ed3e11610066578063dd62ed3e14610304578063e78cea921461033d578063f2fde38b1461035057600080fd5b80639dc29fac14610292578063a457c2d7146102de578063a9059cbb146102f157600080fd5b8063893d20e8116100bd578063893d20e8146102a55780638da5cb5b146102c557806395d89b41146102d657600080fd5b8063715018a61461028a57806379cc67901461029257600080fd5b8063395093511161012f57806342966c681161011457806342966c68146102395780636eb382121461024c57806370a082311461026157600080fd5b8063395093511461021357806340c10f191461022657600080fd5b806318160ddd1161016057806318160ddd146101bd57806323b872dd146101cf578063313ce567146101e257600080fd5b806306fdde031461017c578063095ea7b31461019a575b600080fd5b610184610363565b6040516101919190610e3e565b60405180910390f35b6101ad6101a8366004610eaf565b6103f5565b6040519015158152602001610191565b6002545b604051908152602001610191565b6101ad6101dd366004610ed9565b61040d565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610191565b6101ad610221366004610eaf565b610431565b6101ad610234366004610eaf565b610470565b6101ad610247366004610f15565b6104e5565b61025f61025a366004610f2e565b6104f9565b005b6101c161026f366004610f2e565b6001600160a01b031660009081526020819052604090205490565b61025f6105b4565b6101ad6102a0366004610eaf565b61061a565b6102ad61062d565b6040516001600160a01b039091168152602001610191565b6005546001600160a01b03166102ad565b610184610646565b6101ad6102ec366004610eaf565b610655565b6101ad6102ff366004610eaf565b6106ff565b6101c1610312366004610f49565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6006546102ad906001600160a01b031681565b61025f61035e366004610f2e565b61070d565b60606003805461037290610f7c565b80601f016020809104026020016040519081016040528092919081815260200182805461039e90610f7c565b80156103eb5780601f106103c0576101008083540402835291602001916103eb565b820191906000526020600020905b8154815290600101906020018083116103ce57829003601f168201915b5050505050905090565b6000336104038185856107ef565b5060019392505050565b60003361041b858285610914565b6104268585856109a6565b506001949350505050565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190610403908290869061046b908790610fcd565b6107ef565b6006546000906001600160a01b031633146104d25760405162461bcd60e51b815260206004820152601460248201527f63616c6c6572206973206e6f742062726964676500000000000000000000000060448201526064015b60405180910390fd5b6104dc8383610ba3565b50600192915050565b60006104f13383610c82565b506001919050565b6005546001600160a01b031633146105535760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104c9565b6006805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040519081527fe1694c0b21fdceff6411daed547c7463c2341b9695387bc82595b5b9b1851d4a9060200160405180910390a150565b6005546001600160a01b0316331461060e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104c9565b6106186000610dc8565b565b60006106268383610e27565b9392505050565b60006106416005546001600160a01b031690565b905090565b60606004805461037290610f7c565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156106f25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016104c9565b61042682868684036107ef565b6000336104038185856109a6565b6005546001600160a01b031633146107675760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104c9565b6001600160a01b0381166107e35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016104c9565b6107ec81610dc8565b50565b6001600160a01b0383166108515760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016104c9565b6001600160a01b0382166108b25760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016104c9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b0383811660009081526001602090815260408083209386168352929052205460001981146109a057818110156109935760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016104c9565b6109a084848484036107ef565b50505050565b6001600160a01b038316610a225760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104c9565b6001600160a01b038216610a845760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016104c9565b6001600160a01b03831660009081526020819052604090205481811015610b135760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016104c9565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610b4a908490610fcd565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610b9691815260200190565b60405180910390a36109a0565b6001600160a01b038216610bf95760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104c9565b8060026000828254610c0b9190610fcd565b90915550506001600160a01b03821660009081526020819052604081208054839290610c38908490610fcd565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038216610ce25760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016104c9565b6001600160a01b03821660009081526020819052604090205481811015610d565760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016104c9565b6001600160a01b0383166000908152602081905260408120838303905560028054849290610d85908490610fe5565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610907565b600580546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000610e34833384610914565b6104dc8383610c82565b600060208083528351808285015260005b81811015610e6b57858101830151858201604001528201610e4f565b81811115610e7d576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114610eaa57600080fd5b919050565b60008060408385031215610ec257600080fd5b610ecb83610e93565b946020939093013593505050565b600080600060608486031215610eee57600080fd5b610ef784610e93565b9250610f0560208501610e93565b9150604084013590509250925092565b600060208284031215610f2757600080fd5b5035919050565b600060208284031215610f4057600080fd5b61062682610e93565b60008060408385031215610f5c57600080fd5b610f6583610e93565b9150610f7360208401610e93565b90509250929050565b600181811c90821680610f9057607f821691505b60208210811415610fb157634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115610fe057610fe0610fb7565b500190565b600082821015610ff757610ff7610fb7565b50039056fea264697066735822122069e375e21e8d057f9e9019b38cab3103f97e2f779f19909d1dd20a94a6606a9d64736f6c63430008090033";

type SingleBridgeTokenConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: SingleBridgeTokenConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class SingleBridgeToken__factory extends ContractFactory {
  constructor(...args: SingleBridgeTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "SingleBridgeToken";
  }

  deploy(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    bridge_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<SingleBridgeToken> {
    return super.deploy(name_, symbol_, decimals_, bridge_, overrides || {}) as Promise<SingleBridgeToken>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    bridge_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, decimals_, bridge_, overrides || {});
  }
  attach(address: string): SingleBridgeToken {
    return super.attach(address) as SingleBridgeToken;
  }
  connect(signer: Signer): SingleBridgeToken__factory {
    return super.connect(signer) as SingleBridgeToken__factory;
  }
  static readonly contractName: "SingleBridgeToken";
  public readonly contractName: "SingleBridgeToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SingleBridgeTokenInterface {
    return new utils.Interface(_abi) as SingleBridgeTokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): SingleBridgeToken {
    return new Contract(address, _abi, signerOrProvider) as SingleBridgeToken;
  }
}
