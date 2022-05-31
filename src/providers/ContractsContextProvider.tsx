import { ethers } from "ethers";
import { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";

import { transactorWithNotifier } from "../helpers";
import { Transactor } from "../helpers/transactorWithNotifier";
import { useContractLoader } from "../hooks/";
import { BridgeContracts, bridgeContracts } from "../hooks/contractLoader";
import { useAppSelector } from "../redux/store";
import { useWeb3Context } from "./Web3ContextProvider";
/* eslint-disable no-debugger */
interface ContractsContextProps {
  contracts: BridgeContracts;
  transactor: Transactor<ethers.ContractTransaction> | undefined;
}

interface ContractsContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const ContractsContext = createContext<ContractsContextProps>({
  contracts: bridgeContracts,
  transactor: undefined,
});

export const ContractsContextProvider = ({ children }: ContractsContextProviderProps): JSX.Element => {
  const { provider, chainId } = useWeb3Context();
  const [addresses, setAddresses] = useState<Record<string, string | undefined>>({});

  const {
    cBridgeAddresses,
    cBridgeDesAddresses,
    oTContractAddr,
    oTContractAddrV2,
    pTContractAddr,
    pTContractAddrV2,
    fraxContractAddr,
  } = useAppSelector(state => state.globalInfo);
  useEffect(() => {
    setAddresses({
      bridge: cBridgeAddresses,
      dstbridge: cBridgeDesAddresses,
      pool: cBridgeAddresses,
      originalTokenVault: oTContractAddr,
      originalTokenVaultV2: oTContractAddrV2,
      peggedTokenBridge: pTContractAddr,
      peggedTokenBridgeV2: pTContractAddrV2,
    });
  }, [
    cBridgeAddresses,
    cBridgeDesAddresses,
    chainId,
    oTContractAddr,
    oTContractAddrV2,
    pTContractAddr,
    pTContractAddrV2,
    fraxContractAddr,
  ]);

  const contracts = useContractLoader(provider, addresses);
  const transactor = transactorWithNotifier<ethers.ContractTransaction>(provider);

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export const useContractsContext: () => ContractsContextProps = () => useContext(ContractsContext);
