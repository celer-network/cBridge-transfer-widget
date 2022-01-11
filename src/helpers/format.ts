import { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export function formatBalance(balance: string | number, sep = "", keepDecimals = 6): string {
  balance = balance.toString();
  const [integerPart, decimalPart] = balance.split(".");
  const str = integerPart.toString();
  const chunkSize = 3;
  const result: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    const end = str.length - i;
    const start = end - chunkSize;
    result.unshift(str.substring(start, end));
  }

  let resultIntPart = result.join(sep);

  if (decimalPart) {
    let keptDecimals = decimalPart;
    if (decimalPart.length > keepDecimals) {
      const keptDecimalsArr = decimalPart.slice(0, keepDecimals + 1).split("");
      if (keptDecimalsArr[keptDecimals.length - 1] > "4") {
        keptDecimalsArr[keptDecimals.length - 2] += 1;
      }
      keptDecimals = keptDecimalsArr.slice(0, keepDecimals).join("");
    }
    if (!resultIntPart) {
      resultIntPart = "0";
    }
    if (keptDecimals) {
      return resultIntPart + "." + keptDecimals;
    }
  }
  return resultIntPart;
}

export function formatDecimal(
  amount: string | undefined | BigNumberish,
  decimalCount = 18,
  keepDecimals?: number,
): string {
  const unitFormateed = formatUnits(amount || 0, decimalCount);
  const numstr = formatBalance(unitFormateed, ",", keepDecimals);

  const dot = numstr.split(".")[1];
  if (dot === "0" || dot === "00") {
    return numstr.split(".")[0];
  }

  return numstr;
}

export function formatMula(num: string | number, symbol: string): string {
  if (num === undefined || num === null) {
    return symbol + "0.00";
  }
  const formattedNum = formatBalance(num, ",");
  return symbol + formattedNum;
}

export function formatUSD(num: string | number): string {
  return formatMula(num, "$ ");
}


export function formatUSDT(num: string | number): string {
  return formatMula(num, "$");
}

export function formatPercentage(num: number | undefined, isAlreadyPercent = false): string {
  if (!num) {
    return "0.00%";
  }
  if (isAlreadyPercent) {
    return num.toFixed(2) + "%";
  }
  return (num * 100).toFixed(2) + "%";
}
