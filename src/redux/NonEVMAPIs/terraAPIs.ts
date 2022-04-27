import { LCDClient } from "@terra-money/terra.js";
import { decodeBech32, encodeBech32 } from "@terra-money/amino-js";

/* eslint-disable*/

export const terraNativeTokenSymbolMapping = (tokenSymbol: String) => {
  if (tokenSymbol === "LUNA") {
    return "uluna";
  }
  return "";
};

export const terraNativeBalances = async (address: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const result = await client.bank.balance(address);
  return result[0];
};

export const terraGeneralTokenBalance = async (accountAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const terraTokenAddress = await convertCanonicalToTerraAddress(tokenAddress);
  const result = await client.wasm.contractQuery<object>(terraTokenAddress, {
    balance: { address: accountAddress },
  });

  if (result && result["balance"]) {
    return result["balance"];
  }

  return "0";
};

export const convertCanonicalToTerraAddress = async (canonicalAddress: string) => {
  if (canonicalAddress.includes("terra")) {
    console.log("wrong address input", canonicalAddress);
    return canonicalAddress;
  }

  const no0xAddress = canonicalAddress.toLowerCase().replace("0x", "");
  return encodeBech32("terra", Uint8Array.from(Buffer.from(no0xAddress, "hex")));
};

export const convertTerraToCanonicalAddress = async (address: string) => {
  if (!address.includes("terra")) {
    console.log("wrong address input", address);
    return address;
  }

  const decode = decodeBech32(address);

  return "0x" + Buffer.from(decode[1]).toString("hex");
};

export const queryTerraDelayPeriod = async (contractAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    delay_period: {},
  });

  return result;
};

export const queryTerraDelayThreshold = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    delay_threshold: { token: tokenTerraAddress },
  });

  return result;
};

export const queryTerraEpochVolumeCaps = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);
  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    epoch_volume_cap: { token: tokenTerraAddress },
  });

  return result;
};

export const queryTerraMaxDeposit = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    max_deposit: { token: tokenTerraAddress },
  });

  return result;
};

export const queryTerraMinDeposit = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    min_deposit: { token: tokenTerraAddress },
  });

  return result;
};

export const queryTerraMaxBurn = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    max_burn: { token: tokenTerraAddress },
  });

  return result;
};

export const queryTerraMinBurn = async (contractAddress: string, tokenAddress: string) => {
  const client = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-12",
  });

  const contractTerraAddress = await convertCanonicalToTerraAddress(contractAddress);
  const tokenTerraAddress = await convertCanonicalToTerraAddress(tokenAddress);

  const result = await client.wasm.contractQuery<object>(contractTerraAddress, {
    min_burn: { token: tokenTerraAddress },
  });

  return result;
};
