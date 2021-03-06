/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MultiBridgeToken, MultiBridgeTokenInterface } from "../MultiBridgeToken";

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
      {
        indexed: false,
        internalType: "uint256",
        name: "supplyCap",
        type: "uint256",
      },
    ],
    name: "BridgeSupplyCapUpdated",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "bridges",
    outputs: [
      {
        internalType: "uint256",
        name: "cap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total",
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
      {
        internalType: "uint256",
        name: "_cap",
        type: "uint256",
      },
    ],
    name: "updateBridgeSupplyCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620014153803806200141583398101604081905262000034916200024b565b8251839083906200004d906003906020850190620000d8565b50805162000063906004906020840190620000d8565b50505062000077336200008660201b60201c565b60ff16608052506200030d9050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000e690620002d0565b90600052602060002090601f0160209004810192826200010a576000855562000155565b82601f106200012557805160ff191683800117855562000155565b8280016001018555821562000155579182015b828111156200015557825182559160200191906001019062000138565b506200016392915062000167565b5090565b5b8082111562000163576000815560010162000168565b634e487b7160e01b600052604160045260246000fd5b600082601f830112620001a657600080fd5b81516001600160401b0380821115620001c357620001c36200017e565b604051601f8301601f19908116603f01168101908282118183101715620001ee57620001ee6200017e565b816040528381526020925086838588010111156200020b57600080fd5b600091505b838210156200022f578582018301518183018401529082019062000210565b83821115620002415760008385830101525b9695505050505050565b6000806000606084860312156200026157600080fd5b83516001600160401b03808211156200027957600080fd5b620002878783880162000194565b945060208601519150808211156200029e57600080fd5b50620002ad8682870162000194565b925050604084015160ff81168114620002c557600080fd5b809150509250925092565b600181811c90821680620002e557607f821691505b602082108114156200030757634e487b7160e01b600052602260045260246000fd5b50919050565b6080516110ec6200032960003960006101de01526110ec6000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c806379cc6790116100cd578063a457c2d711610081578063ced67f0c11610066578063ced67f0c146102f1578063dd62ed3e1461032d578063f2fde38b1461036657600080fd5b8063a457c2d7146102cb578063a9059cbb146102de57600080fd5b80638da5cb5b116100b25780638da5cb5b146102b257806395d89b41146102c35780639dc29fac1461027f57600080fd5b806379cc67901461027f578063893d20e81461029257600080fd5b8063395093511161012457806342966c681161010957806342966c681461022e5780634ce2f71a1461024157806370a082311461025657600080fd5b8063395093511461020857806340c10f191461021b57600080fd5b806318160ddd1161015557806318160ddd146101b257806323b872dd146101c4578063313ce567146101d757600080fd5b806306fdde0314610171578063095ea7b31461018f575b600080fd5b610179610379565b6040516101869190610ef8565b60405180910390f35b6101a261019d366004610f69565b61040b565b6040519015158152602001610186565b6002545b604051908152602001610186565b6101a26101d2366004610f93565b610423565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610186565b6101a2610216366004610f69565b610447565b6101a2610229366004610f69565b610486565b6101a261023c366004610fcf565b610560565b61025461024f366004610f69565b610574565b005b6101b6610264366004610fe8565b6001600160a01b031660009081526020819052604090205490565b6101a261028d366004610f69565b610635565b61029a610648565b6040516001600160a01b039091168152602001610186565b6005546001600160a01b031661029a565b610179610661565b6101a26102d9366004610f69565b610670565b6101a26102ec366004610f69565b61071a565b6103186102ff366004610fe8565b6006602052600090815260409020805460019091015482565b60408051928352602083019190915201610186565b6101b661033b366004611003565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b610254610374366004610fe8565b610728565b60606003805461038890611036565b80601f01602080910402602001604051908101604052809291908181526020018280546103b490611036565b80156104015780601f106103d657610100808354040283529160200191610401565b820191906000526020600020905b8154815290600101906020018083116103e457829003601f168201915b5050505050905090565b600033610419818585610819565b5060019392505050565b60003361043185828561093e565b61043c8585856109d0565b506001949350505050565b3360008181526001602090815260408083206001600160a01b03871684529091528120549091906104199082908690610481908790611087565b610819565b33600090815260066020526040812080546104e85760405162461bcd60e51b815260206004820152600e60248201527f696e76616c69642063616c6c657200000000000000000000000000000000000060448201526064015b60405180910390fd5b828160010160008282546104fc9190611087565b90915550508054600182015411156105565760405162461bcd60e51b815260206004820152601960248201527f657863656564732062726964676520737570706c79206361700000000000000060448201526064016104df565b6104198484610bcd565b600061056c3383610cac565b506001919050565b336105876005546001600160a01b031690565b6001600160a01b0316146105dd5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104df565b6001600160a01b038216600081815260066020908152604091829020849055815192835282018390527f59e1e4348943de408b89af8ab71e502ea722dd41efd1ff4a3548c60e83e91c60910160405180910390a15050565b60006106418383610df2565b9392505050565b600061065c6005546001600160a01b031690565b905090565b60606004805461038890611036565b3360008181526001602090815260408083206001600160a01b03871684529091528120549091908381101561070d5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016104df565b61043c8286868403610819565b6000336104198185856109d0565b3361073b6005546001600160a01b031690565b6001600160a01b0316146107915760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104df565b6001600160a01b03811661080d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016104df565b61081681610e8e565b50565b6001600160a01b03831661087b5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016104df565b6001600160a01b0382166108dc5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016104df565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b0383811660009081526001602090815260408083209386168352929052205460001981146109ca57818110156109bd5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016104df565b6109ca8484848403610819565b50505050565b6001600160a01b038316610a4c5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016104df565b6001600160a01b038216610aae5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016104df565b6001600160a01b03831660009081526020819052604090205481811015610b3d5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016104df565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610b74908490611087565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610bc091815260200190565b60405180910390a36109ca565b6001600160a01b038216610c235760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104df565b8060026000828254610c359190611087565b90915550506001600160a01b03821660009081526020819052604081208054839290610c62908490611087565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038216610d0c5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016104df565b6001600160a01b03821660009081526020819052604090205481811015610d805760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016104df565b6001600160a01b0383166000908152602081905260408120838303905560028054849290610daf90849061109f565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610931565b3360009081526006602052604081208054151580610e14575060008160010154115b15610e79578281600101541015610e6d5760405162461bcd60e51b815260206004820152601c60248201527f6578636565647320627269646765206d696e74656420616d6f756e740000000060448201526064016104df565b60018101805484900390555b610e8484338561093e565b6104198484610cac565b600580546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600060208083528351808285015260005b81811015610f2557858101830151858201604001528201610f09565b81811115610f37576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b0381168114610f6457600080fd5b919050565b60008060408385031215610f7c57600080fd5b610f8583610f4d565b946020939093013593505050565b600080600060608486031215610fa857600080fd5b610fb184610f4d565b9250610fbf60208501610f4d565b9150604084013590509250925092565b600060208284031215610fe157600080fd5b5035919050565b600060208284031215610ffa57600080fd5b61064182610f4d565b6000806040838503121561101657600080fd5b61101f83610f4d565b915061102d60208401610f4d565b90509250929050565b600181811c9082168061104a57607f821691505b6020821081141561106b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561109a5761109a611071565b500190565b6000828210156110b1576110b1611071565b50039056fea264697066735822122073db55689a68b5e29f02d581b45dc6e35ff63abd717950efd044b054f2ce0ca464736f6c63430008090033";

type MultiBridgeTokenConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: MultiBridgeTokenConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class MultiBridgeToken__factory extends ContractFactory {
  constructor(...args: MultiBridgeTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MultiBridgeToken";
  }

  deploy(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<MultiBridgeToken> {
    return super.deploy(name_, symbol_, decimals_, overrides || {}) as Promise<MultiBridgeToken>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, decimals_, overrides || {});
  }
  attach(address: string): MultiBridgeToken {
    return super.attach(address) as MultiBridgeToken;
  }
  connect(signer: Signer): MultiBridgeToken__factory {
    return super.connect(signer) as MultiBridgeToken__factory;
  }
  static readonly contractName: "MultiBridgeToken";
  public readonly contractName: "MultiBridgeToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiBridgeTokenInterface {
    return new utils.Interface(_abi) as MultiBridgeTokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): MultiBridgeToken {
    return new Contract(address, _abi, signerOrProvider) as MultiBridgeToken;
  }
}
