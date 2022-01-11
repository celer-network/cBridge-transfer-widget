import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { UseBalanceReturn } from "./tokenBalance";

export default function useEthBalance(
  provider: JsonRpcProvider | undefined,
  address: string,
  timeout = 3000,
): UseBalanceReturn {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [reloadTrigger, reload] = useToggle(false);

  useEffect(() => {
    if (!provider || !address) {
      return;
    }

    const balancePromise = provider.getBalance(address);

    let timeoutTimer: NodeJS.Timeout;
    const timeoutPromise = new Promise<BigNumber>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new Error("ETH balance fetching timed out"));
      }, timeout);
    });

    setLoading(true);

    Promise.race([balancePromise, timeoutPromise])
      .then((bal: BigNumber) => {
        clearTimeout(timeoutTimer);
        setBalance(bal);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [provider, address, reloadTrigger, timeout]);

  useEffect(() => {
    if (error && retryCount < 3) {
      console.log("reloading balance, retry", retryCount);
      setRetryCount(retryCount + 1);
      reload();
    }
  }, [error, retryCount, reload]);

  return [balance, loading, error, reload];
}
