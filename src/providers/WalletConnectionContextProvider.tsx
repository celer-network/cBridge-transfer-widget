import { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import { useWeb3Context } from "./Web3ContextProvider";
import { useNonEVMContext, getNonEVMMode, NonEVMMode } from "./NonEVMContextProvider";
import { useAppSelector } from "../redux/store";

interface WalletConnectionContextProps {
  walletAddress: string;
  connected: boolean;
  walletConnectionButtonTitle: string;
}

export const WalletConnectionContext = createContext<WalletConnectionContextProps>({
  walletAddress: "",
  connected: false,
  walletConnectionButtonTitle: "Connect Wallet",
});

interface WalletConnectionContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const WalletConnectionContextProvider = ({ children }: WalletConnectionContextProviderProps): JSX.Element => {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [walletConnectionButtonTitle, setWalletConnectionButtonTitle] = useState("Connect Wallet");
  const { fromChain } = useAppSelector(state => state.transferInfo);
  const { signer, address } = useWeb3Context();
  const { nonEVMAddress, nonEVMConnected } = useNonEVMContext();

  useEffect(() => {
    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    if (fromChainNonEVMMode === NonEVMMode.flowMainnet || fromChainNonEVMMode === NonEVMMode.flowTest) {
      setConnected(nonEVMConnected);
      setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
      setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Flow Wallet");
    } else if (fromChainNonEVMMode === NonEVMMode.terraMainnet || fromChainNonEVMMode === NonEVMMode.terraTest) {
      setConnected(nonEVMConnected);
      setWalletAddress(nonEVMConnected ? nonEVMAddress : "");
      setWalletConnectionButtonTitle(nonEVMConnected ? "" : "Connect Terra Wallet");
    } else if (signer) {
      setConnected(true);
      setWalletAddress(address);
      setWalletConnectionButtonTitle("");
    } else {
      setWalletAddress("");
      setConnected(false);
      setWalletConnectionButtonTitle("Connect Wallet");
    }
  }, [signer, address, nonEVMAddress, nonEVMConnected, fromChain]);

  return (
    <WalletConnectionContext.Provider
      value={{
        walletAddress,
        connected,
        walletConnectionButtonTitle,
      }}
    >
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnectionContext: () => WalletConnectionContextProps = () => useContext(WalletConnectionContext);
