/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNetworkById, NETWORKS } from "../constants/network";
import { Chain, TokenInfo, GetTransferConfigsResponse } from "../constants/type";
import { EstimateAmtResponse } from "../proto/sgn/gateway/v1/gateway_pb";

/* eslint-disable camelcase */
/* eslint-disable no-debugger */
interface TransferIState {
  transferConfig: GetTransferConfigsResponse;
  slippageTolerance: number;
  isChainShow: boolean;
  chainSource: string;
  fromChainId: number;
  toChainId: number;
  tokenList: Array<TokenInfo>;
  fromChain?: Chain;
  toChain?: Chain;
  selectedToken?: TokenInfo;
  selectedTokenSymbol?: string;
  totalActionNum: number;
  totalPaddingNum: number;
  estimateAmtInfoInState: EstimateAmtResponse.AsObject | null;
  rate: string;
  getConfigsFinish: boolean;
  refreshHistory: boolean;
  refreshTransferAndLiquidity: boolean;
  singleChainList: Array<any>;
  singleChainSelectIndex: number;
  singleChainRate: string;
  bigAmountDelayInfos: Array<BigAmountDelayInfo>;
}

const initialState: TransferIState = {
  transferConfig: {
    chains: [],
    chain_token: {},
    farming_reward_contract_addr: "",
    pegged_pair_configs: [],
  },
  slippageTolerance: 5000,
  isChainShow: false,
  chainSource: "form",
  fromChainId: 0,
  toChainId: 0,
  tokenList: [],
  selectedToken: undefined,
  selectedTokenSymbol: "",
  totalActionNum: 0,
  totalPaddingNum: 0,
  estimateAmtInfoInState: null,
  rate: localStorage.getItem("ratio") || "1",
  getConfigsFinish: false,
  refreshHistory: false,
  refreshTransferAndLiquidity: false,
  fromChain: undefined,
  toChain: undefined,
  singleChainList: [],
  singleChainSelectIndex: 0,
  singleChainRate: "3",
  bigAmountDelayInfos: [],
};

const transferSlice = createSlice({
  name: "lp",
  initialState,
  reducers: {
    setTransferConfig: (state, { payload }: PayloadAction<GetTransferConfigsResponse>) => {
      const configsWithETH = payload;

      const chainIds = [
        NETWORKS.mainnet.chainId,
        NETWORKS.arbitrum.chainId,
        NETWORKS.Optimism.chainId,
        NETWORKS.goerli.chainId,
        NETWORKS.BoBa.chainId,
      ];

      chainIds.forEach(chainId => {
        const chainToken = payload.chain_token[chainId];

        if (!chainToken) {
          return;
        }
        const currentChainTokens = chainToken.token;
        const wethTokens = currentChainTokens.filter(token => {
          return token.token.symbol === "WETH";
        });

        if (wethTokens.length > 0) {
          const wethToken = wethTokens[0];
          wethToken.icon = "https://get.celer.app/cbridge-icons/WETH.png";
          const wethTokenInfo = wethToken.token;
          currentChainTokens.push({
            token: {
              symbol: "WETH",
              address: wethTokenInfo.address,
              decimal: wethTokenInfo.decimal,
              xfer_disabled: wethTokenInfo.xfer_disabled,
              display_symbol: "ETH",
            },
            name: "ETH",
            icon: "https://get.celer.app/cbridge-icons/ETH.png",
            max_amt: wethToken.max_amt,
          });
        }
        configsWithETH[chainId] = currentChainTokens;
      });

      state.transferConfig = payload;
    },
    setSlippageTolerance: (state, { payload }: PayloadAction<number>) => {
      state.slippageTolerance = payload;
    },
    setIsChainShow: (state, { payload }: PayloadAction<boolean>) => {
      state.isChainShow = payload;
    },
    setChainSource: (state, { payload }: PayloadAction<string>) => {
      state.chainSource = payload;
    },
    setFromChainId: (state, { payload }: PayloadAction<number>) => {
      state.fromChainId = payload;
    },
    setToChainId: (state, { payload }: PayloadAction<number>) => {
      state.toChainId = payload;
    },
    setTokenList: (state, { payload }: PayloadAction<Array<TokenInfo>>) => {
      state.tokenList = payload;
    },
    setFromChain: (state, { payload }: PayloadAction<Chain>) => {
      // localStorage.setItem("fromChainInfo", JSON.stringify(payload));
      localStorage.setItem("fromChainId", JSON.stringify(payload.id));
      state.fromChain = payload;
    },
    setToChain: (state, { payload }: PayloadAction<Chain>) => {
      // localStorage.setItem("toChainInfo", JSON.stringify(payload));
      localStorage.setItem("toChainId", JSON.stringify(payload.id));
      state.toChain = payload;
    },
    setSelectedToken: (state, { payload }: PayloadAction<TokenInfo>) => {
      state.selectedToken = payload;
      localStorage.setItem("selectedTokenSymbol", payload.token.display_symbol ?? payload.token.symbol);
    },
    setSelectedTokenSymbol: (state, { payload }: PayloadAction<string>) => {
      state.selectedTokenSymbol = payload;
    },
    setTotalActionNum: (state, { payload }: PayloadAction<number>) => {
      state.totalActionNum = payload;
    },
    setTotalPaddingNum: (state, { payload }: PayloadAction<number>) => {
      state.totalPaddingNum = payload;
    },
    setEstimateAmtInfoInState: (state, { payload }: PayloadAction<EstimateAmtResponse.AsObject | null>) => {
      state.estimateAmtInfoInState = payload;
    },
    setRate: (state, { payload }: PayloadAction<string>) => {
      localStorage.setItem("ratio", payload);
      state.rate = payload;
    },
    setGetConfigsFinish: (state, { payload }: PayloadAction<boolean>) => {
      state.getConfigsFinish = payload;
    },
    setRefreshHistory: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshHistory = payload;
    },
    setRefreshTransferAndLiquidity: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshTransferAndLiquidity = payload;
    },
    setSingleChainList: (state, { payload }: PayloadAction<any>) => {
      state.singleChainList = payload;
    },
    setSingleChainSelectIndex: (state, { payload }: PayloadAction<number>) => {
      state.singleChainSelectIndex = payload;
    },
    setSingleChainRate: (state, { payload }: PayloadAction<string>) => {
      state.singleChainRate = payload;
    },
    setBigAmountDelayInfos: (state, { payload }: PayloadAction<Array<BigAmountDelayInfo>>) => {
      state.bigAmountDelayInfos = payload;
    },
  },
});

export const {
  setTransferConfig,
  setSlippageTolerance,
  setIsChainShow,
  setChainSource,
  setFromChainId,
  setToChainId,
  setTokenList,
  setFromChain,
  setToChain,
  setSelectedToken,
  setSelectedTokenSymbol,
  setTotalActionNum,
  setTotalPaddingNum,
  setEstimateAmtInfoInState,
  setRate,
  setGetConfigsFinish,
  setRefreshHistory,
  setSingleChainList,
  setSingleChainSelectIndex,
  setSingleChainRate,
  setRefreshTransferAndLiquidity,
  setBigAmountDelayInfos,
} = transferSlice.actions;

export default transferSlice.reducer;

export const switchChain = async (id, atoken) => {
  const inId = Number(id);

  const providerName = localStorage.getItem("web3providerName");
  if (providerName && providerName === "walletconnect") {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${inId.toString(16)}` }],
    });
    if (atoken) {
      localStorage.setItem("ToAddToken", JSON.stringify({ atoken, toId: inId }));
    }
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    // const message = (switchError.message as string) ?? "";
    // const testString = "Unrecognized chain ID";
    // || message.toLowerCase().includes(testString.toLowerCase())
    if ((switchError as { code: number }).code === 4902) {
      try {
        // const chainInfo =
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${inId.toString(16)}`,
              rpcUrls: [getNetworkById(inId).rpcUrl],
              chainName: getNetworkById(inId).name,
              blockExplorerUrls: [getNetworkById(inId).blockExplorerUrl],
              nativeCurrency: {
                name: getNetworkById(inId).symbol,
                symbol: getNetworkById(inId).symbol, // 2-6 characters long
                decimals: 18,
              },
            },
          ],
        });
        if (atoken) {
          localStorage.setItem("ToAddToken", JSON.stringify({ atoken, toId: id }));
        }
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};

export const addChainToken = async addtoken => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: addtoken.address, // The address that the token is at.
          symbol: addtoken.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: addtoken.decimals, // The number of decimals in the token
          image: addtoken.image, // A string url of the token logo
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

export interface BigAmountDelayInfo {
  rpcUrl: string;
  contractAddress: string;
  tokenAddress: string;
  period: string;
  thresholds: string;
}
