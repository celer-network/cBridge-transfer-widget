/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNetworkById } from "../constants/network";
import {
  Chain,
  TokenInfo,
  GetTransferConfigsResponse,
  MultiBurnPairConfig,
  FlowTokenPathConfig,
  PeggedPairConfig,
} from "../constants/type";
import { EstimateAmtResponse } from "../proto/gateway/gateway_pb";
import { storageConstants } from "../constants/const";

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
  bigAmountDelayInfos: Array<BigAmountDelayInfo>;
  multiBurnConfigs: Array<MultiBurnPairConfig>;
  flowTokenPathConfigs: Array<FlowTokenPathConfig>;
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
  rate: localStorage.getItem(storageConstants.KEY_RATIO) || "1",
  getConfigsFinish: false,
  refreshHistory: false,
  refreshTransferAndLiquidity: false,
  fromChain: undefined,
  toChain: undefined,
  bigAmountDelayInfos: [],
  flowTokenPathConfigs: [],
  multiBurnConfigs: [],
};

const transferSlice = createSlice({
  name: "lp",
  initialState,
  reducers: {
    setTransferConfig: (state, { payload }: PayloadAction<GetTransferConfigsResponse>) => {
      const configsWithETH = payload;

      const chainIds = [
        1, // NETWORKS.mainnet.chainId,
        42161, // NETWORKS.arbitrum.chainId,
        10, // NETWORKS.Optimism.chainId,
        5, // NETWORKS.goerli.chainId,
        288, // NETWORKS.BoBa.chainId,
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

      const configsLength = payload.pegged_pair_configs.length;
      const multiBurnConfigs: MultiBurnPairConfig[] = [];

      for (let i = 0; i < configsLength; i++) {
        for (let j = i + 1; j < configsLength; j++) {
          const peggedConfigI = payload.pegged_pair_configs[i];
          const peggedConfigJ = payload.pegged_pair_configs[j];
          if (
            peggedConfigI.org_chain_id === peggedConfigJ.org_chain_id &&
            peggedConfigI.org_token.token.symbol === peggedConfigJ.org_token.token.symbol
          ) {
            /// Only upgraded PegBridge can support multi burn to other pegged chain
            if (peggedConfigI.bridge_version === 2) {
              multiBurnConfigs.push({
                burn_config_as_org: {
                  chain_id: peggedConfigI.pegged_chain_id,
                  token: peggedConfigI.pegged_token,
                  burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigI.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigI.bridge_version,
                },
                burn_config_as_dst: {
                  chain_id: peggedConfigJ.pegged_chain_id,
                  token: peggedConfigJ.pegged_token,
                  burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigJ.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigJ.bridge_version,
                },
              });
            }

            if (peggedConfigJ.bridge_version === 2) {
              multiBurnConfigs.push({
                burn_config_as_org: {
                  chain_id: peggedConfigJ.pegged_chain_id,
                  token: peggedConfigJ.pegged_token,
                  burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigJ.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigJ.bridge_version,
                },
                burn_config_as_dst: {
                  chain_id: peggedConfigI.pegged_chain_id,
                  token: peggedConfigI.pegged_token,
                  burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
                  canonical_token_contract_addr: peggedConfigI.canonical_token_contract_addr,
                  burn_contract_version: peggedConfigI.bridge_version,
                },
              });
            }
          }
        }
      }

      const ethPeggedPairConfigs: PeggedPairConfig[] = [];

      payload.pegged_pair_configs.forEach(peggedPairConfig => {
        if (
          chainIds.includes(peggedPairConfig.org_chain_id) &&
          peggedPairConfig.org_token.token.symbol === "WETH" &&
          peggedPairConfig.vault_version > 0
        ) {
          const wethToken = peggedPairConfig.org_token;
          const wethTokenInfo = wethToken.token;
          const ethToken: TokenInfo = {
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
          };

          ethPeggedPairConfigs.push({
            org_chain_id: peggedPairConfig.org_chain_id,
            org_token: ethToken,
            pegged_chain_id: peggedPairConfig.pegged_chain_id,
            pegged_token: peggedPairConfig.pegged_token,
            pegged_burn_contract_addr: peggedPairConfig.pegged_burn_contract_addr,
            pegged_deposit_contract_addr: peggedPairConfig.pegged_deposit_contract_addr,
            canonical_token_contract_addr: peggedPairConfig.canonical_token_contract_addr,
            bridge_version: peggedPairConfig.bridge_version,
            vault_version: peggedPairConfig.vault_version,
          });
        }
      });

      payload.pegged_pair_configs = payload.pegged_pair_configs
        .concat(ethPeggedPairConfigs)
        .filter(peggedPairConfig => {
          return !(
            peggedPairConfig.org_chain_id === 5 &&
            peggedPairConfig.pegged_chain_id === 647 &&
            peggedPairConfig.org_token.name === "Wrapped Ether"
          );
        });

      state.transferConfig = payload;
      state.multiBurnConfigs = multiBurnConfigs;
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
      localStorage.setItem(storageConstants.KEY_FROM_CHAIN_ID, JSON.stringify(payload.id));
      state.fromChain = payload;
    },
    setToChain: (state, { payload }: PayloadAction<Chain>) => {
      localStorage.setItem(storageConstants.KEY_TO_CHAIN_ID, JSON.stringify(payload.id));
      state.toChain = payload;
    },
    setSelectedToken: (state, { payload }: PayloadAction<TokenInfo>) => {
      state.selectedToken = payload;
      localStorage.setItem(
        storageConstants.KEY_SELECTED_TOKEN_SYMBOL,
        payload.token.display_symbol ?? payload.token.symbol,
      );
    },
    setSelectedTokenSymbol: (state, { payload }: PayloadAction<string>) => {
      state.selectedTokenSymbol = payload;
    },
    setTotalActionNum: (state, { payload }: PayloadAction<number>) => {
      state.totalActionNum = payload;
    },
    setTotalPendingNum: (state, { payload }: PayloadAction<number>) => {
      state.totalPaddingNum = payload;
    },
    setEstimateAmtInfoInState: (state, { payload }: PayloadAction<EstimateAmtResponse.AsObject | null>) => {
      state.estimateAmtInfoInState = payload;
    },
    setRate: (state, { payload }: PayloadAction<string>) => {
      localStorage.setItem(storageConstants.KEY_RATIO, payload);
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
    setBigAmountDelayInfos: (state, { payload }: PayloadAction<Array<BigAmountDelayInfo>>) => {
      state.bigAmountDelayInfos = payload;
    },
    setFlowTokenPathConfigs: (state, { payload }: PayloadAction<Array<FlowTokenPathConfig>>) => {
      state.flowTokenPathConfigs = payload;
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
  setTotalPendingNum,
  setEstimateAmtInfoInState,
  setRate,
  setGetConfigsFinish,
  setRefreshHistory,
  setRefreshTransferAndLiquidity,
  setBigAmountDelayInfos,
  setFlowTokenPathConfigs,
} = transferSlice.actions;

export default transferSlice.reducer;

interface SwitchChainSuccessCallback {
  (id: number): void;
}

export const switchChain = async (id, atoken, switchChainSuccessCallback: SwitchChainSuccessCallback) => {
  const inId = Number(id);

  const providerName = localStorage.getItem(storageConstants.KEY_WEB3_PROVIDER_NAME);
  if (providerName && providerName === "walletconnect") {
    return;
  }

  try {
    if (window.clover) {
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
    } else {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${inId.toString(16)}` }],
      });
    }
    switchChainSuccessCallback(id);
    if (atoken) {
      localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, JSON.stringify({ atoken, toId: inId }));
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
        switchChainSuccessCallback(id);
        if (atoken) {
          localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, JSON.stringify({ atoken, toId: id }));
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
    localStorage.setItem(storageConstants.KEY_TO_ADD_TOKEN, "");
    await window.ethereum.request({
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
