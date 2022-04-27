import * as fcl from "@onflow/fcl";
import { useWallet, WalletStatus, ConnectType, useConnectedWallet } from "@terra-money/wallet-provider";
import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from "react";
import { convertTerraToCanonicalAddress } from "../redux/NonEVMAPIs/terraAPIs";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setFromChain } from "../redux/transferSlice";

// eslint-disable-next-line
export enum NonEVMMode {
  off, // Both from and to chains are EVM
  flowTest,
  flowMainnet,
  terraTest,
  terraMainnet,
}

interface NonEVMContextProps {
  nonEVMMode: NonEVMMode;
  nonEVMAddress: string;
  nonEVMConnected: boolean;
  // eslint-disable-next-line
  flowUser: any;
  flowConnected: boolean;
  flowAddress: string;
  terraConnected: boolean;
  terraStationInstalled: boolean;
  terraAddress: string;
  loadNonEVMModal: (mode: NonEVMMode) => Promise<void>;
  logoutNonEVMModal: () => Promise<void>;
  setFlowInToChain: () => void;
}

export const NonEVMContext = createContext<NonEVMContextProps>({
  nonEVMMode: NonEVMMode.off,
  nonEVMAddress: "",
  nonEVMConnected: false,
  flowUser: {},
  flowConnected: false,
  flowAddress: "",
  terraConnected: false,
  terraStationInstalled: false,
  terraAddress: "",
  loadNonEVMModal: async (_: NonEVMMode) => {},
  logoutNonEVMModal: async () => {},
  setFlowInToChain: () => {},
});

interface NonEVMContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const NonEVMContextProvider = ({ children }: NonEVMContextProviderProps): JSX.Element => {
  const { fromChain, toChain, transferConfig } = useAppSelector(state => state.transferInfo);
  const [nonEVMMode, setNonEVMMode] = useState<NonEVMMode>(NonEVMMode.off);
  const [nonEVMAddress, setNonEVMAddress] = useState("");
  const [nonEVMConnected, setNonEVMConnected] = useState(false);

  const [flowUser, setFlowUser] = useState({});
  const [flowConnected, setFlowConnected] = useState(false);
  const [flowAddress, setFlowAddress] = useState("");
  const [shouldSwitchToFlow, setShouldSwitchToFlow] = useState(false);
  const [shouldLetFlowStayInToChain, setShouldLetFlowStayInToChain] = useState(false);

  const { status, wallets, connect, disconnect, availableInstallations, availableConnectTypes } = useWallet();
  const terraConnectedWallet = useConnectedWallet();
  const [terraStationInstalled, setTerraStationInstalled] = useState(false);
  const [terraConnected, setTerraConnected] = useState(false);
  const [terraAddress, setTerraAddress] = useState("");

  const dispatch = useAppDispatch();

  const loadNonEVMModal = useCallback(
    async (mode: NonEVMMode) => {
      if (mode === NonEVMMode.flowMainnet || mode === NonEVMMode.flowTest) {
        if (!flowConnected) {
          setShouldSwitchToFlow(true);
          fcl.authenticate();
        }
      } else if (mode === NonEVMMode.terraMainnet || mode === NonEVMMode.terraTest) {
        if (!terraConnected) {
          connect(ConnectType.EXTENSION);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flowConnected, terraConnected],
  );

  const logoutNonEVMModal = useCallback(async () => {
    if (nonEVMMode === NonEVMMode.flowMainnet || nonEVMMode === NonEVMMode.flowTest) {
      if (flowConnected) {
        fcl.unauthenticate();
      }
    } else if (nonEVMMode === NonEVMMode.terraMainnet || nonEVMMode === NonEVMMode.terraTest) {
      if (terraConnected) {
        disconnect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonEVMMode, flowConnected, terraConnected]);

  useEffect(() => {
    const fromChainMode = getNonEVMMode(fromChain?.id ?? 0);

    if (fromChainMode !== NonEVMMode.off) {
      setNonEVMMode(fromChainMode);
      return;
    }
    setNonEVMMode(getNonEVMMode(toChain?.id ?? 0));
  }, [fromChain, toChain]);

  useEffect(() => {
    if (nonEVMMode === NonEVMMode.off) {
      setNonEVMConnected(false);
      setNonEVMAddress("");
    } else if (nonEVMMode === NonEVMMode.flowMainnet || nonEVMMode === NonEVMMode.flowTest) {
      setNonEVMConnected(flowConnected);
      setNonEVMAddress(flowAddress);
    } else if (nonEVMMode === NonEVMMode.terraMainnet || nonEVMMode === NonEVMMode.terraTest) {
      setNonEVMConnected(terraConnected);
      setNonEVMAddress(terraAddress);
    } else {
      setNonEVMConnected(false);
      setNonEVMAddress("");
    }
  }, [nonEVMMode, flowConnected, flowAddress, terraConnected, terraAddress]);

  useEffect(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      setTerraConnected(true);
      if (terraConnectedWallet) {
        setTerraAddress(terraConnectedWallet.walletAddress);
      } else {
        setTerraAddress("");
      }
    } else {
      setTerraConnected(false);
      setTerraAddress("");
    }

    const terraExtension = availableConnectTypes.find(type => {
      return type === ConnectType.EXTENSION;
    });
    const stationWallet = availableInstallations.find(installation => {
      return installation.type === ConnectType.EXTENSION && installation.identifier.includes("station");
    });

    /// Extension available and install doesn't contain station
    setTerraStationInstalled(stationWallet === undefined && terraExtension !== undefined);
  }, [status, availableConnectTypes, availableInstallations, wallets, terraConnectedWallet]);

  useEffect(() => {
    /// FCL config

    if (process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV") {
      fcl
        .config()
        .put("accessNode.api", "https://access-testnet.onflow.org")
        .put("discovery.wallet", "https://flow-wallet-testnet.blocto.app/authn"); // mainent:https://flow-wallet.blocto.app/authn
    } else {
      fcl
        .config()
        .put("accessNode.api", "https://flow-mainnet.g.alchemy.com")
        .put("discovery.wallet", "https://flow-wallet.blocto.app/authn")
        // eslint-disable-next-line
        .put("grpc.metadata", { api_key: "u59zhmfnv7s2mcubk0ppbdyo1lomvnfc" });
    }

    fcl.currentUser().subscribe(user => {
      const { loggedIn, addr } = user;

      if (loggedIn && loggedIn !== undefined) {
        setFlowConnected(loggedIn);
        if (loggedIn === true) {
          const fromChainId = fromChain?.id ?? 0;
          if (shouldSwitchToFlow) {
            const targetChainIdForFlow = targetChainIdForNonEVMMode(
              process.env.REACT_APP_ENV === "TEST" || process.env.REACT_APP_ENV === "DEV"
                ? NonEVMMode.flowTest
                : NonEVMMode.flowMainnet,
            );
            if (fromChainId !== targetChainIdForFlow) {
              const chain = transferConfig.chains.find(chainInfo => {
                return chainInfo.id === targetChainIdForFlow;
              });
              if (chain !== undefined && !shouldLetFlowStayInToChain) {
                dispatch(setFromChain(chain));
              }
              setShouldLetFlowStayInToChain(false);
            }
          }
          setShouldSwitchToFlow(false);
        }
      } else {
        setFlowConnected(false);
      }
      if (addr && addr !== undefined) {
        setFlowAddress(addr);
      } else {
        setFlowAddress("");
      }
      setFlowUser({ ...user });
    });
  }, [fromChain, toChain, transferConfig, shouldSwitchToFlow, shouldLetFlowStayInToChain, dispatch]);

  const setFlowInToChain = () => {
    setShouldLetFlowStayInToChain(true);
  };

  return (
    <NonEVMContext.Provider
      value={{
        nonEVMMode,
        nonEVMAddress,
        nonEVMConnected,
        flowUser,
        flowConnected,
        flowAddress,
        terraConnected,
        terraStationInstalled,
        terraAddress,
        loadNonEVMModal,
        logoutNonEVMModal,
        setFlowInToChain,
      }}
    >
      {children}
    </NonEVMContext.Provider>
  );
};
export const useNonEVMContext: () => NonEVMContextProps = () => useContext(NonEVMContext);

export const isNonEVMChain = (chainId: number) => {
  return getNonEVMMode(chainId) !== NonEVMMode.off;
};

export const getNonEVMMode = (targetChainId: number) => {
  if (targetChainId === 12340001) {
    return NonEVMMode.flowMainnet;
  }

  if (targetChainId === 12340002) {
    return NonEVMMode.flowTest;
  }

  if (targetChainId === 999999998) {
    return NonEVMMode.terraMainnet;
  }

  if (targetChainId === 999999999) {
    return NonEVMMode.terraTest;
  }

  return NonEVMMode.off;
};

const targetChainIdForNonEVMMode = (mode: NonEVMMode) => {
  if (mode === NonEVMMode.flowMainnet) {
    return 12340001;
  }

  if (mode === NonEVMMode.flowTest) {
    return 12340002;
  }

  if (mode === NonEVMMode.terraMainnet) {
    return 999999998;
  }

  if (mode === NonEVMMode.terraTest) {
    return 999999999;
  }

  console.log("Unexpect code path for nonEVMMode", mode);
  return 0;
};

export const convertNonEVMAddressToEVMCompatible = async (address: string, mode: NonEVMMode) => {
  if (mode === NonEVMMode.flowMainnet || mode === NonEVMMode.flowTest) {
    const addressWithoutOx = address.toLowerCase().replace("0x", "");
    return "0x" + addressWithoutOx.padStart(40, "0");
  }

  if (mode === NonEVMMode.terraMainnet || mode === NonEVMMode.terraTest) {
    const canonicalAddress = await convertTerraToCanonicalAddress(address);
    return canonicalAddress;
  }

  return address;
};
