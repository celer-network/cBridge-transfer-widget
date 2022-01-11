import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

function numberToBytes(number: number): Uint8Array {
  return ethers.utils.arrayify(BigNumber.from(number));
}
function stringToBytes(str: string): Uint8Array {
  return ethers.utils.arrayify(Buffer.from(str));
}

export { numberToBytes, stringToBytes };
