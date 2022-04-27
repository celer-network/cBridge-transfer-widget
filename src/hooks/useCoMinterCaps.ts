import { useMemo } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkById } from "../constants/network";
import { CoMinterCap } from "../constants/type";
import { UpgradeableERC20__factory } from "../typechain/typechain/conflux/UpgradeableERC20__factory";
import { readOnlyContract } from "./customReadyOnlyContractLoader";
import { UpgradeableERC20 } from "../typechain/typechain/conflux/UpgradeableERC20";
import { BridgedERC20__factory } from "../typechain/typechain/REI/BridgedERC20__factory";
import { BridgedERC20 } from "../typechain/typechain/REI/BridgedERC20";

export function useCoMinterCaps(
  tokenAddress: string | undefined,
  burnBridgeContractAddress: string | undefined,
  chainId: number | undefined,
): { coMinterCapCallback: null | (() => Promise<CoMinterCap | undefined>) } {
  return useMemo(() => {
    if (!tokenAddress || !burnBridgeContractAddress || !chainId) {
      return { coMinterCapCallback: null };
    }
    return {
      coMinterCapCallback: async function onBurnCaps(): Promise<CoMinterCap | undefined> {
        const rpcUrl = getNetworkById(chainId)?.rpcUrl;

        if (!rpcUrl) {
          return undefined;
        }

        if (chainId === 1030) {
          // conflux
          const confluxTokenContract = (await readOnlyContract(
            new JsonRpcProvider(rpcUrl),
            tokenAddress,
            UpgradeableERC20__factory,
          )) as UpgradeableERC20;
          const minterSupply = await confluxTokenContract.minterSupply(burnBridgeContractAddress);
          const { cap, total } = minterSupply;
          return { minterCap: cap, minterSupply: total };
        }
        if (chainId === 47805) {
          // REI
          const tokenContract = (await readOnlyContract(
            new JsonRpcProvider(rpcUrl),
            tokenAddress,
            BridgedERC20__factory,
          )) as BridgedERC20;
          const minterSupply = await tokenContract.minterSupply(burnBridgeContractAddress);
          const { cap, total } = minterSupply;
          return { minterCap: cap, minterSupply: total };
        }
        return undefined;
      },
    };
  }, [tokenAddress, burnBridgeContractAddress, chainId]);
}
