import { useEffect, useState } from "react";
import { Chain, TokenInfo } from "../constants/type";
import { useContractsContext } from "../providers/ContractsContextProvider";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { useEthBalance } from ".";

export const useNativeETHToken = (srcChain: Chain | undefined, tokenInfo: TokenInfo | undefined) => {
  const [isNativeToken, setIsNativeToken] = useState(false);
  const [tokenDisplayName, setTokenDisplayName] = useState(tokenInfo?.name ?? "");

  const {
    contracts: { bridge },
  } = useContractsContext();
  const { provider, address } = useWeb3Context();
  const [ETHBalance] = useEthBalance(provider, address);

  useEffect(() => {
    if (!srcChain || !tokenInfo || !bridge) {
      return;
    }
    const chainIds = [
      1, // ethereum
      42161, // arbitrum
      10, // Optimism
      5, // goerli
      288, // BOBA,
    ];
    let nativeETHToken = false;
    if (chainIds.includes(srcChain.id) && tokenInfo.token.display_symbol === "ETH") {
      nativeETHToken = true;
    } else if (srcChain.id === 56 && tokenInfo.token.symbol === "BNB") {
      nativeETHToken = true;
    } else if (srcChain.id === 43114 && tokenInfo.token.symbol === "AVAX") {
      nativeETHToken = true;
    } else if (srcChain.id === 250 && tokenInfo.token.symbol === "FTM") {
      nativeETHToken = true;
    } else if (srcChain.id === 336 && tokenInfo.token.symbol === "SDN") {
      nativeETHToken = true;
    } else if ((srcChain.id === 137 || srcChain.id === 80001) && tokenInfo.token.symbol === "MATIC") {
      nativeETHToken = true;
    } else if (srcChain.id === 57 && tokenInfo.token.symbol === "SYS") {
      nativeETHToken = true;
    } else if (srcChain.id === 592 && tokenInfo.token.symbol === "ASTR") {
      nativeETHToken = true;
    } else if (srcChain.id === 14000 && tokenInfo.token.symbol === "BAS") {
      nativeETHToken = true;
    } else if (srcChain.id === 117 && tokenInfo.token.symbol === "ARS") {
      nativeETHToken = true;
    } else if (srcChain.id === 15001 && tokenInfo.token.symbol === "BAS-MA") {
      nativeETHToken = true;
    } else if (srcChain.id === 230 && tokenInfo.token.symbol === "GAL") {
      nativeETHToken = true;
    } else if (srcChain.id === 231 && tokenInfo.token.symbol === "RNS") {
      nativeETHToken = true;
    } else if (srcChain.id === 232 && tokenInfo.token.symbol === "CUBE") {
      nativeETHToken = true;
    } else if (srcChain.id === 97 && tokenInfo.token.symbol === "BNB") {
      nativeETHToken = true;
    } else if (srcChain.id === 16350 && tokenInfo.token.symbol === "PEEL") {
      nativeETHToken = true;
    } else if (srcChain.id === 13000 && tokenInfo.token.symbol === "ECG") {
      nativeETHToken = true;
    }
    // else if (srcChain.id === 73771 && tokenInfo.token.symbol === "TUS") {
    //   nativeETHToken = true;
    // }

    setIsNativeToken(nativeETHToken);

    if (nativeETHToken && tokenInfo.token.display_symbol === "ETH") {
      setTokenDisplayName("Ethereum Token");
    } else {
      setTokenDisplayName(tokenInfo?.name ?? "");
    }
  }, [srcChain, tokenInfo, bridge]);

  return { isNativeToken, ETHBalance, tokenDisplayName };
};
