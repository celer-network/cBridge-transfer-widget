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
  factory: { new (signer: Signer): ContractFactory },
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof signerOrProvider !== "undefined" && factory && address) {
        try {
          const signer = await ensureSigner(signerOrProvider);
          if (!signer) {
            return;
          }
          /* eslint-disable-next-line new-cap */
          const customContract = new factory(signer).attach(address);
          setContract(customContract);
        } catch (e) {
          console.log("Error loading custom contract", e);
        }
      }
    }
    loadContract();
  }, [signerOrProvider, address, factory]);
  return contract;
}
