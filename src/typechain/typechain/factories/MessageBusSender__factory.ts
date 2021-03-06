/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MessageBusSender, MessageBusSenderInterface } from "../MessageBusSender";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ISigsVerifier",
        name: "_sigsVerifier",
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
        indexed: false,
        internalType: "uint256",
        name: "feeBase",
        type: "uint256",
      },
    ],
    name: "FeeBaseUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "feePerByte",
        type: "uint256",
      },
    ],
    name: "FeePerByteUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dstChainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "Message",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dstChainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "srcTransferId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "MessageWithTransfer",
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
    inputs: [
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
    ],
    name: "calcFee",
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
    name: "feeBase",
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
    name: "feePerByte",
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
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_dstChainId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_dstChainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_srcBridge",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_srcTransferId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
    ],
    name: "sendMessageWithTransfer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "setFeeBase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "setFeePerByte",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sigsVerifier",
    outputs: [
      {
        internalType: "contract ISigsVerifier",
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
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cumulativeFee",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "_sigs",
        type: "bytes[]",
      },
      {
        internalType: "address[]",
        name: "_signers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_powers",
        type: "uint256[]",
      },
    ],
    name: "withdrawFee",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "withdrawnFees",
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
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051610ff9380380610ff983398101604081905261002f91610099565b61003833610049565b6001600160a01b03166080526100c9565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100ab57600080fd5b81516001600160a01b03811681146100c257600080fd5b9392505050565b608051610f0e6100eb600039600081816101ee01526103c50152610f0e6000f3fe6080604052600436106100c75760003560e01c806395e911a811610074578063e2c1ed251161004e578063e2c1ed2514610210578063f2fde38b14610230578063f60bbe2a1461025057600080fd5b806395e911a8146101b35780639f3ce55a146101c9578063ccf2683b146101dc57600080fd5b80635335dca2116100a55780635335dca2146101215780635b3e5f50146101545780638da5cb5b1461018157600080fd5b806306c28bd6146100cc5780632ff4c411146100ee5780634289fbb31461010e575b600080fd5b3480156100d857600080fd5b506100ec6100e736600461095a565b610266565b005b3480156100fa57600080fd5b506100ec6101093660046109db565b610310565b6100ec61011c366004610ad1565b610573565b34801561012d57600080fd5b5061014161013c366004610b49565b61065c565b6040519081526020015b60405180910390f35b34801561016057600080fd5b5061014161016f366004610b8b565b60036020526000908152604090205481565b34801561018d57600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161014b565b3480156101bf57600080fd5b5061014160015481565b6100ec6101d7366004610ba6565b610680565b3480156101e857600080fd5b5061019b7f000000000000000000000000000000000000000000000000000000000000000081565b34801561021c57600080fd5b506100ec61022b36600461095a565b610763565b34801561023c57600080fd5b506100ec61024b366004610b8b565b610801565b34801561025c57600080fd5b5061014160025481565b336102796000546001600160a01b031690565b6001600160a01b0316146102d45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b60018190556040518181527f892dfdc99ecd3bb4f2f2cb118dca02f0bd16640ff156d3c6459d4282e336a5f2906020015b60405180910390a150565b6000463060405160200161036692919091825260601b6bffffffffffffffffffffffff191660208201527f77697468647261774665650000000000000000000000000000000000000000006034820152603f0190565b60408051808303601f19018152828252805160209182012090830181905260608c901b6bffffffffffffffffffffffff19168383015260548084018c9052825180850390910181526074840192839052633416de1160e11b90925292507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169163682dbc229161040c918b908b908b908b908b908b90607801610d50565b60006040518083038186803b15801561042457600080fd5b505afa158015610438573d6000803e3d6000fd5b505050506001600160a01b03891660009081526003602052604081205461045f908a610e02565b9050600081116104b15760405162461bcd60e51b815260206004820152601960248201527f4e6f206e657720616d6f756e7420746f2077697468647261770000000000000060448201526064016102cb565b6001600160a01b038a166000818152600360205260408082208c90555190919061c35090849084818181858888f193505050503d8060008114610510576040519150601f19603f3d011682016040523d82523d6000602084013e610515565b606091505b50509050806105665760405162461bcd60e51b815260206004820152601660248201527f6661696c656420746f207769746864726177206665650000000000000000000060448201526064016102cb565b5050505050505050505050565b468514156105b55760405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a590818da185a5b9259608a1b60448201526064016102cb565b60006105c1838361065c565b9050803410156106065760405162461bcd60e51b815260206004820152601060248201526f496e73756666696369656e742066656560801b60448201526064016102cb565b336001600160a01b03167f172762498a59a3bc4fed3f2b63f94f17ea0193cffdc304fe7d3eaf4d342d2f668888888888883460405161064b9796959493929190610e19565b60405180910390a250505050505050565b60025460009061066c9083610e66565b6001546106799190610e85565b9392505050565b468314156106c25760405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a590818da185a5b9259608a1b60448201526064016102cb565b60006106ce838361065c565b9050803410156107135760405162461bcd60e51b815260206004820152601060248201526f496e73756666696369656e742066656560801b60448201526064016102cb565b336001600160a01b03167fce3972bfffe49d317e1d128047a97a3d86b25c94f6f04409f988ef854d25e0e48686868634604051610754959493929190610e9d565b60405180910390a25050505050565b336107766000546001600160a01b031690565b6001600160a01b0316146107cc5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102cb565b60028190556040518181527f210d4d5d2d36d571207dac98e383e2441c684684c885fb2d7c54f8d24422074c90602001610305565b336108146000546001600160a01b031690565b6001600160a01b03161461086a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102cb565b6001600160a01b0381166108e65760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016102cb565b6108ef816108f2565b50565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60006020828403121561096c57600080fd5b5035919050565b80356001600160a01b038116811461098a57600080fd5b919050565b60008083601f8401126109a157600080fd5b50813567ffffffffffffffff8111156109b957600080fd5b6020830191508360208260051b85010111156109d457600080fd5b9250929050565b60008060008060008060008060a0898b0312156109f757600080fd5b610a0089610973565b975060208901359650604089013567ffffffffffffffff80821115610a2457600080fd5b610a308c838d0161098f565b909850965060608b0135915080821115610a4957600080fd5b610a558c838d0161098f565b909650945060808b0135915080821115610a6e57600080fd5b50610a7b8b828c0161098f565b999c989b5096995094979396929594505050565b60008083601f840112610aa157600080fd5b50813567ffffffffffffffff811115610ab957600080fd5b6020830191508360208285010111156109d457600080fd5b60008060008060008060a08789031215610aea57600080fd5b610af387610973565b955060208701359450610b0860408801610973565b935060608701359250608087013567ffffffffffffffff811115610b2b57600080fd5b610b3789828a01610a8f565b979a9699509497509295939492505050565b60008060208385031215610b5c57600080fd5b823567ffffffffffffffff811115610b7357600080fd5b610b7f85828601610a8f565b90969095509350505050565b600060208284031215610b9d57600080fd5b61067982610973565b60008060008060608587031215610bbc57600080fd5b610bc585610973565b935060208501359250604085013567ffffffffffffffff811115610be857600080fd5b610bf487828801610a8f565b95989497509550505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b81835260006020808501808196508560051b810191508460005b87811015610cad5782840389528135601e19883603018112610c6457600080fd5b8701803567ffffffffffffffff811115610c7d57600080fd5b803603891315610c8c57600080fd5b610c998682898501610c00565b9a87019a9550505090840190600101610c43565b5091979650505050505050565b8183526000602080850194508260005b85811015610cf6576001600160a01b03610ce383610973565b1687529582019590820190600101610cca565b509495945050505050565b81835260007f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831115610d3357600080fd5b8260051b8083602087013760009401602001938452509192915050565b608081526000885180608084015260005b81811015610d7e576020818c0181015160a0868401015201610d61565b81811115610d9057600060a083860101525b50601f01601f1916820182810360a09081016020850152610db4908201898b610c29565b90508281036040840152610dc9818789610cba565b90508281036060840152610dde818587610d01565b9a9950505050505050505050565b634e487b7160e01b600052601160045260246000fd5b600082821015610e1457610e14610dec565b500390565b60006001600160a01b03808a16835288602084015280881660408401525085606083015260c06080830152610e5260c083018587610c00565b90508260a083015298975050505050505050565b6000816000190483118215151615610e8057610e80610dec565b500290565b60008219821115610e9857610e98610dec565b500190565b6001600160a01b0386168152846020820152608060408201526000610ec6608083018587610c00565b9050826060830152969550505050505056fea2646970667358221220d53d4cd2ba0b78f0a439c7baaf6dc61f433a2b697d9d4eee703a3f2cf0a05e2464736f6c63430008090033";

type MessageBusSenderConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: MessageBusSenderConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class MessageBusSender__factory extends ContractFactory {
  constructor(...args: MessageBusSenderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MessageBusSender";
  }

  deploy(
    _sigsVerifier: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<MessageBusSender> {
    return super.deploy(_sigsVerifier, overrides || {}) as Promise<MessageBusSender>;
  }
  getDeployTransaction(
    _sigsVerifier: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(_sigsVerifier, overrides || {});
  }
  attach(address: string): MessageBusSender {
    return super.attach(address) as MessageBusSender;
  }
  connect(signer: Signer): MessageBusSender__factory {
    return super.connect(signer) as MessageBusSender__factory;
  }
  static readonly contractName: "MessageBusSender";
  public readonly contractName: "MessageBusSender";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MessageBusSenderInterface {
    return new utils.Interface(_abi) as MessageBusSenderInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): MessageBusSender {
    return new Contract(address, _abi, signerOrProvider) as MessageBusSender;
  }
}
