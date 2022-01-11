import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

export function minimum(left: BigNumberish | undefined, right: BigNumberish | undefined): BigNumber {
  const leftInBN = BigNumber.from(left ?? 0);
  const rightInBN = BigNumber.from(right ?? 0);
  if (leftInBN.gte(rightInBN)) {
    return rightInBN;
  }
  return leftInBN;
}

export function maximum(left: BigNumberish | undefined, right: BigNumberish | undefined): BigNumber {
  const leftInBN = BigNumber.from(left ?? 0);
  const rightInBN = BigNumber.from(right ?? 0);
  if (leftInBN.gte(rightInBN)) {
    return leftInBN;
  }
  return rightInBN;
}
