/* eslint-disable camelcase */
import { useEffect, useState } from "react";
import { PeggedPairConfig } from "../constants/type";
import { setOTContractAddr, setPTContractAddr } from "../redux/globalInfoSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

// eslint-disable-next-line no-shadow
export enum PeggedChainMode {
  Off,
  Deposit,
  Burn,
  BurnThenSwap,
}

export class PeggedPair {
  mode: PeggedChainMode;

  config: PeggedPairConfig;

  constructor(mode: PeggedChainMode, config: PeggedPairConfig) {
    this.mode = mode;
    this.config = config;
  }

  /**
   * to get the target token address for getting user interface balance
   *
   * if the transfer mode is mint & swap, user get the final token must be canonical token. so the balance is get via the canonical token address.
   * for example there is a mint flow, FRAX(Ethereum Mainnet) -> mint -> CelrFRAX(mint token) -> swap -> FRAX(BSC)
   * On BSC user just can see the FRAX instead of CelrFRAX, that is canonical token.
   *
   * @param originalAddress
   * @param fromChainId
   * @param tokenSymbol
   * @param peggedPairs
   * @returns
   */
  getTokenBalanceAddress = (
    originalAddress: string,
    fromChainId: number | undefined = undefined,
    tokenSymbol: string | undefined = undefined,
    peggedPairs: Array<PeggedPairConfig> | undefined = undefined,
  ) => {
    if (!fromChainId || !tokenSymbol || !peggedPairs) {
      return originalAddress;
    }

    const peggedTokens = peggedPairs?.filter(item => {
      return item.pegged_chain_id === fromChainId && tokenSymbol === item.pegged_token.token.symbol;
    });

    if (peggedTokens && peggedTokens.length > 0 && peggedTokens[0].canonical_token_contract_addr.length > 0) {
      return peggedTokens[0].canonical_token_contract_addr;
    }

    return originalAddress;
  };

  getHistoryTokenBalanceAddress = (
    originalAddress: string,
    fromChainId: number | undefined = undefined,
    toChainId: number | undefined = undefined,
    tokenSymbol: string | undefined = undefined,
    peggedPairs: Array<PeggedPairConfig> | undefined = undefined,
  ) => {
    if (!fromChainId || !toChainId || !tokenSymbol || !peggedPairs) {
      return originalAddress;
    }

    if (PeggedChainMode.Off === GetPeggedMode(fromChainId, toChainId, tokenSymbol, peggedPairs)) {
      return originalAddress;
    }

    // peg mode
    const selectedPegConfig = peggedPairs.filter(item => {
      const isMintMode =
        item.org_chain_id === fromChainId &&
        item.pegged_chain_id === toChainId &&
        item.pegged_token.token.symbol === tokenSymbol;
      return isMintMode;
    });

    if (selectedPegConfig.length > 0 && selectedPegConfig[0].canonical_token_contract_addr.length > 0) {
      return selectedPegConfig[0].canonical_token_contract_addr;
    }

    return originalAddress;
  };

  getSpenderAddress() {
    switch (this.mode) {
      case PeggedChainMode.Deposit:
        return this.config.pegged_deposit_contract_addr;
      case PeggedChainMode.Burn:
        return this.config.pegged_burn_contract_addr;
      case PeggedChainMode.BurnThenSwap:
        return this.config.pegged_token.token.address;
      default:
        return "";
    }
  }
}

export const usePeggedPairConfig = (): PeggedPair => {
  const { transferInfo } = useAppSelector(state => state);
  const { fromChain, toChain, selectedToken } = transferInfo;
  const pegged_pair_configs = transferInfo.transferConfig.pegged_pair_configs;
  const [peggedPair, setPeggedPair] = useState<PeggedPair>(new PeggedPair(PeggedChainMode.Off, {} as PeggedPairConfig));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!pegged_pair_configs || pegged_pair_configs === undefined) {
      return;
    }
    const pair = getPeggedPairConfigs(pegged_pair_configs, fromChain, toChain, selectedToken, dispatch);
    setPeggedPair(pair);
  }, [fromChain, toChain, selectedToken, pegged_pair_configs, dispatch]);

  return peggedPair;
};

export const GetPeggedMode = (
  fromChainId: number | undefined,
  toChainId: number | undefined,
  tokenSymbol: string,
  pegged_pair_configs: Array<PeggedPairConfig>,
) => {
  if (!fromChainId || !toChainId) {
    return tokenSymbol;
  }
  const depositConfigs = pegged_pair_configs.filter(
    e => e.org_chain_id === fromChainId && e.pegged_chain_id === toChainId && e.org_token.token.symbol === tokenSymbol,
  );
  const burnConfigs = pegged_pair_configs.filter(
    e => e.org_chain_id === toChainId && e.pegged_chain_id === fromChainId && e.org_token.token.symbol === tokenSymbol,
  );

  if (depositConfigs.length > 0) {
    return PeggedChainMode.Deposit;
  }

  if (burnConfigs.length > 0) {
    return PeggedChainMode.Burn;
  }

  return PeggedChainMode.Off;
};

export const getPeggedPairConfigs = (pegged_pair_configs, fromChain, toChain, selectedToken, dispatch) => {
  const depositConfigs = pegged_pair_configs.filter(
    e =>
      e.org_chain_id === fromChain?.id &&
      e.pegged_chain_id === toChain?.id &&
      e.org_token.token.symbol === selectedToken?.token.symbol,
  );
  const burnConfigs = pegged_pair_configs.filter(
    e =>
      e.org_chain_id === toChain?.id &&
      e.pegged_chain_id === fromChain?.id &&
      e.org_token.token.symbol === selectedToken?.token.symbol,
  );
  if (depositConfigs.length > 0) {
    dispatch(setOTContractAddr(depositConfigs[0].pegged_deposit_contract_addr));
    return new PeggedPair(PeggedChainMode.Deposit, depositConfigs[0]);
  }
  if (burnConfigs.length > 0) {
    dispatch(setPTContractAddr(burnConfigs[0].pegged_burn_contract_addr));
    if (burnConfigs[0].canonical_token_contract_addr.length > 0) {
      return new PeggedPair(PeggedChainMode.BurnThenSwap, burnConfigs[0]);
    }
    return new PeggedPair(PeggedChainMode.Burn, burnConfigs[0]);
  }
  return new PeggedPair(PeggedChainMode.Off, {} as PeggedPairConfig);
};
