import { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { PeggedChainMode, usePeggedPairConfig } from "./usePeggedPairConfig";
import { useCustomContractLoader } from ".";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { ERC20, ERC20__factory } from "../typechain/typechain";
import { isNonEVMChain } from "../providers/NonEVMContextProvider";

export const useMaxPeggedTokenAmount = (receiveAmount: number) => {
  const { provider } = useWeb3Context();
  const pegConfig = usePeggedPairConfig();
  const tokenAddress = isNonEVMChain(pegConfig.config.pegged_chain_id)
    ? ""
    : pegConfig.config.pegged_token?.token?.address;

  const tokenContract = useCustomContractLoader(provider, tokenAddress, ERC20__factory) as ERC20 | undefined;
  const [maxPeggedTokenAmount, setMaxPeggedTokenAmount] = useState<BigNumber | undefined>(undefined);

  useEffect(() => {
    if (receiveAmount <= 0) {
      setMaxPeggedTokenAmount(undefined);
      return;
    }
    if (pegConfig.mode === PeggedChainMode.BurnThenSwap) {
      if (!tokenAddress) {
        setMaxPeggedTokenAmount(undefined);
        return;
      }
      const getTotalSupply = async () => {
        const maxAmount = await tokenContract?.totalSupply();
        if (maxAmount !== undefined) {
          setMaxPeggedTokenAmount(maxAmount);
        }
      };
      getTotalSupply();
    } else {
      setMaxPeggedTokenAmount(undefined);
    }
  }, [pegConfig.mode, receiveAmount, tokenAddress, tokenContract]);

  return { maxPeggedTokenAmount, setMaxPeggedTokenAmount };
};
