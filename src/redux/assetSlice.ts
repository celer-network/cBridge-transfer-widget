import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GetPeggedMode, PeggedChainMode } from "../hooks/usePeggedPairConfig";
import { PeggedPairConfig } from "../constants/type";

/* eslint-disable*/
/* eslint-disable no-debugger */
/* eslint-disable camelcase */
interface Chain {
  id: number;
  name: string;
  icon: string;
  isShow?: boolean;
}
type TransferConfig = {
  chains: Array<Chain>;
  chain_token: any;
};
interface ISliceState {
  // eslint-disable-next-line @typescript-eslint/ban-types
  allToken: {};
  selectedIndex: number;
  fromChainId: number;
  toChainId: number;
  loading: boolean;
  isReject: boolean;
  tabkey: string;
  transferStatus: string;
  historyList: [];
  waitingNum: number;
  safeMargin: number;
  defaultSize: number;
  // derived states
  tvl: number; // string encoded BigNumber
  isChainShow: boolean;
  chainSource: string;
  transferConfig: TransferConfig;
  slippageTolerance: number;
}
const localeFromChainId = Number(localStorage.getItem("fromChainId" + process.env.REACT_APP_ENV));
// const chainArray = process.env.REACT_APP_ENV === "TEST" ? [3, 5, 97] : [1, 56, 137, 42161, 100, 66];
let defaultFromChainId;
if (localeFromChainId) {
  defaultFromChainId = localeFromChainId;
} else {
  defaultFromChainId = process.env.REACT_APP_ENV === "TEST" ? 3 : 1;
}
const initialState: ISliceState = {
  allToken: {},
  selectedIndex: Number(localStorage.getItem("selectedIndex")) || 0,
  fromChainId: defaultFromChainId,
  toChainId: localStorage.getItem("toChainId" + process.env.REACT_APP_ENV)
    ? Number(localStorage.getItem("toChainId" + process.env.REACT_APP_ENV))
    : Number(process.env.REACT_APP_BSC_ID),
  loading: false,
  isReject: false,
  tvl: 0,
  tabkey: localStorage.getItem("tabkey") || "transfer",
  transferStatus: "",
  historyList: [],
  waitingNum: 0,
  defaultSize: 50,
  safeMargin: process.env.REACT_APP_ENV === "TEST" ? 20 * 60 * 1000 : 1 * 60 * 60 * 1000,
  isChainShow: false,
  chainSource: "from",
  transferConfig: {
    chains: [],
    chain_token: null,
  },
  slippageTolerance: 5000,
};

const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setSelectedTokenIndex: (state, { payload }: PayloadAction<number>) => {
      state.selectedIndex = payload;
      localStorage.setItem("selectedIndex", payload.toString());
    },
    setFromChainId: (state, { payload }: PayloadAction<number>) => {
      state.fromChainId = payload;
      // if (chainArray.indexOf(payload) > -1) {
      // state.assets = state.allToken[payload].token?.map(item => {
      //   item.checked = true;
      //   return item;
      // });
      state.selectedIndex = 0;
      localStorage.setItem("selectedIndex", "0");
      // } else {
      //   console.log("no token list");
      // }
    },
    setToChainId: (state, { payload }: PayloadAction<number>) => {
      state.toChainId = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setIsReject: (state, { payload }: PayloadAction<boolean>) => {
      state.isReject = payload;
    },
    setTableKey: (state, { payload }: PayloadAction<string>) => {
      localStorage.setItem("tabkey", payload);
      state.tabkey = payload;
    },
    setWaitingNum: (state, { payload }: PayloadAction<number>) => {
      state.waitingNum = payload;
    },
    setTransferStatus: (state, { payload }: PayloadAction<string>) => {
      state.transferStatus = payload;
    },
    setIsChainShow: (state, { payload }: PayloadAction<boolean>) => {
      state.isChainShow = payload;
    },
    setChainSource: (state, { payload }: PayloadAction<string>) => {
      state.chainSource = payload;
    },
    setChainList: (state, { payload }: PayloadAction<TransferConfig>) => {
      state.transferConfig = payload;
    },
    setSlippageTolerance: (state, { payload }: PayloadAction<number>) => {
      state.slippageTolerance = payload;
    },
  },
});

export const {
  setLoading,
  setSelectedTokenIndex,
  setFromChainId,
  setToChainId,
  setTableKey,
  setWaitingNum,
  setIsReject,
  setIsChainShow,
  setChainSource,
  setChainList,
  setSlippageTolerance,
} = assetSlice.actions;

export const getTokenSymbol = (symbol, chId) => {
  let name = getTokenListSymbol(symbol, chId);
  // if dst chain are these, convert WETH to ETH
  if (chId === 1 || chId === 42161 || chId === 10 || chId === 5 || chId === 288) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  return name;
};

export const getTokenListSymbol = (symbol, chId) => {
  let name = symbol;
  const chainId = Number(chId);
  if (chainId === 43114) {
    //43114
    if (symbol === "USDT") {
      name = "USDT.e";
    }
    if (symbol === "DAI") {
      name = "DAI.e";
    }
    if (symbol === "USDC") {
      name = "USDC.e";
    }
    if (symbol === "WETH") {
      name = "WETH.e";
    }
    if (symbol === "IMX") {
      name = "IMX.a";
    }
    if (symbol === "WOO") {
      name = "WOO.e";
    }
  }
  if (chainId === 250) {
    if (symbol === "USDT") {
      name = "fUSDT";
    }
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  if (chainId === 56) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }
  if (chainId === 1666600000) {
    if (symbol === "WETH") {
      name = "ETH";
    }
  }

  if (chainId === 42220) {
    if (symbol === "USDC") {
      name = "openUSDC";
    }
    if (symbol === "USDT") {
      name = "openUSDT";
    }
    if (symbol === "WETH") {
      name = "openWETH";
    }
  }

  if (chainId === 42262) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }
    if (symbol === "USDT") {
      name = "ceUSDT";
    }
    if (symbol === "WETH") {
      name = "ceWETH";
    }
    if (symbol === "BNB") {
      name = "cbBNB";
    }
    if (symbol === "AVAX") {
      name = "caAVAX";
    }
    if (symbol === "FTM") {
      name = "cfFTM";
    }
    if (symbol === "DAI") {
      name = "ceDAI";
    }
  }

  if (chainId === 1284) {
    if (symbol === "USDC") {
      name = "ceUSDC";
    }
    if (symbol === "USDT") {
      name = "ceUSDT";
    }
  }

  return name;
};

export const getTokenSymbolWithPeggedMode = (
  fromChainId: number | undefined,
  toChainId: number | undefined,
  tokenSymbol: string,
  pegged_pair_configs: Array<PeggedPairConfig>,
) => {
  const peggedMode = GetPeggedMode(fromChainId, toChainId, tokenSymbol, pegged_pair_configs);
  if (peggedMode === PeggedChainMode.Off) {
    return getTokenSymbol(tokenSymbol, toChainId);
  }
  return getTokenListSymbol(tokenSymbol, toChainId);
};

export const switchChain = async (id, isMobile, atoken) => {
  const inId = Number(id);
  if (process.env.REACT_APP_ENV === "TEST" || isMobile) {
    return;
  }
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${inId.toString(16)}` }],
    });
    if (atoken) {
      localStorage.setItem("ToAddToken", JSON.stringify({ atoken, toId: id }));
    }
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as { code: number }).code === 4902) {
      // try {
      //   await window.ethereum.request({
      //     method: "wallet_addEthereumChain",
      //     params: [
      //       {
      //         chainId: `0x${inId.toString(16)}`,
      //         rpcUrls: [getNetworkById(inId).rpcUrl],
      //         chainName: getNetworkById(inId).name,
      //         blockExplorerUrls: [getNetworkById(inId).blockExplorerUrl],
      //         nativeCurrency: {
      //           name: getNetworkById(inId).symbol,
      //           symbol: getNetworkById(inId).symbol, // 2-6 characters long
      //           decimals: 18,
      //         },
      //       },
      //     ],
      //   });
      //   if (atoken) {
      //     localStorage.setItem("ToAddToken", JSON.stringify({ atoken, toId: id }));
      //   }
      // } catch (addError) {
      //   // handle "add" error
      // }
    }
    // handle other "switch" errors
  }
};
export const addChainToken = async (addtoken, chId) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: addtoken.address, // The address that the token is at.
          symbol: getTokenSymbol(addtoken.symbol, chId), // A ticker symbol or shorthand, up to 5 chars.
          decimals: addtoken.decimal, // The number of decimals in the token
          image: addtoken.icon, // A string url of the token logo
        },
      },
    });
    if (wasAdded) {
      localStorage.setItem("ToAddToken", "");
    } else {
      localStorage.setItem("ToAddToken", "");
    }
  } catch (error) {
    console.log(error);
  }
};
export default assetSlice.reducer;
