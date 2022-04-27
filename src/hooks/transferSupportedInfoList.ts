/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { Chain, TokenInfo, Token, GetTransferConfigsResponse, MultiBurnPairConfig } from "../constants/type";
import { useAppSelector } from "../redux/store";
import { getNetworkById, CHAIN_LIST } from "../constants/network";

export const useTransferSupportedChainList = (useAsDestinationChain: boolean): Chain[] => {
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, transferConfig, multiBurnConfigs } = transferInfo;

  const [fromChainList, setFromChainList] = useState<Chain[]>([]);
  const [chainList, setChainList] = useState<Chain[]>([]);

  useEffect(() => {
    const whiteListTransferSupportedChainIds: number[] = CHAIN_LIST.map(info => {
      return info.chainId;
    });

    const allChainIds: number[] = transferConfig.chains
      .filter(chain => {
        return whiteListTransferSupportedChainIds.includes(chain.id);
      })
      .map(chain => {
        return chain.id;
      });

    const bridgedIds = new Set<number>();

    allChainIds.forEach(id1 => {
      if (bridgedIds.has(id1)) {
        return;
      }
      allChainIds.forEach(id2 => {
        if (id1 === id2) {
          return;
        }

        if (twoChainBridged(id1, id2, transferConfig, multiBurnConfigs)) {
          bridgedIds.add(id1);
          bridgedIds.add(id2);
        }
      });
    });

    const supportedChains = transferConfig.chains.filter(chain => {
      return bridgedIds.has(chain.id);
    });

    setFromChainList(supportedChains);
  }, [transferConfig, multiBurnConfigs]);

  useEffect(() => {
    if (useAsDestinationChain && fromChain && fromChain !== undefined) {
      const potentialTargetChainIds = new Set<number>();
      const { chain_token, chains, pegged_pair_configs } = transferConfig;

      const fromChainTokenSymbolWhiteList = getNetworkById(fromChain.id).tokenSymbolList;

      const poolBasedSupportedTokenSymbols: string[] = chain_token[fromChain.id].token
        .filter(tokenInfo => {
          return !tokenInfo.token.xfer_disabled && fromChainTokenSymbolWhiteList.includes(tokenInfo.token.symbol);
        })
        .map(tokenInfo => {
          return tokenInfo.token.symbol;
        });

      chains.forEach(chain => {
        if (chain.id === fromChain.id) {
          /// Skip From Chain
          return;
        }

        const toChainTokenSymbolWhiteList = getNetworkById(chain.id).tokenSymbolList;
        const supportedTokens = chain_token[chain.id].token.filter(tokenInfo => {
          return !tokenInfo.token.xfer_disabled && toChainTokenSymbolWhiteList.includes(tokenInfo.token.symbol);
        });
        if (supportedTokens && supportedTokens.length > 0) {
          supportedTokens.forEach(tokenInfo => {
            if (poolBasedSupportedTokenSymbols.includes(tokenInfo.token.symbol)) {
              potentialTargetChainIds.add(chain.id);
            }
          });
        }
      });

      pegged_pair_configs.forEach(peggedPairConfig => {
        if (
          peggedPairConfig.org_chain_id === fromChain.id &&
          fromChainTokenSymbolWhiteList.includes(peggedPairConfig.org_token.token.symbol)
        ) {
          const peggedChainTokenSymbolWhiteList = getNetworkById(peggedPairConfig.pegged_chain_id).tokenSymbolList;
          if (peggedChainTokenSymbolWhiteList.includes(peggedPairConfig.pegged_token.token.symbol)) {
            potentialTargetChainIds.add(peggedPairConfig.pegged_chain_id);
          }
        } else if (
          peggedPairConfig.pegged_chain_id === fromChain.id &&
          fromChainTokenSymbolWhiteList.includes(peggedPairConfig.pegged_token.token.symbol)
        ) {
          const originChainTokenSymbolWhiteList = getNetworkById(peggedPairConfig.org_chain_id).tokenSymbolList;
          if (originChainTokenSymbolWhiteList.includes(peggedPairConfig.org_token.token.symbol)) {
            potentialTargetChainIds.add(peggedPairConfig.org_chain_id);
          }
        }
      });

      multiBurnConfigs.forEach(multiBurnConfig => {
        if (
          multiBurnConfig.burn_config_as_org.chain_id === fromChain.id &&
          fromChainTokenSymbolWhiteList.includes(multiBurnConfig.burn_config_as_org.token.token.symbol)
        ) {
          const peggedChainTokenSymbolWhiteList = getNetworkById(
            multiBurnConfig.burn_config_as_dst.chain_id,
          ).tokenSymbolList;
          if (peggedChainTokenSymbolWhiteList.includes(multiBurnConfig.burn_config_as_dst.token.token.symbol)) {
            potentialTargetChainIds.add(multiBurnConfig.burn_config_as_dst.chain_id);
          }
        }
      });

      const targetChains: Chain[] = [];

      potentialTargetChainIds.forEach(chainId => {
        const foundChains = chains.filter(chain => {
          return chain.id === chainId;
        });
        if (foundChains.length > 0) {
          targetChains.push(foundChains[0]);
        }
      });

      setChainList(targetChains);
    } else {
      /// User can select any transfer supported chain in chain white list as source chain
      setChainList(fromChainList);
    }
  }, [fromChain, fromChainList, useAsDestinationChain, transferConfig, multiBurnConfigs]);

  return chainList;
};

export const useTransferSupportedTokenList = (): TokenInfo[] => {
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, transferConfig, multiBurnConfigs } = transferInfo;
  const { chain_token, pegged_pair_configs } = transferConfig;

  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (fromChain && fromChain !== undefined) {
      const fromChainId = fromChain.id;
      const fromChainTokenSymbolWhiteList = getNetworkById(fromChainId).tokenSymbolList;
      const fromChainPoolBasedTokens = chain_token[fromChainId].token.filter(tokenInfo => {
        return !tokenInfo.token.xfer_disabled && fromChainTokenSymbolWhiteList.includes(tokenInfo.token.symbol);
      });

      if (toChain && toChain !== undefined) {
        const toChainId = toChain.id;

        const toChainTokenSymbolWhiteList = getNetworkById(toChainId).tokenSymbolList;

        const toChainPoolBasedTokenSymbol: string[] = chain_token[toChainId].token
          .filter(tokenInfo => {
            return !tokenInfo.token.xfer_disabled && toChainTokenSymbolWhiteList.includes(tokenInfo.token.symbol);
          })
          .map(tokenInfo => {
            return tokenInfo.token.symbol;
          });

        const multiBurnTokens: TokenInfo[] = [];
        multiBurnConfigs.forEach(burnConfig => {
          if (
            burnConfig.burn_config_as_org.chain_id === fromChainId &&
            burnConfig.burn_config_as_dst.chain_id === toChainId &&
            fromChainTokenSymbolWhiteList.includes(burnConfig.burn_config_as_org.token.token.symbol) &&
            toChainTokenSymbolWhiteList.includes(burnConfig.burn_config_as_dst.token.token.symbol)
          ) {
            multiBurnTokens.push(
              replaceTokenAddressForCanonicalTokenSwapIfNeeded(
                burnConfig.burn_config_as_org.token,
                burnConfig.burn_config_as_org.canonical_token_contract_addr,
              ),
            );
          }
        });

        const mintBurnTokens: TokenInfo[] = [];
        pegged_pair_configs.forEach(peggedPairConfig => {
          if (
            peggedPairConfig.org_chain_id === fromChainId &&
            peggedPairConfig.pegged_chain_id === toChainId &&
            fromChainTokenSymbolWhiteList.includes(peggedPairConfig.org_token.token.symbol) &&
            toChainTokenSymbolWhiteList.includes(peggedPairConfig.pegged_token.token.symbol)
          ) {
            /// Pegged Mint Mode
            mintBurnTokens.push(peggedPairConfig.org_token);
          } else if (
            peggedPairConfig.org_chain_id === toChainId &&
            peggedPairConfig.pegged_chain_id === fromChainId &&
            toChainTokenSymbolWhiteList.includes(peggedPairConfig.org_token.token.symbol) &&
            fromChainTokenSymbolWhiteList.includes(peggedPairConfig.pegged_token.token.symbol)
          ) {
            /// Pegged Burn Mode && Canonical Token Swap Mode
            /// If there is pegged pair config, it will not appear in multiBurn configs. No need to
            /// check whether this pegged token has been pushed into multiBurnTokens
            mintBurnTokens.push(
              replaceTokenAddressForCanonicalTokenSwapIfNeeded(
                peggedPairConfig.pegged_token,
                peggedPairConfig.canonical_token_contract_addr,
              ),
            );
          }
        });

        const peggedModeTokens = multiBurnTokens.concat(mintBurnTokens);

        const peggedModeTokenSymbols: string[] = peggedModeTokens.map(tokenInfo => {
          return tokenInfo.token.symbol;
        });

        /// To chain should support such token.
        /// Filter all tokens which have been set inside mintBurnTokens
        /// tokenInfo.token.display_symbol is used for ETH protection with mintBurn Filter
        const poolBasedTokens: TokenInfo[] = fromChainPoolBasedTokens.filter(tokenInfo => {
          return (
            toChainPoolBasedTokenSymbol.includes(tokenInfo.token.symbol) &&
            !peggedModeTokenSymbols.includes(tokenInfo.token.display_symbol ?? tokenInfo.token.symbol)
          );
        });

        const finalTokens = poolBasedTokens.concat(peggedModeTokens).filter(tokenInfo => {
          return fromChainTokenSymbolWhiteList.includes(tokenInfo.token.symbol);
        });

        setTokenList(finalTokens);
      } else {
        /// If there is no destination chain, token list should be empty
        setTokenList([]);
      }
    }
  }, [fromChain, toChain, chain_token, pegged_pair_configs, transferConfig, multiBurnConfigs]);

  return tokenList;
};

const replaceTokenAddressForCanonicalTokenSwapIfNeeded = (
  tokenInfo: TokenInfo,
  canonical_token_contract_addr: string,
) => {
  if (canonical_token_contract_addr.length > 0) {
    /// Canonical Token Swap, should use canonical_token_contract_addr
    const tempTokenInfo = tokenInfo;
    const tempToken: Token = {
      symbol: tempTokenInfo.token.symbol,
      address: canonical_token_contract_addr,
      decimal: tempTokenInfo.token.decimal,
      xfer_disabled: tempTokenInfo.token.xfer_disabled,
    };

    const result: TokenInfo = {
      token: tempToken,
      name: tempTokenInfo.name,
      icon: tempTokenInfo.icon,
      max_amt: tempTokenInfo.max_amt,
      balance: tempTokenInfo.balance,
    };

    return result;
  }

  return tokenInfo;
};

const twoChainBridged = (
  chainId1: number,
  chainId2: number,
  transferConfig: GetTransferConfigsResponse,
  multiBurnConfigs: MultiBurnPairConfig[],
) => {
  let peggedBridged = false;

  const chain1TokenWhiteListSymbol = getNetworkById(chainId1).tokenSymbolList;
  const chain2TokenWhiteListSymbol = getNetworkById(chainId2).tokenSymbolList;

  const burnConfig = multiBurnConfigs.find(multiBurnConfig => {
    return (
      (multiBurnConfig.burn_config_as_org.chain_id === chainId1 &&
        chain1TokenWhiteListSymbol.includes(multiBurnConfig.burn_config_as_org.token.token.symbol) &&
        multiBurnConfig.burn_config_as_dst.chain_id === chainId2 &&
        chain2TokenWhiteListSymbol.includes(multiBurnConfig.burn_config_as_dst.token.token.symbol)) ||
      (multiBurnConfig.burn_config_as_dst.chain_id === chainId1 &&
        chain1TokenWhiteListSymbol.includes(multiBurnConfig.burn_config_as_dst.token.token.symbol) &&
        multiBurnConfig.burn_config_as_org.chain_id === chainId2 &&
        chain2TokenWhiteListSymbol.includes(multiBurnConfig.burn_config_as_org.token.token.symbol))
    );
  });

  if (burnConfig) {
    return true;
  }

  transferConfig.pegged_pair_configs.forEach(peggedPairConfig => {
    const bridged =
      (peggedPairConfig.org_chain_id === chainId1 &&
        peggedPairConfig.pegged_chain_id === chainId2 &&
        chain1TokenWhiteListSymbol.includes(peggedPairConfig.org_token.token.symbol) &&
        chain2TokenWhiteListSymbol.includes(peggedPairConfig.pegged_token.token.symbol)) ||
      (peggedPairConfig.org_chain_id === chainId2 &&
        peggedPairConfig.pegged_chain_id === chainId1 &&
        chain2TokenWhiteListSymbol.includes(peggedPairConfig.pegged_token.token.symbol) &&
        chain1TokenWhiteListSymbol.includes(peggedPairConfig.org_token.token.symbol));
    peggedBridged = peggedBridged || bridged;
  });

  /// Skip pool based bridge check if two chains have pegged bridge
  if (peggedBridged) {
    return true;
  }

  const poolBasedTokensForChainId1 = transferConfig.chain_token[chainId1];
  const poolBasedTokensForChainId2 = transferConfig.chain_token[chainId2];

  let poolBasedBridged = false;
  if (
    poolBasedTokensForChainId1 &&
    poolBasedTokensForChainId1 !== undefined &&
    poolBasedTokensForChainId2 &&
    poolBasedTokensForChainId2 !== undefined
  ) {
    const poolBasedTokenSymbolsForChainId1: string[] = poolBasedTokensForChainId1.token
      .filter(tokenInfo => {
        return !tokenInfo.token.xfer_disabled && chain1TokenWhiteListSymbol.includes(tokenInfo.token.symbol);
      })
      .map(tokenInfo => {
        return tokenInfo.token.symbol;
      });
    poolBasedTokensForChainId2.token.forEach(tokenInfo => {
      poolBasedBridged =
        poolBasedBridged ||
        (poolBasedTokenSymbolsForChainId1.includes(tokenInfo.token.symbol) &&
          !tokenInfo.token.xfer_disabled &&
          chain2TokenWhiteListSymbol.includes(tokenInfo.token.symbol));
    });
  }
  return poolBasedBridged || peggedBridged;
};
