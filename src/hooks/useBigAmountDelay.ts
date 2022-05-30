import { useCallback, useEffect, useMemo, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";

import { useReadOnlyCustomContractLoader } from ".";
import { Bridge, Bridge__factory } from "../typechain/typechain";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { formatDecimal } from "../helpers/format";
import { CHAIN_LIST } from "../constants/network";
import { setBigAmountDelayInfos, BigAmountDelayInfo } from "../redux/transferSlice";
import { Token, Chain } from "../constants/type";
import { PeggedChainMode, usePeggedPairConfig } from "./usePeggedPairConfig";
import { OriginalTokenVault__factory } from "../typechain/typechain/factories/OriginalTokenVault__factory";
import { PeggedTokenBridge__factory } from "../typechain/typechain/factories/PeggedTokenBridge__factory";
import { OriginalTokenVaultV2__factory } from "../typechain/typechain/factories/OriginalTokenVaultV2__factory";
import { PeggedTokenBridgeV2__factory } from "../typechain/typechain/factories/PeggedTokenBridgeV2__factory";
import { isNonEVMChain } from "../providers/NonEVMContextProvider";

export const useBigAmountDelay = (
  chain: Chain | undefined,
  token: Token | undefined,
  amount: number,
  hasEpochVolumeCaps = false,
  epochVolumeCaps?: BigNumber,
) => {
  const dispatch = useAppDispatch();
  const { transferInfo } = useAppSelector(state => state);
  const [isBigAmountDelayed, setIsBigAmountDelayed] = useState(false);
  const [delayThresholds, setDelayThresholds] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("0");
  const { transferConfig, bigAmountDelayInfos } = transferInfo;
  const chainValues = CHAIN_LIST;
  const toChainValue = chainValues.find(it => {
    return it.chainId === chain?.id ?? "";
  });
  const rpcUrl = toChainValue?.rpcUrl ?? "";
  const provider = useMemo(() => {
    return rpcUrl.length > 0 ? new JsonRpcProvider(rpcUrl) : undefined;
  }, [rpcUrl]);
  const pegConfig = usePeggedPairConfig();
  const contractAddress = (() => {
    if (isNonEVMChain(chain?.id ?? 0)) {
      return "";
    }
    switch (pegConfig.mode) {
      case PeggedChainMode.Deposit:
        if (isNonEVMChain(pegConfig.config.pegged_chain_id)) {
          return "";
        }
        return pegConfig.config.pegged_burn_contract_addr;
      case PeggedChainMode.Burn:
        if (isNonEVMChain(pegConfig.config.org_chain_id)) {
          return "";
        }
        return pegConfig.config.pegged_deposit_contract_addr;
      default:
        return chain?.contract_addr ?? "";
    }
  })();

  const dstBridge = useReadOnlyCustomContractLoader(provider, contractAddress, Bridge__factory) as Bridge | undefined;
  const originalTokenVault = useReadOnlyCustomContractLoader(
    provider,
    contractAddress,
    pegConfig.config.vault_version > 0 ? OriginalTokenVaultV2__factory : OriginalTokenVault__factory,
  );
  const peggedTokenBridge = useReadOnlyCustomContractLoader(
    provider,
    contractAddress,
    pegConfig.config.bridge_version > 0 ? PeggedTokenBridgeV2__factory : PeggedTokenBridge__factory,
  );

  const bridge = (() => {
    switch (pegConfig.mode) {
      case PeggedChainMode.Deposit:
        return peggedTokenBridge;
      case PeggedChainMode.Burn:
        return originalTokenVault;
      default:
        return dstBridge;
    }
  })();

  const getToken = useCallback(() => {
    switch (pegConfig.mode) {
      case PeggedChainMode.Deposit:
        return pegConfig.config.pegged_token.token;
      case PeggedChainMode.Burn:
        return pegConfig.config.org_token.token;
      default: {
        const tokens = transferConfig?.chain_token[chain?.id ?? 0]?.token;
        const currentToken = tokens?.find(it => it.token.symbol === token?.symbol);
        return currentToken?.token;
      }
    }
  }, [chain?.id, token, transferConfig?.chain_token, pegConfig]);

  const setValues = useCallback(
    (delayInfo: BigAmountDelayInfo, tokenValue: Token) => {
      setDelayMinutes(BigNumber.from(delayInfo.period).div(60).add(10).toString());
      const thresholds = BigNumber.from(delayInfo.thresholds);
      const thresholdsAmount = formatDecimal(thresholds, tokenValue?.decimal);
      setDelayThresholds(thresholdsAmount);
      const bigAmount = parseUnits(amount.toFixed(6).toString(), tokenValue?.decimal);
      setIsBigAmountDelayed(
        bigAmount.gte(thresholds) && bigAmount.gt(BigNumber.from(0)) && thresholds.gt(BigNumber.from(0)),
      );
    },
    [amount],
  );

  useEffect(() => {
    const tokenValue = getToken();
    if (hasEpochVolumeCaps && epochVolumeCaps === undefined) {
      setIsBigAmountDelayed(false);
      return;
    }
    if (bridge === undefined || tokenValue?.address === undefined) {
      setIsBigAmountDelayed(false);
      return;
    }
    const delayInfo = bigAmountDelayInfos.find(item => {
      return (
        item.rpcUrl === rpcUrl && item.contractAddress === contractAddress && item.tokenAddress === tokenValue.address
      );
    });
    if (delayInfo !== undefined) {
      setValues(delayInfo, tokenValue);
      return;
    }

    function isHex(hexString) {
      return Boolean(hexString.match(/^0x[0-9a-f]+$/i));
    }

    (async () => {
      setIsBigAmountDelayed(false);
      const tokenAddress = tokenValue?.address ?? "";
      if (!tokenAddress || !isHex(tokenAddress)) {
        return;
      }
      try {
        const period = await bridge.delayPeriod();
        const thresholds = await bridge.delayThresholds(tokenAddress);
        const info: BigAmountDelayInfo = {
          rpcUrl,
          contractAddress,
          tokenAddress,
          period: period.toHexString(),
          thresholds: thresholds.toHexString(),
        };
        setValues(info, tokenValue);
        if (!bigAmountDelayInfos.includes(info)) {
          const newBigAmountDelayInfos = [...bigAmountDelayInfos, info];
          dispatch(setBigAmountDelayInfos(newBigAmountDelayInfos));
        }
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, token?.address, hasEpochVolumeCaps, epochVolumeCaps, amount]);

  return { isBigAmountDelayed, delayMinutes, delayThresholds, amount };
};
