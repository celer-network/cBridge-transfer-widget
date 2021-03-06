/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IWithdrawInbox, IWithdrawInboxInterface } from "../IWithdrawInbox";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_wdSeq",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_toChain",
        type: "uint64",
      },
      {
        internalType: "uint64[]",
        name: "_fromChains",
        type: "uint64[]",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "uint32[]",
        name: "_ratios",
        type: "uint32[]",
      },
      {
        internalType: "uint32[]",
        name: "_slippages",
        type: "uint32[]",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IWithdrawInbox__factory {
  static readonly abi = _abi;
  static createInterface(): IWithdrawInboxInterface {
    return new utils.Interface(_abi) as IWithdrawInboxInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IWithdrawInbox {
    return new Contract(address, _abi, signerOrProvider) as IWithdrawInbox;
  }
}
