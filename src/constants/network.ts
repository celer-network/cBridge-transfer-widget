// import { TypeOfTag } from "typescript";
import { mainnetNetworks } from "./chains_mainnet";
import { stagingNetworks } from "./chains_staging_mainnet";
import { testNetworks } from "./chains_testnet";

export interface NetworkInfo {
  name: string;
  color: string;
  chainId: number;
  rpcUrl: string;
  blockTime: number;
  iconUrl: string;
  blockDelay: number;
  symbol: string;
  blockExplorerUrl: string;
  tokenSymbolList: string[];
  lqMintTokenSymbolBlackList: string[];
}

export const INFURA_ID = process.env.REACT_APP_INFURA_ID;
export const type = process.env.REACT_APP_ENV_TYPE;
// type NetType = typeof stagingNetworks;
let newNetworks;
switch (type) {
  case "staging":
    newNetworks = stagingNetworks;
    break;
  case "mainnet":
    newNetworks = mainnetNetworks;
    break;
  case "test":
    newNetworks = testNetworks;
    break;
  default:
    newNetworks = mainnetNetworks;
    break;
}
export const NETWORKS = newNetworks;
export const CHAIN_LIST: NetworkInfo[] = Object.values(NETWORKS) as NetworkInfo[];
export const getNetworkById: (chainId: number) => NetworkInfo = (chainId: number) => {
  for (let i = 0; i < CHAIN_LIST.length; i++) {
    if (CHAIN_LIST[i]?.chainId === chainId || CHAIN_LIST[i].chainId === Number(chainId)) {
      return CHAIN_LIST[i];
    }
  }
  return NETWORKS.localhost;
};

export const USD_TOKENS = {
  BUSD: true,
  USDC: true,
  USDT: true,
  DAI: true,
};
