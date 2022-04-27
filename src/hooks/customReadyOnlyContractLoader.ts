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
  factory: { connect(addressParameter: string, signerOrProviderParameter: Signer | Provider): Contract },
): Contract | undefined {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof signerOrProvider !== "undefined" && factory && address) {
        try {
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

export const readOnlyContract = async (
  signerOrJsonRpcProvider: Signer | Provider | undefined,
  contractAddress: string,
  factory: {
    // eslint-disable-next-line
    connect(address: string, signerOrProvider: Signer | Provider): Contract;
  },
) => {
  if (typeof signerOrJsonRpcProvider !== "undefined" && factory && contractAddress) {
    const customContract = await factory.connect(contractAddress, signerOrJsonRpcProvider);
    return customContract;
  }
  return undefined;
};
