import { useEffect, useState } from "react";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";

/**
 * Loads a custom contract in read-only mode.
 *
 * @param signerOrProvider A Signer or a Provider.
 * @param address The contract address.
 * @param factory The contract factory.
 * @returns The contract.
 */
export default function useReadOnlyCustomContractLoader(
  signerOrProvider: Signer | Provider | undefined,
  address: string,
  /* eslint-disable-next-line no-shadow */
  factory: { connect(address: string, signerOrProvider: Signer | Provider): Contract },
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof signerOrProvider !== "undefined" && factory && address) {
        try {
          /* eslint-disable-next-line new-cap */
          const customContract = factory.connect(address, signerOrProvider);
          setContract(customContract);
        } catch (e) {
          console.log("Error loading custom contract", e);
        }
      }
    }
    loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  return contract;
}
