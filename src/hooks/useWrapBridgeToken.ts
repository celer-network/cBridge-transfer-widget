import { useMemo } from "react";
import { useAppSelector } from "../redux/store";

interface WrapBridgeTokens {
  wrapBridgeTokenAddr: string | undefined;
  canonicalTokenArr: string | undefined;
}

export function useWrapBridgeToken(selectedChainId: number, selectedTokenSymbol: string): WrapBridgeTokens {
  const { transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const pegConfigs = transferConfig.pegged_pair_configs;

  return useMemo(() => {
    if (!selectedChainId || !selectedTokenSymbol || !pegConfigs) {
      return { wrapBridgeTokenAddr: undefined, canonicalTokenArr: undefined };
    }

    const pegConfig = pegConfigs.find(
      it =>
        it.canonical_token_contract_addr &&
        it.pegged_chain_id === selectedChainId &&
        selectedTokenSymbol === it.pegged_token.token.symbol,
    );

    if (pegConfig) {
      const result: WrapBridgeTokens = {
        wrapBridgeTokenAddr: pegConfig.pegged_token.token.address,
        canonicalTokenArr: pegConfig.canonical_token_contract_addr,
      };
      return result;
    }

    return { wrapBridgeTokenAddr: undefined, canonicalTokenArr: undefined };
  }, [selectedChainId, selectedTokenSymbol, pegConfigs]);
}
