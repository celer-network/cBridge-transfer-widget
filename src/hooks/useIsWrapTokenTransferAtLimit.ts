import { JsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { getNetworkById } from "../constants/network";
import { Chain, TokenInfo } from "../constants/type";
import { useAppSelector } from "../redux/store";
import { ERC20, ERC20__factory } from "../typechain/typechain";
import { readOnlyContract } from "./customReadyOnlyContractLoader";

export interface WrapTokenCaps {
  totalLiquidity: string;
  decimal: number;
  tokenSymbol: string;
}

export function useIsWrapTokenTransferAtLimit(
  srcChain: Chain | undefined,
  dstChain: Chain | undefined,
  selectedToken: TokenInfo | undefined,
): { onWrapTokenLiquidityCallback: null | (() => Promise<WrapTokenCaps | undefined>) } {
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const pegConfigs = transferConfig.pegged_pair_configs;

  return useMemo(() => {
    if (!srcChain || !dstChain || !selectedToken || !transferConfig || !pegConfigs) {
      return { onWrapTokenLiquidityCallback: null };
    }

    return {
      onWrapTokenLiquidityCallback: async () => {
        try {
          if (
            (srcChain.id === 12340002 && dstChain.id === 80001 && selectedToken.token.symbol === "FLOWUSDC") ||
            (srcChain.id === 12340001 && dstChain.id === 1 && selectedToken.token.symbol === "cfUSDC")
          ) {
            const pegConfig = pegConfigs.find(
              it =>
                it.canonical_token_contract_addr &&
                it.pegged_chain_id === dstChain.id &&
                it.pegged_token.token.symbol === selectedToken.token.symbol,
            );

            if (pegConfig) {
              const rpcURL = getNetworkById(dstChain.id).rpcUrl;
              const provider = new JsonRpcProvider(rpcURL);
              const canonicalTokenContract = (await readOnlyContract(
                provider,
                pegConfig.canonical_token_contract_addr,
                ERC20__factory,
              )) as ERC20;

              const totalTokenBalance = await canonicalTokenContract.balanceOf(pegConfig.pegged_token.token.address);
              const wrapTokenCaps: WrapTokenCaps = {
                totalLiquidity: totalTokenBalance.toString(),
                decimal: pegConfig.pegged_token.token.decimal,
                tokenSymbol: pegConfig.pegged_token.token.symbol,
              };
              return wrapTokenCaps;
            }
          }
        } catch (e) {
          console.error(e);
          return undefined;
        }

        return undefined;
      },
    };
  }, [srcChain, dstChain, selectedToken, pegConfigs, transferConfig]);
}
