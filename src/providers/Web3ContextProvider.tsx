import { message } from "antd";
import { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from "react";
import { useAsync } from "react-use";

import Web3Modal from "@celer-network/web3modal";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers"; // InfuraProvider,
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getNetworkById, CHAIN_LIST } from "../constants/network"; // INFURA_ID
import { storageConstants } from "../constants/const";

const targetNetworkId = Number(process.env.REACT_APP_NETWORK_ID) || 3;

const sleep = ms => new Promise(r => setTimeout(r, ms));

export const rpcUrls = () => {
  const rpcMap = {};
  /* eslint-disable-next-line no-restricted-syntax */
  for (const network of CHAIN_LIST) {
    rpcMap[network.chainId] = network.rpcUrl;
  }
  return rpcMap;
};

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  network: "mainnet",
  providerOptions: {
    injected: {
      display: {
        // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        name: "Injected",
        description: "Connect with the provider in your Browser",
      },
      package: null,
    },
    // Example with WalletConnect provider
    walletconnect: {
      display: {
        // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        name: "Mobile",
        description: "Scan qrcode with your mobile wallet",
      },
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID, // required
        rpc: rpcUrls(),
      },
    },
  },
  theme: "dark",
});

interface Web3ContextProps {
  provider: JsonRpcProvider | undefined;
  signer: JsonRpcSigner | undefined;
  network: string;
  address: string;
  rpcUrl: string;
  chainId: number;
  web3Modal: Web3Modal;
  connecting: boolean;
  loadWeb3Modal: (providerName: string, catchMethod?: () => void) => Promise<void>;
  logoutOfWeb3Modal: () => Promise<void>;
}

interface Web3ContextProviderProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export const Web3Context = createContext<Web3ContextProps>({
  provider: undefined,
  signer: undefined,
  address: "",
  rpcUrl: "",
  network: getNetworkById(targetNetworkId).name,
  chainId: 0,
  web3Modal,
  connecting: false,
  loadWeb3Modal: async () => {},
  logoutOfWeb3Modal: async () => {},
});

export const Web3ContextProvider = ({ children }: Web3ContextProviderProps): JSX.Element => {
  const networkObject = getNetworkById(targetNetworkId);
  const [provider, setProvider] = useState<JsonRpcProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [network, setNetwork] = useState(networkObject.name);
  const [address, setAddress] = useState("");
  const [rpcUrl, setRpcUrl] = useState(networkObject.rpcUrl);
  const [chainId, setChainId] = useState(0);
  const [connectName, setConnectName] = useState("injected");
  const [connecting, setConnecting] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [web3Connection, setWeb3Connection] = useState<any>();

  useAsync(async () => {
    if (!web3Connection) {
      return;
    }
    web3Connection.on("accountsChanged", () => {
      window.location.reload();
    });
    web3Connection.on("chainChanged", () => {
      window.location.reload();
    });
    web3Connection.on("disconnect", () => {
      if (web3Modal.cachedProvider && web3Modal.cachedProvider === "walletconnect") {
        web3Modal.clearCachedProvider();
        window.location.reload();
      }
    });
  }, [web3Connection]);

  // useAsync(async () => {
  //   if (web3Modal.cachedProvider && localStorage.getItem("loginReload") === "false") {
  //     localStorage.setItem("loginReload", "true");
  //     window.location.reload();
  //   }
  //   if (!web3Modal.cachedProvider) {
  //     localStorage.setItem("loginReload", "false");
  //   }
  // }, [web3Modal.cachedProvider]);

  useAsync(async () => {
    if (!provider) {
      return;
    }

    const networkData = await provider.getNetwork();
    console.log("provider", provider, networkData);
    setChainId(networkData.chainId);
    setNetwork(networkData.name);
    const url = getNetworkById(networkData.chainId).rpcUrl;
    setRpcUrl(url);
  }, [provider]);

  const loadWeb3Modal = useCallback(async (providerName: string, catchMethod?: () => void) => {
    setConnecting(true);
    setConnectName(providerName);
    const cachedIsClover = localStorage.getItem(storageConstants.KEY_IS_CLOVER_WALLET) === "true";
    if (cachedIsClover) {
      await sleep(500);
    }

    const connection = await web3Modal.connectTo(providerName).catch(() => setConnecting(false));
    if (!connection) {
      if (catchMethod) {
        catchMethod();
      } else {
        message.error("connection failed!");
      }
      return;
    }
    setConnecting(false);
    setWeb3Connection(connection);
    const newProvider = new Web3Provider(connection);
    setProvider(newProvider);
    const newSigner = newProvider.getSigner();
    setSigner(newSigner);

    const walletAddress = await newSigner.getAddress();
    setAddress(walletAddress);
    localStorage.setItem(storageConstants.KEY_WEB3_PROVIDER_NAME, providerName);
  }, []);

  const logoutOfWeb3Modal = useCallback(async () => {
    if (web3Connection && web3Connection.close) {
      web3Connection.close();
    }
    web3Modal.clearCachedProvider();
    localStorage.setItem(storageConstants.KEY_TAB_KEY, "transfer");
    localStorage.removeItem(storageConstants.KEY_IS_CLOVER_WALLET);
    window.location.reload();
  }, [web3Connection]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal(web3Modal.cachedProvider);
    }
  }, [loadWeb3Modal, connectName]);

  // useEffect(() => {
  //   let infuraProvider: JsonRpcProvider | undefined;
  //   try {
  //     infuraProvider = new InfuraProvider(network, INFURA_ID);
  //   } catch (e) {
  //     // Ignored
  //   }
  //   setProvider(infuraProvider);
  // }, [network]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        network,
        address,
        rpcUrl,
        chainId,
        web3Modal,
        connecting,
        loadWeb3Modal,
        logoutOfWeb3Modal,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3ContextProps = () => useContext(Web3Context);
