import { ContractFactory } from "ethers";
import { useEffect, useState } from "react";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";

import { ensureSigner } from "./contractLoader";

/**
 * Loads a custom contract.
 *
 * @param signerOrProvider A Signer or a Provider.
 * @param address The contract address.
 * @param factory The contract factory.
 * @returns The contract.
 */
export default function useCustomContractLoader(
  signerOrProvider: Signer | Provider | undefined,
  address: string | undefined,
  Factory: { new (signer: Signer): ContractFactory },
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof signerOrProvider !== "undefined" && Factory && address) {
        try {
          const signer = await ensureSigner(signerOrProvider);
          if (!signer) {
            return;
          }

          const customContract = new Factory(signer).attach(address);
          setContract(customContract);
        } catch (e) {
          console.log("Error loading custom contract", e);
        }
      }
    }
    loadContract();
  }, [signerOrProvider, address, Factory]);
  return contract;
}

export const loadContract = async (
  signerOrProvider: Signer | Provider | undefined,
  address: string | undefined,
  Factory: { new (signer: Signer): ContractFactory },
) => {
  if (typeof signerOrProvider !== "undefined" && Factory && address) {
    try {
      const signer = await ensureSigner(signerOrProvider);
      if (!signer) {
        return undefined;
      }

      return await new Factory(signer).attach(address);
    } catch (e) {
      console.log("Error loading custom contract", e);
    }
  }
  return undefined;
};
