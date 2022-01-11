/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { getNetworkById } from "../constants/network";
import { TokenInfo } from "../constants/type";
import { useAppSelector } from "../redux/store";

export const useMergedTokenList = (): TokenInfo[] => {
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, transferConfig } = transferInfo;
  const { chain_token, pegged_pair_configs } = transferConfig;

  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  useEffect(() => {
    const mintTokens = pegged_pair_configs
      .filter(config => config.org_chain_id === fromChain?.id || config.pegged_chain_id === fromChain?.id)
      .map(config => {
        if (config.org_chain_id === fromChain?.id) {
          return config.org_token;
        }
        return config.pegged_token;
      });

    if (fromChain && fromChain !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chainId = fromChain?.id;
      const originTokens = chain_token[chainId].token;
      const allTokens = originTokens.concat(mintTokens);
      const seen = {};
      const mergedTokens = allTokens.filter(token => {
        const key = token.token.display_symbol ?? token.token.symbol;
        if (token.token.xfer_disabled || seen[key] === 1) {
          return false;
        }
        seen[key] = 1;
        return true;
      });
      const tokenSymbolList = getNetworkById(chainId).tokenSymbolList;
      const filteredTokens = mergedTokens.filter(item => {
        const isShowToken = !item.token.xfer_disabled;
        const isWhiteList = tokenSymbolList.includes(item.token.symbol);
        return isShowToken && isWhiteList;
      });
      setTokenList(filteredTokens);
    }
  }, [fromChain, toChain, chain_token, pegged_pair_configs]);

  return tokenList;
};
