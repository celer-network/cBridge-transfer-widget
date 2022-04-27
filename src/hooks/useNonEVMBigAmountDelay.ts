import { safeParseUnits } from "celer-web-utils/lib/format";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { formatDecimal } from "../helpers/format";
import { NonEVMMode, useNonEVMContext, getNonEVMMode } from "../providers/NonEVMContextProvider";
import { burnConfigFromFlow, depositConfigFromFlow, getFlowDelayPeriodInMinute } from "../redux/NonEVMAPIs/flowAPIs";
import { queryTerraDelayPeriod, queryTerraDelayThreshold } from "../redux/NonEVMAPIs/terraAPIs";
import { useAppSelector } from "../redux/store";

export const useNonEVMBigAmountDelay = (amount: number) => {
  const { transferInfo } = useAppSelector(state => state);
  const { nonEVMMode } = useNonEVMContext();
  const { fromChain, toChain, selectedToken, transferConfig } = transferInfo;
  const [nonEVMBigAmountDelayed, setNonEVMBigAmountDelayed] = useState(false);
  const [nonEVMDelayThreshold, setNonEVMDelayThreshold] = useState("");
  const [nonEVMDelayTimeInMinute, setNonEVMDelayTimeInMinute] = useState("0");

  useEffect(() => {
    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    if (amount <= 0) {
      setNonEVMBigAmountDelayed(false);
      setNonEVMDelayThreshold("");
      setNonEVMDelayTimeInMinute("0");
      return;
    }
    if (toChainNonEVMMode === NonEVMMode.off) {
      setNonEVMBigAmountDelayed(false);
      setNonEVMDelayThreshold("");
      setNonEVMDelayTimeInMinute("0");
      return;
    }

    const targetPegConfig = transferConfig.pegged_pair_configs.find(peggedPairConfig => {
      return (
        (peggedPairConfig.org_chain_id === fromChain?.id &&
          peggedPairConfig.pegged_chain_id === toChain?.id &&
          peggedPairConfig.org_token.token.symbol === selectedToken?.token.symbol) ||
        (peggedPairConfig.pegged_chain_id === fromChain?.id &&
          peggedPairConfig.org_chain_id === toChain?.id &&
          peggedPairConfig.pegged_token.token.symbol === selectedToken?.token.symbol)
      );
    });

    if (!targetPegConfig) {
      setNonEVMBigAmountDelayed(false);
      setNonEVMDelayThreshold("");
      setNonEVMDelayTimeInMinute("0");
      return;
    }

    (async () => {
      if (nonEVMMode === NonEVMMode.flowTest || nonEVMMode === NonEVMMode.flowMainnet) {
        let delayThreshold = 0;
        let delayPeriod = 0;
        if (targetPegConfig.org_chain_id === toChain?.id) {
          /// EVM burn ---> Flow withdraw
          delayThreshold = (
            await depositConfigFromFlow(
              targetPegConfig.pegged_deposit_contract_addr,
              targetPegConfig.org_token.token.address,
            )
          ).delayThreshold;
          delayPeriod = await getFlowDelayPeriodInMinute(targetPegConfig.pegged_deposit_contract_addr);
        } else if (targetPegConfig.pegged_chain_id === toChain?.id) {
          /// EVM deposit ---> Flow mint
          delayThreshold = (
            await burnConfigFromFlow(
              targetPegConfig.pegged_burn_contract_addr,
              targetPegConfig.pegged_token.token.address,
            )
          ).delayThreshold;
          delayPeriod = await getFlowDelayPeriodInMinute(targetPegConfig.pegged_burn_contract_addr);
        }

        setNonEVMDelayThreshold(Number(delayThreshold).toFixed());
        setNonEVMDelayTimeInMinute((delayPeriod + 10).toFixed(0));
        setNonEVMBigAmountDelayed(amount >= delayThreshold && delayThreshold > 0);
      }

      if (nonEVMMode === NonEVMMode.terraTest || nonEVMMode === NonEVMMode.terraMainnet) {
        let contractAddress = "";
        let tokenAddress = "";
        if (targetPegConfig?.org_chain_id === toChain?.id) {
          contractAddress = targetPegConfig?.pegged_deposit_contract_addr ?? "";
          tokenAddress = targetPegConfig?.org_token?.token.address ?? "";
        } else if (targetPegConfig?.pegged_chain_id === toChain?.id) {
          contractAddress = targetPegConfig?.pegged_burn_contract_addr ?? "";
          tokenAddress = targetPegConfig?.pegged_token?.token.address ?? "";
        }
        const delayPeriod = await queryTerraDelayPeriod(contractAddress);
        const delayThreshold = await queryTerraDelayThreshold(contractAddress, tokenAddress);
        const delayThresholdInBigNumber = BigNumber.from(delayThreshold);
        const amountInBigNumber = safeParseUnits(amount.toString() || "0", selectedToken?.token?.decimal ?? 18);

        setNonEVMDelayThreshold(formatDecimal(delayThresholdInBigNumber, selectedToken?.token?.decimal ?? 18));
        setNonEVMDelayTimeInMinute((Number(delayPeriod) + 10).toString());
        setNonEVMBigAmountDelayed(amountInBigNumber.gte(delayThresholdInBigNumber) && delayThresholdInBigNumber.gt(0));
      }
    })();
  }, [nonEVMMode, selectedToken, transferConfig, fromChain, toChain, amount]);

  return { nonEVMBigAmountDelayed, nonEVMDelayThreshold, nonEVMDelayTimeInMinute };
};
