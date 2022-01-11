import { createContext, ReactChild, ReactChildren, useCallback, useContext } from "react";
import { getNetworkById } from "../constants/network";
import { useAppSelector } from "../redux/store";

/* eslint-disable*/

interface ConfigContextProps {
  getTokenByChainAndTokenSymbol: (chainId, tokenSymbol) => any;
  getContractAddrByChainId: (chainId) => any;
  getRpcUrlByChainId: (chainId) => any;
}

interface ConfigContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const ConfigContext = createContext<ConfigContextProps>({
  getTokenByChainAndTokenSymbol: () => {},
  getContractAddrByChainId: () => {},
  getRpcUrlByChainId: () => {},
});

export const ConfigContextProvider = ({ children }: ConfigContextProviderProps): JSX.Element => {
  const { config, transferInfo } = useAppSelector(state => state);
  const { transferConfig } = transferInfo;
  const { chains } = transferConfig;
  const getTokenByChainAndTokenSymbol = useCallback(
    (chainId, tokenSymbol) => {
      const resultToken = config?.config?.chain_token[chainId]?.token.find(
        tokenInfo => tokenInfo?.token?.symbol === tokenSymbol,
      );
      return resultToken;
    },
    [config],
  );

  const getContractAddrByChainId = useCallback(
    chainId => {
      const list = chains.filter(item => item.id === chainId);
      if (list.length > 0 && list[0].contract_addr) {
        const contractAddr = list[0].contract_addr;
        return contractAddr;
      }
    },
    [config],
  );

  const getRpcUrlByChainId = useCallback(
    chainId => {
      if (getNetworkById(chainId).rpcUrl) {
        const rpcUrl = getNetworkById(chainId).rpcUrl;
        return rpcUrl;
      }
    },
    [config],
  );

  return (
    <ConfigContext.Provider
      value={{
        getTokenByChainAndTokenSymbol,
        getContractAddrByChainId,
        getRpcUrlByChainId,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext: () => ConfigContextProps = () => useContext(ConfigContext);
